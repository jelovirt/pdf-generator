import React from 'react';

export default function Other() {
  return (
    <>
      <div className="form col-md-12">
        {/*// <!-- TODO move this to TOC styles -->*/}
        <h3>Table of Contents</h3>
        <fieldset>
          <p>
            <label for="toc-maximum-level">Show level</label>
            <select name="toc-maximum-level" id="toc-maximum-level">
              <option value="2">1</option>
              <option value="3">2</option>
              <option value="4" selected>
                3
              </option>
              <option value="5">4</option>
            </select>
          </p>
          <p className="instruction">
            Number of levels displayed on table of contents page.
          </p>
        </fieldset>
        {/*// <!-- TODO move this to header -->*/}
        <h3>Page numbering</h3>
        <fieldset className="fah">
          <p className="not-available">Not available for FOP and RenderX XEP</p>
          <p>
            <label for="page-number">Page number</label>
            <select name="page-number" id="page-number">
              <option value="page" selected>
                1
              </option>
              <option value="chapter-page">1-1</option>
            </select>
          </p>
          <p className="instruction">Page number format.</p>
          <p className="help">
            Either use a simple page number, or reset page numbering for each
            chapter and prefix page number with chapter number.
          </p>
        </fieldset>
        <h3>PDF Bookmarks</h3>
        <fieldset>
          <p>
            <label for="bookmark-style">Bookmarks state</label>
            <select
              name="bookmark-style"
              id="bookmark-style"
              title="Bookmark initial state"
            >
              <option value="COLLAPSED" selected>
                collapsed
              </option>
              <option value="EXPANDED">expanded</option>
            </select>
          </p>
          <p className="instruction">PDF bookmark node initial state.</p>
        </fieldset>
      </div>
      <div className="form col-md-5">
        <h3>Labels</h3>
        <fieldset>
          <p>
            <label for="task-label">Task labels</label>
            <input
              type="checkbox"
              name="task-label"
              id="task-label"
              value="true"
              title="Task labels"
            />
          </p>
          <p className="instruction">
            Generate titles for task steps and sections.
          </p>
        </fieldset>
        <fieldset className="fah">
          <p className="not-available">Not available for FOP and RenderX XEP</p>
          <p>
            <label for="table-continued">Table continued</label>
            <input
              type="checkbox"
              name="table-continued"
              id="table-continued"
              value="true"
              title="Mark continued table"
            />
          </p>
          <p className="instruction">
            Generate "Table continued…" to table footer when table is broken to
            multiple pages.
          </p>
        </fieldset>
      </div>
      <div className="example-block col-md-7">
        <div className="example-text">
          <p className="example-page-content-para example-task-label">
            <strong>About this task</strong>
          </p>
          <p className="example-page-content-para">
            Learn how to add nails to walls.
          </p>
          <p className="example-page-content-para example-task-label">
            <strong>Before you start</strong>
          </p>
          <p className="example-page-content-para">Buy a hammer and a nail.</p>
          <p className="example-page-content-para example-task-label">
            <strong>Procedure</strong>
          </p>
          <p className="example-page-content-para">1. Hammer in the nail.</p>
        </div>
      </div>
      <div className="form col-md-12">
        <h3>Linking</h3>
        <fieldset>
          <p>
            <label for="include-related-links">Related links</label>
            <select
              name="include-related-links"
              id="include-related-links"
              title="Related links"
            >
              <option value="none" selected>
                none
              </option>
              <option value="nofamily">no family</option>
              <option value="all">all</option>
            </select>
          </p>
          <p className="instruction">Related links generated for topics.</p>
        </fieldset>
      </div>
    </>
  );
}
