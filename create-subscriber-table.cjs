const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');

const adapter = new PrismaLibSql({ url: 'file:./dev.db' });
const db = new PrismaClient({ adapter });

async function main() {
  await db.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS Subscriber (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      status TEXT DEFAULT 'active',
      games TEXT,
      token TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Subscriber table created');

  await db.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS idx_subscriber_status ON Subscriber(status)');
  await db.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS idx_subscriber_token ON Subscriber(token)');
  console.log('✅ Indexes created');

  await db.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
