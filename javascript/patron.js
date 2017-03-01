import PdfPageController from './app/PdfPageController'
import PatronPdfPageController from './app/patron/PdfPageController'
import HeaderController from './app/patron/HeaderContoller'

window.addEventListener('load', () => {
  PdfPageController([
    PatronPdfPageController,
    HeaderController
  ])
}, false)
