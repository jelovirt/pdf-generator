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
      <xsl:variable name="link" select="$style('link')" as="map(*)"/>
    </axsl:stylesheet>
  </xsl:template>

  <xsl:template match=".[. instance of map(*)]" mode="attr">
    <axsl:stylesheet version="2.0">
      <axsl:attribute-set name="link__shortdesc">

      </axsl:attribute-set>
    </axsl:stylesheet>
  </xsl:template>

</xsl:stylesheet>