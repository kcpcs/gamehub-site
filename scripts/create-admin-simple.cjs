const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

async function main() {
  const db = new sqlite3.Database('./dev.db');
  
  console.log('🔍 Checking for existing admin user...');
  
  db.get('SELECT * FROM AdminUser WHERE email = ?', ['admin@gamehub.ai'], async (err, row) => {
    if (err) {
      console.error('❌ Error checking admin:', err.message);
      db.close();
      process.exit(1);
      return;
    }
    
    if (row) {
      console.log('✅ Admin user already exists:', row.email);
      db.close();
      process.exit(0);
      return;
    }
    
    console.log('📝 Creating default admin user...');
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const now = new Date().toISOString();
    
    db.run(
      'INSERT INTO AdminUser (id, email, username, password_hash, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        require('crypto').randomUUID(),
        'admin@gamehub.ai',
        'admin',
        hashedPassword,
        'super_admin',
        now,
        now
      ],
      function(err) {
        if (err) {
          console.error('❌ Error creating admin:', err.message);
          db.close();
          process.exit(1);
          return;
        }
        
        console.log('✅ Default admin user created successfully!');
        console.log('   Email: admin@gamehub.ai');
        console.log('   Username: admin');
        console.log('   Role: super_admin');
        db.close();
        process.exit(0);
      }
    );
  });
}

main();