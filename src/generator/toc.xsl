<xsl:stylesheet version="3.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:axsl="http://www.w3.org/1999/XSL/Transform/alias"
                xmlns:fo="http://www.w3.org/1999/XSL/Format"
                xmlns:map="http://www.w3.org/2005/xpath-functions/map"
                xmlns:array="http://www.w3.org/2005/xpath-functions/array"
                exclude-result-prefixes="axsl map array">

  <xsl:import href="utils.xsl"/>

  <xsl:namespace-alias stylesheet-prefix="axsl" result-prefix="xsl"/>

  <xsl:output indent="yes"/>

  <xsl:variable name="style" select=". => map:get('style')" as="map(*)"/>

  <xsl:template match=".[. instance of map(*)]">
    <axsl:stylesheet version="2.0">
      <axsl:template match="*[contains(@class, ' bookmap/appendix ')]" mode="tocText">
        <axsl:param name="tocItemContent"/>
        <axsl:param name="currentNode"/>
        <axsl:for-each select="$currentNode">
          <fo:block axsl:use-attribute-sets="__toc__appendix__content">
            <axsl:copy-of select="$tocItemContent"/>
          </fo:block>
        </axsl:for-each>
      </axsl:template>

      <axsl:template match="*[contains(@class, ' bookmap/part ')]" mode="tocText">
        <axsl:param name="tocItemContent"/>
        <axsl:param name="currentNode"/>
        <axsl:for-each select="$currentNode">
          <fo:block axsl:use-attribute-sets="__toc__part__content">
            <axsl:copy-of select="$tocItemContent"/>
          </fo:block>
        </axsl:for-each>
      </axsl:template>

      <axsl:template match="*[contains(@class, ' bookmap/preface ')]" mode="tocText">
        <axsl:param name="tocItemContent"/>
        <axsl:param name="currentNode"/>
        <axsl:for-each select="$currentNode">
          <fo:block axsl:use-attribute-sets="__toc__preface__content">
            <axsl:copy-of select="$tocItemContent"/>
          </fo:block>
        </axsl:for-each>
      </axsl:template>

      <axsl:template match="*[contains(@class, ' bookmap/notices ')]" mode="tocText">
        <axsl:param name="tocItemContent"/>
        <axsl:param name="currentNode"/>
        <axsl:for-each select="$currentNode">
          <fo:block axsl:use-attribute-sets="__toc__notices__content">
            <axsl:copy-of select="$tocItemContent"/>
          </fo:block>
        </axsl:for-each>
      </axsl:template>

      <axsl:template match="node()" mode="tocText" priority="-10">
        <axsl:param name="tocItemContent"/>
        <axsl:param name="currentNode"/>
        <axsl:for-each select="$currentNode">
          <axsl:variable name="level" select="count(ancestor-or-self::*[contains(@class, ' topic/topic ')])"/>
          <axsl:choose>
            <axsl:when test="$level eq 1">
              <fo:block axsl:use-attribute-sets="__toc__topic__content">
                <axsl:copy-of select="$tocItemContent"/>
              </fo:block>
            </axsl:when>
            <axsl:when test="$level eq 2">
              <fo:block axsl:use-attribute-sets="__toc__topic__content_2">
                <axsl:copy-of select="$tocItemContent"/>
              </fo:block>
            </axsl:when>
            <axsl:when test="$level eq 3">
              <fo:block axsl:use-attribute-sets="__toc__topic__content_3">
                <axsl:copy-of select="$tocItemContent"/>
              </fo:block>
            </axsl:when>
            <axsl:when test="$level eq 4">
              <fo:block axsl:use-attribute-sets="__toc__topic__content_4">
                <axsl:copy-of select="$tocItemContent"/>
              </fo:block>
            </axsl:when>
          </axsl:choose>
        </axsl:for-each>
      </axsl:template>

      <xsl:if test="exists($style('toc_1.prefix')) and not($style('toc_1.prefix'))">
        <axsl:template match="node" mode="tocPrefix"/>
      </xsl:if>
    </axsl:stylesheet>
  </xsl:template>

  <xsl:template match=".[. instance of map(*)]" mode="attr">
    <axsl:stylesheet version="2.0">
      <axsl:attribute-set name="__toc__indent">
        <axsl:attribute name="start-indent">
          <axsl:variable name="level" select="count(ancestor-or-self::*[contains(@class, ' topic/topic ')])"/>
          <axsl:choose>
            <axsl:when test="$level eq 1">
              <axsl:value-of select="concat('{$style('toc_1')('start-indent')} + ', $toc.text-indent)"/>
            </axsl:when>
            <axsl:when test="$level eq 2">
              <axsl:value-of select="concat('{$style('toc_2')('start-indent')} + ', $toc.text-indent)"/>
            </axsl:when>
            <axsl:when test="$level eq 3">
              <axsl:value-of select="concat('{$style('toc_3')('start-indent')} + ', $toc.text-indent)"/>
            </axsl:when>
            <axsl:when test="$level eq 4">
              <axsl:value-of select="concat('{$style('toc_4')('start-indent')} + ', $toc.text-indent)"/>
            </axsl:when>
          </axsl:choose>
        </axsl:attribute>
      </axsl:attribute-set>

      <axsl:attribute-set name="__toc__indent__booklist">
        <axsl:attribute name="start-indent">
          <axsl:value-of select="concat('{$style('toc_1')('start-indent')} + ', $toc.text-indent)"/>
        </axsl:attribute>
      </axsl:attribute-set>

      <axsl:attribute-set name="__toc__topic__content">
        <xsl:call-template name="attribute-set">
          <xsl:with-param name="style" select="$style('toc_1')"/>
          <xsl:with-param name="properties" select="$allProperties[. ne 'start-indent']"/>
        </xsl:call-template>
      </axsl:attribute-set>

      <axsl:attribute-set name="__toc__topic__content_2" use-attribute-sets="__toc__topic__content">
        <xsl:call-template name="attribute-set">
          <xsl:with-param name="style" select="$style('toc_2')"/>
          <xsl:with-param name="properties" select="$allProperties[. ne 'start-indent']"/>
        </xsl:call-template>
      </axsl:attribute-set>

      <axsl:attribute-set name="__toc__topic__content_3" use-attribute-sets="__toc__topic__content">
        <xsl:call-template name="attribute-set">
          <xsl:with-param name="style" select="$style('toc_3')"/>
          <xsl:with-param name="properties" select="$allProperties[. ne 'start-indent']"/>
        </xsl:call-template>
      </axsl:attribute-set>

      <axsl:attribute-set name="__toc__topic__content_4" use-attribute-sets="__toc__topic__content">
        <xsl:call-template name="attribute-set">
          <xsl:with-param name="style" select="$style('toc_4')"/>
          <xsl:with-param name="properties" select="$allProperties[. ne 'start-indent']"/>
        </xsl:call-template>
      </axsl:attribute-set>

      <axsl:attribute-set name="__toc__chapter__content">
        <xsl:call-template name="attribute-set">
          <xsl:with-param name="style" select="$style('toc_1')"/>
          <xsl:with-param name="properties" select="$allProperties[. ne 'start-indent']"/>
        </xsl:call-template>
      </axsl:attribute-set>

      <axsl:attribute-set name="__toc__appendix__content">
        <xsl:call-template name="attribute-set">
          <xsl:with-param name="style" select="$style('toc_1')"/>
          <xsl:with-param name="properties" select="$allProperties[. ne 'start-indent']"/>
        </xsl:call-template>
      </axsl:attribute-set>

      <axsl:attribute-set name="__toc__part__content">
        <xsl:call-template name="attribute-set">
          <xsl:with-param name="style" select="$style('toc_1')"/>
          <xsl:with-param name="properties" select="$allProperties[. ne 'start-indent']"/>
        </xsl:call-template>
      </axsl:attribute-set>

      <axsl:attribute-set name="__toc__preface__content">
        <xsl:call-template name="attribute-set">
          <xsl:with-param name="style" select="$style('toc_1')"/>
          <xsl:with-param name="properties" select="$allProperties[. ne 'start-indent']"/>
        </xsl:call-template>
      </axsl:attribute-set>

      <axsl:attribute-set name="__toc__notices__content">
        <xsl:call-template name="attribute-set">
          <xsl:with-param name="style" select="$style('toc_1')"/>
          <xsl:with-param name="properties" select="$allProperties[. ne 'start-indent']"/>
        </xsl:call-template>
      </axsl:attribute-set>

      <axsl:attribute-set name="__toc__topic__content__booklist">
        <xsl:call-template name="attribute-set">
          <xsl:with-param name="style" select="$style('toc_1')"/>
          <xsl:with-param name="properties" select="$allProperties[. ne 'start-indent']"/>
        </xsl:call-template>
      </axsl:attribute-set>
    </axsl:stylesheet>
  </xsl:template>

</xsl:stylesheet>