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
<!--          <fo:block>-->
<!--            <axsl:attribute name="id">-->
<!--              <axsl:call-template name="generate-toc-id"/>-->
<!--            </axsl:attribute>-->

            <axsl:choose>
              <axsl:when test="$type = 'chapter'">
<!--                <fo:block axsl:use-attribute-sets="__chapter__frontmatter__name__container">-->
                  <axsl:call-template name="getVariable">
                    <axsl:with-param name="id" select="'Chapter with number'"/>
                    <axsl:with-param name="params" as="element()*">
                      <number>
<!--                        <fo:block axsl:use-attribute-sets="__chapter__frontmatter__number__container">-->
                          <axsl:apply-templates select="key('map-id', @id)[1]" mode="topicTitleNumber"/>
<!--                        </fo:block>-->
                      </number>
                    </axsl:with-param>
                  </axsl:call-template>
<!--                </fo:block>-->
              </axsl:when>
              <axsl:when test="$type = 'appendix'">
<!--                <fo:block axsl:use-attribute-sets="__chapter__frontmatter__name__container">-->
                  <axsl:call-template name="getVariable">
                    <axsl:with-param name="id" select="'Appendix with number'"/>
                    <axsl:with-param name="params" as="element()*">
                      <number>
<!--                        <fo:block axsl:use-attribute-sets="__chapter__frontmatter__number__container">-->
                          <axsl:apply-templates select="key('map-id', @id)[1]" mode="topicTitleNumber"/>
<!--                        </fo:block>-->
                      </number>
                    </axsl:with-param>
                  </axsl:call-template>
<!--                </fo:block>-->
              </axsl:when>
              <axsl:when test="$type = 'appendices'">
<!--                <fo:block axsl:use-attribute-sets="__chapter__frontmatter__name__container">-->
                  <axsl:call-template name="getVariable">
                    <axsl:with-param name="id" select="'Appendix with number'"/>
                    <axsl:with-param name="params" as="element()*">
                      <number>
<!--                        <fo:block axsl:use-attribute-sets="__chapter__frontmatter__number__container">-->
                          <axsl:text>&#xA0;</axsl:text>
<!--                        </fo:block>-->
                      </number>
                    </axsl:with-param>
                  </axsl:call-template>
<!--                </fo:block>-->
              </axsl:when>
              <axsl:when test="$type = 'part'">
<!--                <fo:block axsl:use-attribute-sets="__chapter__frontmatter__name__container">-->
                  <axsl:call-template name="getVariable">
                    <axsl:with-param name="id" select="'Part with number'"/>
                    <axsl:with-param name="params" as="element()*">
                      <number>
<!--                        <fo:block axsl:use-attribute-sets="__chapter__frontmatter__number__container">-->
                          <axsl:apply-templates select="key('map-id', @id)[1]" mode="topicTitleNumber"/>
<!--                        </fo:block>-->
                      </number>
                    </axsl:with-param>
                  </axsl:call-template>
<!--                </fo:block>-->
              </axsl:when>
              <axsl:when test="$type = 'preface'">
<!--                <fo:block axsl:use-attribute-sets="__chapter__frontmatter__name__container">-->
                  <axsl:call-template name="getVariable">
                    <axsl:with-param name="id" select="'Preface title'"/>
                  </axsl:call-template>
<!--                </fo:block>-->
              </axsl:when>
              <axsl:when test="$type = 'notices'">
<!--                <fo:block axsl:use-attribute-sets="__chapter__frontmatter__name__container">-->
                  <axsl:call-template name="getVariable">
                    <axsl:with-param name="id" select="'Notices title'"/>
                  </axsl:call-template>
<!--                </fo:block>-->
              </axsl:when>
            </axsl:choose>
