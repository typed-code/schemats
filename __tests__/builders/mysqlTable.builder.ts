type ColumnDataType =
  | 'bigint'
  | 'varchar'
  | 'timestamp'
  | 'blob'
  | 'int'
  | 'text'
  | 'enum'
  | 'mediumtext'
  | 'longtext'
  | 'json'
  | 'datetime'
  | 'set'
  | 'binary'
  | 'tinyint'
  | 'decimal'
  | 'char'
  | 'double'
  | 'longblob'
  | 'smallint'
  | 'mediumblob'
  | 'time'
  | 'float'
  | 'date'
  | 'bit'
  | 'geometry'
  | 'mediumint'
  | 'tinyblob'
  | 'tinytext'
  | 'varbinary'
  | 'year';

export interface IColumn {
  column_name: string;
  data_type: ColumnDataType;
  is_nullable: 'YES' | 'NO';
  column_type?: string;
}

export interface ITable {
  name: string;
  columns: IColumn[];
}

export class MysqlTableBuilder {
  private data: ITable = {
    name: '',
    columns: [],
  };

  public with = {
    column: (
      name: string,
      type: ColumnDataType,
      isNullable: boolean = false
    ): MysqlTableBuilder => {
      this.data.columns.push({
        column_name: name,
        data_type: type,
        is_nullable: isNullable ? 'YES' : 'NO',
      });
      return this;
    },
    enum: (name: string, values: string[], isNullable: boolean = false): MysqlTableBuilder => {
      this.data.columns.push({
        column_name: name,
        data_type: 'enum',
        is_nullable: isNullable ? 'YES' : 'NO',
        column_type: `enum('${values.join(`','`)}')`,
      });
      return this;
    },
  };

  constructor(tableName: string) {
    this.data.name = tableName;
  }

  public build(): ITable {
    return this.data;
  }
}

export const aUsersTable = new MysqlTableBuilder('users').with
  .column('id', 'int')
  .with.column('username', 'varchar')
  .with.column('signup_date', 'datetime')
  .with.column('is_active', 'tinyint')
  .with.column('comments', 'text', true)
  .with.enum('rank', ['admin', 'moderator'])
  .build();

export const aProductsTable = new MysqlTableBuilder('products').with
  .column('id', 'int')
  .with.column('name', 'varchar')
  .with.column('price', 'float')
  .with.enum('type', ['digital', 'physical'])
  .build();
