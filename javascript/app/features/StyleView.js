import $ from 'jquery';
import template from '../../lib/styles.html';

export default function StyleView() {
  const $form = $(template);

  const $styleForm = $form.filter('#style-form');
  initAlign();
  initButton('font-weight', 'bold', 'normal');
  initButton('font-style', 'italic', 'normal');
  initButton('text-decoration', 'underline', 'none');

  return {
    $element: $form,
    $styleForm: $styleForm,
    $styleSelector: $form.find('#style-selector'),
  };

  function initAlign() {
    const store = $styleForm.find('#text-align');

    function setState() {
      const value = store.val();
      if (!!value) {
        $styleForm
          .find('.btn-text-align')
          .removeClass('active')
          .filter('[value=' + value + ']')
          .addClass('active');
      }
    }

    store.change(setState);
    store.on('reset', setState);
    $styleForm.find('.btn-text-align').click((event) => {
      const value = $(event.currentTarget).val();
      store.val(value).trigger('change');
    });
  }

  function initButton(type, on, off) {
    const store = $styleForm.find('#' + type);
    const button = $styleForm.find('.btn-' + type);

    function setState() {
      const checked = store.val() === on;
      button.toggleClass('active', checked);
    }

    store.change(setState);
    store.on('reset', setState);
    button.click(() => {
      const checked = store.val() === off;
      store.val(checked ? on : off).trigger('change');
    });
  }
}
