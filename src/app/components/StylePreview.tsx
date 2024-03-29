import React, { CSSProperties, ReactNode } from 'react';
import { Values } from './common';
import { Length } from '../../generator/Model';
import { Property, StyleName } from '../../generator/styles';
// @ts-ignore
import hand from '../../../public/images/hand.gif';
// @ts-ignore
import figure from '../../../public/images/figure.png';

const factor = 0.9;

function isCustomProperty(field: Property): boolean {
  return [
    'prefix',
    'line-numbering',
    'line-height-list',
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

function previewSpaceHandler(
  type: StyleName,
  style: Record<Property, string>,
  parentStyles: StyleName[],
  styles: Record<StyleName, Record<Property, string>>
) {
  const properties = (Object.entries(style) as [Property, string][])
    .filter(([field, value]) => !isCustomProperty(field))
    .flatMap(([field, value]) => {
      const len = (v: Length) => `calc(${v} * ${factor})`;
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
          property = 'left';
          isLength = true;
          v =
            '(' +
            [v]
              .concat(
                parentStyles.map(
                  (parentStyle) => styles[parentStyle]['start-indent']
                )
              )
              .concat(styles[type]['padding-left'])
              .join(' - ') +
            ')';
          const res: [string, string][] = [
            [toCamelCase(property), isLength ? `calc(${v} * ${factor})` : v],
          ];
          if (field === 'start-indent') {
            res.push(['position', 'relative']);
          }
          return res;
        // // property = 'margin-left';
        // property = 'left';
        // isLength = true;
        // break;
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
        // case 'border':
        //   switch (v) {
        //     case 'none':
        //       return [['border', 'none']];
        //     case 'all':
        //       return [['border', `solid black calc(1pt * ${factor})`]];
        //     case 'top':
        //       return [['borderTop', `solid black calc(1pt * ${factor})`]];
        //     case 'bottom':
        //       return [['borderBottom', `solid black calc(1pt * ${factor})`]];
        //     case 'topbot':
        //       return [
        //         ['borderTop', `solid black calc(1pt * ${factor})`],
        //         ['borderBottom', `solid black calc(1pt * ${factor})`],
        //       ];
        //     case 'sides':
        //       return [
        //         ['borderRight', `solid black calc(1pt * ${factor})`],
        //         ['borderLeft', `solid black calc(1pt * ${factor})`],
        //       ];
        //   }
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
      const res: [string, string][] = [
        [toCamelCase(property), isLength ? `calc(${v} * ${factor})` : v],
      ];
      // if (field === 'start-indent') {
      //   res.push(['position', 'relative']);
      // }
      return res;
      // FIXME
      // wrapper styling
      // if (field === 'start-indent' && type === StyleName.BODY) {
      //   $element.find('.wrapper > *').css('left', `-${v}`);
      // }
    });
  // .filter(([field, value]) => field !== undefined)
  // .map(([field, value]) => [toCamelCase(field!), value]);
  return Object.fromEntries(properties);
}

export default function StylePreview(props: { values: Values }) {
  const styles = props.values.style;
  const getStyle = (styleName: StyleName, ...parentStyles: StyleName[]) =>
    previewSpaceHandler(styleName, styles[styleName], parentStyles, styles);
  const pageStyle = () => {
    const dimensions = props.values.page_size.split(' ');
    if (props.values.orientation === 'landscape') {
      dimensions.reverse();
    }
    return {
      height: `calc(${dimensions[1]} * ${factor})`,
      width: `calc(${dimensions[0]} * ${factor})`,
      // paddingTop: `calc(${props.values.page.top} * ${factor})`,
      // paddingRight: `calc(${
      //   flip ? props.values.page.inside : props.values.page.outside
      // } * ${factor})`,
      // paddingBottom: `calc(${props.values.page.bottom} * ${factor})`,
      // paddingLeft: `calc(${
      //   flip ? props.values.page.outside : props.values.page.inside
      // } * ${factor})`,
    };
  };
  const contentStyle = () => {
    // const dimensions = props.values.page_size.split(' ');
    // if (props.values.orientation === 'landscape') {
    //   dimensions.reverse();
    // }
    return {
      paddingTop: `calc(${props.values.page.top} * ${factor})`,
      paddingRight: `calc(${props.values.page.outside} * ${factor})`,
      paddingBottom: `calc(${props.values.page.bottom} * ${factor})`,
      // paddingLeft: `calc(${
      //     flip ? props.values.page.outside : props.values.page.inside
      // } * ${factor * 0.5})`,
      marginLeft: `calc(${props.values.page.inside} * ${factor * 0.5})`,
    };
  };
  const wrapperStyle = (...styleName: StyleName[]): CSSProperties => ({
    borderLeftWidth: '2px',
    borderLeftStyle: 'solid',
    borderLeftColor: styleName.includes(props.values.style_selector)
      ? 'red'
      : 'transparent',
    paddingLeft: `calc(${props.values.page.inside} * ${factor * 0.5} - 2px)`,
  });

  const olLabelStyle: CSSProperties = {
    display: 'inline-block',
    marginRight: '0.5em',
    float: 'left',
  };

  const ulLabelStyle: CSSProperties = {
    width: '1em',
    display: 'inline-block',
    float: 'left',
  };

  const borderStyle: CSSProperties = { border: 'solid 1px black' };

  const Block = (props: { type: StyleName; children?: ReactNode }) => {
    return (
      <div style={wrapperStyle(props.type)}>
        <div style={getStyle(props.type)}>{props.children}</div>
      </div>
    );
  };

  const Inline = (props: { type: StyleName; children?: ReactNode }) => {
    return <span style={getStyle(props.type)}>{props.children}</span>;
  };

  return (
    <div className="example-block col-md-7" id="example-style">
      <div className="example-block-page" style={pageStyle()}>
        <div className="example-page-content" style={contentStyle()}>
          <Block type={StyleName.TOPIC}>
            {styles['topic']['title-numbering'] && <span>1 </span>}
            Heading 1
          </Block>
          <Block type={StyleName.TOPIC_TOPIC}>
            {styles['topic_topic']['title-numbering'] && <span>1.1 </span>}
            Heading 2
          </Block>
          <Block type={StyleName.BODY}>
            The quick brown fox jumps over the lazy dog. The quick brown fox
            jumps over the lazy dog. The quick brown fox jumps over the lazy
            dog. The quick brown fox jumps over the lazy dog.
          </Block>
          <div style={wrapperStyle(StyleName.NOTE)}>
            <table style={getStyle(StyleName.NOTE)}>
              <tbody>
                <tr>
                  {styles['note']['icon'] && (
                    <td>
                      <img src={hand} style={{ height: '16px' }} />
                    </td>
                  )}
                  <td>
                    <strong
                    // style={getStyle(StyleName.NOTE-LABEL)}
                    >
                      Note:
                    </strong>{' '}
                    The quick brown fox jumps over the lazy dog.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Block type={StyleName.BODY}>
            The quick brown fox jumps over the lazy dog. The quick brown fox
            jumps over the lazy dog. The quick brown fox jumps over the lazy
            dog. The quick brown fox jumps over the lazy dog. The quick brown
            fox jumps over the lazy dog.
          </Block>
          <div style={wrapperStyle(StyleName.OL)}>
            <ol
              style={getStyle(StyleName.OL)}
              className="example-page-content-ol"
            >
              <li>
                <span style={olLabelStyle}>
                  {styles['ol']['ol-before-1']}
                  {styles['ol']['ol-1']}
                  {styles['ol']['ol-after-1']}
                </span>
                The quick brown fox jumps over the lazy dog.
                <ol>
                  <li>
                    <span style={olLabelStyle}>
                      {styles['ol']['ol-before-2']}
                      {styles['ol']['ol-sublevel'] && (
                        <>{styles['ol']['ol-1']}.</>
                      )}
                      {styles['ol']['ol-2']}
                      {styles['ol']['ol-after-2']}
                    </span>
                    The quick brown fox jumps over the lazy dog.
                    <ol>
                      <li>
                        <span style={olLabelStyle}>
                          {styles['ol']['ol-before-3']}
                          {styles['ol']['ol-sublevel'] && (
                            <>
                              {styles['ol']['ol-1']}.{styles['ol']['ol-2']}.
                            </>
                          )}
                          {styles['ol']['ol-3']}
                          {styles['ol']['ol-after-3']}
                        </span>
                        The quick brown fox jumps over the lazy dog.
                        <ol>
                          <li>
                            <span style={olLabelStyle}>
                              {styles['ol']['ol-before-4']}
                              {styles['ol']['ol-sublevel'] && (
                                <>
                                  {styles['ol']['ol-1']}.{styles['ol']['ol-2']}.
                                  {styles['ol']['ol-3']}.
                                </>
                              )}
                              {styles['ol']['ol-4']}
                              {styles['ol']['ol-after-4']}
                            </span>
                            The quick brown fox jumps over the lazy dog.
                          </li>
                        </ol>
                      </li>
                    </ol>
                  </li>
                </ol>
              </li>
            </ol>
          </div>
          <div style={wrapperStyle(StyleName.UL)}>
            <ul
              style={getStyle(StyleName.UL)}
              className="example-page-content-ul"
            >
              <li>
                <span style={ulLabelStyle}>{styles['ul']['ul-1']}</span>
                The quick brown fox jumps over the lazy dog.
                <ul>
                  <li>
                    <span style={ulLabelStyle}>{styles['ul']['ul-2']}</span>
                    The quick brown fox jumps over the lazy dog.
                    <ul>
                      <li>
                        <span style={ulLabelStyle}>{styles['ul']['ul-3']}</span>
                        The quick brown fox jumps over the lazy dog.
                        <ul>
                          <li>
                            <span style={ulLabelStyle}>
                              {styles['ul']['ul-4']}
                            </span>
                            The quick brown fox jumps over the lazy dog.
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <div style={wrapperStyle(StyleName.DL)}>
            {styles['dl']['dl-type'] === 'html' && (
              <dl style={getStyle(StyleName.DL)}>
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
              <table style={{ ...getStyle(StyleName.DL), width: '100%' }}>
                <colgroup>
                  <col style={{ width: '50%' }} />
                  <col style={{ width: '50%' }} />
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
              <ul
                style={getStyle(StyleName.DL)}
                className="example-page-content-ul"
              >
                <li>
                  <span style={ulLabelStyle}>{styles['ul']['ul-1']}</span>
                  <strong>Pangram</strong>
                  <div style={{ marginLeft: '1em' }}>
                    The quick brown fox jumps over the lazy dog.
                  </div>
                </li>
                <li>
                  <span style={ulLabelStyle}>{styles['ul']['ul-1']}</span>
                  <strong>XXX</strong>
                  <div style={{ marginLeft: '1em' }}>
                    The quick brown fox jumps over the lazy dog.
                  </div>
                </li>
              </ul>
            )}
          </div>
          <div style={wrapperStyle(StyleName.BODY, StyleName.LINK)}>
            <div style={getStyle(StyleName.BODY)}>
              The quick brown <Inline type={StyleName.LINK}>fox jumps</Inline>{' '}
              {styles['link']['link-page-number'] && (
                <>
                  <span>on page 42</span>{' '}
                </>
              )}
              over the lazy dog. The quick{' '}
              <Inline type={StyleName.LINK}>brown fox</Inline>{' '}
              {styles['link']['link-url'] && (
                <>
                  <span>at www.example.com</span>{' '}
                </>
              )}
              jumps over the lazy dog.
            </div>
          </div>
          <div style={wrapperStyle(StyleName.BODY, StyleName.TM)}>
            <div style={getStyle(StyleName.BODY)}>
              The{' '}
              <Inline type={StyleName.TM}>
                quick brown fox
                {(styles['tm']['symbol-scope'] === 'always' ||
                  styles['tm']['symbol-scope'] === 'chapter') && <span>™</span>}
              </Inline>{' '}
              jumps over the{' '}
              <Inline type={StyleName.TM}>
                lazy dog
                {(styles['tm']['symbol-scope'] === 'always' ||
                  styles['tm']['symbol-scope'] === 'chapter') && <span>®</span>}
              </Inline>
              . The{' '}
              <Inline type={StyleName.TM}>
                quick brown fox
                {styles['tm']['symbol-scope'] === 'always' && <span>™</span>}
              </Inline>{' '}
              jumps over the{' '}
              <Inline type={StyleName.TM}>
                lazy dog
                {styles['tm']['symbol-scope'] === 'always' && <span>®</span>}
              </Inline>
              .
            </div>
          </div>
          <Block type={StyleName.SECTION}>
            <div style={getStyle(StyleName.SECTION_TITLE, StyleName.SECTION)}>
              Section title
            </div>
            <div style={getStyle(StyleName.BODY, StyleName.SECTION)}>
              The quick brown fox jumps over the lazy dog. The quick brown fox
              jumps over the lazy dog. The quick brown fox jumps over the lazy
              dog. The quick brown fox jumps over the lazy dog. The quick brown
              fox jumps over the lazy dog.
            </div>
          </Block>
          <Block type={StyleName.EXAMPLE}>
            <div style={getStyle(StyleName.EXAMPLE_TITLE, StyleName.EXAMPLE)}>
              Example title
            </div>
            <div style={getStyle(StyleName.BODY, StyleName.EXAMPLE)}>
              Example content
            </div>
          </Block>
          <Block type={StyleName.TOPIC_TOPIC_TOPIC}>
            {styles['topic_topic_topic']['title-numbering'] && (
              <span>1.1.1 </span>
            )}
            Heading 3
          </Block>
          <Block type={StyleName.BODY}>
            The quick brown fox jumps over the lazy dog. The quick brown fox
            jumps over the lazy dog. The quick brown fox jumps over the lazy
            dog. The quick brown fox jumps over the lazy dog.
          </Block>
          <Block type={StyleName.TOPIC_TOPIC_TOPIC_TOPIC}>
            {styles['topic_topic_topic_topic']['title-numbering'] && (
              <span>1.1.1.1 </span>
            )}
            Heading 4
          </Block>
          <Block type={StyleName.BODY}>
            The quick brown fox jumps over the lazy dog. The quick brown fox
            jumps over the lazy dog. The quick brown fox jumps over the lazy
            dog. The quick brown fox jumps over the lazy dog.
          </Block>
          <div style={wrapperStyle(StyleName.PRE)}>
            <pre style={getStyle(StyleName.PRE)}>
              The quick brown fox jumps over the lazy dog.
            </pre>
          </div>
          <div style={wrapperStyle(StyleName.CODEBLOCK)}>
            <pre style={getStyle(StyleName.CODEBLOCK)}>
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
          </div>
          <div style={wrapperStyle(StyleName.TABLE)}>
            {styles['table']['caption-position'] === 'before' && (
              <div style={getStyle(StyleName.BODY)}>
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
              </div>
            )}
            <table style={getStyle(StyleName.TABLE)}>
              <tbody>
                <tr
                // style={getStyle(StyleName.TR)}
                >
                  <td
                    style={borderStyle}
                    // style={getStyle(StyleName.TD)}
                  >
                    Dog
                  </td>
                  <td
                    style={borderStyle}
                    // style={getStyle(StyleName.TD)}
                  >
                    lazy
                  </td>
                </tr>
                <tr
                // style={getStyle(StyleName.TR)}
                >
                  <td
                    style={borderStyle}
                    // style={getStyle(StyleName.TD)}
                  >
                    Fox
                  </td>
                  <td
                    style={borderStyle}
                    // style={getStyle(StyleName.TD)}
                  >
                    quick, brown
                  </td>
                </tr>
              </tbody>
            </table>
            {styles['table']['caption-position'] === 'after' && (
              <div style={getStyle(StyleName.BODY)}>
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
              </div>
            )}
          </div>
          <div style={wrapperStyle(StyleName.FIG)}>
            {styles['fig']['caption-position'] === 'before' && (
              <div style={getStyle(StyleName.BODY)}>
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
              </div>
            )}
            <div style={getStyle(StyleName.FIG)}>
              <img src={figure} style={{ height: '30px' }} />
            </div>
            {styles['fig']['caption-position'] === 'after' && (
              <div style={getStyle(StyleName.BODY)}>
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
