import { typescriptOfSchema } from '../../src';
import { aProductsTable, aUsersTable } from '../builders/mysqlTable.builder';
import { MysqlDriver } from '../drivers/mysql.driver';

describe('Type generation for MySQL', () => {
  let driver: MysqlDriver;

  beforeEach(() => {
    driver = new MysqlDriver();
  });

  it('should generate types for all the tables in the schema', async () => {
    const schema = 'schemaName';
    driver.given.table(schema, aUsersTable).given.table(schema, aProductsTable);

    const res = await typescriptOfSchema('mysql://', undefined, schema);

    expect(res).toContain('namespace usersFields');
    expect(res).toContain('interface users');
    expect(res).toContain('namespace productsFields');
    expect(res).toContain('interface products');
    expect(res).toContain('rank_enum');
    expect(res).toContain('type_enum');
  });

  it('should generate fields & interface for a specific table', async () => {
    const schema = 'schemaName';
    driver.given.table(schema, aUsersTable).given.table(schema, aProductsTable);

    const res = await typescriptOfSchema('mysql://', ['users'], schema);

    expect(res).toContain('namespace usersFields');
    expect(res).toContain('interface users');
    expect(res).not.toContain('type_enum');
  });
});
