'use strict'

const _ = require('lodash');
const express = require('express');
const router = express.Router();

const multer = require('multer')  // v1.0.5
const upload = multer() // for parsing multipart/form-data

const generator = require('../generator')

router.get('/', function (req, res, next) {
  res.render('index', {title: 'PDF Plugin Generator'});
});

router.post('/', upload.array(), function (req, res, next) {
  const args = read_arguments(req)
  const body = process(args)

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/zip')
  const file_name = args['id'] + '.zip'
  res.setHeader('Content-Disposition', `attachment; filename=${file_name}`)
  res.setHeader('Content-Length', body.length)
  res.end(body)
});


function read_arguments(req) {
  let __ret = {}
  if (_.has(req.body, "ot_version")) {
    __ret["ot_version"] = req.body["ot_version"]
  }
  if (_.has(req.body, "id")) {
    __ret["id"] = req.body["id"]
  }
  if (_.has(req.body, "plugin-name")) {
    __ret["plugin_name"] = req.body["plugin-name"]
  }
  if (_.has(req.body, "plugin-version") && req.body["plugin-version"].trim()) {
    __ret["plugin_version"] = req.body["plugin-version"]
  }
  __ret["transtype"] = req.body["transtype"]
  let __config = {}

  __config.page = {}
  // TODO page size and orientation in UI
  if (req.body['page-size']) {
    const s = req.body['page-size'].split(' ')
    if (req.body['orientation'] === 'landscape') {
      s.reverse()
    }
    __config.page.width = s[0]
    __config.page.height = s[1]
  }
  if (_.has(req.body, "page-margin-top") && req.body["page-margin-top"].trim()) {
    __config.page.top = req.body["page-margin-top"]
  }
  if (_.has(req.body, "page-margin-outside") && req.body["page-margin-outside"].trim()) {
    __config.page.outside = req.body["page-margin-outside"]
  }
  if (_.has(req.body, "page-margin-bottom") && req.body["page-margin-bottom"].trim()) {
    __config.page.bottom = req.body["page-margin-bottom"]
  }
  if (_.has(req.body, "page-margin-inside") && req.body["page-margin-inside"].trim()) {
    __config.page.inside = req.body["page-margin-inside"]
  }

  __config.style = {}
  const types = _(generator.styles).map((f, k) => {
    return k
  }).uniq().value()
  const properties = _(generator.styles).map((f, k) => {
    return _.map(f, (v, p) => {
      return p
    })
  }).flatten().uniq().value()
  types.forEach((__type) => {
    let group = {}
    properties.forEach((__property) => {
      let v = req.body[`${__property}.${__type}`]
      if (v) {
        switch (typeof generator.styles[__type][__property].default) {
          case 'boolean':
            group[__property] = (v === 'true')
            break
          case 'number':
            group[__property] = new Number(v)
            break
          default:
            group[__property] = v
        }
      }
    })
    __config["style"][__type] = group
  })

  __config["force_page_count"] = req.body["force-page-count"]
  __config["chapter_layout"] = req.body["chapter-layout"]
  __config["bookmark_style"] = req.body["bookmark-style"]
  if (_.has(req.body, "toc-maximum-level")) {
    __config["toc_maximum_level"] = Number(req.body["toc-maximum-level"])
  }
  __config["task_label"] = _.has(req.body, "task-label")
  __config["include_related_links"] = req.body["include-related-links"]
  if (_.has(req.body, "body-column-count")) {
    __config["body_column_count"] = Number(req.body["body-column-count"])
  }
  if (_.has(req.body, "index-column-count")) {
    __config["index_column_count"] = Number(req.body["index-column-count"])
  }
  if (_.has(req.body, "column-gap") && req.body["column-gap"].trim()) {
    __config["column_gap"] = req.body["column-gap"]
  }
  __config["mirror_page_margins"] = _.has(req.body, "mirror-page-margins")
  //ret["dl"] = req.body["dl"]
  __config["title_numbering"] = req.body["title-numbering"]
  //ret["table_numbering"] = req.body["table-numbering"]
  //ret["figure_numbering"] = req.body["figure-numbering"]
  //ret["link_pagenumber"] = _.has(req.body, "link-page-number")
  __config["table_continued"] = _.has(req.body, "table-continued")
  __config["formatter"] = req.body["formatter"]
  __config["override_shell"] = _.has(req.body, "override_shell")
  //if (_.has(req.body, "cover_image")) { //&& req.file !== undefined
  //  ret["cover_image"] = req.body["cover_image"]
  //  __config["cover_image_name"] = self.request.POST["cover_image"].filename
  //}
  if (_.has(req.body, "cover_image_metadata")) {
    __config["cover_image_metadata"] = req.body["cover_image_metadata"]
  }
  if (_.has(req.body, "cover_image_topic")) {
    __config["cover_image_topic"] = req.body["cover_image_topic"]
  }
  // TODO handle drop folio in UI
  if (req.body["drop-folio"]) {
    __config["header"] = {
      "odd": (req.body["header.even"] || '').trim().split(/\s+/),
      "even": (req.body["header.odd"] || '').trim().split(/\s+/)
    }
    __config["footer"] = {
      "odd": ["pagenum"],
      "even": ["pagenum"]
    }
  } else {
    const __header_folio = ["pagenum"]
    __config["header"] = {
      "odd": (req.body["header.even"] || '').trim().split(/\s+/).concat(__header_folio),
      "even": __header_folio.concat((req.body["header.odd"] || '').trim().split(/\s+/))
    }
    __config["footer"] = {
      "odd": [],
      "even": []
    }
  }
  if (_.has(req.body, "page-number")) {
    __config["page_number"] = req.body["page-number"]
  }
  __ret["configuration"] = __config

  return __ret
}

