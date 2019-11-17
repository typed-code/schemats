import * as pgp from 'pg-promise';
import { Options } from '../../src/options';
import { ITable } from '../../src/schemaInterfaces';
import { PostgresDatabase } from '../../src/schemaPostgres';

const options = new Options({});
const PostgresDBReflection = PostgresDatabase as any;

describe('PostgresDatabase', () => {
  let PostgresProxy: any;
  let db: any;

  beforeAll(() => {
    db = (pgp as any)(true);
    PostgresProxy = new PostgresDatabase('psgress://') as any;
  });

  beforeEach(() => {
    db.resetMocks();
  });

  describe('query', () => {
    it('calls postgres query', () => {
      PostgresProxy.query('SELECT * FROM TEST');
      expect(db.pgpStub.query).toHaveBeenCalledWith('SELECT * FROM TEST');
    });
  });

  describe('getEnumTypes', () => {
    it('writes correct query with schema name', async () => {
      await PostgresProxy.getEnumTypes('schemaName');
      expect(db.pgpStub.each).toHaveBeenCalledWith(
        'select n.nspname as schema, t.typname as name, e.enumlabel as value ' +
          'from pg_type t join pg_enum e on t.oid = e.enumtypid ' +
          'join pg_catalog.pg_namespace n ON n.oid = t.typnamespace ' +
          `where n.nspname = 'schemaName' ` +
          'order by t.typname asc, e.enumlabel asc;',
        [],
        expect.any(Function)
      );
    });

    it('writes correct query without schema name', async () => {
      await PostgresProxy.getEnumTypes();
      expect(db.pgpStub.each).toHaveBeenCalledWith(
        'select n.nspname as schema, t.typname as name, e.enumlabel as value ' +
          'from pg_type t join pg_enum e on t.oid = e.enumtypid ' +
          'join pg_catalog.pg_namespace n ON n.oid = t.typnamespace  ' +
          'order by t.typname asc, e.enumlabel asc;',
        [],
        expect.any(Function)
      );
    });

    it('handles response from db', async () => {
      const enums = await PostgresProxy.getEnumTypes();
      const callback = db.pgpStub.each.mock.calls[0][2];
      const dbResponse = [
        { name: 'name', value: 'value1' },
        { name: 'name', value: 'value2' },
      ];
      dbResponse.forEach(callback);
      expect(enums).toEqual({ name: ['value1', 'value2'] });
    });
  });

  describe('getTablesDefinition', () => {
    it('writes correct query', async () => {
      await PostgresProxy.getTablesDefinition(['tableName'], 'schemaName');
      expect(db.pgpStub.each).toHaveBeenCalledWith(
        'SELECT table_name, column_name, udt_name, is_nullable ' +
          'FROM information_schema.columns ' +
          'WHERE table_schema = $1 and table_name IN ($2:csv) ORDER BY table_name, column_name',
        ['schemaName', ['tableName']],
        expect.any(Function)
      );
    });

    it('handles response from db', async () => {
      db.withStubEachResults([
        { table_name: 'tableName', column_name: 'col1', udt_name: 'int2', is_nullable: 'YES' },
        { table_name: 'tableName', column_name: 'col2', udt_name: 'text', is_nullable: 'NO' },
      ]);

      const tableDefinition = await PostgresProxy.getTablesDefinition(['tableName'], 'schemaName');

      expect(tableDefinition).toEqual([
        {
          name: 'tableName',
          columns: {
            col1: { udtName: 'int2', nullable: true, tsType: '' },
            col2: { udtName: 'text', nullable: false, tsType: '' },
          },
        },
      ]);
    });
  });

  describe('getTablesTypes', () => {
    let spies: any;
    beforeEach(() => {
      spies = {
        getEnumTypes: jest.spyOn(PostgresProxy, 'getEnumTypes'),
        getTablesDefinition: jest.spyOn(PostgresProxy, 'getTablesDefinition'),
        mapTableDefinitionToType: jest.spyOn(PostgresDatabase as any, 'mapTableDefinitionToType'),
      };
    });

    afterEach(() => {
      Object.values(spies).forEach((fn: any) => fn.mockRestore());
    });

    it('gets custom types from enums', async () => {
      PostgresProxy.getTablesDefinition.mockReturnValue(Promise.resolve([{}]));
      await PostgresProxy.getTablesTypes(
        ['tableName'],
        'tableSchema',
        {
          enum1: [],
          enum2: [],
        },
        {} as any
      );
      expect(PostgresDBReflection.mapTableDefinitionToType).toHaveBeenCalledWith(
        { columns: {} },
        ['enum1', 'enum2'],
        expect.anything()
      );
    });
  });

  describe('getSchemaTables', () => {
    it('writes correct query', () => {
      PostgresProxy.getSchemaTables('schemaName');
      expect(db.pgpStub.map).toHaveBeenCalledWith(
        'SELECT table_name ' +
          'FROM information_schema.columns ' +
          'WHERE table_schema = $1 ' +
          'GROUP BY table_name ORDER BY table_name',
        ['schemaName'],
        expect.any(Function)
      );
    });

    it('handles response from db', async () => {
      await PostgresProxy.getSchemaTables();
      const callback = db.pgpStub.map.mock.calls[0][2];
      const dbResponse = [{ table_name: 'table1' }, { table_name: 'table2' }];
      const schemaTables = dbResponse.map(callback);

      expect(schemaTables).toEqual(['table1', 'table2']);
    });
  });

  describe('mapTableDefinitionToType', () => {
    describe('maps to string', () => {
      [
        'bpchar',
        'char',
        'varchar',
        'text',
        'citext',
        'uuid',
        'bytea',
        'inet',
        'time',
        'timetz',
        'interval',
        'name',
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
            PostgresDBReflection.mapTableDefinitionToType(td, [], options).columns.column.tsType
          ).toEqual('string');
        })
      );
    });

    describe('maps to number', () => {
      ['int2', 'int4', 'int8', 'float4', 'float8', 'numeric', 'money', 'oid'].forEach(type =>
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
            PostgresDBReflection.mapTableDefinitionToType(td, [], options).columns.column.tsType
          ).toEqual('number');
        })
      );
    });

    describe('maps to boolean', () => {
      it('bool', () => {
        const td: ITable = {
          name: 'tableName',
          columns: {
            column: {
              udtName: 'bool',
              nullable: false,
              tsType: '',
            },
          },
        };
        expect(
          PostgresDBReflection.mapTableDefinitionToType(td, [], options).columns.column.tsType
        ).toEqual('boolean');
      });
    });

    describe('maps to Object', () => {
      ['json', 'jsonb'].forEach(type =>
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
            PostgresDBReflection.mapTableDefinitionToType(td, [], options).columns.column.tsType
          ).toEqual('Object');
        })
      );
    });

    describe('maps to Date', () => {
      ['date', 'timestamp', 'timestamptz'].forEach(type =>
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
            PostgresDBReflection.mapTableDefinitionToType(td, [], options).columns.column.tsType
          ).toEqual('Date');
        })
      );
    });

    describe('maps to Array<number>', () => {
      ['_int2', '_int4', '_int8', '_float4', '_float8', '_numeric', '_money'].forEach(type =>
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
            PostgresDBReflection.mapTableDefinitionToType(td, [], options).columns.column.tsType
          ).toEqual('Array<number>');
        })
      );
    });

    describe('maps to Array<boolean>', () => {
      it('_bool', () => {
        const td: ITable = {
          name: 'tableName',
          columns: {
            column: {
              udtName: '_bool',
              nullable: false,
              tsType: '',
            },
          },
        };
        expect(
          PostgresDBReflection.mapTableDefinitionToType(td, ['CustomType'], options).columns.column
            .tsType
        ).toEqual('Array<boolean>');
      });
    });

    describe('maps to Array<string>', () => {
      ['_varchar', '_text', '_citext', '_uuid', '_bytea'].forEach(type =>
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
            PostgresDBReflection.mapTableDefinitionToType(td, [], options).columns.column.tsType
          ).toEqual('Array<string>');
        })
      );
    });

    describe('maps to Array<Object>', () => {
      ['_json', '_jsonb'].forEach(type =>
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
            PostgresDBReflection.mapTableDefinitionToType(td, [], options).columns.column.tsType
          ).toEqual('Array<Object>');
        })
      );
    });

    describe('maps to Array<Date>', () => {
      it('_timestamptz', () => {
        const td: ITable = {
          name: 'tableName',
          columns: {
            column: {
              udtName: '_timestamptz',
              nullable: false,
              tsType: '',
            },
          },
        };
        expect(
          PostgresDBReflection.mapTableDefinitionToType(td, [], options).columns.column.tsType
        ).toEqual('Array<Date>');
      });
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
          PostgresDBReflection.mapTableDefinitionToType(td, ['CustomType'], options).columns.column
            .tsType
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
          PostgresDBReflection.mapTableDefinitionToType(td, ['CustomType'], options).columns.column
            .tsType
        ).toEqual('any');
      });
    });
  });
});
