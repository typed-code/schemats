import { camelCase, upperFirst } from 'lodash';

const DEFAULT_OPTIONS: OptionValues = {
  writeHeader: true,
  camelCase: false,
};

export interface OptionValues {
  camelCase?: boolean;
  writeHeader?: boolean; // write schemats description header
}

export class Options {
  public options: OptionValues;

  constructor(options: OptionValues = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  public transformTypeName(typename: string) {
    return this.options.camelCase ? upperFirst(camelCase(typename)) : typename;
  }

  public transformColumnName(columnName: string) {
    return this.options.camelCase ? camelCase(columnName) : columnName;
  }
}
