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

      <axsl:attribute-set name="hazardstatement">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-hazardstatement'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="hazardstatement.title">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-hazardstatement-label'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <xsl:for-each select="('danger', 'warning', 'caution', 'notice')">
        <axsl:attribute-set name="hazardstatement.title.{.}">
          <xsl:call-template name="generate-attribute-set">
            <xsl:with-param name="prefix" select="concat('style-hazardstatement-',. ,'-label')"/>
          </xsl:call-template>
        </axsl:attribute-set>
      </xsl:for-each>
      <xsl:for-each select="('messagepanel', 'consequence', 'howtoavoid', 'typeofhazard', 'hazardsymbol')">
        <axsl:attribute-set name="{.}">
          <xsl:call-template name="generate-attribute-set">
            <xsl:with-param name="prefix" select="concat('style-', .)"/>
          </xsl:call-template>
        </axsl:attribute-set>
      </xsl:for-each>
    </axsl:stylesheet>
  </xsl:template>

</xsl:stylesheet>