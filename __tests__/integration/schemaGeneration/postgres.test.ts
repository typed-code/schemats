import * as pgress from 'pg-promise';
import { Database, getDatabase } from '../../../src/index';
import { condBeforeAll, condDescribe, generateTypes, loadSchema } from '../../testUtility';

describe('schema generation integration testing', () => {
  condDescribe(!!process.env.POSTGRES_URL, this, 'postgres', () => {
    let db: Database;

    condBeforeAll(!!process.env.POSTGRES_URL, this, async () => {
      (pgress as any).disableStub();
      db = getDatabase(process.env.POSTGRES_URL as string);
      await loadSchema(db, './__tests__/fixture/postgres/initCleanup.sql');
    });

    afterAll(() => (pgress as any).enableStub());

    it('Basic generation', async () => {
      const inputSQLFile = '__tests__/fixture/postgres/osm.sql';
      const output = await generateTypes(
        inputSQLFile,
        {
          tables: ['users'],
        },
        db
      );

      expect(output).toMatchSnapshot();
    });

    it('Camelcase generation', async () => {
      const inputSQLFile = '__tests__/fixture/postgres/osm.sql';
      const output = await generateTypes(
        inputSQLFile,
        {
          tables: ['users'],
          camelCase: true,
        },
        db
      );

      expect(output).toMatchSnapshot();
    });
  });
});
