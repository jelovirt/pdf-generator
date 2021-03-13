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
      <xsl:variable name="link" select="$style => map:get('ol')" as="map(*)"/>
      <xsl:if test="exists($style('ol')) or exists($style('ul'))">
        <xsl:comment>list</xsl:comment>

        <axsl:template match="*[contains(@class, ' topic/ul ')]/*[contains(@class, ' topic/li ')]">
          <axsl:variable name="depth" select="count(ancestor::*[contains(@class, ' topic/ul ')])"/>
          <fo:list-item axsl:use-attribute-sets="ul.li">
            <fo:list-item-label axsl:use-attribute-sets="ul.li__label">
              <fo:block axsl:use-attribute-sets="ul.li__label__content">
                <fo:inline>
                  <axsl:call-template name="commonattributes"/>
                </fo:inline>
                <axsl:call-template name="getVariable">
                  <axsl:with-param name="id" select="concat('Unordered List bullet ', $depth)"/>
                </axsl:call-template>
              </fo:block>
            </fo:list-item-label>
            <fo:list-item-body axsl:use-attribute-sets="ul.li__body">
              <fo:block axsl:use-attribute-sets="ul.li__content">
                <axsl:apply-templates/>
              </fo:block>
            </fo:list-item-body>
          </fo:list-item>
        </axsl:template>

        <axsl:template match="*[contains(@class, ' topic/ol ')]/*[contains(@class, ' topic/li ')]">
          <axsl:variable name="depth" select="count(ancestor::*[contains(@class, ' topic/ol ')])"/>
          <axsl:variable name="format">
            <axsl:call-template name="getVariable">
              <axsl:with-param name="id" select="concat('Ordered List Format ', $depth)"/>
            </axsl:call-template>
          </axsl:variable>
          <fo:list-item axsl:use-attribute-sets="ol.li">
            <fo:list-item-label axsl:use-attribute-sets="ol.li__label">
              <fo:block axsl:use-attribute-sets="ol.li__label__content">
                <fo:inline>
                  <axsl:call-template name="commonattributes"/>
                </fo:inline>
                <axsl:call-template name="getVariable">
                  <axsl:with-param name="id" select="concat('Ordered List Number ', $depth)"/>
                  <axsl:with-param name="params" as="element()*">
                    <number>
                      <axsl:number format="{{$format}}"/>
                    </number>
                  </axsl:with-param>
                </axsl:call-template>
              </fo:block>
            </fo:list-item-label>
            <fo:list-item-body axsl:use-attribute-sets="ol.li__body">
              <fo:block axsl:use-attribute-sets="ol.li__content">
                <axsl:apply-templates/>
              </fo:block>
            </fo:list-item-body>
          </fo:list-item>
        </axsl:template>
      </xsl:if>

      <!-- Attributes -->
      <axsl:attribute-set name="ol">
        <axsl:attribute name="provisional-distance-between-starts">
          <axsl:call-template name="e:list-label-length"/>
          <axsl:text>em * 0.7</axsl:text>
        </axsl:attribute>
      </axsl:attribute-set>

      <axsl:template name="e:list-label-length">
        <axsl:variable name="labels" as="xs:integer*">
          <axsl:variable name="depth" select="count(ancestor-or-self::*[contains(@class, ' topic/ol ')])"/>
          <axsl:variable name="format" as="xs:string">
            <axsl:call-template name="getVariable">
              <axsl:with-param name="id" select="concat('Ordered List Format ', $depth)"/>
            </axsl:call-template>
          </axsl:variable>
          <axsl:for-each select="*[contains(@class, ' topic/li ')]">
            <axsl:variable name="s">
              <axsl:call-template name="getVariable">
                <axsl:with-param name="id" select="concat('Ordered List Number ', $depth)"/>
                <axsl:with-param name="params" as="element()*">
                  <number>
                    <axsl:number format="{{$format}}"/>
                  </number>
                </axsl:with-param>
              </axsl:call-template>
            </axsl:variable>
            <axsl:sequence select="string-length(normalize-space($s))"/>
          </axsl:for-each>
        </axsl:variable>
        <axsl:sequence select="max($labels)"/>
      </axsl:template>

    </axsl:stylesheet>
  </xsl:template>

</xsl:stylesheet>