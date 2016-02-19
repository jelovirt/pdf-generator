define([
  'styles',
  'handlebars',
  'hb!styles.html',
  'hb!style-preview.html'
], function (styles,
             Handlebars,
             formTemplate,
             previewTemplate) {
  return function StyleView() {
    const $root = $('#p4')

    const $form = $(Handlebars.compile(formTemplate)({
      styles: getStyles(),
      four: [1, 2, 3, 4]
    }))
    $root.append($form)

    const $preview = $(Handlebars.compile(previewTemplate)({}))
    $root.append($preview)

    return {
      $element: $root,
      $styleForm: $('#style-form'),
      $styleSelector: $('#style-selector'),
    }
  }

  function getStyles() {
    return _(styles).map(function (pv, e) {
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
})