(function() {
  function styles(_) {
    const startIndent = 25
    const base = {
      "background-color": {default: "transparent", inherit: null},
      "padding-top": {default: "0pt", inherit: null},
      "padding-right": {default: "0pt", inherit: null},
      "padding-bottom": {default: "0pt", inherit: null},
      "padding-left": {default: "0pt", inherit: null},
      "end-indent": {default: "0pt", inherit: null},
      "border-before-style": {default: null, inherit:null},
      "border-before-width": {default: null, inherit:null},
      "border-before-color": {default: null, inherit:null},
      "border-end-style": {default: null, inherit:null},
      "border-end-width": {default: null, inherit:null},
      "border-end-color": {default: null, inherit:null},
      "border-after-style": {default: null, inherit:null},
      "border-after-width": {default: null, inherit:null},
      "border-after-color": {default: null, inherit:null},
      "border-start-style": {default: null, inherit:null},
      "border-start-width": {default: null, inherit:null},
      "border-start-color": {default: null, inherit:null}
    }
    return {
      // block
      "body": _.defaultsDeep({
        "font-family": {default: "Times New Roman", inherit: null},
        "font-size": {default: "10pt", inherit: null},
        "color": {default: "black", inherit: null},
        "font-weight": {default: "normal", inherit: null},
        "font-style": {default: "normal", inherit: null},
        "text-decoration": {default: "none", inherit: null},
        "space-before": {default: "6pt", inherit: null},
        "space-after": {default: "6pt", inherit: null},
        "text-align": {default: "start", inherit: null},
        "start-indent": {default: startIndent + "pt", inherit: null},
        "line-height": {default: "1.2", inherit: null}
      }, base),
      "topic": _.defaultsDeep({
        "font-family": {default: "Helvetica", inherit: null},
        "font-size": {default: "18pt", inherit: null},
        "color": {default: "black", inherit: "body"},
        "font-weight": {default: "bold", inherit: null},
        "font-style": {default: "normal", inherit: null},
        "text-decoration": {default: "none", inherit: "body"},
        "space-before": {default: "0pt", inherit: null},
        "space-after": {default: "16.8pt", inherit: null},
        "text-align": {default: "start", inherit: null},
        "start-indent": {default: "0pt", inherit: null},
        "padding-top": {default: "0pt", inherit: null},
        "padding-right": {default: "0pt", inherit: null},
        "padding-bottom": {default: "0pt", inherit: null},
        "padding-left": {default: "0pt", inherit: null},
        "line-height": {default: null, inherit: "body"},
        // custom
        "title-numbering": {default: true, inherit: null}
      }, base),
      "topic_topic": _.defaultsDeep({
        "font-family": {default: "Helvetica", inherit: null},
        "font-size": {default: "14pt", inherit: null},
        "color": {default: "black", inherit: "body"},
        "font-weight": {default: "bold", inherit: null},
        "font-style": {default: "normal", inherit: null},
        "text-decoration": {default: "none", inherit: "body"},
        "space-before": {default: "12pt", inherit: null},
        "space-after": {default: "5pt", inherit: null},
        "text-align": {default: "start", inherit: null},
        "start-indent": {default: "0pt", inherit: null},
        "padding-top": {default: "0pt", inherit: null},
        "padding-right": {default: "0pt", inherit: null},
        "padding-bottom": {default: "0pt", inherit: null},
        "padding-left": {default: "0pt", inherit: null},
        "line-height": {default: null, inherit: "body"},
        // custom
        "title-numbering": {default: false, inherit: null}
      }, base),
      "topic_topic_topic": _.defaultsDeep({
        "font-family": {default: "Helvetica", inherit: null},
        "font-size": {default: "12pt", inherit: null},
        "color": {default: "black", inherit: "body"},
        "font-weight": {default: "bold", inherit: null},
        "font-style": {default: "normal", inherit: null},
        "text-decoration": {default: "none", inherit: "body"},
        "space-before": {default: "12pt", inherit: null},
        "space-after": {default: "2pt", inherit: null},
        "text-align": {default: "start", inherit: null},
        "start-indent": {default: "0pt", inherit: null},
        "line-height": {default: null, inherit: "body"},
        // custom
        "title-numbering": {default: false, inherit: null}
      }, base),
      "topic_topic_topic_topic": _.defaultsDeep({
        "font-family": {default: "Times New Roman", inherit: "body"},
        "font-size": {default: "10pt", inherit: "body"},
        "color": {default: "black", inherit: "body"},
        "font-weight": {default: "bold", inherit: null},
        "font-style": {default: "normal", inherit: null},
        "text-decoration": {default: "none", inherit: "body"},
        "space-before": {default: "12pt", inherit: null},
        "space-after": {default: "0pt", inherit: null},
        "text-align": {default: "start", inherit: null},
        "start-indent": {default: null, inherit: "body"},
        "line-height": {default: null, inherit: "body"},
        // custom
        "title-numbering": {default: false, inherit: null}
      }, base),
      "section": _.defaultsDeep({
        "font-family": {default: "Helvetica", inherit: null},
        "font-size": {default: null, inherit: "body"},
        "color": {default: null, inherit: "body"},
        "font-weight": {default: "bold", inherit: null},
        "font-style": {default: null, inherit: "body"},
        "text-decoration": {default: null, inherit: "body"},
        "space-before": {default: "15pt", inherit: null},
        "space-after": {default: null, inherit: "body"},
        "text-align": {default: null, inherit: "body"},
        "start-indent": {default: null, inherit: "body"},
        "line-height": {default: null, inherit: "body"}
      }, base),
      "example": _.defaultsDeep({
        "font-family": {default: null, inherit: "body"},
        "font-size": {default: null, inherit: "body"},
        "color": {default: null, inherit: "body"},
        "font-weight": {default: null, inherit: "body"},
        "font-style": {default: null, inherit: "body"},
        "text-decoration": {default: null, inherit: "body"},
        "space-before": {default: "0.6em", inherit: "body"},
        "space-after": {default: null, inherit: "body"},
        "text-align": {default: null, inherit: "body"},
        "padding-top": {default: "5pt", inherit: null},
        "padding-right": {default: "5pt", inherit: null},
        "padding-bottom": {default: "5pt", inherit: null},
        "padding-left": {default: "5pt", inherit: null},
        "start-indent": {default: "36pt", inherit: "body"},
        "line-height": {default: null, inherit: "body"},
        "border-before-style": {default: "solid", inherit:null},
        "border-before-width": {default: "1pt", inherit:null},
        "border-before-color": {default: "black", inherit:null},
        "border-end-style": {default: "solid", inherit:null},
        "border-end-width": {default: "1pt", inherit:null},
        "border-end-color": {default: "black", inherit:null},
        "border-after-style": {default: "solid", inherit:null},
        "border-after-width": {default: "1pt", inherit:null},
        "border-after-color": {default: "black", inherit:null},
        "border-start-style": {default: "solid", inherit:null},
        "border-start-width": {default: "1pt", inherit:null},
        "border-start-color": {default: "black", inherit:null},
      }, base),
      "example_title": _.defaultsDeep({
        "font-family": {default: "Helvetica", inherit: null},
        "font-size": {default: null, inherit: "body"},
        "color": {default: null, inherit: "body"},
        "font-weight": {default: "bold", inherit: null},
        "font-style": {default: null, inherit: "body"},
        "text-decoration": {default: null, inherit: "body"},
        "space-before": {default: "15pt", inherit: null},
        "space-after": {default: null, inherit: "body"},
        "text-align": {default: null, inherit: "body"},
        "start-indent": {default: null, inherit: "body"},
        "line-height": {default: null, inherit: "body"}
      }, base),
      "note": _.defaultsDeep({
        "font-family": {default: null, inherit: "body"},
        "font-size": {default: null, inherit: "body"},
        "color": {default: null, inherit: "body"},
        "font-weight": {default: null, inherit: "body"},
        "font-style": {default: null, inherit: "body"},
        "text-decoration": {default: null, inherit: "body"},
        "space-before": {default: null, inherit: "body"},
        "space-after": {default: null, inherit: "body"},
        "text-align": {default: null, inherit: "body"},
        "start-indent": {default: null, inherit: "body"},
        "line-height": {default: null, inherit: "body"},
        // custom
        "icon": {default: "icon", inherit: null}
      }, base),
      "pre": _.defaultsDeep({
        "font-family": {default: "Monaco", inherit: null},
        "font-size": {default: null, inherit: "body"},
        "color": {default: null, inherit: "body"},
        "font-weight": {default: null, inherit: "body"},
        "font-style": {default: null, inherit: "body"},
        "text-decoration": {default: null, inherit: "body"},
        "space-before": {default: "15pt", inherit: null},
        "space-after": {default: null, inherit: "body"},
        "text-align": {default: null, inherit: "body"},
        "start-indent": {default: null, inherit: "body"},
        "line-height": {default: null, inherit: "body"}
      }, base),
      "codeblock": _.defaultsDeep({
        "font-family": {default: "Monaco", inherit: null},
        "font-size": {default: null, inherit: "body"},
        "color": {default: null, inherit: "body"},
        "font-weight": {default: null, inherit: "body"},
        "font-style": {default: null, inherit: "body"},
        "text-decoration": {default: null, inherit: "body"},
        "space-before": {default: "15pt", inherit: null},
        "space-after": {default: null, inherit: "body"},
        "text-align": {default: null, inherit: "body"},
        "start-indent": {default: "31pt", inherit: "body"},//+6pt
        "line-height": {default: null, inherit: "body"}
      }, base),
      "dl": _.defaultsDeep({
        "font-family": {default: null, inherit: "body"},
        "font-size": {default: null, inherit: "body"},
        "color": {default: null, inherit: "body"},
        "font-weight": {default: null, inherit: "body"},
        "font-style": {default: null, inherit: "body"},
        "text-decoration": {default: null, inherit: "body"},
        "space-before": {default: null, inherit: "body"},
        "space-after": {default: null, inherit: "body"},
        "text-align": {default: null, inherit: "body"},
        "start-indent": {default: null, inherit: "body"},
        "line-height": {default: null, inherit: "body"},
        // custom
        "dl-type": {default: "table", inherit: null}
      }, base),
      "ol": _.defaultsDeep({
        "font-family": {default: null, inherit: "body"},
        "font-size": {default: null, inherit: "body"},
        "color": {default: null, inherit: "body"},
        "font-weight": {default: null, inherit: "body"},
        "font-style": {default: null, inherit: "body"},
        "text-decoration": {default: null, inherit: "body"},
        "space-before": {default: null, inherit: "body"},
        "space-after": {default: null, inherit: "body"},
        "text-align": {default: null, inherit: "body"},
        "start-indent": {default: null, inherit: "body"},
        "line-height": {default: null, inherit: "body"},
        // custom
        "ol-1": {default: "1", inherit: null},
        "ol-2": {default: "1", inherit: null},
        "ol-3": {default: "1", inherit: null},
        "ol-4": {default: "1", inherit: null},
        "ol-before-1": {default: "", inherit: null},
        "ol-before-2": {default: "", inherit: null},
        "ol-before-3": {default: "", inherit: null},
        "ol-before-4": {default: "", inherit: null},
        "ol-after-1": {default: ". ", inherit: null},
        "ol-after-2": {default: ". ", inherit: null},
        "ol-after-3": {default: ". ", inherit: null},
        "ol-after-4": {default: ". ", inherit: null},
        "ol-sublevel": {default: false, inherit: null}
      }, base),
      "ul": _.defaultsDeep({
        "font-family": {default: null, inherit: "body"},
        "font-size": {default: null, inherit: "body"},
        "color": {default: null, inherit: "body"},
        "font-weight": {default: null, inherit: "body"},
        "font-style": {default: null, inherit: "body"},
        "text-decoration": {default: null, inherit: "body"},
        "space-before": {default: null, inherit: "body"},
        "space-after": {default: null, inherit: "body"},
        "text-align": {default: null, inherit: "body"},
        "start-indent": {default: null, inherit: "body"},
        "line-height": {default: null, inherit: "body"},
        // custom
        "ul-1": {default: "\u2022", inherit: null},
        "ul-2": {default: "\u2022", inherit: null},
        "ul-3": {default: "\u2022", inherit: null},
        "ul-4": {default: "\u2022", inherit: null}
      }, base),
      "table": _.defaultsDeep({
        "font-family": {default: null, inherit: "body"},
        "font-size": {default: null, inherit: "body"},
        "color": {default: null, inherit: "body"},
        "font-weight": {default: null, inherit: "body"},
        "font-style": {default: null, inherit: "body"},
        "text-decoration": {default: null, inherit: "body"},
        "space-before": {default: null, inherit: "body"},
        "space-after": {default: null, inherit: "body"},
        "text-align": {default: null, inherit: "body"},
        "start-indent": {default: null, inherit: "body"},
        "line-height": {default: null, inherit: "body"},
        // custom
        "caption-number": {default: "document", inherit: null},
        "caption-position": {default: "before", inherit: null}
      }, base),
      "fig": _.defaultsDeep({
        "font-family": {default: null, inherit: "body"},
        "font-size": {default: null, inherit: "body"},
        "color": {default: null, inherit: "body"},
        "font-weight": {default: null, inherit: "body"},
        "font-style": {default: null, inherit: "body"},
        "text-decoration": {default: null, inherit: "body"},
        "space-before": {default: null, inherit: "body"},
        "space-after": {default: null, inherit: "body"},
        "text-align": {default: null, inherit: "body"},
        "start-indent": {default: null, inherit: "body"},
        "line-height": {default: null, inherit: "body"},
        // custom
        "caption-number": {default: "document", inherit: null},
        "caption-position": {default: "after", inherit: null}
      }, base),
      "toc_1": _.defaultsDeep({
        "font-family": { default: null, inherit: "body" },
        "font-size": { default: '14pt', inherit: "body" },
        "color": { default: null, inherit: "body" },
        "font-weight": { default: 'bold', inherit: "body" },
        "font-style": { default: null, inherit: "body" },
        "text-decoration": { default: null, inherit: "body" },
        "space-before": { default: null, inherit: "body" },
        "space-after": { default: null, inherit: "body" },
        "text-align": { default: null, inherit: "body" },
        "start-indent": { default: (startIndent + 0 * 30) + 'pt', inherit: "body" },
        "line-height": { default: null, inherit: "body" },
        'padding-top': { default: '20pt', inherit: null },
        "space-before": {default: '0pt', inherit: null},
        "space-after": {default: '0pt', inherit: null},
        // custom
        "prefix": {default: true, inherit: null}
      }, base),
      "toc_2": _.defaultsDeep({
        "font-family": { default: null, inherit: "body" },
        "font-size": { default: null, inherit: "body" },
        "color": { default: null, inherit: "body" },
        "font-weight": { default: null, inherit: "body" },
        "font-style": { default: null, inherit: "body" },
        "text-decoration": { default: null, inherit: "body" },
        "space-before": { default: null, inherit: "body" },
        "space-after": { default: null, inherit: "body" },
        "text-align": { default: null, inherit: "body" },
        "start-indent": { default: (startIndent + 1 * 30) + 'pt', inherit: "body" },
        "line-height": { default: null, inherit: "body" },
        "space-before": {default: '0pt', inherit: null},
        "space-after": {default: '0pt', inherit: null}
      }, base),
      "toc_3": _.defaultsDeep({
        "font-family": { default: null, inherit: "body" },
        "font-size": { default: null, inherit: "body" },
        "color": { default: null, inherit: "body" },
        "font-weight": { default: null, inherit: "body" },
        "font-style": { default: null, inherit: "body" },
        "text-decoration": { default: null, inherit: "body" },
        "space-before": { default: null, inherit: "body" },
        "space-after": { default: null, inherit: "body" },
        "text-align": { default: null, inherit: "body" },
        "start-indent": { default: (startIndent + 2 * 30) + 'pt', inherit: "body" },
        "line-height": { default: null, inherit: "body" },
        "space-before": {default: '0pt', inherit: null},
        "space-after": {default: '0pt', inherit: null}
      }, base),
      "toc_4": _.defaultsDeep({
        "font-family": { default: null, inherit: "body" },
        "font-size": { default: null, inherit: "body" },
        "color": { default: null, inherit: "body" },
        "font-weight": { default: null, inherit: "body" },
        "font-style": { default: null, inherit: "body" },
        "text-decoration": { default: null, inherit: "body" },
        "space-before": { default: null, inherit: "body" },
        "space-after": { default: null, inherit: "body" },
        "text-align": { default: null, inherit: "body" },
        "start-indent": { default: (startIndent + 3 * 30) + 'pt', inherit: "body" },
        "line-height": { default: null, inherit: "body" },
        "space-before": {default: '0pt', inherit: null},
        "space-after": {default: '0pt', inherit: null}
      }, base),
      // inline
      "link": {
        "font-family": {default: null, inherit: "body"},
        "font-size": {default: null, inherit: "body"},
        "color": {default: "blue", inherit: null},
        "background-color": {default: "transparent", inherit: null},
        "font-weight": {default: null, inherit: "body"},
        "font-style": {default: null, inherit: "body"},
        "text-decoration": {default: null, inherit: "body"},
        "line-height": {default: null, inherit: null},
        // custom
        "link-page-number": {default: true, inherit: null},
        "link-url": {default: false, inherit: null}
      },
      "tm": {
        "font-family": {default: null, inherit: "body"},
        "font-size": {default: null, inherit: "body"},
        "color": {default: null, inherit: "body"},
        "background-color": {default: "transparent", inherit: null},
        "font-weight": {default: null, inherit: "body"},
        "font-style": {default: null, inherit: "body"},
        "text-decoration": {default: null, inherit: "body"},
        "line-height": {default: null, inherit: null},
        // custom
        'symbol-scope': { default: 'always', inherit: null }
      }
    }
  }
  if (typeof exports === 'undefined') {
    define([], function() {
      return styles(_)
    })
  } else {
    const _ = require('lodash')
    exports.styles = styles(_)
  }
})()