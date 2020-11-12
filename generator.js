import JSZip from 'jszip'
import _ from 'lodash'
import {styles} from './javascript/lib/styles'
import shell from './lib/shell'
import vars from './lib/vars'
import Version from './lib/version'
import {xsl, catalog, value} from './lib/utils'
import ET from './lib/elementtree'

class Generator {
  properties;
  variable_languages;
  ot_version;
  plugin_name;
  plugin_version;
  style;
  page;
  force_page_count;
  chapter_layout;
  body_column_count;
  index_column_count;
  bookmark_style;
  toc_maximum_level;
  task_label;
  include_related_links;
  column_gap;
  mirror_page_margins;
  table_continued;
  formatter;
  override_shell;
  cover_image;
  cover_image_name;
  cover_image_metadata;
  cover_image_topic;
  header;
  footer;
  page_number;
  options;

  constructor() {
    this.properties = [
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
      'left',
      'letter-spacing',
      'letter-value',
      'linefeed-treatment',
      'line-height',
      'line-height-shift-adjustment',
      'line-stacking-strategy',
      'margin-bottom',
      'margin-bottom',
      'margin-left',
      'margin-left',
      'margin-right',
      'margin-right',
      'margin-top',
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
      'z-index',
    ];
    this.variable_languages = [
      'de',
      'en',
      'es',
      'fi',
      'fr',
      'he',
      'it',
      'ja',
      'nl',
      'ro',
      'ru',
      'sv',
      'zh_CN',
    ];

    this.ot_version = new Version('2.4');
    this.plugin_name = undefined;
    this.plugin_version = undefined;
    this.style = {
      ol: true,
    };
    this.page = {};
    this.force_page_count = undefined;
    this.chapter_layout = undefined;
    this.body_column_count = undefined;
    this.index_column_count = undefined;
    this.bookmark_style = undefined;
    this.toc_maximum_level = 4;
    this.task_label = false;
    this.include_related_links = undefined;
    this.column_gap = undefined;
    this.mirror_page_margins = false;
    this.table_continued = false;
    this.formatter = 'ah';
    this.override_shell = false;
    this.cover_image = undefined;
    this.cover_image_name = undefined;
    this.cover_image_metadata = undefined;
    this.cover_image_topic = undefined;
    this.header = {};
    this.footer = {};
    this.page_number = undefined;
    this.options = {};

    ET.register_namespace('xsl', 'http://www.w3.org/1999/XSL/Transform');
    ET.register_namespace('fo', 'http://www.w3.org/1999/XSL/Format');
    ET.register_namespace('xs', 'http://www.w3.org/2001/XMLSchema');
    ET.register_namespace('e', this.plugin_name);
    ET.register_namespace(
      'dita-ot',
      'http://dita-ot.sourceforge.net/ns/201007/dita-ot'
    );
    ET.register_namespace(
      'ditaarch',
      'http://dita.oasis-open.org/architecture/2005/'
    );
    ET.register_namespace('opentopic', 'http://www.idiominc.com/opentopic');
    ET.register_namespace(
      'opentopic-func',
      'http://www.idiominc.com/opentopic/exsl/function'
    );
  }

  default_style(type, property) {
    if (_.has(styles, [type, property])) {
      return styles[type][property].default || undefined;
    }
    return undefined;
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
    const root = ET.Element('project', {
      name: this.plugin_name,
    });
    const init = ET.SubElement(root, 'target', {
      name: `dita2${this.transtype}.init`,
    });
    ET.SubElement(init, 'property', {
      name: 'customization.dir',
      location: `\${dita.plugin.${this.plugin_name}.dir}/cfg`,
    });
    ET.SubElement(init, 'property', {
      name: 'pdf2.i18n.skip',
      value: true,
    });
    if (this.override_shell) {
      ET.SubElement(init, 'property', {
        name: 'args.xsl.pdf',
        location: `\${dita.plugin.${this.plugin_name}.dir}/xsl/fo/topic2fo_shell_${this.formatter}.xsl`,
      });
    }
    if (this.chapter_layout) {
      ET.SubElement(init, 'property', {
        name: 'args.chapter.layout',
        value: this.chapter_layout,
      });
    }
    if (this.bookmark_style) {
      ET.SubElement(init, 'property', {
        name: 'args.bookmark.style',
        value: this.bookmark_style,
      });
    }
    if (this.task_label) {
      ET.SubElement(init, 'property', {
        name: 'args.gen.task.lbl',
        value: 'YES',
      });
    }
    if (this.include_related_links) {
      ET.SubElement(init, 'property', {
        name: 'args.fo.include.rellinks',
        value: this.include_related_links,
      });
    }
    ET.SubElement(root, 'target', {
      name: `dita2${this.transtype}`,
      depends: `dita2${this.transtype}.init, dita2pdf2`,
    });
    //ditagen.generator.indent(root)
    const d = new ET.ElementTree(root);
    return d.write({ indent: 2 });
  }

