/**
 * Generate typescript interface from table schema
 * Created by xiamx on 2016-08-10.
 */

import * as _ from 'lodash';

import Options from './options';
import { TableDefinition } from './schemaInterfaces';

function nameIsReservedKeyword(name: string): boolean {
  const reservedKeywords = ['string', 'number', 'package'];
  return reservedKeywords.indexOf(name) !== -1;
}

function normalizeName(name: string, options: Options): string {
  return nameIsReservedKeyword(name) ? name + '_' : name;
}

export function generateTableInterface(
  tableNameRaw: string,
  tableDefinition: TableDefinition,
  options: Options
) {
  const tableName = options.transformTypeName(tableNameRaw);

  const members = Object.keys(tableDefinition)
    .map(c => options.transformColumnName(c))
    .reduce((result, columnName) => {
      result.push(`${columnName}: ${tableName}Fields.${normalizeName(columnName, options)};`);

      return result;
    }, [] as string[]);

  return `
  export interface ${normalizeName(tableName, options)} {
    ${members.join('\n    ')}
  }
`;
}

export function generateEnumType(enumObject: { [key: string]: string[] }, options: Options) {
  const enums = Object.entries(enumObject);
  return (
    enums
      .reduce((result, [enumNameRaw, values]) => {
        const enumName = options.transformTypeName(enumNameRaw);
        result.push(`export type ${enumName} = ${values.map(v => `'${v}'`).join(' | ')};`);

        return result;
      }, [] as string[])
      .join('\n') + (enums.length ? '\n' : '')
  );
}

export function generateTableTypes(
  tableNameRaw: string,
  tableDefinition: TableDefinition,
  options: Options
) {
  const tableName = options.transformTypeName(tableNameRaw);

  const fields = Object.entries(tableDefinition).reduce((result, [columnNameRaw, definition]) => {
    const type = definition.tsType;
    const nullable = definition.nullable ? ' | null' : '';
    const columnName = options.transformColumnName(columnNameRaw);
    result.push(`export type ${normalizeName(columnName, options)} = ${type}${nullable};`);
    return result;
  }, [] as string[]);

  return `
  export namespace ${tableName}Fields {
    ${fields.join('\n    ')}
  }
`;
}
