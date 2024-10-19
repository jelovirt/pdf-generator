<xsl:stylesheet version="3.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:xs="http://www.w3.org/2001/XMLSchema"
                xmlns:axsl="http://www.w3.org/1999/XSL/Transform/alias"
                xmlns:fo="http://www.w3.org/1999/XSL/Format"
                xmlns:map="http://www.w3.org/2005/xpath-functions/map"
                xmlns:array="http://www.w3.org/2005/xpath-functions/array"
                xmlns:opentopic="http://www.idiominc.com/opentopic"
                exclude-result-prefixes="xs axsl map array">

  <xsl:import href="utils.xsl"/>

  <xsl:namespace-alias stylesheet-prefix="axsl" result-prefix="xsl"/>

  <xsl:output indent="no"/>

  <xsl:variable name="note-types" as="xs:string+"
                select="'notice', 'tip', 'fastpath', 'restriction', 'important', 'remember', 'attention', 'caution', 'danger', 'warning', 'trouble', 'other'"/>

  <xsl:template match=".[. instance of map(*)]">
    <axsl:stylesheet version="2.0">
      <xsl:call-template name="generate-namespace-node"/>
<!--      <xsl:comment>title numbering</xsl:comment>-->
      <axsl:variable name="e:number-levels">
        <xsl:attribute name="select">
          <xsl:text>(</xsl:text>
          <xsl:value-of select="(
            boolean($root ?style-topic-title-numbering),
            boolean($root ?style-topic-topic-title-numbering),
            boolean($root ?style-topic-topic-topic-title-numbering),
            boolean($root ?style-topic-topic-topic-topic-title-numbering)
            ) ! concat(., '()')" separator=", "/>
          <xsl:text>)</xsl:text>
        </xsl:attribute>
      </axsl:variable>

      <axsl:template match="*[contains(@class, ' topic/topic ')]/*[contains(@class, ' topic/title ')]" mode="getTitle">
        <axsl:variable name="topic" select="ancestor-or-self::*[contains(@class, ' topic/topic ')][1]"/>
        <axsl:variable name="contents" as="node()*" select="e:get-title-number($topic)"/>
        <axsl:if test="exists($contents)">
          <axsl:copy-of select="$contents"/>
<!--          <fo:leader leader-pattern="space" leader-length="from-nearest-specified-value(font-size)"/>-->
          <axsl:text>
            <xsl:text> </xsl:text>
          </axsl:text>
        </axsl:if>
        <axsl:apply-templates/>
      </axsl:template>

      <axsl:variable name="map-without-parts" as="document-node()">
        <axsl:document>
          <opentopic:map>
            <axsl:apply-templates select="$map/*[contains(@class, ' map/topicref ')]" mode="gen-map-without-parts"/>
          </opentopic:map>
        </axsl:document>
      </axsl:variable>

      <axsl:template match="*[contains(@class, ' map/topicref ')]" mode="gen-map-without-parts">
        <axsl:copy>
          <axsl:copy-of select="@*"/>
          <axsl:apply-templates select="*[contains(@class, ' map/topicref ')]" mode="#current"/>
        </axsl:copy>
      </axsl:template>

      <axsl:template match="*[contains(@class, ' bookmap/part ')]" mode="gen-map-without-parts" priority="10">
        <axsl:apply-templates select="*[contains(@class, ' map/topicref ')]" mode="#current"/>
      </axsl:template>

      <axsl:key name="map-without-parts-id"
                match="*"
                use="@id"/>

      <axsl:function name="e:get-title-number" as="node()*">
        <axsl:param name="topic" as="element()"/>
        <axsl:variable name="topicref" as="element()?" select="key('map-id', $topic/@id, root($topic))[1]"/>
