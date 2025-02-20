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

      <!-- start -->

<!--      <xsl:call-template name="insert-content">-->
<!--        <xsl:with-param name="id" select="'cover-title'"/>-->
<!--      </xsl:call-template>-->
      <!-- end -->

      <axsl:template match="*[contains(@class, ' bookmap/appendix ')]" mode="tocText">
        <axsl:param name="tocItemContent"/>
        <axsl:param name="currentNode"/>
        <axsl:for-each select="$currentNode">
          <fo:block axsl:use-attribute-sets="__toc__appendix__content">
            <axsl:copy-of select="$tocItemContent"/>
          </fo:block>
        </axsl:for-each>
      </axsl:template>

      <axsl:template match="*[contains(@class, ' bookmap/part ')]" mode="tocText">
        <axsl:param name="tocItemContent"/>
        <axsl:param name="currentNode"/>
        <axsl:for-each select="$currentNode">
          <fo:block axsl:use-attribute-sets="__toc__part__content">
            <axsl:copy-of select="$tocItemContent"/>
          </fo:block>
        </axsl:for-each>
      </axsl:template>

      <axsl:template match="*[contains(@class, ' bookmap/preface ')]" mode="tocText">
        <axsl:param name="tocItemContent"/>
        <axsl:param name="currentNode"/>
        <axsl:for-each select="$currentNode">
          <fo:block axsl:use-attribute-sets="__toc__preface__content">
            <axsl:copy-of select="$tocItemContent"/>
          </fo:block>
        </axsl:for-each>
      </axsl:template>

      <axsl:template match="*[contains(@class, ' bookmap/notices ')]" mode="tocText">
        <axsl:param name="tocItemContent"/>
        <axsl:param name="currentNode"/>
        <axsl:for-each select="$currentNode">
          <fo:block axsl:use-attribute-sets="__toc__notices__content">
            <axsl:copy-of select="$tocItemContent"/>
          </fo:block>
        </axsl:for-each>
      </axsl:template>

      <axsl:template match="node()" mode="tocText" priority="-10">
        <axsl:param name="tocItemContent"/>
        <axsl:param name="currentNode"/>
        <axsl:param name="prefix" select="''" as="xs:string?"/>
        <axsl:for-each select="$currentNode">
          <axsl:variable name="topicref" select="key('map-id', @id)"/>
<!--          <axsl:variable name="level" select="count(ancestor-or-self::*[contains(@class, ' topic/topic ')])"/>-->
          <axsl:variable name="level" as="xs:integer">
            <axsl:apply-templates select="." mode="get-topic-level"/>
          </axsl:variable>
          <axsl:choose>
            <xsl:for-each select="'', 'part', 'chapter', 'appendix'">
              <xsl:variable name="prefix" select="."/>
              <xsl:variable name="attribute-set-prefix" select="if (. eq '') then '' else ('__' || .)"/>
              <xsl:variable name="key-prefix" select="if (. eq '') then '' else ('-' || .)"/>
              <xsl:if
                  test="some $key in map:keys($root) satisfies starts-with($key, 'style' || $key-prefix || '-toc-part')">
                <axsl:when
                    test="$prefix eq '{$prefix}' and $level eq 1 and $topicref/self::*[contains(@class, ' bookmap/part ')]">
                  <fo:block axsl:use-attribute-sets="{$attribute-set-prefix}__toc__part__content">
                    <axsl:copy-of select="$tocItemContent"/>
                  </fo:block>
                </axsl:when>
              </xsl:if>
              <xsl:if
                  test="$prefix = ('', 'part') and (some $key in map:keys($root) satisfies starts-with($key, 'style' || $key-prefix || '-toc-chapter'))">
                <axsl:when
                    test="$prefix eq '{$prefix}' (:and $level = (1, 2) :) and $topicref/self::*[contains(@class, ' bookmap/chapter ')]">
                  <fo:block axsl:use-attribute-sets="{$attribute-set-prefix}__toc__chapter__content">
                    <axsl:copy-of select="$tocItemContent"/>
                  </fo:block>
                </axsl:when>
              </xsl:if>
<!--              <xsl:if-->
<!--                  test="some $key in map:keys($root) satisfies starts-with($key, 'style' || $key-prefix || '-toc-1')">-->
<!--                <axsl:when test="$prefix eq '{$prefix}' and $level eq 1">-->
<!--                  <fo:block axsl:use-attribute-sets="{$attribute-set-prefix}__toc__topic__content">-->
<!--                    <axsl:copy-of select="$tocItemContent"/>-->
<!--                  </fo:block>-->
<!--                </axsl:when>-->
<!--              </xsl:if>-->

              <xsl:for-each select="1 to 6">
                <xsl:variable name="level" select="."/>
                <xsl:if
                    test="some $key in map:keys($root) satisfies starts-with($key, 'style' || $key-prefix || '-toc-' || $level)">
                  <axsl:when test="$prefix eq '{$prefix}' and $level eq {$level}">
                    <fo:block axsl:use-attribute-sets="{$attribute-set-prefix}__toc__topic__content_{$level}">
                      <axsl:copy-of select="$tocItemContent"/>
                    </fo:block>
                  </axsl:when>
                </xsl:if>
              </xsl:for-each>
            </xsl:for-each>
            <!-- Workaround for xsl:choose must contain at least one xsl:when -->
            <axsl:when test="true()">
              <fo:block axsl:use-attribute-sets="__toc__topic__content">
                <axsl:copy-of select="$tocItemContent"/>
              </fo:block>
            </axsl:when>
          </axsl:choose>
        </axsl:for-each>
      </axsl:template>

