import $ from 'jquery';
import template from '../../lib/metadata.html';
import { setAction, setError, setOk } from '../Utils';
import { Model } from '../Model';
import { Store } from 'redux';
import ChangeEvent = JQuery.ChangeEvent;

const pluginPatter = new RegExp('[a-zA-Z\\-_]+(\\.[a-zA-Z\\-_]+)*');

export default function MetadataController(store: Store<Model>) {
  const $element = $(template);

  $element.find(":input[name='id']").change(idChangeHandler);
  $element.find(":input[name='transtype']").change(transtypeChangeHandler);
  $element
    .find(":input[name='plugin-version']")
    .change(pluginVersionChangeHandler);

  return {
    $element: $element,
  };

  function idChangeHandler(event: ChangeEvent) {
    store.dispatch(
      setAction({
        id: $(event.target).val(),
      })
    );
  }

  function transtypeChangeHandler(event: ChangeEvent) {
    store.dispatch(
      setAction({
        transtype: $(event.target).val(),
      })
    );
    const transtype = store.getState().transtype;
    if (transtype !== null && pluginPatter.test(transtype)) {
      setOk($(event.target));
    } else {
      //!namePattern.test(val)
      setError(
        $(event.target),
        $('<span>Not a valid XML name</span>'),
        'Type ID must be a valid XML name.'
      );
    }
  }

  function pluginVersionChangeHandler(event) {
    store.dispatch(
      setAction({
        plugin_version: $(event.target).val() || undefined,
      })
    );
  }
}
