import _ from 'lodash';
import { styles, Property, Style, StyleName } from '../lib/styles';

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
    const v = styles[field][property];
    if (!!v.default) {
      return v.default;
    } else if (!!v.inherit) {
      return getDefault(v.inherit, property);
    } else {
      // throw new Error(`Unable to find default for ${field}.${property}`)
      return undefined;
    }
  }
}

type Model = {
  configuration: {
    page: {};
    header: {
      odd: [];
      even: [];
    };
    footer: {
      odd: [];
      even: [];
    };
    style: Record<string, Record<Property, Style>>;
  };
};

export function getInitStore(): Model {
  return {
    configuration: {
      page: {},
      header: {
        odd: [],
        even: [],
      },
      footer: {
        odd: [],
        even: [],
      },
      style: getInitStyle(),
    },
  };
}

export function reduce(store: any, action: any): any {
  return _.merge(store, action.value);
}
