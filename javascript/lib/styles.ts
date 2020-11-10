import _ from 'lodash';

export type Property =
  | 'absolute-position'
  | 'active-state'
  | 'alignment-adjust'
  | 'alignment-baseline'
  | 'allowed-height-scale'
  | 'allowed-width-scale'
  | 'auto-restore'
  | 'azimuth'
  | 'background-attachment'
  | 'background-color'
  | 'background-image'
  | 'background-position-horizontal'
  | 'background-position-vertical'
  | 'background-repeat'
  | 'baseline-shift'
  | 'blank-or-not-blank'
  | 'block-progression-dimension'
  | 'border-after-color'
  | 'border-after-precedence'
  | 'border-after-style'
  | 'border-after-width'
  | 'border-before-color'
  | 'border-before-precedence'
  | 'border-before-style'
  | 'border-before-width'
  | 'border-bottom-color'
  | 'border-bottom-style'
  | 'border-bottom-width'
  | 'border-collapse'
  | 'border-end-color'
  | 'border-end-precedence'
  | 'border-end-style'
  | 'border-end-width'
  | 'border-left-color'
  | 'border-left-style'
  | 'border-left-width'
  | 'border-right-color'
  | 'border-right-style'
  | 'border-right-width'
  | 'border-separation'
  | 'border-start-color'
  | 'border-start-precedence'
  | 'border-start-style'
  | 'border-start-width'
  | 'border-top-color'
  | 'border-top-style'
  | 'border-top-width'
  | 'bottom'
  | 'break-after'
  | 'break-before'
  | 'caption-side'
  | 'case-name'
  | 'case-title'
  | 'change-bar-class'
  | 'change-bar-color'
  | 'change-bar-offset'
  | 'change-bar-placement'
  | 'change-bar-style'
  | 'change-bar-width'
  | 'character'
  | 'clear'
  | 'clip'
  | 'color'
  | 'color-profile-name'
  | 'column-count'
  | 'column-gap'
  | 'column-number'
  | 'column-width'
  | 'content-height'
  | 'content-type'
  | 'content-width'
  | 'country'
  | 'cue-after'
  | 'cue-before'
  | 'destination-placement-offset'
  | 'direction'
  | 'display-align'
  | 'dominant-baseline'
  | 'elevation'
  | 'empty-cells'
  | 'end-indent'
  | 'ends-row'
  | 'extent'
  | 'external-destination'
  | 'float'
  | 'flow-map-name'
  | 'flow-map-reference'
  | 'flow-name'
  | 'flow-name-reference'
  | 'font-family'
  | 'font-selection-strategy'
  | 'font-size'
  | 'font-size-adjust'
  | 'font-stretch'
  | 'font-style'
  | 'font-variant'
  | 'font-weight'
  | 'force-page-count'
  | 'format'
  | 'glyph-orientation-horizontal'
  | 'glyph-orientation-vertical'
  | 'grouping-separator'
  | 'grouping-size'
  | 'height'
  | 'hyphenate'
  | 'hyphenation-character'
  | 'hyphenation-keep'
  | 'hyphenation-ladder-count'
  | 'hyphenation-push-character-count'
  | 'hyphenation-remain-character-count'
  | 'id'
  | 'index-class'
  | 'index-key'
  | 'indicate-destination'
  | 'initial-page-number'
  | 'inline-progression-dimension'
  | 'internal-destination'
  | 'intrinsic-scale-value'
  | 'intrusion-displace'
  | 'keep-together'
  | 'keep-with-next'
  | 'keep-with-previous'
  | 'language'
  | 'last-line-end-indent'
  | 'leader-alignment'
  | 'leader-length'
  | 'leader-pattern'
  | 'leader-pattern-width'
  | 'left'
  | 'letter-spacing'
  | 'letter-value'
  | 'linefeed-treatment'
  | 'line-height'
  | 'line-height-shift-adjustment'
  | 'line-stacking-strategy'
  | 'margin-bottom'
  | 'margin-left'
  | 'margin-right'
  | 'margin-top'
  | 'marker-class-name'
  | 'master-name'
  | 'master-reference'
  | 'maximum-repeats'
  | 'media-usage'
  | 'merge-pages-across-index-key-references'
  | 'merge-ranges-across-index-key-references'
  | 'merge-sequential-page-numbers'
  | 'number-columns-repeated'
  | 'number-columns-spanned'
  | 'number-rows-spanned'
  | 'odd-or-even'
  | 'orphans'
  | 'overflow'
  | 'padding-after'
  | 'padding-before'
  | 'padding-bottom'
  | 'padding-end'
  | 'padding-left'
  | 'padding-right'
  | 'padding-start'
  | 'padding-top'
  | 'page-citation-strategy'
  | 'page-height'
  | 'page-number-treatment'
  | 'page-position'
  | 'page-width'
  | 'pause-after'
  | 'pause-before'
  | 'pitch'
  | 'pitch-range'
  | 'play-during'
  | 'precedence'
  | 'provisional-distance-between-starts'
  | 'provisional-label-separation'
  | 'reference-orientation'
  | 'ref-id'
  | 'ref-index-key'
  | 'region-name'
  | 'region-name-reference'
  | 'relative-align'
  | 'relative-position'
  | 'rendering-intent'
  | 'retrieve-boundary'
  | 'retrieve-boundary-within-table'
  | 'retrieve-class-name'
  | 'retrieve-position'
  | 'retrieve-position-within-table'
  | 'richness'
  | 'right'
  | 'role'
  | 'rule-style'
  | 'rule-thickness'
  | 'scale-option'
  | 'scaling'
  | 'scaling-method'
  | 'score-spaces'
  | 'script'
  | 'show-destination'
  | 'source-document'
  | 'space-after'
  | 'space-before'
  | 'space-end'
  | 'space-start'
  | 'span'
  | 'speak'
  | 'speak-header'
  | 'speak-numeral'
  | 'speak-punctuation'
  | 'speech-rate'
  | 'src'
  | 'start-indent'
  | 'starting-state'
  | 'starts-row'
  | 'stress'
  | 'suppress-at-line-break'
  | 'switch-to'
  | 'table-layout'
  | 'table-omit-footer-at-break'
  | 'table-omit-header-at-break'
  | 'target-presentation-context'
  | 'target-processing-context'
  | 'target-stylesheet'
  | 'text-align'
  | 'text-align-last'
  | 'text-altitude'
  | 'text-decoration'
  | 'text-depth'
  | 'text-indent'
  | 'text-shadow'
  | 'text-transform'
  | 'top'
  | 'treat-as-word-space'
  | 'unicode-bidi'
  | 'visibility'
  | 'voice-family'
  | 'volume'
  | 'white-space-collapse'
  | 'white-space-treatment'
  | 'widows'
  | 'width'
  | 'word-spacing'
  | 'wrap-option'
  | 'writing-mode'
  | 'z-index'
  // custom
  | 'symbol-scope'
  | 'link-page-number'
  | 'link-url'
  | 'title-numbering'
  | 'icon';

