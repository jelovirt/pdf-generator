import $ from 'jquery'
import templates from '../lib/templates.html'

export default function PdfPageView() {
  const $element = $(templates)

  return {
    $element: $element
  }
}