<!--      <xsl:if test="map:contains($root, 'style-toc-1.prefix') and not($root ?style-toc-1.prefix)">-->
<!--        <axsl:template match="node()" mode="tocPrefix"/>-->
<!--      </xsl:if>-->
      <axsl:template match="*[contains(@class, ' map/topicref ')]"
                     mode="tocPrefix">
<!--        <axsl:call-template name="getVariable">-->
<!--          <axsl:with-param name="id" select="'Table of Contents Part'"/>-->
<!--          <axsl:with-param name="params">-->
<!--            <number>-->
              <axsl:sequence select="e:get-title-number(key('topic-id', @id))"/>
              <axsl:text><xsl:text> </xsl:text></axsl:text>
              <!--                <axsl:apply-templates select="." mode="topicTitleNumber"/>-->
<!--            </number>-->
<!--          </axsl:with-param>-->
<!--        </axsl:call-template>-->
      </axsl:template>

      <xsl:if test="$root ?style-part-title-numbering">
        <axsl:template match="*[contains(@class, ' bookmap/part ')]"
                       mode="tocPrefix" priority="10">
          <axsl:call-template name="getVariable">
            <axsl:with-param name="id" select="'Table of Contents Part'"/>
            <axsl:with-param name="params">
              <number>
                <axsl:sequence select="e:get-title-number(key('topic-id', @id))"/>
