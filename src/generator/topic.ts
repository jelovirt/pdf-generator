import Generator from '.';
import { Comment, Element, SubElement } from './elementtree';
import { copy_xml, xsl } from './utils';
import _ from 'lodash';

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
                                [ancestor-or-self::*[contains(@class, ' bookmap/appendix ')]]"
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
        <xsl:value-of select="' '"/>
      </xsl:for-each>
    </fo:inline>
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

  root.append(Comment('title numbering'));
  const number_levels = ([
    'topic',
    'topic_topic',
    'topic_topic_topic',
    'topic_topic_topic_topic',
  ] as (
    | 'topic'
    | 'topic_topic'
    | 'topic_topic_topic'
    | 'topic_topic_topic_topic'
  )[]).map((s) => {
    return (
      conf.style[s] !== undefined &&
      conf.style[s]['title-numbering'] !== undefined &&
      conf.style[s]['title-numbering'] === true
    );
  });
  SubElement(root, xsl('variable'), {
    name: 'e:number-levels',
    select: `(${number_levels
      .map((l) => `${l.toString().toLowerCase()}()`)
      .join(', ')})`,
  });
  copy_xml(root, get_title_raw);

  // note
  if (!conf.style.note.icon) {
    root.append(Comment('note'));
    copy_xml(root, note_no_icon);
  }

  // fig
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
  // titles
  _.forEach(conf.style, (e, k) => {
    if (k.substring(0, 5) === 'topic' || k === 'section') {
      const title_attr = SubElement(root, xsl('attribute-set'), {
        name: k.replace(/_/g, '.') + '.title',
      });
      _.forEach(e, (v, p) => {
        if (_.includes(conf.properties, p)) {
          SubElement(title_attr, xsl('attribute'), { name: p }).text = v;
        }
      });
    }
  });
  // example
  conf.attribute_set(root, 'example', 'example');
  conf.attribute_set(root, 'example_title', 'example.title');
  // tm
  conf.attribute_set(root, 'tm', 'tm');
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
