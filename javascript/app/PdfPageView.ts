import $ from 'jquery';
// @ts-ignore
import templates from '../lib/templates.html';

export default function PdfPageView() {
  const $element = $(templates);

  return {
    $element: $element,
  };
}
