#!/usr/bin/env node
import { spawnSync} from 'child_process';

// Vercel 构建脚本：先检查 Prisma Client 是否存在，如果不存在才运行 prisma generate

console.log('🔧 Vercel Build Script');

try {
  // 检查 Prisma Client 是否已经存在
  const fs = require('fs');
  const path = require('path');
  
  if (fs.existsSync(path.join(process.cwd(), 'node_modules/.prisma/client/index.js')) {
    console.log('✅ Prisma Client 已存在，跳过 generate');
  } else {
    console.log('📦 Generating Prisma Client...');
    spawnSync('npx', ['prisma', 'generate'], { 
      stdio: 'inherit',
      shell: true
    });
  }
  
  console.log('🚀 Running Next.js build...');
  spawnSync('npx', ['next', 'build'], { 
    stdio: 'inherit',
    shell: true
  });
  
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}
