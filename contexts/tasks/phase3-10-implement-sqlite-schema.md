# Task 10: Implement SQLite Schema

**Phase:** 3 - Database & Core Services
**Dependencies:** Task 03 (better-sqlite3 configured)

## Description
Create the SQLite database schema with tasks and time_entries tables as specified in the project requirements.

## Implementation Steps

1. **Remove test database code from electron/main.ts**
   Remove the testDatabase import and call added in Task 03

2. **Create database initialization module**
   Create `electron/database.ts`:
   ```typescript
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
   ```

3. **Initialize database in electron/main.ts**
   Add to the top of main.ts:
   ```typescript
   import { app, BrowserWindow } from 'electron';
   import path from 'path';
   import { initDatabase, closeDatabase } from './database';

   // Initialize database when app is ready
   app.whenReady().then(() => {
     initDatabase();
     createWindow();
   });

   // Close database on quit
   app.on('before-quit', () => {
     closeDatabase();
   });
   ```

4. **Create database helper functions**
   Add to `electron/database.ts`:
   ```typescript
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
   ```

5. **Test database initialization**
   Run the app and check the console for:
   - "Initializing database at: [path]"
   - "Database tables created successfully"

   Verify database file exists:
   ```bash
   # macOS location
   ls -la ~/Library/Application\ Support/Electron/timer.db
   ```

6. **Create database inspection script (optional)**
   Create `scripts/inspect-db.js`:
   ```javascript
   const Database = require('better-sqlite3');
   const path = require('path');
   const os = require('os');

   const dbPath = path.join(
     os.homedir(),
     'Library/Application Support/Electron/timer.db'
   );

   const db = new Database(dbPath, { readonly: true });

   console.log('Tasks:');
   console.log(db.prepare('SELECT * FROM tasks').all());

   console.log('\nTime Entries:');
   console.log(db.prepare('SELECT * FROM time_entries').all());

   db.close();
   ```

## Acceptance Criteria
- [ ] Database initializes on app startup
- [ ] tasks table created with correct schema
- [ ] time_entries table created with correct schema and foreign key
- [ ] Indexes created for performance
- [ ] Helper functions work correctly
- [ ] Database file created in userData directory
- [ ] Database closes properly on app quit

## Schema Reference
```sql
-- Active timer query:
SELECT * FROM time_entries WHERE end_time IS NULL LIMIT 1;

-- Today's entries:
SELECT te.*, t.name as task_name
FROM time_entries te
JOIN tasks t ON te.task_id = t.id
WHERE te.start_time >= [start_of_day_timestamp]
ORDER BY te.start_time DESC;
```

## References
- project_init.md lines 173-198 (SQLite Schema section)
- project_init.md lines 10, 146-150 (TimerService requirements)