<!--        <axsl:if test="empty($topicref)">-->
<!--          <axsl:message terminate="yes" select="'empty topicref', $topic/title"/>-->
<!--        </axsl:if>-->
        <axsl:choose>
          <axsl:when test="contains($topicref/@class, ' bookmap/part ')">
            <axsl:apply-templates select="$topicref" mode="e:title-number"/>
          </axsl:when>
          <axsl:otherwise>
            <axsl:apply-templates select="key('map-without-parts-id', $topicref/@id, $map-without-parts)" mode="e:title-number"/>
          </axsl:otherwise>
        </axsl:choose>
      </axsl:function>

      <axsl:template match="*[contains(@class, ' map/topicref')]" mode="e:title-number">
        <axsl:variable name="depth" select="count(ancestor-or-self::*[contains(@class, ' map/topicref')])"/>
        <axsl:choose>
          <axsl:when test="parent::opentopic:map and contains(@class, ' bookmap/bookmap ')"/>
          <axsl:when test="ancestor-or-self::*[contains(@class, ' bookmap/frontmatter ') or
                                            contains(@class, ' bookmap/backmatter ')]"/>
          <axsl:when test="ancestor-or-self::*[contains(@class, ' bookmap/appendix ')] and
                        $e:number-levels[$depth]">
            <axsl:number count="*[contains(@class, ' map/topicref ')]
                              [ancestor-or-self::*[contains(@class, ' bookmap/appendix ')]]"
                         level="multiple"
                         format="A.1.1"/>
          </axsl:when>
          <xsl:choose>
            <xsl:when test="$root ?style-part-title-numbering">
              <axsl:when test="self::*[contains(@class, ' bookmap/part ')]">
                <axsl:call-template name="getVariable">
                  <axsl:with-param name="id" select="'Part with number'"/>
  <!--                <axsl:with-param name="id" select="'Table of Contents Part'"/>-->
                  <axsl:with-param name="params">
                    <number>
                      <axsl:number count="*[contains(@class, ' bookmap/part ')]"
                                   level="single"
                                   format="1"/>
                    </number>
                  </axsl:with-param>
                </axsl:call-template>
              </axsl:when>
            </xsl:when>
            <xsl:otherwise>
              <axsl:when test="self::*[contains(@class, ' bookmap/part ')]"/>
            </xsl:otherwise>
          </xsl:choose>
          <axsl:when test="$e:number-levels[$depth]">
            <axsl:number count="*[contains(@class, ' map/topicref ')]
                              [not(ancestor-or-self::*[contains(@class, ' bookmap/frontmatter ')])]"
                         level="multiple"
                         format="1.1"/>
          </axsl:when>
        </axsl:choose>
      </axsl:template>

      <axsl:template match="*[contains(@class, ' map/topicref')]" mode="e:chapter-number">
        <axsl:variable name="depth" select="count(ancestor-or-self::*[contains(@class, ' map/topicref')])"/>
        <axsl:choose>
          <axsl:when test="parent::opentopic:map and contains(@class, ' bookmap/bookmap ')"/>
          <axsl:when test="ancestor-or-self::*[contains(@class, ' bookmap/frontmatter ') or
                                            contains(@class, ' bookmap/backmatter ')]"/>
          <axsl:when test="ancestor-or-self::*[contains(@class, ' bookmap/appendix ')] and
                        $e:number-levels[$depth]">
            <axsl:number count="*[contains(@class, ' map/topicref ')]
                              [ancestor-or-self::*[contains(@class, ' bookmap/appendix ')]]"
                         level="single"
                         format="A"/>
          </axsl:when>
          <axsl:when test="$e:number-levels[$depth]">
            <axsl:variable name="res">
              <axsl:number count="*[contains(@class, ' map/topicref ')]
                                   [not(ancestor-or-self::*[contains(@class, ' bookmap/frontmatter ')])]"
                           level="multiple"
                           format="1.1"/>
            </axsl:variable>
            <axsl:value-of select="tokenize($res, '\.')[1]"/>
          </axsl:when>
        </axsl:choose>
      </axsl:template>

      <axsl:template name="getNavTitle">
        <axsl:variable name="topicref" select="key('map-id', @id)[1]"/>
        <axsl:variable name="contents" as="node()*" select="e:get-title-number(.)"/>
        <axsl:if test="exists($contents)">
          <axsl:copy-of select="$contents"/>
