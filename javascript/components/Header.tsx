import React from 'react';

export default function Header() {
  return (
    <div className="form col-md-12">
      <h3>Header and footer</h3>
      <fieldset>
        <div>
          <label>Fields</label>
          <table className="static-content">
            <thead>
              <tr>
                <td id="header-source">
                  <span
                    data-field="copyright"
                    className="label label-default"
                    title="Copyright statement"
                  >
                    copyright
                  </span>
                  <span
                    data-field="title"
                    className="label label-default"
                    title="Map title"
                  >
                    title
                  </span>
                  <span
                    data-field="chapter"
                    className="label label-default"
                    title="Current chapter title"
                  >
                    chapter
                  </span>
                  <span
                    data-field="folio"
                    className="label label-default"
                    title="Folio"
                  >
                    #
                  </span>
                  <span
                    data-field="folio-with-total"
                    className="label label-default"
                    title="Folio with total page count"
                  >
                    # (##)
                  </span>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="even">Even header:</th>
                <th>Odd header:</th>
              </tr>
              <tr>
                <td className="even">
                  <div id="even-header"></div>
                </td>
                <td>
                  <div id="odd-header"></div>
                </td>
              </tr>
              <tr>
                <th className="even">Even footer:</th>
                <th>Odd footer:</th>
              </tr>
              <tr>
                <td className="even">
                  <div id="even-footer"></div>
                </td>
                <td>
                  <div id="odd-footer"></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="instruction">
          Drag fields for header and footer contents.
        </p>
      </fieldset>
    </div>
  );
}
