import { Database, getDatabase } from '../../src/index';
import { condDescribe, loadSchema, writeTsFile } from '../testUtility';

describe('schemat generation integration testing', () => {
  condDescribe(!!process.env.POSTGRES_URL, 'postgres', () => {
    let db: Database;

    beforeAll(async () => {
      db = getDatabase(process.env.POSTGRES_URL as string);
      await loadSchema(db, './__tests__/fixture/postgres/initCleanup.sql');
    });

    it('Basic generation', async () => {
      const inputSQLFile = '__tests__/fixture/postgres/osm.sql';
      const outputFile = './__tests__/actual/postgres/osm.ts';
      const config = './__tests__/fixture/postgres/osm.json';
      await writeTsFile(inputSQLFile, config, outputFile, db);

      expect(outputFile).toMatchSnapshot();
    });

    it('Camelcase generation', async () => {
      const inputSQLFile = '__tests__/fixture/postgres/osm.sql';
      const outputFile = './__tests__/actual/postgres/osm-camelcase.ts';
      const config = './__tests__/fixture/postgres/osm-camelcase.json';
      await writeTsFile(inputSQLFile, config, outputFile, db);

      expect(outputFile).toMatchSnapshot();
    });
  });

  condDescribe(!!process.env.MYSQL_URL, 'mysql', () => {
    let db: Database;

    beforeAll(async () => {
      db = getDatabase(`${process.env.MYSQL_URL}?multipleStatements=true`);
      await loadSchema(db, './__tests__/fixture/mysql/initCleanup.sql');
    });

    it('Basic generation', async () => {
      const inputSQLFile = '__tests__/fixture/mysql/osm.sql';
      const outputFile = './__tests__/actual/mysql/osm.ts';
      const config = './__tests__/fixture/mysql/osm.json';
      await writeTsFile(inputSQLFile, config, outputFile, db);

      expect(outputFile).toMatchSnapshot();
    });

    it('Enum conflict in columns', async () => {
      const inputSQLFile = '__tests__/fixture/mysql/conflict.sql';
      const outputFile = './__tests__/actual/mysql/conflict.ts';
      const config = './__tests__/fixture/mysql/conflict.json';
      try {
        await writeTsFile(inputSQLFile, config, outputFile, db);
      } catch (e) {
        expect(e.message).toEqual(
          'Multiple enums with the same name and contradicting types were found: location_type: ["city","province","country"] and ["city","state","country"]'
        );
      }
    });
  });
});
