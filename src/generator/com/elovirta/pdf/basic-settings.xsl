<xsl:stylesheet version="3.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:axsl="http://www.w3.org/1999/XSL/Transform/alias"
                xmlns:fo="http://www.w3.org/1999/XSL/Format"
                xmlns:map="http://www.w3.org/2005/xpath-functions/map"
                xmlns:array="http://www.w3.org/2005/xpath-functions/array"
                exclude-result-prefixes="axsl map array">

  <xsl:import href="utils.xsl"/>

  <xsl:namespace-alias stylesheet-prefix="axsl" result-prefix="xsl"/>

  <xsl:output indent="no"/>

  <xsl:template match=".[. instance of map(*)]">
    <xsl:message terminate="yes">Not supported</xsl:message>
  </xsl:template>

  <xsl:template match=".[. instance of map(*)]" mode="attr">
    <axsl:stylesheet version="2.0">
      <xsl:call-template name="generate-namespace-node"/>
      <axsl:param name="pdfFormatter" select="'{. ?formatter}'"/>
      <xsl:if test="map:contains($root, 'style-toc-maximum-level')">
        <axsl:param name="tocMaximumLevel" select="{$root ?style-toc-maximum-level}"/>
      </xsl:if>
      <!-- page size -->
      <xsl:if test="map:contains($root, 'page-width')">
        <axsl:variable name="page-width">
          <xsl:value-of select="$root ?page-width"/>
        </axsl:variable>
      </xsl:if>
      <xsl:if test="map:contains($root, 'page-height')">
        <axsl:variable name="page-height">
          <xsl:value-of select="$root ?page-height"/>
        </axsl:variable>
      </xsl:if>
      <!-- mirror pages -->
      <xsl:if test="$root ?page-mirror-margins">
        <axsl:variable name="mirror-page-margins" select="{$root ?page-mirror-margins}()"/>
      </xsl:if>
      <!-- page margins -->
      <xsl:for-each select="('top', 'outside', 'bottom', 'inside')">
        <xsl:variable name="key" select="concat('page-', .)"/>
        <xsl:if test="map:contains($root, $key)">
          <axsl:variable name="page-margin-{.}">
            <xsl:value-of select="$root($key)"/>
          </axsl:variable>
        </xsl:if>
      </xsl:for-each>
      <!-- font size -->
      <xsl:if test="map:contains($root, 'style-body-font-size')">
        <axsl:variable name="default-font-size">
          <xsl:value-of select="$root ?style-body-font-size"/>
        </axsl:variable>
      </xsl:if>
      <!-- line height -->
      <xsl:if test="map:contains($root, 'style-body-line-height')">
        <axsl:variable name="default-line-height">
          <xsl:value-of select="$root ?style-body-line-height"/>
        </axsl:variable>
      </xsl:if>
      <!-- body indent -->
      <xsl:if test="map:contains($root, 'style-body-start-indent')">
        <axsl:variable name="side-col-width">
          <xsl:value-of select="$root ?style-body-start-indent"/>
        </axsl:variable>
      </xsl:if>
      <axsl:variable name="antArgsChapterLayout">
        <xsl:value-of select="if (map:contains($root, 'style-chapter-toc') and not($root ?style-chapter-toc))
                              then 'BASIC'
                              else if (map:contains($root, 'chapter-layout'))
                              then $root ?chapter-layout
                              else 'BASIC'"/>
      </axsl:variable>
      <axsl:variable name="partLayout">
        <xsl:value-of select="if (map:contains($root, 'style-part-toc') and not($root ?style-part-toc))
                              then 'BASIC'
                              else if (map:contains($root, 'part-layout'))
                              then $root ?part-layout
                              else 'BASIC'"/>
      </axsl:variable>
      <axsl:variable name="appendixLayout">
        <xsl:value-of select="if (map:contains($root, 'style-appendix-toc') and not($root ?style-appendix-toc))
                              then 'BASIC'
                              else if (map:contains($root, 'appendix-layout'))
                              then $root ?appendix-layout
                              else 'BASIC'"/>
      </axsl:variable>
    </axsl:stylesheet>
  </xsl:template>

</xsl:stylesheet>