(function() {
  const styles = {
    // block
    "body": {
      "font-family": {default: "Times New Roman", inherit: null},
      "font-size": {default: "10pt", inherit: null},
      "color": {default: "black", inherit: null},
      "background-color": {default: "transparent", inherit: null},
      "font-weight": {default: "normal", inherit: null},
      "font-style": {default: "normal", inherit: null},
      "text-decoration": {default: "none", inherit: null},
      "space-before": {default: "6pt", inherit: null},
      "space-after": {default: "6pt", inherit: null},
      "text-align": {default: "start", inherit: null},
      "start-indent": {default: "25pt", inherit: null},
      "line-height": {default: "1.2", inherit: null}
    },
    "topic": {
      "font-family": {default: "Helvetica", inherit: null},
      "font-size": {default: "18pt", inherit: null},
      "color": {default: "black", inherit: "body"},
      "background-color": {default: "transparent", inherit: null},
      "font-weight": {default: "bold", inherit: null},
      "font-style": {default: "normal", inherit: null},
      "text-decoration": {default: "none", inherit: "body"},
      "space-before": {default: "0pt", inherit: null},
      "space-after": {default: "16.8pt", inherit: null},
      "text-align": {default: "start", inherit: null},
      "start-indent": {default: "0pt", inherit: null},
      "line-height": {default: null, inherit: "body"},
      // custom
      "title-numbering": {default: true, inherit: null}
    },
    "topic_topic": {
      "font-family": {default: "Helvetica", inherit: null},
      "font-size": {default: "14pt", inherit: null},
      "color": {default: "black", inherit: "body"},
      "background-color": {default: "transparent", inherit: null},
      "font-weight": {default: "bold", inherit: null},
      "font-style": {default: "normal", inherit: null},
      "text-decoration": {default: "none", inherit: "body"},
      "space-before": {default: "12pt", inherit: null},
      "space-after": {default: "5pt", inherit: null},
      "text-align": {default: "start", inherit: null},
      "start-indent": {default: "0pt", inherit: null},
      "line-height": {default: null, inherit: "body"},
      // custom
      "title-numbering": {default: false, inherit: null}
    },
    "topic_topic_topic": {
      "font-family": {default: "Helvetica", inherit: null},
      "font-size": {default: "12pt", inherit: null},
      "color": {default: "black", inherit: "body"},
      "background-color": {default: "transparent", inherit: null},
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
    },
    "topic_topic_topic_topic": {
      "font-family": {default: "Times New Roman", inherit: "body"},
      "font-size": {default: "10pt", inherit: "body"},
      "color": {default: "black", inherit: "body"},
      "background-color": {default: "transparent", inherit: null},
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
    },
    "section": {
      "font-family": {default: "Helvetica", inherit: null},
      "font-size": {default: null, inherit: "body"},
      "color": {default: null, inherit: "body"},
      "background-color": {default: "transparent", inherit: null},
      "font-weight": {default: null, inherit: "body"},
      "font-style": {default: null, inherit: "body"},
      "text-decoration": {default: null, inherit: "body"},
      "space-before": {default: "15pt", inherit: null},
      "space-after": {default: null, inherit: "body"},
      "text-align": {default: null, inherit: "body"},
      "start-indent": {default: null, inherit: "body"},
      "line-height": {default: null, inherit: "body"}
    },
    "note": {
      "font-family": {default: null, inherit: "body"},
      "font-size": {default: null, inherit: "body"},
      "color": {default: null, inherit: "body"},
      "background-color": {default: "transparent", inherit: null},
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
    },
    "pre": {
      "font-family": {default: "Monaco", inherit: null},
      "font-size": {default: null, inherit: "body"},
      "color": {default: null, inherit: "body"},
      "background-color": {default: "transparent", inherit: null},
      "font-weight": {default: null, inherit: "body"},
      "font-style": {default: null, inherit: "body"},
      "text-decoration": {default: null, inherit: "body"},
      "space-before": {default: "15pt", inherit: null},
      "space-after": {default: null, inherit: "body"},
      "text-align": {default: null, inherit: "body"},
      "start-indent": {default: null, inherit: "body"},
      "line-height": {default: null, inherit: "body"}
    },
    "codeblock": {
      "font-family": {default: "Monaco", inherit: null},
      "font-size": {default: null, inherit: "body"},
      "color": {default: null, inherit: "body"},
      "background-color": {default: "transparent", inherit: null},
      "font-weight": {default: null, inherit: "body"},
      "font-style": {default: null, inherit: "body"},
      "text-decoration": {default: null, inherit: "body"},
      "space-before": {default: "15pt", inherit: null},
      "space-after": {default: null, inherit: "body"},
      "text-align": {default: null, inherit: "body"},
      "start-indent": {default: "31pt", inherit: "body"},//+6pt
      "line-height": {default: null, inherit: "body"}
    },
    "dl": {
      "font-family": {default: null, inherit: "body"},
      "font-size": {default: null, inherit: "body"},
      "color": {default: null, inherit: "body"},
      "background-color": {default: null, inherit: "body"},
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
    },
    "ol": {
      "font-family": {default: null, inherit: "body"},
      "font-size": {default: null, inherit: "body"},
      "color": {default: null, inherit: "body"},
      "background-color": {default: null, inherit: "body"},
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
    },
    "ul": {
      "font-family": {default: null, inherit: "body"},
      "font-size": {default: null, inherit: "body"},
      "color": {default: null, inherit: "body"},
      "background-color": {default: null, inherit: "body"},
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
    },
    "table": {
      "font-family": {default: null, inherit: "body"},
      "font-size": {default: null, inherit: "body"},
      "color": {default: null, inherit: "body"},
      "background-color": {default: null, inherit: "body"},
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
    },
    "fig": {
      "font-family": {default: null, inherit: "body"},
      "font-size": {default: null, inherit: "body"},
      "color": {default: null, inherit: "body"},
      "background-color": {default: null, inherit: "body"},
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
    },
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
    }
  }
  if (typeof exports === 'undefined') {
    define([], function() {
      return styles
    })
  } else {
    exports.styles = styles
  }
})()