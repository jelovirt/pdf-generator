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

  <xsl:template match=".[. instance of map(*)]">
    <axsl:stylesheet version="2.0">
      <xsl:call-template name="generate-namespace-node"/>
    </axsl:stylesheet>
  </xsl:template>

  <xsl:template match=".[. instance of map(*)]" mode="attr">
    <axsl:stylesheet version="2.0">
      <xsl:call-template name="generate-namespace-node"/>
      <axsl:attribute-set name="filepath">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-filepath'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="cmdname">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-cmdname'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="varname">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-varname'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="userinput">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-userinput'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="systemoutput">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-systemoutput'"/>
        </xsl:call-template>
      </axsl:attribute-set>
    </axsl:stylesheet>
  </xsl:template>

</xsl:stylesheet>