import $ from 'jquery'
import templates from './templates.html'

export default function PdfPageView() {
  const $scripts = $(templates())
  const $element = $scripts.filter("script")

  return {
    $element: $element
  }
}
