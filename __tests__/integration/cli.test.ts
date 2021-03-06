import { spawnSync } from 'child_process';
import { condDescribe } from '../testUtility';

describe('schemats cli tool integration testing', () => {
  condDescribe(!!process.env.POSTGRES_URL, this, 'schemats generate postgres', () => {
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

      // tslint:disable-next-line:no-console
      console.log(stdout.toString(), stderr.toString());
      expect(status).toBe(0);
    });
  });

  condDescribe(!!process.env.MYSQL_URL, this, 'schemats generate mysql', () => {
    it('should run without error', () => {
      const { status, stdout, stderr } = spawnSync('node', [
        'dist/bin/schemats',
        'generate',
        '-c',
        process.env.MYSQL_URL as string,
        '-s',
        'test',
        '-o',
        '/tmp/schemats_cli_mysql.ts',
      ]);
      // tslint:disable-next-line:no-console
      console.log(stdout.toString(), stderr.toString());
      expect(status).toBe(0);
    });
  });
});
