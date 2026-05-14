import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

let prisma;
try {
  const adapter = new PrismaLibSql({
    url: process.env.DATABASE_URL || 'file:./dev.db',
  });
  prisma = new PrismaClient({ adapter });
} catch {
  prisma = new PrismaClient();
}

const isDryRun = process.argv.includes('--dry-run');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkCodeValidity(code, gameSlug) {
  await sleep(1000);
  
  return {
    isValid: Math.random() > 0.3,
    reason: isDryRun ? 'Dry run simulation' : 'Simulated check',
    checkedAt: new Date()
  };
}

async function checkExpiredCodes() {
  console.log(`[${new Date().toISOString()}] Starting expired codes check...`);
  console.log(`Dry run mode: ${isDryRun ? 'ON' : 'OFF'}`);

  try {
    const activeCodes = await prisma.gameCode.findMany({
      where: { status: 'active' },
      include: { game: true }
    });

    console.log(`Found ${activeCodes.length} active codes to check`);

    const expiredCodes = [];

    for (const code of activeCodes) {
      console.log(`Checking code: ${code.code} for game: ${code.game.slug}`);
      
      const result = await checkCodeValidity(code.code, code.game.slug);
      
      if (!result.isValid) {
        console.log(`Code ${code.code} appears to be expired`);
        expiredCodes.push({
          codeId: code.id,
          code: code.code,
          gameId: code.game_id,
          gameSlug: code.game.slug
        });
      }
    }

    console.log(`\nSummary:`);
    console.log(`Total codes checked: ${activeCodes.length}`);
    console.log(`Codes marked for expiration: ${expiredCodes.length}`);

    if (!isDryRun && expiredCodes.length > 0) {
      await prisma.gameCode.updateMany({
        where: {
          id: { in: expiredCodes.map(c => c.codeId) }
        },
        data: {
          status: 'expired'
        }
      });
      console.log(`Successfully marked ${expiredCodes.length} codes as expired`);
    } else if (isDryRun && expiredCodes.length > 0) {
      console.log(`[DRY RUN] Would have marked ${expiredCodes.length} codes as expired:`);
      expiredCodes.forEach(c => {
        console.log(`  - ${c.code} (${c.gameSlug})`);
      });
    }

    return {
      checked: activeCodes.length,
      expired: expiredCodes.length,
      codes: expiredCodes
    };
  } catch (error) {
    console.error('Error checking expired codes:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  checkExpiredCodes()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { checkExpiredCodes };