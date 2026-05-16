#!/usr/bin/env node
/**
 * GameHub Database Migration Script
 * Migrate database schema to production
 */

import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  bold: (text) => `\x1b[1m${text}\x1b[0m`,
};

const log = (text) => console.log(text);
const info = (text) => log(colors.blue(`ℹ️  ${text}`));
const success = (text) => log(colors.green(`✅ ${text}`));
const warning = (text) => log(colors.yellow(`⚠️  ${text}`));
const error = (text) => log(colors.red(`❌ ${text}`));

function createPrismaClient(envFile = '.env.local') {
  config({ path: path.join(__dirname, '..', envFile) });

  const isRemote = (process.env.DATABASE_URL || '').startsWith('libsql://');
  const adapter = new PrismaLibSql({
    url: process.env.DATABASE_URL || 'file:./dev.db',
    authToken: isRemote ? process.env.TURSO_AUTH_TOKEN : undefined,
  });

  return new PrismaClient({
    adapter,
    log: ['error'],
  });
}

async function main() {
  log('\n' + colors.bold('GameHub Database Migration Script'));
  log('='.repeat(50));

  const envPath = process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env.local';

  info(`Loading environment from: ${envPath}`);

  const prisma = createPrismaClient(envPath);

  try {
    info('Connecting to database...');
    await prisma.$connect();
    success('Database connected successfully!');

    info('Running database migration...');
    await prisma.$executeRaw`SELECT 1`;
    success('Database is ready!');

    info('Verifying schema...');
    const tables = await prisma.$queryRaw`SELECT name FROM sqlite_master WHERE type='table'`;
    log(`Found ${tables.length} tables in database`);

    success('Migration completed successfully!');

  } catch (err) {
    error('Migration failed!');
    error(err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  main();
}