<!--          </fo:block>-->
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

      <!-- Part -->

      <axsl:template match="*" mode="processTopicPartInsideFlow">
        <fo:block axsl:use-attribute-sets="topic">
          <!-- TODO: Replace with mode="commonattributes" -->
          <axsl:call-template name="commonattributes"/>
          <axsl:if test="empty(ancestor::*[contains(@class, ' topic/topic ')])">
            <fo:marker marker-class-name="current-topic-number">
              <axsl:variable name="topicref"
                            select="key('map-id', ancestor-or-self::*[contains(@class, ' topic/topic ')][1]/@id)[1]"
                            as="element()?"
              />
              <axsl:for-each select="$topicref">
                <axsl:apply-templates select="." mode="topicTitleNumber"/>
              </axsl:for-each>
            </fo:marker>
            <axsl:apply-templates select="." mode="insertTopicHeaderMarker"/>
          </axsl:if>
          <axsl:apply-templates select="." mode="customTopicMarker"/>

          <axsl:apply-templates select="*[contains(@class,' topic/prolog ')]"/>

<!--          <axsl:apply-templates select="." mode="insertChapterFirstpageStaticContent">-->
<!--            <axsl:with-param name="type" select="'part'"/>-->
<!--          </axsl:apply-templates>-->

          <fo:block axsl:use-attribute-sets="part.title">
            <axsl:attribute name="id">
              <axsl:call-template name="generate-toc-id"/>
            </axsl:attribute>
<!--            <axsl:apply-templates select="." mode="customTopicAnchor"/>-->
            <axsl:call-template name="pullPrologIndexTerms"/>
            <axsl:apply-templates select="*[contains(@class,' ditaot-d/ditaval-startprop ')]"/>

<!--            <axsl:apply-templates select="." mode="insertChapterFirstpageStaticContent">-->
<!--              <axsl:with-param name="type" select="'part'"/>-->
<!--            </axsl:apply-templates>-->
            <axsl:call-template name="getVariable">
              <axsl:with-param name="id" select="'Part with number'"/>
              <axsl:with-param name="params" as="element()*">
                <number>
                  <axsl:sequence select="e:get-title-number(.)"/>
<!--                  <axsl:apply-templates select="key('map-id', @id)[1]" mode="topicTitleNumber"/>-->
                </number>
              </axsl:with-param>
            </axsl:call-template>
            <axsl:text><xsl:text> </xsl:text></axsl:text>

<!--            <axsl:apply-templates select="*[contains(@class,' topic/title ')]" mode="getTitle"/>-->
            <axsl:apply-templates select="*[contains(@class,' topic/title ')]/node()"/>
          </fo:block>

<!--          <axsl:apply-templates select="* except(*[contains(@class, ' topic/title ') or-->
<!--                                                       contains(@class,' ditaot-d/ditaval-startprop ') or-->
<!--                                                       contains(@class, ' topic/prolog ') or-->
<!--                                                       contains(@class, ' topic/topic ')])"/>-->
          <axsl:if test="*[contains(@class,' topic/shortdesc ') or
                           contains(@class, ' topic/abstract ')]/node()">
            <fo:block axsl:use-attribute-sets="topic__shortdesc">
              <axsl:apply-templates select="*[contains(@class,' topic/shortdesc ') or
                                              contains(@class, ' topic/abstract ')]/node()"/>
            </fo:block>
          </axsl:if>
          <axsl:apply-templates select="*[contains(@class,' topic/body ')]"/>
          <axsl:apply-templates select="*[contains(@class, ' ditaot-d/ditaval-endprop ')]"/>
          <axsl:if test="*[contains(@class,' topic/related-links ')]//
                           *[contains(@class,' topic/link ')]
                            [not(@role) or @role != 'child']">
            <axsl:apply-templates select="*[contains(@class,' topic/related-links ')]"/>
          </axsl:if>
          <axsl:choose>
            <axsl:when test="$partLayout = 'BASIC'">
              <!--axsl:apply-templates select="." mode="buildRelationships"/-->
            </axsl:when>
            <axsl:when test="exists(*[contains(@class, ' topic/topic ')])">
              <fo:block axsl:use-attribute-sets="e:part_toc">
                <axsl:apply-templates select="*[contains(@class, ' topic/topic ')]" mode="part-toc"/>
              </fo:block>
