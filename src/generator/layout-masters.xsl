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
      <xsl:call-template name="generate-namespace-node"/>
      <xsl:if test=". ?blank_pages">
        <axsl:variable name="blank-pages" select="true()"/>

        <axsl:template match="/" mode="create-page-masters">
          <axsl:variable name="base" as="element()*">
            <axsl:next-match/>
          </axsl:variable>
          <axsl:copy-of select="$base"/>
          <axsl:if test="$blank-pages">
            <axsl:apply-templates select="$base[ends-with(@master-name, '-odd') or ends-with(@master-name, '-even')]"
                                  mode="blankPage"/>
          </axsl:if>
        </axsl:template>

        <axsl:template match="@* | node()" mode="blankPage">
          <axsl:copy>
            <axsl:apply-templates select="@* | node()" mode="blankPage"/>
          </axsl:copy>
        </axsl:template>
        <axsl:template match="fo:simple-page-master/@master-name" mode="blankPage">
          <axsl:attribute name="{{name()}}" select="concat(., '--blank')"/>
        </axsl:template>
        <axsl:template match="fo:region-before/@region-name" mode="blankPage">
          <axsl:attribute name="{{name()}}" select="concat(., '--blank')"/>
        </axsl:template>

        <axsl:template match="/" mode="create-page-sequences">
          <axsl:call-template name="generate-page-sequence-master">
            <axsl:with-param name="master-name" select="'toc-sequence'"/>
            <axsl:with-param name="master-reference" select="'toc'"/>
            <axsl:with-param name="last" select="not($blank-pages)"/>
            <axsl:with-param name="blank" select="$blank-pages"/>
          </axsl:call-template>
          <axsl:call-template name="generate-page-sequence-master">
            <axsl:with-param name="master-name" select="'body-sequence'"/>
            <axsl:with-param name="master-reference" select="'body'"/>
            <axsl:with-param name="last" select="not($blank-pages)"/>
            <axsl:with-param name="blank" select="$blank-pages"/>
          </axsl:call-template>
          <axsl:call-template name="generate-page-sequence-master">
            <axsl:with-param name="master-name" select="'ditamap-body-sequence'"/>
            <axsl:with-param name="master-reference" select="'body'"/>
            <axsl:with-param name="first" select="false()"/>
            <axsl:with-param name="last" select="false()"/>
            <axsl:with-param name="blank" select="$blank-pages"/>
          </axsl:call-template>
          <axsl:call-template name="generate-page-sequence-master">
            <axsl:with-param name="master-name" select="'index-sequence'"/>
            <axsl:with-param name="master-reference" select="'index'"/>
            <axsl:with-param name="last" select="not($blank-pages)"/>
            <axsl:with-param name="blank" select="$blank-pages"/>
          </axsl:call-template>
          <axsl:call-template name="generate-page-sequence-master">
            <axsl:with-param name="master-name" select="'front-matter'"/>
            <axsl:with-param name="master-reference" select="'front-matter'"/>
            <axsl:with-param name="last" select="not($blank-pages)"/>
            <axsl:with-param name="blank" select="$blank-pages"/>
          </axsl:call-template>
          <axsl:if test="$generate-back-cover">
            <axsl:call-template name="generate-page-sequence-master">
              <axsl:with-param name="master-name" select="'back-cover'"/>
              <axsl:with-param name="master-reference" select="'back-cover'"/>
              <axsl:with-param name="first" select="false()"/>
            </axsl:call-template>
          </axsl:if>
          <axsl:call-template name="generate-page-sequence-master">
            <axsl:with-param name="master-name" select="'glossary-sequence'"/>
            <axsl:with-param name="master-reference" select="'glossary'"/>
            <axsl:with-param name="last" select="not($blank-pages)"/>
            <axsl:with-param name="blank" select="$blank-pages"/>
          </axsl:call-template>
        </axsl:template>

        <!-- Generate a page sequence master -->
        <axsl:template name="generate-page-sequence-master">
          <axsl:param name="master-name"/>
          <axsl:param name="master-reference"/>
          <axsl:param name="first" select="true()"/>
          <axsl:param name="last" select="true()"/>
          <axsl:param name="blank" select="false()"/>
          <fo:page-sequence-master master-name="{{$master-name}}">
            <fo:repeatable-page-master-alternatives>
              <axsl:if test="$first">
                <fo:conditional-page-master-reference master-reference="{{$master-reference}}-first"
                                                      odd-or-even="odd" page-position="first"/>
              </axsl:if>
              <axsl:if test="$last">
                <fo:conditional-page-master-reference master-reference="{{$master-reference}}-last"
                                                      odd-or-even="even" page-position="last"/>
                <!--blank-or-not-blank="blank"-->
              </axsl:if>
              <axsl:choose>
                <axsl:when test="$mirror-page-margins">
                  <axsl:if test="$blank">
                    <fo:conditional-page-master-reference master-reference="{{$master-reference}}-odd--blank"
                                                          odd-or-even="odd"
                                                          blank-or-not-blank="blank"/>
                    <fo:conditional-page-master-reference master-reference="{{$master-reference}}-even--blank"
                                                          odd-or-even="even"
                                                          blank-or-not-blank="blank"/>
                  </axsl:if>
                  <fo:conditional-page-master-reference master-reference="{{$master-reference}}-odd"
                                                        odd-or-even="odd"/>
                  <fo:conditional-page-master-reference master-reference="{{$master-reference}}-even"
                                                        odd-or-even="even"/>
                </axsl:when>
                <axsl:otherwise>
                  <axsl:if test="$blank">
                    <fo:conditional-page-master-reference master-reference="{{$master-reference}}-odd--blank"
                                                          odd-or-even="odd"
                                                          blank-or-not-blank="blank"/>
                  </axsl:if>
                  <fo:conditional-page-master-reference master-reference="{{$master-reference}}-odd"/>
                </axsl:otherwise>
              </axsl:choose>
            </fo:repeatable-page-master-alternatives>
          </fo:page-sequence-master>
        </axsl:template>
      </xsl:if>
    </axsl:stylesheet>
  </xsl:template>

  <xsl:template match=".[. instance of map(*)]" mode="attr">
    <axsl:stylesheet version="2.0">
      <xsl:call-template name="generate-namespace-node"/>
      <!-- page column count -->
      <xsl:if test="exists(.('body_column_count'))">
        <xsl:variable name="root" select="."/>
        <xsl:for-each select="('region-body.odd', 'region-body.even')">
          <axsl:attribute-set name="{.}">
            <axsl:attribute name="column-count">
              <xsl:value-of select="$root('body_column_count')"/>
            </axsl:attribute>
            <xsl:if test="$root('column_gap')">
              <axsl:attribute name="column-gap">
                <xsl:value-of select="$root('column_gap')"/>
              </axsl:attribute>
            </xsl:if>
          </axsl:attribute-set>
        </xsl:for-each>
        <xsl:for-each select="('region-bodyfrontmatter.odd', 'region-bodyfrontmatter.even')">
          <axsl:attribute-set name="{.}">
            <axsl:attribute name="column-count">1</axsl:attribute>
          </axsl:attribute-set>
        </xsl:for-each>
        <xsl:if test="exists(.('index_column_count'))">
          <xsl:for-each select="('region-bodyindex.odd', 'region-bodyindex.even')">
            <axsl:attribute-set name="{.}">
              <axsl:attribute name="column-count">
                <xsl:value-of select="$root('index_column_count')"/>
              </axsl:attribute>
            </axsl:attribute-set>
          </xsl:for-each>
        </xsl:if>
      </xsl:if>
    </axsl:stylesheet>
  </xsl:template>

</xsl:stylesheet>