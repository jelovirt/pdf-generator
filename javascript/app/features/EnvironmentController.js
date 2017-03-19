import $ from 'jquery'
import template from '../../lib/environment.html'
import {setAction} from '../Utils'

export default function EnvironmentController(store) {
  const $element = $(template)

  $element.find(":input[name='ot_version']").change(toolkitVersionChangeHandler).change()
  $element.find(":input[name='formatter']").change(formatterHandler).change()
  $element.find(":input[name='override_shell']").change(overrideShellHandler).change()

  return {
    $element: $element
  }

  function toolkitVersionChangeHandler(event) {
    store.dispatch(setAction({
      ot_version: $(event.target).val()
    }))
    toggleByClass($(event.target), 'v')
  }

  function formatterHandler(event) {
    store.dispatch(setAction({
      configuration: {
        formatter: $(event.target).val()
      }
    }))
    toggleByClass($(event.target), 'f')
  }

  function overrideShellHandler(event) {
    store.dispatch(setAction({
      configuration: {
        override_shell: $(event.target).is(':checked')
      }
    }))
  }

  function toggleByClass(p, prefix) {
    const val = p.val()
    p.find('option').each(function() {
      const s = $(this).attr('value')
      const c = "." + prefix + s.replace(/\./g, '_')
      $(c).addClass('disabled').find(":input").attr('disabled', true)
    })
    p.find('option').each(function() {
      const s = $(this).attr('value')
      const c = "." + prefix + s.replace(/\./g, '_')
      if(val === s) {
        $(c).removeClass('disabled').find(":input").removeAttr('disabled')
      }
    })
  }
}