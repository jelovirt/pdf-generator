'use strict';

import ET from './elementtree';
import { xsl, copy_xml } from './utils';

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
  
<!-- Body -->

<!--
<xsl:template name="insertBodyOddHeader">
  <xsl:param name="flow-name" as="xs:string" select="'odd-body-header'"/>
  <fo:static-content flow-name="{$flow-name}">
    <fo:block xsl:use-attribute-sets="__body__odd__header">
      <xsl:call-template name="getVariable">
        <xsl:with-param name="id" select="'Body odd header'"/>
        <xsl:with-param name="params">
          <prodname>
            <xsl:value-of select="$productName"/>
          </prodname>
          <heading>
            <fo:inline xsl:use-attribute-sets="__body__odd__header__heading">
              <fo:retrieve-marker retrieve-class-name="current-header"/>
            </fo:inline>
          </heading>
          <pagenum>
            <fo:inline xsl:use-attribute-sets="__body__odd__header__pagenum">
              <fo:page-number/>
            </fo:inline>
          </pagenum>
        </xsl:with-param>
      </xsl:call-template>
    </fo:block>
  </fo:static-content>
</xsl:template>

<xsl:template name="insertBodyEvenHeader">
  <xsl:param name="flow-name" as="xs:string" select="'even-body-header'"/>
  <fo:static-content flow-name="{$flow-name}">
    <fo:block xsl:use-attribute-sets="__body__even__header">
      <xsl:call-template name="getVariable">
        <xsl:with-param name="id" select="'Body even header'"/>
        <xsl:with-param name="params">
          <prodname>
            <xsl:value-of select="$productName"/>
          </prodname>
          <heading>
            <fo:inline xsl:use-attribute-sets="__body__even__header__heading">
              <fo:retrieve-marker retrieve-class-name="current-header"/>
            </fo:inline>
          </heading>
          <pagenum>
            <fo:inline xsl:use-attribute-sets="__body__even__header__pagenum">
              <fo:page-number/>
            </fo:inline>
          </pagenum>
        </xsl:with-param>
      </xsl:call-template>
    </fo:block>
  </fo:static-content>
</xsl:template>
-->
<xsl:template name="insertBodyFirstHeader">
  <xsl:call-template name="insertBodyOddHeader">
    <xsl:with-param name="flow-name" select="'first-body-header'"/>
  </xsl:call-template>
</xsl:template>

<xsl:template name="insertBodyLastHeader">
  <xsl:call-template name="insertBodyOddHeader">
    <xsl:with-param name="flow-name" select="'last-body-header'"/>
  </xsl:call-template>
</xsl:template>

<!--
<xsl:template name="insertBodyOddFooter">
  <xsl:param name="flow-name" as="xs:string" select="'odd-body-footer'"/>
  <fo:static-content flow-name="{$flow-name}">
    <fo:block xsl:use-attribute-sets="__body__odd__footer">
      <xsl:call-template name="getVariable">
        <xsl:with-param name="id" select="'Body odd footer'"/>
        <xsl:with-param name="params">
          <heading>
            <fo:inline xsl:use-attribute-sets="__body__odd__footer__heading">
              <fo:retrieve-marker retrieve-class-name="current-header"/>
            </fo:inline>
          </heading>
          <pagenum>
            <fo:inline xsl:use-attribute-sets="__body__odd__footer__pagenum">
              <fo:page-number/>
            </fo:inline>
          </pagenum>
        </xsl:with-param>
      </xsl:call-template>
    </fo:block>
  </fo:static-content>
</xsl:template>

<xsl:template name="insertBodyEvenFooter">
  <xsl:param name="flow-name" as="xs:string" select="'odd-body-footer'"/>
  <fo:static-content flow-name="{$flow-name}">
    <fo:block xsl:use-attribute-sets="__body__even__footer">
      <xsl:call-template name="getVariable">
        <xsl:with-param name="id" select="'Body even footer'"/>
        <xsl:with-param name="params">
          <heading>
            <fo:inline xsl:use-attribute-sets="__body__even__footer__heading">
              <fo:retrieve-marker retrieve-class-name="current-header"/>
            </fo:inline>
          </heading>
          <pagenum>
            <fo:inline xsl:use-attribute-sets="__body__even__footer__pagenum">
              <fo:page-number/>
            </fo:inline>
          </pagenum>
        </xsl:with-param>
      </xsl:call-template>
    </fo:block>
  </fo:static-content>
</xsl:template>
-->

<xsl:template name="insertBodyFirstFooter">
  <xsl:call-template name="insertBodyOddFooter">
    <xsl:with-param name="flow-name" select="'first-body-footer'"/>
  </xsl:call-template>
