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
    <axsl:stylesheet version="2.0">
      <xsl:call-template name="generate-namespace-node"/>
    </axsl:stylesheet>
  </xsl:template>

  <xsl:template match=".[. instance of map(*)]" mode="attr">
    <axsl:stylesheet version="2.0">
      <xsl:call-template name="generate-namespace-node"/>
      <axsl:attribute-set name="xmlelement">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-xmlelement'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="xmlatt">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-xmlatt'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="textentity">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-textentity'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="parameterentity">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-parameterentity'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="numcharref">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-numcharref'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="xmlnsname">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-xmlnsname'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="xmlpi">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-xmlpi'"/>
        </xsl:call-template>
      </axsl:attribute-set>
    </axsl:stylesheet>
  </xsl:template>

</xsl:stylesheet>