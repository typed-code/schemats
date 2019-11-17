import { Options } from './options';

export interface ColumnDefinition {
  udtName: string;
  nullable: boolean;
  tsType: string;
}

export interface TableDefinition {
  [columnName: string]: ColumnDefinition;
}

export interface ITable {
  name: string;
  columns: TableDefinition;
}

export interface ICustomTypes {
  [key: string]: string[];
}

export interface Database {
  connectionString: string;

  query(queryString: string): Promise<object[]>;

  getDefaultSchema(): string;

  getEnumTypes(schema?: string, tables?: string[]): Promise<ICustomTypes>;

  getTablesDefinition(
    tableNames: string[],
    tableSchema: string,
    customTypes: ICustomTypes
  ): Promise<ITable[]>;

  getTablesTypes(
    tableName: string[],
    tableSchema: string,
    customTypes: ICustomTypes,
    options: Options
  ): Promise<ITable[]>;

  getSchemaTables(schemaName: string): Promise<string[]>;
}
