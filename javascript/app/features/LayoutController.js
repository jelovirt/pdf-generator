import $ from 'jquery'
import template from '../../lib/layout.html'
import {setAction} from '../Utils'

export default function LayoutController(store) {
  const $element = $(template)

  $element.find(':input[name=force-page-count]').change((event) => {
    store.dispatch(setAction({
      configuration: {
        force_page_count: $(event.target).val()
      }
    }))
  }).change()
  $element.find(':input[name=chapter-layout]').change((event) => {
    store.dispatch(setAction({
      configuration: {
        chapter_layout: $(event.target).val()
      }
    }))
  }).change()

  return {
    $element: $element
  }
}
