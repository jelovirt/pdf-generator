import { Field, useFormikContext } from 'formik';
import React from 'react';
import OtherPreview from './OtherPreview';
import { Values } from '../app/Model';

export default function Other() {
  const { values } = useFormikContext<Values>();
  return (
    <>
      <div className="form col-md-12">
        {/*// <!-- TODO move this to TOC styles -->*/}
        <h3>Table of Contents</h3>
        <fieldset>
          <p>
            <label htmlFor="toc_maximum_level">Show level</label>
            <Field
              component="select"
              name="toc_maximum_level"
              id="toc_maximum_level"
            >
              <option value="2">1</option>
              <option value="3">2</option>
              <option value="4">3</option>
              <option value="5">4</option>
            </Field>
          </p>
          <p className="instruction">
            Number of levels displayed on table of contents page.
          </p>
        </fieldset>
        <h3>PDF Bookmarks</h3>
        <fieldset>
          <p>
            <label htmlFor="bookmark_style">Bookmarks state</label>
            <Field
              component="select"
              name="bookmark_style"
              id="bookmark_style"
              title="Bookmark initial state"
            >
              <option value="COLLAPSED">collapsed</option>
              <option value="EXPANDED">expanded</option>
            </Field>
          </p>
          <p className="instruction">PDF bookmark node initial state.</p>
        </fieldset>
      </div>
      <div className="form col-md-5">
        <h3>Labels</h3>
        <fieldset>
          <p>
            <label htmlFor="task_label">Task labels</label>
            <Field
              type="checkbox"
              name="task_label"
              id="task_label"
              title="Task labels"
            />
          </p>
          <p className="instruction">
            Generate titles for task steps and sections.
          </p>
        </fieldset>
        <fieldset
          className={values.formatter !== 'ah' ? 'disabled' : undefined}
        >
          {values.formatter !== 'ah' && (
            <p className="not-available">
              Not available for FOP and RenderX XEP
            </p>
          )}
          <p>
            <label htmlFor="table_continued">Table continued</label>
            <Field
              type="checkbox"
              name="table_continued"
              id="table_continued"
              title="Mark continued table"
              disabled={values.formatter !== 'ah'}
            />
          </p>
          <p className="instruction">
            Generate "Table continued…" to table footer when table is broken to
            multiple pages.
          </p>
        </fieldset>
      </div>
      <OtherPreview task_label={values.task_label} />
      <div className="form col-md-12">
        <h3>Linking</h3>
        <fieldset>
          <p>
            <label htmlFor="include_related_links">Related links</label>
            <Field
              component="select"
              name="include_related_links"
              id="include_related_links"
              title="Related links"
            >
              <option value="none">none</option>
              <option value="nofamily">no family</option>
              <option value="all">all</option>
            </Field>
          </p>
          <p className="instruction">Related links generated for topics.</p>
        </fieldset>
      </div>
    </>
  );
}
