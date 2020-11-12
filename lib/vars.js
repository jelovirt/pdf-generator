'use strict';

import _ from 'lodash';
import ET from './elementtree';

const langs = {
  de: {
    blank_page:
      '<variable id="blank_page">Diese Seite wurde absichtlich leer gelassen</variable>',
    '#table-continued':
      "<variable id='#table-continued'>Table continued&#x2026;</variable>",
    Figure:
      "<variable id='Figure'>Abbildung: <param ref-name='title'/></variable>",
    Table: "<variable id='Table'>Tabelle: <param ref-name='title'/></variable>",
    //"Chapter with number": "<variable id='Chapter with number'></variable>",
    'Table of Contents Chapter':
      "<variable id='Table of Contents Chapter'></variable>",
    'Table of Contents Appendix':
      "<variable id='Table of Contents Appendix'>Anhang:&#xA0;</variable>",
  },
  en: {
    blank_page:
      '<variable id="blank_page">This page intentionally left blank</variable>',
    '#table-continued':
      "<variable id='#table-continued'>Table continued&#x2026;</variable>",
    Figure:
      "<variable id='Figure'>Figure: <param ref-name='title'/></variable>",
    Table: "<variable id='Table'>Table: <param ref-name='title'/></variable>",
    //"Chapter with number": "<variable id='Chapter with number'></variable>",
    'Table of Contents Chapter':
      "<variable id='Table of Contents Chapter'></variable>",
    'Table of Contents Appendix':
      "<variable id='Table of Contents Appendix'>Appendix:&#xA0;</variable>",
  },
  es: {
    blank_page:
      '<variable id="blank_page">Esta página ha sido expresamente dejada en blanco</variable>',
    '#table-continued':
      "<variable id='#table-continued'>Table continued&#x2026;</variable>",
    Figure:
      "<variable id='Figure'>Figura: <param ref-name='title'/></variable>",
    Table: "<variable id='Table'>Tabla: <param ref-name='title'/></variable>",
    //"Chapter with number": "<variable id='Chapter with number'></variable>",
    'Table of Contents Chapter':
      "<variable id='Table of Contents Chapter'></variable>",
    'Table of Contents Appendix':
      "<variable id='Table of Contents Appendix'>Ap&#xe9;ndice:&#xA0;</variable>",
  },
  fi: {
    blank_page:
      '<variable id="blank_page">Tämä sivu on tarkoituksellisesti jätetty tyhjäksi</variable>',
    '#table-continued':
      "<variable id='#table-continued'>Table continued&#x2026;</variable>",
    Figure: "<variable id='Figure'>Kuva. <param ref-name='title'/></variable>",
    Table: "<variable id='Table'>Taulu. <param ref-name='title'/></variable>",
    //"Chapter with number": "<variable id='Chapter with number'></variable>",
    'Table of Contents Chapter':
      "<variable id='Table of Contents Chapter'></variable>",
    'Table of Contents Appendix':
      "<variable id='Table of Contents Appendix'>Liite </variable>",
  },
  fr: {
    blank_page:
      '<variable id="blank_page">Cette page a été volontairement laissée vide</variable>',
    '#table-continued':
      "<variable id='#table-continued'>Table continued&#x2026;</variable>",
    Figure:
      "<variable id='Figure'>Illustration: <param ref-name='title'/></variable>",
    Table: "<variable id='Table'>Table: <param ref-name='title'/></variable>",
    //"Chapter with number": "<variable id='Chapter with number'></variable>",
    'Table of Contents Chapter':
      "<variable id='Table of Contents Chapter'></variable>",
    'Table of Contents Appendix':
      "<variable id='Table of Contents Appendix'>Annexe&#xA0;:&#xA0;</variable>",
  },
  he: {
    blank_page:
      '<variable id="blank_page">This page intentionally left blank</variable>',
    '#table-continued':
      "<variable id='#table-continued'>Table continued&#x2026;</variable>",
    Figure:
      "<variable id='Figure'>&#x5d0;&#x5d9;&#x5d5;&#x5e8;. <param ref-name='title'/></variable>",
    Table:
      "<variable id='Table'>&#x5d8;&#x5d1;&#x5dc;&#x5d4;. <param ref-name='title'/></variable>",
    //"Chapter with number": "<variable id='Chapter with number'></variable>",
    'Table of Contents Chapter':
      "<variable id='Table of Contents Chapter'></variable>",
    'Table of Contents Appendix':
      "<variable id='Table of Contents Appendix'>&#x5e0;&#x5e1;&#x5e4;&#x5d7; </variable>",
  },
  it: {
    blank_page:
      '<variable id="blank_page">Questa pagina è stata lasciata intenzionalmente vuota</variable>',
    '#table-continued':
      "<variable id='#table-continued'>Table continued&#x2026;</variable>",
    Figure:
      "<variable id='Figure'> Figura: <param ref-name='title'/></variable>",
    Table: "<variable id='Table'>Tabella: <param ref-name='title'/></variable>",
    //"Chapter with number": "<variable id='Chapter with number'></variable>",
    'Table of Contents Chapter':
      "<variable id='Table of Contents Chapter'></variable>",
    'Table of Contents Appendix':
      "<variable id='Table of Contents Appendix'>Appendice:&#xA0;</variable>",
  },
  ja: {
    blank_page:
      '<variable id="blank_page">このページは計画的にブランクを残ている</variable>',
    '#table-continued':
      "<variable id='#table-continued'>Table continued&#x2026;</variable>",
    Figure:
      "<variable id='Figure'>&#x56f3; : <param ref-name='title'/></variable>",
    Table:
      "<variable id='Table'>&#x8868; : <param ref-name='title'/></variable>",
    //"Chapter with number": "<variable id='Chapter with number'></variable>",
    'Table of Contents Chapter':
      "<variable id='Table of Contents Chapter'></variable>",
    'Table of Contents Appendix':
      "<variable id='Table of Contents Appendix'>&#x4ed8;&#x9332; : </variable>",
  },
  nl: {
    blank_page:
      '<variable id="blank_page">Deze bladzijde werd met opzet blanco gelaten</variable>',
    '#table-continued':
      "<variable id='#table-continued'>Table continued&#x2026;</variable>",
    Figure:
      "<variable id='Figure'>Figuur: <param ref-name='title'/></variable>",
    Table: "<variable id='Table'>Tabel: <param ref-name='title'/></variable>",
    //"Chapter with number": "<variable id='Chapter with number'></variable>",
    'Table of Contents Chapter':
      "<variable id='Table of Contents Chapter'></variable>",
    'Table of Contents Appendix':
      "<variable id='Table of Contents Appendix'>Bijlage:&#xA0;</variable>",
  },
  ro: {
    blank_page:
      '<variable id="blank_page">Aceasta pagina a fost lasata libera in mod intentionat</variable>',
    '#table-continued':
      "<variable id='#table-continued'>Table continued&#x2026;</variable>",
    Figure: "<variable id='Figure'>Fig. <param ref-name='title'/></variable>",
    Table: "<variable id='Table'>Tabel. <param ref-name='title'/></variable>",
    //"Chapter with number": "<variable id='Chapter with number'></variable>",
    'Table of Contents Chapter':
      "<variable id='Table of Contents Chapter'></variable>",
    'Table of Contents Appendix':
      "<variable id='Table of Contents Appendix'>Anexa </variable>",
  },
  ru: {
    blank_page:
      '<variable id="blank_page">Эта страница нарочно оставлена пустой</variable>',
    '#table-continued':
      "<variable id='#table-continued'>Table continued&#x2026;</variable>",
    Figure:
      "<variable id='Figure'>&#x420;&#x438;&#x441;&#x443;&#x43d;&#x43e;&#x43a;. <param ref-name='title'/></variable>",
    Table:
      "<variable id='Table'>&#x422;&#x430;&#x431;&#x43b;&#x438;&#x446;&#x430;. <param ref-name='title'/></variable>",
    //"Chapter with number": "<variable id='Chapter with number'></variable>",
    'Table of Contents Chapter':
      "<variable id='Table of Contents Chapter'></variable>",
    'Table of Contents Appendix':
      "<variable id='Table of Contents Appendix'>&#x41f;&#x440;&#x438;&#x43b;&#x43e;&#x436;&#x435;&#x43d;&#x438;&#x435; </variable>",
  },
  sl: {
    blank_page:
      '<variable id="blank_page">Tale stran je zanalačš pučšena prazna</variable>',
    '#table-continued':
      "<variable id='#table-continued'>Table continued&#x2026;</variable>",
    Figure: "<variable id='Figure'>Slika: <param ref-name='title'/></variable>",
    Table: "<variable id='Table'>Tabela: <param ref-name='title'/></variable>",
    //"Chapter with number": "<variable id='Chapter with number'></variable>",
    'Table of Contents Chapter':
      "<variable id='Table of Contents Chapter'></variable>",
    'Table of Contents Appendix':
      "<variable id='Table of Contents Appendix'>Kazalo dodatka:&#xA0;</variable>",
  },
  sv: {
    blank_page:
      '<variable id="blank_page">Denna sida har avsiktligen lämnats blank</variable>',
    '#table-continued':
      "<variable id='#table-continued'>Table continued&#x2026;</variable>",
    Figure: "<variable id='Figure'>Figur. <param ref-name='title'/></variable>",
    Table: "<variable id='Table'>Tabell. <param ref-name='title'/></variable>",
    //"Chapter with number": "<variable id='Chapter with number'></variable>",
    'Table of Contents Chapter':
      "<variable id='Table of Contents Chapter'></variable>",
    'Table of Contents Appendix':
      "<variable id='Table of Contents Appendix'>Appendix </variable>",
  },
  zh_CN: {
    blank_page: '<variable id="blank_page">這頁故意地被留下空白</variable>',
    '#table-continued':
      "<variable id='#table-continued'>Table continued&#x2026;</variable>",
    Figure:
      "<variable id='Figure'>&#x56fe;: <param ref-name='title'/></variable>",
    Table:
      "<variable id='Table'>&#x8868;: <param ref-name='title'/></variable>",
    //"Chapter with number": "<variable id='Chapter with number'></variable>",
    'Table of Contents Chapter':
      "<variable id='Table of Contents Chapter'></variable>",
    'Table of Contents Appendix':
      "<variable id='Table of Contents Appendix'>&#x9644;&#x5f55;:&#xA0;</variable>",
  },
};

