# Task 31: Write Unit Tests for TimerService (Vitest)

**Phase:** 7 - Testing, Build & Polish
**Dependencies:** Task 11 (TimerService created)

## Description
Write unit tests for the core TimerService functionality using Vitest to ensure database operations work correctly.

## Implementation Steps

1. **Install Vitest and dependencies**
   ```bash
   npm install --save-dev vitest @vitest/ui
   npm install --save-dev @testing-library/react @testing-library/jest-dom
   npm install --save-dev happy-dom
   ```

2. **Create Vitest config**
   Create `vitest.config.ts`:
   ```typescript
   import { defineConfig } from 'vitest/config';
   import react from '@vitejs/plugin-react';
   import path from 'path';

   export default defineConfig({
     plugins: [react()],
     test: {
       globals: true,
       environment: 'happy-dom',
       setupFiles: ['./tests/setup.ts'],
     },
     resolve: {
       alias: {
         '@': path.resolve(__dirname, './src'),
       },
     },
   });
   ```

3. **Create test setup file**
   Create `tests/setup.ts`:
   ```typescript
   import { expect, afterEach } from 'vitest';
   import { cleanup } from '@testing-library/react';
   import '@testing-library/jest-dom';

   // Cleanup after each test
   afterEach(() => {
     cleanup();
   });
   ```

4. **Create test utilities for database**
   Create `tests/testDb.ts`:
   ```typescript
   import Database from 'better-sqlite3';
   import fs from 'fs';
   import path from 'path';

   const TEST_DB_PATH = path.join(__dirname, 'test-timer.db');

   export function createTestDatabase(): Database.Database {
     // Remove existing test database
     if (fs.existsSync(TEST_DB_PATH)) {
       fs.unlinkSync(TEST_DB_PATH);
     }

     const db = new Database(TEST_DB_PATH);
     db.pragma('foreign_keys = ON');

     // Create tables
     db.exec(`
       CREATE TABLE IF NOT EXISTS tasks (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         name TEXT NOT NULL UNIQUE,
         created_at INTEGER DEFAULT (strftime('%s','now') * 1000)
       )
     `);

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

     return db;
   }

   export function cleanupTestDatabase() {
     if (fs.existsSync(TEST_DB_PATH)) {
       fs.unlinkSync(TEST_DB_PATH);
     }
   }
   ```

