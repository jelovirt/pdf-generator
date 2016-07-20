'use strict'

const ET = require('./elementtree')
const utils = require('./utils')

const xsl = utils.xsl

const static_blanks_raw = `
<xsl:template name="insertBodyStaticContents">
  <xsl:call-template name="insertBodyFootnoteSeparator"/>
  <xsl:call-template name="insertBodyOddFooter"/>
  <xsl:if test="$mirror-page-margins">
    <xsl:call-template name="insertBodyEvenFooter"/>
  </xsl:if>
  <xsl:call-template name="insertBodyOddHeader"/>
  <xsl:call-template name="generateBlank">
    <xsl:with-param name="base" as="element()?">
      <xsl:call-template name="insertBodyOddHeader"/>
    </xsl:with-param>
  </xsl:call-template>
  <xsl:if test="$mirror-page-margins">
    <xsl:call-template name="insertBodyEvenHeader"/>
    <xsl:call-template name="generateBlank">
      <xsl:with-param name="base" as="element()?">
        <xsl:call-template name="insertBodyEvenHeader"/>
      </xsl:with-param>
    </xsl:call-template>
  </xsl:if>
  <xsl:call-template name="insertBodyFirstHeader"/>
  <xsl:call-template name="insertBodyFirstFooter"/>
  <xsl:call-template name="insertBodyLastHeader"/>
  <xsl:call-template name="insertBodyLastFooter"/>
</xsl:template>

<xsl:template name="insertTocStaticContents">
  <xsl:call-template name="insertTocOddFooter"/>
  <xsl:if test="$mirror-page-margins">
    <xsl:call-template name="insertTocEvenFooter"/>
  </xsl:if>
  <xsl:call-template name="insertTocOddHeader"/>
  <xsl:call-template name="generateBlank">
    <xsl:with-param name="base" as="element()?">
      <xsl:call-template name="insertTocOddHeader"/>
    </xsl:with-param>
  </xsl:call-template>
  <xsl:if test="$mirror-page-margins">
    <xsl:call-template name="insertTocEvenHeader"/>
    <xsl:call-template name="generateBlank">
      <xsl:with-param name="base" as="element()?">
        <xsl:call-template name="insertTocEvenHeader"/>
      </xsl:with-param>
    </xsl:call-template>
  </xsl:if>
</xsl:template>

<xsl:template name="insertIndexStaticContents">
  <xsl:call-template name="insertIndexOddFooter"/>
  <xsl:if test="$mirror-page-margins">
    <xsl:call-template name="insertIndexEvenFooter"/>
  </xsl:if>
  <xsl:call-template name="insertIndexOddHeader"/>
  <xsl:call-template name="generateBlank">
    <xsl:with-param name="base" as="element()?">
      <xsl:call-template name="insertIndexOddHeader"/>
    </xsl:with-param>
  </xsl:call-template>
  <xsl:if test="$mirror-page-margins">
    <xsl:call-template name="insertIndexEvenHeader"/>
    <xsl:call-template name="generateBlank">
      <xsl:with-param name="base" as="element()?">
        <xsl:call-template name="insertIndexEvenHeader"/>
      </xsl:with-param>
    </xsl:call-template>
  </xsl:if>
</xsl:template>

<xsl:template name="insertPrefaceStaticContents">
  <xsl:call-template name="insertPrefaceFootnoteSeparator"/>
  <xsl:call-template name="insertPrefaceOddFooter"/>
  <xsl:if test="$mirror-page-margins">
    <xsl:call-template name="insertPrefaceEvenFooter"/>
  </xsl:if>
  <xsl:call-template name="insertPrefaceOddHeader"/>
  <xsl:call-template name="generateBlank">
    <xsl:with-param name="base" as="element()?">
      <xsl:call-template name="insertPrefaceOddHeader"/>
    </xsl:with-param>
  </xsl:call-template>
  <xsl:if test="$mirror-page-margins">
    <xsl:call-template name="insertPrefaceEvenHeader"/>
    <xsl:call-template name="generateBlank">
      <xsl:with-param name="base" as="element()?">
        <xsl:call-template name="insertPrefaceEvenHeader"/>
      </xsl:with-param>
    </xsl:call-template>
  </xsl:if>
  <xsl:call-template name="insertPrefaceFirstHeader"/>
  <xsl:call-template name="insertPrefaceFirstFooter"/>
</xsl:template>

<xsl:template name="insertFrontMatterStaticContents">
  <xsl:call-template name="insertFrontMatterFootnoteSeparator"/>
  <xsl:call-template name="insertFrontMatterOddFooter"/>
  <xsl:if test="$mirror-page-margins">
    <xsl:call-template name="insertFrontMatterEvenFooter"/>
  </xsl:if>
  <xsl:call-template name="insertFrontMatterOddHeader"/>
  <xsl:call-template name="generateBlank">
    <xsl:with-param name="base" as="element()?">
      <xsl:call-template name="insertFrontMatterOddHeader"/>
    </xsl:with-param>
  </xsl:call-template>
  <xsl:if test="$mirror-page-margins">
    <xsl:call-template name="insertFrontMatterEvenHeader"/>
    <xsl:call-template name="generateBlank">
      <xsl:with-param name="base" as="element()?">
        <xsl:call-template name="insertFrontMatterEvenHeader"/>
      </xsl:with-param>
    </xsl:call-template>
  </xsl:if>
</xsl:template>

<xsl:template name="insertBackCoverStaticContents">
  <xsl:call-template name="insertBackCoverOddFooter"/>
  <xsl:if test="$mirror-page-margins">
    <xsl:call-template name="insertBackCoverEvenFooter"/>
  </xsl:if>
  <xsl:call-template name="insertBackCoverOddHeader"/>
  <xsl:if test="$mirror-page-margins">
    <xsl:call-template name="insertBackCoverEvenHeader"/>
  </xsl:if>
</xsl:template>

<xsl:template name="insertGlossaryStaticContents">
  <xsl:call-template name="insertGlossaryOddFooter"/>
  <xsl:if test="$mirror-page-margins">
    <xsl:call-template name="insertGlossaryEvenFooter"/>
  </xsl:if>
  <xsl:call-template name="insertGlossaryOddHeader"/>
  <xsl:call-template name="generateBlank">
    <xsl:with-param name="base" as="element()?">
      <xsl:call-template name="insertGlossaryOddHeader"/>
    </xsl:with-param>
  </xsl:call-template>
  <xsl:if test="$mirror-page-margins">
    <xsl:call-template name="insertGlossaryEvenHeader"/>
    <xsl:call-template name="generateBlank">
      <xsl:with-param name="base" as="element()?">
        <xsl:call-template name="insertGlossaryEvenHeader"/>
      </xsl:with-param>
    </xsl:call-template>
  </xsl:if>
</xsl:template>

<xsl:template name="generateBlank">
  <xsl:param name="base" as="element()?"/>
  <fo:static-content flow-name="{$base/@flow-name}--blank">
    <xsl:copy-of select="$base/*"/>
    <fo:block-container xsl:use-attribute-sets="blank_page">
      <fo:block>
        <xsl:call-template name="getVariable">
          <xsl:with-param name="id" select="'blank_page'"/>
        </xsl:call-template>
      </fo:block>        
    </fo:block-container>
  </fo:static-content>
</xsl:template>
`

function generate_custom(root, options) {
  if(!!options.blank_pages) {
    utils.copy_xml(root, static_blanks_raw)
  }
}

function generate_custom_attr(root, options) {
  if(!!options.blank_pages) {
    const attr = ET.SubElement(root, xsl('attribute-set'), {name: "blank_page"})
    ET.SubElement(attr, xsl('attribute'), {name: 'position'}).text = 'absolute'
    ET.SubElement(attr, xsl('attribute'), {name: 'top'}).text = '100mm'
    ET.SubElement(attr, xsl('attribute'), {name: 'text-align'}).text = 'center'
  }
}

module.exports = {
  xsl: generate_custom,
  attr: generate_custom_attr
}
