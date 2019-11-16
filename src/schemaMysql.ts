import { isEqual, keys, mapValues } from 'lodash';
import { Connection, createConnection, MysqlError } from 'mysql';
import { parse as urlParse } from 'url';
import { Options } from './options';
import { Database, TableDefinition } from './schemaInterfaces';

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
    tableDefinition: TableDefinition,
    customTypes: string[],
    options: Options
  ): TableDefinition {
    if (!options) {
      throw new Error('No options given');
    }
    return mapValues(tableDefinition, column => {
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
  }

  private static parseMysqlEnumeration(mysqlEnum: string): string[] {
    return mysqlEnum.replace(/(^(enum|set)\('|'\)$)/gi, '').split(`','`);
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

  public async getTableDefinition(
    tableName: string,
    tableSchema: string
  ): Promise<TableDefinition> {
    const tableColumns = await this.queryAsync<{
      column_name: string;
      data_type: string;
      is_nullable: 'YES' | 'NO';
    }>(
      'SELECT column_name, data_type, is_nullable ' +
        'FROM information_schema.columns ' +
        'WHERE table_name = ? and table_schema = ? ORDER BY column_name',
      [tableName, tableSchema]
    );

    return tableColumns.reduce((result, { column_name, data_type, is_nullable }) => {
      result[column_name] = {
        udtName: /^(enum|set)$/i.test(data_type)
          ? MysqlDatabase.getEnumNameFromColumn(data_type, column_name)
          : data_type,
        nullable: is_nullable === 'YES',
        tsType: '',
      };

      return result;
    }, ({} as unknown) as TableDefinition);
  }

  public async getTableTypes(tableName: string, tableSchema: string, options: Options) {
    const enumTypes = await this.getEnumTypes(tableSchema);
    const customTypes = keys(enumTypes);

    return MysqlDatabase.mapTableDefinitionToType(
      await this.getTableDefinition(tableName, tableSchema),
      customTypes,
      options
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

  public queryAsync<T = object>(queryString: string, escapedValues?: string[]): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db.query(queryString, escapedValues, (error: MysqlError, results: T[]) => {
        if (error) {
          return reject(error);
        }
        return resolve(this.toLowerCaseColumnName<T>(results));
      });
    });
  }

  public getDefaultSchema(): string {
    return this.defaultSchema;
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
