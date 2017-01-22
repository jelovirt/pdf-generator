import $ from 'jquery'
import templates from '../lib/templates.html'
// const templates = require('../lib/templates.html')

export default function PdfPageView() {
  const data = {
    generate_url: '/',
  }
  const $element = $(templates(data))

  return {
    $element: $element
  }
}
