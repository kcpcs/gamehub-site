const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');
require('dotenv').config();
const bcrypt = require('bcryptjs');

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL || 'file:./dev.db' });
const db = new PrismaClient({ adapter });

async function createAdmin() {
  const hash = await bcrypt.hash('password123', 10);
  
  const admin = await db.adminUser.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      username: 'admin',
      password_hash: hash,
      role: 'super_admin',
    }
  });
  
  console.log('✅ 测试管理员创建成功！');
  console.log('邮箱:', admin.email);
  console.log('用户名:', admin.username);
  console.log('角色:', admin.role);
  await db.$disconnect();
}

createAdmin().catch(e => { console.error(e); process.exit(1); });
