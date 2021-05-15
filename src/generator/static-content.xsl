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
        <axsl:template name="insertBodyStaticContents">
          <axsl:call-template name="insertBodyFootnoteSeparator"/>
          <axsl:call-template name="insertBodyOddFooter"/>
          <axsl:if test="$mirror-page-margins">
            <axsl:call-template name="insertBodyEvenFooter"/>
          </axsl:if>
          <axsl:call-template name="insertBodyOddHeader"/>
          <axsl:call-template name="generateBlank">
            <axsl:with-param name="base" as="element()?">
              <axsl:call-template name="insertBodyOddHeader"/>
            </axsl:with-param>
          </axsl:call-template>
          <axsl:if test="$mirror-page-margins">
            <axsl:call-template name="insertBodyEvenHeader"/>
            <axsl:call-template name="generateBlank">
              <axsl:with-param name="base" as="element()?">
                <axsl:call-template name="insertBodyEvenHeader"/>
              </axsl:with-param>
            </axsl:call-template>
          </axsl:if>
          <axsl:call-template name="insertBodyFirstHeader"/>
          <axsl:call-template name="insertBodyFirstFooter"/>
          <axsl:call-template name="insertBodyLastHeader"/>
          <axsl:call-template name="insertBodyLastFooter"/>
        </axsl:template>

        <axsl:template name="insertTocStaticContents">
          <axsl:call-template name="insertTocOddFooter"/>
          <axsl:if test="$mirror-page-margins">
            <axsl:call-template name="insertTocEvenFooter"/>
          </axsl:if>
          <axsl:call-template name="insertTocOddHeader"/>
          <axsl:call-template name="generateBlank">
            <axsl:with-param name="base" as="element()?">
              <axsl:call-template name="insertTocOddHeader"/>
            </axsl:with-param>
          </axsl:call-template>
          <axsl:if test="$mirror-page-margins">
            <axsl:call-template name="insertTocEvenHeader"/>
            <axsl:call-template name="generateBlank">
              <axsl:with-param name="base" as="element()?">
                <axsl:call-template name="insertTocEvenHeader"/>
              </axsl:with-param>
            </axsl:call-template>
          </axsl:if>
        </axsl:template>

        <axsl:template name="insertIndexStaticContents">
          <axsl:call-template name="insertIndexOddFooter"/>
          <axsl:if test="$mirror-page-margins">
            <axsl:call-template name="insertIndexEvenFooter"/>
          </axsl:if>
          <axsl:call-template name="insertIndexOddHeader"/>
          <axsl:call-template name="generateBlank">
            <axsl:with-param name="base" as="element()?">
              <axsl:call-template name="insertIndexOddHeader"/>
            </axsl:with-param>
          </axsl:call-template>
          <axsl:if test="$mirror-page-margins">
            <axsl:call-template name="insertIndexEvenHeader"/>
            <axsl:call-template name="generateBlank">
              <axsl:with-param name="base" as="element()?">
                <axsl:call-template name="insertIndexEvenHeader"/>
              </axsl:with-param>
            </axsl:call-template>
          </axsl:if>
        </axsl:template>

        <axsl:template name="insertPrefaceStaticContents">
          <axsl:call-template name="insertPrefaceFootnoteSeparator"/>
          <axsl:call-template name="insertPrefaceOddFooter"/>
          <axsl:if test="$mirror-page-margins">
            <axsl:call-template name="insertPrefaceEvenFooter"/>
          </axsl:if>
          <axsl:call-template name="insertPrefaceOddHeader"/>
          <axsl:call-template name="generateBlank">
            <axsl:with-param name="base" as="element()?">
              <axsl:call-template name="insertPrefaceOddHeader"/>
            </axsl:with-param>
          </axsl:call-template>
          <axsl:if test="$mirror-page-margins">
            <axsl:call-template name="insertPrefaceEvenHeader"/>
            <axsl:call-template name="generateBlank">
              <axsl:with-param name="base" as="element()?">
                <axsl:call-template name="insertPrefaceEvenHeader"/>
              </axsl:with-param>
            </axsl:call-template>
          </axsl:if>
          <axsl:call-template name="insertPrefaceFirstHeader"/>
          <axsl:call-template name="insertPrefaceFirstFooter"/>
        </axsl:template>

        <axsl:template name="insertFrontMatterStaticContents">
          <axsl:call-template name="insertFrontMatterFootnoteSeparator"/>
          <axsl:call-template name="insertFrontMatterOddFooter"/>
          <axsl:if test="$mirror-page-margins">
            <axsl:call-template name="insertFrontMatterEvenFooter"/>
          </axsl:if>
          <axsl:call-template name="insertFrontMatterOddHeader"/>
          <axsl:call-template name="generateBlank">
            <axsl:with-param name="base" as="element()?">
              <axsl:call-template name="insertFrontMatterOddHeader"/>
            </axsl:with-param>
          </axsl:call-template>
          <axsl:if test="$mirror-page-margins">
            <axsl:call-template name="insertFrontMatterEvenHeader"/>
            <axsl:call-template name="generateBlank">
              <axsl:with-param name="base" as="element()?">
                <axsl:call-template name="insertFrontMatterEvenHeader"/>
              </axsl:with-param>
            </axsl:call-template>
          </axsl:if>
        </axsl:template>

        <axsl:template name="insertBackCoverStaticContents">
          <axsl:call-template name="insertBackCoverOddFooter"/>
          <axsl:if test="$mirror-page-margins">
            <axsl:call-template name="insertBackCoverEvenFooter"/>
          </axsl:if>
          <axsl:call-template name="insertBackCoverOddHeader"/>
          <axsl:if test="$mirror-page-margins">
            <axsl:call-template name="insertBackCoverEvenHeader"/>
          </axsl:if>
        </axsl:template>

        <axsl:template name="insertGlossaryStaticContents">
          <axsl:call-template name="insertGlossaryOddFooter"/>
          <axsl:if test="$mirror-page-margins">
            <axsl:call-template name="insertGlossaryEvenFooter"/>
          </axsl:if>
          <axsl:call-template name="insertGlossaryOddHeader"/>
          <axsl:call-template name="generateBlank">
            <axsl:with-param name="base" as="element()?">
              <axsl:call-template name="insertGlossaryOddHeader"/>
            </axsl:with-param>
          </axsl:call-template>
          <axsl:if test="$mirror-page-margins">
            <axsl:call-template name="insertGlossaryEvenHeader"/>
            <axsl:call-template name="generateBlank">
              <axsl:with-param name="base" as="element()?">
                <axsl:call-template name="insertGlossaryEvenHeader"/>
              </axsl:with-param>
            </axsl:call-template>
          </axsl:if>
        </axsl:template>

        <axsl:template name="generateBlank">
          <axsl:param name="base" as="element()?"/>
          <fo:static-content flow-name="{{$base/@flow-name}}--blank">
            <axsl:copy-of select="$base/*"/>
            <fo:block-container axsl:use-attribute-sets="blank_page">
              <fo:block>
                <axsl:call-template name="getVariable">
                  <axsl:with-param name="id" select="'blank_page'"/>
                </axsl:call-template>
              </fo:block>
            </fo:block-container>
          </fo:static-content>
        </axsl:template>

        <!-- Body -->

        <!--
        <axsl:template name="insertBodyOddHeader">
          <axsl:param name="flow-name" as="xs:string" select="'odd-body-header'"/>
          <fo:static-content flow-name="{$flow-name}">
            <fo:block axsl:use-attribute-sets="__body__odd__header">
              <axsl:call-template name="getVariable">
                <axsl:with-param name="id" select="'Body odd header'"/>
                <axsl:with-param name="params">
                  <prodname>
                    <axsl:value-of select="$productName"/>
                  </prodname>
                  <heading>
                    <fo:inline axsl:use-attribute-sets="__body__odd__header__heading">
                      <fo:retrieve-marker retrieve-class-name="current-header"/>
                    </fo:inline>
                  </heading>
                  <pagenum>
                    <fo:inline axsl:use-attribute-sets="__body__odd__header__pagenum">
                      <fo:page-number/>
                    </fo:inline>
                  </pagenum>
                </axsl:with-param>
              </axsl:call-template>
            </fo:block>
          </fo:static-content>
        </axsl:template>

        <axsl:template name="insertBodyEvenHeader">
          <axsl:param name="flow-name" as="xs:string" select="'even-body-header'"/>
          <fo:static-content flow-name="{$flow-name}">
            <fo:block axsl:use-attribute-sets="__body__even__header">
              <axsl:call-template name="getVariable">
                <axsl:with-param name="id" select="'Body even header'"/>
                <axsl:with-param name="params">
                  <prodname>
                    <axsl:value-of select="$productName"/>
                  </prodname>
                  <heading>
                    <fo:inline axsl:use-attribute-sets="__body__even__header__heading">
                      <fo:retrieve-marker retrieve-class-name="current-header"/>
                    </fo:inline>
                  </heading>
                  <pagenum>
                    <fo:inline axsl:use-attribute-sets="__body__even__header__pagenum">
                      <fo:page-number/>
                    </fo:inline>
                  </pagenum>
                </axsl:with-param>
              </axsl:call-template>
            </fo:block>
          </fo:static-content>
        </axsl:template>
        -->
        <axsl:template name="insertBodyFirstHeader">
          <axsl:call-template name="insertBodyOddHeader">
            <axsl:with-param name="flow-name" select="'first-body-header'"/>
          </axsl:call-template>
        </axsl:template>

        <axsl:template name="insertBodyLastHeader">
          <axsl:call-template name="insertBodyOddHeader">
            <axsl:with-param name="flow-name" select="'last-body-header'"/>
          </axsl:call-template>
        </axsl:template>

        <!--
        <axsl:template name="insertBodyOddFooter">
          <axsl:param name="flow-name" as="xs:string" select="'odd-body-footer'"/>
          <fo:static-content flow-name="{$flow-name}">
            <fo:block axsl:use-attribute-sets="__body__odd__footer">
              <axsl:call-template name="getVariable">
                <axsl:with-param name="id" select="'Body odd footer'"/>
                <axsl:with-param name="params">
                  <heading>
                    <fo:inline axsl:use-attribute-sets="__body__odd__footer__heading">
                      <fo:retrieve-marker retrieve-class-name="current-header"/>
                    </fo:inline>
                  </heading>
                  <pagenum>
                    <fo:inline axsl:use-attribute-sets="__body__odd__footer__pagenum">
                      <fo:page-number/>
                    </fo:inline>
                  </pagenum>
                </axsl:with-param>
              </axsl:call-template>
            </fo:block>
          </fo:static-content>
        </axsl:template>

        <axsl:template name="insertBodyEvenFooter">
          <axsl:param name="flow-name" as="xs:string" select="'odd-body-footer'"/>
          <fo:static-content flow-name="{$flow-name}">
            <fo:block axsl:use-attribute-sets="__body__even__footer">
              <axsl:call-template name="getVariable">
                <axsl:with-param name="id" select="'Body even footer'"/>
                <axsl:with-param name="params">
                  <heading>
                    <fo:inline axsl:use-attribute-sets="__body__even__footer__heading">
                      <fo:retrieve-marker retrieve-class-name="current-header"/>
                    </fo:inline>
                  </heading>
                  <pagenum>
                    <fo:inline axsl:use-attribute-sets="__body__even__footer__pagenum">
                      <fo:page-number/>
                    </fo:inline>
                  </pagenum>
                </axsl:with-param>
              </axsl:call-template>
            </fo:block>
          </fo:static-content>
        </axsl:template>
        -->

        <axsl:template name="insertBodyFirstFooter">
          <axsl:call-template name="insertBodyOddFooter">
            <axsl:with-param name="flow-name" select="'first-body-footer'"/>
          </axsl:call-template>
        </axsl:template>

        <axsl:template name="insertBodyLastFooter">
          <axsl:call-template name="insertBodyEvenFooter">
            <axsl:with-param name="flow-name" select="'last-body-footer'"/>
          </axsl:call-template>
        </axsl:template>

        <axsl:template name="insertBodyFootnoteSeparator">
          <fo:static-content flow-name="xsl-footnote-separator">
            <fo:block>
              <fo:leader axsl:use-attribute-sets="__body__footnote__separator"/>
            </fo:block>
          </fo:static-content>
        </axsl:template>

        <!-- TOC -->

        <axsl:template name="insertTocOddHeader">
          <axsl:call-template name="insertBodyOddHeader">
            <axsl:with-param name="flow-name" select="'odd-toc-header'"/>
          </axsl:call-template>
        </axsl:template>

        <axsl:template name="insertTocEvenHeader">
          <axsl:call-template name="insertBodyOddHeader">
            <axsl:with-param name="flow-name" select="'even-toc-header'"/>
          </axsl:call-template>
        </axsl:template>

        <axsl:template name="insertTocOddFooter">
          <axsl:call-template name="insertBodyOddFooter">
            <axsl:with-param name="flow-name" select="'odd-toc-footer'"/>
          </axsl:call-template>
        </axsl:template>

        <axsl:template name="insertTocEvenFooter">
          <axsl:call-template name="insertBodyOddFooter">
            <axsl:with-param name="flow-name" select="'even-toc-footer'"/>
          </axsl:call-template>
        </axsl:template>

        <!-- Index -->

        <axsl:template name="insertIndexOddHeader">
          <axsl:call-template name="insertBodyOddHeader">
            <axsl:with-param name="flow-name" select="'odd-index-header'"/>
          </axsl:call-template>
        </axsl:template>

        <axsl:template name="insertIndexEvenHeader">
          <axsl:call-template name="insertBodyOddHeader">
            <axsl:with-param name="flow-name" select="'even-index-header'"/>
          </axsl:call-template>
        </axsl:template>

        <axsl:template name="insertIndexOddFooter">
          <axsl:call-template name="insertBodyOddFooter">
            <axsl:with-param name="flow-name" select="'odd-index-footer'"/>
          </axsl:call-template>
        </axsl:template>

        <axsl:template name="insertIndexEvenFooter">
          <axsl:call-template name="insertBodyOddFooter">
            <axsl:with-param name="flow-name" select="'even-index-footer'"/>
          </axsl:call-template>
        </axsl:template>

        <!-- Preface -->

        <axsl:template name="insertPrefaceOddHeader">
          <axsl:call-template name="insertBodyOddHeader">
            <axsl:with-param name="flow-name" select="'odd-preface-header'"/>
          </axsl:call-template>
        </axsl:template>

        <axsl:template name="insertPrefaceEvenHeader">
          <axsl:call-template name="insertBodyOddHeader">
            <axsl:with-param name="flow-name" select="'even-preface-header'"/>
          </axsl:call-template>
        </axsl:template>

        <axsl:template name="insertPrefaceOddFooter">
          <axsl:call-template name="insertBodyOddFooter">
            <axsl:with-param name="flow-name" select="'odd-preface-footer'"/>
          </axsl:call-template>
        </axsl:template>

        <axsl:template name="insertPrefaceEvenFooter">
          <axsl:call-template name="insertBodyOddFooter">
            <axsl:with-param name="flow-name" select="'even-preface-footer'"/>
          </axsl:call-template>
        </axsl:template>

        <!-- Frontmatter -->

        <axsl:template name="insertFrontMatterOddHeader">
          <axsl:call-template name="insertBodyOddHeader">
            <axsl:with-param name="flow-name" select="'odd-frontmatter-header'"/>
          </axsl:call-template>
        </axsl:template>

        <axsl:template name="insertFrontMatterEvenHeader">
          <axsl:call-template name="insertBodyOddHeader">
            <axsl:with-param name="flow-name" select="'even-frontmatter-header'"/>
          </axsl:call-template>
        </axsl:template>

        <axsl:template name="insertFrontMatterOddFooter">
          <axsl:call-template name="insertBodyOddFooter">
            <axsl:with-param name="flow-name" select="'odd-frontmatter-footer'"/>
          </axsl:call-template>
        </axsl:template>

        <axsl:template name="insertFrontMatterEvenFooter">
          <axsl:call-template name="insertBodyOddFooter">
            <axsl:with-param name="flow-name" select="'even-frontmatter-footer'"/>
          </axsl:call-template>
        </axsl:template>

        <!-- Backcover -->

        <axsl:template name="insertBackCoverOddHeader">
          <axsl:call-template name="insertBodyOddHeader">
            <axsl:with-param name="flow-name" select="'odd-back-cover-header'"/>
          </axsl:call-template>
        </axsl:template>

        <axsl:template name="insertBackCoverEvenHeader">
          <axsl:call-template name="insertBodyOddHeader">
            <axsl:with-param name="flow-name" select="'even-back-cover-header'"/>
          </axsl:call-template>
        </axsl:template>

        <axsl:template name="insertBackCoverOddFooter">
          <axsl:call-template name="insertBodyOddFooter">
            <axsl:with-param name="flow-name" select="'odd-back-cover-footer'"/>
          </axsl:call-template>
        </axsl:template>

        <axsl:template name="insertBackCoverEvenFooter">
          <axsl:call-template name="insertBodyOddFooter">
            <axsl:with-param name="flow-name" select="'even-back-cover-footer'"/>
          </axsl:call-template>
        </axsl:template>

        <!-- Glossary -->

        <axsl:template name="insertGlossaryOddHeader">
          <axsl:call-template name="insertBodyOddHeader">
            <axsl:with-param name="flow-name" select="'odd-glossary-header'"/>
          </axsl:call-template>
        </axsl:template>

        <axsl:template name="insertGlossaryEvenHeader">
          <axsl:call-template name="insertBodyOddHeader">
            <axsl:with-param name="flow-name" select="'even-glossary-header'"/>
          </axsl:call-template>
        </axsl:template>

        <axsl:template name="insertGlossaryOddFooter">
          <axsl:call-template name="insertBodyOddFooter">
            <axsl:with-param name="flow-name" select="'odd-glossary-footer'"/>
          </axsl:call-template>
        </axsl:template>

        <axsl:template name="insertGlossaryEvenFooter">
          <axsl:call-template name="insertBodyOddFooter">
            <axsl:with-param name="flow-name" select="'even-glossary-footer'"/>
          </axsl:call-template>
        </axsl:template>
      </xsl:if>

      <xsl:call-template name="generateInsert">
        <xsl:with-param name="header" select=". ?header ?odd ?content"/>
        <xsl:with-param name="flow" select="'header'"/>
        <xsl:with-param name="type" select="'odd'"/>
      </xsl:call-template>
      <xsl:call-template name="generateInsert">
        <xsl:with-param name="header" select=". ?header ?even ?content"/>
        <xsl:with-param name="flow" select="'header'"/>
        <xsl:with-param name="type" select="'even'"/>
      </xsl:call-template>
      <xsl:call-template name="generateInsert">
        <xsl:with-param name="header" select=". ?footer ?odd ?content"/>
        <xsl:with-param name="flow" select="'footer'"/>
        <xsl:with-param name="type" select="'odd'"/>
      </xsl:call-template>
      <xsl:call-template name="generateInsert">
        <xsl:with-param name="header" select=". ?footer ?even ?content"/>
        <xsl:with-param name="flow" select="'footer'"/>
        <xsl:with-param name="type" select="'even'"/>
      </xsl:call-template>
    </axsl:stylesheet>
  </xsl:template>

  <xsl:template name="generateInsert">
    <xsl:param name="header"/>
    <xsl:param name="flow"/>
    <xsl:param name="type"/>

    <xsl:variable name="flowCase" select="concat(upper-case(substring($flow, 1, 1)), substring($flow, 2))"/>
    <xsl:variable name="typeCase" select="concat(upper-case(substring($type, 1, 1)), substring($type, 2))"/>
    <xsl:comment select="concat($flow, ' ', $type)"/>
    <axsl:template name="insertBody{$typeCase}{$flowCase}">
      <axsl:param name="flow-name" as="xs:string" select="'{$type}-body-{$flow}'"/>
      <fo:static-content flow-name="{{$flow-name}}">
        <fo:block axsl:use-attribute-sets="__body__{$type}__{$flow}">
          <xsl:for-each select="$header">
            <xsl:choose>
              <xsl:when test=". = 'title'">
                <axsl:apply-templates select="/" mode="dita-ot:title-metadata"/>
              </xsl:when>
              <xsl:when test=". = 'chapter'">
                <fo:retrieve-marker retrieve-class-name="current-header"/>
              </xsl:when>
              <xsl:when test=". = 'folio'">
                <fo:page-number/>
              </xsl:when>
              <xsl:when test=". = 'folio-with-total'">
                <!-- FIXME -->
                <fo:page-number/>
                <xsl:text> (</xsl:text>
                <fo:page-number-citation-last ref-id="{{$e:root-id}}"/>
                <xsl:text>)</xsl:text>
              </xsl:when>
            </xsl:choose>
          </xsl:for-each>
        </fo:block>
      </fo:static-content>
    </axsl:template>
  </xsl:template>

  <xsl:template match=".[. instance of map(*)]" mode="attr">
    <axsl:stylesheet version="2.0">
      <xsl:call-template name="generate-namespace-node"/>
      <xsl:if test="exists(. ?header ?odd)">
        <axsl:attribute-set name="odd__header">
          <xsl:call-template name="attribute-set">
            <xsl:with-param name="style" select=". ?header ?odd"/>
          </xsl:call-template>
        </axsl:attribute-set>
      </xsl:if>
      <xsl:if test="exists(. ?header ?even) and . ?mirror_page_margins">
        <axsl:attribute-set name="even__header">
          <xsl:call-template name="attribute-set">
            <xsl:with-param name="style" select=". ?header ?even"/>
          </xsl:call-template>
        </axsl:attribute-set>
      </xsl:if>

      <xsl:if test="exists(. ?footer ?odd)">
        <axsl:attribute-set name="odd__footer">
          <xsl:call-template name="attribute-set">
            <xsl:with-param name="style" select=". ?footer ?odd"/>
          </xsl:call-template>
        </axsl:attribute-set>
      </xsl:if>
      <xsl:if test="exists(. ?footer ?even) and . ?mirror_page_margins">
        <axsl:attribute-set name="even__footer">
          <xsl:call-template name="attribute-set">
            <xsl:with-param name="style" select=". ?footer ?even"/>
          </xsl:call-template>
        </axsl:attribute-set>
      </xsl:if>

      <xsl:if test=". ?blank_pages">
        <axsl:attribute-set name="blank_page">
          <axsl:attribute name="position">absolute</axsl:attribute>
          <axsl:attribute name="top">100mm</axsl:attribute>
          <axsl:attribute name="text-align">center</axsl:attribute>
        </axsl:attribute-set>
      </xsl:if>
    </axsl:stylesheet>
  </xsl:template>

</xsl:stylesheet>