#!/usr/bin/env node
/**
 * GameHub Cron Job Scheduler
 * Schedules daily auto-operation at 2:00 AM
 */

const cron = require('node-cron');
const { execSync } = require('child_process');

console.log('🚀 GameHub Cron Job Scheduler Started');
console.log('⏰ Waiting for scheduled tasks...');
console.log('');

// Schedule daily auto-operation at 2:00 AM
const task = cron.schedule('0 2 * * *', () => {
  const now = new Date().toLocaleString();
  console.log('\n==================================================');
  console.log(`🔔 Starting daily auto-operation at: ${now}`);
  console.log('==================================================\n');

  try {
    // Run the daily operation script
    execSync('npm run operate:daily', {
      stdio: 'inherit',
      cwd: __dirname + '/..',
    });

    const finishTime = new Date().toLocaleString();
    console.log('\n==================================================');
    console.log(`✅ Daily auto-operation complete at: ${finishTime}`);
    console.log('==================================================\n');
  } catch (error) {
    console.error('\n❌ Error during daily auto-operation!');
    console.error(error);
  }
}, {
  scheduled: true,
  timezone: 'Asia/Shanghai'
});

// Also allow manual trigger via command line
if (process.argv.includes('--run-now')) {
  console.log('⚡ Manually triggering daily operation now...');
  try {
    execSync('npm run operate:daily', {
      stdio: 'inherit',
      cwd: __dirname + '/..',
    });
    console.log('\n✅ Manual execution complete!');
  } catch (error) {
    console.error('\n❌ Error during manual execution!');
    console.error(error);
    process.exit(1);
  }
  process.exit(0);
}

// Start the scheduler
console.log('✅ Cron job scheduled successfully!');
console.log('⏰ Task will run daily at 2:00 AM (Asia/Shanghai)');
console.log('💡 To run manually: npm run operate:start -- --run-now');
console.log('');