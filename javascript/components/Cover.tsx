import { Field, useFormikContext } from 'formik';
import React from 'react';
import { Values } from '../app/Model';

export default function Cover() {
  const { values } = useFormikContext<Values>();
  return (
    <fieldset className="form col-md-12">
      <h3>Cover</h3>
      <p>
        <label>Cover image</label>
        <Field component="select" name="cover_image_chooser">
          <option>No image</option>
          <option value="metadata">Map metadata</option>
        </Field>
      </p>
      {/*<p className="controller" id="cover_image_file">*/}
      {/*  <input name="cover_image" id="cover_image_file_value" type="file" />*/}
      {/*</p>*/}
      {values.cover_image_chooser === 'metadata' && (
        <p className="controller" id="configuration.cover_image_metadata">
          <label
            htmlFor="configuration.cover_image_metadata_value"
            className="inline"
          >
            Data element name
          </label>
          :
          <Field
            name="configuration.cover_image_metadata"
            id="configuration.cover_image_metadata_value"
            type="text"
            pattern="[^\s]+"
          />
        </p>
      )}
      <p className="instruction">Image on the cover page.</p>
      <div className="help">
        <p>Read the cover graphic file name from map metadata field:</p>
        <pre>
          &lt;data name="cover-image"&gt; &lt;image href="cover.svg"/&gt;
          &lt;/data&gt;
        </pre>
        <p>Or use topic as cover topic:</p>
        <pre>
          &lt;topicref href="cover.dita" outputclass="front-cover" toc="no"/&gt;
        </pre>
      </div>
    </fieldset>
  );
}
