const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../dev.db');
const db = new sqlite3.Database(dbPath);

const createAdminTables = `
-- AdminUser table
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

-- AdminRole table
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

-- AuditLog table
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
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES AdminUser(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_admin_user_email ON AdminUser(email);
CREATE INDEX IF NOT EXISTS idx_admin_user_role ON AdminUser(role);
CREATE INDEX IF NOT EXISTS idx_audit_log_admin_id ON AuditLog(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON AuditLog(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_resource_type ON AuditLog(resource_type);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON AuditLog(created_at);
`;

const insertDefaultRoles = `
INSERT OR IGNORE INTO AdminRole (id, name, description, can_manage_users, can_manage_games, can_manage_articles, can_manage_codes, can_manage_tierlists, can_manage_comments, can_view_analytics, can_manage_settings, can_manage_roles, can_manage_ai_players) VALUES
('super_admin_role', '超级管理员', '拥有所有权限', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1),
('admin_role', '管理员', '管理大部分功能', 1, 1, 1, 1, 1, 1, 1, 1, 0, 1),
('moderator_role', '版主', '内容管理权限', 0, 1, 1, 1, 1, 1, 1, 0, 0, 1),
('editor_role', '编辑', '内容编辑权限', 0, 0, 1, 1, 0, 1, 0, 0, 0, 0);
`;

db.serialize(() => {
  db.run(createAdminTables, (err) => {
    if (err) {
      console.error('Error creating admin tables:', err);
      process.exit(1);
    }
    console.log('✅ Admin tables created successfully');

    db.run(insertDefaultRoles, (err) => {
      if (err) {
        console.error('Error inserting default roles:', err);
        process.exit(1);
      }
      console.log('✅ Default roles inserted successfully');

      console.log('\n🎉 Admin database initialization completed!');
      db.close();
    });
  });
});