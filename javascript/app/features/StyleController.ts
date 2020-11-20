import $ from 'jquery';
import _ from 'lodash';
import StyleView from './StyleView';
import StylePreviewController from './StylePreviewController';
import { Property, Style, StyleName, styles } from '../../lib/styles';
import { setAction } from '../Utils';
import { Model } from '../Model';
import { Store } from 'redux';
import ChangeEvent = JQuery.ChangeEvent;

export default function StyleController(store: Store<Model>) {
  const view = StyleView();
  const allFields = getAllFields();

  _.forEach(allFields, function (field) {
    view.$styleForm
      .find(":input[id='" + field + "']")
      .change(styleEditorHandler);
  });
  view.$styleForm.find(":input[id='border']").change(borderEditorHandler);

  let pdfStyleSelectorCurrent: StyleName = 'body';
  view.$styleSelector
    .change(styleHandler)
    .val(pdfStyleSelectorCurrent)
    .change();

  const stylePreview = StylePreviewController(store);
  store.subscribe(stylePreview.previewSpaceHandler);

  return {
    $element: view.$element.add(stylePreview.$element),
  };

  function getAllFields() {
    return _(styles)
      .map(function (pv, e) {
        return _.map(pv, function (v, p) {
          return p;
        });
      })
      .flatten()
      .uniq()
      .value() as Property[];
  }

  /**
   * Change which style to edit
   * @param event UI change event
   */
  function styleHandler(event: ChangeEvent) {
    const target = $(event.target);
    const style = target.val() as string;
    view.$styleForm
      .find('[data-style]')
      .each(function (i: number, element: Element) {
        const f = $(element);
        const visible = f.attr('data-style')!.split(' ').indexOf(style) !== -1;
        f.toggle(visible);
      });
    const type = target.find(':selected').parent('optgroup.block');
    if (type.length === 0) {
      view.$styleForm
        .find('.style-selector-block')
        .hide()
        .find(':input')
        .prop('disabled', true);
    } else {
      view.$styleForm
        .find('.style-selector-block')
        .show()
        .find(':input')
        .prop('disabled', false);
    }
    pdfStyleSelectorCurrent = target.val() as StyleName;
    readFromModel(pdfStyleSelectorCurrent);
  }

  /**
   * Read fields from store to UI.
   * @param type
   */
  function readFromModel(type: StyleName) {
    const currentStyle = store.getState().configuration.style[type];
    console.log(currentStyle);
    for (let i = 0; i < allFields.length; i++) {
      const property = allFields[i];
      let value = currentStyle[property] as any;
      // // if no value, inherit from body
      // if((property.data('inherit') !== undefined || property.data('inherit') !== null) &&
      //   (property.val() === undefined || property.val() === null || property.val() === "")) {
      //   property = getField(field, 'body')
      // }
      const $input = view.$styleForm.find(":input[id='" + property + "']");
      if (property === 'border-before-style') {
        view.$styleForm
          .find(":input[id='border']")
          .val(value === 'solid' ? 'all' : 'none');
        //.change()
      } else if ($input.is(':checkbox')) {
        const checked = String(value) === $input.val();
        $input.prop('checked', checked).toggleClass('active', checked);
        //.change()
      } else if ($input.is('.editable-list')) {
        $input.val(value).trigger('reset');
        //.change()
      } else if ($input.is('[type=hidden]') || property === 'text-align') {
        // XXX use custom reset event instead of change because change is slow
        $input.val(value).trigger('reset');
        //.change()
      } else {
        $input.val(value);
        //.change()
      }
    }
  }

  function getValue(
    element: StyleName,
    property: Property,
    value: boolean | number | string
  ) {
    if (!(styles[element] && styles[element][property])) {
      return value;
    }
    switch (typeof styles[element][property]!.default) {
      case 'boolean':
        return value === 'true';
      case 'number':
        return Number(value);
      default:
        return value;
    }
  }

  /**
   * Update store when UI changes
   * @param event UI change event
   */
  function styleEditorHandler(event: ChangeEvent) {
    const input = $(event.target);
    const field = input.attr('id') as Property;
    const def = styles[pdfStyleSelectorCurrent][field];

    const currentStyle = store.getState().configuration.style;
    const oldValue = currentStyle[pdfStyleSelectorCurrent][field];
    let newValue: any;
    if (input.is(':checkbox')) {
      if (input.is(':checked')) {
        newValue = input.val();
      } else if (field === 'text-decoration') {
        newValue = 'none';
      } else {
        newValue = 'normal';
      }
    } else if (input.is('.editable-list')) {
      newValue = input.val();
    } else {
      newValue = input.val();
    }
    newValue = getValue(pdfStyleSelectorCurrent, field, newValue);

    const action = {
      configuration: {
        style: {
          [pdfStyleSelectorCurrent]: {
            [field]: newValue,
          },
        },
      },
    } as any;
    _.forEach(styles, (elementValue: any, element: any) => {
      const def = elementValue[field];
      if (
        !!def &&
        def.inherit === pdfStyleSelectorCurrent &&
        currentStyle[element as StyleName][field] === oldValue
      ) {
        action.configuration.style[element as StyleName]! = {
          [field]: newValue,
        };
      }
    });
    store.dispatch(setAction(action));
  }

  function borderEditorHandler(event: ChangeEvent) {
    const value = $(event.target).val();

    const props = {} as any;
    const directions = ['before', 'end', 'after', 'start'];
    if (value === 'none') {
      directions.forEach((direction) => {
        props[`border-${direction}-style`] = 'none';
      });
      directions.forEach((direction) => {
        props[`border-${direction}-width`] = '1pt';
      });
      directions.forEach((direction) => {
        props[`border-${direction}-color`] = 'black';
      });
    } else {
      directions.forEach((direction) => {
        props[`border-${direction}-style`] = 'solid';
      });
      directions.forEach((direction) => {
        props[`border-${direction}-width`] = '1pt';
      });
      directions.forEach((direction) => {
        props[`border-${direction}-color`] = 'black';
      });
    }
    const action = {
      configuration: {
        style: {
          [pdfStyleSelectorCurrent]: props,
        },
      },
    };

    store.dispatch(setAction(action));
  }
}
