const path = require('path');
const bcrypt = require('bcryptjs');

// 使用项目自带的 libsql
const { createClient } = require(path.join(__dirname, 'node_modules/@libsql/client'));

async function main() {
  const client = createClient({ url: 'file:' + path.join(__dirname, 'dev.db') });
  
  // 检查现有管理员
  const existing = await client.execute('SELECT id, email, username, role FROM AdminUser');
  console.log('现有管理员:', existing.rows.length, '个');
  existing.rows.forEach(r => console.log(' -', r.email, '|', r.username, '|', r.role));
  
  if (existing.rows.length === 0) {
    // 创建管理员账号
    const password = 'GameHub@2026';
    const hash = await bcrypt.hash(password, 10);
    const id = 'admin_' + Date.now();
    
    await client.execute({
      sql: `INSERT INTO AdminUser (id, email, username, password_hash, role, created_at, updated_at, failed_attempts) 
            VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'), 0)`,
      args: [id, 'admin@gamehub.com', 'Admin', hash, 'super_admin']
    });
    
    console.log('\n✅ 管理员账号创建成功!');
    console.log('   邮箱: admin@gamehub.com');
    console.log('   密码: GameHub@2026');
    console.log('   角色: super_admin');
  } else {
    console.log('\n已存在管理员账号，无需创建');
  }
}

main().catch(e => console.error('Error:', e));
