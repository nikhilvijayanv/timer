# Task 11: Create TimerService.ts with Database Operations

**Phase:** 3 - Database & Core Services
**Dependencies:** Task 10 (SQLite schema implemented)

## Description

Implement the TimerService that handles all timer-related database operations including starting, stopping, and querying timers.

## Implementation Steps

1. **Create electron/services/TimerService.ts**

   ```typescript
   import { getDatabase } from '../database';

   export interface Task {
     id: number;
     name: string;
     created_at: number;
   }

   export interface TimeEntry {
     id: number;
     task_id: number;
     start_time: number;
     end_time: number | null;
     duration_seconds: number | null;
     notes: string | null;
     task_name?: string; // From JOIN
   }

   export class TimerService {
     /**
      * Get or create a task by name
      */
     static getOrCreateTask(taskName: string): number {
       const db = getDatabase();

       // Try to find existing task
       const existing = db.prepare('SELECT id FROM tasks WHERE name = ?').get(taskName) as
         | { id: number }
         | undefined;

       if (existing) {
         return existing.id;
       }

       // Create new task
       const result = db.prepare('INSERT INTO tasks (name) VALUES (?)').run(taskName);
       return result.lastInsertRowid as number;
     }

     /**
      * Get all tasks
      */
     static getAllTasks(): Task[] {
       const db = getDatabase();
       return db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all() as Task[];
     }

     /**
      * Start a new timer for a task
      * @returns The new time entry ID, or null if there's already an active timer
      */
     static startTimer(taskName: string): number | null {
       const db = getDatabase();

       // Check if there's already an active timer
       const activeTimer = this.getActiveTimer();
       if (activeTimer) {
         console.warn('Cannot start timer: another timer is already active');
         return null;
       }

       // Get or create the task
       const taskId = this.getOrCreateTask(taskName);

       // Create new time entry
       const startTime = Date.now();
       const result = db
         .prepare(
           `
         INSERT INTO time_entries (task_id, start_time)
         VALUES (?, ?)
       `
         )
         .run(taskId, startTime);

       console.log(`Timer started for task: ${taskName} (ID: ${taskId})`);
       return result.lastInsertRowid as number;
     }

     /**
      * Stop the currently active timer
      * @returns The completed time entry, or null if no active timer
      */
     static stopTimer(): TimeEntry | null {
       const db = getDatabase();

       // Find active timer
       const activeTimer = this.getActiveTimer();
       if (!activeTimer) {
         console.warn('No active timer to stop');
         return null;
       }

       const endTime = Date.now();
       const durationSeconds = Math.floor((endTime - activeTimer.start_time) / 1000);

       // Update the time entry
       db.prepare(
         `
         UPDATE time_entries
         SET end_time = ?, duration_seconds = ?
         WHERE id = ?
       `
       ).run(endTime, durationSeconds, activeTimer.id);

       console.log(`Timer stopped. Duration: ${durationSeconds}s`);

       // Return the completed entry
       return db
         .prepare(
           `
         SELECT te.*, t.name as task_name
         FROM time_entries te
         JOIN tasks t ON te.task_id = t.id
         WHERE te.id = ?
       `
         )
         .get(activeTimer.id) as TimeEntry;
     }

     /**
      * Get the currently active timer (if any)
      */
     static getActiveTimer(): TimeEntry | null {
       const db = getDatabase();
       const result = db
         .prepare(
           `
         SELECT te.*, t.name as task_name
         FROM time_entries te
         JOIN tasks t ON te.task_id = t.id
         WHERE te.end_time IS NULL
         LIMIT 1
       `
         )
         .get() as TimeEntry | undefined;

       return result || null;
     }

     /**
      * Get all time entries for today
      */
     static getTodayEntries(): TimeEntry[] {
       const db = getDatabase();
       const todayStart = new Date();
       todayStart.setHours(0, 0, 0, 0);
       const startOfDay = todayStart.getTime();

       return db
         .prepare(
           `
         SELECT te.*, t.name as task_name
         FROM time_entries te
         JOIN tasks t ON te.task_id = t.id
         WHERE te.start_time >= ?
         ORDER BY te.start_time DESC
       `
         )
         .all(startOfDay) as TimeEntry[];
     }

     /**
      * Get time entries for a date range
      */
     static getEntriesByDateRange(startDate: Date, endDate: Date): TimeEntry[] {
       const db = getDatabase();
       return db
         .prepare(
           `
         SELECT te.*, t.name as task_name
         FROM time_entries te
         JOIN tasks t ON te.task_id = t.id
         WHERE te.start_time >= ? AND te.start_time <= ?
         ORDER BY te.start_time DESC
       `
         )
         .all(startDate.getTime(), endDate.getTime()) as TimeEntry[];
     }

     /**
      * Delete a time entry
      */
     static deleteTimeEntry(entryId: number): boolean {
       const db = getDatabase();
       const result = db.prepare('DELETE FROM time_entries WHERE id = ?').run(entryId);
       return result.changes > 0;
     }

     /**
      * Update time entry notes
      */
     static updateNotes(entryId: number, notes: string): boolean {
       const db = getDatabase();
       const result = db
         .prepare('UPDATE time_entries SET notes = ? WHERE id = ?')
         .run(notes, entryId);
       return result.changes > 0;
     }
   }
   ```

2. **Create type definitions file**
   Create `electron/types.ts`:

   ```typescript
   export interface Task {
     id: number;
     name: string;
     created_at: number;
   }

   export interface TimeEntry {
     id: number;
     task_id: number;
     start_time: number;
     end_time: number | null;
     duration_seconds: number | null;
     notes: string | null;
     task_name?: string;
   }
   ```

3. **Test TimerService**
   Add test code to electron/main.ts (temporary):

   ```typescript
   import { TimerService } from './services/TimerService';

   app.whenReady().then(() => {
     initDatabase();

     // Test timer service
     console.log('Testing TimerService...');
     const timerId = TimerService.startTimer('Test Task');
     console.log('Started timer:', timerId);

     setTimeout(() => {
       const stopped = TimerService.stopTimer();
       console.log('Stopped timer:', stopped);

       const entries = TimerService.getTodayEntries();
       console.log("Today's entries:", entries);
     }, 3000);

     createWindow();
   });
   ```

4. **Run and verify**

   ```bash
   npm run dev
   ```

   Should see console output showing:
   - Timer started
   - Timer stopped after 3 seconds
   - Today's entries with the test task

5. **Remove test code**
   Remove the test code from main.ts once verified

## Acceptance Criteria

- [ ] TimerService class created with all methods
- [ ] Can start a timer for a task
- [ ] Cannot start timer if one is already active
- [ ] Can stop active timer
- [ ] Duration calculated correctly
- [ ] Can query active timer
- [ ] Can get today's entries
- [ ] All database operations work correctly

## API Reference

```typescript
TimerService.startTimer(taskName: string): number | null
TimerService.stopTimer(): TimeEntry | null
TimerService.getActiveTimer(): TimeEntry | null
TimerService.getTodayEntries(): TimeEntry[]
TimerService.getEntriesByDateRange(start: Date, end: Date): TimeEntry[]
TimerService.getAllTasks(): Task[]
TimerService.deleteTimeEntry(id: number): boolean
TimerService.updateNotes(id: number, notes: string): boolean
```

## References

- project_init.md lines 25, 146-150 (TimerService section)
- project_init.md lines 194-196 (Active timer query)