function process(__args) {
  const __dita_gen = new generator.Generator()

  //validate
  if (!_.has(__args, 'ot_version')) {
    throw new Error("version missing")
  }
  __dita_gen.ot_version = new generator.Version(__args["ot_version"])
  if (!_.has(__args, 'id')) {
    throw new Error("id missing")
  }
  if (_.has(__args, 'plugin_name')) {
    __dita_gen.plugin_name = __args["plugin_name"]
  } else {
    __dita_gen.plugin_name = __args["id"]
  }
  if (_.has(__args, "plugin_version")) {
    __dita_gen.plugin_version = __args["plugin_version"]
  }
  __dita_gen.transtype = __args.transtype

  const __config = __args.configuration
  __dita_gen.page = __config.page
  __dita_gen.style = __config.style
  __dita_gen.force_page_count = __config["force_page_count"]
  __dita_gen.chapter_layout = __config["chapter_layout"]
  __dita_gen.bookmark_style = __config["bookmark_style"]
  __dita_gen.toc_maximum_level = __config["toc_maximum_level"]
  __dita_gen.task_label = __config["task_label"]
  __dita_gen.include_related_links = __config["include_related_links"]
  if (_.has(__config, 'body_column_count')) {
    __dita_gen.body_column_count = __config["body_column_count"]
  }
  if (_.has(__config, 'index_column_count')) {
    __dita_gen.index_column_count = __config["index_column_count"]
  }
  if (_.has(__config, 'column_gap')) {
    __dita_gen.column_gap = __config["column_gap"]
  }
  __dita_gen.mirror_page_margins = __config["mirror_page_margins"]
  //__dita_gen.dl = __config["dl"]
  __dita_gen.title_numbering = __config["title_numbering"]
  //__dita_gen.table_numbering = __config["table_numbering"]
  //__dita_gen.figure_numbering = __config["figure_numbering"]
  //__dita_gen.link_pagenumber = __config["link_pagenumber"]
  __dita_gen.table_continued = __config["table_continued"]
  __dita_gen.formatter = __config["formatter"]
  __dita_gen.override_shell = __config["override_shell"]
  //if ("cover_image" in self.request.arguments() && type(self.request.POST["cover_image"]) != unicode) {
  //  __dita_gen.cover_image = self.request.get("cover_image")
  //  __dita_gen.cover_image_name = self.request.POST["cover_image"].filename
  //}
  if (_.has(__config, 'cover_image_metadata')) {
    __dita_gen.cover_image_metadata = __config["cover_image_metadata"]
  }
  if (_.has(__config, 'cover_image_topic')) {
    __dita_gen.cover_image_topic = __config["cover_image_topic"]
  }
  __dita_gen.header = __config["header"]
  __dita_gen.footer = __config["footer"]
  if (_.has(__config, 'page_number')) {
    __dita_gen.page_number = __config["page_number"]
  }

  return __dita_gen.generate_plugin()
}

module.exports = router;
