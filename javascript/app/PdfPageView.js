define([
    'handlebars',
    'hb!templates.html',
    '../app/features/StyleController'
  ],
  function (Handlebars,
            templates,
            StyleController) {
    return function PdfPageView() {
      const data = {
        generate_url: '/',
        styles: getStyles()
      }
      const $element = $(Handlebars.compile(templates)(data))

      return {
        $element: $element
      }

      function getStyles() {

        return _(StyleController.styles).map(function (pv, e) {
          return _.map(pv, function (v, p) {
            return {
              property: p,
              type: e,
              value: v.default || '',
              inherit: v.inherit
            }
          })
        }).flatten().value()
      }
    }
  })