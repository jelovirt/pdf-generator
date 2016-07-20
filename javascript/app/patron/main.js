define([
  '../../app/PdfPageController',
  '../../app/patron/PdfPageController'
], function (
  PdfPageController,
  PatronPdfPageController
) {
  PdfPageController([PatronPdfPageController])
})