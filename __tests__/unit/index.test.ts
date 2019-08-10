import { Database } from '../../src';
import * as Index from '../../src/index';
import Options, { OptionValues } from '../../src/options';
import * as Typescript from '../../src/typescript';

const options: OptionValues = {};

describe('index', () => {
  const db: Database = {
    getDefaultSchema: jest.fn(),
    getTableTypes: jest.fn(),
    query: jest.fn(),
    getEnumTypes: jest.fn(),
    getTableDefinition: jest.fn(),
    getSchemaTables: jest.fn(),
    connectionString: 'sql://',
  };
  const tsReflection = Typescript as any;
  const dbReflection = db as any;
  let spies: any;

  beforeAll(() => {
    spies = {
      generateEnumType: jest.spyOn(Typescript, 'generateEnumType'),
      generateTableTypes: jest.spyOn(Typescript, 'generateTableTypes'),
      generateTableInterface: jest.spyOn(Typescript, 'generateTableInterface'),
    };
  });

  beforeEach(() => {
    Object.keys(spies).forEach(key => spies[key].mockClear());
    // @ts-ignore
    Object.keys(db).forEach(key => jest.isMockFunction(db[key]) && db[key].mockClear());
  });

  describe('typescriptOfTable', () => {
    it('calls functions with correct params', async () => {
      dbReflection.getTableTypes.mockReturnValue(Promise.resolve('tableTypes'));

      await Index.typescriptOfTable(db, 'tableName', 'schemaName', new Options(options));
      expect(dbReflection.getTableTypes).toHaveBeenCalledWith(
        'tableName',
        'schemaName',
        new Options(options)
      );
      expect(tsReflection.generateTableTypes).toHaveBeenCalledWith(
        'tableName',
        'tableTypes',
        new Options(options)
      );
      expect(tsReflection.generateTableInterface).toHaveBeenCalledWith(
        'tableName',
        'tableTypes',
        new Options(options)
      );
    });

    it('merges string results', async () => {
      dbReflection.getTableTypes.mockReturnValue(Promise.resolve('tableTypes'));
      tsReflection.generateTableTypes.mockReturnValue('generatedTableTypes\n');
      tsReflection.generateTableInterface.mockReturnValue('generatedTableInterfaces\n');

      const typescriptString = await Index.typescriptOfTable(
        db,
        'tableName',
        'schemaName',
        new Options(options)
      );

      expect(typescriptString).toEqual('generatedTableTypes\ngeneratedTableInterfaces\n');
    });
  });

  describe('typescriptOfSchema', () => {
    it('has schema', async () => {
      dbReflection.getSchemaTables.mockReturnValue(Promise.resolve(['tablename']));
      dbReflection.getEnumTypes.mockReturnValue(Promise.resolve('enumTypes'));
      tsReflection.generateTableTypes.mockReturnValue('generatedTableTypes\n');
      tsReflection.generateEnumType.mockReturnValue('generatedEnumTypes\n');

      await Index.typescriptOfSchema(db, [], 'schemaName', options);

      expect(dbReflection.getSchemaTables).toHaveBeenCalledWith('schemaName');
      expect(dbReflection.getEnumTypes).toHaveBeenCalledWith('schemaName');
      expect(tsReflection.generateEnumType).toHaveBeenCalledWith('enumTypes', expect.any(Object));
      expect(tsReflection.generateTableTypes).toHaveBeenCalledWith(
        'tablename',
        'tableTypes',
        expect.any(Object)
      );
    });

    it('has tables provided', async () => {
      dbReflection.getTableTypes.mockReturnValue(Promise.resolve('tableTypes'));
      dbReflection.getSchemaTables.mockReturnValue(Promise.resolve(['tablename']));
      dbReflection.getEnumTypes.mockReturnValue(Promise.resolve('enumTypes'));
      tsReflection.generateTableTypes.mockReturnValue('generatedTableTypes\n');
      tsReflection.generateEnumType.mockReturnValue('generatedEnumTypes\n');

      await Index.typescriptOfSchema(db, ['differentTablename'], null, options);

      expect(dbReflection.getSchemaTables).not.toHaveBeenCalled();
      expect(tsReflection.generateEnumType).toHaveBeenCalledWith('enumTypes', expect.any(Object));
      expect(tsReflection.generateTableTypes).toHaveBeenCalledWith(
        'differentTablename',
        'tableTypes',
        expect.any(Object)
      );
    });
  });
});