<!--                <axsl:apply-templates select="." mode="topicTitleNumber"/>-->
              </number>
            </axsl:with-param>
          </axsl:call-template>
        </axsl:template>
      </xsl:if>

      <xsl:if test="$root ?style-chapter-title-numbering">
        <axsl:template match="*[contains(@class, ' bookmap/chapter ')]"
                       mode="tocPrefix" priority="10">
          <axsl:call-template name="getVariable">
            <axsl:with-param name="id" select="'Table of Contents Chapter'"/>
            <axsl:with-param name="params">
              <number>
                <axsl:sequence select="e:get-title-number(key('topic-id', @id))"/>
                <!--                <axsl:apply-templates select="." mode="topicTitleNumber"/>-->
              </number>
            </axsl:with-param>
          </axsl:call-template>
        </axsl:template>
      </xsl:if>

      <xsl:if test="$root ?style-appendix-title-numbering">
        <axsl:template match="*[contains(@class, ' bookmap/appendix ')]"
                       mode="tocPrefix" priority="10">
          <axsl:call-template name="getVariable">
            <axsl:with-param name="id" select="'Table of Contents Appendix'"/>
            <axsl:with-param name="params">
              <number>
                <axsl:sequence select="e:get-title-number(key('topic-id', @id))"/>
                <!--                <axsl:apply-templates select="." mode="topicTitleNumber"/>-->
              </number>
            </axsl:with-param>
          </axsl:call-template>
        </axsl:template>
      </xsl:if>

      <!-- Part TOC -->

      <axsl:variable name="e:partTocMaximumLevel" select="{($root ?style-part-toc-maximum-level, 6)[1] + 1}"/>

      <axsl:template match="node()" mode="part-toc">
        <axsl:param name="include"/>
        <axsl:apply-templates mode="#current">
          <axsl:with-param name="include" select="$include"/>
        </axsl:apply-templates>
      </axsl:template>

      <axsl:template match="*[contains(@class, ' topic/topic ')]" mode="part-toc">
        <axsl:param name="include"/>
        <axsl:variable name="topicLevel" as="xs:integer">
          <axsl:apply-templates select="." mode="get-topic-level"/>
        </axsl:variable>
        <axsl:if test="$topicLevel &lt; $e:partTocMaximumLevel">
          <axsl:variable name="mapTopicref" select="key('map-id', @id)[1]" as="element()?"/>
          <axsl:choose>
            <axsl:when test="$mapTopicref[@toc = 'yes' or not(@toc)] or
                                (not($mapTopicref) and $include = 'true')">
              <fo:block axsl:use-attribute-sets="__toc__indent__part">
                <axsl:variable name="tocItemContent">
                  <fo:basic-link axsl:use-attribute-sets="__toc__link">
                    <axsl:attribute name="internal-destination">
                      <axsl:call-template name="generate-toc-id"/>
                    </axsl:attribute>
                    <axsl:attribute name="fox:alt-text">
                      <axsl:call-template name="getNavTitle"/>
                    </axsl:attribute>
                    <axsl:apply-templates
                        select="*[contains(@class,' ditaot-d/ditaval-startprop ')]/revprop[@changebar]"
                        mode="changebar">
                      <axsl:with-param name="changebar-id" select="concat(dita-ot:generate-changebar-id(.),'-toc')"/>
                    </axsl:apply-templates>
                    <axsl:apply-templates select="$mapTopicref" mode="tocPrefix"/>
                    <fo:inline axsl:use-attribute-sets="__toc__title">
                      <axsl:variable name="pulledNavigationTitle" as="item()*">
                        <axsl:call-template name="getNavTitle"/>
                      </axsl:variable>
                      <axsl:apply-templates select="$pulledNavigationTitle" mode="dropCopiedIds"/>
                    </fo:inline>
                    <axsl:apply-templates select="*[contains(@class,' ditaot-d/ditaval-endprop ')]/revprop[@changebar]"
                                          mode="changebar">
                      <axsl:with-param name="changebar-id" select="concat(dita-ot:generate-changebar-id(.),'-toc')"/>
                    </axsl:apply-templates>
                    <fo:inline axsl:use-attribute-sets="__toc__page-number">
                      <fo:leader axsl:use-attribute-sets="__toc__leader"/>
                      <fo:page-number-citation>
                        <axsl:attribute name="ref-id">
                          <axsl:call-template name="generate-toc-id"/>
                        </axsl:attribute>
                      </fo:page-number-citation>
                    </fo:inline>
                  </fo:basic-link>
                </axsl:variable>
                <axsl:choose>
                  <axsl:when test="not($mapTopicref)">
                    <axsl:apply-templates select="." mode="tocText">
                      <axsl:with-param name="tocItemContent" select="$tocItemContent"/>
                      <axsl:with-param name="currentNode" select="."/>
                      <axsl:with-param name="prefix" select="'part'"/>
                    </axsl:apply-templates>
                  </axsl:when>
                  <axsl:otherwise>
                    <axsl:apply-templates select="$mapTopicref" mode="tocText">
                      <axsl:with-param name="tocItemContent" select="$tocItemContent"/>
                      <axsl:with-param name="currentNode" select="."/>
                      <axsl:with-param name="prefix" select="'part'"/>
                    </axsl:apply-templates>
                  </axsl:otherwise>
                </axsl:choose>
              </fo:block>
              <axsl:apply-templates mode="#current">
                <axsl:with-param name="include" select="'true'"/>
              </axsl:apply-templates>
            </axsl:when>
            <axsl:otherwise>
              <axsl:apply-templates mode="#current">
                <axsl:with-param name="include" select="'true'"/>
              </axsl:apply-templates>
            </axsl:otherwise>
          </axsl:choose>
        </axsl:if>
      </axsl:template>

      <!-- Chapter TOC -->

      <axsl:variable name="e:chapterTocMaximumLevel" select="{($root ?style-chapter-toc-maximum-level, 6)[1] + 2}"/>

      <axsl:template match="node()" mode="chapter-toc">
        <axsl:param name="include"/>
        <axsl:apply-templates mode="#current">
          <axsl:with-param name="include" select="$include"/>
        </axsl:apply-templates>
      </axsl:template>

      <axsl:template match="*[contains(@class, ' topic/topic ')]" mode="chapter-toc">
        <axsl:param name="include"/>
        <axsl:variable name="topicLevel" as="xs:integer">
          <axsl:apply-templates select="." mode="get-topic-level"/>
        </axsl:variable>
        <axsl:if test="$topicLevel &lt; $e:chapterTocMaximumLevel">
          <axsl:variable name="mapTopicref" select="key('map-id', @id)[1]" as="element()?"/>
          <axsl:choose>
            <axsl:when test="$mapTopicref[@toc = 'yes' or not(@toc)] or
                                (not($mapTopicref) and $include = 'true')">
              <fo:block axsl:use-attribute-sets="__toc__indent__chapter">
                <axsl:variable name="tocItemContent">
                  <fo:basic-link axsl:use-attribute-sets="__toc__link">
                    <axsl:attribute name="internal-destination">
                      <axsl:call-template name="generate-toc-id"/>
                    </axsl:attribute>
                    <axsl:attribute name="fox:alt-text">
                      <axsl:call-template name="getNavTitle"/>
                    </axsl:attribute>
                    <axsl:apply-templates
                        select="*[contains(@class,' ditaot-d/ditaval-startprop ')]/revprop[@changebar]"
                        mode="changebar">
                      <axsl:with-param name="changebar-id" select="concat(dita-ot:generate-changebar-id(.),'-toc')"/>
                    </axsl:apply-templates>
                    <axsl:apply-templates select="$mapTopicref" mode="tocPrefix"/>
                    <fo:inline axsl:use-attribute-sets="__toc__title">
                      <axsl:variable name="pulledNavigationTitle" as="item()*">
                        <axsl:call-template name="getNavTitle"/>
                      </axsl:variable>
                      <axsl:apply-templates select="$pulledNavigationTitle" mode="dropCopiedIds"/>
                    </fo:inline>
                    <axsl:apply-templates select="*[contains(@class,' ditaot-d/ditaval-endprop ')]/revprop[@changebar]"
                                          mode="changebar">
                      <axsl:with-param name="changebar-id" select="concat(dita-ot:generate-changebar-id(.),'-toc')"/>
                    </axsl:apply-templates>
                    <fo:inline axsl:use-attribute-sets="__toc__page-number">
                      <fo:leader axsl:use-attribute-sets="__toc__leader"/>
                      <fo:page-number-citation>
                        <axsl:attribute name="ref-id">
                          <axsl:call-template name="generate-toc-id"/>
                        </axsl:attribute>
                      </fo:page-number-citation>
                    </fo:inline>
                  </fo:basic-link>
                </axsl:variable>
                <axsl:choose>
                  <axsl:when test="not($mapTopicref)">
                    <axsl:apply-templates select="." mode="tocText">
                      <axsl:with-param name="tocItemContent" select="$tocItemContent"/>
                      <axsl:with-param name="currentNode" select="."/>
                      <axsl:with-param name="prefix" select="'chapter'"/>
                    </axsl:apply-templates>
                  </axsl:when>
                  <axsl:otherwise>
                    <axsl:apply-templates select="$mapTopicref" mode="tocText">
                      <axsl:with-param name="tocItemContent" select="$tocItemContent"/>
                      <axsl:with-param name="currentNode" select="."/>
                      <axsl:with-param name="prefix" select="'chapter'"/>
                    </axsl:apply-templates>
                  </axsl:otherwise>
                </axsl:choose>
              </fo:block>
              <axsl:apply-templates mode="#current">
                <axsl:with-param name="include" select="'true'"/>
              </axsl:apply-templates>
            </axsl:when>
            <axsl:otherwise>
              <axsl:apply-templates mode="#current">
                <axsl:with-param name="include" select="'true'"/>
              </axsl:apply-templates>
            </axsl:otherwise>
          </axsl:choose>
        </axsl:if>
      </axsl:template>

      <!-- Appendix TOC -->

      <axsl:variable name="e:appendixTocMaximumLevel" select="{($root ?style-appendix-toc-maximum-level, 6)[1] + 2}"/>

      <axsl:template match="node()" mode="appendix-toc">
        <axsl:param name="include"/>
        <axsl:apply-templates mode="#current">
          <axsl:with-param name="include" select="$include"/>
        </axsl:apply-templates>
      </axsl:template>

      <axsl:template match="*[contains(@class, ' topic/topic ')]" mode="appendix-toc">
        <axsl:param name="include"/>
        <axsl:variable name="topicLevel" as="xs:integer">
          <axsl:apply-templates select="." mode="get-topic-level"/>
        </axsl:variable>
        <axsl:if test="$topicLevel &lt; $e:appendixTocMaximumLevel">
          <axsl:variable name="mapTopicref" select="key('map-id', @id)[1]" as="element()?"/>
          <axsl:choose>
            <axsl:when test="$mapTopicref[@toc = 'yes' or not(@toc)] or
                                (not($mapTopicref) and $include = 'true')">
              <fo:block axsl:use-attribute-sets="__toc__indent__appendix">
                <axsl:variable name="tocItemContent">
                  <fo:basic-link axsl:use-attribute-sets="__toc__link">
                    <axsl:attribute name="internal-destination">
                      <axsl:call-template name="generate-toc-id"/>
                    </axsl:attribute>
                    <axsl:attribute name="fox:alt-text">
                      <axsl:call-template name="getNavTitle"/>
                    </axsl:attribute>
                    <axsl:apply-templates
                        select="*[contains(@class,' ditaot-d/ditaval-startprop ')]/revprop[@changebar]"
                        mode="changebar">
                      <axsl:with-param name="changebar-id" select="concat(dita-ot:generate-changebar-id(.),'-toc')"/>
                    </axsl:apply-templates>
                    <axsl:apply-templates select="$mapTopicref" mode="tocPrefix"/>
                    <fo:inline axsl:use-attribute-sets="__toc__title">
                      <axsl:variable name="pulledNavigationTitle" as="item()*">
                        <axsl:call-template name="getNavTitle"/>
                      </axsl:variable>
                      <axsl:apply-templates select="$pulledNavigationTitle" mode="dropCopiedIds"/>
                    </fo:inline>
                    <axsl:apply-templates select="*[contains(@class,' ditaot-d/ditaval-endprop ')]/revprop[@changebar]"
                                          mode="changebar">
                      <axsl:with-param name="changebar-id" select="concat(dita-ot:generate-changebar-id(.),'-toc')"/>
                    </axsl:apply-templates>
                    <fo:inline axsl:use-attribute-sets="__toc__page-number">
                      <fo:leader axsl:use-attribute-sets="__toc__leader"/>
                      <fo:page-number-citation>
                        <axsl:attribute name="ref-id">
                          <axsl:call-template name="generate-toc-id"/>
                        </axsl:attribute>
                      </fo:page-number-citation>
                    </fo:inline>
                  </fo:basic-link>
                </axsl:variable>
                <axsl:choose>
                  <axsl:when test="not($mapTopicref)">
                    <axsl:apply-templates select="." mode="tocText">
                      <axsl:with-param name="tocItemContent" select="$tocItemContent"/>
                      <axsl:with-param name="currentNode" select="."/>
                      <axsl:with-param name="prefix" select="'appendix'"/>
                    </axsl:apply-templates>
                  </axsl:when>
                  <axsl:otherwise>
                    <axsl:apply-templates select="$mapTopicref" mode="tocText">
                      <axsl:with-param name="tocItemContent" select="$tocItemContent"/>
                      <axsl:with-param name="currentNode" select="."/>
                      <axsl:with-param name="prefix" select="'appendix'"/>
                    </axsl:apply-templates>
                  </axsl:otherwise>
                </axsl:choose>
              </fo:block>
              <axsl:apply-templates mode="#current">
                <axsl:with-param name="include" select="'true'"/>
              </axsl:apply-templates>
            </axsl:when>
            <axsl:otherwise>
              <axsl:apply-templates mode="#current">
                <axsl:with-param name="include" select="'true'"/>
              </axsl:apply-templates>
            </axsl:otherwise>
          </axsl:choose>
        </axsl:if>
      </axsl:template>
    </axsl:stylesheet>
  </xsl:template>

  <xsl:template match=".[. instance of map(*)]" mode="attr">
    <axsl:stylesheet version="2.0">
      <xsl:call-template name="generate-namespace-node"/>

      <axsl:function name="e:force-unit">
        <axsl:param name="value"/>
        <axsl:sequence select="if (normalize-space($value) = '0') then '0pt' else $value"/>
      </axsl:function>

      <axsl:attribute-set name="__toc__header">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-topic'"/>
        </xsl:call-template>
      </axsl:attribute-set>

      <axsl:attribute-set name="__toc__indent">
        <axsl:attribute name="start-indent">
          <axsl:variable name="level" as="xs:integer">
            <axsl:apply-templates select="." mode="get-topic-level"/>
          </axsl:variable>
          <axsl:choose>
            <xsl:if test="map:contains($root, 'style-toc-part-start-indent')">
              <axsl:when test="(:$level eq 0 and:) key('map-id', @id)/self::*[contains(@class, ' bookmap/part ')]">
                <axsl:value-of
                    select="concat(e:force-unit('{$root ?style-toc-part-start-indent}'), ' + ', $toc.text-indent)"/>
              </axsl:when>
            </xsl:if>
            <xsl:if test="map:contains($root, 'style-toc-chapter-start-indent')">
              <axsl:when test="(:$level eq 0 and:) key('map-id', @id)/self::*[contains(@class, ' bookmap/chapter ')]">
                <axsl:value-of
                    select="concat(e:force-unit('{$root ?style-toc-chapter-start-indent}'), ' + ', $toc.text-indent)"/>
              </axsl:when>
            </xsl:if>
            <xsl:for-each select="1 to 6">
              <xsl:variable name="level" select="."/>
              <xsl:if test="map:contains($root, 'style-toc-' || $level || '-start-indent')">
                <axsl:when test="$level eq {$level}">
                  <axsl:value-of
                      select="concat(e:force-unit('{map:get($root, 'style-toc-' || $level || '-start-indent')}'), ' + ', $toc.text-indent)"/>
                </axsl:when>
              </xsl:if>
            </xsl:for-each>
