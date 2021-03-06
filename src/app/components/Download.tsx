import React from 'react';
import { FormikHelpers, useFormikContext } from 'formik';
import { toPluginModel, toTemplateModel, Values } from './common';
import Generator from '../../generator';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { Model } from '../../generator/Model';

export default function Download() {
  const { values } = useFormikContext<Values>();

  const onSubmitTemplate = () => {
    const model = toTemplateModel(values);
    const blob = new Blob([JSON.stringify(model, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    FileSaver.saveAs(blob, 'template.json');
  };

  return (
    <div className="form col-md-12">
      <p>
        <button
          id="generate"
          className="btn btn-primary"
          type="submit"
          title="Generate plug-in file"
        >
          Generate plug-in
        </button>{' '}
        <button
          id="generate"
          className="btn btn-primary"
          type="button"
          title="Generate template file"
          onClick={() => onSubmitTemplate()}
        >
          Generate template
        </button>
      </p>
      <p>
        See{' '}
        <a
          target="_blank"
          href={
            values.ot_version === '3.6'
              ? 'https://www.dita-ot.org/3.6/topics/plugins-installing.html'
              : values.ot_version === '3.5'
              ? 'https://www.dita-ot.org/3.5/topics/plugins-installing.html'
              : values.ot_version === '3.0'
              ? 'https://www.dita-ot.org/3.0/topics/plugins-installing.html'
              : 'https://www.dita-ot.org/2.5/dev_ref/plugins-installing.html'
          }
        >
          plugin installation documentation
        </a>{' '}
        for next steps.
      </p>
      <h4 className="donation">Donations</h4>
      <p className="donation">
        The DITA-OT PDF plugin generator is developed as a spare time project by{' '}
        <a href="http://fi.linkedin.com/in/jelovirt">Jarno Elovirta</a> and is
        available for use free of charge. Donations are welcome per "value for
        value" model:{' '}
        <em>you give value only when you feel you have received value</em>.
      </p>
    </div>
  );
}
