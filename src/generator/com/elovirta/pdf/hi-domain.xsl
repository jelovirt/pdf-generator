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
      <axsl:attribute-set name="b">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-b'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="i">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-i'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="u">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-u'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="tt">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-tt'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="sup">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-sup'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="sub">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-sub'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="line-through">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-line-through'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="overline">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-overline'"/>
        </xsl:call-template>
      </axsl:attribute-set>
    </axsl:stylesheet>
  </xsl:template>

</xsl:stylesheet>