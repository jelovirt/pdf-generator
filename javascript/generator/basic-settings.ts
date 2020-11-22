import _ from 'lodash';
import { xsl } from './utils';
import { Element, SubElement } from './elementtree';
import Generator from './index';

export function generate_custom(root: Element, conf: Generator) {}

export function generate_custom_attr(root: Element, conf: Generator) {
  SubElement(root, 'xsl:param', {
    name: 'pdfFormatter',
    select: `'${conf.formatter}'`,
  });
  SubElement(root, 'xsl:param', {
    name: 'tocMaximumLevel',
    select: conf.toc_maximum_level.toString(),
  });
  // page size
  SubElement(root, xsl('variable'), { name: 'page-width' }).text =
    conf.page.width;
  SubElement(root, xsl('variable'), { name: 'page-height' }).text =
    conf.page.height;
  // mirror pages
  if (conf.mirror_page_margins) {
    SubElement(root, xsl('variable'), {
      name: 'mirror-page-margins',
      select: 'true()',
    });
  }
  // page margins
  ['top', 'outside', 'bottom', 'inside'].forEach((k) => {
    const v = conf.page[k as 'top' | 'outside' | 'bottom' | 'inside'];
    if (v) {
      SubElement(root, xsl('variable'), {
        name: `page-margin-${k}`,
      }).text = v;
    }
  });
  // font size
  if (_.has(conf.style.body, 'font-size')) {
    SubElement(root, xsl('variable'), { name: 'default-font-size' }).text =
      conf.style.body['font-size'];
  }
  // line height
  if (_.has(conf.style.body, 'line-height')) {
    SubElement(root, xsl('variable'), { name: 'default-line-height' }).text =
      conf.style.body['line-height'];
  }
  // body indent
  if (_.has(conf.style.body, 'start-indent')) {
    SubElement(root, xsl('variable'), { name: 'side-col-width' }).text =
      conf.style.body['start-indent'];
  }
}
