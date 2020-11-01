'use strict';

const _ = require('lodash');
const ET = require('./elementtree');
const utils = require('./utils');

const xsl = utils.xsl;
const fo = utils.fo;

function generate_custom(root, conf) {
  const tocRaw = `
<xsl:template match="*[contains(@class, ' bookmap/appendix ')]" mode="tocText">
  <xsl:param name="tocItemContent"/>
  <xsl:param name="currentNode"/>
  <xsl:for-each select="$currentNode">
    <fo:block xsl:use-attribute-sets="__toc__appendix__content">
      <xsl:copy-of select="$tocItemContent"/>
    </fo:block>
  </xsl:for-each>
</xsl:template>

<xsl:template match="*[contains(@class, ' bookmap/part ')]" mode="tocText">
  <xsl:param name="tocItemContent"/>
  <xsl:param name="currentNode"/>
  <xsl:for-each select="$currentNode">
    <fo:block xsl:use-attribute-sets="__toc__part__content">
      <xsl:copy-of select="$tocItemContent"/>
    </fo:block>
  </xsl:for-each>
</xsl:template>

<xsl:template match="*[contains(@class, ' bookmap/preface ')]" mode="tocText">
  <xsl:param name="tocItemContent"/>
  <xsl:param name="currentNode"/>
  <xsl:for-each select="$currentNode">
    <fo:block xsl:use-attribute-sets="__toc__preface__content">
      <xsl:copy-of select="$tocItemContent"/>
    </fo:block>
  </xsl:for-each>
</xsl:template>

<xsl:template match="*[contains(@class, ' bookmap/notices ')]" mode="tocText">
  <xsl:param name="tocItemContent"/>
  <xsl:param name="currentNode"/>
  <xsl:for-each select="$currentNode">
    <fo:block xsl:use-attribute-sets="__toc__notices__content">
      <xsl:copy-of select="$tocItemContent"/>
    </fo:block>
  </xsl:for-each>
</xsl:template>

<xsl:template match="node()" mode="tocText" priority="-10">
  <xsl:param name="tocItemContent"/>
  <xsl:param name="currentNode"/>
  <xsl:for-each select="$currentNode">
    <xsl:variable name="level" select="count(ancestor-or-self::*[contains(@class, ' topic/topic ')])"/>
    <xsl:choose>
      <xsl:when test="$level eq 1">
        <fo:block xsl:use-attribute-sets="__toc__topic__content">
          <xsl:copy-of select="$tocItemContent"/>
        </fo:block>
      </xsl:when>
      <xsl:when test="$level eq 2">
        <fo:block xsl:use-attribute-sets="__toc__topic__content_2">
          <xsl:copy-of select="$tocItemContent"/>
        </fo:block>
      </xsl:when>
      <xsl:when test="$level eq 3">
        <fo:block xsl:use-attribute-sets="__toc__topic__content_3">
          <xsl:copy-of select="$tocItemContent"/>
        </fo:block>
      </xsl:when>
      <xsl:when test="$level eq 4">
        <fo:block xsl:use-attribute-sets="__toc__topic__content_4">
          <xsl:copy-of select="$tocItemContent"/>
        </fo:block>
      </xsl:when>
    </xsl:choose>
  </xsl:for-each>
</xsl:template>
`;

  root.append(ET.Comment('toc'));
  utils.copy_xml(root, tocRaw);

  if (_.has(conf.style, 'toc_1.prefix') && !conf.style.toc_1.prefix) {
    ET.SubElement(root, xsl('template'), {
      match: 'node()',
      mode: 'tocPrefix',
    });
  }
}

function generate_custom_attr(root, conf) {
  //<xsl:variable name="toc.toc-indent" select="'30pt'"/>
  const tocIndentRaw = `
      <xsl:attribute-set name="__toc__indent">
        <xsl:attribute name="start-indent">
          <xsl:variable name="level" select="count(ancestor-or-self::*[contains(@class, ' topic/topic ')])"/>
          <xsl:choose>
            <xsl:when test="$level eq 1">
              <xsl:value-of select="concat('${conf.style.toc_1['start-indent']} + ', $toc.text-indent)"/>
            </xsl:when>
            <xsl:when test="$level eq 2">
              <xsl:value-of select="concat('${conf.style.toc_2['start-indent']} + ', $toc.text-indent)"/>
            </xsl:when>
            <xsl:when test="$level eq 3">
              <xsl:value-of select="concat('${conf.style.toc_3['start-indent']} + ', $toc.text-indent)"/>
            </xsl:when>
            <xsl:when test="$level eq 4">
              <xsl:value-of select="concat('${conf.style.toc_4['start-indent']} + ', $toc.text-indent)"/>
            </xsl:when>
          </xsl:choose>
        </xsl:attribute>
      </xsl:attribute-set>

      <xsl:attribute-set name="__toc__indent__booklist">
        <xsl:attribute name="start-indent">
          <xsl:value-of select="concat('${conf.style.toc_1['start-indent']} + ', $toc.text-indent)"/>
        </xsl:attribute>
      </xsl:attribute-set>`;

  utils.copy_xml(root, tocIndentRaw);

  //const indent = ET.SubElement(root, xsl('attribute-set'), {name: '__toc__indent'})
  //const indentAttr = ET.SubElement(indent, xsl('attribute'), {name: 'start-indent'})
  //
  //_.forEach(conf.style[style], (v, p) => {
  //  if (_.includes(properties, p)) {
  //    ET.SubElement(attrs, xsl('attribute'), {name: p}).text = value(p, v)
  //  }
  //})

  conf.attribute_set(
    root,
    'toc_1',
    '__toc__topic__content',
    _.difference(conf.properties, ['start-indent'])
  );
  //conf.attribute_set(root, 'toc_1', '__toc__topic__content_1', _.difference(conf.properties, ["start-indent"]), '__toc__topic__content')
  conf.attribute_set(
    root,
    'toc_2',
    '__toc__topic__content_2',
    _.difference(conf.properties, ['start-indent']),
    '__toc__topic__content'
  );
  conf.attribute_set(
    root,
    'toc_3',
    '__toc__topic__content_3',
    _.difference(conf.properties, ['start-indent']),
    '__toc__topic__content'
  );
  conf.attribute_set(
    root,
    'toc_4',
    '__toc__topic__content_4',
    _.difference(conf.properties, ['start-indent']),
    '__toc__topic__content'
  );

  conf.attribute_set(
    root,
    'toc_1',
    '__toc__chapter__content',
    _.difference(conf.properties, ['start-indent'])
  );
  conf.attribute_set(
    root,
    'toc_1',
    '__toc__appendix__content',
    _.difference(conf.properties, ['start-indent'])
  );
  conf.attribute_set(
    root,
    'toc_1',
    '__toc__part__content',
    _.difference(conf.properties, ['start-indent'])
  );
  conf.attribute_set(
    root,
    'toc_1',
    '__toc__preface__content',
    _.difference(conf.properties, ['start-indent'])
  );
  conf.attribute_set(
    root,
    'toc_1',
    '__toc__notices__content',
    _.difference(conf.properties, ['start-indent'])
  );
  conf.attribute_set(
    root,
    'toc_1',
    '__toc__topic__content__booklist',
    _.difference(conf.properties, ['start-indent'])
  );
}

module.exports = {
  xsl: generate_custom,
  attr: generate_custom_attr,
};
