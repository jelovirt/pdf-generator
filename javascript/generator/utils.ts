'use strict';

import { parse, Element } from './elementtree';
import { Property } from '../lib/styles';

export function copy_xml(root: Element, raw: string) {
  const r = parse(
    `
<xsl:stylesheet xmlns:fo="http://www.w3.org/1999/XSL/Format"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:e="e"
                xmlns:opentopic="http://www.idiominc.com/opentopic"
                xmlns:opentopic-func="http://www.idiominc.com/opentopic/exsl/function"
                exclude-result-prefixes="e opentopic opentopic-func"
                version="2.0">${raw}</xsl:stylesheet>`
  ).getroot();
  for (let i = 0; i < r.len(); i++) {
    root.append(r.getItem(i)!);
  }
}

export function xsl(elem: string) {
  return '{http://www.w3.org/1999/XSL/Transform}' + elem;
}

export function fo(elem: string) {
  return '{http://www.w3.org/1999/XSL/Format}' + elem;
}

export function catalog(elem: string) {
  return '{urn:oasis:names:tc:entity:xmlns:xml:catalog}' + elem;
}

export function value(property: Property, value: any) {
  if (property === 'start-indent') {
    return `from-parent(start-indent) + ${value}`;
  } else if (property === 'end-indent') {
    return `from-parent(end-indent) + ${value}`;
  }
  return value;
}
