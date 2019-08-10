const mysqlStub = {
  query: jest.fn(),
};

export = {
  createConnection: (connection: string) =>
    connection
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
        },
};
