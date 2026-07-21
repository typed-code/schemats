import pgress from 'pg-promise';
import * as ts from 'typescript';
import { Database, getDatabase } from '../../src';
import { compile, condBeforeAll, condDescribe, writeTypesOf } from '../testUtility';

describe('end user use case', () => {
  let db: Database;
  condDescribe(!!process.env.POSTGRES_URL, this, 'postgres', () => {
    condBeforeAll(!!process.env.POSTGRES_URL, this, async () => {
      (pgress as any).disableStub();

      db = getDatabase(process.env.POSTGRES_URL as string);
    });

    afterAll(() => (pgress as any).enableStub());

    it('usecase.ts should compile without error', async () => {
      await writeTypesOf(
        '__tests__/fixture/postgres/usecase.sql',
        {
          tables: ['customers'],
        },
        db
      );

      expect(
        compile(['./__tests__/fixture/postgres/usecase.ts'], {
          noEmitOnError: true,
          noImplicitAny: true,
          target: ts.ScriptTarget.ES2020,
          module: ts.ModuleKind.CommonJS,
          types: ['node'],
        })
      ).toBe(true);
    });
  });
});
