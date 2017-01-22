import PdfPageController from './app/PdfPageController'
import PatronPdfPageController from './app/patron/PdfPageController'

window.addEventListener('load', () => {
  PdfPageController([
    PatronPdfPageController
  ])
}, false)
