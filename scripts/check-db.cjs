const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./dev.db');

console.log('📋 Checking database tables...');

db.all(
  "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name",
  (err, rows) => {
    if (err) {
      console.error('❌ Error:', err.message);
      db.close();
      process.exit(1);
      return;
    }
    
    console.log('✅ Found tables:');
    rows.forEach(row => {
      console.log(`   - ${row.name}`);
    });
    
    db.close();
  }
);