import JSZip from 'jszip';
import _ from 'lodash';
import { SaxonJS, Options as SaxonJsOptions } from '../types/saxon-js';
import { FoProperty, Property, Style, StyleName, styles } from './styles';
import vars from './vars';
import { Version } from './version';
import { value, xsl } from './utils';
import {
  Element,
  SubElement,
  register_namespace,
  ElementTree,
} from './elementtree';
import BasicSettings from '../../build/generator/basic-settings.sef.json';
import Commons from '../../build/generator/commons.sef.json';
import FrontMatter from '../../build/generator/front-matter.sef.json';
import LayoutMasters from '../../build/generator/layout-masters.sef.json';
import Links from '../../build/generator/links.sef.json';
import Lists from '../../build/generator/lists.sef.json';
import PrDomain from '../../build/generator/pr-domain.sef.json';
import StaticContent from '../../build/generator/static-content.sef.json';
import Tables from '../../build/generator/tables.sef.json';
import Toc from '../../build/generator/toc.sef.json';
import Topic from '../../build/generator/topic.sef.json';
import Shell from '../../build/generator/shell.sef.json';
import { PluginModel } from './Model';

// require('../../lib/SaxonJS2.rt');

type Language =
  | 'de'
  | 'en'
  | 'es'
  | 'fi'
  | 'fr'
  | 'he'
  | 'it'
  | 'ja'
  | 'nl'
  | 'ro'
  | 'ru'
  | 'sv'
  | 'zh_CN';

type Options = {
  blank_pages: boolean;
};

