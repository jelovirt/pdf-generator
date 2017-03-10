import $ from 'jquery'
import Utils from '../../app/Utils'
import template from '../../lib/metadata.html'

const pluginPatter = new RegExp("[a-zA-Z\\-_]+(\\.[a-zA-Z\\-_]+)*")

export default function MetadataController(model) {
  const $element = $(template)

  $element.find(":input[name='id']").change(idChangeHandler)
  $element.find(":input[name='transtype']").change(transtypeChangeHandler)
  $element.find(":input[name='plugin-version']").change(pluginVersionChangeHandler)

  return {
    $element: $element
  }

  function idChangeHandler(event) {
    model.id = $(event.target).val()
  }

  function transtypeChangeHandler(event) {
    model.transtype = $(event.target).val()
    if(!pluginPatter.test(model.transtype)) { //!namePattern.test(val)
      Utils.setError($(event.target), $("<span>Not a valid XML name</span>"),
        "Type ID must be a valid XML name.")
    } else {
      Utils.setOk($(event.target))
    }
  }

  function pluginVersionChangeHandler(event) {
    model.plugin_version = $(event.target).val() || null
  }
}
