'use strict'

const _ = require('lodash')
const JSZip = require('jszip')
const ET = require('./lib/elementtree')
const utils = require('./lib/utils')
const styles = require('./javascript/lib/styles').styles
const Version = require('./lib/version')
const vars = require('./lib/vars')

class Generator {

  constructor() {
    this.properties = ["absolute-position", "active-state", "alignment-adjust", "alignment-baseline", "allowed-height-scale", "allowed-width-scale", "auto-restore", "azimuth", "background-attachment", "background-color", "background-image", "background-position-horizontal", "background-position-vertical", "background-repeat", "baseline-shift", "blank-or-not-blank", "block-progression-dimension", "border-after-color", "border-after-precedence", "border-after-style", "border-after-width", "border-before-color", "border-before-precedence", "border-before-style", "border-before-width", "border-bottom-color", "border-bottom-style", "border-bottom-width", "border-collapse", "border-end-color", "border-end-precedence", "border-end-style", "border-end-width", "border-left-color", "border-left-style", "border-left-width", "border-right-color", "border-right-style", "border-right-width", "border-separation", "border-start-color", "border-start-precedence", "border-start-style", "border-start-width", "border-top-color", "border-top-style", "border-top-width", "bottom", "bottom", "break-after", "break-before", "caption-side", "case-name", "case-title", "change-bar-class", "change-bar-color", "change-bar-offset", "change-bar-placement", "change-bar-style", "change-bar-width", "character", "clear", "clip", "color", "color-profile-name", "column-count", "column-gap", "column-number", "column-width", "content-height", "content-type", "content-width", "country", "cue-after", "cue-before", "destination-placement-offset", "direction", "display-align", "dominant-baseline", "elevation", "empty-cells", "end-indent", "ends-row", "extent", "external-destination", "float", "flow-map-name", "flow-map-reference", "flow-name", "flow-name-reference", "font-family", "font-selection-strategy", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "force-page-count", "format", "glyph-orientation-horizontal", "glyph-orientation-vertical", "grouping-separator", "grouping-size", "height", "hyphenate", "hyphenation-character", "hyphenation-keep", "hyphenation-ladder-count", "hyphenation-push-character-count", "hyphenation-remain-character-count", "id", "index-class", "index-key", "indicate-destination", "initial-page-number", "inline-progression-dimension", "internal-destination", "intrinsic-scale-value", "intrusion-displace", "keep-together", "keep-with-next", "keep-with-previous", "language", "last-line-end-indent", "leader-alignment", "leader-length", "leader-pattern", "leader-pattern-width", "left", "left", "letter-spacing", "letter-value", "linefeed-treatment", "line-height", "line-height-shift-adjustment", "line-stacking-strategy", "margin-bottom", "margin-bottom", "margin-left", "margin-left", "margin-right", "margin-right", "margin-top", "margin-top", "marker-class-name", "master-name", "master-reference", "maximum-repeats", "media-usage", "merge-pages-across-index-key-references", "merge-ranges-across-index-key-references", "merge-sequential-page-numbers", "number-columns-repeated", "number-columns-spanned", "number-rows-spanned", "odd-or-even", "orphans", "overflow", "padding-after", "padding-before", "padding-bottom", "padding-end", "padding-left", "padding-right", "padding-start", "padding-top", "page-citation-strategy", "page-height", "page-number-treatment", "page-position", "page-width", "pause-after", "pause-before", "pitch", "pitch-range", "play-during", "precedence", "provisional-distance-between-starts", "provisional-label-separation", "reference-orientation", "ref-id", "ref-index-key", "region-name", "region-name-reference", "relative-align", "relative-position", "rendering-intent", "retrieve-boundary", "retrieve-boundary-within-table", "retrieve-class-name", "retrieve-position", "retrieve-position-within-table", "richness", "right", "right", "role", "rule-style", "rule-thickness", "scale-option", "scaling", "scaling-method", "score-spaces", "script", "show-destination", "source-document", "space-after", "space-before", "space-end", "space-start", "span", "speak", "speak-header", "speak-numeral", "speak-punctuation", "speech-rate", "src", "start-indent", "starting-state", "starts-row", "stress", "suppress-at-line-break", "switch-to", "table-layout", "table-omit-footer-at-break", "table-omit-header-at-break", "target-presentation-context", "target-processing-context", "target-stylesheet", "text-align", "text-align-last", "text-altitude", "text-decoration", "text-depth", "text-indent", "text-shadow", "text-transform", "top", "top", "treat-as-word-space", "unicode-bidi", "visibility", "voice-family", "volume", "white-space-collapse", "white-space-treatment", "widows", "width", "word-spacing", "wrap-option", "writing-mode", "z-index"]
    this.variable_languages = ["de", "en", "es", "fi", "fr", "he", "it", "ja", "nl", "ro", "ru", "sv", "zh_CN"]
    // FIXME these should come from common lib
    this.styles = styles

    this.ot_version = new Version("2.2")
    this.plugin_name = null
    this.plugin_version = null
    this.style = {
      ol: true
    }
    this.page = {}
    this.force_page_count = null
    this.chapter_layout = null
    this.body_column_count = null
    this.index_column_count = null
    this.bookmark_style = null
    this.toc_maximum_level = 4
    this.task_label = false
    this.include_related_links = null
    this.column_gap = null
    this.mirror_page_margins = false
    this.table_continued = false
    this.formatter = "ah"
    this.override_shell = false
    this.cover_image = null
    this.cover_image_name = null
    this.cover_image_metadata = null
    this.cover_image_topic = null
    this.header = {}
    this.footer = {}
    this.page_number = null
    this.options = {}

    ET.register_namespace("xsl", "http://www.w3.org/1999/XSL/Transform")
    ET.register_namespace("fo", "http://www.w3.org/1999/XSL/Format")
    ET.register_namespace("xs", "http://www.w3.org/2001/XMLSchema")
    ET.register_namespace("e", this.plugin_name)
    ET.register_namespace("ditaarch", "http://dita.oasis-open.org/architecture/2005/")
    ET.register_namespace("opentopic", "http://www.idiominc.com/opentopic")
    ET.register_namespace("opentopic-func", "http://www.idiominc.com/opentopic/exsl/function")
  }

  default_style(type, property) {
    if (_.has(this.styles, [type, property])) {
      return this.styles[type][property].default || null
    }
    return null
  }

//    function get_ns():
//        return {
//            "xsl": "http://www.w3.org/1999/XSL/Transform",
//            "fo": "http://www.w3.org/1999/XSL/Format",
//            "xs": "http://www.w3.org/2001/XMLSchema",
//            "e": plugin_name,
//            "ditaarch": "http://dita.oasis-open.org/architecture/2005/",
//            "opentopic": "http://www.idiominc.com/opentopic",
//            "opentopic-func": "http://www.idiominc.com/opentopic/exsl/function"
//            }

  /**
   * Generate plugin integrator Ant file.
   */
  generate_integrator() {
    const root = ET.Element("project", {
      "name": this.plugin_name,
    })
    const init = ET.SubElement(root, "target", {
      "name": `dita2${this.transtype}.init`
    })
    ET.SubElement(init, "property", {
      "name": "customization.dir",
      "location": `\${dita.plugin.${this.plugin_name}.dir}/cfg`
    })
    ET.SubElement(init, "property", {
      "name": "pdf2.i18n.skip",
      "value": true
    })
    if (this.override_shell) {
      ET.SubElement(init, "property", {
        "name": "args.xsl.pdf",
        "location": `\${dita.plugin.${this.plugin_name}.dir}/xsl/fo/topic2fo_shell_${this.formatter}.xsl`
      })
    }
    if (this.chapter_layout) {
      ET.SubElement(init, "property", {
        "name": "args.chapter.layout",
        "value": this.chapter_layout
      })
    }
    if (this.bookmark_style) {
      ET.SubElement(init, "property", {
        "name": "args.bookmark.style",
        "value": this.bookmark_style
      })
    }
    if (this.task_label) {
      ET.SubElement(init, "property", {
        "name": "args.gen.task.lbl",
        "value": 'YES'
      })
    }
    if (this.include_related_links) {
      ET.SubElement(init, "property", {
        "name": "args.fo.include.rellinks",
        "value": this.include_related_links
      })
    }
    ET.SubElement(root, "target", {
      "name": `dita2${this.transtype}`,
      "depends": `dita2${this.transtype}.init, dita2pdf2`
    })
    //ditagen.generator.indent(root)
    const d = new ET.ElementTree(root)
    return d.write()
  }

  /**
   * Generate plugin configuration file.
   */
  generate_plugin_file() {
    const root = ET.Element("plugin", {id: this.plugin_name})
    if (this.plugin_version) {
      ET.SubElement(root, "feature", {extension: "package.version", value: this.plugin_version})
    }
    ET.SubElement(root, "require", {plugin: "org.dita.pdf2"})
    ET.SubElement(root, "feature", {extension: "dita.conductor.transtype.check", value: this.transtype})
    ET.SubElement(root, "feature", {extension: "dita.transtype.print", value: this.transtype})
    ET.SubElement(root, "feature", {extension: "dita.conductor.target.relative", file: "integrator.xml"})
    //ditagen.generator.indent(root)
    const d = new ET.ElementTree(root)
    return d.write()
  }

  /**
   * Generate plugin configuration file.
   */
  generate_catalog() {
    const root = ET.Element(catalog('catalog'), {
      prefer: 'system'
    })
    if (!this.override_shell) {
      ET.SubElement(root, catalog('uri'), {
        name: 'cfg:fo/attrs/custom.xsl',
        uri: 'fo/attrs/custom.xsl'
      })
      ET.SubElement(root, catalog('uri'), {
        name: 'cfg:fo/xsl/custom.xsl',
        uri: 'fo/xsl/custom.xsl'
      })
    }
    //ditagen.generator.indent(root)
    //ditagen.generator.set_prefixes(root, {"": "urn:oasis:names:tc:entity:xmlns:xml:catalog"})
    const d = new ET.ElementTree(root)
    ET.register_namespace('', 'urn:oasis:names:tc:entity:xmlns:xml:catalog')
    return d.write()
  }

