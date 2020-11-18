import $ from 'jquery';
import { Store } from 'redux';
import template from '../../lib/page.html';
import { Model } from '../Model';
import { setAction } from '../Utils';
import ChangeEvent = JQuery.ChangeEvent;

export default function StyleController(store: Store<Model>) {
  const $element = $(template);

  $element
    .find(':input[name=page-size]')
    .change(pageSizeChangeHandler)
    .change();
  $element
    .find(':input[name=orientation]')
    .change(pageSizeChangeHandler)
    .change();
  $element
    .find(':input[name=page-margin-top]')
    .change(marginChangeHandler('top'))
    .change();
  $element
    .find(':input[name=page-margin-outside]')
    .change(marginChangeHandler('outside'))
    .change();
  $element
    .find(':input[name=page-margin-bottom]')
    .change(marginChangeHandler('bottom'))
    .change();
  $element
    .find(':input[name=page-margin-inside]')
    .change(marginChangeHandler('inside'))
    .change();
  $element
    .find(':input[name=mirror-page-margins]')
    .change(mirrorPageChangeHandler)
    .change();
  $element
    .find(':input[name=body-column-count]')
    .change(columnChangeHandler('body_column_count'))
    .change();
  $element
    .find(':input[name=index-column-count]')
    .change(columnChangeHandler('index_column_count'))
    .change();
  $element
    .find(':input[name=column-gap]')
    .change(columnGapChangeHandler)
    .change();

  return {
    $element: $element,
  };

  function pageSizeChangeHandler(event: ChangeEvent) {
    const value = $element.find(':input[name=page-size]').val() as string;
    const s = value.split(' ');
    if ($element.find(':input[name=orientation]').val() === 'landscape') {
      s.reverse();
    }
    store.dispatch(
      setAction({
        configuration: {
          page: {
            width: s[0],
            height: s[1],
          },
        },
      })
    );
  }

  function marginChangeHandler(
    margin: 'top' | 'outside' | 'bottom' | 'inside'
  ) {
    return (event: ChangeEvent) => {
      const action = {
        configuration: {
          page: {
            [margin]: $(event.target).val() || '20mm',
          },
        },
      };
      store.dispatch(setAction(action));
    };
  }

  function columnChangeHandler(
    page: 'body_column_count' | 'index_column_count'
  ) {
    return (event: ChangeEvent) => {
      const target = $(event.target!);
      const action = {
        configuration: {
          [page]: Number(target.val()),
        },
      };
      store.dispatch(setAction(action));
      if (
        store.getState().configuration.body_column_count === 1 &&
        store.getState().configuration.index_column_count === 1
      ) {
        $element
          .find(':input[name=column-gap]')
          .prop('disabled', true)
          .parent()
          .hide();
      } else {
        $element
          .find(':input[name=column-gap]')
          .prop('disabled', false)
          .parent()
          .show();
      }
    };
  }

  function mirrorPageChangeHandler(event: ChangeEvent) {
    store.dispatch(
      setAction({
        configuration: {
          mirror_page_margins: $(event.target!).is(':checked'),
        },
      })
    );
  }

  function columnGapChangeHandler(event: ChangeEvent) {
    store.dispatch(
      setAction({
        configuration: {
          column_gap: $(event.target!).val(),
        },
      })
    );
  }
}
