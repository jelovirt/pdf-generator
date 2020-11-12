'use strict';

import _ from 'lodash';
import ET from './elementtree';
import { fo, xsl } from './utils';

function generate_custom(root, conf) {
  const list_raw = `
<xsl:template match="*[contains(@class, ' topic/ul ')]/*[contains(@class, ' topic/li ')]">
    <xsl:variable name="depth" select="count(ancestor::*[contains(@class, ' topic/ul ')])"/>
    <fo:list-item xsl:use-attribute-sets="ul.li">
        <fo:list-item-label xsl:use-attribute-sets="ul.li__label">
            <fo:block xsl:use-attribute-sets="ul.li__label__content">
                <fo:inline>
                    <xsl:call-template name="commonattributes"/>
                </fo:inline>
                <xsl:call-template name="getVariable">
                    <xsl:with-param name="id" select="concat('Unordered List bullet ', $depth)"/>
                </xsl:call-template>
            </fo:block>
        </fo:list-item-label>
        <fo:list-item-body xsl:use-attribute-sets="ul.li__body">
            <fo:block xsl:use-attribute-sets="ul.li__content">
                <xsl:apply-templates/>
            </fo:block>
        </fo:list-item-body>
    </fo:list-item>
</xsl:template>

<xsl:template match="*[contains(@class, ' topic/ol ')]/*[contains(@class, ' topic/li ')]">
    <xsl:variable name="depth" select="count(ancestor::*[contains(@class, ' topic/ol ')])"/>
    <xsl:variable name="format">
        <xsl:call-template name="getVariable">
            <xsl:with-param name="id" select="concat('Ordered List Format ', $depth)"/>
        </xsl:call-template>
    </xsl:variable>
    <fo:list-item xsl:use-attribute-sets="ol.li">
        <fo:list-item-label xsl:use-attribute-sets="ol.li__label">
            <fo:block xsl:use-attribute-sets="ol.li__label__content">
                <fo:inline>
                    <xsl:call-template name="commonattributes"/>
                </fo:inline>
                <xsl:call-template name="getVariable">
                    <xsl:with-param name="id" select="concat('Ordered List Number ', $depth)"/>
                     <xsl:with-param name="params" as="element()*">
                        <number>
                            <xsl:number format="{$format}"/>
                        </number>
                    </xsl:with-param>
                </xsl:call-template>
            </fo:block>
        </fo:list-item-label>
        <fo:list-item-body xsl:use-attribute-sets="ol.li__body">
            <fo:block xsl:use-attribute-sets="ol.li__content">
                <xsl:apply-templates/>
            </fo:block>
        </fo:list-item-body>
    </fo:list-item>
</xsl:template>
`;

  if (_.has(conf.style, 'ol') || _.has(conf.style, 'ul')) {
    root.append(ET.Comment('list'));
    utils.copy_xml(root, list_raw);
  }
}

function generate_custom_attr(root, conf) {
  const list_raw = `
  <xsl:attribute-set name="ol">
    <xsl:attribute name="provisional-distance-between-starts">
      <xsl:call-template name="e:list-label-length"/>
      <xsl:text>em * 0.7</xsl:text>
    </xsl:attribute>
  </xsl:attribute-set>

  <xsl:template name="e:list-label-length">
    <xsl:variable name="labels" as="xs:integer*">
      <xsl:variable name="depth" select="count(ancestor-or-self::*[contains(@class, ' topic/ol ')])" />
      <xsl:variable name="format" as="xs:string">
        <xsl:call-template name="getVariable">
          <xsl:with-param name="id" select="concat('Ordered List Format ', $depth)" />
        </xsl:call-template>
      </xsl:variable>
      <xsl:for-each select="*[contains(@class, ' topic/li ')]">
        <xsl:variable name="s">
          <xsl:call-template name="getVariable">
            <xsl:with-param name="id" select="concat('Ordered List Number ', $depth)" />
             <xsl:with-param name="params" as="element()*">
              <number>
                <xsl:number format="{$format}" />
              </number>
            </xsl:with-param>
          </xsl:call-template>
        </xsl:variable>
        <xsl:sequence select="string-length(normalize-space($s))"/>
      </xsl:for-each>
    </xsl:variable>
    <xsl:sequence select="max($labels)"/>
  </xsl:template>
`;

  root.append(ET.Comment('list'));
  utils.copy_xml(root, list_raw);
}

module.exports = {
  xsl: generate_custom,
  attr: generate_custom_attr,
};
