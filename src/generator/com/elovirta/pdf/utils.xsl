<xsl:stylesheet version="3.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:xs="http://www.w3.org/2001/XMLSchema"
                xmlns:axsl="http://www.w3.org/1999/XSL/Transform/alias"
                xmlns:fo="http://www.w3.org/1999/XSL/Format"
                xmlns:map="http://www.w3.org/2005/xpath-functions/map"
                xmlns:array="http://www.w3.org/2005/xpath-functions/array"
                xmlns:x="x"
                exclude-result-prefixes="axsl map array x">

  <xsl:namespace-alias stylesheet-prefix="axsl" result-prefix="xsl"/>

  <xsl:output indent="no"/>

  <xsl:param name="version" select=". ?ot-version"/>
  <xsl:param name="formatter" select=". ?formatter"/>

  <xsl:variable name="page_mirror_margins" select="boolean(. ?page-mirror-margins)" as="xs:boolean"/>

  <xsl:function name="x:within" as="xs:string+">
    <xsl:param name="property" as="xs:string"/>
    <xsl:sequence select="(
        $property,
        concat($property, '.within-line'),
        concat($property, '.within-column'),
        concat($property, '.within-page')
      )"/>
  </xsl:function>

  <xsl:function name="x:space" as="xs:string+">
    <xsl:param name="property" as="xs:string"/>
    <xsl:sequence select="(
        $property,
        concat($property, '.minimum'),
        concat($property, '.optimum'),
        concat($property, '.maximum'),
        concat($property, '.conditionality'),
        concat($property, '.precedence')
      )"/>
  </xsl:function>

  <xsl:variable name="allProperties" select="
    'absolute-position',
    'active-state',
    'alignment-adjust',
    'alignment-baseline',
    'allowed-height-scale',
    'allowed-width-scale',
    'auto-restore',
    'azimuth',
    'background-attachment',
    'background-color',
    'background-image',
    'background-position-horizontal',
    'background-position-vertical',
    'background-repeat',
    'background-size-width',
    'background-size-height',
    'baseline-shift',
    x:space('blank-or-not-blank'),
    x:space('block-progression-dimension'),
    'border',
    'border-after-color',
    'border-after-precedence',
    'border-after-style',
    'border-after-width',
    'border-before-color',
    'border-before-precedence',
    'border-before-style',
    'border-before-width',
    'border-bottom-color',
    'border-bottom-style',
    'border-bottom-width',
    'border-collapse',
    'border-end-color',
    'border-end-precedence',
    'border-end-style',
    'border-end-width',
    'border-left-color',
    'border-left-style',
    'border-left-width',
    'border-right-color',
    'border-right-style',
    'border-right-width',
    'border-separation',
    'border-start-color',
    'border-start-precedence',
    'border-start-style',
    'border-start-width',
    'border-top-color',
    'border-top-style',
    'border-top-width',
    'bottom',
    'break-after',
    'break-before',
    'caption-side',
    'case-name',
    'case-title',
    'change-bar-class',
    'change-bar-color',
    'change-bar-offset',
    'change-bar-placement',
    'change-bar-style',
    'change-bar-width',
    'character',
    'clear',
    'clip',
    'color',
    'color-profile-name',
    'column-count',
    'column-gap',
    'column-number',
    'column-width',
    'content-height',
    'content-type',
    'content-width',
    'country',
    'cue-after',
    'cue-before',
    'destination-placement-offset',
    'direction',
    'display-align',
    'dominant-baseline',
    'elevation',
    'empty-cells',
    'end-indent',
    'ends-row',
    'extent',
    'external-destination',
    'float',
    'flow-map-name',
    'flow-map-reference',
    'flow-name',
    'flow-name-reference',
    'font',
    'font-family',
    'font-selection-strategy',
    'font-size',
    'font-size-adjust',
    'font-stretch',
    'font-style',
    'font-variant',
    'font-weight',
    'force-page-count',
    'format',
    'glyph-orientation-horizontal',
    'glyph-orientation-vertical',
    'grouping-separator',
    'grouping-size',
    'height',
    'hyphenate',
    'hyphenation-character',
    'hyphenation-keep',
    'hyphenation-ladder-count',
    'hyphenation-push-character-count',
    'hyphenation-remain-character-count',
    'id',
    'index-class',
    'index-key',
    'indicate-destination',
    'initial-page-number',
    'inline-progression-dimension',
    'internal-destination',
    'intrinsic-scale-value',
    'intrusion-displace',
    x:within('keep-together'),
    x:within('keep-with-next'),
    x:within('keep-with-previous'),
    'language',
    'last-line-end-indent',
    'leader-alignment',
    x:space('leader-length'),
    'leader-pattern',
    'leader-pattern-width',
    'left',
    'letter-spacing',
    'letter-value',
    'linefeed-treatment',
    'line-height',
    'line-height-shift-adjustment',
    'line-stacking-strategy',
    'margin-bottom',
    'margin-left',
    'margin-right',
    'margin-top',
    'marker-class-name',
    'master-name',
    'master-reference',
    'maximum-repeats',
    'media-usage',
    'merge-pages-across-index-key-references',
    'merge-ranges-across-index-key-references',
    'merge-sequential-page-numbers',
    'number-columns-repeated',
    'number-columns-spanned',
    'number-rows-spanned',
    'odd-or-even',
    'orphans',
    'overflow',
    'padding-after',
    'padding-before',
    'padding-bottom',
    'padding-end',
    'padding-left',
    'padding-right',
    'padding-start',
    'padding-top',
    'page-citation-strategy',
    'page-height',
    'page-number-treatment',
    'page-position',
    'page-width',
    'pause-after',
    'pause-before',
    'pitch',
    'pitch-range',
    'play-during',
    'precedence',
    'provisional-distance-between-starts',
    'provisional-label-separation',
    'reference-orientation',
    'ref-id',
    'ref-index-key',
    'region-name',
    'region-name-reference',
    'relative-align',
    'relative-position',
    'rendering-intent',
    'retrieve-boundary',
    'retrieve-boundary-within-table',
    'retrieve-class-name',
    'retrieve-position',
    'retrieve-position-within-table',
    'richness',
    'right',
    'role',
    'rule-style',
    'rule-thickness',
    'scale-option',
    'scaling',
    'scaling-method',
    'score-spaces',
    'script',
    'show-destination',
    'source-document',
    x:space('space-after'),
    x:space('space-before'),
    x:space('space-end'),
    x:space('space-start'),
    'span',
    'speak',
    'speak-header',
    'speak-numeral',
    'speak-punctuation',
    'speech-rate',
    'src',
    'start-indent',
    'starting-state',
    'starts-row',
    'stress',
    'suppress-at-line-break',
    'switch-to',
    'table-layout',
    'table-omit-footer-at-break',
    'table-omit-header-at-break',
    'target-presentation-context',
    'target-processing-context',
    'target-stylesheet',
    'text-align',
    'text-align-last',
    'text-altitude',
    'text-decoration',
    'text-depth',
    'text-indent',
    'text-shadow',
    'text-transform',
    'top',
    'treat-as-word-space',
    'unicode-bidi',
    'visibility',
    'voice-family',
    'volume',
    'white-space',
    'white-space-collapse',
    'white-space-treatment',
    'widows',
    'width',
    'word-spacing',
    'wrap-option',
    'writing-mode',
    'z-index'
  "/>
  
  <xsl:variable name="root" select="."/>

  <xsl:template name="generate-attribute-set">
    <xsl:param name="prefix" as="xs:string"/>
    <xsl:param name="properties" select="$allProperties"/>
    <xsl:for-each select="$properties">
      <xsl:variable name="property" select="." as="xs:string"/>
      <xsl:variable name="key" select="concat($prefix, '-', $property)" as="item()*"/>
      <xsl:if test="map:contains($root, $key)">
        <xsl:choose>
          <xsl:when test="$formatter eq 'ah' and $property eq 'background-size-width'">
            <axsl:attribute name="axf:background-size">
              <xsl:value-of select="$root($key)"/>
              <xsl:text> </xsl:text>
              <xsl:value-of select="$root($prefix || '-background-size-height')"/>
            </axsl:attribute>
          </xsl:when>
          <xsl:when test="$formatter eq 'fop' and $property eq 'background-size-width'">
            <axsl:attribute name="fox:background-image-width">
              <xsl:value-of select="$root($key)"/>
            </axsl:attribute>
          </xsl:when>
          <xsl:when test="$formatter eq 'fop' and $property eq 'background-size-height'">
            <axsl:attribute name="fox:background-image-height">
              <xsl:value-of select="$root($key)"/>
            </axsl:attribute>
          </xsl:when>
          <xsl:when test="$formatter eq 'xep' and $property eq 'background-size-width'">
            <axsl:attribute name="rx:background-content-width">
              <xsl:value-of select="$root($key)"/>
            </axsl:attribute>
          </xsl:when>
          <xsl:when test="$formatter eq 'xep' and $property eq 'background-size-height'">
            <axsl:attribute name="rx:background-content-height">
              <xsl:value-of select="$root($key)"/>
            </axsl:attribute>
          </xsl:when>
          <xsl:otherwise>
            <axsl:attribute name="{$property}">
              <xsl:value-of select="$root($key)"/>
            </axsl:attribute>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:if>
    </xsl:for-each>
  </xsl:template>

  <xsl:template name="attribute-set">
    <xsl:param name="style" as="map(*)?"/>
    <xsl:param name="properties" select="$allProperties"/>
    <xsl:if test="exists($style)">
      <xsl:for-each select="$properties[exists($style(.))]">
        <axsl:attribute name="{.}">
          <xsl:value-of select="$style(.)"/>
        </axsl:attribute>
      </xsl:for-each>
    </xsl:if>
  </xsl:template>

  <xsl:template name="generate-namespace-node">
    <xsl:variable name="dummy" as="element()">
      <xsl:variable name="ns">
        <xsl:choose>
          <xsl:when test="exists($root ?plugin-name[normalize-space()])">
            <xsl:value-of select="$root ?plugin-name"/>
          </xsl:when>
          <xsl:when test="exists($root ?id[normalize-space()])">
            <xsl:value-of select="$root ?id"/>
          </xsl:when>
          <xsl:otherwise>com.elovirta.pdf.generated</xsl:otherwise>
        </xsl:choose>
      </xsl:variable>
      <dummy>
        <xsl:attribute name="xs:dummy" namespace="http://www.w3.org/2001/XMLSchema"/>
        <xsl:attribute name="e:dummy" namespace="{$ns}"/>
        <xsl:attribute name="dita-ot:dummy" namespace="http://dita-ot.sourceforge.net/ns/201007/dita-ot"/>
        <xsl:attribute name="ditaarch:dummy" namespace="http://dita.oasis-open.org/architecture/2005/"/>
        <xsl:attribute name="opentopic:dummy" namespace="http://www.idiominc.com/opentopic"/>
        <xsl:attribute name="opentopic-func:dummy" namespace="http://www.idiominc.com/opentopic/exsl/function"/>
        <xsl:attribute name="fox:dummy" namespace="http://xmlgraphics.apache.org/fop/extensions"/>
        <xsl:attribute name="rx:dummy" namespace="http://www.renderx.com/XSL/Extensions"/>
        <xsl:attribute name="axf:dummy" namespace="http://www.antennahouse.com/names/XSL/Extensions"/>
      </dummy>
    </xsl:variable>
    <xsl:variable name="namespaces" select="
      $dummy/namespace::xs,
      $dummy/namespace::e,
      $dummy/namespace::dita-ot,
      $dummy/namespace::ditaarch,
      $dummy/namespace::opentopic,
      $dummy/namespace::opentopic-func,
      $dummy/namespace::fox[$formatter eq 'fop'],
      $dummy/namespace::rx[$formatter eq 'xep'],
      $dummy/namespace::axf[$formatter eq 'ah']
    "/>
    <xsl:copy-of select="$namespaces"/>
    <xsl:attribute name="exclude-result-prefixes">xs e dita-ot ditaarch opentopic opentopic-func</xsl:attribute>
  </xsl:template>

  <xsl:template name="insert-content">
    <xsl:param name="id" as="xs:string"/>

    <axsl:call-template name="getVariable">
      <axsl:with-param name="id" select="'{$id}'" as="xs:string"/>
      <axsl:with-param name="params">
        <!-- TODO: only generate those params that are needed -->
        <title>
          <axsl:apply-templates select="$root" mode="dita-ot:title-metadata"/>
        </title>
        <chapter>
          <fo:retrieve-marker retrieve-class-name="current-header"/>
        </chapter>
        <chapter-title>
          <fo:retrieve-marker retrieve-class-name="current-chapter-title"/>
        </chapter-title>
        <chapter-number>
          <fo:retrieve-marker retrieve-class-name="current-topic-number"/>
        </chapter-number>
        <part-number>
          <fo:retrieve-marker retrieve-class-name="current-part-number"/>
        </part-number>
        <part-title>
          <fo:retrieve-marker retrieve-class-name="current-part-title"/>
        </part-title>
        <appendix-number>
          <fo:retrieve-marker retrieve-class-name="current-appendix-number"/>
        </appendix-number>
        <appendix-title>
          <fo:retrieve-marker retrieve-class-name="current-appendix-title"/>
        </appendix-title>
        <page-number>
          <fo:page-number/>
        </page-number>
        <page-count>
          <fo:page-number-citation-last ref-id="{{$e:root-id}}"/>
        </page-count>
        <year>
          <axsl:value-of select="format-date(current-date(), '[Y0001]')"/>
        </year>
        <folio>
          <fo:page-number/>
        </folio>
        <folio-with-total>
          <!-- FIXME -->
          <fo:page-number/>
          <xsl:text> (</xsl:text>
          <fo:page-number-citation-last ref-id="{{$e:root-id}}"/>
          <xsl:text>)</xsl:text>
        </folio-with-total>
        <!--
        <heading>
          <fo:inline>
            <xsl:attribute name="xsl:use-attribute-sets">__body__odd__footer__heading</xsl:attribute>
            <fo:retrieve-marker retrieve-class-name="current-header"/>
          </fo:inline>
        </heading>
        <pagenum>
          <fo:inline>
            <xsl:attribute name="xsl:use-attribute-sets">__body__odd__footer__pagenum</xsl:attribute>
            <fo:page-number/>
          </fo:inline>
        </pagenum>
        -->
      </axsl:with-param>
    </axsl:call-template>
  </xsl:template>

</xsl:stylesheet>