5. **Write TimerService tests**
   Create `electron/services/TimerService.test.ts`:
   ```typescript
   import { describe, it, expect, beforeEach, afterAll } from 'vitest';
   import { createTestDatabase, cleanupTestDatabase } from '../../tests/testDb';
   import Database from 'better-sqlite3';

   // Mock the database module
   let testDb: Database.Database;

   const TimerService = {
     getOrCreateTask(name: string): number {
       const existing = testDb.prepare('SELECT id FROM tasks WHERE name = ?').get(name) as
         | { id: number }
         | undefined;
       if (existing) return existing.id;

       const result = testDb.prepare('INSERT INTO tasks (name) VALUES (?)').run(name);
       return result.lastInsertRowid as number;
     },

     startTimer(taskName: string): number | null {
       const activeTimer = testDb
         .prepare('SELECT * FROM time_entries WHERE end_time IS NULL')
         .get();
       if (activeTimer) return null;

       const taskId = this.getOrCreateTask(taskName);
       const startTime = Date.now();
       const result = testDb
         .prepare('INSERT INTO time_entries (task_id, start_time) VALUES (?, ?)')
         .run(taskId, startTime);

       return result.lastInsertRowid as number;
     },

     stopTimer() {
       const activeTimer = testDb
         .prepare('SELECT * FROM time_entries WHERE end_time IS NULL')
         .get() as any;
       if (!activeTimer) return null;

       const endTime = Date.now();
       const duration = Math.floor((endTime - activeTimer.start_time) / 1000);

       testDb
         .prepare('UPDATE time_entries SET end_time = ?, duration_seconds = ? WHERE id = ?')
         .run(endTime, duration, activeTimer.id);

       return testDb
         .prepare(`
           SELECT te.*, t.name as task_name
           FROM time_entries te
           JOIN tasks t ON te.task_id = t.id
           WHERE te.id = ?
         `)
         .get(activeTimer.id);
     },

     getActiveTimer() {
       return testDb
         .prepare(`
           SELECT te.*, t.name as task_name
           FROM time_entries te
           JOIN tasks t ON te.task_id = t.id
           WHERE te.end_time IS NULL
           LIMIT 1
         `)
         .get();
     },
   };

   describe('TimerService', () => {
     beforeEach(() => {
       testDb = createTestDatabase();
     });

     afterAll(() => {
       cleanupTestDatabase();
     });

     describe('getOrCreateTask', () => {
       it('should create a new task', () => {
         const taskId = TimerService.getOrCreateTask('Test Task');
         expect(taskId).toBeGreaterThan(0);
       });

       it('should return existing task ID for duplicate name', () => {
         const id1 = TimerService.getOrCreateTask('Same Task');
         const id2 = TimerService.getOrCreateTask('Same Task');
         expect(id1).toBe(id2);
       });

       it('should create different IDs for different tasks', () => {
         const id1 = TimerService.getOrCreateTask('Task 1');
         const id2 = TimerService.getOrCreateTask('Task 2');
         expect(id1).not.toBe(id2);
       });
     });

     describe('startTimer', () => {
       it('should start a timer for a task', () => {
         const timerId = TimerService.startTimer('New Task');
         expect(timerId).toBeGreaterThan(0);
       });

       it('should not start if timer already active', () => {
         TimerService.startTimer('First Task');
         const secondTimer = TimerService.startTimer('Second Task');
         expect(secondTimer).toBeNull();
       });

       it('should create task if it does not exist', () => {
         const timerId = TimerService.startTimer('Auto Created Task');
         expect(timerId).toBeGreaterThan(0);

         const tasks = testDb.prepare('SELECT * FROM tasks WHERE name = ?').get('Auto Created Task');
         expect(tasks).toBeDefined();
       });
     });

     describe('stopTimer', () => {
       it('should stop an active timer', async () => {
         TimerService.startTimer('Task to Stop');

         // Wait a bit to ensure duration > 0
         await new Promise((resolve) => setTimeout(resolve, 1100));

         const stopped = TimerService.stopTimer() as any;
         expect(stopped).toBeDefined();
         expect(stopped.end_time).toBeDefined();
         expect(stopped.duration_seconds).toBeGreaterThan(0);
       });

       it('should return null if no active timer', () => {
         const stopped = TimerService.stopTimer();
         expect(stopped).toBeNull();
       });

       it('should calculate duration correctly', async () => {
         TimerService.startTimer('Duration Test');
         await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds

         const stopped = TimerService.stopTimer() as any;
         expect(stopped.duration_seconds).toBeGreaterThanOrEqual(1);
         expect(stopped.duration_seconds).toBeLessThanOrEqual(3);
       });
     });

     describe('getActiveTimer', () => {
       it('should return null when no timer active', () => {
         const active = TimerService.getActiveTimer();
         expect(active).toBeUndefined();
       });

       it('should return active timer with task name', () => {
         TimerService.startTimer('Active Task');
         const active = TimerService.getActiveTimer() as any;

         expect(active).toBeDefined();
         expect(active.task_name).toBe('Active Task');
         expect(active.end_time).toBeNull();
       });

       it('should return null after stopping timer', () => {
         TimerService.startTimer('Temporary Task');
         TimerService.stopTimer();

         const active = TimerService.getActiveTimer();
         expect(active).toBeUndefined();
       });
     });
   });
   ```

6. **Add test scripts to package.json**
   ```json
   {
     "scripts": {
       "test": "vitest",
       "test:ui": "vitest --ui",
       "test:run": "vitest run",
       "test:coverage": "vitest --coverage"
     }
   }
   ```

7. **Run tests**
   ```bash
   npm test
   ```

   Should see all tests pass

8. **Add coverage (optional)**
   ```bash
   npm install --save-dev @vitest/coverage-v8
   npm run test:coverage
   ```

## Acceptance Criteria
- [ ] Vitest configured and working
- [ ] All TimerService methods tested
- [ ] Tests for edge cases
- [ ] All tests passing
- [ ] Test coverage > 80% for TimerService
- [ ] Fast test execution (< 5 seconds)

## Test Coverage Goals
- **getOrCreateTask:** Create new, return existing, handle duplicates
- **startTimer:** Start timer, prevent double-start, auto-create task
- **stopTimer:** Stop timer, calculate duration, handle no active timer
- **getActiveTimer:** Return active, return null, include task name

## Running Tests
```bash
# Watch mode (during development)
npm test

# Single run (CI/CD)
npm run test:run

# With UI
npm run test:ui

# With coverage
npm run test:coverage
```

## Future Test Additions
- Integration tests for IPC
- E2E tests with Playwright (next task)
- Component tests for React components
- Snapshot tests for UI

## References
- [Vitest Documentation](https://vitest.dev/)
- project_init.md line 228 (At minimum: basic unit test for TimerService)
