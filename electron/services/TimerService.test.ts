import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest';
import { createTestDatabase, cleanupTestDatabase } from '../../tests/testDb';
import Database from 'better-sqlite3';
import { TimerService, TimeEntry } from './TimerService';

// Mock the database module
let testDb: Database.Database;

vi.mock('../database', () => ({
  getDatabase: () => testDb,
}));

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

      // Verify task was created
      const tasks = testDb.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
      expect(tasks).toBeDefined();
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

  describe('getAllTasks', () => {
    it('should return empty array when no tasks exist', () => {
      const tasks = TimerService.getAllTasks();
      expect(tasks).toEqual([]);
    });

    it('should return all tasks', () => {
      TimerService.getOrCreateTask('Task 1');
      TimerService.getOrCreateTask('Task 2');
      TimerService.getOrCreateTask('Task 3');

      const tasks = TimerService.getAllTasks();
      expect(tasks).toHaveLength(3);
      // Tasks are ordered by created_at DESC, but they may have same timestamp
      const taskNames = tasks.map((t) => t.name);
      expect(taskNames).toContain('Task 1');
      expect(taskNames).toContain('Task 2');
      expect(taskNames).toContain('Task 3');
    });
  });

  describe('startTimer', () => {
    it('should start a timer for a task', () => {
      const timerId = TimerService.startTimer('New Task');
      expect(timerId).toBeGreaterThan(0);

      // Verify timer was created
      const activeTimer = TimerService.getActiveTimer();
      expect(activeTimer).toBeDefined();
      expect(activeTimer?.task_name).toBe('New Task');
    });

    it('should not start if timer already active', () => {
      TimerService.startTimer('First Task');
      const secondTimer = TimerService.startTimer('Second Task');
      expect(secondTimer).toBeNull();

      // Verify only one timer is active
      const activeTimer = TimerService.getActiveTimer();
      expect(activeTimer?.task_name).toBe('First Task');
    });

    it('should create task if it does not exist', () => {
      const timerId = TimerService.startTimer('Auto Created Task');
      expect(timerId).toBeGreaterThan(0);

      const tasks = testDb
        .prepare('SELECT * FROM tasks WHERE name = ?')
        .get('Auto Created Task');
      expect(tasks).toBeDefined();
    });
  });

  describe('stopTimer', () => {
    it('should stop an active timer', async () => {
      TimerService.startTimer('Task to Stop');

      // Wait a bit to ensure duration > 0
      await new Promise((resolve) => setTimeout(resolve, 1100));

      const stopped = TimerService.stopTimer() as TimeEntry;
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

      const stopped = TimerService.stopTimer() as TimeEntry;
      expect(stopped.duration_seconds).toBeGreaterThanOrEqual(1);
      expect(stopped.duration_seconds).toBeLessThanOrEqual(3);
    });
  });

  describe('getActiveTimer', () => {
    it('should return null when no timer active', () => {
      const active = TimerService.getActiveTimer();
      expect(active).toBeNull();
    });

    it('should return active timer with task name', () => {
      TimerService.startTimer('Active Task');
      const active = TimerService.getActiveTimer();

      expect(active).toBeDefined();
      expect(active?.task_name).toBe('Active Task');
      expect(active?.end_time).toBeNull();
    });

    it('should return null after stopping timer', () => {
      TimerService.startTimer('Temporary Task');
      TimerService.stopTimer();

      const active = TimerService.getActiveTimer();
      expect(active).toBeNull();
    });
  });

  describe('getTodayEntries', () => {
    it('should return empty array when no entries exist', () => {
      const entries = TimerService.getTodayEntries();
      expect(entries).toEqual([]);
    });

    it('should return only today\'s entries', async () => {
      // Create entry for today
      TimerService.startTimer('Today Task');
      await new Promise((resolve) => setTimeout(resolve, 100));
      TimerService.stopTimer();

      // Create entry for yesterday (manually insert)
      const yesterday = Date.now() - 24 * 60 * 60 * 1000;
      const taskId = TimerService.getOrCreateTask('Yesterday Task');
      testDb
        .prepare('INSERT INTO time_entries (task_id, start_time, end_time) VALUES (?, ?, ?)')
        .run(taskId, yesterday, yesterday + 1000);

      const entries = TimerService.getTodayEntries();
      expect(entries).toHaveLength(1);
      expect(entries[0].task_name).toBe('Today Task');
    });
  });

  describe('getEntriesByDateRange', () => {
    it('should return entries within date range', async () => {
      // Create multiple entries
      TimerService.startTimer('Task 1');
      await new Promise((resolve) => setTimeout(resolve, 100));
      TimerService.stopTimer();

      await new Promise((resolve) => setTimeout(resolve, 100));

      TimerService.startTimer('Task 2');
      await new Promise((resolve) => setTimeout(resolve, 100));
      TimerService.stopTimer();

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const entries = TimerService.getEntriesByDateRange(today, tomorrow);
      expect(entries).toHaveLength(2);
    });

    it('should return empty array for date range with no entries', () => {
      const pastStart = new Date('2020-01-01');
      const pastEnd = new Date('2020-01-02');

      const entries = TimerService.getEntriesByDateRange(pastStart, pastEnd);
      expect(entries).toEqual([]);
    });
  });

  describe('deleteTimeEntry', () => {
    it('should delete an existing entry', async () => {
      const timerId = TimerService.startTimer('Delete Test');
      await new Promise((resolve) => setTimeout(resolve, 100));
      TimerService.stopTimer();

      const deleted = TimerService.deleteTimeEntry(timerId!);
      expect(deleted).toBe(true);

      // Verify it's gone
      const entries = testDb.prepare('SELECT * FROM time_entries WHERE id = ?').get(timerId);
      expect(entries).toBeUndefined();
    });

    it('should return false for non-existent entry', () => {
      const deleted = TimerService.deleteTimeEntry(9999);
      expect(deleted).toBe(false);
    });
  });

  describe('updateNotes', () => {
    it('should update notes for an entry', async () => {
      const timerId = TimerService.startTimer('Notes Test');
      await new Promise((resolve) => setTimeout(resolve, 100));
      TimerService.stopTimer();

      const updated = TimerService.updateNotes(timerId!, 'Test notes here');
      expect(updated).toBe(true);

      // Verify notes were updated
      const entry = testDb
        .prepare('SELECT * FROM time_entries WHERE id = ?')
        .get(timerId) as any;
      expect(entry.notes).toBe('Test notes here');
    });

    it('should return false for non-existent entry', () => {
      const updated = TimerService.updateNotes(9999, 'Notes');
      expect(updated).toBe(false);
    });
  });
});
