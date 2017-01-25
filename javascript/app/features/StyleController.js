import $ from 'jquery'
import StyleView from './StyleView'
import StylePreviewController from './StylePreviewController'
import Rx from 'rx'
import styles from '../../lib/styles'

export default function StyleController() {
  const view = StyleView()
  const styleModel = StyleModel()
  const allFields = getAllFields()

  const stylePreview = StylePreviewController()

  styleModel.change.subscribe(stylePreview)
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