  /**
   * Generate plugin configuration file.
   */
  generate_plugin_file() {
    const root = ET.Element('plugin', { id: this.plugin_name });
    if (this.plugin_version) {
      ET.SubElement(root, 'feature', {
        extension: 'package.version',
        value: this.plugin_version,
      });
    }
    ET.SubElement(root, 'require', { plugin: 'org.dita.pdf2' });
    ET.SubElement(root, 'feature', {
      extension: 'dita.conductor.transtype.check',
      value: this.transtype,
    });
    ET.SubElement(root, 'feature', {
      extension: 'dita.transtype.print',
      value: this.transtype,
    });
    ET.SubElement(root, 'feature', {
      extension: 'dita.conductor.target.relative',
      file: 'integrator.xml',
    });
    //ditagen.generator.indent(root)
    const d = new ET.ElementTree(root);
    return d.write({ indent: 2 });
  }

  /**
   * Generate plugin configuration file.
   */
  generate_catalog() {
    const root = ET.Element(catalog('catalog'), {
      prefer: 'system',
    });
    if (!this.override_shell) {
      ET.SubElement(root, catalog('uri'), {
        name: 'cfg:fo/attrs/custom.xsl',
        uri: 'fo/attrs/custom.xsl',
      });
      ET.SubElement(root, catalog('uri'), {
        name: 'cfg:fo/xsl/custom.xsl',
        uri: 'fo/xsl/custom.xsl',
      });
    }
    //ditagen.generator.indent(root)
    //ditagen.generator.set_prefixes(root, {"": "urn:oasis:names:tc:entity:xmlns:xml:catalog"})
    const d = new ET.ElementTree(root);
    ET.register_namespace('', 'urn:oasis:names:tc:entity:xmlns:xml:catalog');
    return d.write({ indent: 2 });
  }

  /**
   * Generate plugin custom XSLT file.
   */
  generate_custom(stylesheet) {
    const root = ET.Element(xsl('stylesheet'), {
      //"xmlns:xsl": "http://www.w3.org/1999/XSL/Transform",
      'xmlns:fo': 'http://www.w3.org/1999/XSL/Format',
      'xmlns:xs': 'http://www.w3.org/2001/XMLSchema',
      'xmlns:e': this.plugin_name,
      'xmlns:dita-ot': 'http://dita-ot.sourceforge.net/ns/201007/dita-ot',
      'xmlns:ditaarch': 'http://dita.oasis-open.org/architecture/2005/',
      'xmlns:opentopic': 'http://www.idiominc.com/opentopic',
      'xmlns:opentopic-func': 'http://www.idiominc.com/opentopic/exsl/function',
      version: '2.0',
      'exclude-result-prefixes': 'ditaarch opentopic e dita-ot opentopic-func',
    });

    if (stylesheet === 'front-matter' || !stylesheet) {
      require('./lib/front-matter').xsl(root, this);
    }
    if (stylesheet === 'tables' || !stylesheet) {
      require('./lib/tables').xsl(root, this);
    }
    if (stylesheet === 'toc' || !stylesheet) {
      require('./lib/toc').xsl(root, this);
    }
    if (stylesheet === 'commons' || !stylesheet) {
      require('./lib/commons').xsl(root, this);
      require('./lib/topic').xsl(root, this);
    }
    if (stylesheet === 'links' || !stylesheet) {
      require('./lib/links').xsl(root, this);
    }
    if (stylesheet === 'lists' || !stylesheet) {
      require('./lib/lists').xsl(root, this);
    }
    if (stylesheet === 'static-content' || !stylesheet) {
      require('./lib/staticContent').xsl(root, this);
    }
    if (stylesheet === 'layout-masters' || !stylesheet) {
      require('./lib/layoutMasters').xsl(root, this.options);
    }
    if (stylesheet === 'pr-domain' || !stylesheet) {
      require('./lib/pr-domain').xsl(root, this);
    }
    if (!stylesheet) {
      if (!this.override_shell && this.toc_maximum_level) {
        root.append(ET.Comment('TOC'));
        ET.SubElement(root, xsl('variable'), {
          name: 'tocMaximumLevel',
        }).text = this.toc_maximum_level.toString();
      }
    }

    // ditagen.generator.indent(root)
    // ditagen.generator.set_prefixes(root, get_ns())

    const d = new ET.ElementTree(root);
    return d.write({ indent: 2 });
  }

  /**
   * Generate attribute set.
   */
  attribute_set(root, style, attribute_set, properties, uses) {
    properties = properties || this.properties;
    const attrs = { name: attribute_set };
    if (uses !== undefined) {
      attrs['use-attribute-sets'] = uses;
    }
    const attrSet = ET.SubElement(root, xsl('attribute-set'), attrs);
    _.forEach(this.style[style], (v, p) => {
      if (_.includes(properties, p)) {
        ET.SubElement(attrSet, xsl('attribute'), {
          name: p,
        }).text = value(p, v);
      }
    });
    return attrSet;
  }

