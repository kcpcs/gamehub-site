const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./dev.db');

db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
  if (err) {
    console.error('Error:', err);
    db.close();
    return;
  }
  console.log('Tables in database:', rows.map(r => r.name));
  db.close();
});