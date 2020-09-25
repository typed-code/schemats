/**
 * Schemats takes sql database schema and creates corresponding typescript definitions
 * Created by xiamx on 2016-08-10.
 */

import * as pkgUp from 'pkg-up';
import * as prettier from 'prettier';
import { Options, OptionValues } from './options';
import { Database, getDatabase } from './schema';
import { generateEnumType, generateTableInterface, generateTableTypes } from './typescript';

const pkgPath = pkgUp.sync();
const pkgVersion = pkgPath ? require(pkgPath).version : 'UNKNOWN';

function getTime() {
  const padTime = (value: number) => `0${value}`.slice(-2);
  const time = new Date();
  const yyyy = time.getFullYear();
  const MM = padTime(time.getMonth() + 1);
  const dd = padTime(time.getDate());
  const hh = padTime(time.getHours());
  const mm = padTime(time.getMinutes());
  const ss = padTime(time.getSeconds());
  return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
}

function buildHeader(
  db: Database,
  tables: string[],
  schema: string | null,
  options: OptionValues
): string {
  const commands = [
    'schemats',
    'generate',
    '-c',
    db.connectionString.replace(/:\/\/.*@/, '://username:password@'),
  ];
  if (options.camelCase) {
    commands.push('-C');
  }
  if (tables.length > 0) {
    tables.forEach((t: string) => {
      commands.push('-t', t);
    });
  }
  if (schema) {
    commands.push('-s', schema);
  }

  return `
  /**
  * AUTO-GENERATED FILE @ ${getTime()} - DO NOT EDIT!
  *
  * This file was automatically generated by schemats v.${pkgVersion}
  * $ ${commands.join(' ')}
  *
  */

`;
}

async function typescriptOfTable(
  db: Database | string,
  tables: string[],
  schema: string,
  options = new Options(),
  userCustomOverrides: Record<string, Record<string, string>>
): Promise<string[]> {
  if (typeof db === 'string') {
    db = getDatabase(db);
  }

  const enums = await db.getEnumTypes(schema, tables);
  const enumTypes = generateEnumType(enums, options);

  const tableTypes = await db.getTablesTypes(tables, schema, enums, options);
  const tableInterfaces = tableTypes.map((tableType) => {
    let interfaces = generateTableTypes(tableType, options, userCustomOverrides);
    interfaces += generateTableInterface(tableType, options);
    return interfaces;
  });

  return ([] as string[]).concat(enumTypes, tableInterfaces);
}

export async function typescriptOfSchema(
  db: Database | string,
  tables: string[] = [],
  schema: string | null = null,
  userOptions: OptionValues = {},
  userCustomOverrides: Record<string, Record<string, string>> = {}
): Promise<string> {
  if (typeof db === 'string') {
    db = getDatabase(db);
  }

  if (!schema) {
    schema = db.getDefaultSchema();
  }

  if (tables.length === 0) {
    tables = await db.getSchemaTables(schema);
  }

  const options = new Options(userOptions);

  const interfaces = await typescriptOfTable(db, tables, schema, options, userCustomOverrides);

  let output = '/* tslint:disable */\n\n';
  if (options.options.writeHeader) {
    output += buildHeader(db, tables, schema, options.options);
  }

  output += interfaces.join('\n');

  const configFilePath = await prettier.resolveConfigFile();
  const prettierOptions = await prettier.resolveConfig(configFilePath || '');
  return prettier.format(output, { ...prettierOptions, parser: 'typescript' });
}

export { Database, getDatabase } from './schema';
export { Options, OptionValues };