function generate_vars(lang, options) {
  const root = ET.Element('vars', {
    xmlns: 'http://www.idiominc.com/opentopic/vars',
  });

  // page number reference
  if (
    !(
      _.has(options.style['link'], 'link-page-number') &&
      options.style['link']['link-page-number'] === true
    )
  ) {
    ET.SubElement(root, 'variable', { id: 'On the page' });
  }
  // table continued

  if (options.table_continued) {
    root.append(ET.parse(langs[lang]['#table-continued']).getroot());
  }
  // table caption numbering
  if (
    _.has(options.style['table'], 'caption-number') &&
    options.style['table']['caption-number'] === 'none'
  ) {
    root.append(ET.parse(langs[lang]['Table']).getroot());
  }
  // figure caption numbering
  if (
    _.has(options.style['fig'], 'caption-number') &&
    options.style['fig']['caption-number'] === 'none'
  ) {
    root.append(ET.parse(langs[lang]['Figure']).getroot());
  }
  // chapter numbering
  if (
    _.has(options.style['topic'], 'title-numbering') &&
    options.style['topic']['title-numbering'] !== true
  ) {
    //    root.append(ET.parse(langs[lang]["Chapter with number"]).getroot())
    root.append(ET.parse(langs[lang]['Table of Contents Chapter']).getroot());
    root.append(ET.parse(langs[lang]['Table of Contents Appendix']).getroot());
  }
  // cover image
  if (options.cover_image_name) {
    ET.SubElement(root, 'variable', {
      id: 'cover-image-path',
    }).text = `Customization/OpenTopic/common/artwork/${options.cover_image_name}"`;
  }
  // blank page
  if (!!options.options.blank_pages) {
    root.append(ET.parse(langs[lang]['blank_page']).getroot());
  }
  // static content
  const headers = [
    'Body first header',
    'Body odd header',
    'Body even header',
    'Preface odd header',
    'Preface even header',
    'Preface first header',
    'Toc odd header',
    'Toc even header',
    'Index odd header',
    'Index even header',
    'Glossary odd header',
    'Glossary even header',
  ];

  const footers = [
    'Body odd footer',
    'Body even footer',
    'Body first footer',
    'Preface odd footer',
    'Preface even footer',
    'Preface first footer',
    'Toc odd footer',
    'Toc even footer',
    'Index odd footer',
    'Index even footer',
    'Glossary odd footer',
    'Glossary even footer',
  ];

  variables(options.header, headers);
  variables(options.footer, footers);
  function variables(args, var_names) {
    var_names.forEach((id) => {
      var vars = [];
      if (id.indexOf('even') > -1) {
        vars = args['even'];
      } else {
        vars = args['odd'];
      }
      const f = ET.SubElement(root, 'variable', { id: id });
      let i = 1;
      vars.forEach((v) => {
        let e = ET.Element('param', { 'ref-name': v });
        if (i < vars.length) {
          e.tail = ' | ';
        }
        f.append(e);
        i = i + 1;
      });
    });
  }

  _.range(1, 5).forEach((level) => {
    let v = `ol-${level}`;
    let varE = ET.SubElement(root, 'variable', {
      id: `Ordered List Number ${level}`,
    });
    if (
      _.has(options.style, 'ol') &&
      _.has(options.style['ol'], `ol-before-${level}`)
    ) {
      varE.text = options.style['ol'][`ol-before-${level}`];
    } else {
      varE.text = options.default_style('ol', `ol-before-${level}`);
    }
    const p = ET.SubElement(varE, 'param', { 'ref-name': 'number' });
    if (
      _.has(options.style, 'ol') &&
      _.has(options.style['ol'], `ol-after-${level}`)
    ) {
      p.tail = options.style['ol'][`ol-after-${level}`];
    } else {
      p.tail = options.default_style('ol', `ol-after-${level}`);
    }
  });
  _.range(1, 5).forEach((level) => {
    let v = `ol-${level}`;
    let varE = ET.SubElement(root, 'variable', {
      id: `Ordered List Format ${level}`,
    });
    if (
      _.has(options.style, 'ol') &&
      _.has(options.style['ol'], `ol-${level}`)
    ) {
      varE.text = options.style['ol'][`ol-${level}`];
    } else {
      varE.text = options.default_style('ol', `ol-${level}`);
    }
  });
  _.range(1, 5).forEach((level) => {
    let v = `ul-${level}`;
    let varE = ET.SubElement(root, 'variable', {
      id: `Unordered List bullet ${level}`,
    });
    if (
      _.has(options.style, 'ul') &&
      _.has(options.style['ul'], `ul-${level}`)
    ) {
      varE.text = options.style['ul'][`ul-${level}`];
    } else {
      varE.text = options.default_style('ul', `ul-${level}`);
    }
  });
  //    ditagen.generator.indent(root, max=1)
  //    ditagen.generator.set_prefixes(root, {"": "http://www.idiominc.com/opentopic/vars"})
  const d = new ET.ElementTree(root);
  ET.register_namespace('', 'http://www.idiominc.com/opentopic/vars');
  return d.write();
}

module.exports = generate_vars;
