import * as PgPromise from 'pg-promise';
import { customers } from '../../actual/postgres/usecase';

const pgp = PgPromise();
const db = pgp('postgres://username:password@host:port/databaset');

(async () => {
  const emailAndDisplayName: {
    email: customers['email'];
    display_name: customers['display_name'];
  } = await db.query('SELECT (email, display_name) FROM customers');

  // tslint:disable-next-line
  console.log(emailAndDisplayName);
})();
