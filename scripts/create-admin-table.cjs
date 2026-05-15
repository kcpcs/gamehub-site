const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

async function main() {
  const db = new sqlite3.Database('./dev.db');
  
  console.log('📋 Creating AdminUser table...');
  
  db.run(`
    CREATE TABLE IF NOT EXISTS AdminUser (
      id TEXT NOT NULL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      username TEXT NOT NULL UNIQUE,
      avatar TEXT,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'editor',
      last_login_at TEXT,
      failed_attempts INTEGER NOT NULL DEFAULT 0,
      locked_until TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('❌ Error creating table:', err.message);
      db.close();
      process.exit(1);
      return;
    }
    
    console.log('✅ AdminUser table created successfully');
    
    // Check if admin user exists
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
  });
}

main();