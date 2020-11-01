import $ from 'jquery';
import template from '../../lib/other.html';
import { setAction } from '../Utils';

export default function OtherHandler(store) {
  const $element = $(template);

  $element
    .find(':input[name=bookmark-style]')
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
