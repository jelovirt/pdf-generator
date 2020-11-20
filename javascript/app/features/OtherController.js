import $ from 'jquery';
import template from '../../lib/other.html';
import { setAction } from '../Utils';

export default function OtherHandler(store) {
  const $element = $(template);

  $element
    .find(':input[name=bookmark-style]')
    .val(store.getState().configuration.bookmark_style)
    .change((event) => {
      store.dispatch(
        setAction({
          configuration: {
            bookmark_style: $(event.target).val(),
          },
        })
      );
    })
    .change();
  $element
    .find(':input[name=toc-maximum-level]')
    .val(store.getState().configuration.toc_maximum_level)
    .change((event) => {
      store.dispatch(
        setAction({
          configuration: {
            toc_maximum_level: Number($(event.target).val()),
          },
        })
      );
    })
    .change();
  $element
    .find(':input[name=task-label]')
    .val(store.getState().configuration.task_label)
    .change((event) => {
      store.dispatch(
        setAction({
          configuration: {
            task_label: $(event.target).is(':checked'),
          },
        })
      );
    })
    .change();
  $element
    .find(':input[name=include-related-links]')
    .val(store.getState().configuration.include_related_links)
    .change((event) => {
      store.dispatch(
        setAction({
          configuration: {
            include_related_links: $(event.target).val(),
          },
        })
      );
    })
    .change();
  $element
    .find(':input[name=table-continued]')
    .val(store.getState().configuration.table_continued)
    .change((event) => {
      store.dispatch(
        setAction({
          configuration: {
            table_continued: $(event.target).is(':checked'),
          },
        })
      );
    })
    .change();
  $element
    .find(':input[name=page-number]')
    .val(store.getState().configuration.page_number)
    .change((event) => {
      store.dispatch(
        setAction({
          configuration: {
            page_number: $(event.target).val(),
          },
        })
      );
    })
    .change();

  return {
    $element: $element,
  };
}