  /**
   * Generate plugin custom XSLT file.
   */
  generate_custom_attr(stylesheet) {
    const root = ET.Element(xsl('stylesheet'), {
      'xmlns:xs': 'http://www.w3.org/2001/XMLSchema',
      'xmlns:e': this.plugin_name,
      'xmlns:dita-ot': 'http://dita-ot.sourceforge.net/ns/201007/dita-ot',
      'xmlns:ditaarch': 'http://dita.oasis-open.org/architecture/2005/',
      'xmlns:opentopic': 'http://www.idiominc.com/opentopic',
      'xmlns:opentopic-func': 'http://www.idiominc.com/opentopic/exsl/function',
      version: '2.0',
      'exclude-result-prefixes':
        'xs ditaarch opentopic e dita-ot opentopic-func',
    });

    if (stylesheet === 'commons-attr' || !stylesheet) {
      require('./lib/commons').attr(root, this);
      require('./lib/topic').attr(root, this);
    }
    if (stylesheet === 'tables-attr' || !stylesheet) {
      require('./lib/tables').attr(root, this);
    }
    if (stylesheet === 'layout-masters-attr' || !stylesheet) {
      require('./lib/layoutMasters').attr(root, this);
    }
    if (stylesheet === 'toc-attr' || !stylesheet) {
      require('./lib/toc').attr(root, this);
    }
    if (stylesheet === 'basic-settings' || !stylesheet) {
      require('./lib/basic-settings').attr(root, this);
    }
    if (stylesheet === 'lists-attr' || !stylesheet) {
      require('./lib/lists').attr(root, this);
    }
    if (stylesheet === 'pr-domain-attr' || !stylesheet) {
      require('./lib/pr-domain').attr(root, this);
    }
    if (stylesheet === 'static-content-attr' || !stylesheet) {
      require('./lib/staticContent').attr(root, this);
    }

    // ditagen.generator.indent(root)
    // ditagen.generator.set_prefixes(root, get_ns())
    const d = new ET.ElementTree(root);
    return d.write({ indent: 2 });
  }

  /**
   * Run a file generation.
   */
  run_generation(zip, func, filename) {
    const buf = func.apply(this, [this]);
    zip.file(filename, buf, {
      date: new Date(),
      unixPermissions: 0o666,
    });
  }

  generate_plugin() {
    const zip = new JSZip();
    // integrator
    this.run_generation(
      zip,
      this.generate_integrator,
      `${this.plugin_name}/integrator.xml`
    );
    // plugin
    this.run_generation(
      zip,
      this.generate_plugin_file,
      `${this.plugin_name}/plugin.xml`
    );
    // catalog
    this.run_generation(
      zip,
      this.generate_catalog,
      `${this.plugin_name}/cfg/catalog.xml`
    );

    // custom XSLT
    if (this.override_shell) {
      const files = [
        'front-matter',
        'commons',
        'tables',
        'toc',
        'links',
        'lists',
        'pr-domain',
        'static-content',
      ];
      files.forEach((s) => {
        this.run_generation(
          zip,
          () => {
            return this.generate_custom(s);
          },
          `${this.plugin_name}/xsl/fo/${s}.xsl`
        );
      });
      ['layout-masters'].forEach((s) => {
        this.run_generation(
          zip,
          () => {
            return this.generate_custom(s);
          },
          `${this.plugin_name}/cfg/fo/${s}.xsl`
        );
      });
    } else {
      this.run_generation(
        zip,
        this.generate_custom,
        `${this.plugin_name}/cfg/fo/xsl/custom.xsl`
      );
    }
    // custom XSLT attribute sets
    if (this.override_shell) {
      const files = [
        'front-matter-attr',
        'commons-attr',
        'layout-masters-attr',
        'static-content-attr',
        'tables-attr',
        'toc-attr',
        'basic-settings',
        'lists-attr',
        'pr-domain-attr',
      ];
      files.forEach((s) => {
        this.run_generation(
          zip,
          () => {
            return this.generate_custom_attr(s);
          },
          `${this.plugin_name}/cfg/fo/attrs/${s}.xsl`
        );
      });
    } else {
      this.run_generation(
        zip,
        this.generate_custom_attr,
        `${this.plugin_name}/cfg/fo/attrs/custom.xsl`
      );
    }
    // shell XSLT
    if (this.override_shell) {
      this.run_generation(
        zip,
        shell,
        `${this.plugin_name}/xsl/fo/topic2fo_shell_${this.formatter}.xsl`
      );
    }
    this.variable_languages.forEach((lang) => {
      this.run_generation(
        zip,
        () => {
          return vars(lang, this);
        },
        `${this.plugin_name}/cfg/common/vars/${lang}.xml`
      );
    });
    //if (this.cover_image) {
    //  store_file(zip, this.cover_image, `${this.plugin_name}/cfg/common/artwork/${this.cover_image_name}`)
    //}
    return zip.generateAsync({
      type: 'blob',
      platform: 'UNIX',
    });
  }
}

module.exports = {
  Generator: Generator,
};
