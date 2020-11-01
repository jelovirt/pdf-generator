import $ from 'jquery';
import template from '../../lib/header.html';
import dragula from 'dragula';
import { setAction } from '../Utils';

export default function HeaderController(store) {
  const $element = $(template);
  const root = $element.get(0);

  const headerSource = $element.find('#header-source').get(0);

  const drake = dragula(
    [
      headerSource,
      $element.find('#even-header').get(0),
      $element.find('#odd-header').get(0),
      $element.find('#even-footer').get(0),
      $element.find('#odd-footer').get(0),
    ],
    {
      // copy: true,
      removeOnSpill: true,
      copy: (el, source) => source === headerSource,
      accepts: (el, target) => target !== headerSource,
    }
  );
  drake.on('drop', (label, target, source) => {
    if (label.classList.contains('label-editable')) {
      label.contentEditable = true;
      label.innerText = '\u200B'; // \u200B
      label.focus();
    }
    store.dispatch(
      setAction({
        configuration: {
          header: {
            odd: readTags($element.find('#odd-header')),
            even: readTags($element.find('#even-header')),
          },
          footer: {
            odd: readTags($element.find('#odd-footer')),
            even: readTags($element.find('#even-footer')),
          },
        },
      })
    );
  });

  return {
    $element: $element,
  };
}

function readTags($element) {
  return $element
    .find('span.label')
    .map(function () {
      return $(this).data('field');
    })
    .toArray();
}
