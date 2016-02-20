define([
  'handlebars',
  'hb!styles.html',
  'hb!style-preview.html'
], function (Handlebars,
             formTemplate,
             previewTemplate) {
  return function StyleView() {
    const $root = $('#p4')

    const $form = $(Handlebars.compile(formTemplate)({
      four: [1, 2, 3, 4]
    }))
    $root.append($form)
    const $styleForm = $('#style-form')
    // border shorthand
    $styleForm.find(":input[id='border']").change(borderEditorHandler)
    initAlign()
    initButton('font-weight', 'bold', 'normal')
    initButton('font-style', 'italic', 'normal')
    initButton('text-decoration', 'underline', 'none')


    const $preview = $(Handlebars.compile(previewTemplate)({}))
    $root.append($preview)

    return {
      $element: $root,
      $styleForm: $styleForm,
      $styleSelector: $('#style-selector'),
    }

    function borderEditorHandler(event) {
      const $ui = $(event.target)
      const value = $ui.val()
      $styleForm.find(":input[id='border-before-style'],:input[id='border-end-style'],:input[id='border-after-style'],:input[id='border-start-style']")
        .val(value === 'none' ? 'none' : 'solid').change()
      $styleForm.find(":input[id='border-before-width'],:input[id='border-end-width'],:input[id='border-after-width'],:input[id='border-start-width']")
        .val(value === 'none' ? null : '1pt').change()
      $styleForm.find(":input[id='border-before-color'],:input[id='border-end-color'],:input[id='border-after-color'],:input[id='border-start-color']")
        .val(value === 'none' ? null : 'black').change()
    }

    function initAlign() {
      const store = $styleForm.find('#text-align')

      store.change((event) => {
        const value = store.val()
        $styleForm.find('.btn-text-align').removeClass('active')
          .filter('[value=' + value + ']').addClass('active')
      })
      $styleForm.find('.btn-text-align').click((event) => {
        const $ui = $(event.target)
        store.val($ui.val()).trigger('change')
      })
    }

    function initButton(type, on, off) {
      const store = $styleForm.find('#' + type)
      const button = $styleForm.find('.btn-' + type)

      store.change(() => {
        const checked = store.val() === on
        button.toggleClass('active', checked)
      })
      button.click(() => {
        const checked = store.val() === off
        store.val(checked ? on : off).trigger('change')
      })
    }
  }
})