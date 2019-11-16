import { isEqual, keys, mapValues } from 'lodash';
import { Connection, createConnection, MysqlError } from 'mysql';
import { parse as urlParse } from 'url';
import { Options } from './options';
import { Database, ITable } from './schemaInterfaces';

export class MysqlDatabase implements Database {
  private db: Connection;
  private readonly defaultSchema: string;

  constructor(public connectionString: string) {
    this.db = createConnection(connectionString);
    const url = urlParse(connectionString, true);
    this.defaultSchema = url && url.pathname ? url.pathname.substr(1) : 'public';
  }

  // uses the type mappings from https://github.com/mysqljs/ where sensible
  private static mapTableDefinitionToType(
    tableDefinition: ITable,
    customTypes: string[],
    options: Options
  ): ITable {
    if (!options) {
      throw new Error('No options given');
    }

    tableDefinition.columns = mapValues(tableDefinition.columns, column => {
      switch (column.udtName) {
        case 'char':
        case 'varchar':
        case 'text':
        case 'tinytext':
        case 'mediumtext':
        case 'longtext':
        case 'time':
        case 'geometry':
        case 'set':
        case 'enum':
          // keep set and enum defaulted to string if custom type not mapped
          column.tsType = 'string';
          return column;
        case 'integer':
        case 'int':
        case 'smallint':
        case 'mediumint':
        case 'bigint':
        case 'double':
        case 'decimal':
        case 'numeric':
        case 'float':
        case 'year':
          column.tsType = 'number';
          return column;
        case 'tinyint':
          column.tsType = 'boolean';
          return column;
        case 'json':
          column.tsType = 'Object';
          return column;
        case 'date':
        case 'datetime':
        case 'timestamp':
          column.tsType = 'Date';
          return column;
        case 'tinyblob':
        case 'mediumblob':
        case 'longblob':
        case 'blob':
        case 'binary':
        case 'varbinary':
        case 'bit':
          column.tsType = 'Buffer';
          return column;
        default:
          if (customTypes.includes(column.udtName)) {
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

  private static parseMysqlEnumeration(mysqlEnum: string): string[] {
    return mysqlEnum
      .replace(/(^(enum|set)\('|'\)$)/gi, '')
      .split(`','`)
      .sort();
  }

  private static getEnumNameFromColumn(dataType: string, columnName: string): string {
    return `${columnName}_${dataType}`;
  }

  public query<T = object>(queryString: string) {
    return this.queryAsync<T>(queryString);
  }

  public async getEnumTypes(
    schema?: string,
    tables: string[] = []
  ): Promise<{ [key: string]: string[] }> {
    let additionWhereClause: string = '';
    const params: string[] = [];
    if (schema) {
      additionWhereClause = `and table_schema = ? `;
      params.push(schema);
    }

    if (tables.length > 0) {
      additionWhereClause = `and table_name in (${tables.map(_ => '?').join(',')}) `;
      params.push(...tables);
    }

    const rawEnumRecords = await this.queryAsync<{
      column_name: string;
      column_type: string;
      data_type: string;
    }>(
      'SELECT column_name, column_type, data_type ' +
        'FROM information_schema.columns ' +
        `WHERE data_type IN ('enum', 'set') ${additionWhereClause}ORDER BY column_name`,
      params
    );

    return rawEnumRecords.reduce((enums, enumItem) => {
      const enumName = MysqlDatabase.getEnumNameFromColumn(
        enumItem.data_type,
        enumItem.column_name
      );
      const enumValues = MysqlDatabase.parseMysqlEnumeration(enumItem.column_type);

      if (enums[enumName] && !isEqual(enums[enumName], enumValues)) {
        const errorMsg =
          `Multiple enums with the same name and contradicting types were found: ` +
          `${enumItem.column_name}: ${JSON.stringify(enums[enumName])} and ${JSON.stringify(
            enumValues
          )}`;
        throw new Error(errorMsg);
      }

      enums[enumName] = enumValues;

      return enums;
    }, {} as any);
  }

  public async getTablesDefinition(tableNames: string[], tableSchema: string): Promise<ITable[]> {
    const tableColumns = await this.queryAsync<{
      table_name: string;
      column_name: string;
      data_type: string;
      is_nullable: 'YES' | 'NO';
    }>(
      'SELECT table_name, column_name, data_type, is_nullable ' +
        'FROM information_schema.columns ' +
        'WHERE table_schema = ? and ' +
        `table_name IN (${tableNames.map(_ => '?').join(',')}) ` +
        'ORDER BY table_name, column_name',
      [tableSchema, ...tableNames]
    );

    const tablesMap = tableColumns.reduce(
      (result, { table_name, column_name, data_type, is_nullable }) => {
        result[table_name] = result[table_name] || {
          name: table_name,
          columns: {},
        };

        const table = result[table_name];

        table.columns[column_name] = {
          udtName: /^(enum|set)$/i.test(data_type)
            ? MysqlDatabase.getEnumNameFromColumn(data_type, column_name)
            : data_type,
          nullable: is_nullable === 'YES',
          tsType: '',
        };

        return result;
      },
      ({} as unknown) as { [tableName: string]: ITable }
    );

    return Object.values(tablesMap);
  }

  public async getTablesTypes(
    tableNames: string[],
    tableSchema: string,
    options: Options
  ): Promise<ITable[]> {
    const enumTypes = await this.getEnumTypes(tableSchema);
    const customTypes = keys(enumTypes);

    const tableDefinitions = await this.getTablesDefinition(tableNames, tableSchema);

    return tableDefinitions.map(table =>
      MysqlDatabase.mapTableDefinitionToType(table, customTypes, options)
    );
  }

  public async getSchemaTables(schemaName: string): Promise<string[]> {
    const schemaTables = await this.queryAsync<{ table_name: string }>(
      'SELECT table_name ' +
        'FROM information_schema.columns ' +
        'WHERE table_schema = ? ' +
        'GROUP BY table_name ORDER BY table_name',
      [schemaName]
    );
    return schemaTables.map(({ table_name }) => table_name);
  }

  public getDefaultSchema(): string {
    return this.defaultSchema;
  }

  private queryAsync<T = object>(queryString: string, escapedValues?: string[]): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db.query(queryString, escapedValues, (error: MysqlError, results: T[]) => {
        if (error) {
          return reject(error);
        }
        return resolve(this.toLowerCaseColumnName<T>(results));
      });
    });
  }

  private toLowerCaseColumnName<T>(results: T[]): T[] {
    return results.map((row: any) =>
      Object.keys(row).reduce((newRow, key) => {
        newRow[key.toLowerCase()] = row[key];
        return newRow;
      }, {} as any)
    );
  }
}
