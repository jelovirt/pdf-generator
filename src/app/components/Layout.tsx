import { Field, useFormikContext } from 'formik';
import React from 'react';
import LayoutPreview from './LayoutPreview';
import { Values } from '../../generator/Model';

export default function Layout() {
  const { values } = useFormikContext<Values>();
  return (
    <>
      <div className="form col-md-5">
        <h3>Layout</h3>
        <fieldset>
          <p>
            <label htmlFor="force_page_count">Chapter start</label>
            <Field
              component="select"
              name="force_page_count"
              id="force_page_count"
              title="Force page count"
            >
              {/*// <!-- TODO -->*/}
              {/*// <!--option value="together">no break</option-->*/}
              <option value="auto">new page</option>
              <option value="even">odd page</option>
              <option value="odd">even page</option>
            </Field>
          </p>
          <p className="instruction">
            Chapters can be made to always start on an odd page or directly
            follow the previous page.
          </p>
          <p className="help">
            Default page count behavior for Bookmaps is to start every chapter
            on an odd page.
          </p>
        </fieldset>
        <fieldset>
          <p>
            <label htmlFor="blank_pages">Blank pages</label>
            <Field
              component="select"
              name="blank_pages"
              id="blank_pages"
              title="Mark blank pages"
            >
              <option value="true">mark blank page</option>
              <option value="false">empty blank page</option>
            </Field>
          </p>
          <p className="instruction">
            Blank pages are marked with
            <q>This page intentionally left blank</q> text.
          </p>
        </fieldset>
        <fieldset>
          <p>
            <label htmlFor="chapter_layout">Chapter layout</label>
            <select
              name="chapter_layout"
              id="chapter_layout"
              title="Chapter page layout"
            >
              <option value="MINITOC">chapter TOC</option>
              <option value="BASIC">no chapter TOC</option>
            </select>
          </p>
          <p className="instruction">
            Chapters can start with a table of chapter contents on a separate
            chapter cover page.
          </p>
        </fieldset>
      </div>
      <LayoutPreview
        force_page_count={values.force_page_count}
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
