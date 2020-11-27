import React from 'react';
import { useFormikContext } from 'formik';

export default function PagePreview() {
  const { values } = useFormikContext();
  return (
    <div className="example-block col-md-7" id="margin.example">
      <div className="example-page even" title="Even page">
        <table className="example-page-body">
          <tr>
            <td>
              <div></div>
            </td>
          </tr>
        </table>
      </div>
      <div className="example-page odd" title="Odd page">
        <table className="example-page-body">
          <tr>
            <td>
              <div></div>
            </td>
          </tr>
        </table>
      </div>
    </div>
  );
}
