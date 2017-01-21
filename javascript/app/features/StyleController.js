import $ from 'jquery'
import StyleView from '../../app/features/StyleView'
import Utils from '../../app/pdf-utils'
import Rx from 'rx'
import styles from '../../lib/styles'

export default function StyleController() {
  const view = StyleView()
  const styleModel = StyleModel()
  const allFields = getAllFields()

  styleModel.change.subscribe(previewSpaceHandler)
  styleModel.fields.change()

  _.forEach(allFields, function(field) {
    view.$styleForm.find(":input[id='" + field + "']").change(styleEditorHandler)
  })

  var pdfStyleSelectorCurrent
  view.$styleSelector.change(styleHandler).val('body').change()

  function getAllFields() {
    return _(styles.styles).map(function(pv, e) {
      return _.map(pv, function(v, p) {
        return p
      })
    }).flatten().uniq().value()
  }

  // Style dialog methods

  function previewSpaceHandler(event) {
    var input = $(event.target)
    var id = input.attr('name')
    var idx = id.indexOf(".")
    var field = id.substring(0, idx)
    var type = id.substring(idx + 1)

    var v = Utils.getVal(input)
    if(v === undefined && input.data('inherit') !== undefined) {
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
      case 'end-indent':
        property = 'margin-right'
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
      case "border-before-style":
      case "border-before-width":
      case "border-before-color":
      case "border-end-style":
      case "border-end-width":
      case "border-end-color":
      case "border-after-style":
      case "border-after-width":
      case "border-after-color":
      case "border-start-style":
      case "border-start-width":
      case "border-start-color":
        const tokens = field.split('-')
        switch (tokens[1]) {
          case "before":
            property = 'border-top-' + tokens[2]
            break
          case "end":
            property = 'border-right-' + tokens[2]
            break
          case "after":
            property = 'border-bottom-' + tokens[2]
            break
          case "start":
            property = 'border-left-' + tokens[2]
            break
        }
        isLength = false
        break;
      default:
        var all = $("[data-field='" + field + "'][data-style='" + type + "']")
        if(all.length) {
          if(all.filter("[data-value]").length) {
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
    if(property !== undefined) {
      if(isLength) {
        if(v === undefined) { // support undefined values
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
    view.$styleForm.find('[data-style]').each(function() {
      var f = $(this)
      f.toggle($(this).attr('data-style').split(" ").indexOf(style) !== -1)
    })
    var type = target.find(":selected").parent("optgroup.block")
    if(type.length === 0) {
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
    const $element = $('<fieldset id="style-model" class="model"></fieldset>')
    getStyles().forEach((style) => {
      const $input = $('<input type="hidden">')
      $input.attr('name', style.property + "." + style.type)
      $input.val(style.value)
      if(!!style.inherit) {
        $input.attr('data-inherit', style.inherit)
      }
      $element.append($input)
    })
    $('form').first().append($element)

    const $inputs = $element.find(':input')
    const change = Rx.Observable.fromEvent($inputs, 'change')

    return {
      change: change,
      fields: $inputs,
      field: getField,
      readFromModel: readFromModel,
      writeFieldToModel: writeFieldToModel
    }

    function getStyles() {
      return _(styles.styles).map(function(pv, e) {
        return _.map(pv, function(v, p) {
          return {
            property: p,
            type: e,
            value: v.default || '',
            inherit: v.inherit
          }
        })
      }).flatten().value()
    }

    function getField(field, type) {
      return $inputs.filter("[name='" + field + "." + type + "']")
    }

    /**
     * Read fields from model to UI.
     * @param type
     */
    function readFromModel(type) {
      for (var i = 0; i < allFields.length; i++) {
        var model = getField(allFields[i], type)
        // if no value, inherit from body
        if((model.data('inherit') !== undefined || model.data('inherit') !== null)
          && (model.val() === undefined || model.val() === null || model.val() === "")) {
          model = getField(allFields[i], 'body')
        }
        var input = view.$styleForm.find(":input[id='" + allFields[i] + "']")
        if(input.is(":checkbox")) {
          input.prop('checked', model.val() === input.val())
        } else if(input.is(".editable-list")) {
          input.val(model.val())
        } else {
          input.val(model.val())
        }
        input.change()

        if(allFields[i] === 'border-before-style') {
          view.$styleForm.find(":input[id='border']").val(model.val() === 'solid' ? 'all' : 'none').change()
        }
      }
    }

    function writeFieldToModel(field, type) {
      var input = view.$styleForm.find(":input[id='" + field + "']")
      var model = getField(field, type)
      var oldValue = model.val()
      var newValue
      if(input.is(":checkbox")) {
        if(input.is(":checked")) {
          newValue = input.val()
        } else if(field === 'text-decoration') {
          newValue = 'none'
        } else {
          newValue = 'normal'
        }
      } else if(input.is(".editable-list")) {
        newValue = input.val()
      } else {
        newValue = input.val()
      }

      // if equals body value, treat as inherit value
      if(model.data('inherit') !== undefined && model.data('inherit') !== null) {
        var b = getField(field, 'body')//filter("[name='" + field + "." + 'body' + "']")
        if(oldValue === b.val()) {
          newValue = undefined
        }
        // update inheriting model fields
      } else if(type === 'body') {
        $inputs.filter("[data-inherit=body]").each(function() {
          var m = $(this)
          if(m.is("[name^='" + field + "']")) {
            if(m.val() === undefined || m.val() === "" || m.val() === oldValue) {
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