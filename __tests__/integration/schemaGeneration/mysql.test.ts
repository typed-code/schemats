import * as mysql from 'mysql';
import { Database, getDatabase } from '../../../src';
import { condBeforeAll, condDescribe, generateTypes, loadSchema } from '../../testUtility';

describe('schema generation integration testing', () => {
  condDescribe(!!process.env.MYSQL_URL, this, 'mysql', () => {
    let db: Database;

    condBeforeAll(!!process.env.MYSQL_URL, this, async () => {
      (mysql as any).disableStub();
      db = getDatabase(`${process.env.MYSQL_URL}?multipleStatements=true`);
      await loadSchema(db, './__tests__/fixture/mysql/initCleanup.sql');
    });

    afterAll(() => {
      (mysql as any).enableStub();
    });

    it('Basic generation', async () => {
      const inputSQLFile = '__tests__/fixture/mysql/osm.sql';
      const output = await generateTypes(
        inputSQLFile,
        {
          tables: ['users', 'user_enums', 'package'],
        },
        db
      );

      expect(output).toMatchSnapshot();
    });

    it('Camelcase generation', async () => {
      const inputSQLFile = '__tests__/fixture/mysql/osm.sql';
      const output = await generateTypes(
        inputSQLFile,
        {
          tables: ['users', 'user_enums', 'package'],
          camelCase: true,
        },
        db
      );

      expect(output).toMatchSnapshot();
    });

    it('Enum conflict in columns', async () => {
      const inputSQLFile = '__tests__/fixture/mysql/conflict.sql';
      try {
        await generateTypes(
          inputSQLFile,
          {
            tables: ['location', 'location_history'],
            writeHeader: false,
          },
          db
        );
      } catch (e) {
        expect(e.message).toEqual(
          'Multiple enums with the same name and contradicting types were found: location_type: ["city","province","country"] and ["city","state","country"]'
        );
      }
    });
  });
});
