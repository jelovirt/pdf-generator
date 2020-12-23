'use strict';

import _ from 'lodash';
import { Element, SubElement } from './elementtree';
import { copy_xml, xsl } from './utils';
import Generator from './index';
import { FoProperty, StyleName } from './styles';

export function generate_custom(root: Element, conf: Generator) {
  const chapter_page_number_raw = `
<xsl:template name="startPageNumbering">
  <xsl:variable name="topicType" as="xs:string">
    <xsl:call-template name="determineTopicType"/>
  </xsl:variable>
  <xsl:variable name="topicref" select="key('map-id', ancestor-or-self::*[contains(@class, ' topic/topic ')][1]/@id)"/>
  <xsl:for-each select="$topicref[1]">
    <xsl:choose>
      <xsl:when test="$topicType = 'topicChapter'">
        <xsl:attribute name="initial-page-number">1</xsl:attribute>
        <fo:folio-prefix>
          <xsl:number format="1" count="*[contains(@class, ' bookmap/chapter ')]"/>
          <xsl:text>&#x2013;</xsl:text>
        </fo:folio-prefix>
      </xsl:when>
      <xsl:when test="$topicType = ('topicAppendix', 'topicAppendices')">
        <xsl:attribute name="initial-page-number">1</xsl:attribute>
        <fo:folio-prefix>
          <xsl:number format="A" count="*[contains(@class, ' bookmap/appendix ')]"/>
          <xsl:text>&#x2013;</xsl:text>
        </fo:folio-prefix>
      </xsl:when>
    </xsl:choose>
  </xsl:for-each>
  <!--xsl:comment>topicType: <xsl:value-of select="$topicType"/></xsl:comment-->
</xsl:template>
`;

  const commons_raw = `
<xsl:template name="getChapterPrefix">
  <xsl:variable as="element()*" name="topicref" select="key('map-id', ancestor-or-self::*[contains(@class, ' topic/topic ')][1]/@id)" />
  <xsl:variable as="element()*" name="chapter" select="$topicref/ancestor-or-self::*[contains(@class, ' map/topicref ')]
                                                                                    [parent::opentopic:map or
                                                                                     parent::*[contains(@class, ' bookmap/part ')] or
                                                                                     parent::*[contains(@class, ' bookmap/appendices ')]][1]" />
  <xsl:variable name="number" as="node()*">
    <xsl:apply-templates select="$chapter[1]" mode="topicTitleNumber"/>
  </xsl:variable>
  <xsl:if test="exists($number)">
    <xsl:copy-of select="$number"/>
    <xsl:text>–</xsl:text>
  </xsl:if>
</xsl:template>`;

  const numberless_chapter_raw = `
  <xsl:template name="insertChapterFirstpageStaticContent">
    <xsl:param name="type"/>
    <fo:block>
      <xsl:attribute name="id">
        <xsl:call-template name="generate-toc-id"/>
      </xsl:attribute>
      <xsl:choose>
        <xsl:when test="$type = 'chapter'">
          <fo:block xsl:use-attribute-sets="__chapter__frontmatter__name__container">
            <xsl:call-template name="getVariable">
              <xsl:with-param name="id" select="'Chapter with number'"/>
              <xsl:with-param name="params" as="element()*">
                <number>
                  <!--fo:block xsl:use-attribute-sets="__chapter__frontmatter__number__container">
                      <xsl:apply-templates select="key('map-id', @id)[1]" mode="topicTitleNumber"/>
                  </fo:block-->
                </number>
              </xsl:with-param>
            </xsl:call-template>
          </fo:block>
        </xsl:when>
        <xsl:when test="$type = 'appendix'">
            <fo:block xsl:use-attribute-sets="__chapter__frontmatter__name__container">
                <xsl:call-template name="getVariable">
                    <xsl:with-param name="id" select="'Appendix with number'"/>
                     <xsl:with-param name="params" as="element()*">
                        <number>
                            <!--fo:block xsl:use-attribute-sets="__chapter__frontmatter__number__container">
                                <xsl:apply-templates select="key('map-id', @id)[1]" mode="topicTitleNumber"/>
                            </fo:block-->
                        </number>
                    </xsl:with-param>
                </xsl:call-template>
            </fo:block>
        </xsl:when>
        <xsl:when test="$type = 'appendices'">
          <fo:block xsl:use-attribute-sets="__chapter__frontmatter__name__container">
            <xsl:call-template name="getVariable">
              <xsl:with-param name="id" select="'Appendix with number'"/>
               <xsl:with-param name="params" as="element()*">
                <number>
                  <fo:block xsl:use-attribute-sets="__chapter__frontmatter__number__container">
                    <xsl:text>&#xA0;</xsl:text>
                  </fo:block>
                </number>
              </xsl:with-param>
            </xsl:call-template>
          </fo:block>
        </xsl:when>
        <xsl:when test="$type = 'part'">
          <fo:block xsl:use-attribute-sets="__chapter__frontmatter__name__container">
            <xsl:call-template name="getVariable">
              <xsl:with-param name="id" select="'Part with number'"/>
               <xsl:with-param name="params" as="element()*">
                <number>
                  <fo:block xsl:use-attribute-sets="__chapter__frontmatter__number__container">
                    <xsl:apply-templates select="key('map-id', @id)[1]" mode="topicTitleNumber"/>
                  </fo:block>
                </number>
              </xsl:with-param>
            </xsl:call-template>
          </fo:block>
        </xsl:when>
        <xsl:when test="$type = 'preface'">
          <fo:block xsl:use-attribute-sets="__chapter__frontmatter__name__container">
            <xsl:call-template name="getVariable">
              <xsl:with-param name="id" select="'Preface title'"/>
            </xsl:call-template>
          </fo:block>
        </xsl:when>
        <xsl:when test="$type = 'notices'">
          <fo:block xsl:use-attribute-sets="__chapter__frontmatter__name__container">
            <xsl:call-template name="getVariable">
              <xsl:with-param name="id" select="'Notices title'"/>
            </xsl:call-template>
          </fo:block>
        </xsl:when>
      </xsl:choose>
    </fo:block>
  </xsl:template>
`;

  copy_xml(root, commons_raw);

  if (
    conf.style.topic['title-numbering'] !== undefined &&
    conf.style.topic['title-numbering'] !== 'true'
  ) {
    copy_xml(root, numberless_chapter_raw);
  }
  if (conf.page_number) {
    if (conf.page_number === 'chapter-page') {
      copy_xml(root, chapter_page_number_raw);
    }
  }

  if (conf.cover_image_topic) {
    SubElement(root, xsl('template'), {
      match: `*[contains(@class, ' topic/topic ')][@outputclass = '${conf.cover_image_topic}']`,
      priority: '1000',
    });
  }
}

