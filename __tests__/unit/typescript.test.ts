import Options from '../../src/options';
import * as Typescript from '../../src/typescript';

const options = new Options({});

describe('Typescript', () => {
  describe('generateTableInterface', () => {
    it('empty table definition object', () => {
      const tableInterface = Typescript.generateTableInterface('tableName', {}, options);
      expect(tableInterface).toMatchSnapshot();
    });

    it('table name is reserved', () => {
      const tableInterface = Typescript.generateTableInterface('package', {}, options);
      expect(tableInterface).toMatchSnapshot();
    });

    it('table with columns', () => {
      const tableInterface = Typescript.generateTableInterface(
        'tableName',
        {
          col1: { udtName: 'name1', nullable: false },
          col2: { udtName: 'name2', nullable: false },
        },
        options
      );
      expect(tableInterface).toMatchSnapshot();
    });

    it('table with reserved columns', () => {
      const tableInterface = Typescript.generateTableInterface(
        'tableName',
        {
          string: { udtName: 'name1', nullable: false },
          number: { udtName: 'name2', nullable: false },
          package: { udtName: 'name3', nullable: false },
        },
        options
      );
      expect(tableInterface).toMatchSnapshot();
    });
  });

  describe('generateEnumType', () => {
    it('empty object', () => {
      const enumType = Typescript.generateEnumType({}, options);
      expect(enumType).toBe('');
    });

    it('with enumerations', () => {
      const enumType = Typescript.generateEnumType(
        {
          enum1: ['val1', 'val2', 'val3', 'val4'],
          enum2: ['val5', 'val6', 'val7', 'val8'],
        },
        options
      );
      expect(enumType).toBe(
        `export type enum1 = 'val1' | 'val2' | 'val3' | 'val4';\n` +
          `export type enum2 = 'val5' | 'val6' | 'val7' | 'val8';\n`
      );
    });
  });

  describe('generateEnumType', () => {
    it('empty object', () => {
      const enumType = Typescript.generateEnumType({}, options);
      expect(enumType).toBe('');
    });

    it('with enumerations', () => {
      const enumType = Typescript.generateEnumType(
        {
          enum1: ['val1', 'val2', 'val3', 'val4'],
          enum2: ['val5', 'val6', 'val7', 'val8'],
        },
        options
      );

      expect(enumType).toBe(
        `export type enum1 = 'val1' | 'val2' | 'val3' | 'val4';\n` +
          `export type enum2 = 'val5' | 'val6' | 'val7' | 'val8';\n`
      );
    });
  });
  describe('generateTableTypes', () => {
    it('empty table definition object', () => {
      const tableTypes = Typescript.generateTableTypes('tableName', {}, options);
      expect(tableTypes).toMatchSnapshot();
    });

    it('with table definitions', () => {
      const tableTypes = Typescript.generateTableTypes(
        'tableName',
        {
          col1: { udtName: 'name1', nullable: false, tsType: 'string' },
          col2: { udtName: 'name2', nullable: false, tsType: 'number' },
        },
        options
      );
      expect(tableTypes).toMatchSnapshot();
    });

    it('with nullable column definitions', () => {
      const tableTypes = Typescript.generateTableTypes(
        'tableName',
        {
          col1: { udtName: 'name1', nullable: true, tsType: 'string' },
          col2: { udtName: 'name2', nullable: true, tsType: 'number' },
        },
        options
      );

      expect(tableTypes).toMatchSnapshot();
    });
  });
});
