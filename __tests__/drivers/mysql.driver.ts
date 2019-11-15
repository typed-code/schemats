import * as mysql from 'mysql';
import { IColumn, ITable } from '../builders/mysqlTable.builder';

export class MysqlDriver {
  private schemas: { [key: string]: { [key: string]: ITable } } = {};
  public given = {
    table: (schemaName: string, table: ITable): MysqlDriver => {
      this.schemas[schemaName] = this.schemas[schemaName] || {};
      this.schemas[schemaName][table.name] = table;
      return this;
    },
  };
  private db: mysql.Connection;

  constructor() {
    (mysql as any).enableStub();
    this.db = mysql.createConnection('');
    (this.db as any).mysqlStub.query.mockImplementation(this.handleQuery.bind(this));
  }

  private handleQuery(query: string, params: any[], cb: (error: any, results?: any[]) => void) {
    if (query.includes(`WHERE data_type IN ('enum', 'set')`)) {
      cb(null, this.getAllEnums(params));
    } else if (query.includes(`WHERE table_name = ? and table_schema = ?`)) {
      cb(null, this.getTableColumns(params[0], params[1]));
    } else if (query.includes('SELECT table_name')) {
      cb(null, this.getSchemaTables(params[0]));
    } else {
      cb(new Error(`Unsupported query: '${query}'`));
    }
  }

  private getAllEnums([schemaName, ...tableNames]: string[]): IColumn[] {
    return Object.entries(this.schemas)
      .filter(([schemaKey]) => (schemaName && schemaKey === schemaName) || !schemaName)
      .reduce((tables, [x, schema]) => tables.concat(Object.values(schema)), [] as ITable[])
      .filter(table => tableNames.length === 0 || tableNames.includes(table.name))
      .reduce(
        (rows, table) =>
          rows.concat(table.columns.filter(c => c.data_type === 'enum' || c.data_type === 'set')),
        [] as any
      );
  }

  private getTableColumns(tableName: string, schemaName: string) {
    return this.schemas[schemaName][tableName].columns;
  }

  private getSchemaTables(schemaName: string) {
    return Object.keys(this.schemas[schemaName]).map(tableName => ({ table_name: tableName }));
  }
}
