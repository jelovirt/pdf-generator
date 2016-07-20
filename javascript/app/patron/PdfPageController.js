define([
  '../../app/patron/PdfPageView'
], function(
  PdfPageView
) {
  return function PdfPageController() {
    const view = PdfPageView()
    $('#force-page-count').parents('fieldset').after(view.$element.html())
  }
})