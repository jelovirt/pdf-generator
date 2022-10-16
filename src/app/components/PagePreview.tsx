import React, { CSSProperties } from 'react';
import { Length } from '../../generator/Model';

export default function PagePreview(props: {
  page_mirror_margins: boolean;
  page_size: string;
  orientation: 'portrait' | 'landscape';
  top: Length;
  outside: Length;
  bottom: Length;
  inside: Length;
}) {
  return (
    <div className="example-block col-md-7" id="margin.example">
      {props.page_mirror_margins && <PreviewPage {...props} even={true} />}
      <PreviewPage {...props} even={false} />
    </div>
  );
}

export const PreviewPage = (props: {
  page_size: string;
  orientation: 'portrait' | 'landscape';
  top: Length;
  outside: Length;
  bottom: Length;
  inside: Length;
  even: boolean;
  cut_off?: boolean;
  blank?: boolean;
}) => {
  const factor = 0.1;
  const dimensions = props.page_size.split(' ');
  if (props.orientation === 'landscape') {
    dimensions.reverse();
  }
  const pageStyle = (flip: boolean) => ({
    height: `calc(${dimensions[1]} * ${factor})`,
    width: `calc(${dimensions[0]} * ${factor})`,
    paddingTop: `calc(${props.top} * ${factor})`,
    paddingRight: `calc(${flip ? props.inside : props.outside} * ${factor})`,
    paddingBottom: `calc(${props.bottom} * ${factor})`,
    paddingLeft: `calc(${flip ? props.outside : props.inside} * ${factor})`,
  });
  const contentStyle: CSSProperties = {
    height: '100%',
    width: '100%',
    textAlign: 'center',
  };
  return (
    <div
      className={`example-page ${props.even ? 'even' : 'odd'}`}
      title="Odd page"
      style={pageStyle(props.even)}
    >
      <table
        className={`${
          props.blank ? 'example-page-body-empty' : 'example-page-body'
        } ${props.cut_off ? 'cut-off' : ''}`}
        style={contentStyle}
      >
        <tbody>
          <tr>
            <td>
              <div></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
