import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';

let db: Database.Database | null = null;

export function initDatabase(): Database.Database {
  const userDataPath = app.getPath('userData');
  const dbPath = path.join(userDataPath, 'timer.db');

  console.log('Initializing database at:', dbPath);

  db = new Database(dbPath, { verbose: console.log });

  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Create tables
  createTables();

  return db;
}

function createTables() {
  if (!db) throw new Error('Database not initialized');

  // Tasks table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      created_at INTEGER DEFAULT (strftime('%s','now') * 1000)
    )
  `);

  // Time entries table
  db.exec(`
    CREATE TABLE IF NOT EXISTS time_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id INTEGER NOT NULL,
      start_time INTEGER NOT NULL,
      end_time INTEGER,
      duration_seconds INTEGER,
      notes TEXT,
      FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
    )
  `);

  // Create index for finding active timer
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_active_timer
    ON time_entries(end_time)
    WHERE end_time IS NULL
  `);

  // Create index for querying time entries by task
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_time_entries_task
    ON time_entries(task_id, start_time)
  `);

  console.log('Database tables created successfully');
}

export function getDatabase(): Database.Database {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase first.');
  }
  return db;
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
    console.log('Database closed');
  }
}

// Helper: Get all tasks
export function getAllTasks() {
  const db = getDatabase();
  return db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all();
}

// Helper: Create a task
export function createTask(name: string) {
  const db = getDatabase();
  const stmt = db.prepare('INSERT INTO tasks (name) VALUES (?)');
  const result = stmt.run(name);
  return result.lastInsertRowid;
}

// Helper: Find active timer
export function getActiveTimer() {
  const db = getDatabase();
  return db.prepare(`
    SELECT te.*, t.name as task_name
    FROM time_entries te
    JOIN tasks t ON te.task_id = t.id
    WHERE te.end_time IS NULL
    LIMIT 1
  `).get();
}

// Helper: Get today's entries
export function getTodayEntries() {
  const db = getDatabase();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const startOfDay = todayStart.getTime();

  return db.prepare(`
    SELECT te.*, t.name as task_name
    FROM time_entries te
    JOIN tasks t ON te.task_id = t.id
    WHERE te.start_time >= ?
    ORDER BY te.start_time DESC
  `).all(startOfDay);
}
