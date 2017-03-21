import $ from 'jquery'
import template from '../../lib/cover.html'
import {setAction} from '../Utils'

export default function CoverHandler(store) {
  const $element = $(template)

  $element.find(':input[name=cover_image_metadata]').change((event) => {
    store.dispatch(setAction({
      configuration: {
        cover_image_metadata: $(event.target).val() || undefined
      }
    }))
  }).change()
  $element.find(':input[name=cover_image_topic]').change((event) => {
    store.dispatch(setAction({
      configuration: {
        cover_image_topic: $(event.target).val() || undefined
      }
    }))
  }).change()
  $element.find("#cover_image_chooser").change(coverChangeHandler).change()

  return {
    $element: $element
  }

  function coverChangeHandler(event) {
    const target = $(event.target)
    const $all = $element.find('#cover_image_file, #cover_image_metadata, #cover_image_topic')
    $(`#cover_image_${target.val()}`)
      .prop('disabled', false)
      .show()
      .find(':input').change()
    $all.not(`#cover_image_${target.val()}`)
      .prop('disabled', true)
      .hide()
      .each((i, elem) => {
        const action = {
          configuration: {}
        }
        action.configuration[$(elem).attr('id')] = undefined
        store.dispatch(setAction(action))
      })
  }
}