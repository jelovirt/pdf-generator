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
    const $styleForm = $form.find('#style-form')
    // border shorthand
    $styleForm.find(":input[id='border']").change(borderEditorHandler)

    const $preview = $(Handlebars.compile(previewTemplate)({}))
    $root.append($preview)

    return {
      $element: $root,
      $styleForm: $styleForm,
      $styleSelector: $('#style-selector'),
    }

    function borderEditorHandler(event) {
      const ui = $(event.target)
      const value = ui.val()
      $styleForm.find(":input[id='border-before-style'],:input[id='border-end-style'],:input[id='border-after-style'],:input[id='border-start-style']")
        .val(value === 'none' ? 'none' : 'solid').change()
      $styleForm.find(":input[id='border-before-width'],:input[id='border-end-width'],:input[id='border-after-width'],:input[id='border-start-width']")
        .val(value === 'none' ? null : '1pt').change()
      $styleForm.find(":input[id='border-before-color'],:input[id='border-end-color'],:input[id='border-after-color'],:input[id='border-start-color']")
        .val(value === 'none' ? null : 'black').change()
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