  /**
   * Generate plugin custom XSLT file.
   */
  generate_custom(stylesheet) {
    const root = ET.Element(xsl('stylesheet'), {
      //"xmlns:xsl": "http://www.w3.org/1999/XSL/Transform",
      "xmlns:fo": "http://www.w3.org/1999/XSL/Format",
      "xmlns:xs": "http://www.w3.org/2001/XMLSchema",
      "xmlns:e": this.plugin_name,
      "xmlns:ditaarch": "http://dita.oasis-open.org/architecture/2005/",
      "xmlns:opentopic": "http://www.idiominc.com/opentopic",
      "xmlns:opentopic-func": "http://www.idiominc.com/opentopic/exsl/function",
      "version": "2.0",
      "exclude-result-prefixes": "ditaarch opentopic e"
    })

    const cover_metadata_raw = `
  <xsl:template name="e:cover-image">
    <xsl:for-each select="($map//*[contains(@class, ' topic/data ')][@name = '${this.cover_image_metadata}']/*[contains(@class, ' topic/image ')])[1]">
      <xsl:apply-templates select="." mode="placeImage">
        <xsl:with-param name="imageAlign" select="@align"/>
        <xsl:with-param name="href" select="if (@scope = 'external' or opentopic-func:isAbsolute(@href)) then @href else concat($input.dir.url, @href)"/>
        <xsl:with-param name="height" select="@height"/>
        <xsl:with-param name="width" select="@width"/>
      </xsl:apply-templates>
    </xsl:for-each>
  </xsl:template>
`
    const cover_topic_raw = `
  <xsl:template name="e:cover-image">
    <xsl:for-each select="($map//*[contains(@class, ' map/topicref ')][@outputclass = '${this.cover_image_topic}'])[1]">
      <xsl:apply-templates select="key('id', @id)/*[contains(@class, ' topic/body ')]/node()"/>
    </xsl:for-each>
  </xsl:template>
`
    const cover_file_raw = `
  <xsl:template name="e:cover-image">
    <xsl:variable name="path">
      <xsl:call-template name="getVariable">
        <xsl:with-param name="id" select="'cover-image-path'"/>
      </xsl:call-template>
    </xsl:variable>
    <xsl:apply-templates select="." mode="placeImage">
      <xsl:with-param name="imageAlign" select="'center'"/>
      <xsl:with-param name="href" select="concat($artworkPrefix, $path)"/>
      <xsl:with-param name="height" select="()"/>
      <xsl:with-param name="width" select="()"/>
    </xsl:apply-templates>
  </xsl:template>
`
    const cover_raw_2 = `
  <xsl:template name="createFrontCoverContents">
    <!-- set the title -->
    <fo:block xsl:use-attribute-sets="__frontmatter__title">
      <xsl:choose>
        <xsl:when test="$map/*[contains(@class,' topic/title ')][1]">
          <xsl:apply-templates select="$map/*[contains(@class,' topic/title ')][1]"/>
        </xsl:when>
        <xsl:when test="$map//*[contains(@class,' bookmap/mainbooktitle ')][1]">
          <xsl:apply-templates select="$map//*[contains(@class,' bookmap/mainbooktitle ')][1]"/>
        </xsl:when>
        <xsl:when test="//*[contains(@class, ' map/map ')]/@title">
          <xsl:value-of select="//*[contains(@class, ' map/map ')]/@title"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="/descendant::*[contains(@class, ' topic/topic ')][1]/*[contains(@class, ' topic/title ')]"/>
        </xsl:otherwise>
      </xsl:choose>
    </fo:block>
    <!-- set the subtitle -->
    <xsl:apply-templates select="$map//*[contains(@class,' bookmap/booktitlealt ')]"/>
    <fo:block xsl:use-attribute-sets="__frontmatter__owner">
      <xsl:apply-templates select="$map//*[contains(@class,' bookmap/bookmeta ')]"/>
    </fo:block>
    <!-- cover image -->
    <fo:block xsl:use-attribute-sets="image__block">
      <xsl:call-template name="e:cover-image"/>
    </fo:block>
  </xsl:template>
`

    // empty table footer
    const table_footer_raw = `
  <xsl:template match="*[contains(@class, ' topic/tbody ')]" name="topic.tbody">
    <fo:table-footer xsl:use-attribute-sets="tgroup.tfoot">
      <fo:table-row>
        <fo:table-cell number-columns-spanned="{../@cols}"/>
      </fo:table-row>
    </fo:table-footer>
    <fo:table-body xsl:use-attribute-sets="tgroup.tbody">
      <xsl:call-template name="commonattributes"/>
      <xsl:apply-templates/>
    </fo:table-body>
  </xsl:template>
`
    // table footer with "table continued"
    const table_continued_raw = `
  <xsl:variable name="table.frame-default" select="'all'"/>

  <xsl:template match="*[contains(@class, ' topic/tbody ')]" name="topic.tbody">
    <fo:table-footer xsl:use-attribute-sets="tgroup.tfoot table__tableframe__top">
      <fo:retrieve-table-marker retrieve-class-name="e:continued" retrieve-position-within-table="last-ending" retrieve-boundary-within-table="table-fragment"/>
    </fo:table-footer>
    <fo:table-body xsl:use-attribute-sets="tgroup.tbody">
      <xsl:call-template name="commonattributes"/>
      <fo:marker marker-class-name="e:continued">
        <fo:table-row>
          <fo:table-cell xsl:use-attribute-sets="e:tfoot.row.entry.continued" number-columns-spanned="{../@cols}">
            <xsl:variable name="frame">
              <xsl:choose>
                <xsl:when test="../../@frame">
                  <xsl:value-of select="../../@frame"/>
                </xsl:when>
                <xsl:otherwise>
                  <xsl:value-of select="$table.frame-default"/>
                </xsl:otherwise>
              </xsl:choose>
            </xsl:variable>
            <xsl:if test="$frame = 'all' or $frame = 'topbot' or $frame = 'bottom'">
              <xsl:call-template name="processAttrSetReflection">
                <xsl:with-param name="attrSet" select="'__tableframe__top'"/>
                <xsl:with-param name="path" select="$tableAttrs"/>
              </xsl:call-template>
            </xsl:if>
            <fo:block>
              <xsl:call-template name="getVariable">
                <xsl:with-param name="id" select="'#table-continued'"/>
              </xsl:call-template>
            </fo:block>
          </fo:table-cell>
        </fo:table-row>
      </fo:marker>
      <xsl:apply-templates/>
    </fo:table-body>
  </xsl:template>

  <xsl:template match="*[contains(@class, ' topic/tbody ')]/*[contains(@class, ' topic/row ')]" name="topic.tbody_row">
    <fo:table-row xsl:use-attribute-sets="tbody.row">
      <xsl:call-template name="commonattributes"/>
      <xsl:if test="not(following-sibling::*)">
        <fo:marker marker-class-name="e:continued"/>
      </xsl:if>
      <xsl:apply-templates/>
    </fo:table-row>
  </xsl:template>
`
    const dl_list_raw = `
  <xsl:template match="*[contains(@class, ' topic/dl ')]">
    <fo:list-block xsl:use-attribute-sets="ul e:dl">
      <xsl:call-template name="commonattributes"/>
      <xsl:apply-templates select="*[contains(@class, ' topic/dlentry ')]"/>
    </fo:list-block>
  </xsl:template>

  <xsl:template match="*[contains(@class, ' topic/dlentry ')]">
    <fo:list-item xsl:use-attribute-sets="ul.li">
      <fo:list-item-label xsl:use-attribute-sets="ul.li__label">
        <fo:block xsl:use-attribute-sets="ul.li__label__content">
          <xsl:call-template name="commonattributes"/>
          <xsl:call-template name="getVariable">
            <xsl:with-param name="id" select="'Unordered List bullet'"/>
          </xsl:call-template>
        </fo:block>
      </fo:list-item-label>
      <fo:list-item-body xsl:use-attribute-sets="ul.li__body">
        <fo:block xsl:use-attribute-sets="ul.li__content">
          <xsl:apply-templates select="*[contains(@class, ' topic/dt ')]"/>
          <xsl:apply-templates select="*[contains(@class, ' topic/dd ')]"/>
        </fo:block>
      </fo:list-item-body>
    </fo:list-item>
  </xsl:template>

  <xsl:template match="*[contains(@class, ' topic/dt ')]">
    <fo:block xsl:use-attribute-sets="e:dlentry.dt__content">
      <xsl:apply-templates/>
    </fo:block>
  </xsl:template>

  <xsl:template match="*[contains(@class, ' topic/dd ')]">
    <fo:block xsl:use-attribute-sets="e:dlentry.dd__content">
      <xsl:apply-templates/>
    </fo:block>
  </xsl:template>
`
    const dl_html_raw = `
  <xsl:template match="*[contains(@class, ' topic/dl ')]">
    <fo:block xsl:use-attribute-sets="e:dl">
      <xsl:call-template name="commonattributes" />
      <xsl:apply-templates select="*[contains(@class, ' topic/dlentry ')]" />
    </fo:block>
  </xsl:template>

  <xsl:template match="*[contains(@class, ' topic/dlentry ')]">
      <fo:block>
          <xsl:apply-templates select="*[contains(@class, ' topic/dt ')]" />
          <xsl:apply-templates select="*[contains(@class, ' topic/dd ')]" />
      </fo:block>
  </xsl:template>

  <xsl:template match="*[contains(@class, ' topic/dt ')]">
    <fo:block xsl:use-attribute-sets="e:dlentry.dt__content">
      <xsl:apply-templates />
    </fo:block>
  </xsl:template>

  <xsl:template match="*[contains(@class, ' topic/dd ')]">
    <fo:block xsl:use-attribute-sets="e:dlentry.dd__content">
      <xsl:apply-templates />
    </fo:block>
  </xsl:template>
`
    const get_title_raw = `
  <xsl:template match="*[contains(@class, ' topic/topic ')]/*[contains(@class, ' topic/title ')]" mode="getTitle">
    <xsl:variable name="topic" select="ancestor-or-self::*[contains(@class, ' topic/topic ')][1]"/>
    <xsl:variable name="id" select="$topic/@id"/>
    <xsl:variable name="mapTopics" select="key('map-id', $id)"/>
    <fo:inline>
      <xsl:for-each select="$mapTopics[1]">
        <xsl:variable name="depth" select="count(ancestor-or-self::*[contains(@class, ' map/topicref')])"/>
        <xsl:choose>
          <xsl:when test="parent::opentopic:map and contains(@class, ' bookmap/bookmap ')"/>
          <xsl:when test="ancestor-or-self::*[contains(@class, ' bookmap/frontmatter ') or
                                              contains(@class, ' bookmap/backmatter ')]"/>
          <xsl:when test="ancestor-or-self::*[contains(@class, ' bookmap/appendix ')] and
                          $e:number-levels[$depth]">
            <xsl:number count="*[contains(@class, ' map/topicref ')]
                                [ancestor-or-self::*[contains(@class, ' bookmap/appendix ')]] "
                        level="multiple"
                        format="A.1.1"/>
          </xsl:when>
          <xsl:when test="$e:number-levels[$depth]">
            <xsl:number count="*[contains(@class, ' map/topicref ')]
                                [not(ancestor-or-self::*[contains(@class, ' bookmap/frontmatter ')])]"
                        level="multiple"
                        format="1.1"/>
          </xsl:when>
        </xsl:choose>
      </xsl:for-each>
    </fo:inline>
    <xsl:value-of select="' '"/>
    <xsl:apply-templates/>
  </xsl:template>
`

    const numberless_chapter_raw = `
  <xsl:template name="insertChapterFirstpageStaticContent">
    <xsl:param name="type"/>
    <fo:block>
      <xsl:attribute name="id">
        <xsl:call-template name="generate-toc-id"/>
      </xsl:attribute>
      <xsl:choose>
        <xsl:when test="$type = 'chapter'">
          <fo:block xsl:use-attribute-sets="chapterfrontmatternamecontainer">
            <xsl:call-template name="getVariable">
              <xsl:with-param name="id" select="'Chapter with number'"/>
              <xsl:with-param name="params" as="element()*">
                <number>
                  <!--fo:block xsl:use-attribute-sets="chapterfrontmatternumbercontainer">
                      <xsl:apply-templates select="key('map-id', @id)[1]" mode="topicTitleNumber"/>
                  </fo:block-->
                </number>
              </xsl:with-param>
            </xsl:call-template>
          </fo:block>
        </xsl:when>
        <xsl:when test="$type = 'appendix'">
            <fo:block xsl:use-attribute-sets="chapterfrontmatternamecontainer">
                <xsl:call-template name="getVariable">
                    <xsl:with-param name="id" select="'Appendix with number'"/>
                     <xsl:with-param name="params" as="element()*">
                        <number>
                            <!--fo:block xsl:use-attribute-sets="chapterfrontmatternumbercontainer">
                                <xsl:apply-templates select="key('map-id', @id)[1]" mode="topicTitleNumber"/>
                            </fo:block-->
                        </number>
                    </xsl:with-param>
                </xsl:call-template>
            </fo:block>
        </xsl:when>
        <xsl:when test="$type = 'appendices'">
          <fo:block xsl:use-attribute-sets="chapterfrontmatternamecontainer">
            <xsl:call-template name="getVariable">
              <xsl:with-param name="id" select="'Appendix with number'"/>
               <xsl:with-param name="params" as="element()*">
                <number>
                  <fo:block xsl:use-attribute-sets="chapterfrontmatternumbercontainer">
                    <xsl:text>&#xA0;</xsl:text>
                  </fo:block>
                </number>
              </xsl:with-param>
            </xsl:call-template>
          </fo:block>
        </xsl:when>
        <xsl:when test="$type = 'part'">
          <fo:block xsl:use-attribute-sets="chapterfrontmatternamecontainer">
            <xsl:call-template name="getVariable">
              <xsl:with-param name="id" select="'Part with number'"/>
               <xsl:with-param name="params" as="element()*">
                <number>
                  <fo:block xsl:use-attribute-sets="chapterfrontmatternumbercontainer">
                    <xsl:apply-templates select="key('map-id', @id)[1]" mode="topicTitleNumber"/>
                  </fo:block>
                </number>
              </xsl:with-param>
            </xsl:call-template>
          </fo:block>
        </xsl:when>
        <xsl:when test="$type = 'preface'">
          <fo:block xsl:use-attribute-sets="chapterfrontmatternamecontainer">
            <xsl:call-template name="getVariable">
              <xsl:with-param name="id" select="'Preface title'"/>
            </xsl:call-template>
          </fo:block>
        </xsl:when>
        <xsl:when test="$type = 'notices'">
          <fo:block xsl:use-attribute-sets="chapterfrontmatternamecontainer">
            <xsl:call-template name="getVariable">
              <xsl:with-param name="id" select="'Notices title'"/>
            </xsl:call-template>
          </fo:block>
        </xsl:when>
      </xsl:choose>
    </fo:block>
  </xsl:template>
`
    if (stylesheet === "front-matter" || !stylesheet) {
      if (this.cover_image_name || this.cover_image_metadata || this.cover_image_topic) {
        root.append(ET.Comment("cover"))
        utils.copy_xml(root, cover_raw_2)
        //copy_xml(root, cover_contents_raw)
        if (this.cover_image_name) {
          utils.copy_xml(root, cover_file_raw)
        } else if (this.cover_image_metadata) {
          utils.copy_xml(root, cover_metadata_raw)
        } else if (this.cover_image_topic) {
          utils.copy_xml(root, cover_topic_raw)
        }
      }
    }

    const table_raw = `
<xsl:template match="*[contains(@class, ' topic/table ')]/*[contains(@class, ' topic/title ')]">
  <fo:block xsl:use-attribute-sets="table.title">
    <xsl:call-template name="commonattributes"/>
    <xsl:call-template name="getVariable">
      <xsl:with-param name="id" select="'Table.title'"/>
       <xsl:with-param name="params" as="element()*">
        <number>
          <xsl:apply-templates select="." mode="table.title-number"/>
        </number>
        <title>
          <xsl:apply-templates/>
        </title>
      </xsl:with-param>
    </xsl:call-template>
  </fo:block>
</xsl:template>`

    const table_title_number_document = `
<xsl:template match="*[contains(@class, ' topic/table ')]/*[contains(@class, ' topic/title ')]" mode="table.title-number">
  <xsl:value-of select="count(key('enumerableByClass', 'topic/table')[. &lt;&lt; current()])"/>
</xsl:template>`

//    const table_title_number_topic = `
//<xsl:template match="*[contains(@class, ' topic/table ')]/*[contains(@class, ' topic/title ')]" mode="table.title-number">
//  <xsl:variable name="topicref" select="key('map-id', ancestor-or-self::*[contains(@class, ' topic/topic ')][1]/@id)"/>
//  <xsl:apply-templates select="$topicref" mode="topicTitleNumber"/>
//  <xsl:text>&#x2013;</xsl:text>
//  <xsl:value-of select="count(key('enumerableByClass', 'topic/table', ancestor::*[contains(@class, ' topic/topic ')][1])[. &lt;&lt; current()])"/>
//</xsl:template>`

    const table_title_number_chapter = `
<xsl:template match="*[contains(@class, ' topic/table ')]/*[contains(@class, ' topic/title ')]" mode="table.title-number">
  <xsl:call-template name="getChapterPrefix"/>
  <xsl:value-of select="count(key('enumerableByClass', 'topic/table', ancestor::*[contains(@class, ' topic/topic ')][last()])[. &lt;&lt; current()])"/>
</xsl:template>`

    // caption position after table
    const table_title_raw = `
<xsl:template match="*[contains(@class, ' topic/table ')]">
  <xsl:variable name="scale">
    <xsl:call-template name="getTableScale"/>
  </xsl:variable>
  <fo:block xsl:use-attribute-sets="table">
    <xsl:call-template name="commonattributes"/>
    <xsl:if test="not(@id)">
      <xsl:attribute name="id">
        <xsl:call-template name="get-id"/>
      </xsl:attribute>
    </xsl:if>
    <xsl:if test="not($scale = '')">
      <xsl:attribute name="font-size" select="concat($scale, '%')"/>
    </xsl:if>
    <xsl:apply-templates select="*[contains(@class, ' topic/tgroup ')]"/>
    <xsl:apply-templates select="*[contains(@class, ' topic/title ') or contains(@class, ' topic/desc ')]"/>
  </fo:block>
</xsl:template>`

    if (stylesheet === "tables" || !stylesheet) {
      root.append(ET.Comment("table"))
      // caption numbering
      if (this.ot_version.compareTo(new Version("2.3")) < 0) {
        utils.copy_xml(root, table_raw)
      }
      const tableCaptionNumber = _.get(this.style, "table.caption-number",  "document")
      switch (tableCaptionNumber) {
        //case "topic":
        //  utils.copy_xml(root, table_title_number_topic)
        //  break
        case "chapter":
          utils.copy_xml(root, table_title_number_chapter)
          break
        case "document":
          utils.copy_xml(root, table_title_number_document)
          break
      }
      // caption position
      if (_.has(this.style, "table") && _.has(this.style["table"], "caption-position") && this.style["table"]["caption-position"] === "after") {
        utils.copy_xml(root, table_title_raw)
      }
      if (this.table_continued) {
        utils.copy_xml(root, table_continued_raw)
      } else {
        utils.copy_xml(root, table_footer_raw)
      }
      if (_.has(this.style["dl"], "dl-type")) {
        if (this.style["dl"]["dl-type"] === "list") {
          root.append(ET.Comment("dl"))
          utils.copy_xml(root, dl_list_raw)
        } else if (this.style["dl"]["dl-type"] === "html") {
          root.append(ET.Comment("dl"))
          utils.copy_xml(root, dl_html_raw)
        }
      }
    }

    const tocRaw = `
<xsl:template match="*[contains(@class, ' bookmap/appendix ')]" mode="tocText">
  <xsl:param name="tocItemContent"/>
  <xsl:param name="currentNode"/>
  <xsl:for-each select="$currentNode">
    <fo:block xsl:use-attribute-sets="__toc__appendix__content">
      <xsl:copy-of select="$tocItemContent"/>
    </fo:block>
  </xsl:for-each>
</xsl:template>

<xsl:template match="*[contains(@class, ' bookmap/part ')]" mode="tocText">
  <xsl:param name="tocItemContent"/>
  <xsl:param name="currentNode"/>
  <xsl:for-each select="$currentNode">
    <fo:block xsl:use-attribute-sets="__toc__part__content">
      <xsl:copy-of select="$tocItemContent"/>
    </fo:block>
  </xsl:for-each>
</xsl:template>

<xsl:template match="*[contains(@class, ' bookmap/preface ')]" mode="tocText">
  <xsl:param name="tocItemContent"/>
  <xsl:param name="currentNode"/>
  <xsl:for-each select="$currentNode">
    <fo:block xsl:use-attribute-sets="__toc__preface__content">
      <xsl:copy-of select="$tocItemContent"/>
    </fo:block>
  </xsl:for-each>
</xsl:template>

<xsl:template match="*[contains(@class, ' bookmap/notices ')]" mode="tocText">
  <xsl:param name="tocItemContent"/>
  <xsl:param name="currentNode"/>
  <xsl:for-each select="$currentNode">
    <fo:block xsl:use-attribute-sets="__toc__notices__content">
      <xsl:copy-of select="$tocItemContent"/>
    </fo:block>
  </xsl:for-each>
</xsl:template>

<xsl:template match="node()" mode="tocText" priority="-10">
  <xsl:param name="tocItemContent"/>
  <xsl:param name="currentNode"/>
  <xsl:for-each select="$currentNode">
    <xsl:variable name="level" select="count(ancestor-or-self::*[contains(@class, ' topic/topic ')])"/>
    <xsl:choose>
      <xsl:when test="$level eq 1">
        <fo:block xsl:use-attribute-sets="__toc__topic__content">
          <xsl:copy-of select="$tocItemContent"/>
        </fo:block>
      </xsl:when>
      <xsl:when test="$level eq 2">
        <fo:block xsl:use-attribute-sets="__toc__topic__content_2">
          <xsl:copy-of select="$tocItemContent"/>
        </fo:block>
      </xsl:when>
      <xsl:when test="$level eq 3">
        <fo:block xsl:use-attribute-sets="__toc__topic__content_3">
          <xsl:copy-of select="$tocItemContent"/>
        </fo:block>
      </xsl:when>
      <xsl:when test="$level eq 4">
        <fo:block xsl:use-attribute-sets="__toc__topic__content_4">
          <xsl:copy-of select="$tocItemContent"/>
        </fo:block>
      </xsl:when>
    </xsl:choose>
  </xsl:for-each>
</xsl:template>
`

    if (stylesheet === 'toc' || !stylesheet) {
      root.append(ET.Comment('toc'))
      utils.copy_xml(root, tocRaw)

      if (_.has(this.style, 'toc_1.prefix') && !this.style.toc_1.prefix) {
        ET.SubElement(root, xsl('template'), { match: 'node()', mode: 'tocPrefix' })
      }
    }

    const note_raw = `
  <xsl:template match="*[contains(@class,' topic/note ')]">
    <fo:table xsl:use-attribute-sets="notetable">
      <fo:table-column xsl:use-attribute-sets="notetextcolumn"/>
      <fo:table-body>
        <fo:table-row>
          <fo:table-cell xsl:use-attribute-sets="notetextentry">
            <xsl:apply-templates select="." mode="placeNoteContent"/>
          </fo:table-cell>
        </fo:table-row>
      </fo:table-body>
    </fo:table>
  </xsl:template>
`
    const chapter_page_number_raw = `
<xsl:template name="startPageNumbering">
  <xsl:variable name="topicType" as="xs:string">
    <xsl:call-template name="determineTopicType"/>
  </xsl:variable>
  <xsl:variable name="topicref" select="key('map-id', ancestor-or-self::*[contains(@class, ' topic/topic ')][1]/@id)"/>
  <xsl:for-each select="$topicref[1]">
    <xsl:choose>
      <xsl:when test="$topicType = 'topicChapter'">
        <xsl:attribute name="initial-page-number">1</xsl:attribute>
        <fo:folio-prefix>
          <xsl:number format="1" count="*[contains(@class, ' bookmap/chapter ')]"/>
          <xsl:text>&#x2013;</xsl:text>
        </fo:folio-prefix>
      </xsl:when>
      <xsl:when test="$topicType = ('topicAppendix', 'topicAppendices')">
        <xsl:attribute name="initial-page-number">1</xsl:attribute>
        <fo:folio-prefix>
          <xsl:number format="A" count="*[contains(@class, ' bookmap/appendix ')]"/>
          <xsl:text>&#x2013;</xsl:text>
        </fo:folio-prefix>
      </xsl:when>
    </xsl:choose>
  </xsl:for-each>
  <!--xsl:comment>topicType: <xsl:value-of select="$topicType"/></xsl:comment-->
</xsl:template>
`
    const fig_raw = `
<xsl:template match="*[contains(@class,' topic/fig ')]">
  <fo:block xsl:use-attribute-sets="fig">
    <xsl:call-template name="commonattributes"/>
    <xsl:if test="not(@id)">
      <xsl:attribute name="id">
        <xsl:call-template name="get-id"/>
      </xsl:attribute>
    </xsl:if>
    <xsl:apply-templates/>
  </fo:block>
</xsl:template>
`

    const fig_title_raw = `
<xsl:template match="*[contains(@class,' topic/fig ')]/*[contains(@class,' topic/title ')]">
  <fo:block xsl:use-attribute-sets="fig.title">
    <xsl:call-template name="commonattributes"/>
    <xsl:call-template name="getVariable">
      <xsl:with-param name="id" select="'Figure.title'"/>
       <xsl:with-param name="params" as="element()*">
        <number>
          <xsl:apply-templates select="." mode="fig.title-number"/>
        </number>
        <title>
          <xsl:apply-templates/>
        </title>
      </xsl:with-param>
    </xsl:call-template>
  </fo:block>
</xsl:template>`

    const fig_title_number_document = `
<xsl:template match="*[contains(@class, ' topic/fig ')]/*[contains(@class, ' topic/title ')]" mode="fig.title-number">
  <xsl:value-of select="count(key('enumerableByClass', 'topic/fig')[. &lt;&lt; current()])"/>
</xsl:template>`

//    const fig_title_number_topic = `
//<xsl:template match="*[contains(@class, ' topic/fig ')]/*[contains(@class, ' topic/title ')]" mode="fig.title-number">
//  <xsl:variable name="topicref" select="key('map-id', ancestor-or-self::*[contains(@class, ' topic/topic ')][1]/@id)"/>
//  <xsl:apply-templates select="$topicref" mode="topicTitleNumber"/>
//  <xsl:text>&#x2013;</xsl:text>
//  <xsl:value-of select="count(key('enumerableByClass', 'topic/fig', ancestor::*[contains(@class, ' topic/topic ')][1])[. &lt;&lt; current()])"/>
//</xsl:template>`

    const fig_title_number_chapter = `
<xsl:template match="*[contains(@class, ' topic/fig ')]/*[contains(@class, ' topic/title ')]" mode="fig.title-number">
  <xsl:call-template name="getChapterPrefix"/>
  <xsl:value-of select="count(key('enumerableByClass', 'topic/fig', ancestor::*[contains(@class, ' topic/topic ')][last()])[. &lt;&lt; current()])"/>
</xsl:template>`

    const commons_raw = `
<xsl:template name="getChapterPrefix">
  <xsl:variable name="topicref" select="key('map-id', ancestor-or-self::*[contains(@class, ' topic/topic ')][1]/@id)" as="element()*"/>
  <xsl:variable name="chapter" select="$topicref/ancestor-or-self::*[contains(@class, ' map/topicref ')][parent::opentopic:map]" as="element()*"/>
  <xsl:for-each select="$chapter[1]">
    <xsl:variable name="topicType" as="xs:string">
      <xsl:apply-templates select="." mode="determineTopicType"/>
    </xsl:variable>
    <xsl:choose>
      <xsl:when test="$topicType = 'topicChapter'">
        <xsl:number format="1" count="*[contains(@class, ' bookmap/chapter ')]"/>
        <xsl:text>&#x2013;</xsl:text>
      </xsl:when>
      <xsl:when test="$topicType = ('topicAppendix', 'topicAppendices')">
        <xsl:number format="A" count="*[contains(@class, ' bookmap/appendix ')]"/>
        <xsl:text>&#x2013;</xsl:text>
      </xsl:when>
    </xsl:choose>
  </xsl:for-each>
</xsl:template>`

    if (stylesheet === "commons" || !stylesheet) {
      utils.copy_xml(root, commons_raw)
      root.append(ET.Comment("title numbering"))
      const number_levels = _(['topic', 'topic_topic', 'topic_topic_topic', 'topic_topic_topic_topic'])
        .map((s) => {
          return _.has(this.style, s) && _.has(this.style[s], "title-numbering") && this.style[s]["title-numbering"] === true
        })
        .value()
      ET.SubElement(root, xsl("variable"), {
        name: "e:number-levels",
        select: ("(" + _(number_levels).map((l) => {
          return l.toString().toLowerCase() + "()"
        }).join(", ") + ")")
      })
      utils.copy_xml(root, get_title_raw)
      if (_.has(this.style["topic"], "title-numbering") && this.style["topic"]["title-numbering"] !== true) {
        utils.copy_xml(root, numberless_chapter_raw)
      }
      if (!(_.has(this.style["note"], "icon") && this.style["note"]["icon"] === "icon")) {
        root.append(ET.Comment("note"))
        utils.copy_xml(root, note_raw)
      }
      if (this.page_number) {
        if (this.page_number === "chapter-page") {
          utils.copy_xml(root, chapter_page_number_raw)
        }
      }
      // caption numbering
      if (this.ot_version.compareTo(new Version("2.3")) < 0) {
        utils.copy_xml(root, fig_title_raw)
      }
      const figCaptionNumber = _.get(this.style, "fig.caption-number",  "document")
      switch (figCaptionNumber) {
        //case "topic":
        //  utils.copy_xml(root, fig_title_number_topic)
        //  break
        case "chapter":
          utils.copy_xml(root, fig_title_number_chapter)
          break
        case "document":
          utils.copy_xml(root, fig_title_number_document)
          break
      }

      //if (_.has(this.style, 'fig') && _.has(this.style["fig"], "caption-position") && this.style["fig"]["caption-position"] === "before") {
      if (_.has(this.style, 'fig.caption-position') && this.style["fig"]["caption-position"] === "before") {
        utils.copy_xml(root, fig_raw)
      }
      if (this.cover_image_topic) {
        ET.SubElement(root, xsl('template'), {
          match: `*[contains(@class, ' topic/topic ')][@outputclass = '${this.cover_image_topic}']`,
          priority: "1000"
        })
      }
      // tm
      if (_.has(this.style['tm'], 'symbol-scope') && this.style['tm']['symbol-scope'] !== 'always') {
        const tm_chapter_raw = `
          <xsl:function name="e:tm-value" as="xs:string">
            <xsl:param name="node" as="element()"/>
            <xsl:value-of select="normalize-space($node)"/>
          </xsl:function>

          <xsl:key name="e:first-tm" match="*[contains(@class, ' topic/tm ')]" use="e:tm-value(.)"/>

          <xsl:template match="*[contains(@class, ' topic/tm ')]">
            <xsl:variable name="tmText" as="xs:string" select="e:tm-value(.)"/>
            <xsl:variable name="tm-scope" as="element()" select="(ancestor-or-self::*[contains(@class, ' topic/topic ')])[1]"/>
            <xsl:variable name="tms" as="element()+" select="key('e:first-tm', $tmText, $tm-scope)"/>
            <xsl:variable name="isFirst" as="xs:boolean" select="$tms[1] is ."/>
            <xsl:choose>
              <xsl:when test="$isFirst">
                <xsl:next-match/>
              </xsl:when>
              <xsl:otherwise>
                <fo:inline xsl:use-attribute-sets="tm">
                  <xsl:apply-templates/>
                </fo:inline>
              </xsl:otherwise>
            </xsl:choose>
          </xsl:template>
          `
        const tm_never_raw = `
          <xsl:template match="*[contains(@class, ' topic/tm ')]">
            <fo:inline xsl:use-attribute-sets="tm">
              <xsl:apply-templates/>
            </fo:inline>
          </xsl:template>
          `
        root.append(ET.Comment("tm"))
        const symbolScope = this.style['tm']['symbol-scope']
        if (symbolScope === 'chapter') {
          utils.copy_xml(root, tm_chapter_raw)
        } else if (symbolScope === 'never') {
          utils.copy_xml(root, tm_never_raw)
        } else if (symbolScope === 'always') {
          // NOOP
        }
      }
    }

    const link_raw = `
  <xsl:template match="*[contains(@class,' topic/xref ')]" name="topic.xref">
    <fo:inline>
      <xsl:call-template name="commonattributes"/>
    </fo:inline>
    <xsl:variable name="destination" select="opentopic-func:getDestinationId(@href)"/>
    <xsl:variable name="element" select="key('key_anchor',$destination)[1]"/>
    <xsl:variable name="referenceTitle">
      <xsl:apply-templates select="." mode="insertReferenceTitle">
        <xsl:with-param name="href" select="@href"/>
        <xsl:with-param name="titlePrefix" select="''"/>
        <xsl:with-param name="destination" select="$destination"/>
        <xsl:with-param name="element" select="$element"/>
      </xsl:apply-templates>
    </xsl:variable>
    <fo:basic-link xsl:use-attribute-sets="xref">
      <xsl:call-template name="buildBasicLinkDestination">
        <xsl:with-param name="scope" select="@scope"/>
        <xsl:with-param name="format" select="@format"/>
        <xsl:with-param name="href" select="@href"/>
      </xsl:call-template>
      <xsl:choose>
        <xsl:when test="not(@scope = 'external' or @format = 'html') and not($referenceTitle = '')">
          <xsl:copy-of select="$referenceTitle"/>
        </xsl:when>
        <xsl:when test="not(@scope = 'external' or @format = 'html')">
          <xsl:call-template name="insertPageNumberCitation">
            <xsl:with-param name="isTitleEmpty" select=\"true()\"/>
            <xsl:with-param name="destination" select="$destination"/>
            <xsl:with-param name="element" select="$element"/>
          </xsl:call-template>
        </xsl:when>
        <xsl:otherwise>
          <xsl:choose>
            <xsl:when test="exists(*[not(contains(@class,' topic/desc '))] | text()) and
                            exists(processing-instruction('ditaot')[. = 'usertext'])">
              <xsl:apply-templates select="*[not(contains(@class,' topic/desc '))] | text()"/>
            </xsl:when>
            <xsl:otherwise>
              <xsl:value-of select="e:format-link-url(@href)"/>
            </xsl:otherwise>
          </xsl:choose>
        </xsl:otherwise>
      </xsl:choose>
    </fo:basic-link>
    <xsl:if test="not(@scope = 'external' or @format = 'html') and not($referenceTitle = '') and not($element[contains(@class, ' topic/fn ')])">
      <xsl:if test="not(processing-instruction('ditaot')[. = 'usertext'])">
        <xsl:call-template name="insertPageNumberCitation">
          <xsl:with-param name="destination" select="$destination"/>
          <xsl:with-param name="element" select="$element"/>
        </xsl:call-template>
      </xsl:if>
    </xsl:if>
    <xsl:if test="@scope = 'external' and exists(processing-instruction('ditaot')[. = 'usertext'])">
      <xsl:text> at </xsl:text>
      <xsl:value-of select="e:format-link-url(@href)"/>
    </xsl:if>
  </xsl:template>

  <xsl:function name="e:format-link-url">
    <xsl:param name="href"/>
    <xsl:variable name="h" select="if (starts-with($href, 'http://')) then substring($href, 8) else $href"/>
    <xsl:value-of select="if (contains($h, '/') and substring-after($h, '/') = '') then substring($h, 0, string-length($h)) else $h"/>
  </xsl:function>
`

    if (stylesheet === "links" || !stylesheet) {
      if (_.has(this.style["link"], "link-url") && this.style["link"]["link-url"] === true) {
        root.append(ET.Comment("link"))
        utils.copy_xml(root, link_raw)
      }
    }

    const list_raw = `
<xsl:template match="*[contains(@class, ' topic/ul ')]/*[contains(@class, ' topic/li ')]">
    <xsl:variable name="depth" select="count(ancestor::*[contains(@class, ' topic/ul ')])"/>
    <fo:list-item xsl:use-attribute-sets="ul.li">
        <fo:list-item-label xsl:use-attribute-sets="ul.li__label">
            <fo:block xsl:use-attribute-sets="ul.li__label__content">
                <fo:inline>
                    <xsl:call-template name="commonattributes"/>
                </fo:inline>
                <xsl:call-template name="getVariable">
                    <xsl:with-param name="id" select="concat('Unordered List bullet ', $depth)"/>
                </xsl:call-template>
            </fo:block>
        </fo:list-item-label>
        <fo:list-item-body xsl:use-attribute-sets="ul.li__body">
            <fo:block xsl:use-attribute-sets="ul.li__content">
                <xsl:apply-templates/>
            </fo:block>
        </fo:list-item-body>
    </fo:list-item>
</xsl:template>

<xsl:template match="*[contains(@class, ' topic/ol ')]/*[contains(@class, ' topic/li ')]">
    <xsl:variable name="depth" select="count(ancestor::*[contains(@class, ' topic/ol ')])"/>
    <xsl:variable name="format">
        <xsl:call-template name="getVariable">
            <xsl:with-param name="id" select="concat('Ordered List Format ', $depth)"/>
        </xsl:call-template>
    </xsl:variable>
    <fo:list-item xsl:use-attribute-sets="ol.li">
        <fo:list-item-label xsl:use-attribute-sets="ol.li__label">
            <fo:block xsl:use-attribute-sets="ol.li__label__content">
                <fo:inline>
                    <xsl:call-template name="commonattributes"/>
                </fo:inline>
                <xsl:call-template name="getVariable">
                    <xsl:with-param name="id" select="concat('Ordered List Number ', $depth)"/>
                     <xsl:with-param name="params" as="element()*">
                        <number>
                            <xsl:number format="{$format}"/>
                        </number>
                    </xsl:with-param>
                </xsl:call-template>
            </fo:block>
        </fo:list-item-label>
        <fo:list-item-body xsl:use-attribute-sets="ol.li__body">
            <fo:block xsl:use-attribute-sets="ol.li__content">
                <xsl:apply-templates/>
            </fo:block>
        </fo:list-item-body>
    </fo:list-item>
</xsl:template>
`

    if (stylesheet === "lists" || !stylesheet) {
      if (_.has(this.style, 'ol') || _.has(this.style, 'ul')) {
        root.append(ET.Comment("list"))
        utils.copy_xml(root, list_raw)
      }
    }

    if (stylesheet === 'static-content' || !stylesheet) {
      require('./lib/staticContent').xsl(root, this.options)
    }

    if (stylesheet === 'layout-masters' || !stylesheet) {
      require('./lib/layoutMasters').xsl(root, this.options)
    }

    if (!stylesheet) {
      if (!this.override_shell && this.toc_maximum_level) {
        root.append(ET.Comment("TOC"))
        ET.SubElement(root, xsl('variable'), {name: "tocMaximumLevel"}).text = this.toc_maximum_level.toString()
      }
    }

//        ditagen.generator.indent(root)
    //ditagen.generator.set_prefixes(root, get_ns())

    const d = new ET.ElementTree(root)
    return d.write()
  }

