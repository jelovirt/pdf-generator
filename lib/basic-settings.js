'use strict';

const _ = require('lodash');
const ET = require('./elementtree');
const utils = require('./utils');

const xsl = utils.xsl;
const fo = utils.fo;

function generate_custom(root, conf) {}

function generate_custom_attr(root, conf) {
  ET.SubElement(root, 'xsl:param', {
    name: 'pdfFormatter',
    select: `'${conf.formatter}'`,
  });
  ET.SubElement(root, 'xsl:param', {
    name: 'tocMaximumLevel',
    select: conf.toc_maximum_level,
  });
  // page size
  ET.SubElement(root, xsl('variable'), { name: 'page-width' }).text =
    conf.page.width;
  ET.SubElement(root, xsl('variable'), { name: 'page-height' }).text =
    conf.page.height;
  // mirror pages
  if (conf.mirror_page_margins) {
    ET.SubElement(root, xsl('variable'), {
      name: 'mirror-page-margins',
      select: 'true()',
    });
  }
  // page margins
  ['top', 'outside', 'bottom', 'inside'].forEach((k) => {
    const v = conf.page[k];
    if (v) {
      ET.SubElement(root, xsl('variable'), {
        name: `page-margin-${k}`,
      }).text = v;
    }
  });
  // font size
  if (_.has(conf.style.body, 'font-size')) {
    ET.SubElement(root, xsl('variable'), { name: 'default-font-size' }).text =
      conf.style.body['font-size'];
  }
  // line height
  if (_.has(conf.style.body, 'line-height')) {
    ET.SubElement(root, xsl('variable'), { name: 'default-line-height' }).text =
      conf.style.body['line-height'];
  }
  // body indent
  if (_.has(conf.style.body, 'start-indent')) {
    ET.SubElement(root, xsl('variable'), { name: 'side-col-width' }).text =
      conf.style.body['start-indent'];
  }
}

module.exports = {
  xsl: generate_custom,
  attr: generate_custom_attr,
};
