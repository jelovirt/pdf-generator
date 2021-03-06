import React from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import Environment from './Environment';
import Page from './Page';
import Header from './Header';
import Layout from './Layout';
import Styles from './Styles';
import Cover from './Cover';
import Other from './Other';
import Metadata from './Metadata';
import Download from './Download';
import { getInitValues, toPluginModel, Values } from './common';
import Generator from '../../generator';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { SaxonJS } from '../../types/saxon-js';

declare global {
  interface Window {
    SaxonJS: SaxonJS;
  }
}

const onSubmit = (values: Values, actions: FormikHelpers<Values>) => {
  actions.setSubmitting(false);
  const model = toPluginModel(values);
  const generator = new Generator(model, window.SaxonJS);
  const zip = new JSZip();
  generator.generate_plugin(zip);
  zip
    .generateAsync({
      type: 'blob',
      platform: 'UNIX',
    })
    .then((zipData) => FileSaver.saveAs(zipData, `${model.id}.zip`));
};

export default function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Formik initialValues={getInitValues()} onSubmit={onSubmit}>
        <Form>
          <Environment />
          <Page />
          <Header />
          <Layout />
          <Styles />
          <Cover />
          <Other />
          <Metadata />
          <Download />
        </Form>
      </Formik>
    </DndProvider>
  );
}