  /**
   * Generate attribute set.
   */
  attribute_set(root, style, attribute_set, properties, uses) {
    properties = properties || this.properties
    const attrs = {name: attribute_set}
    if (uses !== undefined) {
      attrs['use-attribute-sets'] = uses
    }
    const attrSet = ET.SubElement(root, xsl('attribute-set'), attrs)
    _.forEach(this.style[style], (v, p) => {
      if (_.includes(properties, p)) {
        ET.SubElement(attrSet, xsl('attribute'), {name: p}).text = value(p, v)
      }
    })
  }

  /**
   * Generate plugin custom XSLT file.
   */
  generate_custom_attr(stylesheet) {
    const root = ET.Element(xsl('stylesheet'), {
      "xmlns:xs": "http://www.w3.org/2001/XMLSchema",
      "xmlns:e": this.plugin_name,
      "xmlns:ditaarch": "http://dita.oasis-open.org/architecture/2005/",
      "xmlns:opentopic": "http://www.idiominc.com/opentopic",
      "xmlns:opentopic-func": "http://www.idiominc.com/opentopic/exsl/function",
      "version": "2.0", "exclude-result-prefixes": "xs ditaarch opentopic e"
    })
//        #if (stylesheet === "front-matter-attr" or not stylesheet) {
//            #if (this.cover_image_name) {
//            #    ET.SubElement(root, xsl('variable'), name="e:cover-image-path", select="concat($artworkPrefix, 'Customization/OpenTopic/common/artwork/%s'" % cover_image_name)
//            #el
//            #if (this.cover_image_metadata) {
//                #cover_image_path = ET.SubElement(root, xsl('variable'), name="e:cover-image-path", select="($map//*[contains(@class, ' topic/data ')][@name = '%s'])[1]/@href" % cover_image_metadata)
//            #    cover_image_path = ET.SubElement(root, xsl('variable'), name="e:cover-image")
//            #    ET.SubElement(cover_image_path, xsl('apply-templates'), select="($map//*[contains(@class, ' topic/data ')][@name = '%s']/*[contains(@class, ' topic/image ')])[1]" % cover_image_metadata, mode="e:cover-image")
//
    if (stylesheet === "commons-attr" || !stylesheet) {
      // force page count
      if (this.force_page_count) {
        const page_count_attr = ET.SubElement(root, xsl('attribute-set'), {name: "__force__page__count"})
        ET.SubElement(page_count_attr, xsl('attribute'), {name: "force-page-count"}).text = this.force_page_count
      }
      // font family
      this.attribute_set(root, "body", "__fo__root", ["font-family", "color", "text-align"])
      // titles
      _.forEach(this.style, (e, k) => {
        if (k.startsWith("topic") || k === "section") {
          const title_attr = ET.SubElement(root, xsl('attribute-set'), {name: k.replace(/_/g, '.') + ".title"})
          _.forEach(e, (v, p) => {
            if (_.includes(this.properties, p)) {
              ET.SubElement(title_attr, xsl('attribute'), {name: p}).text = v
            }
          })
        }
      })
      this.attribute_set(root, "example_title", "example.title")
      // link
      const link_attr_sets = ["common.link"]
      link_attr_sets.forEach((n) => {
        this.attribute_set(root, "link", n)
      })
      // tm
      this.attribute_set(root, 'tm', 'tm')
      // normal block
      const spacing_attr_sets = ["common.block"]
      spacing_attr_sets.forEach((n) => {
        this.attribute_set(root, "body", n, _.difference(this.properties, ["start-indent"]))
      })
      // example
      this.attribute_set(root, "example", "example")
      // note
      this.attribute_set(root, "note", "note__table")
      if (!(_.has(this.style["note"], "icon") && this.style["note"]["icon"] === "icon")) {
        const note_text = ET.SubElement(root, xsl('attribute-set'), {name: "notetextcolumn"})
        ET.SubElement(note_text, xsl('attribute'), {name: "column-number"}).text = "1"
      }
      // pre
      this.attribute_set(root, "pre", "pre")

      // fig
      this.attribute_set(root, "fig", "fig")
    }
    if (stylesheet === "tables-attr" || !stylesheet) {
      // dl
      if (_.has(this.style["dl"], "dl-type")) {
        this.attribute_set(root, "dl", "e:dl")
        const dt_attr = ET.SubElement(root, xsl('attribute-set'), {name: 'e:dlentry.dt__content'})
        ET.SubElement(dt_attr, xsl('attribute'), {name: 'font-weight'}).text = "bold"
        ET.SubElement(dt_attr, xsl('attribute'), {name: 'keep-with-next'}).text = "always"
        const dd_attr = ET.SubElement(root, xsl('attribute-set'), {name: 'e:dlentry.dd__content'})
        if (this.style["dl"]["dl-type"] === "html") {
          ET.SubElement(dd_attr, xsl('attribute'), {name: 'start-indent'}).text = "from-parent(start-indent) + 5mm"
        }
      }
      // table continued
      if (this.table_continued) {
        const table_continued_attr = ET.SubElement(root, xsl('attribute-set'), {"name": "e:tfoot.row.entry.continued"})
        ET.SubElement(table_continued_attr, xsl('attribute'), {name: 'border-right-style'}).text = "hidden"
        ET.SubElement(table_continued_attr, xsl('attribute'), {name: 'border-left-style'}).text = "hidden"
        ET.SubElement(table_continued_attr, xsl('attribute'), {name: 'text-align'}).text = "end"
        ET.SubElement(table_continued_attr, xsl('attribute'), {name: 'font-style'}).text = "italic"
      }
      // table
      this.attribute_set(root, "table", "table.tgroup")
      const thead_row_entry_attr = ET.SubElement(root, xsl('attribute-set'), {name: "thead.row.entry"})
      ET.SubElement(thead_row_entry_attr, xsl('attribute'), {name: "background-color"}).text = "inherit"
    }
    if (stylesheet === "layout-masters-attr" || !stylesheet) {
      // page column count
      if (this.body_column_count) {
        ["region-body.odd", "region-body.even"].forEach((a) => {
          const region_body_attr = ET.SubElement(root, xsl('attribute-set'), {name: a})
          ET.SubElement(region_body_attr, xsl('attribute'), {name: "column-count"}).text = this.body_column_count
          if (this.column_gap) {
            ET.SubElement(region_body_attr, xsl('attribute'), {name: "column-gap"}).text = this.column_gap
          }
        })
        let atts = ["region-bodyfrontmatter.odd", "region-bodyfrontmatter.even"]
        atts.forEach((a) => {
          const region_body_attr = ET.SubElement(root, xsl('attribute-set'), {name: a})
          ET.SubElement(region_body_attr, xsl('attribute'), {name: "column-count"}).text = "1"
        })
        if (this.index_column_count) {
          ["region-bodyindex.odd", "region-bodyindex.even"].forEach((a) => {
            const region_body_attr = ET.SubElement(root, xsl('attribute-set'), {name: a})
            ET.SubElement(region_body_attr, xsl('attribute'), {name: "column-count"}).text = this.index_column_count
          })
        }
      }
    }

    if (stylesheet === 'toc-attr' || !stylesheet) {
      //<xsl:variable name="toc.toc-indent" select="'30pt'"/>
      const tocIndentRaw = `
      <xsl:attribute-set name="__toc__indent">
        <xsl:attribute name="start-indent">
          <xsl:variable name="level" select="count(ancestor-or-self::*[contains(@class, ' topic/topic ')])"/>
          <xsl:choose>
            <xsl:when test="$level eq 1">
              <xsl:value-of select="concat('${this.style['toc_1']['start-indent']} + ', $toc.text-indent)"/>
            </xsl:when>
            <xsl:when test="$level eq 2">
              <xsl:value-of select="concat('${this.style['toc_2']['start-indent']} + ', $toc.text-indent)"/>
            </xsl:when>
            <xsl:when test="$level eq 3">
              <xsl:value-of select="concat('${this.style['toc_3']['start-indent']} + ', $toc.text-indent)"/>
            </xsl:when>
            <xsl:when test="$level eq 4">
              <xsl:value-of select="concat('${this.style['toc_4']['start-indent']} + ', $toc.text-indent)"/>
            </xsl:when>
          </xsl:choose>
        </xsl:attribute>
      </xsl:attribute-set>

      <xsl:attribute-set name="__toc__indent__booklist">
        <xsl:attribute name="start-indent">
          <xsl:value-of select="concat('${this.style['toc_1']['start-indent']} + ', $toc.text-indent)"/>
        </xsl:attribute>
      </xsl:attribute-set>`

      utils.copy_xml(root, tocIndentRaw)

      //const indent = ET.SubElement(root, xsl('attribute-set'), {name: '__toc__indent'})
      //const indentAttr = ET.SubElement(indent, xsl('attribute'), {name: 'start-indent'})
      //
      //_.forEach(this.style[style], (v, p) => {
      //  if (_.includes(properties, p)) {
      //    ET.SubElement(attrs, xsl('attribute'), {name: p}).text = value(p, v)
      //  }
      //})

      this.attribute_set(root, 'toc_1', '__toc__topic__content', _.difference(this.properties, ["start-indent"]))
      //this.attribute_set(root, 'toc_1', '__toc__topic__content_1', _.difference(this.properties, ["start-indent"]), '__toc__topic__content')
      this.attribute_set(root, 'toc_2', '__toc__topic__content_2', _.difference(this.properties, ["start-indent"]), '__toc__topic__content')
      this.attribute_set(root, 'toc_3', '__toc__topic__content_3', _.difference(this.properties, ["start-indent"]), '__toc__topic__content')
      this.attribute_set(root, 'toc_4', '__toc__topic__content_4', _.difference(this.properties, ["start-indent"]), '__toc__topic__content')

      this.attribute_set(root, 'toc_1', '__toc__chapter__content', _.difference(this.properties, ["start-indent"]))
      this.attribute_set(root, 'toc_1', '__toc__appendix__content', _.difference(this.properties, ["start-indent"]))
      this.attribute_set(root, 'toc_1', '__toc__part__content', _.difference(this.properties, ["start-indent"]))
      this.attribute_set(root, 'toc_1', '__toc__preface__content', _.difference(this.properties, ["start-indent"]))
      this.attribute_set(root, 'toc_1', '__toc__notices__content', _.difference(this.properties, ["start-indent"]))
      this.attribute_set(root, 'toc_1', '__toc__topic__content__booklist', _.difference(this.properties, ["start-indent"]))
    }

    if (stylesheet === "basic-settings" || !stylesheet) {
      ET.SubElement(root, "xsl:param", {name: "pdfFormatter", select: `'${this.formatter}'`})
      ET.SubElement(root, "xsl:param", {name: "tocMaximumLevel", select: this.toc_maximum_level})
      // page size
      ET.SubElement(root, xsl('variable'), {name: "page-width"}).text = this.page.width
      ET.SubElement(root, xsl('variable'), {name: "page-height"}).text = this.page.height
      // mirror pages
      if (this.mirror_page_margins) {
        ET.SubElement(root, xsl('variable'), {name: "mirror-page-margins", select: "true()"})
      }
      // page margins
      ['top', 'outside', 'bottom', 'inside'].forEach((k) => {
        const v = this.page[k]
        if (v) {
          ET.SubElement(root, xsl('variable'), {name: `page-margin-${k}`}).text = v
        }
      })
      // font size
      if (_.has(this.style["body"], "font-size")) {
        ET.SubElement(root, xsl('variable'), {name: "default-font-size"}).text = this.style["body"]["font-size"]
      }
      // line height
      if (_.has(this.style["body"], "line-height")) {
        ET.SubElement(root, xsl('variable'), {name: "default-line-height"}).text = this.style["body"]["line-height"]
      }
      // body indent
      if (_.has(this.style["body"], "start-indent")) {
        ET.SubElement(root, xsl('variable'), {name: "side-col-width"}).text = this.style["body"]["start-indent"]
      }
    }

    const list_raw = `
  <xsl:attribute-set name="ol">
    <xsl:attribute name="provisional-distance-between-starts">
      <xsl:call-template name="e:list-label-length"/>
      <xsl:text>em * 0.7</xsl:text>
    </xsl:attribute>
  </xsl:attribute-set>

  <xsl:template name="e:list-label-length">
    <xsl:variable name="labels" as="xs:integer*">
      <xsl:variable name="depth" select="count(ancestor-or-self::*[contains(@class, ' topic/ol ')])" />
      <xsl:variable name="format" as="xs:string">
        <xsl:call-template name="getVariable">
          <xsl:with-param name="id" select="concat('Ordered List Format ', $depth)" />
        </xsl:call-template>
      </xsl:variable>
      <xsl:for-each select="*[contains(@class, ' topic/li ')]">
        <xsl:variable name="s">
          <xsl:call-template name="getVariable">
            <xsl:with-param name="id" select="concat('Ordered List Number ', $depth)" />
             <xsl:with-param name="params" as="element()*">
              <number>
                <xsl:number format="{$format}" />
              </number>
            </xsl:with-param>
          </xsl:call-template>
        </xsl:variable>
        <xsl:sequence select="string-length(normalize-space($s))"/>
      </xsl:for-each>
    </xsl:variable>
    <xsl:sequence select="max($labels)"/>
  </xsl:template>
`

    if (stylesheet === "lists-attr" || !stylesheet) {
      root.append(ET.Comment("list"))
      utils.copy_xml(root, list_raw)
    }
    if (stylesheet === "pr-domain-attr" || !stylesheet) {
      // codeblock
      const pre_attr = ET.SubElement(root, xsl('attribute-set'), {name: "codeblock"})
      _.forEach(this.style["codeblock"], (v, k) => {
        ET.SubElement(pre_attr, xsl('attribute'), {name: k}).text = value(k, v)
      })
    }

    if (stylesheet === 'static-content-attr' || !stylesheet) {
      require('./lib/staticContent').attr(root, this.options)
    }

//        ditagen.generator.indent(root)
//        ditagen.generator.set_prefixes(root, get_ns())
    const d = new ET.ElementTree(root)
    return d.write()
  }

