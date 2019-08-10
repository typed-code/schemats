import { spawnSync } from 'child_process';

describe('schemats cli tool integration testing', () => {
  describe('schemats generate postgres', () => {
    beforeAll(async function() {
      if (!process.env.POSTGRES_URL) {
        return this.skip();
      }
    });

    it('should run without error', () => {
      const { status, stdout, stderr } = spawnSync(
        'node',
        [
          'dist/bin/schemats',
          'generate',
          '-c',
          process.env.POSTGRES_URL as string,
          '-o',
          '/tmp/schemats_cli_postgres.ts',
        ],
        { encoding: 'utf-8' }
      );

      // tslint:disable-next-line
      console.log('opopopopop', stdout, stderr);
      expect(status).toBe(0);
    });
  });

  describe('schemats generate mysql', () => {
    beforeAll(async function() {
      if (!process.env.MYSQL_URL) {
        return this.skip();
      }
    });

    it('should run without error', () => {
      const { status } = spawnSync('node', [
        'dist/bin/schemats',
        'generate',
        '-c',
        process.env.MYSQL_URL as string,
        '-s',
        'test',
        '-o',
        '/tmp/schemats_cli_postgres.ts',
      ]);

      expect(status).toBe(0);
    });
  });
});