<!--              <axsl:apply-templates select="." mode="createPartToc"/>-->
            </axsl:when>
          </axsl:choose>

          <axsl:for-each select="*[contains(@class,' topic/topic ')]">
            <axsl:variable name="topicType" as="xs:string">
              <axsl:call-template name="determineTopicType"/>
            </axsl:variable>
            <axsl:if test="$topicType = 'topicSimple'">
              <axsl:apply-templates select="."/>
            </axsl:if>
          </axsl:for-each>
          <axsl:call-template name="pullPrologIndexTerms.end-range"/>
        </fo:block>
      </axsl:template>

      <!-- Appendix -->

      <axsl:template match="*" mode="processTopicAppendixInsideFlow">
        <fo:block axsl:use-attribute-sets="topic">
          <!-- TODO: Replace with mode="commonattributes" -->
          <axsl:call-template name="commonattributes"/>
          <axsl:variable name="level" as="xs:integer">
            <axsl:apply-templates select="." mode="get-topic-level"/>
          </axsl:variable>
          <axsl:if test="$level eq 1">
            <fo:marker marker-class-name="current-topic-number">
              <axsl:variable name="topicref"
                             select="key('map-id', ancestor-or-self::*[contains(@class, ' topic/topic ')][1]/@id)[1]"
                             as="element()?"/>
              <axsl:for-each select="$topicref">
                <axsl:apply-templates select="." mode="topicTitleNumber"/>
              </axsl:for-each>
            </fo:marker>
            <axsl:apply-templates select="." mode="insertTopicHeaderMarker"/>
          </axsl:if>
          <axsl:apply-templates select="." mode="customTopicMarker"/>

          <axsl:apply-templates select="*[contains(@class,' topic/prolog ')]"/>

<!--          <axsl:apply-templates select="." mode="insertChapterFirstpageStaticContent">-->
<!--            <axsl:with-param name="type" select="'appendix'"/>-->
<!--          </axsl:apply-templates>-->

          <fo:block axsl:use-attribute-sets="topic.title">
            <axsl:attribute name="id">
              <axsl:call-template name="generate-toc-id"/>
            </axsl:attribute>
<!--            <axsl:apply-templates select="." mode="customTopicAnchor"/>-->
            <axsl:call-template name="pullPrologIndexTerms"/>
            <axsl:apply-templates select="*[contains(@class,' ditaot-d/ditaval-startprop ')]"/>

            <axsl:call-template name="getVariable">
              <axsl:with-param name="id" select="'Appendix with number'"/>
              <axsl:with-param name="params" as="element()*">
                <number>
                  <axsl:sequence select="e:get-title-number(.)"/>
                  <!--                  <axsl:apply-templates select="key('map-id', @id)[1]" mode="topicTitleNumber"/>-->
                </number>
              </axsl:with-param>
            </axsl:call-template>
            <axsl:text><xsl:text> </xsl:text></axsl:text>

            <axsl:apply-templates select="*[contains(@class,' topic/title ')]" mode="getTitle"/>
          </fo:block>

          <axsl:if test="*[contains(@class,' topic/shortdesc ') or
                           contains(@class, ' topic/abstract ')]/node()">
            <fo:block axsl:use-attribute-sets="topic__shortdesc">
              <axsl:apply-templates select="*[contains(@class,' topic/shortdesc ') or
                                              contains(@class, ' topic/abstract ')]/node()"/>
            </fo:block>
          </axsl:if>
          <axsl:apply-templates select="*[contains(@class,' topic/body ')]"/>
          <axsl:apply-templates select="*[contains(@class, ' ditaot-d/ditaval-endprop ')]"/>
          <axsl:if test="*[contains(@class,' topic/related-links ')]//
                           *[contains(@class,' topic/link ')]
                            [not(@role) or @role != 'child']">
            <axsl:apply-templates select="*[contains(@class,' topic/related-links ')]"/>
          </axsl:if>

          <axsl:choose>
            <axsl:when test="$appendixLayout='BASIC'">
<!--              <axsl:apply-templates select="* except(*[contains(@class, ' topic/title ') or contains(@class,' ditaot-d/ditaval-startprop ') or-->
<!--                      contains(@class, ' topic/prolog ') or contains(@class, ' topic/topic ')])"/>-->
              <!--xsl:apply-templates select="." mode="buildRelationships"/-->
            </axsl:when>
            <axsl:when test="exists(*[contains(@class, ' topic/topic ')])">
              <fo:block axsl:use-attribute-sets="e:appendix_toc">
                <axsl:apply-templates select="*[contains(@class, ' topic/topic ')]" mode="part-toc"/>
              </fo:block>
