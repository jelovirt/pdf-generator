import $ from 'jquery'
import _ from 'lodash'
import StyleView from './StyleView'
import StylePreviewController from './StylePreviewController'
import styles from '../../lib/styles'
import {setAction} from '../Utils'

export default function StyleController(store) {
  const view = StyleView()
  const allFields = getAllFields()

  _.forEach(allFields, function(field) {
    view.$styleForm.find(":input[id='" + field + "']").change(styleEditorHandler)
  })
  view.$styleForm.find(":input[id='border']").change(borderEditorHandler)

  let pdfStyleSelectorCurrent = 'body'
  view.$styleSelector.change(styleHandler).val(pdfStyleSelectorCurrent).change()

  const stylePreview = StylePreviewController(store)
  store.subscribe(stylePreview.previewSpaceHandler)

  return {
    $element: view.$element.add(stylePreview.$element)
  }

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
    const target = $(event.target);
    const style = target.val();
    view.$styleForm.find('[data-style]').each(function() {
      const f = $(this);
      f.toggle($(this).attr('data-style').split(" ").indexOf(style) !== -1)
    })
    const type = target.find(":selected").parent("optgroup.block");
    const $blocks = view.$styleForm.find(".style-selector-block")
    if(type.length === 0) {
      view.$styleForm.find(".style-selector-block").hide().find(":input").attr('disabled', true)
    } else {
      view.$styleForm.find(".style-selector-block").show().find(":input").removeAttr('disabled')
    }
    pdfStyleSelectorCurrent = target.val()
    readFromModel(pdfStyleSelectorCurrent)
  }

  /**
   * Read fields from store to UI.
   * @param type
   */
  function readFromModel(type) {
    const currentStyle = store.getState().configuration.style[type]
    for (let i = 0; i < allFields.length; i++) {
      const property = allFields[i]
      let value = currentStyle[property]
      // // if no value, inherit from body
      // if((property.data('inherit') !== undefined || property.data('inherit') !== null) &&
      //   (property.val() === undefined || property.val() === null || property.val() === "")) {
      //   property = getField(field, 'body')
      // }
      const $input = view.$styleForm.find(":input[id='" + property + "']")
      if(property === 'border-before-style') {
        view.$styleForm.find(":input[id='border']").val(value === 'solid' ? 'all' : 'none')
        //.change()
      } else if($input.is(":checkbox")) {
        const checked = String(value) === $input.val()
        $input.prop('checked', checked).toggleClass('active', checked)
        //.change()
      } else if($input.is(".editable-list")) {
        $input.val(value).trigger('reset')
        //.change()
      } else if($input.is("[type=hidden]") || property === 'text-align') {
        // XXX use custom reset event instead of change because change is slow
        $input.val(value).trigger('reset')
        //.change()
      } else {
        $input.val(value)
        //.change()
      }
    }
  }

  function getValue(element, property, value) {
    if(!(styles.styles[element] && styles.styles[element][property])) {
      return value
    }
    switch (typeof styles.styles[element][property].default) {
      case 'boolean':
        return (value === 'true')
      case 'number':
        return Number(value)
      default:
        return value
    }
  }

  /**
   * Update store when UI changes
   * @param event UI change event
   */
  function styleEditorHandler(event) {
    const input = $(event.target)
    const field = input.attr('id')
    const def = styles.styles[pdfStyleSelectorCurrent][field]

    const currentStyle = store.getState().configuration.style
    const oldValue = currentStyle[pdfStyleSelectorCurrent][field]
    let newValue;
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
    newValue = getValue(pdfStyleSelectorCurrent, field, newValue)

    const action = {
      configuration: {
        style: {}
      }
    }
    action.configuration.style[pdfStyleSelectorCurrent] = {}
    action.configuration.style[pdfStyleSelectorCurrent][field] = newValue
    _.forEach(styles.styles, (elementValue, element) => {
      const def = elementValue[field]
      if(!!def && def.inherit === pdfStyleSelectorCurrent && currentStyle[element][field] === oldValue) {
        action.configuration.style[element] = {}
        action.configuration.style[element][field] = newValue
      }
    })
    store.dispatch(setAction(action))
  }

  function borderEditorHandler(event) {
    const value = $(event.target).val()

    const props = {}
    const directions = ['before', 'end', 'after', 'start']
    if(value === 'none') {
      directions.forEach((direction) => {
        props[`border-${direction}-style`] = 'none'
      })
      directions.forEach((direction) => {
        props[`border-${direction}-width`] = undefined
      })
      directions.forEach((direction) => {
        props[`border-${direction}-color`] = undefined
      })
    } else {
      directions.forEach((direction) => {
        props[`border-${direction}-style`] = 'solid'
      })
      directions.forEach((direction) => {
        props[`border-${direction}-width`] = '1pt'
      })
      directions.forEach((direction) => {
        props[`border-${direction}-color`] = 'black'
      })
    }
    const action = {
      configuration: {
        style: {}
      }
    }
    action.configuration.style[pdfStyleSelectorCurrent] = props

    store.dispatch(setAction(action))
  }

}
