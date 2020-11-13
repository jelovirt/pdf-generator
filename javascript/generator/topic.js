'use strict';

import _ from 'lodash';
import ET from './elementtree';
import { fo, xsl, copy_xml } from './utils';

function generate_custom(root, conf) {}

function generate_custom_attr(root, conf) {}

module.exports = {
  xsl: generate_custom,
  attr: generate_custom_attr,
};
