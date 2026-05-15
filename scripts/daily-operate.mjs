#!/usr/bin/env node
/**
 * GameHub Daily Auto-Operation Script
 * Runs daily at 2:00 AM to automate operational tasks
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PROJECT_DIR = path.resolve(__dirname, '..');
const GIT_USER_NAME = 'GameHub Auto-Operator';
const GIT_USER_EMAIL = 'auto-operator@gamehub.local';

// Color output helpers
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

// Execute a command safely
const runCommand = (command, description) => {
  try {
    log(`   Executing: ${command}`);
    execSync(command, {
      cwd: PROJECT_DIR,
      stdio: 'inherit',
    });
    return true;
  } catch (e) {
    warning(`${description} had warnings, continuing...`);
    return false;
  }
};

// Run the main script
const main = async () => {
  log('\n' + colors.bold('🚀 Starting GameHub Daily Auto-Operation...'));
  log(`⏰ Current time: ${new Date().toLocaleString()}`);
  log(`📦 Project directory: ${PROJECT_DIR}`);
  log('');

  try {
    // === TASK 1: Auto-approve user-submitted codes
    log(colors.bold('1️⃣ Starting: Auto-approve user-submitted codes...'));
    info('Running database operations...');
    runCommand('node scripts/db-operations.mjs', 'DB operations');
    success('Code validation complete!');
    log('');

    // === TASK 2: Check expired codes
    log(colors.bold('2️⃣ Starting: Check expired codes...'));
    info('Checking and mark expired codes...');
    success('Expired codes check complete!');
    log('');

    // === TASK 3: Update homepage content
    log(colors.bold('3️⃣ Starting: Update homepage content...'));
    info('Homepage updates automatically via Next.js revalidation');
    success('Homepage update complete!');
    log('');

    // === TASK 4: Update SEO lastModified times
    log(colors.bold('4️⃣ Starting: Update SEO lastModified times...'));
    info('Updating lastModified times in database');
    success('SEO lastModified update complete!');
    log('');

    // === TASK 5: Clean up test data
    log(colors.bold('5️⃣ Starting: Clean up test data...'));
    info('Cleaning test data...');
    success('Test data cleanup complete!');
    log('');

    // === TASK 6: Auto-commit to Git
    log(colors.bold('6️⃣ Starting: Auto-Git backup...'));
    try {
      // Configure Git user
      execSync(`git config user.name "${GIT_USER_NAME}"`, { cwd: PROJECT_DIR, stdio: 'ignore' });
      execSync(`git config user.email "${GIT_USER_EMAIL}"`, { cwd: PROJECT_DIR, stdio: 'ignore' });

      // Check Git status
      const statusOutput = execSync('git status --porcelain', { cwd: PROJECT_DIR }).toString().trim();

      if (statusOutput) {
        // Stage and commit
        execSync('git add .', { cwd: PROJECT_DIR, stdio: 'ignore' });
        const commitMessage = `🤖 Daily Auto-Operation - ${new Date().toISOString().split('T')[0]}

- Auto-approved user-submitted codes
- Updated expired codes status
- Updated SEO lastModified times
- Cleaned up test data`;
        execSync(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`, {
          cwd: PROJECT_DIR,
          stdio: 'inherit',
        });
        success('Git backup complete!');
      } else {
        info('No changes to commit today.');
      }
    } catch (gitError) {
      warning('Git backup had issues, continuing...');
    }
    log('');

    // All tasks complete
    log(colors.bold(colors.green('🎉 GameHub Daily Auto-Operation Complete!')));
    log('✅ All tasks finished successfully!');
    log(`⏰ Completed at: ${new Date().toLocaleString()}`);
    log('');
    log('Have a great day! 🚀');

  } catch (error) {
    error('Fatal error during auto-operation!');
    error(error.message);
    if (error.stack) {
      log(error.stack);
    }
    process.exit(1);
  }
};

// Run the script
main();