<!--            <xsl:if test="map:contains($root, 'style-toc-1-start-indent')">-->
<!--              <axsl:when test="$level eq 1">-->
<!--                <axsl:value-of select="concat(e:force-unit('{$root ?style-toc-1-start-indent}'), ' + ', $toc.text-indent)"/>-->
<!--              </axsl:when>-->
<!--            </xsl:if>-->
<!--            <xsl:if test="map:contains($root, 'style-toc-2-start-indent')">-->
<!--              <axsl:when test="$level eq 2">-->
<!--                <axsl:value-of select="concat(e:force-unit('{$root ?style-toc-2-start-indent}'), ' + ', $toc.text-indent)"/>-->
<!--              </axsl:when>-->
<!--            </xsl:if>-->
<!--            <xsl:if test="map:contains($root, 'style-toc-3-start-indent')">-->
<!--              <axsl:when test="$level eq 3">-->
<!--                <axsl:value-of select="concat(e:force-unit('{$root ?style-toc-3-start-indent}'), ' + ', $toc.text-indent)"/>-->
<!--              </axsl:when>-->
<!--            </xsl:if>-->
<!--            <xsl:if test="map:contains($root, 'style-toc-4-start-indent')">-->
<!--              <axsl:when test="$level eq 4">-->
<!--                <axsl:value-of select="concat(e:force-unit('{$root ?style-toc-4-start-indent}'), ' + ', $toc.text-indent)"/>-->
<!--              </axsl:when>-->
<!--            </xsl:if>-->
            <!-- Workaround for xsl:choose must contain at least one xsl:when -->
            <axsl:when test="true()">
              <axsl:value-of
                  select="concat($side-col-width, ' + (', string($level - 1), ' * ', $toc.toc-indent, ') + ', $toc.text-indent)"/>
            </axsl:when>
          </axsl:choose>
        </axsl:attribute>
      </axsl:attribute-set>

      <axsl:attribute-set name="__toc__indent__part">
        <axsl:attribute name="start-indent">
