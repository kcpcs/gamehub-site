require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@libsql/client');

const LOCAL_DB = 'file:./dev.db';
const TABLES = [
  'AdminRole', 'AdminUser', 'AIPlayer', 'AIBehaviorConfig', 'AIStats',
  'Game', 'Article', 'GameCode', 'TierList', 'TierEntry', 'TierVote',
  'Comment', 'Like', 'Favorite', 'Subscriber', 'AffiliateClick',
  'PointTransaction', 'AIActivityLog', 'AuditLog',
];

async function getColumns(client, table) {
  const info = await client.execute(`PRAGMA table_info(${table})`);
  return info.rows.map(r => r.name);
}

async function migrateTable(local, remote, table) {
  try {
    const columns = await getColumns(local, table);
    const colStr = columns.map(c => `"${c}"`).join(', ');

    const data = await local.execute(`SELECT ${colStr} FROM "${table}"`);
    if (data.rows.length === 0) {
      console.log(`  ${table}: 0 rows`);
      return;
    }

    const placeholders = columns.map(() => '?').join(', ');
    const stmt = `INSERT INTO "${table}" (${colStr}) VALUES (${placeholders})`;

    let inserted = 0;
    for (const row of data.rows) {
      const values = columns.map(col => {
        const v = row[col];
        if (v === undefined || v === null) return null;
        if (typeof v === 'boolean') return v ? 1 : 0;
        if (typeof v === 'object') return JSON.stringify(v);
        return v;
      });
      try {
        await remote.execute({ sql: stmt, args: values });
        inserted++;
      } catch (e) {
        if (!e.message.includes('UNIQUE constraint')) {
          console.error(`    [WARN] ${table} insert error: ${e.message}`);
        }
      }
    }
    console.log(`  ${table}: ${inserted}/${data.rows.length} rows`);
  } catch (e) {
    console.error(`  [ERROR] ${table}: ${e.message}`);
  }
}

async function main() {
  const local = createClient({ url: LOCAL_DB });
  const remote = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  console.log('Migrating data to Turso...\n');

  // Disable foreign key checks during migration
  await remote.execute('PRAGMA foreign_keys = OFF');

  for (const table of TABLES) {
    await migrateTable(local, remote, table);
  }

  await remote.execute('PRAGMA foreign_keys = ON');

  console.log('\nMigration complete!');
}

main().catch(console.error);
