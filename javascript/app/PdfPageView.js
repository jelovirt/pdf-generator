define([
    'handlebars',
  'hb!templates.html'
],
function (Handlebars,
          templates) {
  return function PdfPageView() {
    const data = {
      generate_url: '/',
    }
    const $element = $(Handlebars.compile(templates)(data))

    return {
      $element: $element
    }
  }
})
