'use strict'

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser')
const router = express.Router();

const multer = require('multer')  // v1.0.5
const upload = multer() // for parsing multipart/form-data

const generator = require('../generator')
const styles = require('../javascript/lib/styles').styles
const Version = require('../lib/version')

router.get('/', function(req, res, next) {
  res.render('index', {title: 'PDF Plugin Generator'});
});

router.post('/', bodyParser.urlencoded({extended: false}), function(req, res, next) { // upload.array()
                                                                                      // app.use(bodyParser.json());
                                                                                      // app.use(bodyParser.urlencoded({extended: false}));
  // const args = read_arguments(req)
  const args = JSON.parse(req.body.json)
  const body = process(args)

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/zip')
  const file_name = args['id'] + '.zip'
  res.setHeader('Content-Disposition', `attachment; filename=${file_name}`)
  res.setHeader('Content-Length', body.length)
  res.end(body)
});

function process(__args) {
  const __dita_gen = new generator.Generator()

  //validate
  if(!_.has(__args, 'ot_version')) {
    throw new Error("version missing")
  }
  __dita_gen.ot_version = new Version(__args["ot_version"])
  if(!_.has(__args, 'id')) {
    throw new Error("id missing")
  }
  if(_.has(__args, 'plugin_name')) {
    __dita_gen.plugin_name = __args["plugin_name"]
  } else {
    __dita_gen.plugin_name = __args["id"]
  }
  if(_.has(__args, "plugin_version")) {
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
  if(_.has(__config, 'body_column_count')) {
    __dita_gen.body_column_count = __config["body_column_count"]
  }
  if(_.has(__config, 'index_column_count')) {
    __dita_gen.index_column_count = __config["index_column_count"]
  }
  if(_.has(__config, 'column_gap')) {
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
  if(_.has(__config, 'cover_image_metadata')) {
    __dita_gen.cover_image_metadata = __config["cover_image_metadata"]
  }
  if(_.has(__config, 'cover_image_topic')) {
    __dita_gen.cover_image_topic = __config["cover_image_topic"]
  }
  __dita_gen.header = __config["header"]
  __dita_gen.footer = __config["footer"]
  if(_.has(__config, 'page_number')) {
    __dita_gen.page_number = __config["page_number"]
  }
  __dita_gen.options = {
    blank_pages: __config.blank_pages
  }

  return __dita_gen.generate_plugin()
}

module.exports = router;
