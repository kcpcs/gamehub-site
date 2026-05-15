#!/usr/bin/env node
/**
 * GameHub Auto-Operation Database Script
 * Actual database operations for daily tasks
 */

import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

config({ path: '.env.local' });

const prisma = new PrismaClient();

// === TASK 1: Auto-approve codes
export async function autoApproveCodes() {
  console.log('📋 Starting auto-approving codes...');

  const unverified = await prisma.gameCode.findMany({
    where: { status: 'UNVERIFIED' }
  });

  console.log(`👀 Found ${unverified.length} unverified codes to process...`);

  for (const code of unverified) {
    // Check if it's valid (simple validation)
    if (!code.code.startsWith('TEST')) {
      await prisma.gameCode.update({
        where: { id: code.id },
        data: { status: 'ACTIVE' }
      });
      console.log(`✅ Approved: ${code.code}`);
    }
  }
}

// === TASK 2: Check expired codes
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
    console.log(`✅ Marked: ${code.code}`);
  }
}

// === TASK 3: Clean test data
export async function cleanTestData() {
  console.log('🧹 Cleaning test data...');
  
  const testCodes = await prisma.gameCode.deleteMany({
    where: {
      OR: [
        { code: { contains: 'TEST' } },
        { code: 'GENSHIN' },
        { code: 'TEST123' }
      ]
    }
  });
  console.log(`✅ Cleaned ${testCodes.count} test codes...`);
}

// === TASK 4: Update SEO last modified
export async function updateSeoLastModified() {
  console.log('🌐 Updating SEO last modified times...');
  
  const allGames = await prisma.game.findMany();
  
  const today = new Date();

  for (const game of allGames) {
    await prisma.game.update({
      where: { id: game.id },
      data: { updatedAt: today }
    });
  }
  
  console.log(`✅ Updated ${allGames.length} games SEO times...`);
}

// === MAIN
async function main() {
  console.log('🚀 Starting daily operations...');
  
  try {
    await autoApproveCodes();
    await checkExpiredCodes();
    await cleanTestData();
    await updateSeoLastModified();
    console.log('✅ All database operations complete!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// If executed directly
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  main();
}

export { main };
