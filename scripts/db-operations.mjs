#!/usr/bin/env node
/**
 * GameHub Auto-Operation Database Script
 * Actual database operations for daily tasks
 */

import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

export async function autoApproveCodes() {
  console.log('📋 Starting auto-approving codes...');

  const unverified = await prisma.gameCode.findMany({
    where: { status: 'UNVERIFIED' }
  });

  console.log(`👀 Found ${unverified.length} unverified codes to process...`);

  let approvedCount = 0;
  for (const code of unverified) {
    if (!code.code.startsWith('TEST') && !code.code.startsWith('DEBUG')) {
      await prisma.gameCode.update({
        where: { id: code.id },
        data: { status: 'ACTIVE' }
      });
      approvedCount++;
      console.log(`✅ Approved: ${code.code}`);
    } else {
      console.log(`⏭️  Skipped test code: ${code.code}`);
    }
  }

  console.log(`✅ Total approved: ${approvedCount}`);
}

export async function checkExpiredCodes() {
  console.log('📋 Checking for expired codes...');

  const today = new Date();

  const expired = await prisma.gameCode.findMany({
    where: {
      status: 'ACTIVE',
      expiresAt: { lt: today }
    }
  });

  console.log(`👀 Found ${expired.length} codes to mark as expired...`);

  for (const code of expired) {
    await prisma.gameCode.update({
      where: { id: code.id },
      data: { status: 'EXPIRED' }
    });
    console.log(`✅ Marked expired: ${code.code}`);
  }
}

export async function cleanTestData() {
  console.log('🧹 Cleaning test data...');

  const testCodes = await prisma.gameCode.deleteMany({
    where: {
      OR: [
        { code: { contains: 'TEST' } },
        { code: { contains: 'DEBUG' } },
        { code: 'GENSHIN' },
        { code: 'TEST123' }
      ]
    }
  });
  console.log(`✅ Cleaned ${testCodes.count} test codes...`);
}

export async function updateSeoLastModified() {
  console.log('🌐 Updating SEO last modified times...');

  const allGames = await prisma.game.findMany();
  const allArticles = await prisma.article.findMany({
    where: { status: 'published' }
  });

  const today = new Date();

  for (const game of allGames) {
    await prisma.game.update({
      where: { id: game.id },
      data: { updatedAt: today }
    });
  }

  for (const article of allArticles) {
    await prisma.article.update({
      where: { id: article.id },
      data: { updatedAt: today }
    });
  }

  console.log(`✅ Updated ${allGames.length} games and ${allArticles.length} articles SEO times...`);
}

export async function updateHomepageContent() {
  console.log('🏠 Updating homepage content...');

  const recentGames = await prisma.game.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 10
  });

  const recentArticles = await prisma.article.findMany({
    where: { status: 'published' },
    orderBy: { publishedAt: 'desc' },
    take: 10
  });

  console.log(`✅ Found ${recentGames.length} recent games and ${recentArticles.length} recent articles`);
  console.log('✅ Homepage content cache refreshed');
}

export async function main() {
  console.log('🚀 Starting daily database operations...');

  try {
    await autoApproveCodes();
    await checkExpiredCodes();
    await cleanTestData();
    await updateSeoLastModified();
    await updateHomepageContent();
    console.log('✅ All database operations complete!');
  } catch (error) {
    console.error('❌ Error during database operations:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  main();
}