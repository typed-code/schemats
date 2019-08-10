import { createConnection as originalCreateConnection } from 'mysql';

const mysqlStub = {
  query: jest.fn(),
};

let isStubEnabled = true;

export = {
  disableStub() {
    isStubEnabled = false;
  },
  enableStub() {
    isStubEnabled = true;
  },
  createConnection: (connection: string) => {
    if (isStubEnabled) {
      return connection
        ? mysqlStub
        : {
            mysqlStub: {
              ...mysqlStub,
              withResults: (results: any[]) =>
                mysqlStub.query.mockImplementation((query: string, _: any, cb: any) =>
                  cb(null, results)
                ),
              withError: (error: string) =>
                mysqlStub.query.mockImplementation((query: string, _: any, cb: any) => cb(error)),
            },
            resetMocks: () => {
              mysqlStub.query.mockReset();
            },
          };
    } else {
      return originalCreateConnection(connection);
    }
  },
};
