import _ from 'lodash';
import { styles, Property, Style, StyleName } from '../lib/styles';

type Model = {
  configuration: {
    page: {
      height: string;
      width: string;
      top: string;
      outside: string;
      bottom: string;
      inside: string;
    };
    header: {
      odd: [];
      even: [];
    };
    footer: {
      odd: [];
      even: [];
    };
    style: Record<StyleName, Record<Property, Style>>;
    formatter: string;
    override_shell: boolean;
    mirror_page_margins: boolean;
    body_column_count: number;
    index_column_count: number;
    column_gap: string;
    force_page_count: string;
    chapter_layout: string;
    cover_image_metadata: string;
    bookmark_style: string;
    toc_maximum_level: number;
    task_label: boolean;
    include_related_links: string;
    table_continued: boolean;
    page_number: string;
  };
  ot_version: string;
  id: string | null;
  transtype: string | null;
};

function getInitStyle(): Record<StyleName, Record<Property, Style>> {
  return (_(styles)
    .mapValues((elementValue: Record<Property, Style>, element: StyleName) => {
      return _(elementValue)
        .mapValues((propertyValue: Style, property: Property) => {
          return getDefault(element, property);
        })
        .value();
    })
    .value() as unknown) as Record<string, Record<Property, Style>>;

  function getDefault(
    field: StyleName,
    property: Property
  ): string | boolean | undefined {
    const value = styles[field][property];
    if (!!value?.default) {
      return value.default;
    } else if (!!value?.inherit) {
      return getDefault(value.inherit, property);
    } else {
      // throw new Error(`Unable to find default for ${field}.${property}`)
      return undefined;
    }
  }
}

export function getInitStore(): Model {
  return {
    configuration: {
      page: {
        height: '297mm',
        width: '210mm',
        top: '20mm',
        outside: '20mm',
        bottom: '20mm',
        inside: '20mm',
      },
      header: {
        odd: [],
        even: [],
      },
      footer: {
        odd: [],
        even: [],
      },
      style: getInitStyle(),
      formatter: 'fop',
      override_shell: true,
      mirror_page_margins: false,
      body_column_count: 1,
      index_column_count: 2,
      column_gap: '12pt',
      force_page_count: 'even',
      chapter_layout: 'MINITOC',
      cover_image_metadata: 'cover-image',
      bookmark_style: 'COLLAPSED',
      toc_maximum_level: 4,
      task_label: false,
      include_related_links: 'none',
      table_continued: false,
      page_number: 'page',
    },
    ot_version: '3.0',
    id: null,
    transtype: null,
  };
}

export function reduce(store: any, action: any): any {
  return _.merge(store, action.value);
}
