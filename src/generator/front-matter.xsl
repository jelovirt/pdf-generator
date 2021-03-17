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
      <xsl:if test="exists(.('cover_image_metadata')) or exists(.('cover_image_topic'))">
        <axsl:template name="createFrontCoverContents">
          <!-- set the title -->
          <fo:block axsl:use-attribute-sets="__frontmatter__title">
            <axsl:choose>
              <axsl:when test="$map/*[contains(@class,' topic/title ')][1]">
                <axsl:apply-templates select="$map/*[contains(@class,' topic/title ')][1]"/>
              </axsl:when>
              <axsl:when test="$map//*[contains(@class,' bookmap/mainbooktitle ')][1]">
                <axsl:apply-templates select="$map//*[contains(@class,' bookmap/mainbooktitle ')][1]"/>
              </axsl:when>
              <axsl:when test="//*[contains(@class, ' map/map ')]/@title">
                <axsl:value-of select="//*[contains(@class, ' map/map ')]/@title"/>
              </axsl:when>
              <axsl:otherwise>
                <axsl:value-of
                    select="/descendant::*[contains(@class, ' topic/topic ')][1]/*[contains(@class, ' topic/title ')]"/>
              </axsl:otherwise>
            </axsl:choose>
          </fo:block>
          <!-- set the subtitle -->
          <axsl:apply-templates select="$map//*[contains(@class,' bookmap/booktitlealt ')]"/>
          <fo:block axsl:use-attribute-sets="__frontmatter__owner">
            <axsl:apply-templates select="$map//*[contains(@class,' bookmap/bookmeta ')]"/>
          </fo:block>
          <!-- cover image -->
          <fo:block axsl:use-attribute-sets="image__block">
            <axsl:call-template name="e:cover-image"/>
          </fo:block>
        </axsl:template>
        <xsl:choose>
          <xsl:when test="exists(.('cover_image_metadata'))">
            <axsl:template name="e:cover-image">
              <axsl:for-each
                  select="($map//*[contains(@class, ' topic/data ')][@name = '{.('cover_image_metadata')}']/*[contains(@class, ' topic/image ')])[1]">
                <axsl:apply-templates select="." mode="placeImage">
                  <axsl:with-param name="imageAlign" select="@align"/>
                  <axsl:with-param name="href" select="if (@scope = 'external' or opentopic-func:isAbsolute(@href)) then @href else concat($input.dir.url, @href)"/>
                  <axsl:with-param name="height" select="@height"/>
                  <axsl:with-param name="width" select="@width"/>
                </axsl:apply-templates>
              </axsl:for-each>
            </axsl:template>
          </xsl:when>
          <xsl:when test=".('cover_image_topic')">
            <axsl:template name="e:cover-image">
              <axsl:for-each
                  select="($map//*[contains(@class, ' map/topicref ')][@outputclass = '{.('cover_image_topic')}'])[1]">
                <axsl:apply-templates select="key('id', @id)/*[contains(@class, ' topic/body ')]/node()"/>
              </axsl:for-each>
            </axsl:template>
          </xsl:when>
        </xsl:choose>
      </xsl:if>
    </axsl:stylesheet>
  </xsl:template>

  <xsl:template match=".[. instance of map(*)]" mode="attr">
    <axsl:stylesheet version="2.0">
    </axsl:stylesheet>
  </xsl:template>

</xsl:stylesheet>