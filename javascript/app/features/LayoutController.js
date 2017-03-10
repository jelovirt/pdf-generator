import $ from 'jquery'
import template from '../../lib/layout.html'

export default function LayoutController(model) {
  const $element = $(template)

  $element.find(':input[name=force-page-count]').change((event) => {
    model.configuration.force_page_count = $(event.target).val()
  }).change()
  $element.find(':input[name=chapter-layout]').change((event) => {
    model.configuration.chapter_layout = $(event.target).val()
  }).change()

  return {
    $element: $element
  }
}
