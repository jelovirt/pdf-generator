'use strict';

import { Element } from './elementtree';
import { xsl, copy_xml, value } from './utils';
import Generator from './index';

export function generate_custom(root: Element, conf: Generator) {
  if (conf.style.codeblock['line-numbering']) {
    copy_xml(
      root,
      `
          <xsl:template match="node()" mode="codeblock.generate-line-number" as="xs:boolean">
            <xsl:sequence select="true()"/>
          </xsl:template>
        `
    );
  }
}

export function generate_custom_attr(root: Element, conf: Generator) {
  // codeblock
  // const pre_attr = ET.SubElement(root, xsl('attribute-set'), {
  //   name: 'codeblock',
  // });
  conf.attribute_set(root, 'codeblock', 'codeblock');
  // _.forEach(conf.style.codeblock, (v, k) => {
  //   ET.SubElement(pre_attr, xsl('attribute'), { name: k }).text = value(k, v);
  // });
}