<!--          <axsl:variable name="level" select="count(ancestor-or-self::*[contains(@class, ' topic/topic ')]) - 1"/>-->
          <axsl:variable name="level" as="xs:integer">
            <axsl:apply-templates select="." mode="get-topic-level"/>
          </axsl:variable>
          <axsl:choose>
            <xsl:if test="map:contains($root, 'style-part-toc-chapter-start-indent')">
              <axsl:when test="(:$level eq 0 and:) key('map-id', @id)/self::*[contains(@class, ' bookmap/chapter ')]">
                <axsl:value-of
                    select="concat(e:force-unit('{$root ?style-part-toc-chapter-start-indent}'), ' + ', $toc.text-indent)"/>
              </axsl:when>
            </xsl:if>
            <xsl:for-each select="1 to 6">
              <xsl:variable name="level" select="."/>
              <xsl:if test="map:contains($root, 'style-part-toc-' || $level || '-start-indent')">
                <axsl:when test="$level eq {$level}">
                  <axsl:value-of
                      select="concat(e:force-unit('{map:get($root, 'style-part-toc-' || $level || '-start-indent')}'), ' + ', $toc.text-indent)"/>
                </axsl:when>
              </xsl:if>
            </xsl:for-each>
<!--            <xsl:if test="map:contains($root, 'style-part-toc-1-start-indent')">-->
<!--              <axsl:when test="$level eq 1">-->
<!--                <axsl:value-of select="concat(e:force-unit('{$root ?style-part-toc-1-start-indent}'), ' + ', $toc.text-indent)"/>-->
<!--              </axsl:when>-->
<!--            </xsl:if>-->
<!--            <xsl:if test="map:contains($root, 'style-part-toc-2-start-indent')">-->
<!--              <axsl:when test="$level eq 2">-->
<!--                <axsl:value-of select="concat(e:force-unit('{$root ?style-part-toc-2-start-indent}'), ' + ', $toc.text-indent)"/>-->
<!--              </axsl:when>-->
<!--            </xsl:if>-->
<!--            <xsl:if test="map:contains($root, 'style-part-toc-3-start-indent')">-->
<!--              <axsl:when test="$level eq 3">-->
<!--                <axsl:value-of select="concat(e:force-unit('{$root ?style-part-toc-3-start-indent}'), ' + ', $toc.text-indent)"/>-->
<!--              </axsl:when>-->
<!--            </xsl:if>-->
<!--            <xsl:if test="map:contains($root, 'style-part-toc-4-start-indent')">-->
<!--              <axsl:when test="$level eq 4">-->
<!--                <axsl:value-of select="concat(e:force-unit('{$root ?style-part-toc-4-start-indent}'), ' + ', $toc.text-indent)"/>-->
<!--              </axsl:when>-->
<!--            </xsl:if>-->
<!--            <xsl:if test="map:contains($root, 'style-part-toc-5-start-indent')">-->
<!--              <axsl:when test="$level eq 5">-->
<!--                <axsl:value-of select="concat(e:force-unit('{$root ?style-part-toc-5-start-indent}'), ' + ', $toc.text-indent)"/>-->
<!--              </axsl:when>-->
<!--            </xsl:if>-->
<!--            <xsl:if test="map:contains($root, 'style-part-toc-6-start-indent')">-->
<!--              <axsl:when test="$level eq 6">-->
<!--                <axsl:value-of select="concat(e:force-unit('{$root ?style-part-toc-6-start-indent}'), ' + ', $toc.text-indent)"/>-->
<!--              </axsl:when>-->
<!--            </xsl:if>-->
            <!-- Workaround for xsl:choose must contain at least one xsl:when -->
            <axsl:when test="true()">
              <axsl:value-of
                  select="concat($side-col-width, ' + (', string($level - 1), ' * ', $toc.toc-indent, ') + ', $toc.text-indent)"/>
            </axsl:when>
          </axsl:choose>
        </axsl:attribute>
      </axsl:attribute-set>

      <axsl:attribute-set name="__toc__indent__chapter">
        <axsl:attribute name="start-indent">