<!--              <axsl:apply-templates select="." mode="createMiniToc"/>-->
            </axsl:when>
          </axsl:choose>

          <axsl:apply-templates select="*[contains(@class,' topic/topic ')]"/>
          <axsl:call-template name="pullPrologIndexTerms.end-range"/>
        </fo:block>
      </axsl:template>

<!--      <axsl:template match="*" mode="createPartToc">-->
        <!-- Part introduction -->
        <!--

        <axsl:apply-templates select="*[contains(@class,' topic/titlealts ')]"/>
        <axsl:if test="*[contains(@class,' topic/shortdesc ')
                         or contains(@class, ' topic/abstract ')]/node()">
          <fo:block axsl:use-attribute-sets="p">
            <axsl:apply-templates select="*[contains(@class,' topic/shortdesc ')
                                            or contains(@class, ' topic/abstract ')]/node()"/>
          </fo:block>
        </axsl:if>
        <axsl:apply-templates select="*[contains(@class,' topic/body ')]/*"/>
        <axsl:apply-templates select="*[contains(@class, ' ditaot-d/ditaval-endprop ')]"/>

        <axsl:if test="*[contains(@class,' topic/related-links ')]//
                         *[contains(@class,' topic/link ')]
                          [not(@role) or @role != 'child']">
          <axsl:apply-templates select="*[contains(@class,' topic/related-links ')]"/>
        </axsl:if>
        -->
        <!-- Part TOC -->
<!--        <axsl:apply-templates select="*[contains(@class, ' topic/topic ')]" mode="part-toc"/>-->
        <!--
        <axsl:if test="*[contains(@class, ' topic/topic ')]">
          <fo:block axsl:use-attribute-sets="__toc__mini">
            <fo:block axsl:use-attribute-sets="__toc__mini__header">
              <axsl:call-template name="getVariable">
                <axsl:with-param name="id" select="'Mini Toc'"/>
              </axsl:call-template>
            </fo:block>
            <fo:list-block axsl:use-attribute-sets="__toc__mini__list">
              <axsl:apply-templates select="*[contains(@class, ' topic/topic ')]" mode="in-this-chapter-list"/>
            </fo:list-block>
          </fo:block>
        </axsl:if>
        -->
<!--      </axsl:template>-->

      <!-- Chapter -->

      <axsl:template match="*" mode="processTopicChapterInsideFlow">
        <fo:block axsl:use-attribute-sets="topic">
          <!-- TODO: Replace with mode="commonattributes" -->
          <axsl:call-template name="commonattributes"/>
          <axsl:variable name="level" as="xs:integer">
            <axsl:apply-templates select="." mode="get-topic-level"/>
          </axsl:variable>
          <axsl:if test="$level eq 1">
            <fo:marker marker-class-name="current-topic-number">
              <axsl:variable name="topicref"
                             select="key('map-id', ancestor-or-self::*[contains(@class, ' topic/topic ')][1]/@id)[1]"
                             as="element()?"/>
              <axsl:for-each select="$topicref">
                <axsl:apply-templates select="." mode="topicTitleNumber"/>
              </axsl:for-each>
            </fo:marker>
            <axsl:apply-templates select="." mode="insertTopicHeaderMarker"/>
          </axsl:if>
          <axsl:apply-templates select="." mode="customTopicMarker"/>

          <axsl:apply-templates select="*[contains(@class,' topic/prolog ')]"/>

<!--          <axsl:apply-templates select="." mode="insertChapterFirstpageStaticContent">-->
<!--            <axsl:with-param name="type" select="'chapter'"/>-->
<!--          </axsl:apply-templates>-->

          <fo:block axsl:use-attribute-sets="topic.title">
            <axsl:attribute name="id">
              <axsl:call-template name="generate-toc-id"/>
            </axsl:attribute>
<!--            <axsl:apply-templates select="." mode="customTopicAnchor"/>-->
            <axsl:call-template name="pullPrologIndexTerms"/>
            <axsl:apply-templates select="*[contains(@class,' ditaot-d/ditaval-startprop ')]"/>

            <axsl:call-template name="getVariable">
              <axsl:with-param name="id" select="'Chapter with number'"/>
              <axsl:with-param name="params" as="element()*">
                <number>
                  <axsl:sequence select="e:get-title-number(.)"/>
                  <!--<axsl:apply-templates select="key('map-id', @id)[1]" mode="topicTitleNumber"/>-->
                </number>
              </axsl:with-param>
            </axsl:call-template>
            <axsl:text><xsl:text> </xsl:text></axsl:text>

