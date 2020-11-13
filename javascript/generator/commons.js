'use strict';

import _ from 'lodash';
import ET from './elementtree';
import { fo, xsl, copy_xml } from './utils';

function generate_custom(root, conf) {
  const get_title_raw = `
  <xsl:template match="*[contains(@class, ' topic/topic ')]/*[contains(@class, ' topic/title ')]" mode="getTitle">
    <xsl:variable name="topic" select="ancestor-or-self::*[contains(@class, ' topic/topic ')][1]"/>
    <xsl:variable name="id" select="$topic/@id"/>
    <xsl:variable name="mapTopics" select="key('map-id', $id)"/>
    <fo:inline>
      <xsl:for-each select="$mapTopics[1]">
        <xsl:variable name="depth" select="count(ancestor-or-self::*[contains(@class, ' map/topicref')])"/>
        <xsl:choose>
          <xsl:when test="parent::opentopic:map and contains(@class, ' bookmap/bookmap ')"/>
          <xsl:when test="ancestor-or-self::*[contains(@class, ' bookmap/frontmatter ') or
                                              contains(@class, ' bookmap/backmatter ')]"/>
          <xsl:when test="ancestor-or-self::*[contains(@class, ' bookmap/appendix ')] and
                          $e:number-levels[$depth]">
            <xsl:number count="*[contains(@class, ' map/topicref ')]
                                [ancestor-or-self::*[contains(@class, ' bookmap/appendix ')]] "
                        level="multiple"
                        format="A.1.1"/>
          </xsl:when>
          <xsl:when test="$e:number-levels[$depth]">
            <xsl:number count="*[contains(@class, ' map/topicref ')]
                                [not(ancestor-or-self::*[contains(@class, ' bookmap/frontmatter ')])]"
                        level="multiple"
                        format="1.1"/>
          </xsl:when>
        </xsl:choose>
      </xsl:for-each>
    </fo:inline>
    <xsl:value-of select="' '"/>
    <xsl:apply-templates/>
  </xsl:template>
  
  <xsl:template name="getNavTitle">
    <xsl:variable name="topicref" select="key('map-id', @id)[1]"/>
    <xsl:choose>
      <xsl:when test="$topicref/@locktitle = 'yes' and $topicref/*[contains(@class, ' map/topicmeta ')]/*[contains(@class, ' topic/navtitle ')]">
        <xsl:apply-templates select="$topicref/*[contains(@class, ' map/topicmeta ')]/*[contains(@class, ' topic/navtitle ')]/node()"/>
      </xsl:when>
      <xsl:when test="$topicref/@locktitle = 'yes' and $topicref/@navtitle">
        <xsl:value-of select="$topicref/@navtitle"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:apply-templates select="*[contains(@class,' topic/title ')]/node()"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
`;

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
  root.append(ET.Comment('title numbering'));
  const number_levels = _([
    'topic',
    'topic_topic',
    'topic_topic_topic',
    'topic_topic_topic_topic',
  ])
    .map((s) => {
      return (
        _.has(conf.style, s) &&
        _.has(conf.style[s], 'title-numbering') &&
        conf.style[s]['title-numbering'] === true
      );
    })
    .value();
  ET.SubElement(root, xsl('variable'), {
    name: 'e:number-levels',
    select:
      '(' +
      _(number_levels)
        .map((l) => {
          return l.toString().toLowerCase() + '()';
        })
        .join(', ') +
      ')',
  });
  copy_xml(root, get_title_raw);
  if (
    _.has(conf.style.topic, 'title-numbering') &&
    conf.style.topic['title-numbering'] !== true
  ) {
    copy_xml(root, numberless_chapter_raw);
  }
  if (!(_.has(conf.style.note, 'icon') && conf.style.note.icon === 'icon')) {
    root.append(ET.Comment('note'));
    copy_xml(root, note_raw);
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
    ET.SubElement(root, xsl('template'), {
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
    root.append(ET.Comment('tm'));
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

function generate_custom_attr(root, conf) {
  ET.SubElement(root, xsl('variable'), {
    name: 'e:root-id',
    select: `'root'`,
    as: 'xs:string',
  });
  // force page count
  if (conf.force_page_count) {
    const page_count_attr = ET.SubElement(root, xsl('attribute-set'), {
      name: '__force__page__count',
    });
    ET.SubElement(page_count_attr, xsl('attribute'), {
      name: 'force-page-count',
    }).text = conf.force_page_count;
  }
  // font family
  const foRootAttrSet = conf.attribute_set(root, 'body', '__fo__root', [
    'font-family',
    'color',
    'text-align',
  ]);
  ET.SubElement(foRootAttrSet, xsl('attribute'), {
    name: 'id',
    select: '$e:root-id',
  });
  // titles
  _.forEach(conf.style, (e, k) => {
    if (k.startsWith('topic') || k === 'section') {
      const title_attr = ET.SubElement(root, xsl('attribute-set'), {
        name: k.replace(/_/g, '.') + '.title',
      });
      _.forEach(e, (v, p) => {
        if (_.includes(conf.properties, p)) {
          ET.SubElement(title_attr, xsl('attribute'), { name: p }).text = v;
        }
      });
    }
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
  if (!(_.has(conf.style.note, 'icon') && conf.style.note.icon === 'icon')) {
    const note_text = ET.SubElement(root, xsl('attribute-set'), {
      name: 'notetextcolumn',
    });
    ET.SubElement(note_text, xsl('attribute'), { name: 'column-number' }).text =
      '1';
  }
  // pre
  conf.attribute_set(root, 'pre', 'pre');

  // fig
  conf.attribute_set(root, 'fig', 'fig');
}

module.exports = {
  xsl: generate_custom,
  attr: generate_custom_attr,
};
