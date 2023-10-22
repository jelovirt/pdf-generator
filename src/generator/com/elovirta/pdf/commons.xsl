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

      <axsl:template name="getChapterPrefix">
        <axsl:variable name="topicref" as="element()*"
                       select="key('map-id', ancestor-or-self::*[contains(@class, ' topic/topic ')][1]/@id)" />
        <axsl:variable name="chapter" as="element()*"
                       select="$topicref/ancestor-or-self::*[contains(@class, ' map/topicref ')]
                                                            [not(contains(@class, ' bookmap/part ')) and
                                                             not(contains(@class, ' bookmap/appendices ')) and
                                                             not(contains(@class, ' bookmap/backmatter '))]
                                                            [parent::opentopic:map or
                                                             parent::*[contains(@class, ' bookmap/part ')] or
                                                             parent::*[contains(@class, ' bookmap/appendices ')]]" />
        <axsl:variable name="number" as="node()*">
          <axsl:apply-templates select="$chapter[1]" mode="e:chapter-number"/>
        </axsl:variable>
        <axsl:if test="exists($number)">
          <axsl:copy-of select="$number"/>
          <axsl:text>–</axsl:text>
        </axsl:if>
      </axsl:template>

<!--      <xsl:if test="map:contains($root, 'style-topic-title-numbering') and $root ?style-topic-title-numbering">-->
        <axsl:template match="*" mode="insertChapterFirstpageStaticContent">
          <axsl:param name="type" as="xs:string"/>
          <fo:block>
            <axsl:attribute name="id">
              <axsl:call-template name="generate-toc-id"/>
            </axsl:attribute>
<!--            -->
<!--            <axsl:choose>-->
<!--              <axsl:when test="$type = 'chapter'">-->
<!--                <fo:block axsl:use-attribute-sets="__chapter__frontmatter__name__container">-->
<!--                  <axsl:call-template name="getVariable">-->
<!--                    <axsl:with-param name="id" select="'Chapter with number'"/>-->
<!--                    <axsl:with-param name="params" as="element()*">-->
<!--                      <number>-->
<!--&lt;!&ndash;                        <fo:block axsl:use-attribute-sets="__chapter__frontmatter__number__container">&ndash;&gt;-->
<!--                          <axsl:apply-templates select="key('map-id', @id)[1]" mode="topicTitleNumber"/>-->
<!--&lt;!&ndash;                        </fo:block>&ndash;&gt;-->
<!--                      </number>-->
<!--                    </axsl:with-param>-->
<!--                  </axsl:call-template>-->
<!--                </fo:block>-->
<!--              </axsl:when>-->
<!--              <axsl:when test="$type = 'appendix'">-->
<!--                <fo:block axsl:use-attribute-sets="__chapter__frontmatter__name__container">-->
<!--                  <axsl:call-template name="getVariable">-->
<!--                    <axsl:with-param name="id" select="'Appendix with number'"/>-->
<!--                    <axsl:with-param name="params" as="element()*">-->
<!--                      <number>-->
<!--&lt;!&ndash;                        <fo:block axsl:use-attribute-sets="__chapter__frontmatter__number__container">&ndash;&gt;-->
<!--                          <axsl:apply-templates select="key('map-id', @id)[1]" mode="topicTitleNumber"/>-->
<!--&lt;!&ndash;                        </fo:block>&ndash;&gt;-->
<!--                      </number>-->
<!--                    </axsl:with-param>-->
<!--                  </axsl:call-template>-->
<!--                </fo:block>-->
<!--              </axsl:when>-->
<!--              <axsl:when test="$type = 'appendices'">-->
<!--                <fo:block axsl:use-attribute-sets="__chapter__frontmatter__name__container">-->
<!--                  <axsl:call-template name="getVariable">-->
<!--                    <axsl:with-param name="id" select="'Appendix with number'"/>-->
<!--                    <axsl:with-param name="params" as="element()*">-->
<!--                      <number>-->
<!--&lt;!&ndash;                        <fo:block axsl:use-attribute-sets="__chapter__frontmatter__number__container">&ndash;&gt;-->
<!--                          <axsl:text>&#xA0;</axsl:text>-->
<!--&lt;!&ndash;                        </fo:block>&ndash;&gt;-->
<!--                      </number>-->
<!--                    </axsl:with-param>-->
<!--                  </axsl:call-template>-->
<!--                </fo:block>-->
<!--              </axsl:when>-->
<!--              <axsl:when test="$type = 'part'">-->
<!--                <fo:block axsl:use-attribute-sets="__chapter__frontmatter__name__container">-->
<!--                  <axsl:call-template name="getVariable">-->
<!--                    <axsl:with-param name="id" select="'Part with number'"/>-->
<!--                    <axsl:with-param name="params" as="element()*">-->
<!--                      <number>-->
<!--&lt;!&ndash;                        <fo:block axsl:use-attribute-sets="__chapter__frontmatter__number__container">&ndash;&gt;-->
<!--                          <axsl:apply-templates select="key('map-id', @id)[1]" mode="topicTitleNumber"/>-->
<!--&lt;!&ndash;                        </fo:block>&ndash;&gt;-->
<!--                      </number>-->
<!--                    </axsl:with-param>-->
<!--                  </axsl:call-template>-->
<!--                </fo:block>-->
<!--              </axsl:when>-->
<!--              <axsl:when test="$type = 'preface'">-->
<!--                <fo:block axsl:use-attribute-sets="__chapter__frontmatter__name__container">-->
<!--                  <axsl:call-template name="getVariable">-->
<!--                    <axsl:with-param name="id" select="'Preface title'"/>-->
<!--                  </axsl:call-template>-->
<!--                </fo:block>-->
<!--              </axsl:when>-->
<!--              <axsl:when test="$type = 'notices'">-->
<!--                <fo:block axsl:use-attribute-sets="__chapter__frontmatter__name__container">-->
<!--                  <axsl:call-template name="getVariable">-->
<!--                    <axsl:with-param name="id" select="'Notices title'"/>-->
<!--                  </axsl:call-template>-->
<!--                </fo:block>-->
<!--              </axsl:when>-->
<!--            </axsl:choose>-->
          </fo:block>
        </axsl:template>
