import React from 'react';

export default function Environment() {
  return (
    <div className="form col-md-12">
      <p className="help">
        A PDF customisation plug-in defines a new DITA-OT transformation type
        based on the built-in PDF conversion.
      </p>
      <h3>Target environment</h3>
      <fieldset>
        <p>
          <label
            for="ot_version"
            title="Version of DITA-OT for which the plug-in is installed into."
          >
            DITA-OT version
          </label>
          <select
            name="ot_version"
            id="ot_version"
            title="DITA-OT version"
            required
          >
            <option value="3.5" selected>
              3.5
            </option>
            <option value="3.0">3.0</option>
            <option value="2.5">2.5</option>
          </select>
        </p>
        <p className="instruction">
          Version of DITA-OT for which the plug-in is installed into.
        </p>
      </fieldset>
      <fieldset>
        <p>
          <label for="formatter">XSL formatter</label>
          <select
            name="formatter"
            id="formatter"
            title="XSL formatter"
            required
          >
            <option value="fop" selected>
              FOP
            </option>
            <option value="ah">AntennaHouse Formatter</option>
            <option value="xep">RenderX XEP</option>
          </select>
        </p>
        <p className="instruction">
          XSL formatter used to generate PDF output. DITA-OT comes with open
          source FOP formatter.
        </p>
        <p className="help">
          Note that customisation features available are dependent on the target
          DITA-OT and XSL formatter.
        </p>
      </fieldset>
      <fieldset>
        <p>
          <label for="override_shell">Override shell</label>
          <input
            type="checkbox"
            name="override_shell"
            id="override_shell"
            title="Override shell"
            value="true"
            checked
          />
        </p>
        <p className="instruction">
          Override XSLT shell stylesheet. Advanced generation option which will
          make further developing the generated plug-in easier.
        </p>
      </fieldset>
    </div>
  );
}