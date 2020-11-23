import React from 'react';

export default function Layout() {
  return (
    <>
      <div className="form col-md-5">
        <h3>Layout</h3>
        <fieldset>
          <p>
            <label for="force-page-count">Chapter start</label>
            <select
              name="force-page-count"
              id="force-page-count"
              title="Force page count"
            >
              {/*// <!-- TODO -->*/}
              {/*// <!--option value="together">no break</option-->*/}
              <option value="auto">new page</option>
              <option value="even" selected>
                odd page
              </option>
              <option value="odd">even page</option>
            </select>
          </p>
          <p className="instruction">
            Chapters can be made to always start on an odd page or directly
            follow the previous page.
          </p>
          <p className="help">
            Default page count behavior for Bookmaps is to start every chapter
            on an odd page.
          </p>
        </fieldset>
        <fieldset>
          <p>
            <label for="blank_pages">Blank pages</label>
            <select
              name="blank_pages"
              id="blank_pages"
              title="Mark blank pages"
            >
              <option value="true">mark blank page</option>
              <option value="false" selected>
                empty blank page
              </option>
            </select>
          </p>
          <p className="instruction">
            Blank pages are marked with
            <q>This page intentionally left blank</q> text.
          </p>
        </fieldset>
        <fieldset>
          <p>
            <label for="chapter-layout">Chapter layout</label>
            <select
              name="chapter-layout"
              id="chapter-layout"
              title="Chapter page layout"
            >
              <option value="MINITOC" selected>
                chapter TOC
              </option>
              <option value="BASIC">no chapter TOC</option>
            </select>
          </p>
          <p className="instruction">
            Chapters can start with a table of chapter contents on a separate
            chapter cover page.
          </p>
        </fieldset>
      </div>
      <div className="example-block col-md-7">
        <div className="force-page-count_example_auto">
          <div className="example-page even" title="Even page">
            <table className="example-page-body">
              <tr>
                <td>
                  <div></div>
                </td>
              </tr>
            </table>
          </div>
          <div
            className="example-page odd"
            title="Even odd, last page of chapter"
          >
            <table className="example-page-body cut-off">
              <tr>
                <td>
                  <div></div>
                </td>
              </tr>
            </table>
          </div>
          <div
            className="example-page even"
            title="Even page, first page of chapter"
          >
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
        <div className="force-page-count_example_even">
          <div className="example-page even" title="Even page">
            <table className="example-page-body">
              <tr>
                <td>
                  <div></div>
                </td>
              </tr>
            </table>
          </div>
          <div
            className="example-page odd"
            title="Odd page, last page of chapter"
          >
            <table className="example-page-body cut-off">
              <tr>
                <td>
                  <div></div>
                </td>
              </tr>
            </table>
          </div>
          <div className="example-page even" title="Even page, blank page">
            <table className="example-page-body-empty">
              <tr>
                <td>
                  <div></div>
                </td>
              </tr>
            </table>
          </div>
          <div
            className="example-page odd"
            title="Odd page, first page of chapter"
          >
            <table className="example-page-body">
              <tr>
                <td>
                  <div></div>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div className="force-page-count_example_odd">
          <div
            className="example-page even"
            title="Even page, last page of chapter"
          >
            <table className="example-page-body cut-off">
              <tr>
                <td>
                  <div></div>
                </td>
              </tr>
            </table>
          </div>
          <div className="example-page odd" title="Odd page, blank page">
            <table className="example-page-body-empty">
              <tr>
                <td>
                  <div></div>
                </td>
              </tr>
            </table>
          </div>
          <div
            className="example-page even"
            title="Even page, first page of chapter"
          >
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
      </div>
    </>
  );
}
