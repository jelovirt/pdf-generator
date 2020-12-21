import { Field } from 'formik';
import React from 'react';

export default function OtherPreview(props: { task_label: boolean }) {
  return (
    <div className="example-block col-md-7">
      <div className="example-text">
        {props.task_label && (
          <p className="example-page-content-para example-task-label">
            <strong>About this task</strong>
          </p>
        )}
        <p className="example-page-content-para">
          Learn how to add nails to walls.
        </p>
        {props.task_label && (
          <p className="example-page-content-para example-task-label">
            <strong>Before you start</strong>
          </p>
        )}
        <p className="example-page-content-para">Buy a hammer and a nail.</p>
        {props.task_label && (
          <p className="example-page-content-para example-task-label">
            <strong>Procedure</strong>
          </p>
        )}
        <p className="example-page-content-para">1. Hammer in the nail.</p>
      </div>
    </div>
  );
}
