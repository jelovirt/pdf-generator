import $ from 'jquery'
import template from '../../lib/styles.html'

export default function StyleView() {
  const $form = $(template)

  const $styleForm = $form.filter('#style-form')
  // border shorthand
  $styleForm.find(":input[id='border']").change(borderEditorHandler)
  initAlign()
  initButton('font-weight', 'bold', 'normal')
  initButton('font-style', 'italic', 'normal')
  initButton('text-decoration', 'underline', 'none')

  return {
    $element: $form,
    $styleForm: $styleForm,
    $styleSelector: $form.find('#style-selector'),
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

    function setState() {
      const value = store.val()
      if (!!value) {
        $styleForm.find('.btn-text-align').removeClass('active')
          .filter('[value=' + value + ']').addClass('active')
      }
    }

    store.change(setState)
    store.on('reset', setState)
    $styleForm.find('.btn-text-align').click((event) => {
      const $ui = $(event.target)
      store.val($ui.val()).trigger('change')
    })
  }

  function initButton(type, on, off) {
    const store = $styleForm.find('#' + type)
    const button = $styleForm.find('.btn-' + type)

    function setState() {
      const checked = store.val() === on
      button.toggleClass('active', checked)
    }

    store.change(setState)
    store.on('reset', setState)
    button.click(() => {
      const checked = store.val() === off
      store.val(checked ? on : off).trigger('change')
    })

  }
}