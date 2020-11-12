import _ from 'lodash';
import { xsl } from './utils';
import ET from './elementtree';

function generate(conf) {
  const root = ET.Element(xsl('stylesheet'), {
    'xmlns:xs': 'http://www.w3.org/2001/XMLSchema',
    'xmlns:e': conf.plugin_name,
    'xmlns:ditaarch': 'http://dita.oasis-open.org/architecture/2005/',
    'xmlns:opentopic': 'http://www.idiominc.com/opentopic',
    'xmlns:opentopic-func': 'http://www.idiominc.com/opentopic/exsl/function',
    version: '2.0',
    'exclude-result-prefixes': 'ditaarch opentopic e',
    'e:version': conf.ot_version.toString(),
  });

  root.append(ET.Comment('base imports'));
  const fs = [];
  fs.push('plugin:org.dita.base:xsl/common/dita-utilities.xsl');
  fs.push('plugin:org.dita.base:xsl/common/dita-textonly.xsl');
  fs.push('plugin:org.dita.base:xsl/common/related-links.xsl');

  fs.push('plugin:org.dita.pdf2:xsl/common/attr-set-reflection.xsl');
  fs.push('plugin:org.dita.pdf2:xsl/common/vars.xsl');

  fs.push('plugin:org.dita.pdf2:cfg/fo/attrs/basic-settings.xsl');
  if (conf.override_shell) {
    fs.push(`plugin:${conf.plugin_name}:cfg/fo/attrs/basic-settings.xsl`);
  }
  fs.push('plugin:org.dita.pdf2:cfg/fo/attrs/layout-masters-attr.xsl');
  if (conf.override_shell) {
    fs.push(`plugin:${conf.plugin_name}:cfg/fo/attrs/layout-masters-attr.xsl`);
  }
  fs.push('plugin:org.dita.pdf2:cfg/fo/layout-masters.xsl');
  if (conf.override_shell) {
    fs.push(`plugin:${conf.plugin_name}:cfg/fo/layout-masters.xsl`);
  }
  fs.push('plugin:org.dita.pdf2:cfg/fo/attrs/links-attr.xsl');
  fs.push('plugin:org.dita.pdf2:xsl/fo/links.xsl');
  if (conf.override_shell) {
    fs.push(`plugin:${conf.plugin_name}:xsl/fo/links.xsl`);
  }
  fs.push('plugin:org.dita.pdf2:cfg/fo/attrs/lists-attr.xsl');
  if (conf.override_shell) {
    fs.push(`plugin:${conf.plugin_name}:cfg/fo/attrs/lists-attr.xsl`);
  }
  fs.push('plugin:org.dita.pdf2:xsl/fo/lists.xsl');
  if (conf.override_shell) {
    fs.push(`plugin:${conf.plugin_name}:xsl/fo/lists.xsl`);
  }
  fs.push('plugin:org.dita.pdf2:cfg/fo/attrs/tables-attr.xsl');
  if (conf.override_shell) {
    fs.push(`plugin:${conf.plugin_name}:cfg/fo/attrs/tables-attr.xsl`);
  }
  fs.push('plugin:org.dita.pdf2:xsl/fo/tables.xsl');
  if (conf.override_shell) {
    fs.push(`plugin:${conf.plugin_name}:xsl/fo/tables.xsl`);
  }
  fs.push('plugin:org.dita.pdf2:xsl/fo/root-processing.xsl');
  fs.push('plugin:org.dita.pdf2:cfg/fo/attrs/commons-attr.xsl');
  if (conf.override_shell) {
    fs.push(`plugin:${conf.plugin_name}:cfg/fo/attrs/commons-attr.xsl`);
  }
  fs.push('plugin:org.dita.pdf2:xsl/fo/commons.xsl');
  if (conf.override_shell) {
    fs.push(`plugin:${conf.plugin_name}:xsl/fo/commons.xsl`);
  }
  fs.push('plugin:org.dita.pdf2:cfg/fo/attrs/toc-attr.xsl');
  if (conf.override_shell) {
    fs.push(`plugin:${conf.plugin_name}:cfg/fo/attrs/toc-attr.xsl`);
  }
  fs.push('plugin:org.dita.pdf2:xsl/fo/toc.xsl');
  if (conf.override_shell) {
    fs.push(`plugin:${conf.plugin_name}:xsl/fo/toc.xsl`);
  }
  fs.push('plugin:org.dita.pdf2:xsl/fo/bookmarks.xsl');
  fs.push('plugin:org.dita.pdf2:cfg/fo/attrs/index-attr.xsl');
  fs.push('plugin:org.dita.pdf2:xsl/fo/index.xsl');
  fs.push('plugin:org.dita.pdf2:cfg/fo/attrs/front-matter-attr.xsl');
  if (conf.override_shell) {
    fs.push(`plugin:${conf.plugin_name}:cfg/fo/attrs/front-matter-attr.xsl`);
  }
  fs.push('plugin:org.dita.pdf2:xsl/fo/front-matter.xsl');
  if (conf.override_shell) {
    fs.push(`plugin:${conf.plugin_name}:xsl/fo/front-matter.xsl`);
  }
  fs.push('plugin:org.dita.pdf2:xsl/fo/preface.xsl');

  fs.push('plugin:org.dita.pdf2:cfg/fo/attrs/map-elements-attr.xsl');
  fs.push('plugin:org.dita.pdf2:xsl/fo/map-elements.xsl');

  fs.push('plugin:org.dita.pdf2:cfg/fo/attrs/task-elements-attr.xsl');
  fs.push('plugin:org.dita.pdf2:xsl/fo/task-elements.xsl');

  fs.push('plugin:org.dita.pdf2:cfg/fo/attrs/reference-elements-attr.xsl');
  fs.push('plugin:org.dita.pdf2:xsl/fo/reference-elements.xsl');

  fs.push('plugin:org.dita.pdf2:cfg/fo/attrs/sw-domain-attr.xsl');
  fs.push('plugin:org.dita.pdf2:xsl/fo/sw-domain.xsl');
  fs.push('plugin:org.dita.pdf2:cfg/fo/attrs/pr-domain-attr.xsl');
  if (conf.override_shell) {
    fs.push(`plugin:${conf.plugin_name}:cfg/fo/attrs/pr-domain-attr.xsl`);
  }
  fs.push('plugin:org.dita.pdf2:xsl/fo/pr-domain.xsl');
  if (conf.override_shell) {
    fs.push(`plugin:${conf.plugin_name}:xsl/fo/pr-domain.xsl`);
  }
  fs.push('plugin:org.dita.pdf2:cfg/fo/attrs/hi-domain-attr.xsl');
  fs.push('plugin:org.dita.pdf2:xsl/fo/hi-domain.xsl');
  fs.push('plugin:org.dita.pdf2:cfg/fo/attrs/ui-domain-attr.xsl');
  fs.push('plugin:org.dita.pdf2:xsl/fo/ui-domain.xsl');
  fs.push('plugin:org.dita.pdf2:xsl/fo/ut-domain.xsl');
  fs.push('plugin:org.dita.pdf2:xsl/fo/abbrev-domain.xsl');
  fs.push('plugin:org.dita.pdf2:cfg/fo/attrs/markup-domain-attr.xsl');
  fs.push('plugin:org.dita.pdf2:xsl/fo/markup-domain.xsl');
  fs.push('plugin:org.dita.pdf2:cfg/fo/attrs/xml-domain-attr.xsl');
  fs.push('plugin:org.dita.pdf2:xsl/fo/xml-domain.xsl');

  fs.push('plugin:org.dita.pdf2:cfg/fo/attrs/static-content-attr.xsl');
  if (conf.override_shell) {
    fs.push(`plugin:${conf.plugin_name}:cfg/fo/attrs/static-content-attr.xsl`);
  }
  fs.push('plugin:org.dita.pdf2:xsl/fo/static-content.xsl');
  if (conf.override_shell) {
    fs.push(`plugin:${conf.plugin_name}:xsl/fo/static-content.xsl`);
  }
  fs.push('plugin:org.dita.pdf2:cfg/fo/attrs/glossary-attr.xsl');
  fs.push('plugin:org.dita.pdf2:xsl/fo/glossary.xsl');
  fs.push('plugin:org.dita.pdf2:cfg/fo/attrs/lot-lof-attr.xsl');
  fs.push('plugin:org.dita.pdf2:xsl/fo/lot-lof.xsl');

  fs.push('plugin:org.dita.pdf2:cfg/fo/attrs/learning-elements-attr.xsl');
  fs.push('plugin:org.dita.pdf2:xsl/fo/learning-elements.xsl');

  fs.push('plugin:org.dita.pdf2:xsl/fo/flagging.xsl');
  fs.push('plugin:org.dita.pdf2:xsl/fo/flagging-from-preprocess.xsl');

  fs.forEach((i) => {
    ET.SubElement(root, xsl('import'), { href: i });
  });

  root.append(ET.Comment('formatter specific imports'));
  get_formatter_imports(conf.formatter).forEach((i) => {
    ET.SubElement(root, xsl('import'), { href: i });
  });

  if (!conf.override_shell) {
    root.append(ET.Comment('configuration overrides'));
    ET.SubElement(root, xsl('import'), { href: 'cfg:fo/attrs/custom.xsl' });
    ET.SubElement(root, xsl('import'), { href: 'cfg:fo/xsl/custom.xsl' });
  }

  root.append(ET.Comment('parameters'));

  //ditagen.generator.indent(root)
  const d = new ET.ElementTree(root);
  return d.write({ indent: 2 });
}

