'use strict';

import { Element, SubElement } from './elementtree';
import { xsl, copy_xml } from './utils';
import Generator from './index';

const blank_raw = `
<xsl:variable name="blank-pages" select="true()"/>

<xsl:template match="/" mode="create-page-masters">
  <xsl:variable name="base" as="element()*">
    <xsl:next-match/>
  </xsl:variable>
  <xsl:copy-of select="$base"/>
  <xsl:if test="$blank-pages">
    <xsl:apply-templates select="$base[ends-with(@master-name, '-odd') or ends-with(@master-name, '-even')]"
                         mode="blankPage"/>
  </xsl:if>
</xsl:template>

<xsl:template match="@* | node()" mode="blankPage">
  <xsl:copy>
    <xsl:apply-templates select="@* | node()" mode="blankPage"/>
  </xsl:copy>
</xsl:template>
<xsl:template match="fo:simple-page-master/@master-name" mode="blankPage">
  <xsl:attribute name="{name()}" select="concat(., '--blank')"/>
</xsl:template>
<xsl:template match="fo:region-before/@region-name" mode="blankPage">
  <xsl:attribute name="{name()}" select="concat(., '--blank')"/>
</xsl:template>

<xsl:template match="/" mode="create-page-sequences">
  <xsl:call-template name="generate-page-sequence-master">
    <xsl:with-param name="master-name" select="'toc-sequence'"/>
    <xsl:with-param name="master-reference" select="'toc'"/>
    <xsl:with-param name="last" select="not($blank-pages)"/>
    <xsl:with-param name="blank" select="$blank-pages"/>
  </xsl:call-template>
  <xsl:call-template name="generate-page-sequence-master">
    <xsl:with-param name="master-name" select="'body-sequence'"/>
    <xsl:with-param name="master-reference" select="'body'"/>
    <xsl:with-param name="last" select="not($blank-pages)"/>
    <xsl:with-param name="blank" select="$blank-pages"/>
  </xsl:call-template>
  <xsl:call-template name="generate-page-sequence-master">
    <xsl:with-param name="master-name" select="'ditamap-body-sequence'"/>
    <xsl:with-param name="master-reference" select="'body'"/>
    <xsl:with-param name="first" select="false()"/>
    <xsl:with-param name="last" select="false()"/>
    <xsl:with-param name="blank" select="$blank-pages"/>
  </xsl:call-template>
  <xsl:call-template name="generate-page-sequence-master">
    <xsl:with-param name="master-name" select="'index-sequence'"/>
    <xsl:with-param name="master-reference" select="'index'"/>
    <xsl:with-param name="last" select="not($blank-pages)"/>
    <xsl:with-param name="blank" select="$blank-pages"/>
  </xsl:call-template>
  <xsl:call-template name="generate-page-sequence-master">
    <xsl:with-param name="master-name" select="'front-matter'"/>
    <xsl:with-param name="master-reference" select="'front-matter'"/>
    <xsl:with-param name="last" select="not($blank-pages)"/>
    <xsl:with-param name="blank" select="$blank-pages"/>
  </xsl:call-template>
  <xsl:if test="$generate-back-cover">
    <xsl:call-template name="generate-page-sequence-master">
      <xsl:with-param name="master-name" select="'back-cover'"/>
      <xsl:with-param name="master-reference" select="'back-cover'"/>
      <xsl:with-param name="first" select="false()"/>
    </xsl:call-template>
  </xsl:if>
  <xsl:call-template name="generate-page-sequence-master">
    <xsl:with-param name="master-name" select="'glossary-sequence'"/>
    <xsl:with-param name="master-reference" select="'glossary'"/>
    <xsl:with-param name="last" select="not($blank-pages)"/>
    <xsl:with-param name="blank" select="$blank-pages"/>
  </xsl:call-template>
</xsl:template>

<!-- Generate a page sequence master -->
<xsl:template name="generate-page-sequence-master">
  <xsl:param name="master-name"/>
  <xsl:param name="master-reference"/>
  <xsl:param name="first" select="true()"/>
  <xsl:param name="last" select="true()"/>
  <xsl:param name="blank" select="false()"/>
  <fo:page-sequence-master master-name="{$master-name}">
    <fo:repeatable-page-master-alternatives>
      <xsl:if test="$first">
        <fo:conditional-page-master-reference master-reference="{$master-reference}-first"
          odd-or-even="odd" page-position="first"/>
      </xsl:if>
      <xsl:if test="$last">
        <fo:conditional-page-master-reference master-reference="{$master-reference}-last"
          odd-or-even="even" page-position="last"/>
        <!--blank-or-not-blank="blank"-->
      </xsl:if>        
      <xsl:choose>
        <xsl:when test="$mirror-page-margins">
          <xsl:if test="$blank">
            <fo:conditional-page-master-reference master-reference="{$master-reference}-odd--blank"
              odd-or-even="odd"
              blank-or-not-blank="blank"/>
            <fo:conditional-page-master-reference master-reference="{$master-reference}-even--blank"
              odd-or-even="even"
              blank-or-not-blank="blank"/>
          </xsl:if>
          <fo:conditional-page-master-reference master-reference="{$master-reference}-odd"
            odd-or-even="odd"/>
          <fo:conditional-page-master-reference master-reference="{$master-reference}-even"
            odd-or-even="even"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:if test="$blank">
            <fo:conditional-page-master-reference master-reference="{$master-reference}-odd--blank"
              odd-or-even="odd"
              blank-or-not-blank="blank"/>
          </xsl:if>
          <fo:conditional-page-master-reference master-reference="{$master-reference}-odd"/>
        </xsl:otherwise>
      </xsl:choose>
    </fo:repeatable-page-master-alternatives>
  </fo:page-sequence-master>
</xsl:template>
`;

export function generate_custom(root: Element, conf: Generator) {
  if (!!conf.conf.blank_pages) {
    copy_xml(root, blank_raw);
  }
}

export function generate_custom_attr(root: Element, conf: Generator) {
  // page column count
  if (conf.body_column_count) {
    ['region-body.odd', 'region-body.even'].forEach((a) => {
      const region_body_attr = SubElement(root, xsl('attribute-set'), {
        name: a,
      });
      SubElement(region_body_attr, xsl('attribute'), {
        name: 'column-count',
      }).text = conf.body_column_count!.toString();
      if (conf.column_gap) {
        SubElement(region_body_attr, xsl('attribute'), {
          name: 'column-gap',
        }).text = conf.column_gap;
      }
    });
    let atts = ['region-bodyfrontmatter.odd', 'region-bodyfrontmatter.even'];
    atts.forEach((a) => {
      const region_body_attr = SubElement(root, xsl('attribute-set'), {
        name: a,
      });
      SubElement(region_body_attr, xsl('attribute'), {
        name: 'column-count',
      }).text = '1';
    });
    if (conf.index_column_count) {
      ['region-bodyindex.odd', 'region-bodyindex.even'].forEach((a) => {
        const region_body_attr = SubElement(root, xsl('attribute-set'), {
          name: a,
        });
        SubElement(region_body_attr, xsl('attribute'), {
          name: 'column-count',
        }).text = conf.index_column_count!.toString();
      });
    }
  }
}