<!--          <axsl:variable name="inside-part" as="xs:boolean"-->
<!--                         select="exists(key('map-id', @id)/ancestor-or-self::*[contains(@class, ' bookmap/part ')])"/>-->
<!--          <axsl:variable name="level" select="count(ancestor-or-self::*[contains(@class, ' topic/topic ')])-->
<!--                                              - (if ($inside-part) then 1 else 0)"/>-->
          <axsl:variable name="level" as="xs:integer">
            <axsl:apply-templates select="." mode="get-topic-level"/>
          </axsl:variable>
          <axsl:choose>
            <xsl:for-each select="1 to 6">
              <xsl:variable name="level" select="."/>
              <xsl:if test="map:contains($root, 'style-chapter-toc-' || $level || '-start-indent')">
                <axsl:when test="$level eq {$level}">
                  <axsl:value-of
                      select="concat(e:force-unit('{map:get($root, 'style-chapter-toc-' || $level || '-start-indent')}'), ' + ', $toc.text-indent)"/>
                </axsl:when>
              </xsl:if>
            </xsl:for-each>
<!--            <xsl:if test="map:contains($root, 'style-chapter-toc-1-start-indent')">-->
<!--              <axsl:when test="$level eq 1">-->
<!--                <axsl:value-of select="concat(e:force-unit('{$root ?style-chapter-toc-1-start-indent}'), ' + ', $toc.text-indent)"/>-->
<!--              </axsl:when>-->
<!--            </xsl:if>-->
<!--            <xsl:if test="map:contains($root, 'style-chapter-toc-2-start-indent')">-->
<!--              <axsl:when test="$level eq 2">-->
<!--                <axsl:value-of select="concat(e:force-unit('{$root ?style-chapter-toc-2-start-indent}'), ' + ', $toc.text-indent)"/>-->
<!--              </axsl:when>-->
<!--            </xsl:if>-->
<!--            <xsl:if test="map:contains($root, 'style-chapter-toc-3-start-indent')">-->
<!--              <axsl:when test="$level eq 3">-->
<!--                <axsl:value-of select="concat(e:force-unit('{$root ?style-chapter-toc-3-start-indent}'), ' + ', $toc.text-indent)"/>-->
<!--              </axsl:when>-->
<!--            </xsl:if>-->
<!--            <xsl:if test="map:contains($root, 'style-chapter-toc-4-start-indent')">-->
<!--              <axsl:when test="$level eq 4">-->
<!--                <axsl:value-of select="concat(e:force-unit('{$root ?style-chapter-toc-4-start-indent}'), ' + ', $toc.text-indent)"/>-->
<!--              </axsl:when>-->
<!--            </xsl:if>-->
<!--            <xsl:if test="map:contains($root, 'style-chapter-toc-5-start-indent')">-->
<!--              <axsl:when test="$level eq 5">-->
<!--                <axsl:value-of select="concat(e:force-unit('{$root ?style-chapter-toc-5-start-indent}'), ' + ', $toc.text-indent)"/>-->
<!--              </axsl:when>-->
<!--            </xsl:if>-->
<!--            <xsl:if test="map:contains($root, 'style-chapter-toc-6-start-indent')">-->
<!--              <axsl:when test="$level eq 6">-->
<!--                <axsl:value-of select="concat(e:force-unit('{$root ?style-chapter-toc-6-start-indent}'), ' + ', $toc.text-indent)"/>-->
<!--              </axsl:when>-->
<!--            </xsl:if>-->
            <!-- Workaround for xsl:choose must contain at least one xsl:when -->
            <axsl:when test="true()">
              <axsl:value-of
                  select="concat($side-col-width, ' + (', string($level - 1), ' * ', $toc.toc-indent, ') + ', $toc.text-indent)"/>
            </axsl:when>
          </axsl:choose>
        </axsl:attribute>
      </axsl:attribute-set>

      <axsl:attribute-set name="__toc__indent__appendix">
        <axsl:attribute name="start-indent">
          <axsl:variable name="level" select="count(ancestor-or-self::*[contains(@class, ' topic/topic ')]) - 1"/>
          <axsl:choose>
            <xsl:for-each select="1 to 6">
              <xsl:variable name="level" select="."/>
              <xsl:if test="map:contains($root, 'style-appendix-toc-' || $level || '-start-indent')">
                <axsl:when test="$level eq {$level}">
                  <axsl:value-of
                      select="concat(e:force-unit('{map:get($root, 'style-appendix-toc-' || $level || '-start-indent')}'), ' + ', $toc.text-indent)"/>
                </axsl:when>
              </xsl:if>
            </xsl:for-each>
