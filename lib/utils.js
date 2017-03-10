'use strict'

const ET = require('./elementtree')

function copy_xml(root, raw) {
  const r = ET.parse(`
<xsl:stylesheet xmlns:fo="http://www.w3.org/1999/XSL/Format"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:e="e"
                xmlns:opentopic="http://www.idiominc.com/opentopic"
                xmlns:opentopic-func="http://www.idiominc.com/opentopic/exsl/function"
                exclude-result-prefixes="e opentopic opentopic-func"
                version="2.0">${raw}</xsl:stylesheet>`).getroot()
  for (let i = 0; i < r.len(); i++) {
    root.append(r.getItem(i))
  }
}

function xsl(elem) {
  return '{http://www.w3.org/1999/XSL/Transform}' + elem
}

function fo(elem) {
  return '{http://www.w3.org/1999/XSL/Format}' + elem
}

function catalog(elem) {
  return '{urn:oasis:names:tc:entity:xmlns:xml:catalog}' + elem
}

module.exports = {
  xsl: xsl,
  fo: fo,
  catalog: catalog,
  copy_xml: copy_xml
}