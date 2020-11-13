import $ from 'jquery';
import PdfPageController from './app/PdfPageController';

$(document).ready((e) => {
  console.log('page loaded', e);
  PdfPageController();
});
