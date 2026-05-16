#!/usr/bin/env node
/**
 * GameHub Data Import Script
 * Import local data to production database
 */

import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { config } from 'dotenv';
import fs from 'fs';
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

async function exportLocalData(prisma) {
  info('Exporting local data...');

  const games = await prisma.game.findMany({
    include: {
      codes: true,
      articles: true,
      tier_lists: {
        include: { entries: true }
      }
    }
  });

  const users = await prisma.user.findMany({
    where: { membership: { not: 'free' } }
  });

  const data = {
    games,
    users,
    exportedAt: new Date().toISOString()
  };

  const outputPath = path.join(__dirname, '..', 'data-export.json');
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

  success(`Exported ${games.length} games, ${users.length} users`);
  success(`Data saved to: ${outputPath}`);

  return data;
}

async function importToProduction(prisma, data) {
  info('Importing data to production...');

  const { games } = data;

  for (const game of games) {
    const existing = await prisma.game.findUnique({
      where: { slug: game.slug }
    });

    if (!existing) {
      await prisma.game.create({
        data: {
          slug: game.slug,
          name: game.name,
          cover_url: game.cover_url,
          platforms: game.platforms,
          genres: game.genres,
          tags: game.tags,
          description: game.description,
          score_opencritic: game.score_opencritic,
          score_steam_pct: game.score_steam_pct,
          score_community: game.score_community,
          guide_count: game.guide_count,
          code_count: game.code_count,
          video_count: game.video_count,
          has_tier_list: game.has_tier_list,
          igdb_id: game.igdb_id,
          steam_appid: game.steam_appid,
          developer: game.developer,
          publisher: game.publisher,
          release_date: game.release_date,
          screenshots: game.screenshots,
          last_patch_at: game.last_patch_at,
          score_review_count: game.score_review_count
        }
      });
      log(`Created game: ${game.name}`);
    } else {
      log(`Skipping existing game: ${game.name}`);
    }
  }

  success('Data import completed!');
}

async function main() {
  log('\n' + colors.bold('GameHub Data Import Script'));
  log('='.repeat(50));

  const localPrisma = createPrismaClient('.env.local');

  try {
    await localPrisma.$connect();
    const data = await exportLocalData(localPrisma);
    await localPrisma.$disconnect();

    const prodPrisma = createPrismaClient('.env.production');

    await prodPrisma.$connect();
    await importToProduction(prodPrisma, data);
    await prodPrisma.$disconnect();

    success('Data migration complete!');

  } catch (err) {
    error('Import failed!');
    error(err.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  main();
}