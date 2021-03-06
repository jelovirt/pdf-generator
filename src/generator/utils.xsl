<xsl:stylesheet version="3.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:axsl="http://www.w3.org/1999/XSL/Transform/alias"
                xmlns:fo="http://www.w3.org/1999/XSL/Format"
                xmlns:map="http://www.w3.org/2005/xpath-functions/map"
                xmlns:array="http://www.w3.org/2005/xpath-functions/array"
                exclude-result-prefixes="axsl map array">

  <xsl:namespace-alias stylesheet-prefix="axsl" result-prefix="xsl"/>

  <xsl:output indent="yes"/>

  <xsl:param name="version" select=". ?ot_version"/>
  <xsl:param name="formatter" select=". ?formatter"/>

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
    'baseline-shift',
    'blank-or-not-blank',
    'block-progression-dimension',
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
    'keep-together',
    'keep-with-next',
    'keep-with-previous',
    'language',
    'last-line-end-indent',
    'leader-alignment',
    'leader-length',
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
    'space-after',
    'space-before',
    'space-end',
    'space-start',
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
    'white-space-collapse',
    'white-space-treatment',
    'widows',
    'width',
    'word-spacing',
    'wrap-option',
    'writing-mode',
    'z-index'
  "/>
  
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
          <xsl:when test="exists(. ?plugin_name[normalize-space()])">
            <xsl:value-of select=". ?plugin_name"/>
          </xsl:when>
          <xsl:when test="exists(. ?id[normalize-space()])">
            <xsl:value-of select=". ?id"/>
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
      </dummy>
    </xsl:variable>
    <xsl:variable name="namespaces" select="
      $dummy/namespace::xs,
      $dummy/namespace::e,
      $dummy/namespace::dita-ot,
      $dummy/namespace::ditaarch,
      $dummy/namespace::opentopic,
      $dummy/namespace::opentopic-func
    "/>
    <xsl:copy-of select="$namespaces"/>
    <xsl:attribute name="exclude-result-prefixes">xs e dita-ot ditaarch opentopic opentopic-func</xsl:attribute>
  </xsl:template>

</xsl:stylesheet>