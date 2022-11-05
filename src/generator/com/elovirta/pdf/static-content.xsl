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
      <xsl:if test="false() and $root ?blank-pages">
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

      <xsl:if test="$root ?blank-pages">
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
      </xsl:if>

      <!-- TOC -->
      <xsl:call-template name="generate-insert-static-contents">
        <xsl:with-param name="sequence" select="'toc'"/>
      </xsl:call-template>
      <xsl:call-template name="generateInsert">
        <xsl:with-param name="header" select="$root ?header-odd-content"/>
        <xsl:with-param name="sequence" select="'toc'"/>
        <xsl:with-param name="flow" select="'header'"/>
        <xsl:with-param name="type" select="'odd'"/>
      </xsl:call-template>
      <xsl:if test="$root ?page-mirror-margins">
        <xsl:call-template name="generateInsert">
          <xsl:with-param name="header" select="$root ?header-even-content"/>
          <xsl:with-param name="sequence" select="'toc'"/>
          <xsl:with-param name="flow" select="'header'"/>
          <xsl:with-param name="type" select="'even'"/>
        </xsl:call-template>
      </xsl:if>
      <xsl:call-template name="generateInsert">
        <xsl:with-param name="header" select="$root ?footer-odd-content"/>
        <xsl:with-param name="sequence" select="'toc'"/>
        <xsl:with-param name="flow" select="'footer'"/>
        <xsl:with-param name="type" select="'odd'"/>
      </xsl:call-template>
      <xsl:if test="$root ?page-mirror-margins">
        <xsl:call-template name="generateInsert">
          <xsl:with-param name="header" select="$root ?footer-even-content"/>
          <xsl:with-param name="sequence" select="'toc'"/>
          <xsl:with-param name="flow" select="'footer'"/>
          <xsl:with-param name="type" select="'even'"/>
        </xsl:call-template>
      </xsl:if>

      <!-- Body -->
      <xsl:call-template name="generate-insert-static-contents">
        <xsl:with-param name="sequence" select="'body'"/>
      </xsl:call-template>
      <xsl:call-template name="generateInsert">
        <xsl:with-param name="header" select="$root ?header-odd-content"/>
        <xsl:with-param name="sequence" select="'body'"/>
        <xsl:with-param name="flow" select="'header'"/>
        <xsl:with-param name="type" select="'odd'"/>
      </xsl:call-template>
      <xsl:if test="$root ?page-mirror-margins">
        <xsl:call-template name="generateInsert">
          <xsl:with-param name="header" select="$root ?header-even-content"/>
          <xsl:with-param name="sequence" select="'body'"/>
          <xsl:with-param name="flow" select="'header'"/>
          <xsl:with-param name="type" select="'even'"/>
        </xsl:call-template>
      </xsl:if>
      <xsl:call-template name="generateInsert">
        <xsl:with-param name="header" select="$root ?footer-odd-content"/>
        <xsl:with-param name="sequence" select="'body'"/>
        <xsl:with-param name="flow" select="'footer'"/>
        <xsl:with-param name="type" select="'odd'"/>
      </xsl:call-template>
      <xsl:if test="$root ?page-mirror-margins">
        <xsl:call-template name="generateInsert">
          <xsl:with-param name="header" select="$root ?footer-even-content"/>
          <xsl:with-param name="sequence" select="'body'"/>
          <xsl:with-param name="flow" select="'footer'"/>
          <xsl:with-param name="type" select="'even'"/>
        </xsl:call-template>
      </xsl:if>

      <!-- Cover -->
      <axsl:template name="insertFrontMatterOddHeader">
        <fo:static-content flow-name="odd-frontmatter-header"/>
        <!--          <axsl:call-template name="insertBodyOddHeader">-->
        <!--            <axsl:with-param name="flow-name" select="'odd-frontmatter-header'"/>-->
        <!--          </axsl:call-template>-->
      </axsl:template>

      <axsl:template name="insertFrontMatterEvenHeader">
        <fo:static-content flow-name="even-frontmatter-header"/>
        <!--          <axsl:call-template name="insertBodyOddHeader">-->
        <!--            <axsl:with-param name="flow-name" select="'even-frontmatter-header'"/>-->
        <!--          </axsl:call-template>-->
      </axsl:template>

      <axsl:template name="insertFrontMatterOddFooter">
        <fo:static-content flow-name="odd-frontmatter-footer"/>
        <!--          <axsl:call-template name="insertBodyOddFooter">-->
        <!--            <axsl:with-param name="flow-name" select="'odd-frontmatter-footer'"/>-->
        <!--          </axsl:call-template>-->
      </axsl:template>

      <axsl:template name="insertFrontMatterEvenFooter">
        <fo:static-content flow-name="even-frontmatter-footer"/>
        <!--          <axsl:call-template name="insertBodyOddFooter">-->
        <!--            <axsl:with-param name="flow-name" select="'even-frontmatter-footer'"/>-->
        <!--          </axsl:call-template>-->
      </axsl:template>
    </axsl:stylesheet>
  </xsl:template>

  <xsl:template name="generate-insert-static-contents">
    <xsl:param name="sequence"/>
    <xsl:variable name="sequenceCase" select="concat(upper-case(substring($sequence, 1, 1)), substring($sequence, 2))"/>

    <axsl:template name="insert{$sequenceCase}StaticContents">
      <xsl:if test="$sequence eq 'body'">
        <axsl:call-template name="insert{$sequenceCase}FootnoteSeparator"/>
      </xsl:if>
      <axsl:call-template name="insert{$sequenceCase}OddFooter"/>
      <xsl:if test="$root ?page-mirror-margins">
        <axsl:call-template name="insert{$sequenceCase}EvenFooter"/>
      </xsl:if>
      <axsl:call-template name="insert{$sequenceCase}OddHeader"/>
      <xsl:if test="$root ?blank-pages">
        <axsl:call-template name="generateBlank">
          <axsl:with-param name="base" as="element()?">
            <axsl:call-template name="insert{$sequenceCase}OddHeader"/>
          </axsl:with-param>
        </axsl:call-template>
      </xsl:if>
      <xsl:if test="$root ?page-mirror-margins">
        <axsl:call-template name="insert{$sequenceCase}EvenHeader"/>
        <xsl:if test="$root ?blank-pages">
          <axsl:call-template name="generateBlank">
            <axsl:with-param name="base" as="element()?">
              <axsl:call-template name="insert{$sequenceCase}EvenHeader"/>
            </axsl:with-param>
          </axsl:call-template>
        </xsl:if>
      </xsl:if>
      <xsl:if test="$sequence eq 'body'">
        <axsl:call-template name="insert{$sequenceCase}FirstHeader"/>
        <axsl:call-template name="insert{$sequenceCase}FirstFooter"/>
        <axsl:call-template name="insert{$sequenceCase}LastHeader"/>
        <axsl:call-template name="insert{$sequenceCase}LastFooter"/>
      </xsl:if>
    </axsl:template>
  </xsl:template>

  <xsl:template name="generateInsert">
    <xsl:param name="header" as="array(*)?"/>
    <xsl:param name="sequence" select="'body'"/>
    <xsl:param name="flow"/>
    <xsl:param name="type"/>

    <xsl:if test="exists($header)">
      <xsl:variable name="flowCase" select="concat(upper-case(substring($flow, 1, 1)), substring($flow, 2))"/>
      <xsl:variable name="typeCase" select="concat(upper-case(substring($type, 1, 1)), substring($type, 2))"/>
      <xsl:variable name="sequenceCase" select="concat(upper-case(substring($sequence, 1, 1)), substring($sequence, 2))"/>
      <xsl:comment select="concat($flow, ' ', $type)"/>
      <axsl:template name="insert{$sequenceCase}{$typeCase}{$flowCase}">
        <axsl:param name="flow-name" as="xs:string" select="'{$type}-{$sequence}-{$flow}'"/>
        <fo:static-content flow-name="{{$flow-name}}">
          <!--fo:block-container axsl:use-attribute-sets="__body-container__{$type}__{$flow}"-->
          <fo:block axsl:use-attribute-sets="__{$sequence}__{$type}__{$flow}">
            <xsl:call-template name="insert-content">
              <xsl:with-param name="id" select="concat($sequenceCase, ' ', $type, ' ', $flow)"/>
            </xsl:call-template>
          </fo:block>
          <!--/fo:block-container-->
        </fo:static-content>
      </axsl:template>
    </xsl:if>
  </xsl:template>

  <xsl:template match=".[. instance of map(*)]" mode="attr">
    <axsl:stylesheet version="2.0">
      <xsl:call-template name="generate-namespace-node"/>

      <xsl:call-template name="generate-header-attribute-sets">
        <xsl:with-param name="flow" select="'header'"/>
        <xsl:with-param name="type" select="'odd'"/>
      </xsl:call-template>
      <xsl:if test="$root ?page-mirror-margins">
        <xsl:call-template name="generate-header-attribute-sets">
          <xsl:with-param name="flow" select="'header'"/>
          <xsl:with-param name="type" select="'even'"/>
        </xsl:call-template>
      </xsl:if>

      <xsl:call-template name="generate-header-attribute-sets">
        <xsl:with-param name="flow" select="'footer'"/>
        <xsl:with-param name="type" select="'odd'"/>
      </xsl:call-template>
      <xsl:if test="$root ?page-mirror-margins">
        <xsl:call-template name="generate-header-attribute-sets">
          <xsl:with-param name="flow" select="'footer'"/>
          <xsl:with-param name="type" select="'even'"/>
        </xsl:call-template>
      </xsl:if>

      <xsl:if test="$root ?blank-pages">
        <axsl:attribute-set name="blank_page">
          <axsl:attribute name="position">absolute</axsl:attribute>
          <axsl:attribute name="top">100mm</axsl:attribute>
          <axsl:attribute name="text-align">center</axsl:attribute>
        </axsl:attribute-set>
      </xsl:if>
    </axsl:stylesheet>
  </xsl:template>

  <xsl:variable name="viewport-area-properties" select="
    'block-progression-dimension',
    'height',
    'space-before',
    'space-before.conditionality',
    'space-after',
    'space-after.conditionality',
    'start-indent',
    'end-indent'
  "/>
  
  <xsl:template name="generate-header-attribute-sets">
    <xsl:param name="flow"/>
    <xsl:param name="type"/>

    <axsl:attribute-set name="{$type}__{$flow}">
      <xsl:call-template name="generate-attribute-set">
        <xsl:with-param name="prefix" select="concat($flow, '-', $type)"/>
      </xsl:call-template>
      <!--xsl:for-each select="$viewport-area-properties">
        <axsl:attribute name="{.}" select="'auto'"/>
      </xsl:for-each-->
    </axsl:attribute-set>
    <!--axsl:attribute-set name="container__{$type}__{$flow}">
      <xsl:call-template name="attribute-set">
        <xsl:with-param name="style" select=".($flow)($type)"/>
        <!- -xsl:with-param name="properties" select="$viewport-area-properties"/- ->
      </xsl:call-template>
    </axsl:attribute-set>
    <xsl:for-each select="('body', 'toc', 'index', 'glossary')">
      <axsl:attribute-set name="__{.}-container__{$type}__{$flow}" use-attribute-sets="container__{$type}__{$flow}"/>
    </xsl:for-each-->
  </xsl:template>

</xsl:stylesheet>