import $ from 'jquery';
import { Store } from 'redux';
import template from '../../lib/layout.html';
import { Model } from '../Model';
import { setAction } from '../Utils';

export default function LayoutController(store: Store<Model>) {
  const $element = $(template);

  $element
    .find(':input[name=force-page-count]')
    .val(store.getState().configuration.force_page_count)
    .change((event) => {
      store.dispatch(
        setAction({
          configuration: {
            force_page_count: $(event.target).val(),
          },
        })
      );
    })
    .change();
  $element
    .find(':input[name=chapter-layout]')
    .val(store.getState().configuration.chapter_layout)
    .change((event) => {
      store.dispatch(
        setAction({
          configuration: {
            chapter_layout: $(event.target).val(),
          },
        })
      );
    })
    .change();

  return {
    $element: $element,
  };
}