<!--            <xsl:if test="map:contains($root, 'style-appendix-toc-1-start-indent')">-->
<!--              <axsl:when test="$level eq 1">-->
<!--                <axsl:value-of select="concat(e:force-unit('{$root ?style-appendix-toc-1-start-indent}'), ' + ', $toc.text-indent)"/>-->
<!--              </axsl:when>-->
<!--            </xsl:if>-->
<!--            <xsl:if test="map:contains($root, 'style-appendix-toc-2-start-indent')">-->
<!--              <axsl:when test="$level eq 2">-->
<!--                <axsl:value-of select="concat(e:force-unit('{$root ?style-appendix-toc-2-start-indent}'), ' + ', $toc.text-indent)"/>-->
<!--              </axsl:when>-->
<!--            </xsl:if>-->
<!--            <xsl:if test="map:contains($root, 'style-appendix-toc-3-start-indent')">-->
<!--              <axsl:when test="$level eq 3">-->
<!--                <axsl:value-of select="concat(e:force-unit('{$root ?style-appendix-toc-3-start-indent}'), ' + ', $toc.text-indent)"/>-->
<!--              </axsl:when>-->
<!--            </xsl:if>-->
<!--            <xsl:if test="map:contains($root, 'style-appendix-toc-4-start-indent')">-->
<!--              <axsl:when test="$level eq 4">-->
<!--                <axsl:value-of select="concat(e:force-unit('{$root ?style-appendix-toc-4-start-indent}'), ' + ', $toc.text-indent)"/>-->
<!--              </axsl:when>-->
<!--            </xsl:if>-->
<!--            <xsl:if test="map:contains($root, 'style-appendix-toc-5-start-indent')">-->
<!--              <axsl:when test="$level eq 5">-->
<!--                <axsl:value-of select="concat(e:force-unit('{$root ?style-appendix-toc-5-start-indent}'), ' + ', $toc.text-indent)"/>-->
<!--              </axsl:when>-->
<!--            </xsl:if>-->
<!--            <xsl:if test="map:contains($root, 'style-appendix-toc-6-start-indent')">-->
<!--              <axsl:when test="$level eq 6">-->
<!--                <axsl:value-of select="concat(e:force-unit('{$root ?style-appendix-toc-6-start-indent}'), ' + ', $toc.text-indent)"/>-->
<!--              </axsl:when>-->
<!--            </xsl:if>-->
            <!-- Workaround for xsl:choose must contain at least one xsl:when -->
            <axsl:when test="true()">
              <axsl:value-of
                  select="concat($side-col-width, ' + (', string($level - 1), ' * ', $toc.toc-indent, ') + ', $toc.text-indent)"/>
            </axsl:when>
          </axsl:choose>
        </axsl:attribute>
      </axsl:attribute-set>

      <axsl:attribute-set name="__toc__indent__booklist">
        <axsl:attribute name="start-indent">
          <axsl:value-of select="concat(e:force-unit('{$root ?style-toc-1-start-indent}'), ' + ', $toc.text-indent)"/>
        </axsl:attribute>
      </axsl:attribute-set>

      <axsl:attribute-set name="__toc__part__content" use-attribute-sets="__toc__topic__content">
        <xsl:choose>
          <xsl:when test="some $key in map:keys($root) satisfies starts-with($key, 'style-toc-part')">
            <xsl:call-template name="generate-attribute-set">
              <xsl:with-param name="prefix" select="'style-toc-part'"/>
              <xsl:with-param name="properties" select="$allProperties[. ne 'start-indent']"/>
            </xsl:call-template>
          </xsl:when>
          <xsl:otherwise>
            <xsl:call-template name="generate-attribute-set">
              <xsl:with-param name="prefix" select="'style-toc-1'"/>
              <xsl:with-param name="properties" select="$allProperties[. ne 'start-indent']"/>
            </xsl:call-template>
          </xsl:otherwise>
        </xsl:choose>
        <!-- Override PDF2 default -->
        <axsl:attribute name="padding-top">inherit</axsl:attribute>
      </axsl:attribute-set>

      <axsl:attribute-set name="__toc__chapter__content" use-attribute-sets="__toc__topic__content">
        <xsl:choose>
          <xsl:when test="some $key in map:keys($root) satisfies starts-with($key, 'style-toc-chapter')">
            <xsl:call-template name="generate-attribute-set">
              <xsl:with-param name="prefix" select="'style-toc-chapter'"/>
              <xsl:with-param name="properties" select="$allProperties[. ne 'start-indent']"/>
            </xsl:call-template>
          </xsl:when>
          <xsl:otherwise>
            <xsl:call-template name="generate-attribute-set">
              <xsl:with-param name="prefix" select="'style-toc-1'"/>
              <xsl:with-param name="properties" select="$allProperties[. ne 'start-indent']"/>
            </xsl:call-template>
          </xsl:otherwise>
        </xsl:choose>
        <!-- Override PDF2 default -->
        <axsl:attribute name="padding-top">inherit</axsl:attribute>
      </axsl:attribute-set>

      <axsl:attribute-set name="__part__toc__chapter__content" use-attribute-sets="__toc__topic__content">
        <xsl:choose>
          <xsl:when test="some $key in map:keys($root) satisfies starts-with($key, 'style-part-toc-chapter')">
            <xsl:call-template name="generate-attribute-set">
              <xsl:with-param name="prefix" select="'style-part-toc-chapter'"/>
              <xsl:with-param name="properties" select="$allProperties[. ne 'start-indent']"/>
            </xsl:call-template>
          </xsl:when>
          <xsl:otherwise>
            <xsl:call-template name="generate-attribute-set">
              <xsl:with-param name="prefix" select="'style-part-toc-1'"/>
              <xsl:with-param name="properties" select="$allProperties[. ne 'start-indent']"/>
            </xsl:call-template>
          </xsl:otherwise>
        </xsl:choose>
        <!-- Override PDF2 default -->
        <axsl:attribute name="padding-top">inherit</axsl:attribute>
      </axsl:attribute-set>

      <axsl:attribute-set name="__toc__appendix__content" use-attribute-sets="__toc__topic__content">
        <xsl:choose>
          <xsl:when test="some $key in map:keys($root) satisfies starts-with($key, 'style-toc-appendix')">
            <xsl:call-template name="generate-attribute-set">
              <xsl:with-param name="prefix" select="'style-toc-appendix'"/>
              <xsl:with-param name="properties" select="$allProperties[. ne 'start-indent']"/>
            </xsl:call-template>
          </xsl:when>
          <xsl:otherwise>
            <xsl:call-template name="generate-attribute-set">
              <xsl:with-param name="prefix" select="'style-toc-1'"/>
              <xsl:with-param name="properties" select="$allProperties[. ne 'start-indent']"/>
            </xsl:call-template>
          </xsl:otherwise>
        </xsl:choose>
        <!-- Override PDF2 default -->
        <axsl:attribute name="padding-top">inherit</axsl:attribute>
      </axsl:attribute-set>

