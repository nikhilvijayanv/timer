# Task 24: Integrate Timer Start/Stop Functionality End-to-End

**Phase:** 6 - Timer Logic & Integration
**Dependencies:** Task 19 (Timer components), Task 16 (IPC bridge), Task 18 (Tray updates)

## Description

Ensure complete integration of timer start/stop functionality across all layers: UI → IPC → Main Process → Database → Tray updates.

## Implementation Steps

1. **Verify IPC handlers are complete**
   Check `electron/ipcHandlers.ts` has all timer methods properly wired

2. **Test timer start flow**
   Create test checklist:

   ```typescript
   // electron/test/timerFlow.test.ts (manual test checklist)
   /**
    * Timer Start Flow Test
    *
    * 1. User enters task name in QuickTaskEntry
    * 2. Clicks "Start" or presses Enter
    * 3. QuickTaskEntry calls window.electron.timer.start()
    * 4. IPC sends to main process
    * 5. TimerService.startTimer() creates DB entry
    * 6. IPC returns entry ID
    * 7. Timer:updated event sent to renderer
    * 8. TimerContext refreshes active timer
    * 9. CompactTimerView appears
    * 10. QuickTaskEntry hides
    * 11. Tray title updates to "⏱ 0:01"
    * 12. TodayEntries updates with new entry (when stopped)
    */
   ```

3. **Test timer stop flow**

   ```typescript
   /**
    * Timer Stop Flow Test
    *
    * 1. User clicks stop button in CompactTimerView
    * 2. Calls window.electron.timer.stop()
    * 3. IPC sends to main process
    * 4. TimerService.stopTimer() updates DB
    * 5. Calculates duration_seconds
    * 6. IPC returns completed entry
    * 7. Timer:updated event sent to renderer
    * 8. TimerContext refreshes (now null)
    * 9. CompactTimerView hides
    * 10. QuickTaskEntry reappears
    * 11. Tray title resets to "Timer"
    * 12. TodayEntries shows completed entry
    */
   ```

4. **Add error handling to UI**
   Update `src/features/Timer/QuickTaskEntry.tsx`:

   ```typescript
   const [error, setError] = useState<string | null>(null);

   const handleStart = async (name?: string) => {
     const taskToStart = name || taskName;
     if (!taskToStart.trim() || activeTimer) return;

     setIsStarting(true);
     setError(null);
     try {
       const result = await window.electron.timer.start(taskToStart.trim());
       if (result === null) {
         setError('Failed to start timer. Is another timer running?');
         return;
       }
       setTaskName('');
       await refreshTimer();
     } catch (err) {
       console.error('Error starting timer:', err);
       setError('Failed to start timer. Please try again.');
     } finally {
       setIsStarting(false);
     }
   };

   // Add error display in JSX
   {error && (
     <p className="text-xs text-destructive">{error}</p>
   )}
   ```

5. **Add error handling to CompactTimerView**

   ```typescript
   const [error, setError] = useState<string | null>(null);

   const handleStop = async () => {
     setError(null);
     try {
       const result = await window.electron.timer.stop();
       if (!result) {
         setError('Failed to stop timer.');
         return;
       }
       await refreshTimer();
     } catch (err) {
       console.error('Error stopping timer:', err);
       setError('Failed to stop timer. Please try again.');
     }
   };
   ```

6. **Add loading states**
   Update UI components to show loading indicators:

   ```typescript
   // In QuickTaskEntry
   {isStarting && <LoadingSpinner />}

   // In CompactTimerView
   const [isStopping, setIsStopping] = useState(false);
   ```

7. **Create integration test script**
   Create `scripts/test-timer-integration.md`:

   ```markdown
   # Timer Integration Test

   ## Prerequisites

   - App running in development mode
   - Database cleared (or fresh start)

   ## Test Cases

   ### 1. Start First Timer

   - [ ] Open app
   - [ ] Enter task name "Test Task 1"
   - [ ] Click Start
   - [ ] Verify CompactTimerView appears
   - [ ] Verify tray shows "⏱ 0:01" (after 1 sec)
   - [ ] Verify QuickTaskEntry hidden
   - [ ] Check database has entry with null end_time

   ### 2. Stop Timer

   - [ ] Wait 5 seconds
   - [ ] Click stop button
   - [ ] Verify CompactTimerView disappears
   - [ ] Verify QuickTaskEntry reappears
   - [ ] Verify tray shows "Timer"
   - [ ] Verify TodayEntries shows completed entry
   - [ ] Check database entry has end_time and duration_seconds

   ### 3. Start Second Timer

   - [ ] Enter "Test Task 2"
   - [ ] Click Start
   - [ ] Verify new timer starts
   - [ ] Verify tray updates

   ### 4. Global Shortcut

   - [ ] With timer running, press global shortcut
   - [ ] Verify timer stops
   - [ ] Press shortcut again
   - [ ] Verify new timer starts with "Quick Timer"

   ### 5. Error Handling

   - [ ] Attempt to start timer with empty name
   - [ ] Verify button disabled
   - [ ] Start a timer
   - [ ] Try to start another (should fail gracefully)

   ### 6. Window Hide/Show

   - [ ] Start timer
   - [ ] Close window (click X or blur)
   - [ ] Verify tray continues updating
   - [ ] Reopen window
   - [ ] Verify timer still running
   ```

8. **Run integration tests manually**

   ```bash
   npm run dev
   ```

   Follow the test script above

9. **Fix any issues found**
   Document and fix any bugs discovered during testing

## Acceptance Criteria

- [ ] Timer start works from UI
- [ ] Timer stop works from UI
- [ ] Database entries created/updated correctly
- [ ] Tray updates immediately on start/stop
- [ ] UI components show/hide correctly
- [ ] Error messages display for failures
- [ ] Loading states show during operations
- [ ] Global shortcut toggles timer
- [ ] Window hide doesn't affect timer
- [ ] All integration points work smoothly

## Common Issues to Check

- **Database locked:** Ensure proper connection management
- **IPC timeout:** Check async/await chains
- **State sync:** TimerContext updates correctly
- **Memory leaks:** Event listeners cleaned up
- **Race conditions:** Start/stop happening too quickly

## Debug Tools

Add debug logging:

```typescript
// In TimerContext
console.log('[TimerContext] Active timer:', activeTimer);

// In IPC handlers
console.log('[IPC] timer:start received:', taskName);

// In TimerService
console.log('[TimerService] Creating entry:', { taskId, startTime });
```

## Performance Check

- Timer updates should be smooth (60fps)
- No lag when clicking start/stop
- Tray updates within 1 second
- Database operations < 10ms

## References

- project_init.md lines 158-162 (Renderer components flow)
- project_init.md lines 146-150 (TimerService logic)