</xsl:template>

<xsl:template name="insertBodyLastFooter">
  <xsl:call-template name="insertBodyEvenFooter">
    <xsl:with-param name="flow-name" select="'last-body-footer'"/>
  </xsl:call-template>
</xsl:template>

<xsl:template name="insertBodyFootnoteSeparator">
  <fo:static-content flow-name="xsl-footnote-separator">
    <fo:block>
      <fo:leader xsl:use-attribute-sets="__body__footnote__separator"/>
    </fo:block>
  </fo:static-content>
</xsl:template>

<!-- TOC -->

<xsl:template name="insertTocOddHeader">
  <xsl:call-template name="insertBodyOddHeader">
    <xsl:with-param name="flow-name" select="'odd-toc-header'"/>
  </xsl:call-template>
</xsl:template>

<xsl:template name="insertTocEvenHeader">
  <xsl:call-template name="insertBodyOddHeader">
    <xsl:with-param name="flow-name" select="'even-toc-header'"/>
  </xsl:call-template>
</xsl:template>

<xsl:template name="insertTocOddFooter">
  <xsl:call-template name="insertBodyOddFooter">
    <xsl:with-param name="flow-name" select="'odd-toc-footer'"/>
  </xsl:call-template>
</xsl:template>

<xsl:template name="insertTocEvenFooter">
  <xsl:call-template name="insertBodyOddFooter">
    <xsl:with-param name="flow-name" select="'even-toc-footer'"/>
  </xsl:call-template>
</xsl:template>

<!-- Index -->

<xsl:template name="insertIndexOddHeader">
  <xsl:call-template name="insertBodyOddHeader">
    <xsl:with-param name="flow-name" select="'odd-index-header'"/>
  </xsl:call-template>
</xsl:template>

<xsl:template name="insertIndexEvenHeader">
  <xsl:call-template name="insertBodyOddHeader">
    <xsl:with-param name="flow-name" select="'even-index-header'"/>
  </xsl:call-template>
</xsl:template>

<xsl:template name="insertIndexOddFooter">
  <xsl:call-template name="insertBodyOddFooter">
    <xsl:with-param name="flow-name" select="'odd-index-footer'"/>
  </xsl:call-template>
</xsl:template>

<xsl:template name="insertIndexEvenFooter">
  <xsl:call-template name="insertBodyOddFooter">
    <xsl:with-param name="flow-name" select="'even-index-footer'"/>
  </xsl:call-template>
</xsl:template>

<!-- Preface -->

<xsl:template name="insertPrefaceOddHeader">
  <xsl:call-template name="insertBodyOddHeader">
    <xsl:with-param name="flow-name" select="'odd-preface-header'"/>
  </xsl:call-template>
</xsl:template>

<xsl:template name="insertPrefaceEvenHeader">
  <xsl:call-template name="insertBodyOddHeader">
    <xsl:with-param name="flow-name" select="'even-preface-header'"/>
  </xsl:call-template>
</xsl:template>

<xsl:template name="insertPrefaceOddFooter">
  <xsl:call-template name="insertBodyOddFooter">
    <xsl:with-param name="flow-name" select="'odd-preface-footer'"/>
  </xsl:call-template>
</xsl:template>

<xsl:template name="insertPrefaceEvenFooter">
  <xsl:call-template name="insertBodyOddFooter">
    <xsl:with-param name="flow-name" select="'even-preface-footer'"/>
  </xsl:call-template>
</xsl:template>

<!-- Frontmatter -->

<xsl:template name="insertFrontMatterOddHeader">
  <xsl:call-template name="insertBodyOddHeader">
    <xsl:with-param name="flow-name" select="'odd-frontmatter-header'"/>
  </xsl:call-template>
</xsl:template>

<xsl:template name="insertFrontMatterEvenHeader">
  <xsl:call-template name="insertBodyOddHeader">
    <xsl:with-param name="flow-name" select="'even-frontmatter-header'"/>
  </xsl:call-template>
</xsl:template>

<xsl:template name="insertFrontMatterOddFooter">
  <xsl:call-template name="insertBodyOddFooter">
    <xsl:with-param name="flow-name" select="'odd-frontmatter-footer'"/>
  </xsl:call-template>
</xsl:template>

<xsl:template name="insertFrontMatterEvenFooter">
  <xsl:call-template name="insertBodyOddFooter">
    <xsl:with-param name="flow-name" select="'even-frontmatter-footer'"/>
  </xsl:call-template>
</xsl:template>

<!-- Backcover -->

