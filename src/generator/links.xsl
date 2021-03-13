<xsl:stylesheet version="3.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:axsl="http://www.w3.org/1999/XSL/Transform/alias"
                xmlns:fo="http://www.w3.org/1999/XSL/Format"
                xmlns:map="http://www.w3.org/2005/xpath-functions/map"
                xmlns:array="http://www.w3.org/2005/xpath-functions/array"
                exclude-result-prefixes="axsl map array">

  <xsl:namespace-alias stylesheet-prefix="axsl" result-prefix="xsl"/>

  <xsl:output indent="yes"/>

  <xsl:template match=".[. instance of map(*)]">
    <axsl:stylesheet version="2.0">
      <xsl:variable name="style" select=". => map:get('conf') => map:get('style')" as="map(*)"/>
      <xsl:variable name="link" select="$style => map:get('link')" as="map(*)"/>
      <xsl:if test="$link('link-url')">
      <xsl:comment>Link</xsl:comment>
      <axsl:template match="*[contains(@class,' topic/xref ')]" name="topic.xref">
        <fo:inline>
          <axsl:call-template name="commonattributes"/>
        </fo:inline>
        <axsl:variable name="destination" select="opentopic-func:getDestinationId(@href)"/>
        <axsl:variable name="element" select="key('key_anchor',$destination)[1]"/>
        <axsl:variable name="referenceTitle">
          <axsl:xapply-templates select="." mode="insertReferenceTitle">
            <axsl:with-param name="href" select="@href"/>
            <axsl:with-param name="titlePrefix" select="''"/>
            <axsl:with-param name="destination" select="$destination"/>
            <axsl:with-param name="element" select="$element"/>
          </axsl:xapply-templates>
        </axsl:variable>
        <fo:basic-link axsl:use-attribute-sets="xref">
          <axsl:call-template name="buildBasicLinkDestination">
            <axsl:with-param name="scope" select="@scope"/>
            <axsl:with-param name="format" select="@format"/>
            <axsl:with-param name="href" select="@href"/>
          </axsl:call-template>
          <axsl:choose>
            <axsl:when test="not(@scope = 'external' or @format = 'html') and not($referenceTitle = '')">
              <axsl:copy-of select="$referenceTitle"/>
            </axsl:when>
            <axsl:when test="not(@scope = 'external' or @format = 'html')">
              <axsl:call-template name="insertPageNumberCitation">
                <axsl:with-param name="isTitleEmpty" select="true()"/>
                <axsl:with-param name="destination" select="$destination"/>
                <axsl:with-param name="element" select="$element"/>
              </axsl:call-template>
            </axsl:when>
            <axsl:otherwise>
              <axsl:choose>
                <axsl:when test="exists(*[not(contains(@class,' topic/desc '))] | text()) and
                            exists(processing-instruction('ditaot')[. = 'usertext'])">
                  <axsl:xapply-templates select="*[not(contains(@class,' topic/desc '))] | text()"/>
                </axsl:when>
                <axsl:otherwise>
                  <axsl:value-of select="e:format-link-url(@href)"/>
                </axsl:otherwise>
              </axsl:choose>
            </axsl:otherwise>
          </axsl:choose>
        </fo:basic-link>
        <axsl:if
            test="not(@scope = 'external' or @format = 'html') and not($referenceTitle = '') and not($element[contains(@class, ' topic/fn ')])">
          <axsl:if test="not(processing-instruction('ditaot')[. = 'usertext'])">
            <axsl:call-template name="insertPageNumberCitation">
              <axsl:with-param name="destination" select="$destination"/>
              <axsl:with-param name="element" select="$element"/>
            </axsl:call-template>
          </axsl:if>
        </axsl:if>
        <axsl:if test="@scope = 'external' and exists(processing-instruction('ditaot')[. = 'usertext'])">
          <axsl:text>at</axsl:text>
          <axsl:value-of select="e:format-link-url(@href)"/>
        </axsl:if>
      </axsl:template>
        <axsl:function name="e:format-link-url">
          <axsl:param name="href"/>
          <axsl:variable name="h" select="if (starts-with($href, 'http://')) then substring($href, 8) else $href"/>
          <axsl:value-of
              select="if (contains($h, '/') and substring-after($h, '/') = '') then substring($h, 0, string-length($h)) else $h"/>
        </axsl:function>
      </xsl:if>

      <!-- Attributes -->
      <axsl:attribute-set name="link__shortdesc">
        <xsl:call-template name="attribute-set">
          <xsl:with-param name="style" select="$style => map:get('body')"/>
          <xsl:with-param name="properties" select="'space-after'"/>
        </xsl:call-template>
        <axsl:attribute name="start-indent">from-parent(start-indent) + 15pt</axsl:attribute>
      </axsl:attribute-set>

    </axsl:stylesheet>
  </xsl:template>

  <xsl:template name="attribute-set">
    <xsl:param name="style" as="map(*)"/>
    <xsl:param name="properties"/>
    <xsl:for-each select="$properties">
      <axsl:attribute name="{.}">
        <xsl:value-of select="$style(.)"/>
      </axsl:attribute>
    </xsl:for-each>
  </xsl:template>

</xsl:stylesheet>