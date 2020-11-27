import React from 'react';
import Environment from './Environment';
import Page from './Page';
import Header from './Header';
import Layout from './Layout';
import Styles from './Styles';
import Cover from './Cover';
import Other from './Other';
import Metadata from './Metadata';
import Download from './Download';
import { Form, Formik, FormikHelpers, FormikValues } from 'formik';
import { getInitValues, toModel, Values } from '../app/Model';

const initialValues: Values = getInitValues();

const onSubmit = (values: FormikValues, actions: FormikHelpers<Values>) => {
  console.log(toModel(values as Values));
  actions.setSubmitting(false);
};

export default function App() {
  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      <Form>
        <div id="generate-plugin">
          <section className="page container" id="p1">
            <Environment />
            <Page />
            <Header />
            <Layout />
            <Styles />
            <Cover />
            <Other />
            <Metadata />
          </section>
          <section className="page container" id="p2">
            <Download />
          </section>
          <div id="controls">
            <button id="generate" className="btn btn-primary" type="submit">
              Generate
            </button>
          </div>
        </div>
      </Form>
    </Formik>
  );
}
