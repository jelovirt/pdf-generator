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

      <axsl:template match="*" mode="processTopicPrefaceInsideFlow">
        <fo:block axsl:use-attribute-sets="topic">
          <!-- TODO: Replace with mode="commonattributes" -->
          <axsl:call-template name="commonattributes"/>
          <axsl:if test="not(ancestor::*[contains(@class, ' topic/topic ')])">
            <fo:marker marker-class-name="current-topic-number">
              <axsl:number format="1"/>
            </fo:marker>
            <axsl:apply-templates select="." mode="insertTopicHeaderMarker"/>
          </axsl:if>
          <axsl:apply-templates select="." mode="customTopicMarker"/>
          <axsl:apply-templates select="*[contains(@class,' topic/prolog ')]"/>
<!--          <axsl:apply-templates select="." mode="insertChapterFirstpageStaticContent">-->
<!--            <axsl:with-param name="type" select="'preface'"/>-->
<!--          </axsl:apply-templates>-->
          <fo:block axsl:use-attribute-sets="topic.title">
            <axsl:apply-templates select="." mode="customTopicAnchor"/>
            <axsl:call-template name="pullPrologIndexTerms"/>
            <axsl:apply-templates select="*[contains(@class,' ditaot-d/ditaval-startprop ')]"/>
            <axsl:for-each select="child::*[contains(@class,' topic/title ')]">
              <axsl:apply-templates select="." mode="getTitle"/>
            </axsl:for-each>
          </fo:block>
          <axsl:apply-templates select="*[not(contains(@class,' topic/title ') or
                                             contains(@class,' ditaot-d/ditaval-startprop '))]"/>
        </fo:block>
      </axsl:template>

    </axsl:stylesheet>
  </xsl:template>

  <xsl:template match=".[. instance of map(*)]" mode="attr">
    <axsl:stylesheet version="2.0">
      <xsl:call-template name="generate-namespace-node"/>
    </axsl:stylesheet>
  </xsl:template>

</xsl:stylesheet>