<xsl:template name="insertBackCoverOddHeader">
  <xsl:call-template name="insertBodyOddHeader">
    <xsl:with-param name="flow-name" select="'odd-back-cover-header'"/>
  </xsl:call-template>
</xsl:template>

<xsl:template name="insertBackCoverEvenHeader">
  <xsl:call-template name="insertBodyOddHeader">
    <xsl:with-param name="flow-name" select="'even-back-cover-header'"/>
  </xsl:call-template>
</xsl:template>

<xsl:template name="insertBackCoverOddFooter">
  <xsl:call-template name="insertBodyOddFooter">
    <xsl:with-param name="flow-name" select="'odd-back-cover-footer'"/>
  </xsl:call-template>
</xsl:template>

<xsl:template name="insertBackCoverEvenFooter">
  <xsl:call-template name="insertBodyOddFooter">
    <xsl:with-param name="flow-name" select="'even-back-cover-footer'"/>
  </xsl:call-template>
</xsl:template>

<!-- Glossary -->

<xsl:template name="insertGlossaryOddHeader">
  <xsl:call-template name="insertBodyOddHeader">
    <xsl:with-param name="flow-name" select="'odd-glossary-header'"/>
  </xsl:call-template>
</xsl:template>

<xsl:template name="insertGlossaryEvenHeader">
  <xsl:call-template name="insertBodyOddHeader">
    <xsl:with-param name="flow-name" select="'even-glossary-header'"/>
  </xsl:call-template>
</xsl:template>

<xsl:template name="insertGlossaryOddFooter">
  <xsl:call-template name="insertBodyOddFooter">
    <xsl:with-param name="flow-name" select="'odd-glossary-footer'"/>
  </xsl:call-template>
</xsl:template>

<xsl:template name="insertGlossaryEvenFooter">
  <xsl:call-template name="insertBodyOddFooter">
    <xsl:with-param name="flow-name" select="'even-glossary-footer'"/>
  </xsl:call-template>
</xsl:template>
`;

export function generate_custom(root, conf) {
  if (!!conf.options.blank_pages) {
    copy_xml(root, static_blanks_raw);
  }
  generateInsert(root, conf.header.odd, 'header', 'odd');
  generateInsert(root, conf.header.even, 'header', 'even');
  generateInsert(root, conf.footer.odd, 'footer', 'odd');
  generateInsert(root, conf.footer.even, 'footer', 'even');
}

function generateInsert(root, header, flow, type) {
  const flowCase = flow.substring(0, 1).toUpperCase() + flow.substring(1);
  const typeCase = type.substring(0, 1).toUpperCase() + type.substring(1);
  ET.Comment(root, `${flow} ${type}`);
  const template = ET.SubElement(root, xsl('template'), {
    name: `insertBody${typeCase}${flowCase}`,
  });
  ET.SubElement(template, xsl('param'), {
    name: 'flow-name',
    as: 'xs:string',
    select: `'${type}-body-${flow}'`,
  });
  const staticContent = ET.SubElement(template, 'fo:static-content', {
    'flow-name': '{$flow-name}',
  });
  const block = ET.SubElement(staticContent, 'fo:block', {
    'xsl:use-attribute-sets': `__body__${type}__${flow}`,
  });
  header.forEach((field) => {
    switch (field) {
      case 'copyright':
        break;
      case 'title':
        ET.SubElement(block, xsl('apply-templates'), {
          select: '/',
          mode: 'dita-ot:title-metadata',
        });
        break;
      case 'chapter':
        ET.SubElement(block, 'fo:retrieve-marker', {
          'retrieve-class-name': 'current-header',
        });
        break;
      case 'folio':
        ET.SubElement(block, 'fo:page-number');
        break;
      case 'folio-with-total':
        // FIXME
        ET.SubElement(block, 'fo:page-number');
        ET.SubElement(block, xsl('text')).text = ' (';
        ET.SubElement(block, 'fo:page-number-citation-last', {
          'ref-id': '{$e:root-id}',
        });
        ET.SubElement(block, xsl('text')).text = ')';
        break;
    }
  });
}

export function generate_custom_attr(root, conf) {
  if (!!conf.options.blank_pages) {
    const attr = ET.SubElement(root, xsl('attribute-set'), {
      name: 'blank_page',
    });
    ET.SubElement(attr, xsl('attribute'), { name: 'position' }).text =
      'absolute';
    ET.SubElement(attr, xsl('attribute'), { name: 'top' }).text = '100mm';
    ET.SubElement(attr, xsl('attribute'), { name: 'text-align' }).text =
      'center';
  }
}
