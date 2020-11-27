import React from 'react';
import { Field, useFormikContext } from 'formik';
import PagePreview from './PagePreview';
import { Values } from '../app/Model';

export default function Page() {
  const { values } = useFormikContext<Values>();
  return (
    <>
      <div className="form col-md-5">
        <h3>Page</h3>
        <fieldset>
          <p>
            <label htmlFor="page_size">Page size</label>
            <Field
              component="select"
              name="page_size"
              id="page_size"
              title="Page size"
              required
            >
              <option value="210mm 297mm">A3</option>
              <option value="210mm 297mm">A4</option>
              <option value="210mm 297mm">A5</option>
              <option value="184.1mm 266.7mm">Executive</option>
              <option value="182mm 257mm">JIS B5</option>
              <option value="431.8mm 279.4mm">Tabloid</option>
              <option value="8.5in 14in">US Legal</option>
              <option value="8.5in 11in">US Letter</option>
              <option value="210mm 280mm">PA4</option>
            </Field>
          </p>
        </fieldset>
        <fieldset>
          <p>
            <label htmlFor="orientation">Orientation</label>
            <Field
              component="select"
              name="orientation"
              id="orientation"
              required
            >
              <option value="portrait">portrait</option>
              <option value="landscape">landscape</option>
            </Field>
          </p>
        </fieldset>
        <h3>Margins</h3>
        <fieldset>
          <p>
            <label htmlFor="configuration.page.top">Top</label>
            <Field
              name="configuration.page.top"
              id="configuration.page.top"
              pattern="(\d+(\.\d+)?|\.\d+)(pt|mm|in|pc|cm|em)"
              className="length-value"
              required
            />
          </p>
          <p>
            <label htmlFor="configuration.page.outside">Outside</label>
            <Field
              name="configuration.page.outside"
              id="configuration.page.outside"
              pattern="(\d+(\.\d+)?|\.\d+)(pt|mm|in|pc|cm|em)"
              className="length-value"
              required
            />
          </p>
          <p>
            <label htmlFor="configuration.page.bottom">Bottom</label>
            <Field
              name="configuration.page.bottom"
              id="configuration.page.bottom"
              pattern="(\d+(\.\d+)?|\.\d+)(pt|mm|in|pc|cm|em)"
              className="length-value"
              required
            />
          </p>
          <p>
            <label htmlFor="configuration.page.inside">Inside</label>
            <Field
              name="configuration.page.inside"
              id="configuration.page.inside"
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
            <Field
              type="checkbox"
              name="mirror-page-margins"
              id="mirror-page-margins"
            />
          </p>
        </fieldset>
        <h3>Columns</h3>
        <fieldset>
          <p>
            <label htmlFor="configuration.body_column_count">
              Body column count
            </label>
            <Field
              component="select"
              name="configuration.body_column_count"
              id="configuration.body_column_count"
              required
            >
              <option value="1">1</option>
              <option value="2">2</option>
            </Field>
          </p>
          <p>
            <label htmlFor="configuration.index_column_count">
              Index column count
            </label>
            <Field
              component="select"
              name="configuration.index_column_count"
              id="configuration.index_column_count"
              required
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </Field>
          </p>
          {(values.configuration.index_column_count > 1 ||
            values.configuration.body_column_count > 1) && (
            <p>
              <label htmlFor="configuration.column_gap">Column gap</label>
              <Field
                name="configuration.column_gap"
                id="configuration.column_gap"
                pattern="(\d+(\.\d+)?|\.\d+)(pt|mm|in|pc|cm|em)"
                className="length-value"
              />
            </p>
          )}
        </fieldset>
      </div>
      <PagePreview />
    </>
  );
}
