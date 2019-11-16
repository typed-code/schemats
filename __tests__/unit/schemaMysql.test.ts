import * as mysql from 'mysql';
import { Options } from '../../src/options';
import { ITable } from '../../src/schemaInterfaces';
import { MysqlDatabase } from '../../src/schemaMysql';

const options = new Options({});

const MysqlDBReflection = MysqlDatabase as any;

describe('MysqlDatabase', () => {
  let db: any;
  let mysqlProxy: MysqlDatabase;
  let spies: any;

  beforeAll(() => {
    db = mysql.createConnection('');
    mysqlProxy = new MysqlDatabase('mysql://user:password@localhost/test');
  });

  beforeEach(() => {
    db.resetMocks();
  });

  describe('query', () => {
    it('query calls query async', async () => {
      db.mysqlStub.withResults([]);

      await mysqlProxy.query('SELECT * FROM test_table');

      expect(db.mysqlStub.query).toHaveBeenCalledWith(
        'SELECT * FROM test_table',
        undefined,
        expect.any(Function)
      );
    });
  });

  describe('queryAsync', () => {
    it('query has error', async () => {
      db.mysqlStub.withError('ERROR');

      const testDb: any = new MysqlDatabase('mysql://user:password@localhost/test');
      try {
        await testDb.query('SELECT * FROM test_table');
      } catch (e) {
        expect(e).toEqual('ERROR');
      }
    });

    it('query returns with results', async () => {
      db.mysqlStub.withResults([]);

      const testDb: any = new MysqlDatabase('mysql://user:password@localhost/test');
      const results = await testDb.query('SELECT * FROM test_table');
      expect(results).toEqual([]);
    });

    it('query returns results with columns as lower-case', async () => {
      db.mysqlStub.withResults([
        { COLUMN_1: 'val1', COLUMN_2: 'val1' },
        { COLUMN_1: 'val2', COLUMN_2: 'val2' },
      ]);

      const testDb: any = new MysqlDatabase('mysql://user:password@localhost/test');
      const results = await testDb.query('SELECT * FROM test_table');
      expect(results).toEqual([
        { column_1: 'val1', column_2: 'val1' },
        { column_1: 'val2', column_2: 'val2' },
      ]);
    });
  });

  describe('getEnumTypes', () => {
    it('writes correct query with schema name', async () => {
      db.mysqlStub.withResults([]);

      await mysqlProxy.getEnumTypes('testschema');
      expect(db.mysqlStub.query).toHaveBeenCalledWith(
        'SELECT column_name, column_type, data_type ' +
          'FROM information_schema.columns ' +
          `WHERE data_type IN ('enum', 'set') and table_schema = ? ORDER BY column_name`,
        ['testschema'],
        expect.any(Function)
      );
    });

    it('writes correct query without schema name', async () => {
      db.mysqlStub.withResults([]);

      await mysqlProxy.getEnumTypes();
      expect(db.mysqlStub.query).toHaveBeenCalledWith(
        'SELECT column_name, column_type, data_type ' +
          'FROM information_schema.columns ' +
          `WHERE data_type IN ('enum', 'set') ORDER BY column_name`,
        [],
        expect.any(Function)
      );
    });

    it('handles response', async () => {
      db.mysqlStub.withResults([
        { column_name: 'column1', column_type: `enum('enum1')`, data_type: 'enum' },
        { column_name: 'column2', column_type: `set('set1')`, data_type: 'set' },
      ]);

      const enumTypes = await mysqlProxy.getEnumTypes('testschema');
      expect(enumTypes).toEqual({
        column1_enum: ['enum1'],
        column2_set: ['set1'],
      });
    });

    it('same column same value is accepted', async () => {
      db.mysqlStub.withResults([
        { column_name: 'column1', column_type: `enum('enum1','enum2')`, data_type: 'enum' },
        { column_name: 'column1', column_type: `enum('enum1','enum2')`, data_type: 'enum' },
      ]);

      const enumTypes = await mysqlProxy.getEnumTypes('testschema');
      expect(enumTypes).toEqual({
        column1_enum: ['enum1', 'enum2'],
      });
    });

    it('same column different value conflict', async () => {
      db.mysqlStub.withResults([
        { column_name: 'column1', column_type: `enum('enum1')`, data_type: 'enum' },
        { column_name: 'column1', column_type: `enum('enum2')`, data_type: 'enum' },
      ]);

      try {
        await mysqlProxy.getEnumTypes('testschema');
      } catch (e) {
        expect(e.message).toEqual(
          'Multiple enums with the same name and contradicting types were found: column1: ["enum1"] and ["enum2"]'
        );
      }
    });
  });

  describe('getTablesDefinitions', () => {
    it('writes correct query', async () => {
      db.mysqlStub.withResults([]);

      await mysqlProxy.getTablesDefinition(['testtable'], 'testschema');
      expect(db.mysqlStub.query).toHaveBeenCalledWith(
        'SELECT table_name, column_name, data_type, is_nullable ' +
          'FROM information_schema.columns ' +
          'WHERE table_schema = ? and table_name IN (?) ORDER BY table_name, column_name',
        ['testschema', 'testtable'],
        expect.any(Function)
      );
    });

    it('handles response', async () => {
      db.mysqlStub.withResults([
        { table_name: 'testtable', column_name: 'column1', data_type: 'data1', is_nullable: 'NO' },
        { table_name: 'testtable', column_name: 'column2', data_type: 'enum', is_nullable: 'YES' },
        { table_name: 'testtable', column_name: 'column3', data_type: 'set', is_nullable: 'YES' },
      ]);

      const schemaTables = await mysqlProxy.getTablesDefinition(['testtable'], 'testschema');
      expect(schemaTables).toEqual([
        {
          name: 'testtable',
          columns: {
            column1: { udtName: 'data1', nullable: false, tsType: '' },
            column2: { udtName: 'column2_enum', nullable: true, tsType: '' },
            column3: { udtName: 'column3_set', nullable: true, tsType: '' },
          },
        },
      ]);
    });
  });

  describe('getTablesTypes', () => {
    beforeEach(() => {
      spies = {
        getEnumTypes: jest.spyOn(MysqlDatabase.prototype, 'getEnumTypes'),
        getTablesDefinition: jest.spyOn(MysqlDatabase.prototype, 'getTablesDefinition'),
        mapTableDefinitionToType: jest.spyOn(MysqlDBReflection, 'mapTableDefinitionToType'),
      };
    });

    afterEach(() => {
      Object.values(spies).forEach((fn: any) => fn.mockRestore());
    });

    it('gets custom types from enums', async () => {
      (MysqlDatabase as any).prototype.getEnumTypes.mockReturnValue(
        Promise.resolve({
          enum1: [],
          enum2: [],
        })
      );
      (MysqlDatabase as any).prototype.getTablesDefinition.mockReturnValue(Promise.resolve([{}]));

      await mysqlProxy.getTablesTypes(['tableName'], 'tableSchema', options);
      expect(MysqlDBReflection.mapTableDefinitionToType).toHaveBeenCalledWith(
        { columns: {} },
        ['enum1', 'enum2'],
        expect.any(Object)
      );
    });

    it('gets table definitions', async () => {
      (MysqlDatabase as any).prototype.getEnumTypes.mockReturnValue(Promise.resolve({}));
      (MysqlDatabase as any).prototype.getTablesDefinition.mockReturnValue(
        Promise.resolve([
          {
            name: 'tableName',
            columns: {
              table: {
                udtName: 'name',
                nullable: false,
              },
            },
          },
        ])
      );
      await mysqlProxy.getTablesTypes(['tableName'], 'tableSchema', options);
      expect(MysqlDBReflection.prototype.getTablesDefinition).toHaveBeenCalledWith(
        ['tableName'],
        'tableSchema'
      );
      expect(MysqlDBReflection.mapTableDefinitionToType).toHaveBeenCalledWith(
        {
          name: 'tableName',
          columns: {
            table: {
              udtName: 'name',
              nullable: false,
              tsType: 'any',
            },
          },
        },
        [],
        expect.any(Object)
      );
    });
  });

  describe('getSchemaTables', () => {
    it('writes correct query', async () => {
      db.mysqlStub.withResults([]);

      await mysqlProxy.getSchemaTables('testschema');
      expect(db.mysqlStub.query).toHaveBeenCalledWith(
        'SELECT table_name ' +
          'FROM information_schema.columns ' +
          'WHERE table_schema = ? ' +
          'GROUP BY table_name ORDER BY table_name',
        ['testschema'],
        expect.any(Function)
      );
    });

    it('handles table response', async () => {
      db.mysqlStub.withResults([{ table_name: 'table1' }, { table_name: 'table2' }]);

      const schemaTables = await mysqlProxy.getSchemaTables('testschema');
      expect(schemaTables).toEqual(['table1', 'table2']);
    });
  });

  describe('mapTableDefinitionToType', () => {
    describe('maps to string', () => {
      [
        'char',
        'varchar',
        'text',
        'tinytext',
        'mediumtext',
        'longtext',
        'time',
        'geometry',
        'set',
        'enum',
      ].forEach(type =>
        it(type, () => {
          const td: ITable = {
            name: 'tableName',
            columns: {
              column: {
                udtName: type,
                nullable: false,
                tsType: '',
              },
            },
          };
          expect(
            MysqlDBReflection.mapTableDefinitionToType(td, [], options).columns.column.tsType
          ).toEqual('string');
        })
      );
    });

    describe('maps to number', () => {
      [
        'integer',
        'int',
        'smallint',
        'mediumint',
        'bigint',
        'double',
        'decimal',
        'numeric',
        'float',
        'year',
      ].forEach(type =>
        it(type, () => {
          const td: ITable = {
            name: 'tableName',
            columns: {
              column: {
                udtName: type,
                nullable: false,
                tsType: '',
              },
            },
          };
          expect(
            MysqlDBReflection.mapTableDefinitionToType(td, [], options).columns.column.tsType
          ).toEqual('number');
        })
      );
    });

    describe('maps to boolean', () => {
      it('tinyint', () => {
        const td: ITable = {
          name: 'tableName',
          columns: {
            column: {
              udtName: 'tinyint',
              nullable: false,
              tsType: '',
            },
          },
        };
        expect(
          MysqlDBReflection.mapTableDefinitionToType(td, [], options).columns.column.tsType
        ).toEqual('boolean');
      });
    });

    describe('maps to Object', () => {
      it('json', () => {
        const td: ITable = {
          name: 'tableName',
          columns: {
            column: {
              udtName: 'json',
              nullable: false,
              tsType: '',
            },
          },
        };
        expect(
          MysqlDBReflection.mapTableDefinitionToType(td, [], options).columns.column.tsType
        ).toEqual('Object');
      });
    });

    describe('maps to Date', () => {
      ['date', 'datetime', 'timestamp'].forEach(type =>
        it(type, () => {
          const td: ITable = {
            name: 'tableName',
            columns: {
              column: {
                udtName: type,
                nullable: false,
                tsType: '',
              },
            },
          };
          expect(MysqlDBReflection.mapTableDefinitionToType(td, [], options).columns.column.tsType).toEqual(
            'Date'
          );
        })
      );
    });

    describe('maps to Buffer', () => {
      ['tinyblob', 'mediumblob', 'longblob', 'blob', 'binary', 'varbinary', 'bit'].forEach(type =>
        it(type, () => {
          const td: ITable = {
            name: 'tableName',
            columns: {
              column: {
                udtName: type,
                nullable: false,
                tsType: '',
              },
            },
          };
          expect(MysqlDBReflection.mapTableDefinitionToType(td, [], options).columns.column.tsType).toEqual(
            'Buffer'
          );
        })
      );
    });

    describe('maps to custom', () => {
      it('CustomType', () => {
        const td: ITable = {
          name: 'tableName',
          columns: {
            column: {
              udtName: 'CustomType',
              nullable: false,
              tsType: '',
            },
          },
        };
        expect(
          MysqlDBReflection.mapTableDefinitionToType(td, ['CustomType'], options).columns.column.tsType
        ).toEqual('CustomType');
      });
    });

    describe('maps to any', () => {
      it('UnknownType', () => {
        const td: ITable = {
          name: 'tableName',
          columns: {
            column: {
              udtName: 'UnknownType',
              nullable: false,
              tsType: '',
            },
          },
        };
        expect(
          MysqlDBReflection.mapTableDefinitionToType(td, ['CustomType'], options).columns.column.tsType
        ).toEqual('any');
      });
    });
  });
});
