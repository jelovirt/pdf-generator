import $ from 'jquery';
// @ts-ignore
import template from '../../lib/environment.html';
import { setAction } from '../Utils';
import { Model } from '../Model';
import { Store } from 'redux';
import ChangeEvent = JQuery.ChangeEvent;

export default function EnvironmentController(store: Store<Model>) {
  const $element = $(template);

  $element
    .find(":input[name='ot_version']")
    .val(store.getState().ot_version)
    .change(toolkitVersionChangeHandler)
    .change();
  $element
    .find(":input[name='formatter']")
    .val(store.getState().configuration.formatter)
    .change(formatterHandler)
    .change();
  $element
    .find(":input[name='override_shell']")
    .change(overrideShellHandler)
    .change();

  return {
    $element: $element,
  };

  function toolkitVersionChangeHandler(event: ChangeEvent) {
    store.dispatch(
      setAction({
        ot_version: $(event.target).val(),
      })
    );
    toggleByClass($(event.target), 'v');
  }

  function formatterHandler(event: ChangeEvent) {
    store.dispatch(
      setAction({
        configuration: {
          formatter: $(event.target).val(),
        },
      })
    );
    toggleByClass($(event.target), 'f');
  }

  function overrideShellHandler(event: ChangeEvent) {
    store.dispatch(
      setAction({
        configuration: {
          override_shell: $(event.target).is(':checked'),
        },
      })
    );
  }

  function toggleByClass(p: JQuery, prefix: 'v' | 'f') {
    const val = p.val();
    p.find('option').each(function () {
      const s = $(this).attr('value')!;
      const c = '.' + prefix + s.replace(/\./g, '_');
      $(c).addClass('disabled').find(':input').attr('disabled', 'disabled');
    });
    p.find('option').each(function () {
      const s = $(this).attr('value')!;
      const c = '.' + prefix + s.replace(/\./g, '_');
      if (val === s) {
        $(c).removeClass('disabled').find(':input').removeAttr('disabled');
      }
    });
  }
}
