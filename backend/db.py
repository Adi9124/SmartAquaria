import sqlite3
import os

DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'smart_aquaria.db'))

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Telemetry Logs Table
    cursor.execute('''
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
    ''')

    # 2. Spawning Events Table
    cursor.execute('''
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
    ''')

    # 3. Actuator Logs Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS actuator_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            actuator_name TEXT NOT NULL,
            action TEXT NOT NULL,
            setpoint REAL,
            trigger_type TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # 4. Email Alert Logs Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS alert_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            recipient_email TEXT NOT NULL,
            alert_title TEXT NOT NULL,
            alert_message TEXT NOT NULL,
            severity TEXT NOT NULL,
            status TEXT DEFAULT 'SENT',
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    conn.commit()
    conn.close()
    print(f"[DB SUCCESS] Python FastAPI SQLite Database Initialized at {DB_PATH}")

if __name__ == "__main__":
    init_db()
