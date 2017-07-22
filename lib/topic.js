'use strict'

const _  = require('lodash')
const ET = require('./elementtree')
const utils = require('./utils')

const xsl = utils.xsl
const fo = utils.fo

function generate_custom(root, conf) {

}

function generate_custom_attr(root, conf) {

}

module.exports = {
  xsl: generate_custom,
  attr: generate_custom_attr
}
