<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:map="http://www.w3.org/2005/xpath-functions/map"
  xmlns:array="http://www.w3.org/2005/xpath-functions/array" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:x="x"
  exclude-result-prefixes="xs x" version="3.0">

  <xsl:output method="json"/>

  <xsl:param name="base-url"/>

  <xsl:template match=".[. instance of map(*)]">
    <xsl:sequence select="x:extends(., $base-url)"/>
  </xsl:template>
  
  <xsl:function name="x:extends" as="item()*">
    <xsl:param name="base" as="item()*"/>
    <xsl:param name="url"/>
    <xsl:message select="$url"/>
    <xsl:choose>
      <xsl:when test="map:contains($base, 'extends')">
        <xsl:variable name="extends-url" select="resolve-uri($base ?extends, $url)"/>
        <xsl:variable name="extends" select="x:extends(json-doc($extends-url), $extends-url)"/>
        <xsl:sequence select="x:merge($extends, x:normalize($base, ()))"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:sequence select="x:normalize($base, ())"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:function>

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

  <xsl:function name="x:normalize" as="item()*">
    <xsl:param name="base" as="item()*"/>
    <xsl:param name="ancestors" as="item()*"/>
    <xsl:choose>
      <xsl:when test="$base instance of array(*)">
        <xsl:variable name="array" as="map(*)*">
          <xsl:for-each select="1 to array:size($base)">
            <xsl:variable name="index" select="."/>
            <xsl:variable name="value" select="array:get($base, $index)"/>
            <xsl:sequence select="x:normalize($value, $ancestors)"/>
          </xsl:for-each>
        </xsl:variable>
        <xsl:sequence select="array{ $array }"/>
      </xsl:when>
      <xsl:when test="$base instance of map(*)">
        <xsl:map>
          <xsl:for-each select="map:keys($base)">
            <xsl:variable name="key" select="."/>
            <xsl:variable name="value" select="map:get($base, $key)"/>
            <xsl:choose>
              <xsl:when test="$key = 'content' and not($value instance of array(*))">
                <xsl:variable name="tokens" as="item()*">
                  <xsl:analyze-string select="$value" regex="\{{(.+?)\}}">
                    <xsl:matching-substring>
                      <xsl:sequence select="map{ 'kind': 'field', 'value': regex-group(1)}"/>
                    </xsl:matching-substring>
                    <xsl:non-matching-substring>
                      <xsl:sequence select="map{ 'kind': 'text', 'value': .}"/>
                    </xsl:non-matching-substring>
                  </xsl:analyze-string>
                </xsl:variable>
                <xsl:map-entry key="$key" select="array{ $tokens }"/>
              </xsl:when>
              <xsl:when test="$key = 'size' and $ancestors = ('page')">
                <xsl:variable name="sizes" select="map:get($page-sizes, $value)" as="array(*)?"/>
                <xsl:choose>
                  <xsl:when test="exists($sizes)">
                    <xsl:choose>
                      <xsl:when test="$base ?orientation = 'landscape'">
                        <xsl:map-entry key="'height'" select="array:get($sizes, 1)"/>
                        <xsl:map-entry key="'width'" select="array:get($sizes, 2)"/>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:map-entry key="'height'" select="array:get($sizes, 2)"/>
                        <xsl:map-entry key="'width'" select="array:get($sizes, 1)"/>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:message terminate="yes" expand-text="yes">ERROR: Page size '{$value}' not supported.</xsl:message>
                  </xsl:otherwise>
                </xsl:choose>
              </xsl:when>
              <xsl:when test="$key = 'orientation' and $ancestors = ('page')"/>
              <xsl:otherwise>
                <xsl:map-entry key="$key" select="x:normalize($value, ($ancestors, $key))"/>
              </xsl:otherwise>
            </xsl:choose>
          </xsl:for-each>
        </xsl:map>
      </xsl:when>
      <xsl:otherwise>
        <xsl:sequence select="$base"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:function>

  <xsl:variable name="page-sizes" as="map(*)" select="map{
    'A3': ['297mm', '420mm'],
    'A4': ['210mm', '297mm'],
    'A5': ['148mm', '210mm'],
    'Executive': ['184.1mm', '266.7mm'],
    'JIS B5': ['182mm', '257mm'],
    'Tabloid': ['431.8mm', '279.4mm'],
    'Legal': ['8.5in', '14in'],
    'Letter': ['8.5in', '11in'],
    'PA4': ['210mm', '280mm'] 
    }"/>
  

</xsl:stylesheet>
