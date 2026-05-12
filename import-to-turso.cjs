require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@libsql/client');
const fs = require('fs');

async function main() {
  const client = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  console.log('Connecting to Turso...');
  await client.execute('SELECT 1');
  console.log('Connected!');

  // Read schema
  const schema = fs.readFileSync('./schema-export.sql', 'utf8');
  const statements = schema
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`Found ${statements.length} SQL statements`);

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    try {
      await client.execute(stmt);
      process.stdout.write(`.`);
    } catch (e) {
      console.error(`\n[ERROR] Statement ${i + 1}: ${e.message}`);
      console.error(`SQL: ${stmt.substring(0, 200)}...`);
    }
  }

  console.log('\nSchema import complete!');
}

main().catch(console.error);
