import $ from 'jquery'
import template from '../../lib/cover.html'

export default function CoverHandler(model) {
  const $element = $(template)

  $element.find(':input[name=cover_image_metadata]').change((event) => {
    model.configuration.cover_image_metadata = $(event.target).val() || null
  }).change()
  $element.find(':input[name=cover_image_topic]').change((event) => {
    model.configuration.cover_image_topic = $(event.target).val() || null
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
        delete model.configuration[$(elem).attr('id')]
      })
  }
}