import { Field } from 'formik';
import React from 'react';

export default function LayoutPreview() {
  return (
    <div className="example-block col-md-7">
      <div className="force_page_count_example_auto">
        <div className="example-page even" title="Even page">
          <table className="example-page-body">
            <tbody>
              <tr>
                <td>
                  <div></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          className="example-page odd"
          title="Even odd, last page of chapter"
        >
          <table className="example-page-body cut-off">
            <tbody>
              <tr>
                <td>
                  <div></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          className="example-page even"
          title="Even page, first page of chapter"
        >
          <table className="example-page-body">
            <tbody>
              <tr>
                <td>
                  <div></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="example-page odd" title="Odd page">
          <table className="example-page-body">
            <tbody>
              <tr>
                <td>
                  <div></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="force_page_count_example_even">
        <div className="example-page even" title="Even page">
          <table className="example-page-body">
            <tbody>
              <tr>
                <td>
                  <div></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          className="example-page odd"
          title="Odd page, last page of chapter"
        >
          <table className="example-page-body cut-off">
            <tbody>
              <tr>
                <td>
                  <div></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="example-page even" title="Even page, blank page">
          <table className="example-page-body-empty">
            <tbody>
              <tr>
                <td>
                  <div></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          className="example-page odd"
          title="Odd page, first page of chapter"
        >
          <table className="example-page-body">
            <tbody>
              <tr>
                <td>
                  <div></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="force_page_count_example_odd">
        <div
          className="example-page even"
          title="Even page, last page of chapter"
        >
          <table className="example-page-body cut-off">
            <tbody>
              <tr>
                <td>
                  <div></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="example-page odd" title="Odd page, blank page">
          <table className="example-page-body-empty">
            <tbody>
              <tr>
                <td>
                  <div></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          className="example-page even"
          title="Even page, first page of chapter"
        >
          <table className="example-page-body">
            <tbody>
              <tr>
                <td>
                  <div></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="example-page odd" title="Odd page">
          <table className="example-page-body">
            <tbody>
              <tr>
                <td>
                  <div></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
