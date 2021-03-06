import { getDatabase } from '../../src/schema';

describe('Schema', () => {
  describe('getDatabase', () => {
    it('invalid connection', () => {
      try {
        getDatabase('mongodb://localhost:27017');
      } catch (e) {
        expect(e.message).toEqual(
          'SQL version unsupported in connection: mongodb://localhost:27017'
        );
      }
    });

    it('mysql connection', () => {
      const db = getDatabase('mysql://user:password@localhost/test');
      expect(db.constructor.name).toEqual('MysqlDatabase');
    });

    it('postgres connection', () => {
      const db = getDatabase('postgres://user:password@localhost/test');
      expect(db.constructor.name).toEqual('PostgresDatabase');
    });
  });
});
