import { Field, useFormikContext } from 'formik';
import React, { ChangeEvent } from 'react';
import StylePreview from './StylePreview';
import {
  convertBorder,
  CustomProperty,
  FoProperty,
  Property,
  Style,
  StyleName,
  styles,
} from '../../generator/styles';
import { nextValue, Values } from './common';

const propertySelections = {
  color: [
    { value: 'aqua', label: 'aqua' },
    { value: 'black', label: 'black' },
    { value: 'blue', label: 'blue' },
    { value: 'fuchsia', label: 'fuchsia' },
    { value: 'gray', label: 'gray' },
    { value: 'green', label: 'green' },
    { value: 'lime', label: 'lime' },
    { value: 'maroon', label: 'maroon' },
    { value: 'navy', label: 'navy' },
    { value: 'olive', label: 'olive' },
    { value: 'purple', label: 'purple' },
    { value: 'red', label: 'red' },
    { value: 'silver', label: 'silver' },
    { value: 'teal', label: 'teal' },
    { value: 'white', label: 'white' },
    { value: 'yellow', label: 'yellow' },
  ],
  'background-color': [
    { value: 'transparent', label: 'transparent' },
    { value: 'aqua', label: 'aqua' },
    { value: 'black', label: 'black' },
    { value: 'blue', label: 'blue' },
    { value: 'fuchsia', label: 'fuchsia' },
    { value: 'gray', label: 'gray' },
    { value: 'green', label: 'green' },
    { value: 'lime', label: 'lime' },
    { value: 'maroon', label: 'maroon' },
    { value: 'navy', label: 'navy' },
    { value: 'olive', label: 'olive' },
    { value: 'purple', label: 'purple' },
    { value: 'red', label: 'red' },
    { value: 'silver', label: 'silver' },
    { value: 'teal', label: 'teal' },
    { value: 'white', label: 'white' },
    { value: 'yellow', label: 'yellow' },
  ],
  'line-height': [
    { value: '1.2', label: 'Single' },
    { value: '1.8', label: '1.5 lines' },
    { value: '2.4', label: 'Double' },
  ],
  'font-size': [
    { value: '8pt', label: '8' },
    { value: '9pt', label: '9' },
    { value: '10pt', label: '10' },
    { value: '11pt', label: '11' },
    { value: '12pt', label: '12' },
    { value: '14pt', label: '14' },
    { value: '16pt', label: '16' },
    { value: '18pt', label: '18' },
    { value: '20pt', label: '20' },
    { value: '22pt', label: '22' },
    { value: '24pt', label: '24' },
    { value: '26pt', label: '26' },
    { value: '28pt', label: '28' },
    { value: '36pt', label: '36' },
    { value: '48pt', label: '48' },
    { value: '72pt', label: '72' },
  ],
  'font-family': [
    { value: 'Arial', label: 'Arial' },
    { value: 'Arial Black', label: 'Arial Black' },
    { value: 'Arial Unicode MS', label: 'Arial Unicode MS' },
    { value: 'Book Antiqua', label: 'Book Antiqua' },
    { value: 'Comic Sans MS', label: 'Comic Sans MS' },
    { value: 'Courier New', label: 'Courier New' },
    { value: 'Gadget', label: 'Gadget' },
    { value: 'Geneva', label: 'Geneva' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Impact', label: 'Impact' },
    { value: 'Lucida Console', label: 'Lucida Console' },
    { value: 'Lucida Grande', label: 'Lucida Grande' },
    { value: 'Lucida Sans Unicode', label: 'Lucida Sans Unicode' },
    { value: 'Monaco', label: 'Monaco' },
    { value: 'MS Serif', label: 'MS Serif' },
    { value: 'New York', label: 'New York' },
    { value: 'Palatino', label: 'Palatino' },
    { value: 'Palatino Linotype', label: 'Palatino Linotype' },
    { value: 'Symbol', label: 'Symbol' },
    { value: 'Tahoma', label: 'Tahoma' },
    { value: 'Times', label: 'Times' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Trebuchet MS', label: 'Trebuchet MS' },
    { value: 'Verdana', label: 'Verdana' },
    { value: 'Webdings', label: 'Webdings' },
  ],
};

const reducer = (prevState: Values) => ({
  ...prevState,
  style: {
    ...prevState.style,
    [prevState.style_selector]: {
      ...prevState.style[prevState.style_selector],
      ...convertBorder(prevState.style[prevState.style_selector].border_list),
    },
  },
});

export default function Styles() {
  const {
    values,
    setValues,
    setFieldValue,
    handleChange,
    validateOnChange,
  } = useFormikContext<Values>();

  React.useEffect(() => {
    setValues(reducer, false);
  }, [values.style[values.style_selector].border_list]);

  const handleListChange = (field: Property) => (e: ChangeEvent) => {
    const value = (e.currentTarget as HTMLSelectElement).value;
    handleChange(e);
    if (value !== '#other') {
      setFieldValue(`style.${values.style_selector}.${field}`, value);
    }
  };

  const handleLengthKeydown = (field: Property) => (e: KeyboardEvent) => {
    let value;
    switch (e.key) {
      case 'ArrowDown':
        value = nextValue(values.style[values.style_selector][field], -1);
        break;
      case 'ArrowUp':
        value = nextValue(values.style[values.style_selector][field], 1);
        break;
    }
    if (value !== undefined) {
      cascade(values.style_selector, field, value);
      setFieldValue(`style.${values.style_selector}.${field}`, value);
    }
  };

  const getCascadeChange = (
    styleName: StyleName,
    style: Style,
    newStyleName: StyleName,
    newProperty: Property,
    newValue: string
  ): {
    styleName: StyleName;
    property: Property;
    value: string;
  } | null => {
    if (
      style.inherit === newStyleName &&
      values.style[styleName][newProperty] ===
        values.style[newStyleName][newProperty]
    ) {
      return {
        styleName: styleName,
        property: newProperty,
        value: newValue,
      };
    }
    return null;
  };

  const cascade = (
    newStyleName: StyleName,
    property: Property,
    value: string
  ) => {
    const changes = [];
    for (const stylePair of Object.entries(styles)) {
      const [styleName, properties] = stylePair as [
        StyleName,
        Record<Property, Style>
      ];
      if (styleName === newStyleName) {
        continue;
      }
      const style = properties[property];
      if (style === undefined) {
        continue;
      }
      const change = getCascadeChange(
        styleName,
        style,
        newStyleName,
        property,
        value
      );
      if (change !== null) {
        changes.push(change);
      }
    }
    const updated: Record<StyleName, Record<Property, string>> = {
      ...values.style,
    };
    for (const change of changes) {
      updated[change.styleName][change.property] = change.value;
    }
    setFieldValue('style', updated);
  };

  const fieldProps = (property: Property) => ({
    name: `style.${values.style_selector}.${property}`,
    onChange: (event: React.ChangeEvent) => {
      const value = (event.currentTarget as HTMLSelectElement).value;
      cascade(values.style_selector, property, value);
      handleChange(event);
    },
  });

  return (
    <>
      <div className="form col-md-5" id="style-form">
        <h3>Style</h3>
        <Field component="select" name="style_selector">
          <optgroup label="Block" className="block">
            <option value="body">Normal</option>
            <option value="topic">Heading 1</option>
            <option value="topic_topic">Heading 2</option>
            <option value="topic_topic_topic">Heading 3</option>
            <option value="topic_topic_topic_topic">Heading 4</option>
            <option value="section">Section</option>
            <option value="section_title">Section title</option>
            <option value="example">Example</option>
            <option value="example_title">Example title</option>
            <option value="note">Note</option>
            <option value="pre">Preformatted</option>
            <option value="codeblock">Code block</option>
            <option value="ol">Ordered list</option>
            <option value="ul">Unordered list</option>
            <option value="dl">Definition list</option>
            <option value="table">Table</option>
            <option value="fig">Figure</option>
          </optgroup>
          <optgroup label="Inline">
            <option value="link">Link</option>
            <option value="tm">Trademark</option>
          </optgroup>
          <optgroup label="Table of contents">
            <option value="toc_1">level 1</option>
            <option value="toc_2">level 2</option>
            <option value="toc_3">level 3</option>
            <option value="toc_4">level 4</option>
          </optgroup>
        </Field>
        <table>
          <tbody>
            <tr>
              <th colSpan={2}>
                <h4>Formatting</h4>
              </th>
            </tr>
            <tr>
              <td colSpan={2}>
                <label htmlFor="font-family" className="inline hidden">
                  Family
                </label>
                <Field
                  component="select"
                  {...fieldProps(FoProperty.FONT_FAMILY)}
                  title="Font family"
                  aria-label="Font family"
                >
                  {propertySelections['font-family'].map(({ value, label }) => (
                    <option value={value} key={value}>
                      {label}
                    </option>
                  ))}
                </Field>{' '}
                <label htmlFor="font-size" className="inline hidden">
                  Size
                </label>
                <Field
                  component="select"
                  {...fieldProps(FoProperty.FONT_SIZE)}
                  title="Font size"
                  aria-label="Font size"
                >
                  {propertySelections['font-size'].map(({ value, label }) => (
                    <option value={value} key={value}>
                      {label}
                    </option>
                  ))}
                </Field>{' '}
                <div className="btn-group btn-group-inline" role="group">
                  <button
                    type="button"
                    className={`btn btn-default btn-font-weight btn-xs ${
                      values.style[values.style_selector]['font-weight'] ===
                      'bold'
                        ? 'active'
                        : ''
                    }`}
                    aria-label="Bold"
                    title="Bold"
                    onClick={() => {
                      const value =
                        values.style[values.style_selector]['font-weight'] ===
                        'normal'
                          ? 'bold'
                          : 'normal';
                      cascade(
                        values.style_selector,
                        FoProperty.FONT_WEIGHT,
                        value
                      );
                      setFieldValue(
                        `style.${values.style_selector}.font-weight`,
                        value
                      );
                    }}
                  >
                    <span
                      className="glyphicon glyphicon-bold"
                      aria-hidden="true"
                    ></span>
                  </button>
                  <button
                    type="button"
                    className={`btn btn-default btn-font-weight btn-xs ${
                      values.style[values.style_selector]['font-style'] ===
                      'italic'
                        ? 'active'
                        : ''
                    }`}
                    aria-label="Italic"
                    title="Italic"
                    onClick={() => {
                      const value =
                        values.style[values.style_selector]['font-style'] ===
                        'normal'
                          ? 'italic'
                          : 'normal';
                      cascade(
                        values.style_selector,
                        FoProperty.FONT_STYLE,
                        value
                      );
                      setFieldValue(
                        `style.${values.style_selector}.font-style`,
                        value
                      );
                    }}
                  >
                    <span
                      className="glyphicon glyphicon-italic"
                      aria-hidden="true"
                    ></span>
                  </button>
                  <button
                    type="button"
                    className={`btn btn-default btn-font-weight btn-xs ${
                      values.style[values.style_selector]['text-decoration'] ===
                      'underline'
                        ? 'active'
                        : ''
                    }`}
                    aria-label="Underline"
                    title="Underline"
                    onClick={() => {
                      const value =
                        values.style[values.style_selector][
                          'text-decoration'
                        ] === 'none'
                          ? 'underline'
                          : 'none';
                      cascade(
                        values.style_selector,
                        FoProperty.TEXT_DECORATION,
                        value
                      );
                      setFieldValue(
                        `style.${values.style_selector}.text-decoration`,
                        value
                      );
                    }}
                  >
                    <span
                      className="glyphicon glyphicon-text-color"
                      aria-hidden="true"
                    ></span>
                  </button>
                </div>
                <br />
                <label htmlFor="color" className="inline">
                  Color
                </label>
                :{' '}
                <Field
                  component="select"
                  name={`style.${values.style_selector}.color-list`}
                  onChange={handleListChange(FoProperty.COLOR)}
                  title="Color"
                >
                  {propertySelections['color'].map(({ value, label }) => (
                    <option value={value} key={value}>
                      {label}
                    </option>
                  ))}
                  <option value="#other">other…</option>
                </Field>{' '}
                {values.style[values.style_selector]['color-list'] ===
                  '#other' && (
                  <Field
                    type="text"
                    {...fieldProps(FoProperty.COLOR)}
                    size={7}
                  />
                )}
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                <label htmlFor="background-color" className="inline">
                  Background color
                </label>
                :{' '}
                <Field
                  component="select"
                  name={`style.${values.style_selector}.background-color-list`}
                  onChange={handleListChange(FoProperty.BACKGROUND_COLOR)}
                  title="Background color"
                >
                  {propertySelections['background-color'].map(
                    ({ value, label }) => (
                      <option value={value} key={value}>
                        {label}
                      </option>
                    )
                  )}
                  <option value="#other">other…</option>
                </Field>{' '}
                {values.style[values.style_selector][
                  'background-color-list'
                ] === '#other' && (
                  <Field
                    type="text"
                    {...fieldProps(FoProperty.BACKGROUND_COLOR)}
                    size={7}
                  />
                )}
              </td>
            </tr>
            <tr className="style-selector-block">
              <th colSpan={2}>
                <h4>Indents and Spacing</h4>
              </th>
            </tr>
            <tr className="style-selector-block">
              <td colSpan={2}>
                <div className="btn-group" role="group">
                  {[
                    {
                      label: 'Left align',
                      value: 'start',
                      icon: 'glyphicon-align-left',
                    },
                    {
                      label: 'Center align',
                      value: 'center',
                      icon: 'glyphicon-align-center',
                    },
                    {
                      label: 'Right align',
                      value: 'end',
                      icon: 'glyphicon-align-right',
                    },
                    {
                      label: 'Justify',
                      value: 'justify',
                      icon: 'glyphicon-align-justify',
                    },
                  ].map((conf) => (
                    <button
                      key={conf.value}
                      type="button"
                      className={`btn btn-default btn-font-weight btn-xs ${
                        values.style[values.style_selector]['text-align'] ===
                        conf.value
                          ? 'active'
                          : ''
                      }`}
                      aria-label={conf.label}
                      title={conf.label}
                      value={conf.value}
                      onClick={() => {
                        cascade(
                          values.style_selector,
                          FoProperty.TEXT_ALIGN,
                          conf.value
                        );
                        setFieldValue(
                          `style.${values.style_selector}.text-align`,
                          conf.value
                        );
                      }}
                    >
                      <span
                        className={`glyphicon ${conf.icon}`}
                        aria-hidden="true"
                      ></span>
                    </button>
                  ))}
                </div>
              </td>
            </tr>
            <tr className="style-selector-block">
              <td>
                <label className="inline">Indentation</label>
                <table>
                  <tbody>
                    <tr className="style-selector-block">
                      <th>
                        <label htmlFor="start-indent" className="inline">
                          Left
                        </label>
                        :{' '}
                      </th>
                      <td>
                        <Field
                          {...fieldProps(FoProperty.START_INDENT)}
                          // name={`style.${values.style_selector}.start-indent`}
                          pattern="(\d+(\.\d+)?|\.\d+)(pt|mm|in|pc|cm|em)"
                          onKeyDown={handleLengthKeydown(
                            FoProperty.START_INDENT
                          )}
                          size={5}
                          className="length-value"
                          title="Before text indent"
                        />
                      </td>
                    </tr>
                    <tr className="style-selector-block">
                      <th>
                        <label htmlFor="end-indent" className="inline">
                          Right
                        </label>
                        :{' '}
                      </th>
                      <td>
                        <Field
                          name={`style.${values.style_selector}.end-indent`}
                          pattern="(\d+(\.\d+)?|\.\d+)(pt|mm|in|pc|cm|em)"
                          onKeyDown={handleLengthKeydown(FoProperty.END_INDENT)}
                          size={5}
                          className="length-value"
                          title="After text indent"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              {values.style_selector === 'note' && (
                <td data-style="note">
                  <label htmlFor="icon" className="inline">
                    Note icon
                  </label>
                  :{' '}
                  <Field
                    name={`style.${values.style_selector}.icon`}
                    type="checkbox"
                  />
                </td>
              )}
            </tr>
            {values.style_selector === 'link' && (
              <tr data-style="link">
                <td>
                  <label htmlFor="link-page-number" className="inline">
                    Page number
                  </label>
                  :{' '}
                  <Field
                    name={`style.${values.style_selector}.link-page-number`}
                    type="checkbox"
                    title="Add page number to links."
                  />
                </td>
                <td>
                  <label htmlFor="link-url" className="inline">
                    Show URL
                  </label>
                  :{' '}
                  <Field
                    name={`style.${values.style_selector}.link-url`}
                    type="checkbox"
                    title="Show external link address."
                  />
                </td>
              </tr>
            )}
            {values.style_selector === 'tm' && (
              <tr data-style="tm">
                <td colSpan={2}>
                  <label htmlFor="symbol-scope" className="inline">
                    Symbol scope
                  </label>
                  :{' '}
                  <Field
                    component="select"
                    {...fieldProps(CustomProperty.SYMBOL_SCOPE)}
                  >
                    <option value="always">always</option>
                    <option value="chapter">chapter</option>
                    <option value="never">never</option>
                  </Field>
                </td>
              </tr>
            )}
            <tr className="style-selector-block">
              <td>
                <label className="inline">Spacing</label>
                <table>
                  <tbody>
                    <tr className="style-selector-block">
                      <th>
                        <label htmlFor="space-before" className="inline">
                          Before
                        </label>
                        :{' '}
                      </th>
                      <td>
                        <Field
                          name={`style.${values.style_selector}.space-before`}
                          pattern="(\d+(\.\d+)?|\.\d+)(pt|mm|in|pc|cm|em)"
                          onKeyDown={handleLengthKeydown(
                            FoProperty.SPACE_BEFORE
                          )}
                          size={5}
                          className="length-value"
                        />
                      </td>
                    </tr>
                    <tr className="style-selector-block">
                      <th>
                        <label htmlFor="space-after" className="inline">
                          After
                        </label>
                        :{' '}
                      </th>
                      <td>
                        <Field
                          name={`style.${values.style_selector}.space-after`}
                          pattern="(\d+(\.\d+)?|\.\d+)(pt|mm|in|pc|cm|em)"
                          onKeyDown={handleLengthKeydown(
                            FoProperty.SPACE_AFTER
                          )}
                          size={5}
                          className="length-value"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td>
                <table>
                  <tbody>
                    <tr>
                      <th colSpan={2}>
                        <label htmlFor="line-height" className="inline">
                          Line spacing
                        </label>
                        :{' '}
                      </th>
                    </tr>
                    <tr>
                      <td>
                        <Field
                          component="select"
                          name={`style.${values.style_selector}.line-height-list`}
                          onChange={handleListChange(FoProperty.LINE_HEIGHT)}
                        >
                          {propertySelections['line-height'].map(
                            ({ value, label }) => (
                              <option value={value} key={value}>
                                {label}
                              </option>
                            )
                          )}
                          <option value="#other">Exactly</option>
                        </Field>
                      </td>
                      {values.style[values.style_selector][
                        'line-height-list'
                      ] === '#other' && (
                        <td>
                          <Field
                            {...fieldProps(FoProperty.LINE_HEIGHT)}
                            pattern="(\d+(\.\d+)?|\.\d+)(pt|mm|in|pc|cm|em)?"
                            onKeyDown={handleLengthKeydown(
                              FoProperty.LINE_HEIGHT
                            )}
                            size={5}
                            className="length-or-number-value"
                          />
                        </td>
                      )}
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr className="style-selector-block">
              <td>
                <label className="inline">Padding</label>
                <table>
                  <tbody>
                    <tr className="style-selector-block">
                      <th>
                        <label htmlFor="padding-left" className="inline">
                          Left
                        </label>
                        :{' '}
                      </th>
                      <td>
                        <Field
                          {...fieldProps(FoProperty.PADDING_LEFT)}
                          pattern="(\d+(\.\d+)?|\.\d+)(pt|mm|in|pc|cm|em)"
                          onKeyDown={handleLengthKeydown(
                            FoProperty.PADDING_LEFT
                          )}
                          size={5}
                          className="length-value"
                        />
                      </td>
                    </tr>
                    <tr className="style-selector-block">
                      <th>
                        <label htmlFor="padding-right" className="inline">
                          Right
                        </label>
                        :{' '}
                      </th>
                      <td>
                        <Field
                          {...fieldProps(FoProperty.PADDING_RIGHT)}
                          pattern="(\d+(\.\d+)?|\.\d+)(pt|mm|in|pc|cm|em)"
                          onKeyDown={handleLengthKeydown(
                            FoProperty.PADDING_RIGHT
                          )}
                          size={5}
                          className="length-value"
                        />
                      </td>
                    </tr>
                    <tr className="style-selector-block">
                      <th>
                        <label htmlFor="padding-top" className="inline">
                          Top
                        </label>
                        :{' '}
                      </th>
                      <td>
                        <Field
                          {...fieldProps(FoProperty.PADDING_TOP)}
                          pattern="(\d+(\.\d+)?|\.\d+)(pt|mm|in|pc|cm|em)"
                          onKeyDown={handleLengthKeydown(
                            FoProperty.PADDING_TOP
                          )}
                          size={5}
                          className="length-value"
                        />
                      </td>
                    </tr>
                    <tr className="style-selector-block">
                      <th>
                        <label htmlFor="padding-bottom" className="inline">
                          Bottom
                        </label>
                        :{' '}
                      </th>
                      <td>
                        <Field
                          {...fieldProps(FoProperty.PADDING_BOTTOM)}
                          pattern="(\d+(\.\d+)?|\.\d+)(pt|mm|in|pc|cm|em)"
                          onKeyDown={handleLengthKeydown(
                            FoProperty.PADDING_BOTTOM
                          )}
                          size={5}
                          className="length-value"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr className="style-selector-block">
              <td colSpan={2}>
                <label htmlFor="border_list" className="inline">
                  Border
                </label>
                :{' '}
                <Field
                  component="select"
                  name={`style.${values.style_selector}.border_list`}
                >
                  <option value="none">no border</option>
                  <option value="all">all</option>
                  <option value="top">top</option>
                  <option value="bottom">bottom</option>
                  <option value="topbot">top and bottom</option>
                  <option value="sides">sides</option>
                </Field>
              </td>
            </tr>
          </tbody>
          {[
            'topic',
            'topic_topic',
            'topic_topic_topic',
            'topic_topic_topic_topic',
          ].includes(values.style_selector) && (
            <tbody data-style="topic topic_topic topic_topic_topic topic_topic_topic_topic">
              <tr>
                <th colSpan={2}>
                  <h4>Numbering</h4>
                </th>
              </tr>
              <tr>
                <td colSpan={2}>
                  <label htmlFor="title-numbering" className="inline">
                    Title numbering
                  </label>
                  :{' '}
                  <Field
                    type="checkbox"
                    name={`style.${values.style_selector}.title-numbering`}
                    title="Title numbering"
                  />
                </td>
              </tr>
            </tbody>
          )}
          {values.style_selector === 'dl' && (
            <tbody data-style="dl">
              <tr>
                <th colSpan={2}>
                  <h4>List styles</h4>
                </th>
              </tr>
              <tr>
                <td colSpan={2}>
                  <label htmlFor="dl-type" className="inline">
                    List type
                  </label>
                  :{' '}
                  <Field
                    component="select"
                    name={`style.${values.style_selector}.dl-type`}
                    title="Definition list style"
                  >
                    <option value="table">table</option>
                    <option value="html">HTML style</option>
                    <option value="list">bullet list</option>
                  </Field>
                </td>
              </tr>
            </tbody>
          )}
          {values.style_selector === 'ol' && (
            <tbody data-style="ol">
              <tr>
                <th colSpan={2}>
                  <h4>Ordered list styles</h4>
                </th>
              </tr>
              <tr>
                <td colSpan={2}>
                  <table>
                    <thead>
                      <tr>
                        <th>Level</th>
                        <th>Numbering</th>
                        <th>Before</th>
                        <th>After</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>1</th>
                        <td>
                          <Field
                            component="select"
                            name={`style.${values.style_selector}.ol-1`}
                          >
                            <option value="1">1, 2, 3, …</option>
                            <option value="A">A, B, C, …</option>
                            <option value="a">a, b, c, …</option>
                            <option value="I">I, II, III, …</option>
                            <option value="i">i, ii, iii, …</option>
                          </Field>
                        </td>
                        <td>
                          <Field
                            name={`style.${values.style_selector}.ol-before-1`}
                            size={1}
                          />
                        </td>
                        <td>
                          <Field
                            name={`style.${values.style_selector}.ol-after-1`}
                            size={2}
                          />
                        </td>
                      </tr>
                      <tr>
                        <th>2</th>
                        <td>
                          <Field
                            component="select"
                            name={`style.${values.style_selector}.ol-2`}
                          >
                            <option value="1">1, 2, 3, …</option>
                            <option value="A">A, B, C, …</option>
                            <option value="a">a, b, c, …</option>
                            <option value="I">I, II, III, …</option>
                            <option value="i">i, ii, iii, …</option>
                          </Field>
                        </td>
                        <td>
                          <Field
                            name={`style.${values.style_selector}.ol-before-2`}
                            size={1}
                          />
                        </td>
                        <td>
                          <Field
                            name={`style.${values.style_selector}.ol-after-2`}
                            size={2}
                          />
                        </td>
                      </tr>
                      <tr>
                        <th>3</th>
                        <td>
                          <Field
                            component="select"
                            name={`style.${values.style_selector}.ol-3`}
                          >
                            <option value="1">1, 2, 3, …</option>
                            <option value="A">A, B, C, …</option>
                            <option value="a">a, b, c, …</option>
                            <option value="I">I, II, III, …</option>
                            <option value="i">i, ii, iii, …</option>
                          </Field>
                        </td>
                        <td>
                          <Field
                            name={`style.${values.style_selector}.ol-before-3`}
                            size={1}
                          />
                        </td>
                        <td>
                          <Field
                            name={`style.${values.style_selector}.ol-after-3`}
                            size={2}
                          />
                        </td>
                      </tr>
                      <tr>
                        <th>4</th>
                        <td>
                          <Field
                            component="select"
                            name={`style.${values.style_selector}.ol-4`}
                          >
                            <option value="1">1, 2, 3, …</option>
                            <option value="A">A, B, C, …</option>
                            <option value="a">a, b, c, …</option>
                            <option value="I">I, II, III, …</option>
                            <option value="i">i, ii, iii, …</option>
                          </Field>
                        </td>
                        <td>
                          <Field
                            name={`style.${values.style_selector}.ol-before-4`}
                            size={1}
                          />
                        </td>
                        <td>
                          <Field
                            name={`style.${values.style_selector}.ol-after-4`}
                            size={2}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          )}
          {values.style_selector === 'ul' && (
            <tbody data-style="ul">
              <tr>
                <th colSpan={2}>
                  <h4>Unordered list styles</h4>
                </th>
              </tr>
              <tr>
                <td colSpan={2}>
                  <table>
                    <thead>
                      <tr>
                        <th>Level</th>
                        <th>Character</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>1</th>
                        <td>
                          <Field
                            component="select"
                            name={`style.${values.style_selector}.ul-1`}
                          >
                            <option value="&#x2022;">&#x2022;</option>
                            <option value="&#x25C6;">&#x25C6;</option>
                            <option value="&#x2014;">&#x2014;</option>
                            <option value="&#x2013;">&#x2013;</option>
                            <option value="&#x2012;">&#x2012;</option>
                          </Field>
                        </td>
                      </tr>
                      <tr>
                        <th>2</th>
                        <td>
                          <Field
                            component="select"
                            name={`style.${values.style_selector}.ul-2`}
                          >
                            <option value="&#x2022;">&#x2022;</option>
                            <option value="&#x25C6;">&#x25C6;</option>
                            <option value="&#x2014;">&#x2014;</option>
                            <option value="&#x2013;">&#x2013;</option>
                            <option value="&#x2012;">&#x2012;</option>
                          </Field>
                        </td>
                      </tr>
                      <tr>
                        <th>3</th>
                        <td>
                          <Field
                            component="select"
                            name={`style.${values.style_selector}.ul-3`}
                          >
                            <option value="&#x2022;">&#x2022;</option>
                            <option value="&#x25C6;">&#x25C6;</option>
                            <option value="&#x2014;">&#x2014;</option>
                            <option value="&#x2013;">&#x2013;</option>
                            <option value="&#x2012;">&#x2012;</option>
                          </Field>
                        </td>
                      </tr>
                      <tr>
                        <th>4</th>
                        <td>
                          <Field
                            component="select"
                            name={`style.${values.style_selector}.ul-4`}
                          >
                            <option value="&#x2022;">&#x2022;</option>
                            <option value="&#x25C6;">&#x25C6;</option>
                            <option value="&#x2014;">&#x2014;</option>
                            <option value="&#x2013;">&#x2013;</option>
                            <option value="&#x2012;">&#x2012;</option>
                          </Field>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          )}
          {values.style_selector === 'table' ||
            (values.style_selector === 'fig' && (
              <tbody data-style="table fig">
                <tr>
                  <th colSpan={2}>
                    <h4>Captions</h4>
                  </th>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <label htmlFor="caption-number" className="inline">
                      Numbering
                    </label>
                    :{' '}
                    <Field
                      component="select"
                      name={`style.${values.style_selector}.caption-number`}
                      title="Caption numbering"
                    >
                      <option value="document">Document wide</option>
                      <option value="chapter">Chapter wide</option>
                      <option value="none">No numbering</option>
                    </Field>
                    <label htmlFor="caption-position" className="inline">
                      Position
                    </label>
                    :{' '}
                    <Field
                      component="select"
                      name={`style.${values.style_selector}.caption-position`}
                      title="Caption position"
                    >
                      <option value="before">Above</option>
                      <option value="after">Below</option>
                    </Field>
                  </td>
                </tr>
              </tbody>
            ))}
          {values.style_selector === 'toc_1' && (
            <tbody data-style="toc_1">
              <tr>
                <th colSpan={2}>
                  <h4>Chapter prefix</h4>
                </th>
              </tr>
              <tr>
                <td colSpan={2}>
                  <label htmlFor="prefix" className="inline">
                    Top-level prefix
                  </label>
                  :{' '}
                  <Field
                    name={`style.${values.style_selector}.prefix`}
                    title="Chapter prefix"
                    type="checkbox"
                  />
                </td>
              </tr>
            </tbody>
          )}
          {values.style_selector === 'codeblock' && (
            <tbody data-style="codeblock">
              <tr>
                <th colSpan={2}>
                  <h4>Numbering</h4>
                </th>
              </tr>
              <tr>
                <td colSpan={2}>
                  <label htmlFor="line-numbering" className="inline">
                    Line numbering
                  </label>
                  :{' '}
                  <Field
                    name={`style.${values.style_selector}.line-numbering`}
                    title="Line numbering"
                    type="checkbox"
                  />
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
      {/*<div className="example-block col-md-7" id="example-style">*/}
      {/*  <pre>{JSON.stringify(values.style[values.style_selector], undefined, 2)}</pre>*/}
      {/*</div>*/}
      <StylePreview values={values} />
    </>
  );
}
