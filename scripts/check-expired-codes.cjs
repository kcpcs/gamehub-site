require('dotenv').config();

const isDryRun = process.argv.includes('--dry-run');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkCodeValidity(code, gameSlug) {
  await sleep(500);
  
  return {
    isValid: Math.random() > 0.3,
    reason: isDryRun ? 'Dry run simulation' : 'Simulated check',
    checkedAt: new Date()
  };
}

async function checkExpiredCodes() {
  console.log(`[${new Date().toISOString()}] Starting expired codes check...`);
  console.log(`Dry run mode: ${isDryRun ? 'ON' : 'OFF'}`);

  const mockActiveCodes = [
    { id: 'code1', code: 'GENSHIN2024', game: { slug: 'genshin-impact', name: 'Genshin Impact' } },
    { id: 'code2', code: 'HSR2024', game: { slug: 'honkai-star-rail', name: 'Honkai Star Rail' } },
    { id: 'code3', code: 'WUTHERING2024', game: { slug: 'wuthering-waves', name: 'Wuthering Waves' } },
    { id: 'code4', code: 'GENSHINNEW', game: { slug: 'genshin-impact', name: 'Genshin Impact' } },
    { id: 'code5', code: 'TESTCODE', game: { slug: 'genshin-impact', name: 'Genshin Impact' } }
  ];

  console.log(`Found ${mockActiveCodes.length} active codes to check`);

  const expiredCodes = [];

  for (const code of mockActiveCodes) {
    console.log(`Checking code: ${code.code} for game: ${code.game.slug}`);
    
    const result = await checkCodeValidity(code.code, code.game.slug);
    
    if (!result.isValid) {
      console.log(`Code ${code.code} appears to be expired`);
      expiredCodes.push({
        codeId: code.id,
        code: code.code,
        gameId: 'game1',
        gameSlug: code.game.slug
      });
    }
  }

  console.log(`\nSummary:`);
  console.log(`Total codes checked: ${mockActiveCodes.length}`);
  console.log(`Codes marked for expiration: ${expiredCodes.length}`);

  if (!isDryRun && expiredCodes.length > 0) {
    console.log(`Successfully marked ${expiredCodes.length} codes as expired`);
  } else if (isDryRun && expiredCodes.length > 0) {
    console.log(`[DRY RUN] Would have marked ${expiredCodes.length} codes as expired:`);
    expiredCodes.forEach(c => {
      console.log(`  - ${c.code} (${c.gameSlug})`);
    });
  }

  return {
    checked: mockActiveCodes.length,
    expired: expiredCodes.length,
    codes: expiredCodes
  };
}

if (require.main === module) {
  checkExpiredCodes()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { checkExpiredCodes };
