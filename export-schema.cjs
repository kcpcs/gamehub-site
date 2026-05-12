const { createClient } = require('@libsql/client');

async function main() {
  const client = createClient({ url: 'file:./dev.db' });

  // Get all tables
  const tables = await client.execute("SELECT name, sql FROM sqlite_master WHERE type='table' ORDER BY name");

  console.log('-- === TABLES ===');
  for (const row of tables.rows) {
    if (row.sql) console.log(row.sql + ';');
  }

  // Get all indexes
  const indexes = await client.execute("SELECT sql FROM sqlite_master WHERE type='index' AND sql IS NOT NULL ORDER BY name");

  console.log('\n-- === INDEXES ===');
  for (const row of indexes.rows) {
    console.log(row.sql + ';');
  }

  console.log('\n-- Schema export complete');
}

main().catch(console.error);
