import * as PgPromise from 'pg-promise';
import * as osm from '../../expected/postgres/osm';

const pgp = PgPromise();
const db = pgp('postgres://username:password@host:port/databaset');

(async () => {
    const emailAndDisplayName: {
        email: osm.users['email'];
        display_name: osm.users['display_name'];
    } = await db.query('SELECT (email, display_name) FROM users');

    // tslint:disable-next-line
    console.log(emailAndDisplayName);
})();
