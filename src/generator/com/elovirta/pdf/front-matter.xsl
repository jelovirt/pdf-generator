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
<!--      <xsl:if test="map:contains($root, 'cover-image-metadata') or map:contains($root, 'cover-image-topic')">-->
      <axsl:template name="createFrontCoverContents">
        <!-- set the title -->
        <fo:block axsl:use-attribute-sets="__frontmatter__title">
          <xsl:call-template name="insert-content">
            <xsl:with-param name="id" select="'cover-title'"/>
          </xsl:call-template>
<!--            <axsl:choose>-->
<!--              <axsl:when test="$map/*[contains(@class,' topic/title ')][1]">-->
<!--                <axsl:apply-templates select="$map/*[contains(@class,' topic/title ')][1]"/>-->
<!--              </axsl:when>-->
<!--              <axsl:when test="$map//*[contains(@class,' bookmap/mainbooktitle ')][1]">-->
<!--                <axsl:apply-templates select="$map//*[contains(@class,' bookmap/mainbooktitle ')][1]"/>-->
<!--              </axsl:when>-->
<!--              <axsl:when test="//*[contains(@class, ' map/map ')]/@title">-->
<!--                <axsl:value-of select="//*[contains(@class, ' map/map ')]/@title"/>-->
<!--              </axsl:when>-->
<!--              <axsl:otherwise>-->
<!--                <axsl:value-of-->
<!--                    select="/descendant::*[contains(@class, ' topic/topic ')][1]/*[contains(@class, ' topic/title ')]"/>-->
<!--              </axsl:otherwise>-->
<!--            </axsl:choose>-->
        </fo:block>
        <!-- set the subtitle -->
        <axsl:apply-templates select="$map//*[contains(@class,' bookmap/booktitlealt ')]"/>
<!--          <fo:block axsl:use-attribute-sets="__frontmatter__owner">-->
<!--            <axsl:apply-templates select="$map//*[contains(@class,' bookmap/bookmeta ')]"/>-->
<!--          </fo:block>-->
        <!-- cover image -->
        <fo:block axsl:use-attribute-sets="image__block">
          <axsl:call-template name="e:cover-image"/>
        </fo:block>
      </axsl:template>
      <xsl:choose>
        <xsl:when test="map:contains($root, 'cover-image-metadata')">
          <axsl:template name="e:cover-image">
            <axsl:apply-templates
                select="$map//*[contains(@class, ' topic/data ')][@name = '{$root ?cover-image-metadata}']/node()"/>
          </axsl:template>
        </xsl:when>
        <xsl:when test="map:contains($root, 'cover-image-topic')">
          <axsl:template name="e:cover-image">
            <axsl:for-each
                select="($map//*[contains(@class, ' map/topicref ')][@outputclass = '{$root ?cover-image-topic}'])[1]">
              <axsl:apply-templates select="key('id', @id)/*[contains(@class, ' topic/body ')]/node()"/>
            </axsl:for-each>
          </axsl:template>
        </xsl:when>
        <xsl:otherwise>
          <axsl:template name="e:cover-image"/>
        </xsl:otherwise>
      </xsl:choose>
<!--      </xsl:if>-->
    </axsl:stylesheet>
  </xsl:template>

  <xsl:template match=".[. instance of map(*)]" mode="attr">
    <axsl:stylesheet version="2.0">
      <xsl:call-template name="generate-namespace-node"/>
      <axsl:attribute-set name="__frontmatter">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-cover'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="__frontmatter__title">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-cover_title'"/>
        </xsl:call-template>
      </axsl:attribute-set>
    </axsl:stylesheet>
  </xsl:template>

</xsl:stylesheet>