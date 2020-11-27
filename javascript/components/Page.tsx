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
              <option value="297mm 420mm">A3</option>
              <option value="210mm 297mm">A4</option>
              <option value="148mm 210mm">A5</option>
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
            <label htmlFor="page.top">Top</label>
            <Field
              name="page.top"
              id="page.top"
              pattern="(\d+(\.\d+)?|\.\d+)(pt|mm|in|pc|cm|em)"
              className="length-value"
              required
            />
          </p>
          <p>
            <label htmlFor="page.outside">Outside</label>
            <Field
              name="page.outside"
              id="page.outside"
              pattern="(\d+(\.\d+)?|\.\d+)(pt|mm|in|pc|cm|em)"
              className="length-value"
              required
            />
          </p>
          <p>
            <label htmlFor="page.bottom">Bottom</label>
            <Field
              name="page.bottom"
              id="page.bottom"
              pattern="(\d+(\.\d+)?|\.\d+)(pt|mm|in|pc|cm|em)"
              className="length-value"
              required
            />
          </p>
          <p>
            <label htmlFor="page.inside">Inside</label>
            <Field
              name="page.inside"
              id="page.inside"
              pattern="(\d+(\.\d+)?|\.\d+)(pt|mm|in|pc|cm|em)"
              className="length-value"
              required
            />
          </p>
          <p className="instruction">Page margins.</p>
        </fieldset>
        <fieldset>
          <p>
            <label htmlFor="mirror_page_margins">Mirror margins</label>
            <Field
              type="checkbox"
              name="mirror_page_margins"
              id="mirror_page_margins"
            />
          </p>
        </fieldset>
        <h3>Columns</h3>
        <fieldset>
          <p>
            <label htmlFor="body_column_count">Body column count</label>
            <Field
              component="select"
              name="body_column_count"
              id="body_column_count"
              required
            >
              <option value="1">1</option>
              <option value="2">2</option>
            </Field>
          </p>
          <p>
            <label htmlFor="index_column_count">Index column count</label>
            <Field
              component="select"
              name="index_column_count"
              id="index_column_count"
              required
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </Field>
          </p>
          {(values.index_column_count > 1 || values.body_column_count > 1) && (
            <p>
              <label htmlFor="column_gap">Column gap</label>
              <Field
                name="column_gap"
                id="column_gap"
                pattern="(\d+(\.\d+)?|\.\d+)(pt|mm|in|pc|cm|em)"
                className="length-value"
              />
            </p>
          )}
        </fieldset>
      </div>
      <PagePreview
        mirror_page_margins={values.mirror_page_margins}
        page_size={values.page_size}
        orientation={values.orientation}
        top={values.page.top}
        outside={values.page.outside}
        bottom={values.page.bottom}
        inside={values.page.inside}
      />
    </>
  );
}
