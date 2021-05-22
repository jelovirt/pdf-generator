<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:map="http://www.w3.org/2005/xpath-functions/map"
  xmlns:array="http://www.w3.org/2005/xpath-functions/array" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:x="x"
  exclude-result-prefixes="xs x" version="3.0">

  <xsl:output method="json"/>

  <xsl:param name="theme" as="item()*"/>

  <xsl:template match=".[. instance of map(*)]">
    <xsl:variable name="merged" select="x:merge(., $theme)"/>
    <xsl:sequence select="$merged"/>$>
  </xsl:template>

  <xsl:function name="x:merge" as="item()*">
    <xsl:param name="base" as="item()*"/>
    <xsl:param name="theme" as="item()*"/>
    <xsl:choose>
      <xsl:when test="empty($base)">
        <xsl:sequence select="$theme"/>
      </xsl:when>
      <xsl:when test="empty($theme)">
        <xsl:sequence select="$base"/>
      </xsl:when>
      <xsl:when test="$base instance of array(*) or $theme instance of array(*)">
        <xsl:sequence select="
            if (exists($theme)) then
              $theme
            else
              $base"/>
      </xsl:when>
      <xsl:when test="$base instance of map(*) or $theme instance of map(*)">
        <xsl:map>
          <xsl:variable name="all-keys" select="distinct-values((map:keys($base), map:keys($theme)))"/>
          <xsl:for-each select="$all-keys">
            <xsl:map-entry key="." select="x:merge(map:get($base, .), map:get($theme, .))"/>
          </xsl:for-each>
        </xsl:map>
      </xsl:when>
      <xsl:otherwise>
        <xsl:sequence select="
            if (exists($theme)) then
              $theme
            else
              $base"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:function>

</xsl:stylesheet>
