<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:map="http://www.w3.org/2005/xpath-functions/map"
  xmlns:array="http://www.w3.org/2005/xpath-functions/array" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:x="x"
  exclude-result-prefixes="xs x" version="3.0">

  <xsl:import href="utils.xsl"/>

  <xsl:output method="json"/>

  <xsl:param name="base-url"/>

  <xsl:variable name="separator" select="'-'"/>

  <xsl:template match=".[. instance of map(*)]">
    <xsl:sequence select="x:extends(., $base-url)"/>
  </xsl:template>

  <xsl:function name="x:extends" as="item()*">
    <xsl:param name="base" as="item()*"/>
    <xsl:param name="url"/>

    <xsl:variable name="current" select="x:normalize(x:flatten($base), (), $url)"/>
    <xsl:choose>
      <xsl:when test="map:contains($base, 'extends') and $base ?extends eq 'default'">
        <xsl:sequence select="json-doc(xs:anyURI('classpath:/com/elovirta/pdf/default.json'))"/>
      </xsl:when>
      <xsl:when test="map:contains($base, 'extends')">
        <xsl:variable name="extends-url" select="resolve-uri($base ?extends, $url)"/>
        <xsl:variable name="extends" select="x:extends(json-doc($extends-url), $extends-url)"/>
        <xsl:sequence select="map:merge(($current, $extends),
                                        map{ 'duplicates': 'use-first' })"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:sequence select="$current"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:function>

  <xsl:function name="x:flatten" as="item()*" visibility="public">
    <xsl:param name="root" as="item()"/>
    <xsl:variable name="flattened" as="map(*)">
      <xsl:map>
        <xsl:sequence select="x:flatten-walker($root, $root, ())"/>
      </xsl:map>
    </xsl:variable>
    <xsl:sequence select="map:merge(($flattened), map{ 'duplicates': 'use-first' })"/>
  </xsl:function>

  <xsl:function name="x:flatten-walker" as="item()*">
    <xsl:param name="root" as="map(*)"/>
    <xsl:param name="base" as="map(*)"/>
    <xsl:param name="ancestors" as="item()*"/>

    <xsl:for-each select="map:keys($base)">
      <xsl:variable name="key" select="."/>
      <xsl:variable name="value" select="map:get($base, $key)"/>
      <xsl:choose>
        <xsl:when test="$value instance of map(*)">
          <xsl:sequence select="x:flatten-walker($root, $value, ($ancestors, $key))"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:variable name="flattened-name" select="string-join(($ancestors, $key), $separator) => x:rewrite-key-name()"/>
          <xsl:if test="not(map:contains($root, $flattened-name))">
            <xsl:map-entry key="$flattened-name" select="$value"/>
          </xsl:if>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:for-each>
  </xsl:function>

  <xsl:function name="x:rewrite-key-name" as="xs:string">
    <xsl:param name="key" as="xs:string"/>
    <xsl:value-of select="replace($key, '_', '-')
                       => replace('-(space|border|padding)-top', '-$1-before')
                       => replace('-(space|border|padding)-right', '-$1-end')
                       => replace('-(space|border|padding)-bottom', '-$1-after')
                       => replace('-(space|border|padding)-left', '-$1-start')
                       => replace('^style-h1-', 'style-topic-')
                       => replace('^style-h2-', 'style-topic-topic-')
                       => replace('^style-h3-', 'style-topic-topic-topic-')
                       => replace('^style-h4-', 'style-topic-topic-topic-topic-')"/>
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
          <xsl:for-each select="map:keys($base)">
            <xsl:variable name="key" select="."/>
            <xsl:variable name="value" select="map:get($base, $key)"/>
            <xsl:choose>
              <!-- Parse content DSL into AST -->
              <xsl:when test="matches($key, '-content$') and not($value instance of array(*))">
                <xsl:variable name="tokens" as="item()*">
                  <xsl:analyze-string select="$value" regex="\{{(.+?)\}}">
                    <xsl:matching-substring>
                      <xsl:choose>
                        <xsl:when test="starts-with(regex-group(1), '#')">
                          <xsl:sequence select="map{ 'kind': 'variable', 'value': substring(regex-group(1), 2) }"/>
                        </xsl:when>
                        <xsl:otherwise>
                          <xsl:sequence select="map{ 'kind': 'field', 'value': regex-group(1) }"/>
                        </xsl:otherwise>
                      </xsl:choose>
                    </xsl:matching-substring>
                    <xsl:non-matching-substring>
                      <xsl:sequence select="map{ 'kind': 'text', 'value': .}"/>
                    </xsl:non-matching-substring>
                  </xsl:analyze-string>
                </xsl:variable>
                <xsl:map-entry key="$key" select="array{ $tokens }"/>
              </xsl:when>
              <!-- Map page size and orientation into page dimensions -->
              <xsl:when test="$key = 'page-size' and empty($ancestors)">
                <xsl:variable name="sizes" select="map:get($page-sizes, $value)" as="array(*)?"/>
                <xsl:choose>
                  <xsl:when test="exists($sizes)">
                    <xsl:choose>
                      <xsl:when test="$base ?page-orientation = 'landscape'">
                        <xsl:map-entry key="'page-height'" select="array:get($sizes, 1)"/>
                        <xsl:map-entry key="'page-width'" select="array:get($sizes, 2)"/>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:map-entry key="'page-height'" select="array:get($sizes, 2)"/>
                        <xsl:map-entry key="'page-width'" select="array:get($sizes, 1)"/>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:message terminate="yes" expand-text="yes">ERROR: Page size '{$value}' not supported.</xsl:message>
                  </xsl:otherwise>
                </xsl:choose>
              </xsl:when>
              <xsl:when test="$key = 'page-orientation' and empty($ancestors)"/>
              <!-- Convert image reference to FO format -->
              <xsl:when test="matches($key, '[\-\^]background-image$')">
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
              <xsl:when test="matches($key, '^(header|footer)-(odd|even)-') and empty($ancestors)">
                <xsl:map-entry key="$key" select="x:normalize($value, ($ancestors, $key), $url)"/>
              </xsl:when>
              <!-- Group header and footer styles under odd and even -->
              <xsl:when test="matches($key, '^(header|footer)-') and empty($ancestors)">
                <xsl:variable name="suffix" select="replace($key, '^(header|footer)-.+$', '$1')"/>
                <xsl:for-each select="$allProperties">
                  <xsl:variable name="property" select="."/>
                  <xsl:variable name="common-property-key" select="concat($suffix, '-', $property)"/>
                  <xsl:if test="$key = $common-property-key">
                    <xsl:for-each select="('odd', 'even')">
                      <xsl:variable name="side-property-key" select="concat($suffix, '-', ., '-', $property)"/>
                      <xsl:if test="not(map:contains($base, $side-property-key))">
                        <xsl:map-entry key="$side-property-key" select="$value"/>
                      </xsl:if>
                    </xsl:for-each>
                  </xsl:if>
                </xsl:for-each>
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

  <xsl:function name="x:expandShorthand" as="item()*" visibility="public">
    <xsl:param name="base" as="item()*"/>

    <xsl:map>
      <xsl:for-each select="map:keys($base)">
        <xsl:variable name="key" select="."/>
        <xsl:variable name="value" select="map:get($base, $key)"/>
        <xsl:choose>
          <!-- Expand border shorthand -->
          <xsl:when test="matches($key, '-border$')">
            <xsl:variable name="suffix" select="replace($key, '-border$', '')" as="xs:string"/>
            <xsl:variable name="tokens" select="x:parse-border($value)" as="map(*)"/>
            <xsl:for-each select="('before', 'end', 'after', 'start')">
              <xsl:map-entry key="concat($suffix, '-border-', ., '-style')" select="$tokens ?style"/>
              <xsl:map-entry key="concat($suffix, '-border-', ., '-width')" select="$tokens ?width"/>
              <xsl:map-entry key="concat($suffix, '-border-', ., '-color')" select="$tokens ?color"/>
            </xsl:for-each>
          </xsl:when>
          <xsl:when test="matches($key, '-border-(top|right|bottom|left|before|end|after|start)$')">
            <xsl:variable name="suffix" select="replace($key, '-border-(top|right|bottom|left|before|end|after|start)$', '')" as="xs:string"/>
            <xsl:variable name="tokens" select="x:parse-border($value)" as="map(*)"/>
            <xsl:variable name="direction">
              <xsl:choose>
                <xsl:when test="matches($key, '-border-(top|before)$')">before</xsl:when>
                <xsl:when test="matches($key, '-border-(right|end)$')">end</xsl:when>
                <xsl:when test="matches($key, '-border-(bottom|after)$')">after</xsl:when>
                <xsl:when test="matches($key, '-border-(left|start)$')">start</xsl:when>
              </xsl:choose>
            </xsl:variable>
            <xsl:map-entry key="concat($suffix, '-border-', $direction, '-style')" select="$tokens ?style"/>
            <xsl:map-entry key="concat($suffix, '-border-', $direction, '-width')" select="$tokens ?width"/>
            <xsl:map-entry key="concat($suffix, '-border-', $direction, '-color')" select="$tokens ?color"/>
          </xsl:when>
          <xsl:when test="matches($key, '-border-(style|width|color)$')">
            <xsl:variable name="suffix" select="replace($key, '-border-(style|width|color)$', '')" as="xs:string"/>
            <xsl:variable name="type" select="replace($key, '^.+-(style|width|color)$', '$1')"/>
            <xsl:for-each select="('before', 'end', 'after', 'start')">
              <xsl:map-entry key="concat($suffix, '-border-', ., '-', $type)" select="$value"/>
            </xsl:for-each>
          </xsl:when>
          <xsl:otherwise>
            <xsl:map-entry key="$key" select="$value"/>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:for-each>
    </xsl:map>
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

  <xsl:function name="x:resolve" as="map(*)" visibility="public">
    <xsl:param name="base" as="map(*)"/>

    <xsl:variable name="keys" select="$base" as="map(*)"/>
    <xsl:sequence select="x:resolveVariables($base, $keys)"/>
  </xsl:function>

  <xsl:function name="x:flatten" as="map(*)">
    <xsl:param name="base" as="item()"/>
    <xsl:param name="ancestors" as="item()*"/>

    <xsl:choose>
      <xsl:when test="$base instance of array(*)">
       <xsl:map/>
      </xsl:when>
      <xsl:when test="$base instance of map(*)">
        <xsl:variable name="maps" as="map(*)*">
          <xsl:for-each select="map:keys($base)">
            <xsl:variable name="key" select="."/>
            <xsl:variable name="value" select="map:get($base, $key)"/>
            <xsl:sequence select="x:flatten($value, ($ancestors, $key))"/>
          </xsl:for-each>
        </xsl:variable>
        <xsl:sequence select="map:merge($maps)"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:map>
          <xsl:map-entry key="string-join($ancestors, $separator)" select="$base"/>
        </xsl:map>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:function>

  <!-- Resolve variables in flattened theme -->
  <xsl:function name="x:resolveVariables" as="item()">
    <xsl:param name="base" as="item()"/>
    <xsl:param name="keys" as="map(*)"/>

    <xsl:choose>
      <xsl:when test="$base instance of map(*)">
        <xsl:map>
          <xsl:for-each select="map:keys($base)">
            <xsl:variable name="key" select="."/>
            <xsl:variable name="value" select="map:get($base, $key)"/>
            <xsl:map-entry key="." select="x:resolveVariables($value, $keys)"/>
          </xsl:for-each>
        </xsl:map>
      </xsl:when>
      <xsl:when test="$base instance of array(*)">
        <xsl:variable name="array" as="item()*">
          <xsl:for-each select="1 to array:size($base)">
            <xsl:variable name="index" select="."/>
            <xsl:variable name="value" select="array:get($base, $index)"/>
            <xsl:sequence select="x:resolveVariables($value, $keys)"/>
          </xsl:for-each>
        </xsl:variable>
        <xsl:sequence select="array{ $array }"/>
      </xsl:when>
      <xsl:when test="$base instance of xs:string and matches($base, '\$[\w-]+')">
        <xsl:value-of>
          <xsl:analyze-string select="$base" regex="\$[\w-]+">
            <xsl:matching-substring>
              <xsl:variable name="variable" select="substring(., 2)"/>
              <xsl:choose>
                <xsl:when test="map:contains($keys, $variable)">
                  <xsl:sequence select="map:get($keys, $variable)"/>
                </xsl:when>
                <xsl:otherwise>
                  <xsl:message>[ERROR] No binding for variable <xsl:value-of select="$variable"/> found</xsl:message>
                  <xsl:sequence select="."/>
                </xsl:otherwise>
              </xsl:choose>
            </xsl:matching-substring>
            <xsl:non-matching-substring>
              <xsl:value-of select="."/>
            </xsl:non-matching-substring>
          </xsl:analyze-string>
        </xsl:value-of>
      </xsl:when>
      <xsl:otherwise>
        <xsl:sequence select="$base"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:function>

</xsl:stylesheet>
