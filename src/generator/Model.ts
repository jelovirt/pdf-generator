import _ from 'lodash';
import {
  FoProperty,
  headerFooterStyles,
  Property,
  Style,
  StyleName,
  styles,
} from './styles';

export type OtVersion = '3.6' | '3.5' | '3.0' | '2.5';

export enum Autogenerated {
  // COPYRIGHT = 'copyright',
  TITLE = 'title',
  CHAPTER = 'chapter',
  FOLIO = 'folio',
  FOLIO_WITH_TOTAL = 'folio-with-total',
}

export type Length = string;

export enum Formatter {
  AH = 'ah',
  FOP = 'fop',
  XEP = 'xep',
}

export enum HeaderFooterType {
  FIELD = 'field',
  TEXT = 'text',
}

export type HeaderFooterContent = HeaderFooterField | HeaderFooterText;

export type HeaderFooterField = {
  kind: HeaderFooterType.FIELD;
  value: Autogenerated;
};
export type HeaderFooterText = {
  kind: HeaderFooterType.TEXT;
  value: string;
};

type HeaderFooter = Partial<Record<FoProperty, string>> & {
  content: HeaderFooterContent[];
};

export type Model = {
  page: {
    height: Length;
    width: Length;
    top: Length;
    outside: Length;
    bottom: Length;
    inside: Length;
  };
  header: {
    odd: HeaderFooter;
    even: HeaderFooter;
  };
  footer: {
    odd: HeaderFooter;
    even: HeaderFooter;
  };
  style: Record<StyleName, Record<Property, string>>;
  // override_shell: boolean;
  page_mirror_margins: boolean;
  body_column_count: number;
  blank_pages: boolean;
  index_column_count: number;
  column_gap: Length;
  force_page_count: 'auto' | 'even' | 'odd';
  chapter_layout: 'MINITOC' | 'BASIC';
  cover_image_metadata: string;
  cover_image_topic: string;
  bookmark_style: 'COLLAPSED' | 'EXPANDED';
  style_toc_maximum_level: number;
  task_label: boolean;
  include_related_links: 'none' | 'all' | 'nofamily';
  table_continued: boolean;
  page_number: 'page' | 'chapter-page';
};

export type PluginModel = {
  id: string | null;
  formatter: Formatter;
  plugin_name?: string;
  plugin_version?: string;
  transtype: string | null;
  ot_version: OtVersion;
} & Model;

function getInitStyle(): Record<StyleName, Record<Property, string>> {
  return (_(styles)
    .mapValues(
      (elementValue: Partial<Record<Property, Style>>, element: StyleName) => {
        return _(elementValue)
          .mapValues((propertyValue: Style, property: Property) => {
            return getDefault(element, property);
          })
          .value();
      }
    )
    .value() as unknown) as Record<StyleName, Record<Property, string>>;

  function getDefault(
    field: StyleName,
    property: Property
  ): string | boolean | number | undefined {
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

function getHeaderFooterDefault(content: HeaderFooterContent[]): HeaderFooter {
  return {
    ...Object.fromEntries(
      Object.entries(headerFooterStyles).map(([p, s]) => [p, s!.default])
    ),
    content,
  };
}

export function getInitStore(): PluginModel {
  return {
    // configuration: {
    page: {
      height: '297mm',
      width: '210mm',
      top: '20mm',
      outside: '20mm',
      bottom: '20mm',
      inside: '20mm',
    },
    header: {
      odd: getHeaderFooterDefault([
        { kind: HeaderFooterType.FIELD, value: Autogenerated.TITLE },
      ]),
      even: getHeaderFooterDefault([
        { kind: HeaderFooterType.FIELD, value: Autogenerated.TITLE },
      ]),
    },
    footer: {
      odd: getHeaderFooterDefault([
        { kind: HeaderFooterType.FIELD, value: Autogenerated.FOLIO },
      ]),
      even: getHeaderFooterDefault([
        { kind: HeaderFooterType.FIELD, value: Autogenerated.FOLIO },
      ]),
    },
    style: getInitStyle(),
    formatter: Formatter.FOP,
    // override_shell: true,
    page_mirror_margins: false,
    blank_pages: false,
    body_column_count: 1,
    index_column_count: 2,
    column_gap: '12pt',
    // title_numbering: true,
    force_page_count: 'even',
    chapter_layout: 'BASIC',
    cover_image_metadata: 'cover-image',
    cover_image_topic: '',
    bookmark_style: 'COLLAPSED',
    style_toc_maximum_level: 4,
    task_label: false,
    include_related_links: 'none',
    table_continued: false,
    page_number: 'page',
    // },
    ot_version: '3.6',
    id: '',
    plugin_name: '',
    plugin_version: '',
    transtype: '',
  };
}

export function reduce(store: any, action: any): any {
  return _.merge(store, action.value);
}
