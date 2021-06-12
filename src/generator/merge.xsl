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
    <xsl:choose>
      <xsl:when test="map:contains($base, 'extends')">
        <xsl:variable name="extends-url" select="resolve-uri($base ?extends, $url)"/>
        <xsl:variable name="extends" select="x:extends(json-doc($extends-url), $extends-url)"/>
        <xsl:sequence select="x:merge($extends, x:normalize($base, (), $extends-url))"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:sequence select="x:normalize($base, (), $url)"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:function>

  <xsl:function name="x:merge" as="item()*" visibility="public">
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

  <xsl:function name="x:normalize" as="item()*" visibility="public">
    <xsl:param name="base" as="item()*"/>
    <xsl:param name="ancestors" as="item()*"/>
    <xsl:param name="url" as="item()"/>
    <xsl:choose>
      <xsl:when test="$base instance of array(*)">
        <xsl:variable name="array" as="map(*)*">
          <xsl:for-each select="1 to array:size($base)">
            <xsl:variable name="index" select="."/>
            <xsl:variable name="value" select="array:get($base, $index)"/>
            <xsl:sequence select="x:normalize($value, $ancestors, $url)"/>
          </xsl:for-each>
        </xsl:variable>
        <xsl:sequence select="array{ $array }"/>
      </xsl:when>
      <xsl:when test="$base instance of map(*)">
        <xsl:map>
          <xsl:if test="empty($ancestors) and not(map:contains($base, 'style'))">
            <xsl:map-entry key="'style'" select="map{}"/>
          </xsl:if>
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
              <xsl:when test="$key = 'background-image'">
                <xsl:variable name="image-url">
                  <xsl:analyze-string select="$value" regex="url\([&quot;'](.+?)[&quot;']\)">
                    <xsl:matching-substring>
                      <xsl:value-of select="regex-group(1)"/>
                    </xsl:matching-substring>
                    <xsl:non-matching-substring>
                      <xsl:value-of select="$value"/>
                    </xsl:non-matching-substring>
                  </xsl:analyze-string>
                </xsl:variable>
                <xsl:map-entry key="$key">
                  <xsl:value-of>
                    <xsl:text>url('</xsl:text>
                    <xsl:value-of select="resolve-uri($image-url, $url)"/>
                    <xsl:text>')</xsl:text>
                  </xsl:value-of>
                </xsl:map-entry>                    
              </xsl:when>
              <xsl:when test="$key = 'border'">
                <xsl:variable name="tokens" select="x:parse-border($value)" as="map(*)"/>
                <xsl:for-each select="('before', 'end', 'after', 'start')">
                  <xsl:map-entry key="concat('border-', ., '-style')" select="$tokens ?style"/>
                  <xsl:map-entry key="concat('border-', ., '-width')" select="$tokens ?width"/>
                  <xsl:map-entry key="concat('border-', ., '-color')" select="$tokens ?color"/>                  
                </xsl:for-each>
              </xsl:when>
              <xsl:when test="matches($key, '^border-(style|width|color)$')">
                <xsl:variable name="type" select="substring-after($key, '-')"/>
                <xsl:for-each select="('before', 'end', 'after', 'start')">
                  <xsl:map-entry key="concat('border-', ., '-', $type)" select="$value"/>
                </xsl:for-each>
              </xsl:when>
              <xsl:when test="$key = ('header', 'footer') and exists(($value ?odd, $value ?even))">
                <xsl:variable name="other" select="x:exclude($value, ('odd', 'even'))" as="map(*)"/>
                <xsl:map-entry key="$key" select="
                  map {
                   'odd': x:normalize(map:merge(($value ?odd, $other)), ($ancestors, $key, 'odd'), $url),
                   'even': x:normalize(map:merge(($value ?even, $other)), ($ancestors, $key, 'even'), $url)
                  }"/>
              </xsl:when>
              <xsl:when test="$key = ('header', 'footer') and empty(($value ?odd, $value ?even))">
                <xsl:map-entry key="$key" select="
                  map {
                    'odd': x:normalize($value, ($ancestors, $key, 'odd'), $url),
                    'even': x:normalize($value, ($ancestors, $key, 'even'), $url)
                  }"/>
              </xsl:when>
              <xsl:otherwise>
                <xsl:map-entry key="$key" select="x:normalize($value, ($ancestors, $key), $url)"/>
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
  
  <xsl:function name="x:exclude">
    <xsl:param name="map" as="map(*)"/>
    <xsl:param name="names" as="item()*"/>
    <xsl:map>
      <xsl:for-each select="map:keys($map)">
        <xsl:if test="not(. = $names)">
          <xsl:map-entry key="." select="map:get($map, .)"/>
        </xsl:if>
      </xsl:for-each>
    </xsl:map>
  </xsl:function>
  
  <xsl:function name="x:parse-border" as="map(*)">
    <xsl:param name="value" as="item()"/>
    <xsl:map>
      <xsl:for-each select="tokenize(normalize-space($value), '\s+')">
        <xsl:choose>
          <xsl:when test="matches(., '^(none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset|inherit)$')">
            <xsl:map-entry key="'style'" select="."/>
          </xsl:when>
          <xsl:when test="matches(., '(cm|mm|in|pt|pc|px|em)$')">
            <xsl:map-entry key="'width'" select="."/>
          </xsl:when>
          <xsl:otherwise>
            <xsl:map-entry key="'color'" select="."/>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:for-each>                    
    </xsl:map>
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
