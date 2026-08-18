import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../smart_aquaria.db');

const verboseSqlite = sqlite3.verbose();
export const db = new verboseSqlite.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Failed to connect to SQLite Database:', err.message);
  } else {
    console.log('⚡ Connected to SQLite Database at:', dbPath);
  }
});

// Initialize database schema tables
db.serialize(() => {
  // 1. Telemetry Logs Table
  db.run(`
    CREATE TABLE IF NOT EXISTS telemetry_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tank_id TEXT NOT NULL,
      temperature REAL,
      ph REAL,
      dissolved_oxygen REAL,
      ammonia REAL,
      nitrate REAL,
      light_spectrum INTEGER,
      turbidity REAL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2. Spawning Events & AI Behavior Table
  db.run(`
    CREATE TABLE IF NOT EXISTS spawning_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tank_id TEXT NOT NULL,
      species_id TEXT NOT NULL,
      behavior_state TEXT,
      egg_count INTEGER,
      viability_score INTEGER,
      fry_forecast INTEGER,
      log_text TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 3. Actuator Logs Table
  db.run(`
    CREATE TABLE IF NOT EXISTS actuator_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      actuator_name TEXT NOT NULL,
      action TEXT NOT NULL,
      setpoint REAL,
      trigger_type TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✅ SQLite Schema Tables Initialized (telemetry_logs, spawning_events, actuator_logs).');
});

export default db;
