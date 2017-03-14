import $ from 'jquery'
import _ from 'lodash'
import styles from '../../lib/styles'

export default function StyleModel(view, allFields) {
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

  return {
    change: (handler) => {
      $inputs.change(handler)
    },
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
      if((model.data('inherit') !== undefined || model.data('inherit') !== null) &&
        (model.val() === undefined || model.val() === null || model.val() === "")) {
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
