import $ from 'jquery'
import PdfPageView from './PdfPageView'

export default function PdfPageController() {
  const view = PdfPageView()
  $('#force-page-count').parents('fieldset').after(view.$element.html())
}