<!--            <axsl:apply-templates select="*[contains(@class,' topic/title ')]" mode="getTitle"/>-->
            <axsl:apply-templates select="*[contains(@class,' topic/title ')]/node()"/>
          </fo:block>

          <axsl:choose>
            <axsl:when test="$chapterLayout='BASIC'">
              <!--xsl:apply-templates select="." mode="buildRelationships"/-->
            </axsl:when>
            <axsl:when test="exists(*[contains(@class, ' topic/topic ')])">
              <fo:block axsl:use-attribute-sets="e:chapter_toc">
                <axsl:apply-templates select="*[contains(@class, ' topic/topic ')]" mode="chapter-toc"/>
              </fo:block>
              <!--              <axsl:apply-templates select="." mode="createMiniToc"/>-->
            </axsl:when>
          </axsl:choose>

          <axsl:if test="*[contains(@class,' topic/shortdesc ') or
                           contains(@class, ' topic/abstract ')]/node()">
            <fo:block axsl:use-attribute-sets="topic__shortdesc">
              <axsl:apply-templates select="*[contains(@class,' topic/shortdesc ') or
                                              contains(@class, ' topic/abstract ')]/node()"/>
            </fo:block>
          </axsl:if>
          <axsl:apply-templates select="*[contains(@class,' topic/body ')]"/>
          <axsl:apply-templates select="*[contains(@class, ' ditaot-d/ditaval-endprop ')]"/>
          <axsl:if test="*[contains(@class,' topic/related-links ')]//
                           *[contains(@class,' topic/link ')]
                            [not(@role) or @role != 'child']">
            <axsl:apply-templates select="*[contains(@class,' topic/related-links ')]"/>
          </axsl:if>
          <axsl:apply-templates select="*[contains(@class,' topic/topic ')]"/>
          <axsl:call-template name="pullPrologIndexTerms.end-range"/>
        </fo:block>
      </axsl:template>

<!--      <axsl:template match="*" mode="createMiniToc">-->
<!--        &lt;!&ndash; Chapter TOC &ndash;&gt;-->
<!--        <axsl:apply-templates select="*[contains(@class, ' topic/topic ')]" mode="chapter-toc"/>-->
<!--        &lt;!&ndash; Chapter introduction &ndash;&gt;-->
<!--        <axsl:apply-templates select="*[contains(@class,' topic/titlealts ')]"/>-->
<!--        <axsl:if test="*[contains(@class,' topic/shortdesc ')-->
<!--                         or contains(@class, ' topic/abstract ')]/node()">-->
<!--          <fo:block axsl:use-attribute-sets="p">-->
<!--            <axsl:apply-templates select="*[contains(@class,' topic/shortdesc ')-->
<!--                                            or contains(@class, ' topic/abstract ')]/node()"/>-->
<!--          </fo:block>-->
<!--        </axsl:if>-->
<!--        <axsl:apply-templates select="*[contains(@class,' topic/body ')]/*"/>-->
<!--        <axsl:apply-templates select="*[contains(@class, ' ditaot-d/ditaval-endprop ')]"/>-->
<!--        <axsl:if test="*[contains(@class,' topic/related-links ')]//-->
<!--                         *[contains(@class,' topic/link ')]-->
<!--                          [not(@role) or @role != 'child']">-->
<!--          <axsl:apply-templates select="*[contains(@class,' topic/related-links ')]"/>-->
<!--        </axsl:if>-->
<!--      </axsl:template>-->
      <axsl:template match="*[contains(@class, ' bookmap/part ')]" mode="topicTitleNumber">
<!--        <axsl:variable name="topic" select="ancestor-or-self::*[contains(@class, ' topic/topic ')][1]"/>-->
<!--        <axsl:variable name="contents" as="node()*" select="e:get-title-number($topic)"/>-->
        <axsl:sequence select="e:get-title-number(key('topic-id', @id))"/>
<!--        <axsl:number format="I" count="*[contains(@class, ' bookmap/part ')]"/>-->
      </axsl:template>

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
