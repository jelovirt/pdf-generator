import $ from 'jquery';
// @ts-ignore
import template from '../../lib/cover.html';
import { setAction } from '../Utils';
import { Model } from '../Model';
import { Store } from 'redux';
import ChangeEvent = JQuery.ChangeEvent;

export default function CoverHandler(store: Store<Model>) {
  const $element = $(template);

  $element
    .find(':input[name=cover_image_metadata]')
    .val(store.getState().configuration.cover_image_metadata)
    .change((event) => {
      store.dispatch(
        setAction({
          configuration: {
            cover_image_metadata: $(event.target).val() || undefined,
          },
        })
      );
    })
    .change();
  $element
    .find(':input[name=cover_image_topic]')
    .val(store.getState().configuration.cover_image_topic)
    .change((event) => {
      store.dispatch(
        setAction({
          configuration: {
            cover_image_topic: $(event.target).val() || undefined,
          },
        })
      );
    })
    .change();
  $element.find('#cover_image_chooser').change(coverChangeHandler).change();

  return {
    $element: $element,
  };

  function coverChangeHandler(event: ChangeEvent) {
    const target = $(event.target);
    const $all = $element.find(
      '#cover_image_file, #cover_image_metadata, #cover_image_topic'
    );
    $(`#cover_image_${target.val()}`)
      .prop('disabled', false)
      .show()
      .find(':input')
      .change();
    $all
      .not(`#cover_image_${target.val()}`)
      .prop('disabled', true)
      .hide()
      .each((i, elem) => {
        const field = $(elem).attr('id')!;
        const action = {
          configuration: {
            [field]: undefined,
          },
        };
        store.dispatch(setAction(action));
      });
  }
}