<!--      </xsl:if>-->
      <xsl:if test="$root ?formatter != 'fop'">
        <xsl:if test="$root ?page-number = 'chapter-page'">
          <axsl:template name="startPageNumbering">
            <axsl:variable name="topicType" as="xs:string">
              <axsl:call-template name="determineTopicType"/>
            </axsl:variable>
            <axsl:variable name="topicref" select="key('map-id', ancestor-or-self::*[contains(@class, ' topic/topic ')][1]/@id)"/>
            <axsl:for-each select="$topicref[1]">
              <axsl:choose>
                <axsl:when test="$topicType = 'topicChapter'">
                  <axsl:attribute name="initial-page-number">1</axsl:attribute>
                  <fo:folio-prefix>
                    <axsl:number format="1" count="*[contains(@class, ' bookmap/chapter ')]"/>
                    <axsl:text>&#x2013;</axsl:text>
                  </fo:folio-prefix>
                </axsl:when>
                <axsl:when test="$topicType = ('topicAppendix', 'topicAppendices')">
                  <axsl:attribute name="initial-page-number">1</axsl:attribute>
                  <fo:folio-prefix>
                    <axsl:number format="A" count="*[contains(@class, ' bookmap/appendix ')]"/>
                    <axsl:text>&#x2013;</axsl:text>
                  </fo:folio-prefix>
                </axsl:when>
              </axsl:choose>
            </axsl:for-each>
            <!--xsl:comment>topicType: <axsl:value-of select="$topicType"/></axsl:comment-->
          </axsl:template>
        </xsl:if>
      </xsl:if>
      <xsl:if test="$root ?cover-image-topic">
        <axsl:template match="*[contains(@class, ' topic/topic ')][@outputclass = '{$root ?cover-image-topic}']" priority="1000"/>
      </xsl:if>
    </axsl:stylesheet>
  </xsl:template>

  <xsl:template match=".[. instance of map(*)]" mode="attr">
    <axsl:stylesheet version="2.0">
      <xsl:call-template name="generate-namespace-node"/>
      <axsl:variable name="e:root-id" select="'root'" as="xs:string"/>
      <!-- force page count -->
      <xsl:if test="map:contains($root, 'force-page-count')">
        <axsl:attribute-set name="__force__page__count">
          <axsl:attribute name="force-page-count">
            <xsl:value-of select="$root ?force-page-count"/>
          </axsl:attribute>
        </axsl:attribute-set>
      </xsl:if>
      <!-- font family -->
      <axsl:attribute-set name="__fo__root">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-body'"/>
          <xsl:with-param name="properties" select="('font-family', 'color', 'text-align')"/>
        </xsl:call-template>
        <axsl:attribute name="id" select="$e:root-id"/>
      </axsl:attribute-set>
      <!-- link -->
      <axsl:attribute-set name="common.link">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-link'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <!-- normal block -->
      <axsl:attribute-set name="common.block">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-body'"/>
          <xsl:with-param name="properties" select="$allProperties[not(. = ('start-indent', 'font-family', 'font-size'))]"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="common.title">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-body'"/>
          <xsl:with-param name="properties" select="('space-before', 'space-after')"/>
        </xsl:call-template>
      </axsl:attribute-set>
    </axsl:stylesheet>
  </xsl:template>

</xsl:stylesheet>
