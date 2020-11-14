'use strict';

import _ from 'lodash';
import ET from './elementtree';
import { xsl, copy_xml, value } from './utils';

export function generate_custom(root, conf) {
  if (
    _.has(conf.style.codeblock, 'line-numbering') &&
    conf.style.codeblock['line-numbering']
  ) {
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

export function generate_custom_attr(root, conf) {
  // codeblock
  const pre_attr = ET.SubElement(root, xsl('attribute-set'), {
    name: 'codeblock',
  });
  _.forEach(conf.style.codeblock, (v, k) => {
    ET.SubElement(pre_attr, xsl('attribute'), { name: k }).text = value(k, v);
  });
}