<!--      <axsl:attribute-set name="__toc__topic__content">-->
<!--        <xsl:call-template name="generate-attribute-set">-->
<!--          <xsl:with-param name="prefix" select="'style-toc-1'"/>-->
<!--          <xsl:with-param name="properties" select="$allProperties[. ne 'start-indent']"/>-->
<!--        </xsl:call-template>-->
<!--      </axsl:attribute-set>-->

      <xsl:for-each select="1 to 6">
        <xsl:variable name="level" select="."/>
        <axsl:attribute-set name="__toc__topic__content_{$level}" use-attribute-sets="__toc__topic__content">
          <xsl:call-template name="generate-attribute-set">
            <xsl:with-param name="prefix" select="'style-toc-' || $level"/>
            <xsl:with-param name="properties" select="$allProperties[. ne 'start-indent']"/>
          </xsl:call-template>
        </axsl:attribute-set>
      </xsl:for-each>

<!--      <axsl:attribute-set name="__part__toc__topic__content" use-attribute-sets="__toc__topic__content">-->
        <!--          <xsl:call-template name="generate-attribute-set">-->
        <!--            <xsl:with-param name="prefix" select="'style-' || $prefix || '-toc-1'"/>-->
        <!--            <xsl:with-param name="properties" select="$allProperties[. ne 'start-indent']"/>-->
        <!--          </xsl:call-template>-->
<!--      </axsl:attribute-set>-->

      <xsl:for-each select="('part', 'chapter', 'appendix')">
        <xsl:variable name="prefix" select="."/>
        <axsl:attribute-set name="__{$prefix}__toc__topic__content" use-attribute-sets="__toc__topic__content">
<!--          <xsl:call-template name="generate-attribute-set">-->
<!--            <xsl:with-param name="prefix" select="'style-' || $prefix || '-toc-1'"/>-->
<!--            <xsl:with-param name="properties" select="$allProperties[. ne 'start-indent']"/>-->
<!--          </xsl:call-template>-->
        </axsl:attribute-set>

        <xsl:for-each select="1 to 6">
          <xsl:variable name="level" select="."/>
          <axsl:attribute-set name="__{$prefix}__toc__topic__content_{.}"
                              use-attribute-sets="__{$prefix}__toc__topic__content">
            <xsl:call-template name="generate-attribute-set">
              <xsl:with-param name="prefix" select="'style-' || $prefix || '-toc-' || $level"/>
              <xsl:with-param name="properties" select="$allProperties[. ne 'start-indent']"/>
            </xsl:call-template>
          </axsl:attribute-set>
        </xsl:for-each>
      </xsl:for-each>

      <xsl:if test="some $key in map:keys($root) satisfies starts-with($key, 'style-toc-1')">
        <axsl:attribute-set name="__toc__preface__content" use-attribute-sets="__toc__topic__content">
          <xsl:call-template name="generate-attribute-set">
            <xsl:with-param name="prefix" select="'style-toc-1'"/>
            <xsl:with-param name="properties" select="$allProperties[. ne 'start-indent']"/>
          </xsl:call-template>
        </axsl:attribute-set>

        <axsl:attribute-set name="__toc__notices__content" use-attribute-sets="__toc__topic__content">
          <xsl:call-template name="generate-attribute-set">
            <xsl:with-param name="prefix" select="'style-toc-1'"/>
            <xsl:with-param name="properties" select="$allProperties[. ne 'start-indent']"/>
          </xsl:call-template>
        </axsl:attribute-set>

        <axsl:attribute-set name="__toc__topic__content__booklist">
          <xsl:call-template name="generate-attribute-set">
            <xsl:with-param name="prefix" select="'style-toc-1'"/>
            <xsl:with-param name="properties" select="$allProperties[. ne 'start-indent']"/>
          </xsl:call-template>
        </axsl:attribute-set>
      </xsl:if>

      <axsl:attribute-set name="e:part_toc" use-attribute-sets="common.block">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-part-toc'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="e:chapter_toc" use-attribute-sets="common.block">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-chapter-toc'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="e:appendix_toc" use-attribute-sets="common.block">
        <xsl:call-template name="generate-attribute-set">
          <!-- FIXME: Should be style-appendix-toc?-->
          <xsl:with-param name="prefix" select="'style-chapter-appendix'"/>
        </xsl:call-template>
      </axsl:attribute-set>
    </axsl:stylesheet>
  </xsl:template>

</xsl:stylesheet>