#!/usr/bin/env node
/**
 * GameHub Database Backup Script
 * Creates daily database backups
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

async function backupDatabase() {
  const backupDir = path.join(__dirname, '..', 'backups');
  const dateStr = new Date().toISOString().split('T')[0];
  const backupFile = path.join(backupDir, `backup-${dateStr}.json`);

  fs.mkdirSync(backupDir, { recursive: true });

  config({ path: path.join(__dirname, '..', '.env.local') });

  const isRemote = (process.env.DATABASE_URL || '').startsWith('libsql://');
  const adapter = new PrismaLibSql({
    url: process.env.DATABASE_URL || 'file:./dev.db',
    authToken: isRemote ? process.env.TURSO_AUTH_TOKEN : undefined,
  });

  const prisma = new PrismaClient({
    adapter,
    log: ['error'],
  });

  try {
    await prisma.$connect();
    info('📡 Connected to database');

    info('📤 Exporting data...');

    const games = await prisma.game.findMany();
    const codes = await prisma.gameCode.findMany();
    const articles = await prisma.article.findMany();
    const users = await prisma.user.findMany();
    const tierLists = await prisma.tierList.findMany({
      include: { entries: true }
    });

    const backupData = {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      data: {
        games,
        codes,
        articles,
        users,
        tierLists
      }
    };

    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
    success(`Backup saved to: ${backupFile}`);

    const stats = fs.statSync(backupFile);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    info(`Backup size: ${sizeMB} MB`);

    cleanOldBackups(backupDir);

  } catch (err) {
    error('Backup failed!');
    error(err.message);
    throw err;
  } finally {
    await prisma.$disconnect();
  }
}

function cleanOldBackups(backupDir) {
  const files = fs.readdirSync(backupDir);
  const maxBackups = 7;

  const backupFiles = files
    .filter(f => f.startsWith('backup-') && f.endsWith('.json'))
    .sort((a, b) => b.localeCompare(a));

  if (backupFiles.length > maxBackups) {
    const toDelete = backupFiles.slice(maxBackups);
    toDelete.forEach(file => {
      fs.unlinkSync(path.join(backupDir, file));
      info(`Deleted old backup: ${file}`);
    });
    success(`Cleaned ${toDelete.length} old backups`);
  }
}

async function main() {
  log('\n' + colors.bold('GameHub Database Backup'));
  log('='.repeat(50));

  try {
    await backupDatabase();
    success('Backup completed successfully!');
  } catch (err) {
    error('Backup failed!');
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  main();
}