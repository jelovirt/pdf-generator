define([
  '../../app/pdf-utils',
  'rx',
  'styles'
], function (Utils,
             Rx,
             styles) {
  function StyleController() {
    const view = StyleView()
    const styleModel = StyleModel()
    const allFields = getAllFields()

    styleModel.change.subscribe(previewSpaceHandler)
    styleModel.fields.change()

    _.forEach(allFields, function (field) {
      view.$styleForm.find(":input[id='" + field + "']").change(styleEditorHandler)
    })

    var pdfStyleSelectorCurrent
    view.$styleSelector.change(styleHandler).val('body').change()

    function getAllFields() {
      return _(styles).map(function (pv, e) {
        return _.map(pv, function (v, p) {
          return p
        })
      }).flatten().unique().value()
    }

    // Style dialog methods

    function previewSpaceHandler(event) {
      var input = $(event.target)
      var id = input.attr('name')
      var idx = id.indexOf(".")
      var field = id.substring(0, idx)
      var type = id.substring(idx + 1)

      var v = Utils.getVal(input)
      if (v === undefined && input.data('inherit') !== undefined) {
        v = Utils.getVal($(":input[name='" + field + "." + input.data('inherit') + "']"))
      }

      var isLength = false
      var property
      switch (field) {
        case 'space-before':
          property = 'margin-top'
          isLength = true
          break
        case 'space-after':
          property = 'margin-bottom'
          isLength = true
          break
        case 'start-indent':
          property = 'margin-left'
          isLength = true
          break
        case 'font-size':
          property = field
          isLength = true
          break
        case 'line-height':
          property = field
          isLength = isNaN(Number(v))
          break
        case 'text-align':
          property = field
          switch (v) {
            case 'start':
              v = 'left'
              break
            case 'end':
              v = 'right'
              break
          }
          break
        default:
          var all = $("[data-field='" + field + "'][data-style='" + type + "']")
          if (all.length) {
            if (all.filter("[data-value]").length) {
              all.hide()
              all.filter("[data-value='" + v + "']").show()
            } else {
              all.text(v)
            }
          } else {
            property = field
          }
          break
      }
      if (property !== undefined) {
        if (isLength) {
          if (v === undefined) { // support undefined values
            return true
          }
          v = Utils.toPt(v)
          var f = 0.9
          v = String(v * f) + 'px'
        }
        $("*[class~='example-page-content-" + type + "']").css(property, v)
      }
    }

    /**
     * Change which style to edit
     * @param event UI change event
     */
    function styleHandler(event) {
      var target = $(event.target)
      var style = target.val()
      view.$styleForm.find('[data-style]').each(function () {
        var f = $(this)
        f.toggle($(this).attr('data-style').split(" ").indexOf(style) !== -1)
      })
      var type = target.find(":selected").parent("optgroup.block")
      if (type.length === 0) {
        $(".style-selector-block").hide().find(":input").attr('disabled', true)
      } else {
        $(".style-selector-block").show().find(":input").removeAttr('disabled')
      }
      pdfStyleSelectorCurrent = target.val()
      styleModel.readFromModel(target.val())
    }

    /**
     * Update store when UI changes
     * @param event UI change event
     */
    function styleEditorHandler(event) {
      var ui = $(event.target)
      var field = ui.attr('id')
      styleModel.writeFieldToModel(field, pdfStyleSelectorCurrent)
    }

    function StyleModel() {
      const $element = $('#style-model')
      const $inputs = $element.find(':input')
      const change = Rx.Observable.fromEvent($inputs, 'change')

      return {
        change: change,
        fields: $inputs,
        field: function (field, type) {
          return $inputs.filter("[name='" + field + "." + type + "']")
        },
        readFromModel: readFromModel,
        writeFieldToModel: writeFieldToModel
      }

      /**
       * Read fields from model to UI.
       * @param type
       */
      function readFromModel(type) {
        for (var i = 0; i < allFields.length; i++) {
          var model = styleModel.field(allFields[i], type)
          // if no value, inherit from body
          if (model.data('inherit') !== undefined && (model.val() === undefined || model.val() === "")) {
            model = styleModel.field(allFields[i], 'body')
          }
          var input = view.$styleForm.find(":input[id='" + allFields[i] + "']")
          if (input.is(":checkbox")) {
            input.prop('checked', model.val() === input.val())
          } else if (input.is(".editable-list")) {
            input.val(model.val())
          } else {
            input.val(model.val())
          }
          input.change()
        }
      }

      function writeFieldToModel(field, type) {
        var input = view.$styleForm.find(":input[id='" + field + "']")
        var model = styleModel.field(field, type)
        var oldValue = model.val()
        var newValue
        if (input.is(":checkbox")) {
          if (input.is(":checked")) {
            newValue = input.val()
          } else if (field === 'text-decoration') {
            newValue = 'none'
          } else {
            newValue = 'normal'
          }
        } else if (input.is(".editable-list")) {
          newValue = input.val()
        } else {
          newValue = input.val()
        }

        // if equals body value, treat as inherit value
        if (model.data('inherit') !== undefined) {
          var b = styleModel.field(field, 'body')//filter("[name='" + field + "." + 'body' + "']")
          if (oldValue === b.val()) {
            newValue = undefined
          }
          // update inheriting model fields
        } else if (type === 'body') {
          styleModel.fields.filter("[data-inherit=body]").each(function () {
            var m = $(this)
            if (m.is("[name^='" + field + "']")) {
              if (m.val() === undefined || m.val() === "" || m.val() === oldValue) {
                m.val(newValue)
                m.change()
              }
            }
          })
        }

        model.val(newValue)
        // fire change event
        model.change()
      }
    }
  }

  //StyleController.styles = {
  //  "body": {
  //    "font-family": {"default": "Times New Roman", "inherit": null},
  //    "font-size": {"default": "10pt", "inherit": null},
  //    "color": {"default": "black", "inherit": null},
  //    "background-color": {"default": "transparent", "inherit": null},
  //    "font-weight": {"default": "normal", "inherit": null},
  //    "font-style": {"default": "normal", "inherit": null},
  //    "text-decoration": {"default": "none", "inherit": null},
  //    "space-before": {"default": "6pt", "inherit": null},
  //    "space-after": {"default": "6pt", "inherit": null},
  //    "text-align": {"default": "start", "inherit": null},
  //    "start-indent": {"default": "25pt", "inherit": null},
  //    "line-height": {"default": "1.2", "inherit": null},
  //  },
  //  "topic": {
  //    "font-family": {"default": "Helvetica", "inherit": null},
  //    "font-size": {"default": "18pt", "inherit": null},
  //    "color": {"default": "black", "inherit": "body"},
  //    "background-color": {"default": "transparent", "inherit": null},
  //    "font-weight": {"default": "bold", "inherit": null},
  //    "font-style": {"default": "normal", "inherit": null},
  //    "text-decoration": {"default": "none", "inherit": "body"},
  //    "space-before": {"default": "0pt", "inherit": null},
  //    "space-after": {"default": "16.8pt", "inherit": null},
  //    "text-align": {"default": "start", "inherit": null},
  //    "start-indent": {"default": "0pt", "inherit": null},
  //    "line-height": {"default": null, "inherit": "body"},
  //    // custom
  //    "title-numbering": {"default": true, "inherit": null},
  //  },
  //  "topic_topic": {
  //    "font-family": {"default": "Helvetica", "inherit": null},
  //    "font-size": {"default": "14pt", "inherit": null},
  //    "color": {"default": "black", "inherit": "body"},
  //    "background-color": {"default": "transparent", "inherit": null},
  //    "font-weight": {"default": "bold", "inherit": null},
  //    "font-style": {"default": "normal", "inherit": null},
  //    "text-decoration": {"default": "none", "inherit": "body"},
  //    "space-before": {"default": "12pt", "inherit": null},
  //    "space-after": {"default": "5pt", "inherit": null},
  //    "text-align": {"default": "start", "inherit": null},
  //    "start-indent": {"default": "0pt", "inherit": null},
  //    "line-height": {"default": null, "inherit": "body"},
  //    // custom
  //    "title-numbering": {"default": false, "inherit": null},
  //  },
  //  "topic_topic_topic": {
  //    "font-family": {"default": "Helvetica", "inherit": null},
  //    "font-size": {"default": "12pt", "inherit": null},
  //    "color": {"default": "black", "inherit": "body"},
  //    "background-color": {"default": "transparent", "inherit": null},
  //    "font-weight": {"default": "bold", "inherit": null},
  //    "font-style": {"default": "normal", "inherit": null},
  //    "text-decoration": {"default": "none", "inherit": "body"},
  //    "space-before": {"default": "12pt", "inherit": null},
  //    "space-after": {"default": "2pt", "inherit": null},
  //    "text-align": {"default": "start", "inherit": null},
  //    "start-indent": {"default": "0pt", "inherit": null},
  //    "line-height": {"default": null, "inherit": "body"},
  //    // custom
  //    "title-numbering": {"default": false, "inherit": null},
  //  },
  //  "topic_topic_topic_topic": {
  //    "font-family": {"default": "Times New Roman", "inherit": "body"},
  //    "font-size": {"default": "10pt", "inherit": "body"},
  //    "color": {"default": "black", "inherit": "body"},
  //    "background-color": {"default": "transparent", "inherit": null},
  //    "font-weight": {"default": "bold", "inherit": null},
  //    "font-style": {"default": "normal", "inherit": null},
  //    "text-decoration": {"default": "none", "inherit": "body"},
  //    "space-before": {"default": "12pt", "inherit": null},
  //    "space-after": {"default": "0pt", "inherit": null},
  //    "text-align": {"default": "start", "inherit": null},
  //    "start-indent": {"default": null, "inherit": "body"},
  //    "line-height": {"default": null, "inherit": "body"},
  //    // custom
  //    "title-numbering": {"default": false, "inherit": null},
  //  },
  //  "section": {
  //    "font-family": {"default": "Helvetica", "inherit": null},
  //    "font-size": {"default": null, "inherit": "body"},
  //    "color": {"default": null, "inherit": "body"},
  //    "background-color": {"default": "transparent", "inherit": null},
  //    "font-weight": {"default": null, "inherit": "body"},
  //    "font-style": {"default": null, "inherit": "body"},
  //    "text-decoration": {"default": null, "inherit": "body"},
  //    "space-before": {"default": "15pt", "inherit": null},
  //    "space-after": {"default": null, "inherit": "body"},
  //    "text-align": {"default": null, "inherit": "body"},
  //    "start-indent": {"default": null, "inherit": "body"},
  //    "line-height": {"default": null, "inherit": "body"},
  //  },
  //  "note": {
  //    "font-family": {"default": null, "inherit": "body"},
  //    "font-size": {"default": null, "inherit": "body"},
  //    "color": {"default": null, "inherit": "body"},
  //    "background-color": {"default": "transparent", "inherit": null},
  //    "font-weight": {"default": null, "inherit": "body"},
  //    "font-style": {"default": null, "inherit": "body"},
  //    "text-decoration": {"default": null, "inherit": "body"},
  //    "space-before": {"default": null, "inherit": "body"},
  //    "space-after": {"default": null, "inherit": "body"},
  //    "text-align": {"default": null, "inherit": "body"},
  //    "start-indent": {"default": null, "inherit": "body"},
  //    "line-height": {"default": null, "inherit": "body"},
  //    // custom
  //    "icon": {"default": "icon", "inherit": null},
  //  },
  //  "pre": {
  //    "font-family": {"default": "Monaco", "inherit": null},
  //    "font-size": {"default": null, "inherit": "body"},
  //    "color": {"default": null, "inherit": "body"},
  //    "background-color": {"default": "transparent", "inherit": null},
  //    "font-weight": {"default": null, "inherit": "body"},
  //    "font-style": {"default": null, "inherit": "body"},
  //    "text-decoration": {"default": null, "inherit": "body"},
  //    "space-before": {"default": "15pt", "inherit": null},
  //    "space-after": {"default": null, "inherit": "body"},
  //    "text-align": {"default": null, "inherit": "body"},
  //    "start-indent": {"default": null, "inherit": "body"},
  //    "line-height": {"default": null, "inherit": "body"},
  //  },
  //  "codeblock": {
  //    "font-family": {"default": "Monaco", "inherit": null},
  //    "font-size": {"default": null, "inherit": "body"},
  //    "color": {"default": null, "inherit": "body"},
  //    "background-color": {"default": "transparent", "inherit": null},
  //    "font-weight": {"default": null, "inherit": "body"},
  //    "font-style": {"default": null, "inherit": "body"},
  //    "text-decoration": {"default": null, "inherit": "body"},
  //    "space-before": {"default": "15pt", "inherit": null},
  //    "space-after": {"default": null, "inherit": "body"},
  //    "text-align": {"default": null, "inherit": "body"},
  //    "start-indent": {"default": "31pt", "inherit": "body"},//+6pt
  //    "line-height": {"default": null, "inherit": "body"},
  //  },
  //  "dl": {
  //    "font-family": {"default": null, "inherit": "body"},
  //    "font-size": {"default": null, "inherit": "body"},
  //    "color": {"default": null, "inherit": "body"},
  //    "background-color": {"default": null, "inherit": "body"},
  //    "font-weight": {"default": null, "inherit": "body"},
  //    "font-style": {"default": null, "inherit": "body"},
  //    "text-decoration": {"default": null, "inherit": "body"},
  //    "space-before": {"default": null, "inherit": "body"},
  //    "space-after": {"default": null, "inherit": "body"},
  //    "text-align": {"default": null, "inherit": "body"},
  //    "start-indent": {"default": null, "inherit": "body"},
  //    "line-height": {"default": null, "inherit": "body"},
  //    // custom
  //    "dl-type": {"default": "table", "inherit": null},
  //  },
  //  "ol": {
  //    "font-family": {"default": null, "inherit": "body"},
  //    "font-size": {"default": null, "inherit": "body"},
  //    "color": {"default": null, "inherit": "body"},
  //    "background-color": {"default": null, "inherit": "body"},
  //    "font-weight": {"default": null, "inherit": "body"},
  //    "font-style": {"default": null, "inherit": "body"},
  //    "text-decoration": {"default": null, "inherit": "body"},
  //    "space-before": {"default": null, "inherit": "body"},
  //    "space-after": {"default": null, "inherit": "body"},
  //    "text-align": {"default": null, "inherit": "body"},
  //    "start-indent": {"default": null, "inherit": "body"},
  //    "line-height": {"default": null, "inherit": "body"},
  //    // custom
  //    "ol-1": {"default": "1", "inherit": null},
  //    "ol-2": {"default": "1", "inherit": null},
  //    "ol-3": {"default": "1", "inherit": null},
  //    "ol-4": {"default": "1", "inherit": null},
  //    "ol-before-1": {"default": "", "inherit": null},
  //    "ol-before-2": {"default": "", "inherit": null},
  //    "ol-before-3": {"default": "", "inherit": null},
  //    "ol-before-4": {"default": "", "inherit": null},
  //    "ol-after-1": {"default": ". ", "inherit": null},
  //    "ol-after-2": {"default": ". ", "inherit": null},
  //    "ol-after-3": {"default": ". ", "inherit": null},
  //    "ol-after-4": {"default": ". ", "inherit": null},
  //    "ol-sublevel": {"default": false, "inherit": null},
  //  },
  //  "ul": {
  //    "font-family": {"default": null, "inherit": "body"},
  //    "font-size": {"default": null, "inherit": "body"},
  //    "color": {"default": null, "inherit": "body"},
  //    "background-color": {"default": null, "inherit": "body"},
  //    "font-weight": {"default": null, "inherit": "body"},
  //    "font-style": {"default": null, "inherit": "body"},
  //    "text-decoration": {"default": null, "inherit": "body"},
  //    "space-before": {"default": null, "inherit": "body"},
  //    "space-after": {"default": null, "inherit": "body"},
  //    "text-align": {"default": null, "inherit": "body"},
  //    "start-indent": {"default": null, "inherit": "body"},
  //    "line-height": {"default": null, "inherit": "body"},
  //    // custom
  //    "ul-1": {"default": "\u2022", "inherit": null},
  //    "ul-2": {"default": "\u2022", "inherit": null},
  //    "ul-3": {"default": "\u2022", "inherit": null},
  //    "ul-4": {"default": "\u2022", "inherit": null},
  //  },
  //  "table": {
  //    "font-family": {"default": null, "inherit": "body"},
  //    "font-size": {"default": null, "inherit": "body"},
  //    "color": {"default": null, "inherit": "body"},
  //    "background-color": {"default": null, "inherit": "body"},
  //    "font-weight": {"default": null, "inherit": "body"},
  //    "font-style": {"default": null, "inherit": "body"},
  //    "text-decoration": {"default": null, "inherit": "body"},
  //    "space-before": {"default": null, "inherit": "body"},
  //    "space-after": {"default": null, "inherit": "body"},
  //    "text-align": {"default": null, "inherit": "body"},
  //    "start-indent": {"default": null, "inherit": "body"},
  //    "line-height": {"default": null, "inherit": "body"},
  //    // custom
  //    "caption-number": {"default": "document", "inherit": null},
  //    "caption-position": {"default": "before", "inherit": null},
  //  },
  //  "fig": {
  //    "font-family": {"default": null, "inherit": "body"},
  //    "font-size": {"default": null, "inherit": "body"},
  //    "color": {"default": null, "inherit": "body"},
  //    "background-color": {"default": null, "inherit": "body"},
  //    "font-weight": {"default": null, "inherit": "body"},
  //    "font-style": {"default": null, "inherit": "body"},
  //    "text-decoration": {"default": null, "inherit": "body"},
  //    "space-before": {"default": null, "inherit": "body"},
  //    "space-after": {"default": null, "inherit": "body"},
  //    "text-align": {"default": null, "inherit": "body"},
  //    "start-indent": {"default": null, "inherit": "body"},
  //    "line-height": {"default": null, "inherit": "body"},
  //    // custom
  //    "caption-number": {"default": "document", "inherit": null},
  //    "caption-position": {"default": "after", "inherit": null},
  //  },
  //  "link": {
  //    "font-family": {"default": null, "inherit": "body"},
  //    "font-size": {"default": null, "inherit": "body"},
  //    "color": {"default": "blue", "inherit": null},
  //    "background-color": {"default": "transparent", "inherit": null},
  //    "font-weight": {"default": null, "inherit": "body"},
  //    "font-style": {"default": null, "inherit": "body"},
  //    "text-decoration": {"default": null, "inherit": "body"},
  //    //"space-before": { "default": null, "inherit": null },
  //    //"space-after": { "default": null, "inherit": null },
  //    //"text-align": { "default": null, "inherit": null },
  //    //"start-indent": { "default": null, "inherit": null },
  //    "line-height": {"default": null, "inherit": null},
  //    // custom
  //    "link-page-number": {"default": true, "inherit": null},
  //    "link-url": {"default": false, "inherit": null}
  //  }
  //}

  function StyleView() {
    return {
      $element: $('#p4'),
      $styleForm: $('#style-form'),
      $styleSelector: $('#style-selector')
    }
  }

  return StyleController
})