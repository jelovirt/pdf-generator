import React from 'react';

export default function Metadata() {
  return (
    <div className="form col-md-12">
      <h3>Metadata</h3>
      <fieldset>
        <p>
          <label for="id" className="required">
            Plug-in ID
          </label>
          <input
            type="text"
            name="id"
            id="id"
            className="required"
            required
            title="ID of the new topic type or shell"
          />
        </p>
        <p className="instruction">
          Plug-in ID is used to identify the DITA-OT plug-in.
        </p>
        <p className="help">ID must conform to plug-in ID syntax rules.</p>
      </fieldset>
      <fieldset>
        <p>
          <label for="transtype" className="required">
            Transtype
          </label>
          <input
            name="transtype"
            id="transtype"
            className="required"
            required
            title="Transtype"
          />
        </p>
        <p className="instruction">Name of the new transformation type.</p>
        <p className="help">
          Transtype name must conform to same syntax rules as plug-in ID.
        </p>
      </fieldset>
      <fieldset>
        <p title="Generated plugin version number">
          <label for="plugin-version">Plug-in version</label>
          <input
            type="text"
            name="plugin-version"
            id="plugin-version"
            placeholder="0.0.0"
            pattern="\d+(\.\d+){0,2}"
          />
        </p>
      </fieldset>
    </div>
  );
}
