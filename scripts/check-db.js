import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./dev.db');

db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
  if (err) {
    console.error('Error:', err);
    db.close();
    return;
  }
  console.log('Tables:', rows);
  db.close();
});
