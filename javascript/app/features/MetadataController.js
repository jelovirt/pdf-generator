import $ from 'jquery'
import Utils from '../../app/Utils'
import template from '../../lib/metadata.html'
import {setAction} from '../Utils'

const pluginPatter = new RegExp("[a-zA-Z\\-_]+(\\.[a-zA-Z\\-_]+)*")

export default function MetadataController(store) {
  const $element = $(template)

  $element.find(":input[name='id']").change(idChangeHandler)
  $element.find(":input[name='transtype']").change(transtypeChangeHandler)
  $element.find(":input[name='plugin-version']").change(pluginVersionChangeHandler)

  return {
    $element: $element
  }

  function idChangeHandler(event) {
    store.dispatch(setAction({
      id: $(event.target).val()
    }))
  }

  function transtypeChangeHandler(event) {
    store.dispatch(setAction({
      transtype: $(event.target).val()
    }))
    if(!pluginPatter.test(store.getState().transtype)) { //!namePattern.test(val)
      Utils.setError($(event.target), $("<span>Not a valid XML name</span>"),
        "Type ID must be a valid XML name.")
    } else {
      Utils.setOk($(event.target))
    }
  }

  function pluginVersionChangeHandler(event) {
    store.dispatch(setAction({
      plugin_version: $(event.target).val() || undefined
    }))
  }
}