  generate_shell() {
    const root = ET.Element(xsl('stylesheet'), {
      "xmlns:xs": "http://www.w3.org/2001/XMLSchema",
      "xmlns:e": this.plugin_name,
      "xmlns:ditaarch": "http://dita.oasis-open.org/architecture/2005/",
      "xmlns:opentopic": "http://www.idiominc.com/opentopic",
      "xmlns:opentopic-func": "http://www.idiominc.com/opentopic/exsl/function",
      "version": "2.0",
      "exclude-result-prefixes": "ditaarch opentopic e",
      "e:version": this.ot_version.toString()
    })

    root.append(ET.Comment("base imports"))
    const fs = []
    fs.push("plugin:org.dita.base:xsl/common/dita-utilities.xsl")
    fs.push("plugin:org.dita.base:xsl/common/dita-textonly.xsl")
    fs.push("plugin:org.dita.base:xsl/common/related-links.xsl")

    fs.push("plugin:org.dita.pdf2:xsl/common/attr-set-reflection.xsl")
    fs.push("plugin:org.dita.pdf2:xsl/common/vars.xsl")

    fs.push("plugin:org.dita.pdf2:cfg/fo/attrs/basic-settings.xsl")
    if (this.override_shell) {
      fs.push(`plugin:${this.plugin_name}:cfg/fo/attrs/basic-settings.xsl`)
    }
    fs.push("plugin:org.dita.pdf2:cfg/fo/attrs/layout-masters-attr.xsl")
    if (this.override_shell) {
      fs.push(`plugin:${this.plugin_name}:cfg/fo/attrs/layout-masters-attr.xsl`)
    }
    fs.push("plugin:org.dita.pdf2:cfg/fo/layout-masters.xsl")
    if (this.override_shell) {
      fs.push(`plugin:${this.plugin_name}:cfg/fo/layout-masters.xsl`)
    }
    fs.push("plugin:org.dita.pdf2:cfg/fo/attrs/links-attr.xsl")
    fs.push("plugin:org.dita.pdf2:xsl/fo/links.xsl")
    if (this.override_shell) {
      fs.push(`plugin:${this.plugin_name}:xsl/fo/links.xsl`)
    }
    fs.push("plugin:org.dita.pdf2:cfg/fo/attrs/lists-attr.xsl")
    if (this.override_shell) {
      fs.push(`plugin:${this.plugin_name}:cfg/fo/attrs/lists-attr.xsl`)
    }
    fs.push("plugin:org.dita.pdf2:xsl/fo/lists.xsl")
    if (this.override_shell) {
      fs.push(`plugin:${this.plugin_name}:xsl/fo/lists.xsl`)
    }
    fs.push("plugin:org.dita.pdf2:cfg/fo/attrs/tables-attr.xsl")
    if (this.override_shell) {
      fs.push(`plugin:${this.plugin_name}:cfg/fo/attrs/tables-attr.xsl`)
    }
    fs.push("plugin:org.dita.pdf2:xsl/fo/tables.xsl")
    if (this.override_shell) {
      fs.push(`plugin:${this.plugin_name}:xsl/fo/tables.xsl`)
    }
    fs.push("plugin:org.dita.pdf2:xsl/fo/root-processing.xsl")
    fs.push("plugin:org.dita.pdf2:cfg/fo/attrs/commons-attr.xsl")
    if (this.override_shell) {
      fs.push(`plugin:${this.plugin_name}:cfg/fo/attrs/commons-attr.xsl`)
    }
    fs.push("plugin:org.dita.pdf2:xsl/fo/commons.xsl")
    if (this.override_shell) {
      fs.push(`plugin:${this.plugin_name}:xsl/fo/commons.xsl`)
    }
    fs.push("plugin:org.dita.pdf2:cfg/fo/attrs/toc-attr.xsl")
    if (this.override_shell) {
      fs.push(`plugin:${this.plugin_name}:cfg/fo/attrs/toc-attr.xsl`)
    }
    fs.push("plugin:org.dita.pdf2:xsl/fo/toc.xsl")
    if (this.override_shell) {
      fs.push(`plugin:${this.plugin_name}:xsl/fo/toc.xsl`)
    }
    fs.push("plugin:org.dita.pdf2:xsl/fo/bookmarks.xsl")
    fs.push("plugin:org.dita.pdf2:cfg/fo/attrs/index-attr.xsl")
    fs.push("plugin:org.dita.pdf2:xsl/fo/index.xsl")
    fs.push("plugin:org.dita.pdf2:cfg/fo/attrs/front-matter-attr.xsl")
    if (this.override_shell) {
      fs.push(`plugin:${this.plugin_name}:cfg/fo/attrs/front-matter-attr.xsl`)
    }
    fs.push("plugin:org.dita.pdf2:xsl/fo/front-matter.xsl")
    if (this.override_shell) {
      fs.push(`plugin:${this.plugin_name}:xsl/fo/front-matter.xsl`)
    }
    fs.push("plugin:org.dita.pdf2:xsl/fo/preface.xsl")

    fs.push("plugin:org.dita.pdf2:cfg/fo/attrs/map-elements-attr.xsl")
    fs.push("plugin:org.dita.pdf2:xsl/fo/map-elements.xsl")

    fs.push("plugin:org.dita.pdf2:cfg/fo/attrs/task-elements-attr.xsl")
    fs.push("plugin:org.dita.pdf2:xsl/fo/task-elements.xsl")

    fs.push("plugin:org.dita.pdf2:cfg/fo/attrs/reference-elements-attr.xsl")
    fs.push("plugin:org.dita.pdf2:xsl/fo/reference-elements.xsl")

    fs.push("plugin:org.dita.pdf2:cfg/fo/attrs/sw-domain-attr.xsl")
    fs.push("plugin:org.dita.pdf2:xsl/fo/sw-domain.xsl")
    fs.push("plugin:org.dita.pdf2:cfg/fo/attrs/pr-domain-attr.xsl")
    if (this.override_shell) {
      fs.push(`plugin:${this.plugin_name}:cfg/fo/attrs/pr-domain-attr.xsl`)
    }
    fs.push("plugin:org.dita.pdf2:xsl/fo/pr-domain.xsl")
    fs.push("plugin:org.dita.pdf2:cfg/fo/attrs/hi-domain-attr.xsl")
    fs.push("plugin:org.dita.pdf2:xsl/fo/hi-domain.xsl")
    fs.push("plugin:org.dita.pdf2:cfg/fo/attrs/ui-domain-attr.xsl")
    fs.push("plugin:org.dita.pdf2:xsl/fo/ui-domain.xsl")
    fs.push("plugin:org.dita.pdf2:xsl/fo/ut-domain.xsl")
    fs.push("plugin:org.dita.pdf2:xsl/fo/abbrev-domain.xsl")
    fs.push("plugin:org.dita.pdf2:cfg/fo/attrs/markup-domain-attr.xsl")
    fs.push("plugin:org.dita.pdf2:xsl/fo/markup-domain.xsl")
    fs.push("plugin:org.dita.pdf2:cfg/fo/attrs/xml-domain-attr.xsl")
    fs.push("plugin:org.dita.pdf2:xsl/fo/xml-domain.xsl")

    fs.push("plugin:org.dita.pdf2:cfg/fo/attrs/static-content-attr.xsl")
    if (this.override_shell) {
      fs.push(`plugin:${this.plugin_name}:cfg/fo/attrs/static-content-attr.xsl`)
    }
    fs.push("plugin:org.dita.pdf2:xsl/fo/static-content.xsl")
    if (this.override_shell) {
      fs.push(`plugin:${this.plugin_name}:xsl/fo/static-content.xsl`)
    }
    fs.push("plugin:org.dita.pdf2:cfg/fo/attrs/glossary-attr.xsl")
    fs.push("plugin:org.dita.pdf2:xsl/fo/glossary.xsl")
    fs.push("plugin:org.dita.pdf2:cfg/fo/attrs/lot-lof-attr.xsl")
    fs.push("plugin:org.dita.pdf2:xsl/fo/lot-lof.xsl")

    fs.push("plugin:org.dita.pdf2:cfg/fo/attrs/learning-elements-attr.xsl")
    fs.push("plugin:org.dita.pdf2:xsl/fo/learning-elements.xsl")

    fs.push("plugin:org.dita.pdf2:xsl/fo/flagging.xsl")
    if (this.ot_version.compareTo(new Version("2.2")) >= 0) {
      fs.push("plugin:org.dita.pdf2:xsl/fo/flagging-from-preprocess.xsl")
    }

    fs.forEach((i) => {
      ET.SubElement(root, xsl('import'), {href: i})
    })

    root.append(ET.Comment("formatter specific imports"))
    this.get_formatter_imports().forEach((i) => {
      ET.SubElement(root, xsl('import'), {href: i})
    })

    if (!this.override_shell) {
      root.append(ET.Comment("configuration overrides"))
      ET.SubElement(root, xsl('import'), {href: 'cfg:fo/attrs/custom.xsl'})
      ET.SubElement(root, xsl('import'), {href: 'cfg:fo/xsl/custom.xsl'})
    }

    root.append(ET.Comment("parameters"))

    //ditagen.generator.indent(root)
    const d = new ET.ElementTree(root)
    return d.write()
  }

