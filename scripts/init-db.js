import sqlite3 from 'sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const dbPath = join(__dirname, '../dev.db')

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err)
    process.exit(1)
  }
  console.log('Connected to SQLite database')
})

const createTables = `
CREATE TABLE IF NOT EXISTS AIPlayer (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE,
  email TEXT UNIQUE,
  avatar TEXT,
  age INTEGER,
  occupation TEXT,
  personality TEXT DEFAULT '{}',
  interests TEXT DEFAULT '[]',
  activity_level REAL DEFAULT 0.5,
  status TEXT DEFAULT 'inactive',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  last_activity_at TEXT,
  total_posts INTEGER DEFAULT 0,
  total_comments INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS AIBehaviorConfig (
  id TEXT PRIMARY KEY,
  player_id TEXT UNIQUE,
  wake_up_time TEXT DEFAULT '08:00',
  sleep_time TEXT DEFAULT '23:00',
  activity_interval_min INTEGER DEFAULT 300,
  activity_interval_max INTEGER DEFAULT 1800,
  post_probability REAL DEFAULT 0.1,
  comment_probability REAL DEFAULT 0.3,
  reply_probability REAL DEFAULT 0.5,
  typing_speed_min INTEGER DEFAULT 30,
  typing_speed_max INTEGER DEFAULT 60,
  thinking_time_min INTEGER DEFAULT 2,
  thinking_time_max INTEGER DEFAULT 10,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES AIPlayer(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS AIActivityLog (
  id TEXT PRIMARY KEY,
  player_id TEXT,
  activity_type TEXT,
  target_type TEXT,
  target_id TEXT,
  content TEXT,
  success INTEGER DEFAULT 1,
  error_message TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES AIPlayer(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS AIStats (
  id TEXT PRIMARY KEY,
  player_id TEXT,
  date TEXT,
  posts_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  active_minutes INTEGER DEFAULT 0,
  FOREIGN KEY (player_id) REFERENCES AIPlayer(id) ON DELETE CASCADE,
  UNIQUE(player_id, date)
);

CREATE INDEX IF NOT EXISTS idx_AIPlayer_status ON AIPlayer(status);
CREATE INDEX IF NOT EXISTS idx_AIPlayer_created_at ON AIPlayer(created_at);
CREATE INDEX IF NOT EXISTS idx_AIBehaviorConfig_player_id ON AIBehaviorConfig(player_id);
CREATE INDEX IF NOT EXISTS idx_AIActivityLog_player_id ON AIActivityLog(player_id);
CREATE INDEX IF NOT EXISTS idx_AIActivityLog_activity_type ON AIActivityLog(activity_type);
CREATE INDEX IF NOT EXISTS idx_AIActivityLog_created_at ON AIActivityLog(created_at);
CREATE INDEX IF NOT EXISTS idx_AIStats_player_id ON AIStats(player_id);
CREATE INDEX IF NOT EXISTS idx_AIStats_date ON AIStats(date);
`

db.exec(createTables, (err) => {
  if (err) {
    console.error('Error creating tables:', err)
    db.close()
    process.exit(1)
  }
  console.log('Tables created successfully')
  db.close()
})
