const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const dbPath = path.join(__dirname, '../dev.db')
const db = new sqlite3.Database(dbPath)

const sqlStatements = [
  'ALTER TABLE Comment ADD COLUMN ai_generated INTEGER DEFAULT 0 NOT NULL',
  'ALTER TABLE Comment ADD COLUMN ai_player_id TEXT',
  'ALTER TABLE Article ADD COLUMN ai_generated INTEGER DEFAULT 0 NOT NULL',
  'ALTER TABLE Article ADD COLUMN ai_player_id TEXT',
  'ALTER TABLE AIPlayer ADD COLUMN avatar_url TEXT',
  'ALTER TABLE AIPlayer ADD COLUMN bio TEXT',
  'ALTER TABLE AIPlayer ADD COLUMN region TEXT',
  'ALTER TABLE AIPlayer ADD COLUMN joined_at_simulated DATETIME',
  'ALTER TABLE AIPlayer ADD COLUMN follower_ids TEXT DEFAULT \'[]\' NOT NULL',
  `CREATE TABLE AIContentReviewQueue (
    id TEXT NOT NULL PRIMARY KEY,
    ai_player_id TEXT NOT NULL,
    action_type TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT,
    generated_content TEXT NOT NULL,
    confidence_score REAL NOT NULL,
    quality_check_result TEXT DEFAULT '{}' NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL,
    reviewed_by TEXT,
    reviewed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (ai_player_id) REFERENCES AIPlayer(id) ON DELETE CASCADE
  )`,
  'CREATE INDEX AIContentReviewQueue_ai_player_id_idx ON AIContentReviewQueue(ai_player_id)',
  'CREATE INDEX AIContentReviewQueue_status_idx ON AIContentReviewQueue(status)',
  'CREATE INDEX AIContentReviewQueue_created_at_idx ON AIContentReviewQueue(created_at)'
]

async function runMigrations() {
  console.log('Starting database migrations...')
  
  for (let i = 0; i < sqlStatements.length; i++) {
    const sql = sqlStatements[i]
    console.log(`Executing statement ${i + 1}/${sqlStatements.length}...`)
    
    try {
      await new Promise((resolve, reject) => {
        db.run(sql, (err) => {
          if (err) {
            if (err.message.includes('duplicate column name') || err.message.includes('already exists')) {
              console.log(`Column/table already exists, skipping: ${err.message}`)
              resolve()
            } else {
              reject(err)
            }
          } else {
            resolve()
          }
        })
      })
      console.log(`Statement ${i + 1} completed successfully`)
    } catch (err) {
      console.error(`Error executing statement ${i + 1}:`, err)
      db.close()
      process.exit(1)
    }
  }
  
  console.log('All migrations completed successfully!')
  db.close()
}

runMigrations().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
