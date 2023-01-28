<xsl:stylesheet version="3.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:axsl="http://www.w3.org/1999/XSL/Transform/alias"
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
      <axsl:attribute-set name="prereq">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-prereq'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="context">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-context'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="steps">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-steps'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="steps-informal">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-steps-informal'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="steps-unordered">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-steps-unordered'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="step">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-step'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="stepsection">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-stepsection'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="cmd">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-cmd'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="info">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-info'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="substeps">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-substeps'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="substep">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-substep'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="stepxmp">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-stepxmp'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="choicetable">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-choicetable'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="chhead">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-chhead'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="choptionhd">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-choptionhd'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="chdeschd">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-chdeschd'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="chrow">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-chrow'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="choption">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-choption'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="chdesc">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-chdesc'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="choices">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-choices'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="choice">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-choice'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="steptroubleshooting">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-steptroubleshooting'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="stepresult">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-stepresult'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="tutorialinfo">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-tutorialinfo'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="tasktroubleshooting">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-tasktroubleshooting'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="result">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-result'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="postreq">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-postreq'"/>
        </xsl:call-template>
      </axsl:attribute-set>
    </axsl:stylesheet>
  </xsl:template>

</xsl:stylesheet>