export type Style = {
  default: string | boolean | undefined;
  inherit: StyleName | undefined;
};

export const styles = getStyles();

export type StyleName =
  | 'body'
  | 'topic'
  | 'topic_topic'
  | 'topic_topic_topic'
  | 'topic_topic_topic_topic'
  | 'section'
  | 'pre'
  | 'example'
  | 'note'
  | 'example_title'
  | 'codeblock'
  | 'dl'
  | 'ol'
  | 'ul'
  | 'table'
  | 'fig'
  | 'toc_1'
  | 'toc_2'
  | 'toc_3'
  | 'toc_4'
  | 'link'
  | 'tm';

function getStyles(): Record<StyleName, Partial<Record<Property, Style>>> {
  const startIndent = 25;
    const base: Partial<Record<Property, Style>> = {
    'background-color': {default: 'transparent', inherit: undefined},
    'padding-top': { default: '0pt', inherit: undefined },
    'padding-right': { default: '0pt', inherit: undefined },
    'padding-bottom': { default: '0pt', inherit: undefined },
    'padding-left': { default: '0pt', inherit: undefined },
    'end-indent': { default: '0pt', inherit: undefined },
    'border-before-style': { default: undefined, inherit: undefined },
    'border-before-width': { default: undefined, inherit: undefined },
    'border-before-color': { default: undefined, inherit: undefined },
    'border-end-style': { default: undefined, inherit: undefined },
    'border-end-width': { default: undefined, inherit: undefined },
    'border-end-color': { default: undefined, inherit: undefined },
    'border-after-style': { default: undefined, inherit: undefined },
    'border-after-width': { default: undefined, inherit: undefined },
    'border-after-color': { default: undefined, inherit: undefined },
    'border-start-style': { default: undefined, inherit: undefined },
    'border-start-width': { default: undefined, inherit: undefined },
    'border-start-color': { default: undefined, inherit: undefined },
  };
  return {
    // block
    body: _.defaultsDeep(
      {
        'font-family': { default: 'Times New Roman', inherit: undefined },
        'font-size': { default: '10pt', inherit: undefined },
        color: { default: 'black', inherit: undefined },
        'font-weight': { default: 'normal', inherit: undefined },
        'font-style': { default: 'normal', inherit: undefined },
        'text-decoration': { default: 'none', inherit: undefined },
        'space-before': { default: '6pt', inherit: undefined },
        'space-after': { default: '6pt', inherit: undefined },
        'text-align': { default: 'start', inherit: undefined },
        'start-indent': { default: startIndent + 'pt', inherit: undefined },
        'line-height': { default: '1.2', inherit: undefined },
      },
      base
    ),
    topic: _.defaultsDeep(
      {
        'font-family': { default: 'Helvetica', inherit: undefined },
        'font-size': { default: '18pt', inherit: undefined },
        color: { default: 'black', inherit: 'body' },
        'font-weight': { default: 'bold', inherit: undefined },
        'font-style': { default: 'normal', inherit: undefined },
        'text-decoration': { default: 'none', inherit: 'body' },
        'space-before': { default: '0pt', inherit: undefined },
        'space-after': { default: '16.8pt', inherit: undefined },
        'text-align': { default: 'start', inherit: undefined },
        'start-indent': { default: '0pt', inherit: undefined },
        'padding-top': { default: '0pt', inherit: undefined },
        'padding-right': { default: '0pt', inherit: undefined },
        'padding-bottom': { default: '0pt', inherit: undefined },
        'padding-left': { default: '0pt', inherit: undefined },
        'line-height': { default: undefined, inherit: 'body' },
        // custom
        'title-numbering': { default: true, inherit: undefined },
      },
      base
    ),
    topic_topic: _.defaultsDeep(
      {
        'font-family': { default: 'Helvetica', inherit: undefined },
        'font-size': { default: '14pt', inherit: undefined },
        color: { default: 'black', inherit: 'body' },
        'font-weight': { default: 'bold', inherit: undefined },
        'font-style': { default: 'normal', inherit: undefined },
        'text-decoration': { default: 'none', inherit: 'body' },
        'space-before': { default: '12pt', inherit: undefined },
        'space-after': { default: '5pt', inherit: undefined },
        'text-align': { default: 'start', inherit: undefined },
        'start-indent': { default: '0pt', inherit: undefined },
        'padding-top': { default: '0pt', inherit: undefined },
        'padding-right': { default: '0pt', inherit: undefined },
        'padding-bottom': { default: '0pt', inherit: undefined },
        'padding-left': { default: '0pt', inherit: undefined },
        'line-height': { default: undefined, inherit: 'body' },
        // custom
        'title-numbering': { default: false, inherit: undefined },
      },
      base
    ),
    topic_topic_topic: _.defaultsDeep(
      {
        'font-family': { default: 'Helvetica', inherit: undefined },
        'font-size': { default: '12pt', inherit: undefined },
        color: { default: 'black', inherit: 'body' },
        'font-weight': { default: 'bold', inherit: undefined },
        'font-style': { default: 'normal', inherit: undefined },
        'text-decoration': { default: 'none', inherit: 'body' },
        'space-before': { default: '12pt', inherit: undefined },
        'space-after': { default: '2pt', inherit: undefined },
        'text-align': { default: 'start', inherit: undefined },
        'start-indent': { default: '0pt', inherit: undefined },
        'line-height': { default: undefined, inherit: 'body' },
        // custom
        'title-numbering': { default: false, inherit: undefined },
      },
      base
    ),
    topic_topic_topic_topic: _.defaultsDeep(
      {
        'font-family': { default: 'Times New Roman', inherit: 'body' },
        'font-size': { default: '10pt', inherit: 'body' },
        color: { default: 'black', inherit: 'body' },
        'font-weight': { default: 'bold', inherit: undefined },
        'font-style': { default: 'normal', inherit: undefined },
        'text-decoration': { default: 'none', inherit: 'body' },
        'space-before': { default: '12pt', inherit: undefined },
        'space-after': { default: '0pt', inherit: undefined },
        'text-align': { default: 'start', inherit: undefined },
        'start-indent': { default: undefined, inherit: 'body' },
        'line-height': { default: undefined, inherit: 'body' },
        // custom
        'title-numbering': { default: false, inherit: undefined },
      },
      base
    ),
    section: _.defaultsDeep(
      {
        'font-family': { default: 'Helvetica', inherit: undefined },
        'font-size': { default: undefined, inherit: 'body' },
        color: { default: undefined, inherit: 'body' },
        'font-weight': { default: 'bold', inherit: undefined },
        'font-style': { default: undefined, inherit: 'body' },
        'text-decoration': { default: undefined, inherit: 'body' },
        'space-before': { default: '6pt', inherit: 'body' },
        'space-after': { default: '6pt', inherit: 'body' },
        'text-align': { default: undefined, inherit: 'body' },
        'start-indent': { default: undefined, inherit: 'body' },
        'line-height': { default: undefined, inherit: 'body' },
      },
      base
    ),
    example: _.defaultsDeep(
      {
        'font-family': { default: undefined, inherit: 'body' },
        'font-size': { default: undefined, inherit: 'body' },
        color: { default: undefined, inherit: 'body' },
        'font-weight': { default: undefined, inherit: 'body' },
        'font-style': { default: undefined, inherit: 'body' },
        'text-decoration': { default: undefined, inherit: 'body' },
        'space-before': { default: '6pt', inherit: 'body' },
        'space-after': { default: '6pt', inherit: 'body' },
        'text-align': { default: undefined, inherit: 'body' },
        // "padding-top": {default: "5pt", inherit: undefined},
        // "padding-right": {default: "5pt", inherit: undefined},
        // "padding-bottom": {default: "5pt", inherit: undefined},
        // "padding-left": {default: "5pt", inherit: undefined},
        'start-indent': { default: undefined, inherit: 'body' },
        'line-height': { default: undefined, inherit: 'body' },
        // "border-before-style": {default: "solid", inherit: undefined},
        // "border-before-width": {default: "1pt", inherit: undefined},
        // "border-before-color": {default: "black", inherit: undefined},
        // "border-end-style": {default: "solid", inherit: undefined},
        // "border-end-width": {default: "1pt", inherit: undefined},
        // "border-end-color": {default: "black", inherit: undefined},
        // "border-after-style": {default: "solid", inherit: undefined},
        // "border-after-width": {default: "1pt", inherit: undefined},
        // "border-after-color": {default: "black", inherit: undefined},
        // "border-start-style": {default: "solid", inherit: undefined},
        // "border-start-width": {default: "1pt", inherit: undefined},
        // "border-start-color": {default: "black", inherit: undefined},
      },
      base
    ),
    example_title: _.defaultsDeep(
      {
        'font-family': { default: 'Helvetica', inherit: undefined },
        'font-size': { default: undefined, inherit: 'body' },
        color: { default: undefined, inherit: 'body' },
        'font-weight': { default: 'bold', inherit: undefined },
        'font-style': { default: undefined, inherit: 'body' },
        'text-decoration': { default: undefined, inherit: 'body' },
        'space-before': { default: '15pt', inherit: undefined },
        'space-after': { default: undefined, inherit: 'body' },
        'text-align': { default: undefined, inherit: 'body' },
        'start-indent': { default: undefined, inherit: 'body' },
        'line-height': { default: undefined, inherit: 'body' },
      },
      base
    ),
    note: _.defaultsDeep(
      {
        'font-family': { default: undefined, inherit: 'body' },
        'font-size': { default: undefined, inherit: 'body' },
        color: { default: undefined, inherit: 'body' },
        'font-weight': { default: undefined, inherit: 'body' },
        'font-style': { default: undefined, inherit: 'body' },
        'text-decoration': { default: undefined, inherit: 'body' },
        'space-before': { default: undefined, inherit: 'body' },
        'space-after': { default: undefined, inherit: 'body' },
        'text-align': { default: undefined, inherit: 'body' },
        'start-indent': { default: undefined, inherit: 'body' },
        'line-height': { default: undefined, inherit: 'body' },
        // custom
        icon: { default: 'icon', inherit: undefined },
      },
      base
    ),
    pre: _.defaultsDeep(
      {
        'font-family': { default: 'Monaco', inherit: undefined },
        'font-size': { default: undefined, inherit: 'body' },
        color: { default: undefined, inherit: 'body' },
        'font-weight': { default: undefined, inherit: 'body' },
        'font-style': { default: undefined, inherit: 'body' },
        'text-decoration': { default: undefined, inherit: 'body' },
        'space-before': { default: '15pt', inherit: undefined },
        'space-after': { default: undefined, inherit: 'body' },
        'text-align': { default: undefined, inherit: 'body' },
        'start-indent': { default: undefined, inherit: 'body' },
        'line-height': { default: undefined, inherit: 'body' },
      },
      base
    ),
    codeblock: _.defaultsDeep(
      {
        'font-family': { default: 'Monaco', inherit: undefined },
        'font-size': { default: undefined, inherit: 'body' },
        color: { default: undefined, inherit: 'body' },
        'font-weight': { default: undefined, inherit: 'body' },
        'font-style': { default: undefined, inherit: 'body' },
        'text-decoration': { default: undefined, inherit: 'body' },
        'space-before': { default: '15pt', inherit: undefined },
        'space-after': { default: undefined, inherit: 'body' },
        'text-align': { default: undefined, inherit: 'body' },
        'start-indent': { default: '31pt', inherit: 'body' }, //+6pt
        'line-height': { default: undefined, inherit: 'body' },
        // custom
        'line-numbering': { default: false, inherit: undefined },
      },
      base
    ),
    dl: _.defaultsDeep(
      {
        'font-family': { default: undefined, inherit: 'body' },
        'font-size': { default: undefined, inherit: 'body' },
        color: { default: undefined, inherit: 'body' },
        'font-weight': { default: undefined, inherit: 'body' },
        'font-style': { default: undefined, inherit: 'body' },
        'text-decoration': { default: undefined, inherit: 'body' },
        'space-before': { default: undefined, inherit: 'body' },
        'space-after': { default: undefined, inherit: 'body' },
        'text-align': { default: undefined, inherit: 'body' },
        'start-indent': { default: undefined, inherit: 'body' },
        'line-height': { default: undefined, inherit: 'body' },
        // custom
        'dl-type': { default: 'table', inherit: undefined },
      },
      base
    ),
    ol: _.defaultsDeep(
      {
        'font-family': { default: undefined, inherit: 'body' },
        'font-size': { default: undefined, inherit: 'body' },
        color: { default: undefined, inherit: 'body' },
        'font-weight': { default: undefined, inherit: 'body' },
        'font-style': { default: undefined, inherit: 'body' },
        'text-decoration': { default: undefined, inherit: 'body' },
        'space-before': { default: undefined, inherit: 'body' },
        'space-after': { default: undefined, inherit: 'body' },
        'text-align': { default: undefined, inherit: 'body' },
        'start-indent': { default: undefined, inherit: 'body' },
        'line-height': { default: undefined, inherit: 'body' },
        // custom
        'ol-1': { default: '1', inherit: undefined },
        'ol-2': { default: '1', inherit: undefined },
        'ol-3': { default: '1', inherit: undefined },
        'ol-4': { default: '1', inherit: undefined },
        'ol-before-1': { default: '', inherit: undefined },
        'ol-before-2': { default: '', inherit: undefined },
        'ol-before-3': { default: '', inherit: undefined },
        'ol-before-4': { default: '', inherit: undefined },
        'ol-after-1': { default: '. ', inherit: undefined },
        'ol-after-2': { default: '. ', inherit: undefined },
        'ol-after-3': { default: '. ', inherit: undefined },
        'ol-after-4': { default: '. ', inherit: undefined },
        'ol-sublevel': { default: false, inherit: undefined },
      },
      base
    ),
    ul: _.defaultsDeep(
      {
        'font-family': { default: undefined, inherit: 'body' },
        'font-size': { default: undefined, inherit: 'body' },
        color: { default: undefined, inherit: 'body' },
        'font-weight': { default: undefined, inherit: 'body' },
        'font-style': { default: undefined, inherit: 'body' },
        'text-decoration': { default: undefined, inherit: 'body' },
        'space-before': { default: undefined, inherit: 'body' },
        'space-after': { default: undefined, inherit: 'body' },
        'text-align': { default: undefined, inherit: 'body' },
        'start-indent': { default: undefined, inherit: 'body' },
        'line-height': { default: undefined, inherit: 'body' },
        // custom
        'ul-1': { default: '\u2022', inherit: undefined },
        'ul-2': { default: '\u2022', inherit: undefined },
        'ul-3': { default: '\u2022', inherit: undefined },
        'ul-4': { default: '\u2022', inherit: undefined },
      },
      base
    ),
    table: _.defaultsDeep(
      {
        'font-family': { default: undefined, inherit: 'body' },
        'font-size': { default: undefined, inherit: 'body' },
        color: { default: undefined, inherit: 'body' },
        'font-weight': { default: undefined, inherit: 'body' },
        'font-style': { default: undefined, inherit: 'body' },
        'text-decoration': { default: undefined, inherit: 'body' },
        'space-before': { default: undefined, inherit: 'body' },
        'space-after': { default: undefined, inherit: 'body' },
        'text-align': { default: undefined, inherit: 'body' },
        'start-indent': { default: undefined, inherit: 'body' },
        'line-height': { default: undefined, inherit: 'body' },
        // custom
        'caption-number': { default: 'document', inherit: undefined },
        'caption-position': { default: 'before', inherit: undefined },
      },
      base
    ),
    fig: _.defaultsDeep(
      {
        'font-family': { default: undefined, inherit: 'body' },
        'font-size': { default: undefined, inherit: 'body' },
        color: { default: undefined, inherit: 'body' },
        'font-weight': { default: undefined, inherit: 'body' },
        'font-style': { default: undefined, inherit: 'body' },
        'text-decoration': { default: undefined, inherit: 'body' },
        'space-before': { default: undefined, inherit: 'body' },
        'space-after': { default: undefined, inherit: 'body' },
        'text-align': { default: undefined, inherit: 'body' },
        'start-indent': { default: undefined, inherit: 'body' },
        'line-height': { default: undefined, inherit: 'body' },
        // custom
        'caption-number': { default: 'document', inherit: undefined },
        'caption-position': { default: 'after', inherit: undefined },
      },
      base
    ),
    toc_1: _.defaultsDeep(
      {
        'font-family': { default: undefined, inherit: 'body' },
        'font-size': { default: '14pt', inherit: 'body' },
        color: { default: undefined, inherit: 'body' },
        'font-weight': { default: 'bold', inherit: 'body' },
        'font-style': { default: undefined, inherit: 'body' },
        'text-decoration': { default: undefined, inherit: 'body' },
        // "space-before": {default: undefined, inherit: "body"},
        // "space-after": {default: undefined, inherit: "body"},
        'text-align': { default: undefined, inherit: 'body' },
        'start-indent': {
          default: startIndent + 0 * 30 + 'pt',
          inherit: 'body',
        },
        'line-height': { default: undefined, inherit: 'body' },
        'padding-top': { default: '20pt', inherit: undefined },
        'space-before': { default: '0pt', inherit: undefined },
        'space-after': { default: '0pt', inherit: undefined },
        // custom
        prefix: { default: true, inherit: undefined },
      },
      base
    ),
    toc_2: _.defaultsDeep(
      {
        'font-family': { default: undefined, inherit: 'body' },
        'font-size': { default: undefined, inherit: 'body' },
        color: { default: undefined, inherit: 'body' },
        'font-weight': { default: undefined, inherit: 'body' },
        'font-style': { default: undefined, inherit: 'body' },
        'text-decoration': { default: undefined, inherit: 'body' },
        // "space-before": {default: undefined, inherit: "body"},
        // "space-after": {default: undefined, inherit: "body"},
        'text-align': { default: undefined, inherit: 'body' },
        'start-indent': {
          default: startIndent + 1 * 30 + 'pt',
          inherit: 'body',
        },
        'line-height': { default: undefined, inherit: 'body' },
        'space-before': { default: '0pt', inherit: undefined },
        'space-after': { default: '0pt', inherit: undefined },
      },
      base
    ),
    toc_3: _.defaultsDeep(
      {
        'font-family': { default: undefined, inherit: 'body' },
        'font-size': { default: undefined, inherit: 'body' },
        color: { default: undefined, inherit: 'body' },
        'font-weight': { default: undefined, inherit: 'body' },
        'font-style': { default: undefined, inherit: 'body' },
        'text-decoration': { default: undefined, inherit: 'body' },
        // "space-before": {default: undefined, inherit: "body"},
        // "space-after": {default: undefined, inherit: "body"},
        'text-align': { default: undefined, inherit: 'body' },
        'start-indent': {
          default: startIndent + 2 * 30 + 'pt',
          inherit: 'body',
        },
        'line-height': { default: undefined, inherit: 'body' },
        'space-before': { default: '0pt', inherit: undefined },
        'space-after': { default: '0pt', inherit: undefined },
      },
      base
    ),
    toc_4: _.defaultsDeep(
      {
        'font-family': { default: undefined, inherit: 'body' },
        'font-size': { default: undefined, inherit: 'body' },
        color: { default: undefined, inherit: 'body' },
        'font-weight': { default: undefined, inherit: 'body' },
        'font-style': { default: undefined, inherit: 'body' },
        'text-decoration': { default: undefined, inherit: 'body' },
        // "space-before": {default: undefined, inherit: "body"},
        // "space-after": {default: undefined, inherit: "body"},
        'text-align': { default: undefined, inherit: 'body' },
        'start-indent': {
          default: startIndent + 3 * 30 + 'pt',
          inherit: 'body',
        },
        'line-height': { default: undefined, inherit: 'body' },
        'space-before': { default: '0pt', inherit: undefined },
        'space-after': { default: '0pt', inherit: undefined },
      },
      base
    ),
    // inline
    link: {
      'font-family': { default: undefined, inherit: 'body' },
      'font-size': { default: undefined, inherit: 'body' },
      color: { default: 'blue', inherit: undefined },
      'background-color': { default: 'transparent', inherit: undefined },
      'font-weight': { default: undefined, inherit: 'body' },
      'font-style': { default: undefined, inherit: 'body' },
      'text-decoration': { default: undefined, inherit: 'body' },
      'line-height': { default: undefined, inherit: undefined },
      // custom
      'link-page-number': { default: true, inherit: undefined },
      'link-url': { default: false, inherit: undefined },
    },
    tm: {
      'font-family': { default: undefined, inherit: 'body' },
      'font-size': { default: undefined, inherit: 'body' },
      color: { default: undefined, inherit: 'body' },
      'background-color': { default: 'transparent', inherit: undefined },
      'font-weight': { default: undefined, inherit: 'body' },
      'font-style': { default: undefined, inherit: 'body' },
      'text-decoration': { default: undefined, inherit: 'body' },
      'line-height': { default: undefined, inherit: undefined },
      // custom
      'symbol-scope': { default: 'always', inherit: undefined },
    },
  };
}
