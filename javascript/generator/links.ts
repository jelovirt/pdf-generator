'use strict';

import _ from 'lodash';
import {Comment, Element, SubElement} from './elementtree';
import {copy_xml, xsl} from './utils';
import Generator from './index';

export function generate_custom(root: Element, conf: Generator) {
  const link_raw = `
  <xsl:template match="*[contains(@class,' topic/xref ')]" name="topic.xref">
    <fo:inline>
      <xsl:call-template name="commonattributes"/>
    </fo:inline>
    <xsl:variable name="destination" select="opentopic-func:getDestinationId(@href)"/>
    <xsl:variable name="element" select="key('key_anchor',$destination)[1]"/>
    <xsl:variable name="referenceTitle">
      <xsl:apply-templates select="." mode="insertReferenceTitle">
        <xsl:with-param name="href" select="@href"/>
        <xsl:with-param name="titlePrefix" select="''"/>
        <xsl:with-param name="destination" select="$destination"/>
        <xsl:with-param name="element" select="$element"/>
      </xsl:apply-templates>
    </xsl:variable>
    <fo:basic-link xsl:use-attribute-sets="xref">
      <xsl:call-template name="buildBasicLinkDestination">
        <xsl:with-param name="scope" select="@scope"/>
        <xsl:with-param name="format" select="@format"/>
        <xsl:with-param name="href" select="@href"/>
      </xsl:call-template>
      <xsl:choose>
        <xsl:when test="not(@scope = 'external' or @format = 'html') and not($referenceTitle = '')">
          <xsl:copy-of select="$referenceTitle"/>
        </xsl:when>
        <xsl:when test="not(@scope = 'external' or @format = 'html')">
          <xsl:call-template name="insertPageNumberCitation">
            <xsl:with-param name="isTitleEmpty" select=\"true()\"/>
            <xsl:with-param name="destination" select="$destination"/>
            <xsl:with-param name="element" select="$element"/>
          </xsl:call-template>
        </xsl:when>
        <xsl:otherwise>
          <xsl:choose>
            <xsl:when test="exists(*[not(contains(@class,' topic/desc '))] | text()) and
                            exists(processing-instruction('ditaot')[. = 'usertext'])">
              <xsl:apply-templates select="*[not(contains(@class,' topic/desc '))] | text()"/>
            </xsl:when>
            <xsl:otherwise>
              <xsl:value-of select="e:format-link-url(@href)"/>
            </xsl:otherwise>
          </xsl:choose>
        </xsl:otherwise>
      </xsl:choose>
    </fo:basic-link>
    <xsl:if test="not(@scope = 'external' or @format = 'html') and not($referenceTitle = '') and not($element[contains(@class, ' topic/fn ')])">
      <xsl:if test="not(processing-instruction('ditaot')[. = 'usertext'])">
        <xsl:call-template name="insertPageNumberCitation">
          <xsl:with-param name="destination" select="$destination"/>
          <xsl:with-param name="element" select="$element"/>
        </xsl:call-template>
      </xsl:if>
    </xsl:if>
    <xsl:if test="@scope = 'external' and exists(processing-instruction('ditaot')[. = 'usertext'])">
      <xsl:text> at </xsl:text>
      <xsl:value-of select="e:format-link-url(@href)"/>
    </xsl:if>
  </xsl:template>

  <xsl:function name="e:format-link-url">
    <xsl:param name="href"/>
    <xsl:variable name="h" select="if (starts-with($href, 'http://')) then substring($href, 8) else $href"/>
    <xsl:value-of select="if (contains($h, '/') and substring-after($h, '/') = '') then substring($h, 0, string-length($h)) else $h"/>
  </xsl:function>
`;

  if (
    _.has(conf.style.link, 'link-url') &&
    conf.style.link['link-url'] === true
  ) {
    root.append(Comment('link'));
    copy_xml(root, link_raw);
  }
}

export function generate_custom_attr(root: Element, conf: Generator) {
  // related link description
  const linkShortdescAttrs = conf.attribute_set(root, 'body', 'link__shortdesc', [
    'space-after',
  ]);
  SubElement(linkShortdescAttrs, xsl('attribute'), {
    name: 'start-indent'
  }).text = 'from-parent(start-indent) + 15pt';
}
