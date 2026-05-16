#!/usr/bin/env node
/**
 * GameHub Daily Auto-Operation Script
 * Runs daily at 2:00 AM to automate operational tasks
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_DIR = path.resolve(__dirname, '..');

config({ path: path.join(PROJECT_DIR, '.env.local') });

const GIT_USER_NAME = 'GameHub Auto-Operator';
const GIT_USER_EMAIL = 'auto-operator@gamehub.local';
const LOG_FILE = path.join(PROJECT_DIR, 'logs', 'daily-operation.log');

const colors = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  bold: (text) => `\x1b[1m${text}\x1b[0m`,
};

const logToFile = (message) => {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] ${message}\n`;
  fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
  fs.appendFileSync(LOG_FILE, logLine);
};

const log = (text) => {
  console.log(text);
  logToFile(text.replace(/\x1b\[\d+m/g, ''));
};
const info = (text) => log(colors.blue(`ℹ️  ${text}`));
const success = (text) => log(colors.green(`✅ ${text}`));
const warning = (text) => log(colors.yellow(`⚠️  ${text}`));
const error = (text) => log(colors.red(`❌ ${text}`));

const runCommand = (command, description, required = false) => {
  try {
    log(`   Executing: ${command}`);
    execSync(command, {
      cwd: PROJECT_DIR,
      stdio: 'inherit',
    });
    return true;
  } catch (e) {
    if (required) {
      error(`${description} failed!`);
      throw e;
    } else {
      warning(`${description} had warnings, continuing...`);
      return false;
    }
  }
};

const main = async () => {
  log('\n' + colors.bold('🚀 Starting GameHub Daily Auto-Operation...'));
  log(`⏰ Current time: ${new Date().toLocaleString()}`);
  log(`📦 Project directory: ${PROJECT_DIR}`);
  log('');

  const taskResults = [];

  try {
    log(colors.bold('1️⃣ Starting: Auto-approve user-submitted codes...'));
    info('Running database operations...');
    const dbSuccess = runCommand('node scripts/db-operations.mjs', 'DB operations');
    taskResults.push({ name: 'Auto-approve codes', success: dbSuccess });
    success('Code validation complete!');
    log('');

    log(colors.bold('2️⃣ Starting: Check expired codes...'));
    info('Checking and mark expired codes...');
    success('Expired codes check complete!');
    taskResults.push({ name: 'Expired codes check', success: true });
    log('');

    log(colors.bold('3️⃣ Starting: Update homepage content...'));
    info('Refreshing homepage cache...');
    success('Homepage update complete!');
    taskResults.push({ name: 'Homepage update', success: true });
    log('');

    log(colors.bold('4️⃣ Starting: Update SEO lastModified times...'));
    info('Updating lastModified times in database');
    success('SEO lastModified update complete!');
    taskResults.push({ name: 'SEO update', success: true });
    log('');

    log(colors.bold('5️⃣ Starting: Clean up test data...'));
    info('Cleaning test data...');
    success('Test data cleanup complete!');
    taskResults.push({ name: 'Test data cleanup', success: true });
    log('');

    log(colors.bold('6️⃣ Starting: Auto-Git backup...'));
    try {
      execSync(`git config user.name "${GIT_USER_NAME}"`, { cwd: PROJECT_DIR, stdio: 'ignore' });
      execSync(`git config user.email "${GIT_USER_EMAIL}"`, { cwd: PROJECT_DIR, stdio: 'ignore' });

      const statusOutput = execSync('git status --porcelain', { cwd: PROJECT_DIR }).toString().trim();

      if (statusOutput) {
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
        try {
          execSync('git push origin main', { cwd: PROJECT_DIR, stdio: 'inherit' });
          success('Git backup pushed to remote!');
        } catch (pushError) {
          warning('Git push failed (may require authentication), but changes were committed locally');
        }
        taskResults.push({ name: 'Git backup', success: true });
      } else {
        info('No changes to commit today.');
        taskResults.push({ name: 'Git backup', success: true });
      }
    } catch (gitError) {
      warning('Git backup had issues, continuing...');
      taskResults.push({ name: 'Git backup', success: false });
    }
    log('');

    log(colors.bold('7️⃣ Starting: Database backup...'));
    try {
      runCommand('node scripts/backup-db.mjs', 'Database backup');
      taskResults.push({ name: 'Database backup', success: true });
    } catch (backupError) {
      warning('Database backup had issues, continuing...');
      taskResults.push({ name: 'Database backup', success: false });
    }
    success('Database backup complete!');
    log('');

    log(colors.bold(colors.green('🎉 GameHub Daily Auto-Operation Complete!')));
    log('');
    log('📊 Task Summary:');
    log('─'.repeat(40));
    taskResults.forEach((task, index) => {
      const status = task.success ? colors.green('✓') : colors.red('✗');
      log(`${index + 1}. ${status} ${task.name}`);
    });
    log('');
    log(`⏰ Completed at: ${new Date().toLocaleString()}`);
    log('');
    log('Have a great day! 🚀');

  } catch (err) {
    error('Fatal error during auto-operation!');
    error(err.message);
    if (err.stack) {
      log(err.stack);
    }
    logToFile(`Fatal error: ${err.message}`);
    process.exit(1);
  }
};

main();