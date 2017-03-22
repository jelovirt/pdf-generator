import $ from 'jquery'
import _ from 'lodash'
import WizardController from './WizardController'
import MetadataController from './features/MetadataController'
import HeaderController from './features/HeaderController'
import PageController from './features/PageController'
import LayoutController from './features/LayoutController'
import StyleController from './features/StyleController'
import OtherController from './features/OtherController'
import CoverController from './features/CoverController'
import EnvironmentController from './features/EnvironmentController'
import PdfPageView from './PdfPageView'
import PdfPreviewController from './PdfPreviewController'
import PdfUtils from './pdf-utils'
import Utils from './Utils'
import {createStore} from 'redux'
import styles from '../lib/styles'

function getInitStyle() {
  return _(styles.styles)
    .mapValues((elementValue, element) => {
      return _(elementValue).mapValues((propertyValue, property) => {
        return getDefault(element, property)
      }).value()
    })
    .value()

  function getDefault(field, property) {
    const v = styles.styles[field][property]
    if(!!v.default) {
      return v.default
    } else if(!!v.inherit) {
      return getDefault(v.inherit, property)
    } else {
      // throw new Error(`Unable to find default for ${field}.${property}`)
      return undefined
    }
  }
}

export default function PdfPageController() {
  const model = createStore((store, action) => {
    return _.merge(store, action.value)
  }, {
    configuration: {
      page: {},
      header: {
        odd: [],
        even: []
      },
      footer: {
        odd: [],
        even: []
      },
      style: getInitStyle()
    }
  })

  const view = PdfPageView()
  $('main').html(view.$element)

  WizardController(model, [
    [EnvironmentController(model)],
    [PageController(model)],
    [HeaderController(model), LayoutController(model)],
    [StyleController(model)],
    [CoverController(model), OtherController(model)],
    [MetadataController(model)]
  ])

  PdfPreviewController(model)

  init()

  // UI --------------------------------------------------------------------------

  function init() {
    initHelp();

    // Hack to get formatter disable state initialized
    $(':input[name=formatter]').change()

    $(":input.length-value").keydown(valueChangeHandler).change(validateLength)
    // widget initialization
    $(':input.editable-list').each(function() {
      const s = $(this)
      const id = s.attr('name') !== undefined ? s.attr('name') : s.attr('id')
      const l = $(":input[id='" + id + ".list']")
      const o = $(":input[id='" + id + ".other']")
      s.change(editableHandler)
      s.on('reset', editableHandler)
      o.change(function() {
        editableOtherHandler(s, l, o)
      })
      l.change(function() {
        editableListHandler(s, l, o)
      })
      s.trigger('reset')
    })

    function validateLength(event) {
      const target = $(event.target)
      const val = PdfUtils.toPt(PdfUtils.getVal(target))
      if(val === undefined) {
        Utils.setError(target, $("<span>Invalid value</span>"), "Invalid XSL FO length value")
      } else {
        Utils.setOk(target)
      }
    }

    // Editable list methods

    function editableHandler(event) {
      const target = $(event.target);
      const id = target.attr('name') !== undefined ? target.attr('name') : target.attr('id');
      const list = $(":input[id='" + id + ".list" + "']");
      const other = $(":input[id='" + id + ".other" + "']");
      other.val(target.val())
      if(list.find("option[value='" + other.val() + "']").length !== 0) { // same value in list
        other.hide().prop('disabled', true)
        list.val(other.val())
        other.val(undefined)
      } else {
        list.val('#other')
        other.show().prop('disabled', false).focus()
      }
    }

    function editableListHandler(store, list, other) {
      if(list.val() === '#other') {
        store.val(other.val()).change()
      } else {
        store.val(list.val()).change()
      }

    }

    function editableOtherHandler(store, list, other) {
      store.val(other.val()).change()
    }

    // Value increment/decrement methods

    function valueChangeHandler(event) {
      let t
      switch (event.keyCode) {
        case 38:
          t = $(event.target)
          addToValue(t, 1)
          event.preventDefault()
          event.stopPropagation()
          t.change()
          return false
        case 40:
          t = $(event.target)
          addToValue(t, -1)
          event.preventDefault()
          event.stopPropagation()
          t.change()
          return false
      }

      function addToValue(target, add) {
        let val = target.val();
        if(val === "") {
          val = target.attr('placeholder')
        }
        const num = Number(val.substring(0, val.length - 2));
        const unit = val.substring(val.length - 2);
        target.val((num + add).toString() + unit)
      }
    }

    function initHelp() {
      // help
      $("fieldset label:not(.inline)").each(function() {
        const l = $(this);
        if(l.parents("fieldset:first").find(".help").length !== 0) {
          l.append($("<span class='help-icon' title='Show help'></span>").click(Utils.helpHandler));
        }
      });
      $("fieldset .help").hide().each(function() {
        const l = $(this);
        l.prepend($("<span class='close-icon' title='Close help'></span>").click(Utils.closeHandler));
      });
    }
  }

}
