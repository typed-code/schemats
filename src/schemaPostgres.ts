import { keys, mapValues } from 'lodash';
import * as PgPromise from 'pg-promise';
import { Options } from './options';

import { Database, ITable } from './schemaInterfaces';

const pgp = PgPromise();

export class PostgresDatabase implements Database {
  private db: PgPromise.IDatabase<{}>;

  constructor(public connectionString: string) {
    this.db = pgp(connectionString);
  }

  private static mapTableDefinitionToType(
    tableDefinition: ITable,
    customTypes: string[],
    options: Options
  ): ITable {
    tableDefinition.columns = mapValues(tableDefinition.columns, column => {
      switch (column.udtName) {
        case 'bpchar':
        case 'char':
        case 'varchar':
        case 'text':
        case 'citext':
        case 'uuid':
        case 'bytea':
        case 'inet':
        case 'time':
        case 'timetz':
        case 'interval':
        case 'name':
          column.tsType = 'string';
          return column;
        case 'int2':
        case 'int4':
        case 'int8':
        case 'float4':
        case 'float8':
        case 'numeric':
        case 'money':
        case 'oid':
          column.tsType = 'number';
          return column;
        case 'bool':
          column.tsType = 'boolean';
          return column;
        case 'json':
        case 'jsonb':
          column.tsType = 'Object';
          return column;
        case 'date':
        case 'timestamp':
        case 'timestamptz':
          column.tsType = 'Date';
          return column;
        case '_int2':
        case '_int4':
        case '_int8':
        case '_float4':
        case '_float8':
        case '_numeric':
        case '_money':
          column.tsType = 'Array<number>';
          return column;
        case '_bool':
          column.tsType = 'Array<boolean>';
          return column;
        case '_varchar':
        case '_text':
        case '_citext':
        case '_uuid':
        case '_bytea':
          column.tsType = 'Array<string>';
          return column;
        case '_json':
        case '_jsonb':
          column.tsType = 'Array<Object>';
          return column;
        case '_timestamptz':
          column.tsType = 'Array<Date>';
          return column;
        default:
          if (customTypes.indexOf(column.udtName) !== -1) {
            column.tsType = options.transformTypeName(column.udtName);
            return column;
          } else {
            // tslint:disable-next-line
            console.log(
              `Type '${column.udtName}' has been mapped to 'any' because no specific type has been found.`
            );
            column.tsType = 'any';
            return column;
          }
      }
    });
    return tableDefinition;
  }

  public query(queryString: string) {
    return this.db.query(queryString);
  }

  public async getEnumTypes(
    schema?: string,
    tables: string[] = []
  ): Promise<{ [key: string]: string[] }> {
    interface T {
      name: string;
      value: any;
    }

    const enums: any = {};
    const enumSchemaWhereClause = schema ? pgp.as.format(`where n.nspname = $1`, schema) : '';
    await this.db.each<T>(
      'select n.nspname as schema, t.typname as name, e.enumlabel as value ' +
        'from pg_type t ' +
        'join pg_enum e on t.oid = e.enumtypid ' +
        'join pg_catalog.pg_namespace n ON n.oid = t.typnamespace ' +
        `${enumSchemaWhereClause} ` +
        'order by t.typname asc, e.enumlabel asc;',
      [],
      (item: T) => {
        if (!enums[item.name]) {
          enums[item.name] = [];
        }
        enums[item.name].push(item.value);
      }
    );
    return enums;
  }

  public async getTablesDefinition(tableNames: string[], tableSchema: string): Promise<ITable[]> {
    interface T {
      table_name: string;
      column_name: string;
      udt_name: string;
      is_nullable: string;
    }

    const tablesMap: { [tableName: string]: ITable } = {};

    await this.db.each<T>(
      'SELECT table_name, column_name, udt_name, is_nullable ' +
        'FROM information_schema.columns ' +
        'WHERE table_schema = $1 and table_name IN ($2:csv) ' +
        'ORDER BY table_name, column_name',
      [tableSchema, tableNames],
      (schemaItem: T) => {
        tablesMap[schemaItem.table_name] = tablesMap[schemaItem.table_name] || {
          name: schemaItem.table_name,
          columns: {},
        };
        const table = tablesMap[schemaItem.table_name];

        table.columns[schemaItem.column_name] = {
          udtName: schemaItem.udt_name,
          nullable: schemaItem.is_nullable === 'YES',
          tsType: '',
        };
      }
    );

    return Object.values(tablesMap);
  }

  public async getTablesTypes(
    tableNames: string[],
    tableSchema: string,
    options: Options
  ): Promise<ITable[]> {
    const enumTypes = await this.getEnumTypes();
    const customTypes = keys(enumTypes);
    const tableDefinitions = await this.getTablesDefinition(tableNames, tableSchema);

    return tableDefinitions.map(table =>
      PostgresDatabase.mapTableDefinitionToType(table, customTypes, options)
    );
  }

  public async getSchemaTables(schemaName: string): Promise<string[]> {
    return this.db.map<string>(
      'SELECT table_name ' +
        'FROM information_schema.columns ' +
        'WHERE table_schema = $1 ' +
        'GROUP BY table_name ORDER BY table_name',
      [schemaName],
      (schemaItem: { table_name: string }) => schemaItem.table_name
    );
  }

  public getDefaultSchema(): string {
    return 'public';
  }
}
