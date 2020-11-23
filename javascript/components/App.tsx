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

export default function App() {
  return (
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
  );
}
