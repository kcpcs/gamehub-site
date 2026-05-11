const fs = require('fs');
const path = require('path');

// 将 dev.db 复制到 .vercel/output/functions 目录下
// 这样所有 serverless function 都能访问到

const sourceDb = path.join(process.cwd(), 'dev.db');
const outputDir = path.join(process.cwd(), '.vercel', 'output', 'functions');

if (!fs.existsSync(sourceDb)) {
  console.log('dev.db not found at project root, skipping copy');
  process.exit(0);
}

if (!fs.existsSync(outputDir)) {
  console.log('.vercel/output/functions not found, skipping copy');
  process.exit(0);
}

// 复制到 .vercel/output/functions/ 根目录
const targetDb = path.join(outputDir, 'dev.db');
fs.copyFileSync(sourceDb, targetDb);
console.log('Copied dev.db to', targetDb);

// 同时复制到每个函数目录
const functionDirs = fs.readdirSync(outputDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => path.join(outputDir, d.name));

functionDirs.forEach(dir => {
  const fnDb = path.join(dir, 'dev.db');
  fs.copyFileSync(sourceDb, fnDb);
  console.log('Copied dev.db to', fnDb);
});

console.log('Done copying dev.db to all function directories');
