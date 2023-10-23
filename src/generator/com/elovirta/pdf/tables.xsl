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
      <!-- caption numbering -->
      <xsl:variable name="tableCaptionNumber" select="$root ?style-table-caption-number"/>
      <xsl:choose>
        <!--
        <xsl:when test="$tableCaptionNumber = 'topic'">
          <axsl:template match="*[contains(@class, ' topic/table ')]/*[contains(@class, ' topic/title ')]" mode="table.title-number">
            <axsl:variable name="topicref" select="key('map-id', ancestor-or-self::*[contains(@class, ' topic/topic ')][1]/@id)"/>
            <axsl:apply-templates select="$topicref" mode="topicTitleNumber"/>
            <axsl:text>&#x2013;</axsl:text>
            <axsl:value-of select="count(key('enumerableByClass', 'topic/table', ancestor::*[contains(@class, ' topic/topic ')][1])[. &lt;&lt; current()])"/>
          </axsl:template>`
        </xsl:when>
        -->
        <xsl:when test="$tableCaptionNumber = 'chapter'">
          <axsl:template match="*[contains(@class, ' topic/table ')]/*[contains(@class, ' topic/title ')]" mode="table.title-number">
            <axsl:call-template name="getChapterPrefix"/>
            <axsl:value-of select="count(key('enumerableByClass', 'topic/table', ancestor::*[contains(@class, ' topic/topic ')][last()])[. &lt;&lt; current()])"/>
          </axsl:template>
        </xsl:when>
        <xsl:when test="$tableCaptionNumber = 'document'">
          <axsl:template match="*[contains(@class, ' topic/table ')]/*[contains(@class, ' topic/title ')]" mode="table.title-number">
            <axsl:value-of select="count(key('enumerableByClass', 'topic/table')[. &lt;&lt; current()])"/>
          </axsl:template>
        </xsl:when>
      </xsl:choose>
      <!-- caption position -->
      <xsl:if test="$root ?style-table-caption-position = 'after'">
        <axsl:template match="*[contains(@class, ' topic/table ')]">
          <axsl:variable name="scale">
            <axsl:call-template name="getTableScale"/>
          </axsl:variable>
          <fo:block axsl:use-attribute-sets="table">
            <axsl:call-template name="commonattributes"/>
            <axsl:if test="not(@id)">
              <axsl:attribute name="id">
                <axsl:call-template name="get-id"/>
              </axsl:attribute>
            </axsl:if>
            <axsl:if test="not($scale = '')">
              <axsl:attribute name="font-size" select="concat($scale, '%')"/>
            </axsl:if>
            <axsl:apply-templates select="*[contains(@class, ' topic/tgroup ')]"/>
            <axsl:apply-templates select="*[contains(@class, ' topic/title ') or contains(@class, ' topic/desc ')]"/>
          </fo:block>
        </axsl:template>
      </xsl:if>
      <xsl:choose>
        <xsl:when test="$root ?table-continued">
          <axsl:variable name="table.frame-default" select="'all'"/>

          <axsl:template match="*[contains(@class, ' topic/tbody ')]" name="topic.tbody">
            <fo:table-footer axsl:use-attribute-sets="tgroup.tfoot table__tableframe__top">
              <fo:retrieve-table-marker retrieve-class-name="e:continued"
                                        retrieve-position-within-table="last-ending"
                                        retrieve-boundary-within-table="table-fragment"/>
            </fo:table-footer>
            <fo:table-body axsl:use-attribute-sets="tgroup.tbody">
              <axsl:call-template name="commonattributes"/>
              <fo:marker marker-class-name="e:continued">
                <fo:table-row>
                  <fo:table-cell axsl:use-attribute-sets="e:tfoot.row.entry.continued" number-columns-spanned="{{../@cols}}">
                    <axsl:variable name="frame">
                      <axsl:choose>
                        <axsl:when test="../../@frame">
                          <axsl:value-of select="../../@frame"/>
                        </axsl:when>
                        <axsl:otherwise>
                          <axsl:value-of select="$table.frame-default"/>
                        </axsl:otherwise>
                      </axsl:choose>
                    </axsl:variable>
                    <axsl:if test="$frame = 'all' or $frame = 'topbot' or $frame = 'bottom'">
                      <axsl:call-template name="processAttrSetReflection">
                        <axsl:with-param name="attrSet" select="'__tableframe__top'"/>
                        <axsl:with-param name="path" select="$tableAttrs"/>
                      </axsl:call-template>
                    </axsl:if>
                    <fo:block>
                      <axsl:call-template name="getVariable">
                        <axsl:with-param name="id" select="'#table-continued'"/>
                      </axsl:call-template>
                    </fo:block>
                  </fo:table-cell>
                </fo:table-row>
              </fo:marker>
              <axsl:apply-templates/>
            </fo:table-body>
          </axsl:template>

          <axsl:template match="*[contains(@class, ' topic/tbody ')]/*[contains(@class, ' topic/row ')]" name="topic.tbody_row">
            <fo:table-row axsl:use-attribute-sets="tbody.row">
              <axsl:call-template name="commonattributes"/>
              <axsl:if test="not(following-sibling::*)">
                <fo:marker marker-class-name="e:continued"/>
              </axsl:if>
              <axsl:apply-templates/>
            </fo:table-row>
          </axsl:template>
        </xsl:when>
        <xsl:otherwise>
          <axsl:template match="*[contains(@class, ' topic/tbody ')]" name="topic.tbody">
            <fo:table-footer axsl:use-attribute-sets="tgroup.tfoot">
              <fo:table-row>
                <fo:table-cell number-columns-spanned="{{../@cols}}"/>
              </fo:table-row>
            </fo:table-footer>
            <fo:table-body axsl:use-attribute-sets="tgroup.tbody">
              <axsl:call-template name="commonattributes"/>
              <axsl:apply-templates/>
            </fo:table-body>
          </axsl:template>
        </xsl:otherwise>
      </xsl:choose>
      <xsl:variable name="dlStyle" select="$root ?style-dl-dl-type"/>
      <xsl:choose>
        <xsl:when test="$dlStyle = 'list'">
          <axsl:template match="*[contains(@class, ' topic/dl ')]">
            <fo:list-block axsl:use-attribute-sets="ul e:dl">
              <axsl:call-template name="commonattributes"/>
              <axsl:apply-templates select="*[contains(@class, ' topic/dlentry ')]"/>
            </fo:list-block>
          </axsl:template>

          <axsl:template match="*[contains(@class, ' topic/dlentry ')]">
            <fo:list-item axsl:use-attribute-sets="ul.li">
              <fo:list-item-label axsl:use-attribute-sets="ul.li__label">
                <fo:block axsl:use-attribute-sets="ul.li__label__content">
                  <axsl:call-template name="commonattributes"/>
                  <axsl:call-template name="getVariable">
                    <axsl:with-param name="id" select="'Unordered List bullet'"/>
                  </axsl:call-template>
                </fo:block>
              </fo:list-item-label>
              <fo:list-item-body axsl:use-attribute-sets="ul.li__body">
                <fo:block axsl:use-attribute-sets="ul.li__content">
                  <axsl:apply-templates select="*[contains(@class, ' topic/dt ')]"/>
                  <axsl:apply-templates select="*[contains(@class, ' topic/dd ')]"/>
                </fo:block>
              </fo:list-item-body>
            </fo:list-item>
          </axsl:template>

          <axsl:template match="*[contains(@class, ' topic/dt ')]">
            <fo:block axsl:use-attribute-sets="e:dlentry.dt__content">
              <axsl:apply-templates/>
            </fo:block>
          </axsl:template>

          <axsl:template match="*[contains(@class, ' topic/dd ')]">
            <fo:block axsl:use-attribute-sets="e:dlentry.dd__content">
              <axsl:apply-templates/>
            </fo:block>
          </axsl:template>
        </xsl:when>
        <xsl:when test="$dlStyle = 'html'">
          <axsl:template match="*[contains(@class, ' topic/dl ')]">
            <fo:block axsl:use-attribute-sets="e:dl">
              <axsl:call-template name="commonattributes" />
              <axsl:apply-templates select="*[contains(@class, ' topic/dlentry ')]" />
            </fo:block>
          </axsl:template>

          <axsl:template match="*[contains(@class, ' topic/dlentry ')]">
            <fo:block>
              <axsl:apply-templates select="*[contains(@class, ' topic/dt ')]" />
              <axsl:apply-templates select="*[contains(@class, ' topic/dd ')]" />
            </fo:block>
          </axsl:template>

          <axsl:template match="*[contains(@class, ' topic/dt ')]">
            <fo:block axsl:use-attribute-sets="e:dlentry.dt__content">
              <axsl:apply-templates />
            </fo:block>
          </axsl:template>

          <axsl:template match="*[contains(@class, ' topic/dd ')]">
            <fo:block axsl:use-attribute-sets="e:dlentry.dd__content">
              <axsl:apply-templates />
            </fo:block>
          </axsl:template>
        </xsl:when>
      </xsl:choose>
    </axsl:stylesheet>
  </xsl:template>

  <xsl:template match=".[. instance of map(*)]" mode="attr">
    <axsl:stylesheet version="2.0">
      <xsl:call-template name="generate-namespace-node"/>
      <!-- dl -->
      <xsl:if test="$root ?style-dl-dl-type">
        <axsl:attribute-set name="e:dl" use-attribute-sets="common.block">
          <xsl:call-template name="generate-attribute-set">
            <xsl:with-param name="prefix" select="'style-dl'"/>
          </xsl:call-template>
        </axsl:attribute-set>
        <axsl:attribute-set name="e:dlentry.dt__content">
          <xsl:if test="$root ?style-dl-dl-type = 'html'">
            <xsl:attribute name="use-attribute-sets">common.block</xsl:attribute>
          </xsl:if>
          <axsl:attribute name="font-weight">bold</axsl:attribute>
          <axsl:attribute name="keep-with-next">always</axsl:attribute>
        </axsl:attribute-set>
        <axsl:attribute-set name="e:dlentry.dd__content">
          <xsl:if test="$root ?style-dl-dl-type = 'html'">
            <xsl:attribute name="use-attribute-sets">common.block</xsl:attribute>
            <axsl:attribute name="start-indent">from-parent(start-indent) + 5mm</axsl:attribute>
          </xsl:if>
        </axsl:attribute-set>
      </xsl:if>

      <!-- table continued -->
      <xsl:if test="$root ?table-continued">
        <axsl:attribute-set name="e:tfoot.row.entry.continued">
          <axsl:attribute name="border-right-style">hidden</axsl:attribute>
          <axsl:attribute name="border-left-style">hidden</axsl:attribute>
          <axsl:attribute name="text-align">end</axsl:attribute>
          <axsl:attribute name="font-style">italic</axsl:attribute>
        </axsl:attribute-set>
      </xsl:if>

      <!-- table -->
      <axsl:attribute-set name="table.title">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-table-caption'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="table.tgroup">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-table'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="thead.row">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-table-header'"/>
        </xsl:call-template>
      </axsl:attribute-set>
      <axsl:attribute-set name="thead.row.entry">
        <axsl:attribute name="background-color">inherit</axsl:attribute>
      </axsl:attribute-set>
      <axsl:attribute-set name="tbody.row.entry">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-table-entry'"/>
        </xsl:call-template>
      </axsl:attribute-set>

      <!-- simpletable -->
      <axsl:attribute-set name="sthead">
        <xsl:call-template name="generate-attribute-set">
          <xsl:with-param name="prefix" select="'style-table-header'"/>
        </xsl:call-template>
      </axsl:attribute-set>

    </axsl:stylesheet>
  </xsl:template>

</xsl:stylesheet>