function get_formatter_imports(formatter) {
  let imports = [];
  let plugin = 'plugin:org.dita.pdf2';
  if (formatter === 'ah') {
    plugin = plugin + '.axf';
    imports = [
      'cfg/fo/attrs/tables-attr_axf.xsl',
      'cfg/fo/attrs/toc-attr_axf.xsl',
      'cfg/fo/attrs/index-attr_axf.xsl',
      'xsl/fo/root-processing_axf.xsl',
      'xsl/fo/index_axf.xsl',
    ];
  } else if (formatter === 'fop') {
    plugin = plugin + '.fop';
    imports = [
      'cfg/fo/attrs/commons-attr_fop.xsl',
      'cfg/fo/attrs/tables-attr_fop.xsl',
      'cfg/fo/attrs/toc-attr_fop.xsl',
      'xsl/fo/root-processing_fop.xsl',
      'xsl/fo/index_fop.xsl',
    ];
    imports.push('xsl/fo/tables_fop.xsl', 'xsl/fo/flagging_fop.xsl');
  } else if (formatter === 'xep') {
    plugin = plugin + '.xep';
    imports = [
      'cfg/fo/attrs/commons-attr_xep.xsl',
      'cfg/fo/attrs/layout-masters-attr_xep.xsl',
      'xsl/fo/root-processing_xep.xsl',
      'xsl/fo/index_xep.xsl',
    ];
  }
  return _(imports)
    .map((i) => plugin + ':' + i)
    .value();
}

module.exports = generate;
