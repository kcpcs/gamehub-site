const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../dev.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
});

const createTables = () => {
  return new Promise((resolve, reject) => {
    db.run(`
      CREATE TABLE IF NOT EXISTS AdminUser (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE NOT NULL,
        avatar TEXT,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'editor' NOT NULL,
        last_login_at TEXT,
        failed_attempts INTEGER DEFAULT 0,
        locked_until TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `, (err) => {
      if (err) return reject(err);
      console.log('Created AdminUser table');
      
      db.run(`
        CREATE TABLE IF NOT EXISTS AdminRole (
          id TEXT PRIMARY KEY,
          name TEXT UNIQUE NOT NULL,
          description TEXT,
          can_manage_users INTEGER DEFAULT 0,
          can_manage_games INTEGER DEFAULT 0,
          can_manage_articles INTEGER DEFAULT 0,
          can_manage_codes INTEGER DEFAULT 0,
          can_manage_tierlists INTEGER DEFAULT 0,
          can_manage_comments INTEGER DEFAULT 0,
          can_view_analytics INTEGER DEFAULT 0,
          can_manage_settings INTEGER DEFAULT 0,
          can_manage_roles INTEGER DEFAULT 0,
          can_manage_ai_players INTEGER DEFAULT 0,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
      `, (err) => {
        if (err) return reject(err);
        console.log('Created AdminRole table');
        
        db.run(`
          CREATE TABLE IF NOT EXISTS AuditLog (
            id TEXT PRIMARY KEY,
            admin_id TEXT,
            action TEXT NOT NULL,
            resource_type TEXT NOT NULL,
            resource_id TEXT,
            details TEXT DEFAULT '{}',
            ip_address TEXT,
            user_agent TEXT,
            success INTEGER DEFAULT 1,
            error_message TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
          );
        `, (err) => {
          if (err) return reject(err);
          console.log('Created AuditLog table');
          resolve();
        });
      });
    });
  });
};

const insertRoles = () => {
  return new Promise((resolve, reject) => {
    const roles = [
      ['super_admin_role', 'Super Admin', 'Full access', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      ['admin_role', 'Admin', 'Manage most features', 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      ['moderator_role', 'Moderator', 'Content management', 0, 1, 1, 1, 1, 1, 1, 0, 0, 1],
      ['editor_role', 'Editor', 'Content editing', 0, 0, 1, 1, 0, 1, 0, 0, 0, 0],
    ];

    let count = 0;
    roles.forEach((role) => {
      db.run(
        `INSERT OR IGNORE INTO AdminRole (id, name, description, can_manage_users, can_manage_games, can_manage_articles, can_manage_codes, can_manage_tierlists, can_manage_comments, can_view_analytics, can_manage_settings, can_manage_roles, can_manage_ai_players) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        role,
        (err) => {
          if (err) {
            console.error('Error inserting role:', err);
          }
          count++;
          if (count === roles.length) {
            console.log('Inserted default roles');
            resolve();
          }
        }
      );
    });
  });
};

const createIndexes = () => {
  return new Promise((resolve) => {
    db.run('CREATE INDEX IF NOT EXISTS idx_admin_user_email ON AdminUser(email)', () => {
      db.run('CREATE INDEX IF NOT EXISTS idx_admin_user_role ON AdminUser(role)', () => {
        db.run('CREATE INDEX IF NOT EXISTS idx_audit_log_admin_id ON AuditLog(admin_id)', () => {
          db.run('CREATE INDEX IF NOT EXISTS idx_audit_log_action ON AuditLog(action)', () => {
            db.run('CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON AuditLog(created_at)', () => {
              console.log('Created indexes');
              resolve();
            });
          });
        });
      });
    });
  });
};

createTables()
  .then(insertRoles)
  .then(createIndexes)
  .then(() => {
    console.log('\n✅ Admin database initialization completed!');
    db.close();
  })
  .catch((err) => {
    console.error('Error:', err);
    db.close();
    process.exit(1);
  });