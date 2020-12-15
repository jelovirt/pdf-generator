'use strict';

import _ from 'lodash';
import { Comment, Element, SubElement } from './elementtree';
import { fo, xsl, copy_xml } from './utils';
import Generator from './index';

export function generate_custom(root: Element, conf: Generator) {
  const note_raw = `
  <xsl:template match="*[contains(@class,' topic/note ')]">
    <fo:table xsl:use-attribute-sets="notetable">
      <fo:table-column xsl:use-attribute-sets="notetextcolumn"/>
      <fo:table-body>
        <fo:table-row>
          <fo:table-cell xsl:use-attribute-sets="notetextentry">
            <xsl:apply-templates select="." mode="placeNoteContent"/>
          </fo:table-cell>
        </fo:table-row>
      </fo:table-body>
    </fo:table>
  </xsl:template>
`;

  const note_no_icon = `
  <xsl:template match="*[contains(@class,' topic/note ')]" mode="setNoteImagePath"/>
`;

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
  const fig_raw = `
<xsl:template match="*[contains(@class,' topic/fig ')]">
  <fo:block xsl:use-attribute-sets="fig">
    <xsl:call-template name="commonattributes"/>
    <xsl:if test="not(@id)">
      <xsl:attribute name="id">
        <xsl:call-template name="get-id"/>
      </xsl:attribute>
    </xsl:if>
    <xsl:apply-templates/>
  </fo:block>
</xsl:template>
`;

  const fig_title_number_document = `
<xsl:template match="*[contains(@class, ' topic/fig ')]/*[contains(@class, ' topic/title ')]" mode="fig.title-number">
  <xsl:value-of select="count(key('enumerableByClass', 'topic/fig')[. &lt;&lt; current()])"/>
</xsl:template>`;

  //    const fig_title_number_topic = `
  //<xsl:template match="*[contains(@class, ' topic/fig ')]/*[contains(@class, ' topic/title ')]" mode="fig.title-number">
  //  <xsl:variable name="topicref" select="key('map-id', ancestor-or-self::*[contains(@class, ' topic/topic ')][1]/@id)"/>
  //  <xsl:apply-templates select="$topicref" mode="topicTitleNumber"/>
  //  <xsl:text>&#x2013;</xsl:text>
  //  <xsl:value-of select="count(key('enumerableByClass', 'topic/fig', ancestor::*[contains(@class, ' topic/topic ')][1])[. &lt;&lt; current()])"/>
  //</xsl:template>`

  const fig_title_number_chapter = `
<xsl:template match="*[contains(@class, ' topic/fig ')]/*[contains(@class, ' topic/title ')]" mode="fig.title-number">
  <xsl:call-template name="getChapterPrefix"/>
  <xsl:value-of select="count(key('enumerableByClass', 'topic/fig', ancestor::*[contains(@class, ' topic/topic ')][last()])
                              [*[contains(@class, ' topic/title ')]]
                              [. &lt;&lt; current()])"/>
</xsl:template>`;

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
  if (!conf.style.note.icon) {
    root.append(Comment('note'));
    copy_xml(root, note_no_icon);
  }
  if (conf.page_number) {
    if (conf.page_number === 'chapter-page') {
      copy_xml(root, chapter_page_number_raw);
    }
  }
  // caption numbering
  const figCaptionNumber = _.get(conf.style.fig, 'caption-number');
  switch (figCaptionNumber) {
    //case "topic":
    //  copy_xml(root, fig_title_number_topic)
    //  break
    case 'chapter':
      copy_xml(root, fig_title_number_chapter);
      break;
    case 'document':
      copy_xml(root, fig_title_number_document);
      break;
  }

  //if (_.has(conf.style, 'fig') && _.has(conf.style.fig, "caption-position") && conf.style.fig["caption-position"] === "before") {
  if (
    _.has(conf.style.fig, 'caption-position') &&
    conf.style.fig['caption-position'] === 'before'
  ) {
    copy_xml(root, fig_raw);
  }
  if (conf.cover_image_topic) {
    SubElement(root, xsl('template'), {
      match: `*[contains(@class, ' topic/topic ')][@outputclass = '${conf.cover_image_topic}']`,
      priority: '1000',
    });
  }
  // tm
  if (
    _.has(conf.style.tm, 'symbol-scope') &&
    conf.style.tm['symbol-scope'] !== 'always'
  ) {
    const tm_chapter_raw = `
          <xsl:function name="e:tm-value" as="xs:string">
            <xsl:param name="node" as="element()"/>
            <xsl:value-of select="normalize-space($node)"/>
          </xsl:function>

          <xsl:key name="e:first-tm" match="*[contains(@class, ' topic/tm ')]" use="e:tm-value(.)"/>

          <xsl:template match="*[contains(@class, ' topic/tm ')]">
            <xsl:variable name="tmText" as="xs:string" select="e:tm-value(.)"/>
            <xsl:variable name="tm-scope" as="element()" select="(ancestor-or-self::*[contains(@class, ' topic/topic ')])[1]"/>
            <xsl:variable name="tms" as="element()+" select="key('e:first-tm', $tmText, $tm-scope)"/>
            <xsl:variable name="isFirst" as="xs:boolean" select="$tms[1] is ."/>
            <xsl:choose>
              <xsl:when test="$isFirst">
                <xsl:next-match/>
              </xsl:when>
              <xsl:otherwise>
                <fo:inline xsl:use-attribute-sets="tm">
                  <xsl:apply-templates/>
                </fo:inline>
              </xsl:otherwise>
            </xsl:choose>
          </xsl:template>
          `;
    const tm_never_raw = `
          <xsl:template match="*[contains(@class, ' topic/tm ')]">
            <fo:inline xsl:use-attribute-sets="tm">
              <xsl:apply-templates/>
            </fo:inline>
          </xsl:template>
          `;
    root.append(Comment('tm'));
    const symbolScope = conf.style.tm['symbol-scope'];
    if (symbolScope === 'chapter') {
      copy_xml(root, tm_chapter_raw);
    } else if (symbolScope === 'never') {
      copy_xml(root, tm_never_raw);
    }
    // else if(symbolScope === 'always') {
    //   // NOOP
    // }
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
  const foRootAttrSet = conf.attribute_set(root, 'body', '__fo__root', [
    'font-family',
    'color',
    'text-align',
  ]);
  SubElement(foRootAttrSet, xsl('attribute'), {
    name: 'id',
    select: '$e:root-id',
  });
  conf.attribute_set(root, 'example_title', 'example.title');
  // link
  const link_attr_sets = ['common.link'];
  link_attr_sets.forEach((n) => {
    conf.attribute_set(root, 'link', n);
  });
  // tm
  conf.attribute_set(root, 'tm', 'tm');
  // normal block
  const spacing_attr_sets = ['common.block'];
  spacing_attr_sets.forEach((n) => {
    conf.attribute_set(
      root,
      'body',
      n,
      _.difference(conf.properties, ['start-indent'])
    );
  });
  // example
  conf.attribute_set(root, 'example', 'example');
  // note
  conf.attribute_set(root, 'note', 'note__table');
  // if (!conf.style.note.icon) {
  //   const note_text = SubElement(root, xsl('attribute-set'), {
  //     name: 'notetextcolumn',
  //   });
  //   SubElement(note_text, xsl('attribute'), { name: 'column-number' }).text =
  //     '1';
  // }
  // pre
  conf.attribute_set(root, 'pre', 'pre');

  // fig
  conf.attribute_set(root, 'fig', 'fig');
}
