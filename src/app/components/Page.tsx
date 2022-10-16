import React from 'react';
import { Field, useFormikContext } from 'formik';
import PagePreview from './PagePreview';
import { nextValue, PageSizes, Values } from './common';

export default function Page() {
  const { setFieldValue, values } = useFormikContext<Values>();

  const handleLengthKeydown = (
    field: 'top' | 'outside' | 'bottom' | 'inside'
  ) => (e: KeyboardEvent) => {
    let value;
    switch (e.key) {
      case 'ArrowDown':
        value = nextValue(values.page[field], -1);
        break;
      case 'ArrowUp':
        value = nextValue(values.page[field], 1);
        break;
    }
    if (value !== undefined) {
      setFieldValue(`page.${field}`, value);
    }
  };

  const handleColumnGapKeydown = (e: KeyboardEvent) => {
    let value;
    switch (e.key) {
      case 'ArrowDown':
        value = nextValue(values.column_gap, -1);
        break;
      case 'ArrowUp':
        value = nextValue(values.column_gap, 1);
        break;
    }
    if (value !== undefined) {
      setFieldValue(`column_gap`, value);
    }
  };

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
              <option value={PageSizes.A3}>A3</option>
              <option value={PageSizes.A4}>A4</option>
              <option value={PageSizes.A5}>A5</option>
              <option value={PageSizes.EXECUTIVE}>Executive</option>
              <option value={PageSizes.JIS_B5}>JIS B5</option>
              <option value={PageSizes.TABLOID}>Tabloid</option>
              <option value={PageSizes.US_LEGAL}>US Legal</option>
              <option value={PageSizes.US_LETTER}>US Letter</option>
              <option value={PageSizes.PA4}>PA4</option>
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
          {[
            { field: 'top', label: 'Top' },
            { field: 'outside', label: 'Outside' },
            { field: 'bottom', label: 'Bottom' },
            { field: 'inside', label: 'Inside' },
          ].map(({ field, label }) => {
            const name = `page.${field}`;
            return (
              <p key={name}>
                <label htmlFor={name}>{label}</label>
                <Field
                  name={name}
                  id={name}
                  autoComplete="off"
                  pattern="(\d+(\.\d+)?|\.\d+)(pt|mm|in|pc|cm|em)"
                  onKeyDown={handleLengthKeydown(
                    field as 'top' | 'outside' | 'bottom' | 'inside'
                  )}
                  className="length-value"
                  required
                />
              </p>
            );
          })}
          <p className="instruction">Page margins.</p>
        </fieldset>
        <fieldset>
          <p>
            <label htmlFor="page_mirror_margins">Mirror margins</label>
            <Field
              type="checkbox"
              name="page_mirror_margins"
              id="page_mirror_margins"
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
                onKeyDown={handleColumnGapKeydown}
                className="length-value"
              />
            </p>
          )}
        </fieldset>
      </div>
      <PagePreview
        page_mirror_margins={values.page_mirror_margins}
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
