define([
  'handlebars',
  'hb!patron/templates.html'
],
function(Handlebars,
         templates) {
  return function PdfPageView() {
    const $scripts = $(Handlebars.compile(templates)())
    const $element = $scripts.filter("script")

    return {
      $element: $element
    }
  }
})
