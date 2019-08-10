import * as PgPromise from 'pg-promise';

const pgp = PgPromise();
const pgpStub = {
  query: jest.fn(),
  each: jest.fn(),
  map: jest.fn(),
};

export = function pgpStubFactory(shouldReturnMockHandler = false) {
  if (shouldReturnMockHandler) {
    return {
      pgpStub,
      resetMocks: () => {
        pgpStub.query.mockReset();
        pgpStub.each.mockReset();
        pgpStub.map.mockReset();
      },
    };
  }
  const dbConnection = () => pgpStub;
  dbConnection.as = pgp.as;
  return dbConnection;
};
