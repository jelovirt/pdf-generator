import $ from 'jquery';
// @ts-ignore
import template from '../../lib/header.html';
import dragula from 'dragula';
import { setAction } from '../Utils';
import { Model } from '../Model';
import { Store } from 'redux';

export default function HeaderController(store: Store<Model>) {
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
  drake.on('drop', (el, target, source, sibling) => {
    const label = el as HTMLElement;
    if (label.classList.contains('label-editable')) {
      label.contentEditable = 'true';
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

function readTags($element: JQuery) {
  return $element
    .find('span.label')
    .map((i, element) => $(element).data('field'))
    .toArray();
}