export default class Generator {
  conf: PluginModel;
  properties: FoProperty[] = Object.values(FoProperty);
  variable_languages: Language[] = [
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
  ot_version;
  plugin_name;
  plugin_version;
  style: Record<StyleName, Record<Property, string | boolean>>;
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
  // override_shell;
  // cover_image;
  // cover_image_name;
  cover_image_metadata;
  cover_image_topic;
  header;
  footer;
  page_number;
  options: Options;
  transtype;
  SaxonJS: SaxonJS;

  // title_numbering;

  constructor(conf: PluginModel, SaxonJS: SaxonJS) {
    this.SaxonJS = SaxonJS;
    this.conf = conf;
    //validate
    if (!conf.ot_version) {
      throw new Error('version missing');
    }
    this.ot_version = new Version(conf.ot_version);
    if (!conf.id) {
      throw new Error('id missing');
    }
    if (conf.plugin_name) {
      this.plugin_name = conf.plugin_name;
    } else {
      this.plugin_name = conf.id;
    }
    if (conf.plugin_version) {
      this.plugin_version = conf.plugin_version;
    }
    this.transtype = conf.transtype;

    this.page = conf.page;
    this.style = conf.style;
    this.force_page_count = conf.force_page_count;
    this.chapter_layout = conf.chapter_layout;
    this.bookmark_style = conf.bookmark_style;
    this.toc_maximum_level = conf.toc_maximum_level;
    this.task_label = conf.task_label;
    this.include_related_links = conf.include_related_links;
    if (conf.body_column_count) {
      this.body_column_count = conf.body_column_count;
    }
    if (conf.index_column_count) {
      this.index_column_count = conf.index_column_count;
    }
    if (conf.column_gap) {
      this.column_gap = conf.column_gap;
    }
    this.mirror_page_margins = conf.mirror_page_margins;
    //__dita_gen.dl = __config["dl"]
    // this.title_numbering = conf.title_numbering;
    //__dita_gen.table_numbering = __config["table_numbering"]
    //__dita_gen.figure_numbering = __config["figure_numbering"]
    //__dita_gen.link_pagenumber = __config["link_pagenumber"]
    this.table_continued = conf.table_continued;
    this.formatter = conf.formatter;
    // this.override_shell = conf.override_shell;
    //if ("cover_image" in self.request.arguments() && type(self.request.POST["cover_image"]) != unicode) {
    //  __dita_gen.cover_image = self.request.get("cover_image")
    //  __dita_gen.cover_image_name = self.request.POST["cover_image"].filename
    //}
    if (conf.cover_image_metadata) {
      this.cover_image_metadata = conf.cover_image_metadata;
    }
    if (conf.cover_image_topic) {
      this.cover_image_topic = conf.cover_image_topic;
    }
    this.header = conf.header;
    this.footer = conf.footer;
    if (conf.page_number) {
      this.page_number = conf.page_number;
    }
    this.options = { ...conf };

    register_namespace('xsl', 'http://www.w3.org/1999/XSL/Transform');
    register_namespace('fo', 'http://www.w3.org/1999/XSL/Format');
    register_namespace('xs', 'http://www.w3.org/2001/XMLSchema');
    register_namespace('e', this.plugin_name);
    register_namespace(
      'dita-ot',
      'http://dita-ot.sourceforge.net/ns/201007/dita-ot'
    );
    register_namespace(
      'ditaarch',
      'http://dita.oasis-open.org/architecture/2005/'
    );
    register_namespace('opentopic', 'http://www.idiominc.com/opentopic');
    register_namespace(
      'opentopic-func',
      'http://www.idiominc.com/opentopic/exsl/function'
    );
  }

  default_style(type: StyleName, property: Property) {
    if (_.has(styles, [type, property])) {
      return styles[type][property]?.default || undefined;
    }
    return undefined;
  }

  /**
   * Generate plugin integrator Ant file.
   */
  generate_integrator() {
    const root = Element('project', {
      name: this.plugin_name,
    });
    const init = SubElement(root, 'target', {
      name: `dita2${this.transtype}.init`,
    });
    SubElement(init, 'property', {
      name: 'customization.dir',
      location: `\${dita.plugin.${this.plugin_name}.dir}/cfg`,
    });
    SubElement(init, 'property', {
      name: 'pdf2.i18n.skip',
      value: 'true',
    });
    // if (this.override_shell) {
    SubElement(init, 'property', {
      name: 'args.xsl.pdf',
      location: `\${dita.plugin.${this.plugin_name}.dir}/xsl/fo/topic2fo_shell_${this.formatter}.xsl`,
    });
    // }
    if (this.chapter_layout) {
      SubElement(init, 'property', {
        name: 'args.chapter.layout',
        value: this.chapter_layout,
      });
    }
    if (this.bookmark_style) {
      SubElement(init, 'property', {
        name: 'args.bookmark.style',
        value: this.bookmark_style,
      });
    }
    if (this.task_label) {
      SubElement(init, 'property', {
        name: 'args.gen.task.lbl',
        value: 'YES',
      });
    }
    if (this.include_related_links) {
      SubElement(init, 'property', {
        name: 'args.fo.include.rellinks',
        value: this.include_related_links,
      });
    }
    SubElement(root, 'target', {
      name: `dita2${this.transtype}`,
      depends: `dita2${this.transtype}.init, dita2pdf2`,
    });
    //ditagen.generator.indent(root)
    const d = new ElementTree(root);
    return d.write({ indent: 2 });
  }

  /**
   * Generate plugin configuration file.
   */
  generate_plugin_file() {
    const root = Element('plugin', { id: this.plugin_name });
    if (this.plugin_version) {
      SubElement(root, 'feature', {
        extension: 'package.version',
        value: this.plugin_version,
      });
    }
    SubElement(root, 'require', { plugin: 'org.dita.pdf2' });
    if (this.conf.ot_version === '3.5' || this.conf.ot_version === '3.6') {
      SubElement(root, 'transtype', {
        name: this.transtype ?? undefined,
        extends: 'pdf',
      });
      SubElement(root, 'feature', {
        extension: 'ant.import',
        file: 'integrator.xml',
      });
    } else {
      SubElement(root, 'feature', {
        extension: 'dita.conductor.transtype.check',
        value: this.transtype ?? undefined,
      });
      SubElement(root, 'feature', {
        extension: 'dita.conductor.target.relative',
        file: 'integrator.xml',
      });
    }
    SubElement(root, 'feature', {
      extension: 'dita.transtype.print',
      value: this.transtype ?? undefined,
    });
    //ditagen.generator.indent(root)
    const d = new ElementTree(root);
    return d.write({ indent: 2 });
  }

  // /**
  //  * Generate plugin configuration file.
  //  */
  // generate_catalog() {
  //   const root = Element(catalog('catalog'), {
  //     prefer: 'system',
  //   });
  //   // if (!this.override_shell) {
  //   //   SubElement(root, catalog('uri'), {
  //   //     name: 'cfg:fo/attrs/custom.xsl',
  //   //     uri: 'fo/attrs/custom.xsl',
  //   //   });
  //   //   SubElement(root, catalog('uri'), {
  //   //     name: 'cfg:fo/xsl/custom.xsl',
  //   //     uri: 'fo/xsl/custom.xsl',
  //   //   });
  //   // }
  //   //ditagen.generator.indent(root)
  //   //ditagen.generator.set_prefixes(root, {"": "urn:oasis:names:tc:entity:xmlns:xml:catalog"})
  //   const d = new ElementTree(root);
  //   register_namespace('', 'urn:oasis:names:tc:entity:xmlns:xml:catalog');
  //   return d.write({ indent: 2 });
  // }

  // /**
  //  * Remove `default` field added to JSON. I have no idea why bundling with Parcel adds these.
  //  */
  // cleanStylesheet(stylesheet: any): any {
  //   if (stylesheet.default) {
  //     const copy = { ...stylesheet };
  //     delete copy.default;
  //     return copy;
  //   }
  //   return stylesheet;
  // }

  /**
   * Generate plugin custom XSLT file.
   */
  generate_custom_xslt(stylesheet: any) {
    const options: SaxonJsOptions = {
      // stylesheetInternal: require(`../../build/generator/${stylesheet}.sef.json`),
      stylesheetInternal: stylesheet,
      destination: 'serialized',
      sourceType: 'json',
      sourceText: JSON.stringify(this.conf),
    };
    try {
      // console.log(SaxonJS);
      // console.log({
      //   SaxonJS,
      //   transform: SaxonJS.transform,
      // });
      const output = this.SaxonJS.transform(options);
      return (output as any).principalResult;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  /**
   * Generate plugin custom XSLT file.
   */
  generate_custom_attr_xslt(stylesheet: any) {
    const options: SaxonJsOptions = {
      stylesheetInternal: stylesheet,
      destination: 'serialized',
      sourceType: 'json',
      initialMode: 'attr',
      sourceText: JSON.stringify(this.conf),
    };
    // console.log(stylesheet.Σ);
    // console.log(stylesheet.default.Σ);
    try {
      // console.log({
      //   SaxonJS,
      //   transform: SaxonJS.transform,
      // });
      const output = this.SaxonJS.transform(options);
      return (output as any).principalResult;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  /**
   * Generate attribute set.
   */
  attribute_set(
    root: Element,
    style: StyleName,
    attribute_set: string,
    properties?: FoProperty[],
    uses?: string
  ) {
    properties = properties || this.properties;
    const attrs: { [key: string]: string } = { name: attribute_set };
    if (uses !== undefined) {
      attrs['use-attribute-sets'] = uses;
    }
    const attrSet = SubElement(root, xsl('attribute-set'), attrs);
    //: Record<StyleName, Record<Property, Style>>;

    _.forEach(this.style[style], (v, p) => {
      const property = p as FoProperty;
      if (_.includes(properties, property)) {
        SubElement(attrSet, xsl('attribute'), {
          name: property,
        }).text = value(property, v);
      }
    });
    return attrSet;
  }

  /**
   * Run a file generation.
   */
  run_generation(zip: JSZip, func: any, filename: string) {
    const buf = func.apply(this, [this]);
    zip.file(filename, buf, {
      date: new Date(),
      unixPermissions: 0o666,
    });
  }

  generate_plugin(zip: JSZip) {
    // const zip = new JSZip();
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
    // this.run_generation(
    //   zip,
    //   this.generate_catalog,
    //   `${this.plugin_name}/cfg/catalog.xml`
    // );

    // custom XSLT
    const custom_xslt = (stylesheet: any, name: string) => {
      this.run_generation(
        zip,
        () => {
          return this.generate_custom_xslt(stylesheet);
        },
        `${this.plugin_name}/xsl/fo/${name}.xsl`
      );
    };
    custom_xslt(FrontMatter, 'front-matter');
    custom_xslt(Commons, 'commons');
    custom_xslt(Tables, 'tables');
    custom_xslt(Toc, 'toc');
    custom_xslt(Links, 'links');
    custom_xslt(Lists, 'lists');
    custom_xslt(PrDomain, 'pr-domain');
    custom_xslt(StaticContent, 'static-content');
    custom_xslt(Topic, 'topic');
    this.run_generation(
      zip,
      () => {
        return this.generate_custom_xslt(LayoutMasters);
      },
      `${this.plugin_name}/cfg/fo/layout-masters.xsl`
    );

    // custom XSLT attribute sets
    const attr_xslt = (stylesheet: any, name: string) => {
      this.run_generation(
        zip,
        () => {
          return this.generate_custom_attr_xslt(stylesheet);
        },
        `${this.plugin_name}/cfg/fo/attrs/${name}.xsl`
      );
    };
    attr_xslt(FrontMatter, 'front-matter-attr');
    attr_xslt(Commons, 'commons-attr');
    attr_xslt(LayoutMasters, 'layout-masters-attr');
    attr_xslt(StaticContent, 'static-content-attr');
    attr_xslt(Tables, 'tables-attr');
    attr_xslt(Toc, 'toc-attr');
    attr_xslt(Tables, 'tables-attr');
    attr_xslt(BasicSettings, 'basic-settings');
    attr_xslt(Links, 'links-attr');
    attr_xslt(Lists, 'lists-attr');
    attr_xslt(PrDomain, 'pr-domain-attr');
    attr_xslt(Topic, 'topic-attr');

    // shell XSLT
    // if (this.override_shell) {
    this.run_generation(
      zip,
      () => {
        return this.generate_custom_xslt(Shell);
      },
      `${this.plugin_name}/xsl/fo/topic2fo_shell_${this.formatter}.xsl`
    );
    // TODO
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
    // return zip.generateAsync({
    //   type: 'blob',
    //   platform: 'UNIX',
    // });
  }
}
