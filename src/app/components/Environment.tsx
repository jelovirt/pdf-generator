import React from 'react';
import { Field } from 'formik';
import { Formatter } from '../../generator/Model';

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
            htmlFor="ot_version"
            title="Version of DITA-OT for which the plug-in is installed into."
          >
            DITA-OT version
          </label>
          <Field
            component="select"
            name="ot_version"
            id="ot_version"
            title="DITA-OT version"
            required
          >
            <option value="3.6">3.6</option>
            <option value="3.5">3.5</option>
            <option value="3.0">3.0</option>
            <option value="2.5">2.5</option>
          </Field>
        </p>
        <p className="instruction">
          Version of DITA-OT for which the plug-in is installed into.
        </p>
      </fieldset>
      <fieldset>
        <p>
          <label htmlFor="formatter">XSL formatter</label>
          <Field
            component="select"
            name="formatter"
            id="formatter"
            title="XSL formatter"
            required
          >
            <option value={Formatter.FOP}>FOP</option>
            <option value={Formatter.AH}>AntennaHouse Formatter</option>
            <option value={Formatter.XEP}>RenderX XEP</option>
          </Field>
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
    </div>
  );
}
