import $ from 'jquery'
import PdfPageController from './app/PdfPageController'

window.addEventListener('load', () => {
  PdfPageController()
  // FIXME
  $('.patron').remove()
}, false)
