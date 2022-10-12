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
        <axsl:variable name="id" select="$topic/@id"/>
        <axsl:variable name="mapTopics" select="key('map-id', $id)"/>
        <axsl:variable name="contents" as="node()*">
          <axsl:apply-templates select="$mapTopics[1]" mode="e:title-number"/>
        </axsl:variable>
        <axsl:if test="exists($contents)">
          <axsl:copy-of select="$contents"/>
<!--          <fo:leader leader-pattern="space" leader-length="from-nearest-specified-value(font-size)"/>-->
          <axsl:text>
            <xsl:text> </xsl:text>
          </axsl:text>
        </axsl:if>
        <axsl:apply-templates/>
      </axsl:template>

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
          <axsl:when test="$e:number-levels[$depth]">
            <axsl:number count="*[contains(@class, ' map/topicref ')]
                              [not(ancestor-or-self::*[contains(@class, ' bookmap/frontmatter ')])]"
                         level="multiple"
                         format="1.1"/>
          </axsl:when>
        </axsl:choose>
      </axsl:template>

      <axsl:template name="getNavTitle">
        <axsl:variable name="topicref" select="key('map-id', @id)[1]"/>
        <axsl:variable name="contents" as="node()*">
          <axsl:apply-templates select="$topicref[1]" mode="e:title-number"/>
        </axsl:variable>
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
      <xsl:if test="not($root ?style-note-icon)">
<!--        <xsl:comment>note</xsl:comment>-->
        <axsl:template match="*[contains(@class,' topic/note ')]" mode="setNoteImagePath"/>
      </xsl:if>
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
      <xsl:if test="$root ?style-tm-symbol-scope != 'always'">
<!--        <xsl:comment>tm</xsl:comment>-->
        <xsl:choose>
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
      </xsl:if>
    </axsl:stylesheet>
  </xsl:template>

  <xsl:template match=".[. instance of map(*)]" mode="attr">
    <axsl:stylesheet version="2.0">
      <xsl:call-template name="generate-namespace-node"/>
      <!-- titles -->
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
          <xsl:with-param name="prefix" select="'style-topic_topic_topic'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="topic.topic.topic.topic.title">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-topic_topic_topic_topic'"/>
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
          <xsl:with-param name="prefix" select="'style-section_title'"/>
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
          <xsl:with-param name="prefix" select="'style-example_title'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <!-- tm -->
      <axsl:attribute-set name="tm">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-tm'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <!-- note -->
      <axsl:attribute-set name="note__table">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-note'"/>
        </xsl:call-template>
      </axsl:attribute-set>
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
    </axsl:stylesheet>
  </xsl:template>

</xsl:stylesheet>