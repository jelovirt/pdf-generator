import React from 'react';

export default function Styles() {
  return (
    <div className="form col-md-5" id="style-form">
      <h3>Style</h3>
      <input type="hidden" id="style-selector-current" />
      <select id="style-selector">
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
          <option value="toc_1">TOC 1</option>
          <option value="toc_2">TOC 2</option>
          <option value="toc_3">TOC 3</option>
          <option value="toc_4">TOC 4</option>
        </optgroup>
        <optgroup label="Inline">
          <option value="link">Link</option>
          <option value="tm">Trademark</option>
        </optgroup>
      </select>
      <table>
        <tbody>
          <tr>
            <th colspan="2">
              <h4>Formatting</h4>
            </th>
          </tr>
          <tr>
            <td colspan="2">
              <label htmlFor="font-family" className="inline hidden">
                Family
              </label>
              <select
                id="font-family"
                title="Font family"
                aria-label="Font family"
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
                <option value="Lucida Sans Unicode">Lucida Sans Unicode</option>
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
              </select>
              <label htmlFor="font-size" className="inline hidden">
                Size
              </label>
              <select id="font-size" title="Font size" aria-label="Font size">
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
              </select>
              <div className="btn-group btn-group-inline" role="group">
                <button
                  type="button"
                  className="btn btn-default btn-font-weight btn-xs"
                  aria-label="Bold"
                  title="Bold"
                >
                  <span
                    className="glyphicon glyphicon-bold"
                    aria-hidden="true"
                  ></span>
                </button>
                <button
                  type="button"
                  className="btn btn-default btn-font-style btn-xs"
                  aria-label="Italic"
                  title="Italic"
                >
                  <span
                    className="glyphicon glyphicon-italic"
                    aria-hidden="true"
                  ></span>
                </button>
                <button
                  type="button"
                  className="btn btn-default btn-text-decoration btn-xs"
                  aria-label="Underline"
                  title="Underline"
                >
                  <span
                    className="glyphicon glyphicon-text-color"
                    aria-hidden="true"
                  ></span>
                </button>
              </div>
              <input id="font-weight" type="hidden" />
              <input id="font-style" type="hidden" />
              <input id="text-decoration" type="hidden" />
              <br />
              <label htmlFor="color" className="inline">
                Color
              </label>
              :
              <input type="hidden" id="color" className="editable-list" />
              <select id="color.list" title="Color">
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
              </select>
              <input
                type="text"
                id="color.other"
                style={{ display: 'none' }}
                size="7"
              />
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <label htmlFor="background-color" className="inline">
                Background color
              </label>
              :
              <input
                type="hidden"
                id="background-color"
                className="editable-list"
              />
              <select id="background-color.list" title="Background color">
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
              </select>
              <input
                type="text"
                id="background-color.other"
                style={{ display: 'none' }}
                size="7"
              />
            </td>
          </tr>
          <tr className="style-selector-block">
            <th colspan="2">
              <h4>Indents and Spacing</h4>
            </th>
          </tr>
          <tr className="style-selector-block">
            <td colspan="2">
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className="btn btn-default btn-text-align btn-xs"
                  aria-label="Left align"
                  title="Left align"
                  value="start"
                >
                  <span
                    className="glyphicon glyphicon-align-left"
                    aria-hidden="true"
                  ></span>
                </button>
                <button
                  type="button"
                  className="btn btn-default btn-text-align btn-xs"
                  aria-label="Center align"
                  title="Center align"
                  value="center"
                >
                  <span
                    className="glyphicon glyphicon-align-center"
                    aria-hidden="true"
                  ></span>
                </button>
                <button
                  type="button"
                  className="btn btn-default btn-text-align btn-xs"
                  aria-label="Right align"
                  title="Right align"
                  value="end"
                >
                  <span
                    className="glyphicon glyphicon-align-right"
                    aria-hidden="true"
                  ></span>
                </button>
                <button
                  type="button"
                  className="btn btn-default btn-text-align btn-xs"
                  aria-label="Justify"
                  title="Justify"
                  value="justify"
                >
                  <span
                    className="glyphicon glyphicon-align-justify"
                    aria-hidden="true"
                  ></span>
                </button>
              </div>
              <input type="hidden" id="text-align" />
            </td>
          </tr>
          <tr className="style-selector-block">
            <td>
              <label className="inline">Indentation</label>
              <table>
                <tr className="style-selector-block">
                  <th>
                    <label htmlFor="start-indent" className="inline">
                      Left
                    </label>
                    :
                  </th>
                  <td>
                    <input
                      id="start-indent"
                      pattern="(\d+(\.\d+)?|\.\d+)(pt|mm|in|pc|cm|em)"
                      size="5"
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
                    :
                  </th>
                  <td>
                    <input
                      id="end-indent"
                      pattern="(\d+(\.\d+)?|\.\d+)(pt|mm|in|pc|cm|em)"
                      size="5"
                      className="length-value"
                      title="After text indent"
                    />
                  </td>
                </tr>
              </table>
            </td>
            <td data-style="note">
              <label htmlFor="icon" className="inline">
                Note icon
              </label>
              :
              <input id="icon" type="checkbox" value="icon" checked />
            </td>
          </tr>
          <tr data-style="link">
            <td>
              <label htmlFor="link-page-number" className="inline">
                Page number
              </label>
              :
              <input
                id="link-page-number"
                type="checkbox"
                value="true"
                checked
                title="Add page number to links."
              />
            </td>
            <td>
              <label htmlFor="link-url" className="inline">
                Show URL
              </label>
              :
              <input
                id="link-url"
                type="checkbox"
                value="true"
                title="Show external link address."
              />
            </td>
          </tr>
          <tr data-style="tm">
            <td colspan="2">
              <label htmlFor="symbol-scope" className="inline">
                Symbol scope
              </label>
              :
              <select id="symbol-scope">
                <option value="always" selected>
                  always
                </option>
                <option value="chapter">chapter</option>
                <option value="never">never</option>
              </select>
            </td>
          </tr>
          <tr className="style-selector-block">
            <td>
              <label className="inline">Spacing</label>
              <table>
                <tr className="style-selector-block">
                  <th>
                    <label htmlFor="space-before" className="inline">
                      Before
                    </label>
                    :
                  </th>
                  <td>
                    <input
                      id="space-before"
                      pattern="(\d+(\.\d+)?|\.\d+)(pt|mm|in|pc|cm|em)"
                      size="5"
                      className="length-value"
                    />
                  </td>
                </tr>
                <tr className="style-selector-block">
                  <th>
                    <label htmlFor="space-after" className="inline">
                      After
                    </label>
                    :
                  </th>
                  <td>
                    <input
                      id="space-after"
                      pattern="(\d+(\.\d+)?|\.\d+)(pt|mm|in|pc|cm|em)"
                      size="5"
                      className="length-value"
                    />
                  </td>
                </tr>
              </table>
            </td>
            <td>
              <table>
                <tr>
                  <th colspan="2">
                    <label htmlFor="line-height" className="inline">
                      Line spacing
                    </label>
                    :
                  </th>
                </tr>
                <tr>
                  <td>
                    <input
                      type="hidden"
                      id="line-height"
                      className="editable-list"
                    />
                    <select id="line-height.list">
                      <option value="1.2" selected>
                        Single
                      </option>
                      <option value="1.8">1.5 lines</option>
                      <option value="2.4">Double</option>
                      <option value="#other">Exactly</option>
                    </select>
                  </td>
                  <td>
                    <input
                      id="line-height.other"
                      pattern="(\d+(\.\d+)?|\.\d+)(pt|mm|in|pc|cm|em)?"
                      size="5"
                      style={{ display: 'none' }}
                      className="length-or-number-value"
                    />
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr className="style-selector-block">
            <td>
              <label className="inline">Padding</label>
              <table>
                <tr className="style-selector-block">
                  <th>
                    <label htmlFor="padding-left" className="inline">
                      Left
                    </label>
                    :
                  </th>
                  <td>
                    <input
                      id="padding-left"
                      pattern="(\d+(\.\d+)?|\.\d+)(pt|mm|in|pc|cm|em)"
                      size="5"
                      className="length-value"
                    />
                  </td>
                </tr>
                <tr className="style-selector-block">
                  <th>
                    <label htmlFor="padding-right" className="inline">
                      Right
                    </label>
                    :
                  </th>
                  <td>
                    <input
                      id="padding-right"
                      pattern="(\d+(\.\d+)?|\.\d+)(pt|mm|in|pc|cm|em)"
                      size="5"
                      className="length-value"
                    />
                  </td>
                </tr>
                <tr className="style-selector-block">
                  <th>
                    <label htmlFor="padding-top" className="inline">
                      Top
                    </label>
                    :
                  </th>
                  <td>
                    <input
                      id="padding-top"
                      pattern="(\d+(\.\d+)?|\.\d+)(pt|mm|in|pc|cm|em)"
                      size="5"
                      className="length-value"
                    />
                  </td>
                </tr>
                <tr className="style-selector-block">
                  <th>
                    <label htmlFor="padding-bottom" className="inline">
                      Bottom
                    </label>
                    :
                  </th>
                  <td>
                    <input
                      id="padding-bottom"
                      pattern="(\d+(\.\d+)?|\.\d+)(pt|mm|in|pc|cm|em)"
                      size="5"
                      className="length-value"
                    />
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr className="style-selector-block">
            <td colspan="2">
              <label htmlFor="border" className="inline">
                Border
              </label>
              :
              <select id="border">
                <option value="none" selected>
                  no border
                </option>
                <option value="all">all</option>
              </select>
            </td>
          </tr>
        </tbody>
        <tbody data-style="topic topic_topic topic_topic_topic topic_topic_topic_topic">
          <tr>
            <th colspan="2">
              <h4>Numbering</h4>
            </th>
          </tr>
          <tr>
            <td colspan="2">
              <label htmlFor="title-numbering" className="inline">
                Title numbering
              </label>
              :
              <input
                id="title-numbering"
                type="checkbox"
                value="true"
                title="Title numbering"
              />
            </td>
          </tr>
        </tbody>
        <tbody data-style="dl">
          <tr>
            <th colspan="2">
              <h4>List styles</h4>
            </th>
          </tr>
          <tr>
            <td colspan="2">
              <label htmlFor="dl-type" className="inline">
                List type
              </label>
              :
              <select id="dl-type" title="Definition list style">
                <option value="table" selected>
                  table
                </option>
                <option value="html">HTML style</option>
                <option value="list">bullet list</option>
              </select>
            </td>
          </tr>
        </tbody>

        <tbody data-style="ol">
          <tr>
            <th colspan="2">
              <h4>Ordered list styles</h4>
            </th>
          </tr>
          <tr>
            <td colspan="2">
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
                      <select id="ol-1">
                        <option value="1">1, 2, 3, …</option>
                        <option value="A">A, B, C, …</option>
                        <option value="a">a, b, c, …</option>
                        <option value="I">I, II, III, …</option>
                        <option value="i">i, ii, iii, …</option>
                      </select>
                    </td>
                    <td>
                      <input id="ol-before-1" size="1" />
                    </td>
                    <td>
                      <input id="ol-after-1" size="2" value=". " />
                    </td>
                  </tr>
                  <tr>
                    <th>2</th>
                    <td>
                      <select id="ol-2">
                        <option value="1">1, 2, 3, …</option>
                        <option value="A">A, B, C, …</option>
                        <option value="a">a, b, c, …</option>
                        <option value="I">I, II, III, …</option>
                        <option value="i">i, ii, iii, …</option>
                      </select>
                    </td>
                    <td>
                      <input id="ol-before-2" size="1" />
                    </td>
                    <td>
                      <input id="ol-after-2" size="2" value=". " />
                    </td>
                  </tr>
                  <tr>
                    <th>3</th>
                    <td>
                      <select id="ol-3">
                        <option value="1">1, 2, 3, …</option>
                        <option value="A">A, B, C, …</option>
                        <option value="a">a, b, c, …</option>
                        <option value="I">I, II, III, …</option>
                        <option value="i">i, ii, iii, …</option>
                      </select>
                    </td>
                    <td>
                      <input id="ol-before-3" size="1" />
                    </td>
                    <td>
                      <input id="ol-after-3" size="2" value=". " />
                    </td>
                  </tr>
                  <tr>
                    <th>4</th>
                    <td>
                      <select id="ol-4">
                        <option value="1">1, 2, 3, …</option>
                        <option value="A">A, B, C, …</option>
                        <option value="a">a, b, c, …</option>
                        <option value="I">I, II, III, …</option>
                        <option value="i">i, ii, iii, …</option>
                      </select>
                    </td>
                    <td>
                      <input id="ol-before-4" size="1" />
                    </td>
                    <td>
                      <input id="ol-after-4" size="2" value=". " />
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>

        <tbody data-style="ul">
          <tr>
            <th colspan="2">
              <h4>Unordered list styles</h4>
            </th>
          </tr>
          <tr>
            <td colspan="2">
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
                      <select id="ul-1">
                        <option value="&#x2022;">&#x2022;</option>
                        <option value="&#x25C6;">&#x25C6;</option>
                        <option value="&#x2014;">&#x2014;</option>
                        <option value="&#x2013;">&#x2013;</option>
                        <option value="&#x2012;">&#x2012;</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <th>2</th>
                    <td>
                      <select id="ul-2">
                        <option value="&#x2022;">&#x2022;</option>
                        <option value="&#x25C6;">&#x25C6;</option>
                        <option value="&#x2014;">&#x2014;</option>
                        <option value="&#x2013;">&#x2013;</option>
                        <option value="&#x2012;">&#x2012;</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <th>3</th>
                    <td>
                      <select id="ul-3">
                        <option value="&#x2022;">&#x2022;</option>
                        <option value="&#x25C6;">&#x25C6;</option>
                        <option value="&#x2014;">&#x2014;</option>
                        <option value="&#x2013;">&#x2013;</option>
                        <option value="&#x2012;">&#x2012;</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <th>4</th>
                    <td>
                      <select id="ul-4">
                        <option value="&#x2022;">&#x2022;</option>
                        <option value="&#x25C6;">&#x25C6;</option>
                        <option value="&#x2014;">&#x2014;</option>
                        <option value="&#x2013;">&#x2013;</option>
                        <option value="&#x2012;">&#x2012;</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>

        <tbody data-style="table fig">
          <tr>
            <th colspan="2">
              <h4>Captions</h4>
            </th>
          </tr>
          <tr>
            <td colspan="2">
              <label htmlFor="caption-number" className="inline">
                Numbering
              </label>
              :
              <select id="caption-number" title="Caption numbering">
                <option value="document" selected>
                  Document wide
                </option>
                <option value="chapter">Chapter wide</option>
                <option value="none">No numbering</option>
              </select>
              <label htmlFor="caption-position" className="inline">
                Position
              </label>
              :
              <select id="caption-position" title="Caption position">
                <option value="before">Above</option>
                <option value="after">Below</option>
              </select>
            </td>
          </tr>
        </tbody>

        <tbody data-style="toc_1">
          <tr>
            <th colspan="2">
              <h4>Chapter prefix</h4>
            </th>
          </tr>
          <tr>
            <td colspan="2">
              <label htmlFor="prefix" className="inline">
                Top-level prefix
              </label>
              :
              <input
                id="prefix"
                title="Chapter prefix"
                type="checkbox"
                value="true"
              />
            </td>
          </tr>
        </tbody>

        <tbody data-style="codeblock">
          <tr>
            <th colspan="2">
              <h4>Numbering</h4>
            </th>
          </tr>
          <tr>
            <td colspan="2">
              <label htmlFor="line-numbering" className="inline">
                Line numbering
              </label>
              :
              <input
                id="line-numbering"
                title="Line numbering"
                type="checkbox"
                value="true"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
