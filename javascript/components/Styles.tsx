import { Field, useFormikContext } from 'formik';
import React, { ChangeEvent } from 'react';
import { Values } from '../app/Model';
import StylePreview from './StylePreview';
import { Property, Style, StyleName, styles } from '../lib/styles';

export default function Styles() {
  const {
    values,
    setFieldValue,
    handleChange,
    validateOnChange,
  } = useFormikContext<Values>();
  const handleListChange = (field: Property) => (e: ChangeEvent) => {
    const value = (e.currentTarget as HTMLSelectElement).value;
    handleChange(e);
    if (value !== '#other') {
      setFieldValue(`style.${values.style_selector}.${field}`, value);
    }
  };

  const nextValue = (value: string, direction: 1 | -1) => {
    const unit = value.replaceAll(/[\d\.]+/g, '');
    const num = Number(unit ? value.substring(0, value.indexOf(unit)) : value);
    if (Number.isNaN(num)) {
      return value;
    }
    let res: number;
    switch (unit) {
      case 'mm':
      case 'pt':
      case 'pc':
      case 'px':
        res = num + direction;
        break;
      case '':
      case 'cm':
      case 'in':
      case 'em':
      default:
        // Hack around floating point number increments
        res = (num * 10 + 1 * direction) / 10;
        break;
    }
    return `${res}${unit}`;
  };

  const handleLengthKeydown = (field: Property) => (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        setFieldValue(
          `style.${values.style_selector}.${field}`,
          nextValue(values.style[values.style_selector][field], -1)
        );
        break;
      case 'ArrowUp':
        setFieldValue(
          `style.${values.style_selector}.${field}`,
          nextValue(values.style[values.style_selector][field], 1)
        );
        break;
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
      const change = getCascadeChange(
        styleName,
        properties[property],
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
    }
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
            <option value="section">Section title</option>
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
                  {...fieldProps('font-family')}
                  // name={`style.${values.style_selector}.font-family`}
                  title="Font family"
                  aria-label="Font family"
                  // onChange={handleCascadingChange('font-family')}
                >
                  <option value="Arial">Arial</option>
                  <option value="Arial Black">Arial Black</option>
                  <option value="Arial Unicode MS">Arial Unicode MS</option>
                  <option value="Book Antiqua">Book Antiqua</option>
                  <option value="Comic Sans MS">Comic Sans MS</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Gadget">Gadget</option>
                  <option value="Geneva">Geneva</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Impact">Impact</option>
                  <option value="Lucida Console">Lucida Console</option>
                  <option value="Lucida Grande">Lucida Grande</option>
                  <option value="Lucida Sans Unicode">
                    Lucida Sans Unicode
                  </option>
                  <option value="Monaco">Monaco</option>
                  <option value="MS Serif">MS Serif</option>
                  <option value="New York">New York</option>
                  <option value="Palatino">Palatino</option>
                  <option value="Palatino Linotype">Palatino Linotype</option>
                  <option value="Symbol">Symbol</option>
                  <option value="Tahoma">Tahoma</option>
                  <option value="Times">Times</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Trebuchet MS">Trebuchet MS</option>
                  <option value="Verdana">Verdana</option>
                  <option value="Webdings">Webdings</option>
                </Field>{' '}
                <label htmlFor="font-size" className="inline hidden">
                  Size
                </label>
                <Field
                  component="select"
                  name={`style.${values.style_selector}.font-size`}
                  title="Font size"
                  aria-label="Font size"
                >
                  <option value="8pt">8</option>
                  <option value="9pt">9</option>
                  <option value="10pt">10</option>
                  <option value="11pt">11</option>
                  <option value="12pt">12</option>
                  <option value="14pt">14</option>
                  <option value="16pt">16</option>
                  <option value="18pt">18</option>
                  <option value="20pt">20</option>
                  <option value="22pt">22</option>
                  <option value="24pt">24</option>
                  <option value="26pt">26</option>
                  <option value="28pt">28</option>
                  <option value="36pt">36</option>
                  <option value="48pt">48</option>
                  <option value="72pt">72</option>
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
                    onClick={() =>
                      setFieldValue(
                        `style.${values.style_selector}.font-weight`,
                        values.style[values.style_selector]['font-weight'] ===
                          'normal'
                          ? 'bold'
                          : 'normal'
                      )
                    }
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
                    onClick={() =>
                      setFieldValue(
                        `style.${values.style_selector}.font-style`,
                        values.style[values.style_selector]['font-style'] ===
                          'normal'
                          ? 'italic'
                          : 'normal'
                      )
                    }
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
                    onClick={() =>
                      setFieldValue(
                        `style.${values.style_selector}.text-decoration`,
                        values.style[values.style_selector][
                          'text-decoration'
                        ] === 'none'
                          ? 'underline'
                          : 'none'
                      )
                    }
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
                  onChange={handleListChange('color')}
                  title="Color"
                >
                  <option value="aqua">aqua</option>
                  <option value="black">black</option>
                  <option value="blue">blue</option>
                  <option value="fuchsia">fuchsia</option>
                  <option value="gray">gray</option>
                  <option value="green">green</option>
                  <option value="lime">lime</option>
                  <option value="maroon">maroon</option>
                  <option value="navy">navy</option>
                  <option value="olive">olive</option>
                  <option value="purple">purple</option>
                  <option value="red">red</option>
                  <option value="silver">silver</option>
                  <option value="teal">teal</option>
                  <option value="white">white</option>
                  <option value="yellow">yellow</option>
                  <option value="#other">other…</option>
                </Field>{' '}
                {values.style[values.style_selector]['color-list'] ===
                  '#other' && (
                  <Field
                    type="text"
                    name={`style.${values.style_selector}.color`}
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
                  onChange={handleListChange('background-color')}
                  title="Background color"
                >
                  <option value="transparent">transparent</option>
                  <option value="aqua">aqua</option>
                  <option value="black">black</option>
                  <option value="blue">blue</option>
                  <option value="fuchsia">fuchsia</option>
                  <option value="gray">gray</option>
                  <option value="green">green</option>
                  <option value="lime">lime</option>
                  <option value="maroon">maroon</option>
                  <option value="navy">navy</option>
                  <option value="olive">olive</option>
                  <option value="purple">purple</option>
                  <option value="red">red</option>
                  <option value="silver">silver</option>
                  <option value="teal">teal</option>
                  <option value="white">white</option>
                  <option value="yellow">yellow</option>
                  <option value="#other">other…</option>
                </Field>{' '}
                {values.style[values.style_selector][
                  'background-color-list'
                ] === '#other' && (
                  <Field
                    type="text"
                    name={`style.${values.style_selector}.background-color`}
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
                      onClick={() =>
                        setFieldValue(
                          `style.${values.style_selector}.text-align`,
                          conf.value
                        )
                      }
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
                          {...fieldProps('start-indent')}
                          // name={`style.${values.style_selector}.start-indent`}
                          pattern="(\d+(\.\d+)?|\.\d+)(pt|mm|in|pc|cm|em)"
                          onKeyDown={handleLengthKeydown('start-indent')}
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
                          onKeyDown={handleLengthKeydown('end-indent')}
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
                    name={`style.${values.style_selector}.symbol-scope`}
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
                          onKeyDown={handleLengthKeydown('space-before')}
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
                          onKeyDown={handleLengthKeydown('space-after')}
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
                          onChange={handleListChange('line-height')}
                        >
                          <option value="1.2">Single</option>
                          <option value="1.8">1.5 lines</option>
                          <option value="2.4">Double</option>
                          <option value="#other">Exactly</option>
                        </Field>
                      </td>
                      {values.style[values.style_selector][
                        'line-height-list'
                      ] === '#other' && (
                        <td>
                          <Field
                            name={`style.${values.style_selector}.line-height`}
                            pattern="(\d+(\.\d+)?|\.\d+)(pt|mm|in|pc|cm|em)?"
                            onKeyDown={handleLengthKeydown('line-height')}
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
                          name={`style.${values.style_selector}.padding-left`}
                          pattern="(\d+(\.\d+)?|\.\d+)(pt|mm|in|pc|cm|em)"
                          onKeyDown={handleLengthKeydown('padding-left')}
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
                          name={`style.${values.style_selector}.padding-right`}
                          pattern="(\d+(\.\d+)?|\.\d+)(pt|mm|in|pc|cm|em)"
                          onKeyDown={handleLengthKeydown('padding-right')}
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
                          name={`style.${values.style_selector}.padding-top`}
                          pattern="(\d+(\.\d+)?|\.\d+)(pt|mm|in|pc|cm|em)"
                          onKeyDown={handleLengthKeydown('padding-top')}
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
                          name={`style.${values.style_selector}.padding-bottom`}
                          pattern="(\d+(\.\d+)?|\.\d+)(pt|mm|in|pc|cm|em)"
                          onKeyDown={handleLengthKeydown('padding-bottom')}
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
                <label htmlFor="border" className="inline">
                  Border
                </label>
                :{' '}
                <Field
                  component="select"
                  name={`style.${values.style_selector}.border`}
                >
                  <option value="none">no border</option>
                  <option value="all">all</option>
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
