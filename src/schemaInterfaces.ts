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

export interface Database {
  connectionString: string;

  query(queryString: string): Promise<object[]>;

  getDefaultSchema(): string;

  getEnumTypes(schema?: string, tables?: string[]): Promise<{ [key: string]: string[] }>;

  getTablesDefinition(tableNames: string[], tableSchema: string): Promise<ITable[]>;

  getTablesTypes(tableName: string[], tableSchema: string, options: Options): Promise<ITable[]>;

  getSchemaTables(schemaName: string): Promise<string[]>;
}