  get_formatter_imports() {
    var imports = []
    var plugin = "plugin:org.dita.pdf2"
    if (this.formatter === "ah") {
      if (this.ot_version.compareTo(new Version("2.2")) >= 0) {
        plugin = plugin + ".axf"
      }
      imports = [
        "cfg/fo/attrs/tables-attr_axf.xsl",
        "cfg/fo/attrs/toc-attr_axf.xsl",
        "cfg/fo/attrs/index-attr_axf.xsl",
        "xsl/fo/root-processing_axf.xsl",
        "xsl/fo/index_axf.xsl"]
    } else if (this.formatter === "fop") {
      if (this.ot_version.compareTo(new Version("2.2")) >= 0) {
        plugin = plugin + ".fop"
      }
      imports = [
        "cfg/fo/attrs/commons-attr_fop.xsl",
        "cfg/fo/attrs/tables-attr_fop.xsl",
        "cfg/fo/attrs/toc-attr_fop.xsl",
        "xsl/fo/root-processing_fop.xsl",
        "xsl/fo/index_fop.xsl"]
      if (this.ot_version.compareTo(new Version('2.3')) >= 0) {
        imports.push(
            'xsl/fo/tables_fop.xsl',
            'xsl/fo/flagging_fop.xsl')
      }
    } else if (this.formatter === "xep") {
      if (this.ot_version.compareTo(new Version("2.2")) >= 0) {
        plugin = plugin + ".xep"
      }
      imports = [
        "cfg/fo/attrs/commons-attr_xep.xsl",
        "cfg/fo/attrs/layout-masters-attr_xep.xsl",
        "xsl/fo/root-processing_xep.xsl",
        "xsl/fo/index_xep.xsl"]
    }
    return _(imports)
      .map((i) => {
        return plugin + ":" + i
      })
      .value()
  }


