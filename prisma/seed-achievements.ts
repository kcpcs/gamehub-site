import { PrismaClient } from '@prisma/client';
import { ensureAchievements } from './achievements.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding achievements...\n');

  const result = await ensureAchievements();

  console.log(`\n✅ Achievement seeding complete!`);
  console.log(`   - Created: ${result.created}`);
  console.log(`   - Already existed: ${result.existing}`);
  console.log(`   - Total: ${result.created + result.existing}\n`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding achievements:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
