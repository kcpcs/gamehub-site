#!/usr/bin/env node
/**
 * GameHub Data Validation Script
 * Validate imported data integrity
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

async function validateDatabase(prisma) {
  log('\n' + colors.bold('Data Validation Report'));
  log('='.repeat(50));

  let allValid = true;

  info('Counting records...');

  const gameCount = await prisma.game.count();
  const codeCount = await prisma.gameCode.count();
  const articleCount = await prisma.article.count();
  const userCount = await prisma.user.count();
  const tierListCount = await prisma.tierList.count();

  log(`\nRecord Counts:`);
  log(`   Games: ${gameCount}`);
  log(`   Codes: ${codeCount}`);
  log(`   Articles: ${articleCount}`);
  log(`   Users: ${userCount}`);
  log(`   Tier Lists: ${tierListCount}`);

  info('\nValidating game data...');
  const invalidGames = await prisma.game.findMany({
    where: {
      OR: [
        { slug: '' },
        { name: '' },
        { cover_url: '' }
      ]
    }
  });

  if (invalidGames.length > 0) {
    warning(`Found ${invalidGames.length} invalid games`);
    allValid = false;
  } else {
    success('All games are valid');
  }

  info('\nValidating code data...');
  const invalidCodes = await prisma.gameCode.findMany({
    where: {
      OR: [
        { code: '' },
        { reward_desc: '' }
      ]
    }
  });

  if (invalidCodes.length > 0) {
    warning(`Found ${invalidCodes.length} invalid codes`);
    allValid = false;
  } else {
    success('All codes are valid');
  }

  info('\nChecking for duplicate slugs...');
  const duplicateSlugs = await prisma.$queryRaw`
    SELECT slug, COUNT(*) as count
    FROM Game
    GROUP BY slug
    HAVING COUNT(*) > 1
  `;

  if (duplicateSlugs.length > 0) {
    warning(`Found ${duplicateSlugs.length} duplicate slugs`);
    allValid = false;
  } else {
    success('No duplicate slugs found');
  }

  info('\nChecking foreign key integrity...');
  const codesWithoutGame = await prisma.gameCode.findMany({
    where: {
      game: null
    }
  });

  if (codesWithoutGame.length > 0) {
    warning(`Found ${codesWithoutGame.length} codes without game reference`);
    allValid = false;
  } else {
    success('All codes have valid game references');
  }

  log('\n' + '='.repeat(50));

  if (allValid) {
    success('All validations passed!');
    return true;
  } else {
    error('Some validations failed, please review the warnings');
    return false;
  }
}

async function main() {
  log('\n' + colors.bold('GameHub Data Validation Script'));

  const envPath = process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env.local';

  info(`Loading environment from: ${envPath}`);

  const prisma = createPrismaClient(envPath);

  try {
    await prisma.$connect();
    const isValid = await validateDatabase(prisma);
    await prisma.$disconnect();
    process.exit(isValid ? 0 : 1);
  } catch (err) {
    error('Validation failed!');
    error(err.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  main();
}