<!--          <fo:leader leader-pattern="space" leader-length="from-nearest-specified-value(font-size)"/>-->
          <axsl:text>
            <xsl:text> </xsl:text>
          </axsl:text>
        </axsl:if>
        <axsl:choose>
          <axsl:when
              test="$topicref/@locktitle = 'yes' and $topicref/*[contains(@class, ' map/topicmeta ')]/*[contains(@class, ' topic/navtitle ')]">
            <axsl:apply-templates
                select="$topicref/*[contains(@class, ' map/topicmeta ')]/*[contains(@class, ' topic/navtitle ')]/node()"/>
          </axsl:when>
          <axsl:when test="$topicref/@locktitle = 'yes' and $topicref/@navtitle">
            <axsl:value-of select="$topicref/@navtitle"/>
          </axsl:when>
          <axsl:when test="*[contains(@class,' topic/titlealts ')]/*[contains(@class,' topic/navtitle ')]">
            <axsl:apply-templates select="*[contains(@class,' topic/titlealts ')]/*[contains(@class,' topic/navtitle ')]/node()"/>
          </axsl:when>
          <axsl:otherwise>
            <axsl:apply-templates select="*[contains(@class,' topic/title ')]/node()"/>
          </axsl:otherwise>
        </axsl:choose>
      </axsl:template>

      <!-- note -->
      <axsl:template match="*[contains(@class,' topic/note ')]">
        <axsl:variable name="noteImagePath">
          <xsl:if test="$root ?style-note-icon">
            <axsl:apply-templates select="." mode="setNoteImagePath"/>
          </xsl:if>
        </axsl:variable>
        <axsl:variable name="atts" as="element()">
          <axsl:choose>
            <axsl:when test="@type = 'note' or not(@type)">
              <wrapper axsl:use-attribute-sets="note__table__note"/>
            </axsl:when>
            <xsl:for-each select="$note-types">
              <axsl:when test="@type = '{.}'">
                <wrapper axsl:use-attribute-sets="note__table__{.}"/>
              </axsl:when>
            </xsl:for-each>
          </axsl:choose>
        </axsl:variable>
        <axsl:choose>
          <axsl:when test="not($noteImagePath = '')">
            <fo:table>
              <axsl:copy-of select="$atts/@*"/>
              <fo:table-column axsl:use-attribute-sets="note__image__column"/>
              <fo:table-column axsl:use-attribute-sets="note__text__column"/>
              <fo:table-body>
                <fo:table-row>
                  <fo:table-cell axsl:use-attribute-sets="note__image__entry">
                    <fo:block>
                      <fo:external-graphic
                          src="url('{{concat($artworkPrefix, $noteImagePath)}}')"
                          axsl:use-attribute-sets="note__image"/>
                    </fo:block>
                  </fo:table-cell>
                  <fo:table-cell axsl:use-attribute-sets="note__text__entry">
                    <axsl:apply-templates select="." mode="placeNoteContent"/>
                  </fo:table-cell>
                </fo:table-row>
              </fo:table-body>
            </fo:table>
          </axsl:when>
          <axsl:otherwise>
            <fo:block>
              <axsl:copy-of select="$atts/@*"/>
              <axsl:apply-templates select="." mode="placeNoteContent"/>
            </fo:block>
          </axsl:otherwise>
        </axsl:choose>
      </axsl:template>

      <axsl:template match="*" mode="placeNoteContent">
        <fo:block axsl:use-attribute-sets="note">
          <axsl:call-template name="commonattributes"/>
          <!--fo:inline axsl:use-attribute-sets="note__label"-->
            <axsl:choose>
              <axsl:when test="@type = 'note' or empty(@type)">
                <fo:inline axsl:use-attribute-sets="note__label__note">
                  <axsl:call-template name="getVariable">
                    <axsl:with-param name="id" select="'note-note-label'"/>
                  </axsl:call-template>
                </fo:inline>
              </axsl:when>
              <xsl:for-each select="$note-types[. ne 'other']">
                <axsl:when test="@type = '{.}'">
                  <fo:inline axsl:use-attribute-sets="note__label__{.}">
                    <axsl:call-template name="getVariable">
                      <axsl:with-param name="id" select="'note-{.}-label'"/>
                      <!--axsl:with-param name="id" select="'{concat(upper-case(substring(., 1, 1)), substring(., 2))}'"/-->
                    </axsl:call-template>
                  </fo:inline>
                </axsl:when>
              </xsl:for-each>
              <axsl:when test="@type = 'other'">
                <fo:inline axsl:use-attribute-sets="note__label__other">
                  <axsl:choose>
                    <axsl:when test="@othertype">
                      <axsl:value-of select="@othertype"/>
                    </axsl:when>
                    <axsl:otherwise>
                      <axsl:text>[</axsl:text>
                      <axsl:value-of select="@type"/>
                      <axsl:text>]</axsl:text>
                    </axsl:otherwise>
                  </axsl:choose>
                </fo:inline>
              </axsl:when>
            </axsl:choose>
          <!--/fo:inline-->
          <!--xsl:if test="map:contains($root, concat('style-note-', @type, '-label-content'))">
            <axsl:call-template name="getVariable">
              <axsl:with-param name="id" select="'#note-separator'"/>
            </axsl:call-template>
            <axsl:text><xsl:text> </xsl:text></axsl:text>
          </xsl:if-->
          <axsl:apply-templates/>
        </fo:block>
      </axsl:template>

      <!-- fig -->
      <!-- caption numbering -->
      <xsl:choose>
        <xsl:when test="$root ?style-fig-caption-number = 'chapter'">
          <axsl:template match="*[contains(@class, ' topic/fig ')]/*[contains(@class, ' topic/title ')]"
                         mode="fig.title-number">
            <axsl:call-template name="getChapterPrefix"/>
            <axsl:value-of select="count(key('enumerableByClass', 'topic/fig', ancestor::*[contains(@class, ' topic/topic ')][last()])
                              [*[contains(@class, ' topic/title ')]]
                              [. &lt;&lt; current()])"/>
          </axsl:template>
        </xsl:when>
        <xsl:when test="$root ?style-fig-caption-number = 'document'">
          <axsl:template match="*[contains(@class, ' topic/fig ')]/*[contains(@class, ' topic/title ')]"
                         mode="fig.title-number">
            <axsl:value-of select="count(key('enumerableByClass', 'topic/fig')[. &lt;&lt; current()])"/>
          </axsl:template>
        </xsl:when>
      </xsl:choose>
      <xsl:if test="$root ?style-fig-caption-position = 'before'">
        <axsl:template match="*[contains(@class,' topic/fig ')]">
          <fo:block axsl:use-attribute-sets="fig">
            <axsl:call-template name="commonattributes"/>
            <axsl:if test="not(@id)">
              <axsl:attribute name="id">
                <axsl:call-template name="get-id"/>
              </axsl:attribute>
            </axsl:if>
            <axsl:apply-templates/>
          </fo:block>
        </axsl:template>
      </xsl:if>

      <!-- tm -->
      <xsl:choose>
        <xsl:when test="$root ?style-tm-symbol-scope = 'always'">
        </xsl:when>
        <xsl:when test="$root ?style-tm-symbol-scope = 'chapter'">
          <axsl:function name="e:tm-value" as="xs:string">
            <axsl:param name="node" as="element()"/>
            <axsl:value-of select="normalize-space($node)"/>
          </axsl:function>

          <axsl:key name="e:first-tm" match="*[contains(@class, ' topic/tm ')]" use="e:tm-value(.)"/>

          <axsl:template match="*[contains(@class, ' topic/tm ')]">
            <axsl:variable name="tmText" as="xs:string" select="e:tm-value(.)"/>
            <axsl:variable name="tm-scope" as="element()"
                           select="(ancestor-or-self::*[contains(@class, ' topic/topic ')])[1]"/>
            <axsl:variable name="tms" as="element()+" select="key('e:first-tm', $tmText, $tm-scope)"/>
            <axsl:variable name="isFirst" as="xs:boolean" select="$tms[1] is ."/>
            <axsl:choose>
              <axsl:when test="$isFirst">
                <axsl:next-match/>
              </axsl:when>
              <axsl:otherwise>
                <fo:inline axsl:use-attribute-sets="tm">
                  <axsl:apply-templates/>
                </fo:inline>
              </axsl:otherwise>
            </axsl:choose>
          </axsl:template>
        </xsl:when>
        <xsl:when test="$root ?style-tm-symbol-scope = 'never'">
          <axsl:template match="*[contains(@class, ' topic/tm ')]">
            <fo:inline axsl:use-attribute-sets="tm">
              <axsl:apply-templates/>
            </fo:inline>
          </axsl:template>
        </xsl:when>
      </xsl:choose>
    </axsl:stylesheet>
  </xsl:template>

  <xsl:template match=".[. instance of map(*)]" mode="attr">
    <axsl:stylesheet version="2.0">
      <xsl:call-template name="generate-namespace-node"/>
      <!-- titles -->
      <axsl:attribute-set name="part.title" use-attribute-sets="topic.title">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-part'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="topic.title">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-topic'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="topic.topic.title">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-topic-topic'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="topic.topic.topic.title">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-topic-topic-topic'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="topic.topic.topic.topic.title">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-topic-topic-topic-topic'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <!-- section -->
      <axsl:attribute-set name="section">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-section'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="section.title">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-section-title'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <!-- example -->
      <axsl:attribute-set name="example">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-example'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="example.title">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-example-title'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <!-- tm -->
      <axsl:attribute-set name="tm">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-tm'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <!-- note -->
      <axsl:attribute-set name="note__table__note" use-attribute-sets="common.block">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-note'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <xsl:for-each select="$note-types">
        <axsl:attribute-set name="note__table__{.}" use-attribute-sets="note__table__note">
          <xsl:call-template name="generate-attribute-set">
            <xsl:with-param name="prefix" select="concat('style-note-', .)"/>
          </xsl:call-template>
        </axsl:attribute-set>
      </xsl:for-each>
      <axsl:attribute-set name="note__label">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-note-label'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <xsl:for-each select="'note', $note-types">
        <axsl:attribute-set name="note__label__{.}" use-attribute-sets="note__label">
          <xsl:call-template name="generate-attribute-set">
            <xsl:with-param name="prefix" select="concat('style-note-', ., '-label')"/>
          </xsl:call-template>
        </axsl:attribute-set>
      </xsl:for-each>
      <!-- pre -->
      <axsl:attribute-set name="pre">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-pre'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <!-- fig -->
      <axsl:attribute-set name="fig">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-fig'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="fig.title">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-fig-caption'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <!-- keyword -->
      <axsl:attribute-set name="keyword">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-keyword'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <!-- term -->
      <axsl:attribute-set name="term">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-term'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <!-- shortdesc -->
      <axsl:attribute-set name="topic__shortdesc">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-shortdesc'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="abstract" use-attribute-sets="common.block">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-shortdesc'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <!-- figgroup -->
      <axsl:attribute-set name="figgroup">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-figgroup'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <!-- lines -->
      <axsl:attribute-set name="lines">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-lines'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <!-- ph -->
      <axsl:attribute-set name="ph">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-ph'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <!-- fn -->
      <axsl:attribute-set name="fn">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-fn'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <!-- cite -->
      <axsl:attribute-set name="cite">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-cite'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <!-- image -->
      <axsl:attribute-set name="image">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-image'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <!-- q -->
      <axsl:attribute-set name="q">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-q'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <!-- lq -->
      <axsl:attribute-set name="lq">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-lq'"/>
        </xsl:call-template>
      </axsl:attribute-set>
    </axsl:stylesheet>
  </xsl:template>

</xsl:stylesheet>