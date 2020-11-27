import React from 'react';

export default function Page() {
  return (
    <>
      <div className="form col-md-5">
        <h3>Page</h3>
        <fieldset>
          <p>
            <label htmlFor="page-size">Page size</label>
            <select name="page-size" id="page-size" title="Page size" required>
              <option value="210mm 297mm">A3</option>
              <option value="210mm 297mm" selected>
                A4
              </option>
              <option value="210mm 297mm">A5</option>
              <option value="184.1mm 266.7mm">Executive</option>
              <option value="182mm 257mm">JIS B5</option>
              <option value="431.8mm 279.4mm">Tabloid</option>
              <option value="8.5in 14in">US Legal</option>
              <option value="8.5in 11in">US Letter</option>
              <option value="210mm 280mm">PA4</option>
            </select>
          </p>
        </fieldset>
        <fieldset>
          <p>
            <label htmlFor="orientation">Orientation</label>
            <select name="orientation" id="orientation" required>
              <option value="portrait" selected>
                portrait
              </option>
              <option value="landscape">landscape</option>
            </select>
          </p>
        </fieldset>
        <h3>Margins</h3>
        <fieldset>
          <p>
            <label htmlFor="page-margin-top">Top</label>
            <input
              name="page-margin-top"
              id="page-margin-top"
              value="20mm"
              pattern="(\d+(\.\d+)?|\.\d+)(pt|mm|in|pc|cm|em)"
              className="length-value"
              required
            />
          </p>
          <p>
            <label htmlFor="page-margin-outside">Outside</label>
            <input
              name="page-margin-outside"
              id="page-margin-outside"
              value="20mm"
              pattern="(\d+(\.\d+)?|\.\d+)(pt|mm|in|pc|cm|em)"
              className="length-value"
              required
            />
          </p>
          <p>
            <label htmlFor="page-margin-bottom">Bottom</label>
            <input
              name="page-margin-bottom"
              id="page-margin-bottom"
              value="20mm"
              pattern="(\d+(\.\d+)?|\.\d+)(pt|mm|in|pc|cm|em)"
              className="length-value"
              required
            />
          </p>
          <p>
            <label htmlFor="page-margin-inside">Inside</label>
            <input
              name="page-margin-inside"
              id="page-margin-inside"
              value="20mm"
              pattern="(\d+(\.\d+)?|\.\d+)(pt|mm|in|pc|cm|em)"
              className="length-value"
              required
            />
          </p>
          <p className="instruction">Page margins.</p>
        </fieldset>
        <fieldset>
          <p>
            <label htmlFor="mirror-page-margins">Mirror margins</label>
            <input
              type="checkbox"
              name="mirror-page-margins"
              id="mirror-page-margins"
              value="true"
            />
          </p>
        </fieldset>
        <h3>Columns</h3>
        <fieldset>
          <p>
            <label htmlFor="body-column-count">Body column count</label>
            <select name="body-column-count" id="body-column-count" required>
              <option value="1" selected>
                1
              </option>
              <option value="2">2</option>
            </select>
          </p>
          <p>
            <label htmlFor="index-column-count">Index column count</label>
            <select name="index-column-count" id="index-column-count" required>
              <option value="1">1</option>
              <option value="2" selected>
                2
              </option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </p>
          <p>
            <label htmlFor="column-gap">Column gap</label>
            <input
              name="column-gap"
              id="column-gap"
              value="12pt"
              pattern="(\d+(\.\d+)?|\.\d+)(pt|mm|in|pc|cm|em)"
              className="length-value"
            />
          </p>
        </fieldset>
      </div>
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
    </>
  );
}
