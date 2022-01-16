import * as PgPromise from 'pg-promise';

const pgp = PgPromise();
const pgpStub = {
  query: jest.fn(),
  each: jest.fn(),
  map: jest.fn(),
};

let isStubEnabled = true;

function pgpStubFactory(shouldReturnMockHandler = false) {
  if (shouldReturnMockHandler) {
    return {
      withStubEachResults: (results: any[]) => {
        pgpStub.each.mockImplementation((query, params, cb) => {
          return new Promise<void>((resolve) => {
            results.forEach(cb);
            resolve();
          });
        });
      },
      pgpStub,
      resetMocks: () => {
        pgpStub.query.mockReset();
        pgpStub.each.mockReset();
        pgpStub.map.mockReset();
      },
    };
  }
  const dbConnection = (conn: string) => (isStubEnabled ? pgpStub : pgp(conn));

  dbConnection.as = pgp.as;
  return dbConnection;
}

pgpStubFactory.disableStub = () => (isStubEnabled = false);
pgpStubFactory.enableStub = () => (isStubEnabled = true);

export = pgpStubFactory;
