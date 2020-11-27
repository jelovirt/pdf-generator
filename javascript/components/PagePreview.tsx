import React from 'react';
import { useFormikContext } from 'formik';
import { Length } from '../app/Model';

export default function PagePreview(props: {
  mirror_page_margins: boolean;
  page_size: string;
  orientation: 'portrait' | 'landscape';
  top: Length;
  outside: Length;
  bottom: Length;
  inside: Length;
}) {
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
  const contentStyle = {
    height: '100%',
    width: '100%',
    textAlign: 'center',
  };
  return (
    <div className="example-block col-md-7" id="margin.example">
      {props.mirror_page_margins && (
        <div
          className="example-page even"
          title="Even page"
          style={pageStyle(true)}
        >
          <table className="example-page-body" style={contentStyle}>
            <tbody>
              <tr>
                <td>
                  <div>{props.page_size}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      <div
        className="example-page odd"
        title="Odd page"
        style={pageStyle(false)}
      >
        <table className="example-page-body" style={contentStyle}>
          <tbody>
            <tr>
              <td>
                <div>{props.page_size}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
