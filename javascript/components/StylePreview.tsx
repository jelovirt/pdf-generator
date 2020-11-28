import React from 'react';
import { Values } from '../app/Model';
import { Property, StyleName } from '../lib/styles';
import { toPt } from '../app/pdf-utils';

const f = 0.9;

function previewSpaceHandler(type: StyleName, style: Record<Property, string>) {
  const properties = (Object.entries(style) as [Property, string][]).map(
    ([field, value]) => {
      let v = value;
      let isLength = false;
      let property;
      switch (field) {
        case 'space-before':
          property = 'margin-top';
          isLength = true;
          break;
        case 'space-after':
          property = 'margin-bottom';
          isLength = true;
          break;
        case 'start-indent':
          property = 'margin-left';
          isLength = true;
          break;
        case 'end-indent':
          property = 'margin-right';
          isLength = true;
          break;
        case 'font-size':
          property = field;
          isLength = true;
          break;
        case 'line-height':
          property = field;
          isLength = isNaN(Number(v));
          break;
        case 'text-align':
          property = field;
          switch (v) {
            case 'start':
              v = 'left';
              break;
            case 'end':
              v = 'right';
              break;
          }
          break;
        case 'border-before-style':
        case 'border-before-width':
        case 'border-before-color':
        case 'border-end-style':
        case 'border-end-width':
        case 'border-end-color':
        case 'border-after-style':
        case 'border-after-width':
        case 'border-after-color':
        case 'border-start-style':
        case 'border-start-width':
        case 'border-start-color':
          const tokens = field.split('-');
          switch (tokens[1]) {
            case 'before':
              property = 'border-top-' + tokens[2];
              break;
            case 'end':
              property = 'border-right-' + tokens[2];
              break;
            case 'after':
              property = 'border-bottom-' + tokens[2];
              break;
            case 'start':
              property = 'border-left-' + tokens[2];
              break;
          }
          isLength = false;
          break;
        default:
          // const all = $element.find(
          //     "[data-field='" + field + "'][data-style='" + type + "']"
          // );
          // if (all.length) {
          //   if (all.filter('[data-value]').length) {
          //     all.hide();
          //     all.filter("[data-value='" + v + "']").show();
          //   } else {
          //     all.text(v);
          //   }
          // } else {
          property = field;
          isLength = false;
          // }
          break;
      }
      if (property !== undefined) {
        if (isLength) {
          if (v !== undefined) {
            v = String(toPt(v)! * f) + 'px';
          }
        }
      }
      return [property, v];
      // FIXME
      // wrapper styling
      // if (field === 'start-indent' && type === 'body') {
      //   $element.find('.wrapper > *').css('left', `-${v}`);
      // }
    }
  );
  return Object.fromEntries(properties);
}