  /**
   * Run a file generation.
   */
  run_generation(zip, func, filename) {
    const buf = func.apply(this)
    zip.file(filename, buf, {
      date: new Date(),
      unixPermissions: 0o666
    })
  }

  generate_plugin() {
    const zip = new JSZip()
    // integrator
    this.run_generation(zip, this.generate_integrator, `${this.plugin_name}/integrator.xml`)
    // plugin
    this.run_generation(zip, this.generate_plugin_file, `${this.plugin_name}/plugin.xml`)
    // catalog
    this.run_generation(zip, this.generate_catalog, `${this.plugin_name}/cfg/catalog.xml`)

    // custom XSLT
    if (this.override_shell) {
      ["front-matter",
        "commons",
        "tables",
        "toc",
        "links",
        "lists",
        "static-content"].forEach((s) => {
        this.run_generation(zip, () => {
          return this.generate_custom(s)
        }, `${this.plugin_name}/xsl/fo/${s}.xsl`)
      });
      ["layout-masters"].forEach((s) => {
        this.run_generation(zip, () => {
          return this.generate_custom(s)
        }, `${this.plugin_name}/cfg/fo/${s}.xsl`)
      })
    } else {
      this.run_generation(zip, this.generate_custom, `${this.plugin_name}/cfg/fo/xsl/custom.xsl`)
    }
    // custom XSLT attribute sets
    if (this.override_shell) {
      ["front-matter-attr",
        "commons-attr",
        "layout-masters-attr",
        'static-content-attr',
        "tables-attr",
        'toc-attr',
        "basic-settings",
        "lists-attr",
        "pr-domain-attr"].forEach((s) => {
        this.run_generation(zip, () => {
          return this.generate_custom_attr(s)
        }, `${this.plugin_name}/cfg/fo/attrs/${s}.xsl`)
      })
    } else {
      this.run_generation(zip, this.generate_custom_attr, `${this.plugin_name}/cfg/fo/attrs/custom.xsl`)
    }
    // shell XSLT
    if (this.override_shell) {
      this.run_generation(zip, this.generate_shell, `${this.plugin_name}/xsl/fo/topic2fo_shell_${this.formatter}.xsl`)
    }
    this.variable_languages.forEach((lang) => {
      this.run_generation(zip, () => {
        return vars(lang, this)
      }, `${this.plugin_name}/cfg/common/vars/${lang}.xml`)
    })
    //if (this.cover_image) {
    //  store_file(zip, this.cover_image, `${this.plugin_name}/cfg/common/artwork/${this.cover_image_name}`)
    //}
    return zip.generate({
      type: 'nodebuffer',
      platform: process.platform
    })
  }
}

function value(property, value) {
  if (property === 'start-indent') {
    return `from-parent(start-indent) + ${value}`
  } else if (property === 'end-indent') {
    return `from-parent(end-indent) + ${value}`
  }
  return value
}

const xsl = utils.xsl
const catalog = utils.catalog

module.exports = {
  Generator: Generator,
  // FIXME single source with UI JS
  styles: styles
}