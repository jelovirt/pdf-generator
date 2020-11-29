import React from 'react';
import { Values } from '../app/Model';
import { Property, StyleName } from '../lib/styles';
import { toPt } from '../app/pdf-utils';
import hand from '../../public/images/hand.gif';
import figure from '../../public/images/figure.png';

const f = 0.9;

function isCustomProperty(field: Property): boolean {
  return [
    'prefix',
    'line-numbering',
    ' line-height-list',
    'dl-type',
    'ol-1',
    'ol-2',
    'ol-3',
    'ol-4',
    'ol-before-1',
    'ol-before-2',
    'ol-before-3',
    'ol-before-4',
    'ol-after-1',
    'ol-after-2',
    'ol-after-3',
    'ol-after-4',
    'ol-sublevel',
    'ul-1',
    'ul-2',
    'ul-3',
    'ul-4',
    'caption-number',
    'caption-position',
    'symbol-scope',
    'link-page-number',
    'link-url',
    'title-numbering',
    'icon',
    'line-height-list',
    'color-list',
    'background-color-list',
  ].includes(field);
}

function toCamelCase(input: string) {
  const tokens = input.split('-');
  return (
    tokens[0] +
    tokens
      .slice(1)
      .map((token) => token.substring(0, 1).toUpperCase() + token.substring(1))
      .join('')
  );
}

function previewSpaceHandler(type: StyleName, style: Record<Property, string>) {
  const properties = (Object.entries(style) as [Property, string][])
    .filter(([field, value]) => !isCustomProperty(field))
    .map(([field, value]) => {
      let v = value;
      let isLength = false;
      let property = field as string;
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
          // isLength = false;
          break;
        // default:
        //   // const all = $element.find(
        //   //     "[data-field='" + field + "'][data-style='" + type + "']"
        //   // );
        //   // if (all.length) {
        //   //   if (all.filter('[data-value]').length) {
        //   //     all.hide();
        //   //     all.filter("[data-value='" + v + "']").show();
        //   //   } else {
        //   //     all.text(v);
        //   //   }
        //   // } else {
        //   property = field;
        //   isLength = false;
        //   // }
        //   break;
      }
      // if (property !== undefined && v !== undefined && isLength) {
      //   // v = String(toPt(v)! * f) + 'px';
      //   v = `calc(${v} * ${f})`;
      // }
      return [toCamelCase(property), isLength ? `calc(${v} * ${f})` : v];
      // FIXME
      // wrapper styling
      // if (field === 'start-indent' && type === 'body') {
      //   $element.find('.wrapper > *').css('left', `-${v}`);
      // }
    });
  // .filter(([field, value]) => field !== undefined)
  // .map(([field, value]) => [toCamelCase(field!), value]);
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
            <tbody>
              <tr>
                {styles['note']['icon'] && (
                  <td>
                    <img src={hand} style={{ height: '16px' }} />
                  </td>
                )}
                <td>
                  <strong
                  // style={getStyle('note-label')}
                  >
                    Note:
                  </strong>{' '}
                  The quick brown fox jumps over the lazy dog.
                </td>
              </tr>
            </tbody>
          </table>
          <p style={getStyle('body')}>
            The quick brown fox jumps over the lazy dog. The quick brown fox
            jumps over the lazy dog. The quick brown fox jumps over the lazy
            dog. The quick brown fox jumps over the lazy dog. The quick brown
            fox jumps over the lazy dog.
          </p>
          <ol style={getStyle('ol')} className="example-page-content-ol">
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
          <ul style={getStyle('ul')} className="example-page-content-ul">
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
              <tbody>
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
              </tbody>
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
            The{' '}
            <span style={getStyle('tm')}>
              quick brown fox
              {(styles['tm']['symbol-scope'] === 'always' ||
                styles['tm']['symbol-scope'] === 'chapter') && <span>™</span>}
            </span>{' '}
            jumps over the{' '}
            <span style={getStyle('tm')}>
              lazy dog
              {(styles['tm']['symbol-scope'] === 'always' ||
                styles['tm']['symbol-scope'] === 'chapter') && <span>®</span>}
            </span>
            . The{' '}
            <span style={getStyle('tm')}>
              quick brown fox
              {styles['tm']['symbol-scope'] === 'always' && <span>™</span>}
            </span>{' '}
            jumps over the{' '}
            <span style={getStyle('tm')}>
              lazy dog
              {styles['tm']['symbol-scope'] === 'always' && <span>®</span>}
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
            {styles['codeblock']['line-numbering'] && <span>1 </span>}
            (defun factorial (n){'\n'}
            {styles['codeblock']['line-numbering'] && <span>2 </span>}
            (if (&lt;= n 1){'\n'}
            {styles['codeblock']['line-numbering'] && <span>3 </span>}
            {'  '}1{'\n'}
            {styles['codeblock']['line-numbering'] && <span>4 </span>}
            {'  '}
            (* n (factorial (- n 1))))){'\n'}
          </pre>
          {styles['table']['caption-position'] === 'before' && (
            <p style={getStyle('body')}>
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
            <tbody>
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
            </tbody>
          </table>
          {styles['table']['caption-position'] === 'after' && (
            <p style={getStyle('body')}>
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
            <p style={getStyle('body')}>
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
            <img src={figure} style={{ height: '30px' }} />
          </p>
          {styles['fig']['caption-position'] === 'after' && (
            <p style={getStyle('body')}>
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