export default function StylePreview(props: { values: Values }) {
  const styles = props.values.style;
  const getStyle = (styleName: StyleName) =>
    previewSpaceHandler(styleName, styles[styleName]);
  return (
    <div className="example-block col-md-7" id="example-style">
      <div className="example-block-page" id="start-indent.examplex">
        <div className="example-page-content" id="text-align.examplex">
          <div style={getStyle('topic')}>
            {styles['topic']['title-numbering'] && <span>1 </span>}
            Heading 1
          </div>
          <div style={getStyle('topic_topic')}>
            {styles['topic_topic']['title-numbering'] && <span>1.1 </span>}
            Heading 2
          </div>
          <p style={getStyle('body')}>
            The quick brown fox jumps over the lazy dog. The quick brown fox
            jumps over the lazy dog. The quick brown fox jumps over the lazy
            dog. The quick brown fox jumps over the lazy dog.
          </p>
          <table style={getStyle('note')}>
            <tr>
              <td data-style="note" data-field="icon" data-value="icon">
                <img
                  src="../../public/images/hand.gif"
                  style={{ height: '16px' }}
                />
              </td>
              <td>
                <strong
                // style={getStyle('note-label')}
                >
                  Note:
                </strong>{' '}
                The quick brown fox jumps over the lazy dog.
              </td>
            </tr>
          </table>
          <p style={getStyle('body')}>
            The quick brown fox jumps over the lazy dog. The quick brown fox
            jumps over the lazy dog. The quick brown fox jumps over the lazy
            dog. The quick brown fox jumps over the lazy dog. The quick brown
            fox jumps over the lazy dog.
          </p>
          <ol style={getStyle('ol')}>
            <li>
              <span>{styles['ol']['ol-before-1']}</span>
              <span>{styles['ol']['ol-1']}</span>
              <span>{styles['ol']['ol-after-1']}</span>
              The quick brown fox jumps over the lazy dog.
              <ol>
                <li>
                  <span>{styles['ol']['ol-before-2']}</span>
                  {styles['ol']['ol-sublevel'] && (
                    <>
                      <span>{styles['ol']['ol-1']}</span>.
                    </>
                  )}
                  <span>{styles['ol']['ol-2']}</span>
                  <span>{styles['ol']['ol-after-2']}</span>
                  The quick brown fox jumps over the lazy dog.
                  <ol>
                    <li>
                      <span>{styles['ol']['ol-before-3']}</span>
                      {styles['ol']['ol-sublevel'] && (
                        <>
                          <span>{styles['ol']['ol-1']}</span>.
                          <span>{styles['ol']['ol-2']}</span>.
                        </>
                      )}
                      <span>{styles['ol']['ol-3']}</span>
                      <span>{styles['ol']['ol-after-3']}</span>
                      The quick brown fox jumps over the lazy dog.
                      <ol>
                        <li>
                          <span>{styles['ol']['ol-before-4']}</span>
                          {styles['ol']['ol-sublevel'] && (
                            <>
                              <span>{styles['ol']['ol-1']}</span>.
                              <span>{styles['ol']['ol-2']}</span>.
                              <span>{styles['ol']['ol-3']}</span>.
                            </>
                          )}
                          <span>{styles['ol']['ol-4']}</span>
                          <span>{styles['ol']['ol-after-4']}</span>
                          The quick brown fox jumps over the lazy dog.
                        </li>
                      </ol>
                    </li>
                  </ol>
                </li>
              </ol>
            </li>
          </ol>
          <ul style={getStyle('ul')}>
            <li>
              <span>{styles['ul']['ul-1']}</span>
              The quick brown fox jumps over the lazy dog.
              <ul>
                <li>
                  <span>{styles['ul']['ul-2']}</span>
                  The quick brown fox jumps over the lazy dog.
                  <ul>
                    <li>
                      <span>{styles['ul']['ul-3']}</span>
                      The quick brown fox jumps over the lazy dog.
                      <ul>
                        <li>
                          <span>{styles['ul']['ul-4']}</span>
                          The quick brown fox jumps over the lazy dog.
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
          {styles['dl']['dl-type'] === 'html' && (
            <dl style={getStyle('dl')}>
              <dt>
                <strong>Pangram</strong>
              </dt>
              <dd>The quick brown fox jumps over the lazy dog.</dd>
              <dt>
                <strong>XXX</strong>
              </dt>
              <dd>The quick brown fox jumps over the lazy dog.</dd>
            </dl>
          )}
          {styles['dl']['dl-type'] === 'table' && (
            <table style={getStyle('dl')}>
              <colgroup>
                <col />
                <col style={{ width: '100%' }} />
              </colgroup>
              <tr>
                <th>
                  <strong>Pangram</strong>
                </th>
                <td>The quick brown fox jumps over the lazy dog.</td>
              </tr>
              <tr>
                <th>
                  <strong>XXX</strong>
                </th>
                <td>The quick brown fox jumps over the lazy dog.</td>
              </tr>
            </table>
          )}
          {styles['dl']['dl-type'] === 'list' && (
            <ul style={getStyle('dl')}>
              <li>
                <strong>Pangram</strong>
                <br />
                The quick brown fox jumps over the lazy dog.
              </li>
              <li>
                <strong>XXX</strong>
                <br />
                The quick brown fox jumps over the lazy dog.
              </li>
            </ul>
          )}
          <p style={getStyle('body')}>
            The quick brown <span style={getStyle('link')}>fox jumps</span>{' '}
            {styles['link']['link-page-number'] && (
              <>
                <span>on page 42</span>{' '}
              </>
            )}
            over the lazy dog. The quick
            <span style={getStyle('link')}>brown fox</span>
            {styles['link']['link-url'] && <span>at www.example.com</span>}
            jumps over the lazy dog.
          </p>
          <p style={getStyle('body')}>
            The
            <span style={getStyle('tm')}>
              quick brown fox{' '}
              <span
                data-style="tm"
                data-field="symbol-scope"
                data-value="always"
              >
                ™
              </span>
              <span
                data-style="tm"
                data-field="symbol-scope"
                data-value="chapter"
              >
                ™
              </span>
            </span>
            jumps over the
            <span style={getStyle('tm')}>
              lazy dog
              <span
                data-style="tm"
                data-field="symbol-scope"
                data-value="always"
              >
                ®
              </span>
              <span
                data-style="tm"
                data-field="symbol-scope"
                data-value="chapter"
              >
                ®
              </span>
            </span>
            . The
            <span style={getStyle('tm')}>
              quick brown fox
              <span
                data-style="tm"
                data-field="symbol-scope"
                data-value="always"
              >
                ™
              </span>
            </span>
            jumps over the
            <span style={getStyle('tm')}>
              lazy dog
              <span
                data-style="tm"
                data-field="symbol-scope"
                data-value="always"
              >
                ®
              </span>
            </span>
            .
          </p>
          <p style={getStyle('section')}>Section title</p>
          <p style={getStyle('body')}>
            The quick brown fox jumps over the lazy dog. The quick brown fox
            jumps over the lazy dog. The quick brown fox jumps over the lazy
            dog. The quick brown fox jumps over the lazy dog. The quick brown
            fox jumps over the lazy dog.
          </p>
          <div
          // style={getStyle('example wrapper')}
          >
            <p
              style={getStyle('example_title')}
              // style={{ marginLeft: '0pt', marginRight: '0pt' }}
            >
              Example title
            </p>
            <p style={getStyle('body')}>Example content</p>
          </div>
          <div style={getStyle('topic_topic_topic')}>
            {styles['topic_topic_topic']['title-numbering'] && (
              <span>1.1.1 </span>
            )}
            Heading 3
          </div>
          <p style={getStyle('body')}>
            The quick brown fox jumps over the lazy dog. The quick brown fox
            jumps over the lazy dog. The quick brown fox jumps over the lazy
            dog. The quick brown fox jumps over the lazy dog.
          </p>
          <div style={getStyle('topic_topic_topic_topic')}>
            {styles['topic_topic_topic_topic']['title-numbering'] && (
              <span>1.1.1.1 </span>
            )}
            Heading 4
          </div>
          <p style={getStyle('body')}>
            The quick brown fox jumps over the lazy dog. The quick brown fox
            jumps over the lazy dog. The quick brown fox jumps over the lazy
            dog. The quick brown fox jumps over the lazy dog.
          </p>
          <pre style={getStyle('pre')}>
            The quick brown fox jumps over the lazy dog.
          </pre>
          <pre style={getStyle('codeblock')}>
            <span
              data-style="codeblock"
              data-field="line-numbering"
              data-value="true"
            >
              1{' '}
            </span>
            (defun factorial (n)
            <span
              data-style="codeblock"
              data-field="line-numbering"
              data-value="true"
            >
              2{' '}
            </span>
            (if (&lt;= n 1)
            <span
              data-style="codeblock"
              data-field="line-numbering"
              data-value="true"
            >
              3{' '}
            </span>{' '}
            1
            <span
              data-style="codeblock"
              data-field="line-numbering"
              data-value="true"
            >
              4{' '}
            </span>{' '}
            (* n (factorial (- n 1)))))
          </pre>
          {styles['table']['caption-position'] === 'before' && (
            <p
              // style={getStyle('body example-page-content-table-title')}
              style={getStyle('body')}
            >
              <strong>
                Table{' '}
                {styles['table']['caption-number'] === 'document' && (
                  <span>4</span>
                )}
                {styles['table']['caption-number'] === 'chapter' && (
                  <span>1&#x2014;4</span>
                )}
                : Table caption
              </strong>
            </p>
          )}
          <table style={getStyle('table')}>
            <tr
            // style={getStyle('tr')}
            >
              <td
              // style={getStyle('td')}
              >
                Dog
              </td>
              <td
              // style={getStyle('td')}
              >
                lazy
              </td>
            </tr>
            <tr
            // style={getStyle('tr')}
            >
              <td
              // style={getStyle('td')}
              >
                Fox
              </td>
              <td
              // style={getStyle('td')}
              >
                quick, brown
              </td>
            </tr>
          </table>
          {styles['table']['caption-position'] === 'after' && (
            <p
              // style={getStyle('body example-page-content-table-title')}
              style={getStyle('body')}
            >
              <strong>
                Table{' '}
                {styles['table']['caption-number'] === 'document' && (
                  <span>4</span>
                )}
                {styles['table']['caption-number'] === 'chapter' && (
                  <span>1&#x2014;4</span>
                )}
                : Table caption
              </strong>
            </p>
          )}
          {styles['fig']['caption-position'] === 'before' && (
            <p
              // style={getStyle('body example-page-content-fig-title')}
              style={getStyle('body')}
            >
              <strong>
                Figure{' '}
                {styles['fig']['caption-number'] === 'document' && (
                  <span>6</span>
                )}
                {styles['fig']['caption-number'] === 'chapter' && (
                  <span>1&#x2014;6</span>
                )}
                : Figure caption
              </strong>
            </p>
          )}
          <p style={getStyle('fig')}>
            <img
              src="../../public/images/figure.png"
              style={{ height: '30px' }}
            />
          </p>
          {styles['fig']['caption-position'] === 'after' && (
            <p
              // style={getStyle('body example-page-content-fig-title')}
              style={getStyle('body')}
            >
              <strong>
                Figure{' '}
                {styles['fig']['caption-number'] === 'document' && (
                  <span>6</span>
                )}
                {styles['fig']['caption-number'] === 'chapter' && (
                  <span>1&#x2014;6</span>
                )}
                : Figure caption
              </strong>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
