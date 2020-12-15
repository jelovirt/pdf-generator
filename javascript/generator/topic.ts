import Generator from '.';
import { Comment, Element, SubElement } from './elementtree';
import { copy_xml, xsl } from './utils';
import _ from 'lodash';

export function generate_custom(root: Element, conf: Generator) {
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
}
