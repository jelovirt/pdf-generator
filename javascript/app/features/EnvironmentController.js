import $ from 'jquery'
import template from '../../lib/environment.html'

export default function EnvironmentController(model) {
  const $element = $(template)

  $element.find(":input[name='ot_version']").change(toolkitVersionChangeHandler).change()
  $element.find(":input[name='formatter']").change(formatterHandler).change()
  $element.find(":input[name='override_shell']").change(overrideShellHandler).change()

  return {
    $element: $element
  }

  function toolkitVersionChangeHandler(event) {
    model.ot_version = $(':input[name=ot_version]').val()
    toggleByClass($(event.target), 'v')
  }

  function formatterHandler(event) {
    model.configuration.formatter = $(':input[name=formatter]').val()
    toggleByClass($(event.target), 'f')
  }

  function overrideShellHandler(event) {
    model.configuration.override_shell = $(event.target).is(':checked')
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