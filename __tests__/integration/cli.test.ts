import { spawnSync } from 'child_process';
import { condDescribe } from '../testUtility';

describe('schemats cli tool integration testing', () => {
  condDescribe(!!process.env.POSTGRES_URL, 'schemats generate postgres', () => {
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

  condDescribe(!!process.env.MYSQL_URL, 'schemats generate mysql', () => {
    it('should run without error', () => {
      const { status } = spawnSync('node', [
        'dist/bin/schemats',
        'generate',
        '-c',
        process.env.MYSQL_URL as string,
        '-s',
        'test',
        '-o',
        '/tmp/schemats_cli_mysql.ts',
      ]);

      expect(status).toBe(0);
    });
  });
});