export function generate_custom_attr(root: Element, conf: Generator) {
  SubElement(root, xsl('variable'), {
    name: 'e:root-id',
    select: `'root'`,
    as: 'xs:string',
  });
  // force page count
  if (conf.force_page_count) {
    const page_count_attr = SubElement(root, xsl('attribute-set'), {
      name: '__force__page__count',
    });
    SubElement(page_count_attr, xsl('attribute'), {
      name: 'force-page-count',
    }).text = conf.force_page_count;
  }
  // font family
  const foRootAttrSet = conf.attribute_set(root, StyleName.BODY, '__fo__root', [
    FoProperty.FONT_FAMILY,
    FoProperty.COLOR,
    FoProperty.TEXT_ALIGN,
  ]);
  SubElement(foRootAttrSet, xsl('attribute'), {
    name: 'id',
    select: '$e:root-id',
  });
  // link
  const link_attr_sets = ['common.link'];
  link_attr_sets.forEach((n) => {
    conf.attribute_set(root, StyleName.LINK, n);
  });
  // normal block
  const spacing_attr_sets = ['common.block'];
  spacing_attr_sets.forEach((n) => {
    conf.attribute_set(
      root,
      StyleName.BODY,
      n,
      _.difference(conf.properties, [FoProperty.START_INDENT])
    );
  });
}
