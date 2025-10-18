# Task 28: Wire Up All IPC Communication and Events

**Phase:** 6 - Timer Logic & Integration
**Dependencies:** Task 16 (IPC bridge), Task 24 (Timer integration), Task 27 (Config sync)

## Description
Ensure all IPC communication is properly wired up, events are handled correctly, and there are no memory leaks from event listeners.

## Implementation Steps

1. **Audit all IPC channels**
   Create checklist of all IPC communications:

   **Invoke (Request/Response):**
   - `timer:start` → TimerService.startTimer()
   - `timer:stop` → TimerService.stopTimer()
   - `timer:getActive` → TimerService.getActiveTimer()
   - `timer:getTodayEntries` → TimerService.getTodayEntries()
   - `timer:deleteEntry` → TimerService.deleteTimeEntry()
   - `timer:updateNotes` → TimerService.updateNotes()
   - `tasks:getAll` → TimerService.getAllTasks()
   - `tasks:create` → TimerService.getOrCreateTask()
   - `config:get` → getConfig()
   - `config:update` → updateConfig()
   - `config:getPath` → getConfigPath()
   - `shortcuts:get` → getRegisteredShortcut()
   - `shortcuts:register` → registerGlobalShortcut()

   **Events (Main → Renderer):**
   - `timer:updated` - When timer state changes
   - `config:updated` - When config changes
   - `sound:play` - Play sound from main process

   **Send (Renderer → Main):**
   - `window:hide` - Hide window
   - `window:show` - Show window

2. **Verify all IPC handlers are registered**
   Check `electron/ipcHandlers.ts` has all handlers

3. **Add comprehensive error handling**
   Update `electron/ipcHandlers.ts`:
   ```typescript
   export function registerIPCHandlers() {
     // Timer handlers with error handling
     ipcMain.handle('timer:start', async (_event, taskName: string) => {
       try {
         if (!taskName || typeof taskName !== 'string') {
           throw new Error('Invalid task name');
         }
         const result = TimerService.startTimer(taskName);

         // Broadcast update to all windows
         BrowserWindow.getAllWindows().forEach((win) => {
           win.webContents.send('timer:updated');
         });

         return result;
       } catch (error) {
         console.error('Error in timer:start:', error);
         throw error;
       }
     });

     ipcMain.handle('timer:stop', async () => {
       try {
         const result = TimerService.stopTimer();

         // Broadcast update to all windows
         BrowserWindow.getAllWindows().forEach((win) => {
           win.webContents.send('timer:updated');
         });

         return result;
       } catch (error) {
         console.error('Error in timer:stop:', error);
         throw error;
       }
     });

     // ... similar error handling for all handlers
   }
   ```

4. **Create IPC testing utility**
   Create `src/utils/ipcTest.ts`:
   ```typescript
   /**
    * Test IPC communication
    */
   export async function testIPC() {
     console.group('IPC Communication Test');

     try {
       // Test config
       console.log('Testing config...');
       const config = await window.electron.config.get();
       console.log('✓ Config loaded:', config);

       // Test tasks
       console.log('Testing tasks...');
       const tasks = await window.electron.tasks.getAll();
       console.log('✓ Tasks loaded:', tasks.length);

       // Test timer state
       console.log('Testing timer...');
       const activeTimer = await window.electron.timer.getActive();
       console.log('✓ Active timer:', activeTimer);

       // Test today entries
       const entries = await window.electron.timer.getTodayEntries();
       console.log('✓ Today entries:', entries.length);

       console.log('✓ All IPC tests passed');
     } catch (error) {
       console.error('✗ IPC test failed:', error);
     } finally {
       console.groupEnd();
     }
   }

   // Expose for debugging
   if (typeof window !== 'undefined') {
     (window as any).testIPC = testIPC;
   }
   ```

5. **Check for memory leaks in event listeners**
   Update all contexts to properly clean up:

   ```typescript
   // TimerContext.tsx
   useEffect(() => {
     refreshTimer();

     const unsubscribe = window.electron.on('timer:updated', () => {
       refreshTimer();
     });

     // IMPORTANT: Clean up on unmount
     return () => {
       unsubscribe();
     };
   }, []);
   ```

6. **Add IPC debugging helper**
   Create `electron/ipcDebug.ts`:
   ```typescript
   import { ipcMain } from 'electron';

   export function enableIPCDebug() {
     const originalHandle = ipcMain.handle.bind(ipcMain);
     const originalOn = ipcMain.on.bind(ipcMain);

     ipcMain.handle = (channel: string, listener: any) => {
       console.log(`[IPC] Handler registered: ${channel}`);
       return originalHandle(channel, async (...args: any[]) => {
         console.log(`[IPC] → ${channel}`, args[1]); // args[0] is event
         try {
           const result = await listener(...args);
           console.log(`[IPC] ← ${channel}`, result);
           return result;
         } catch (error) {
           console.error(`[IPC] ✗ ${channel}`, error);
           throw error;
         }
       });
     };

     ipcMain.on = (channel: string, listener: any) => {
       console.log(`[IPC] Listener registered: ${channel}`);
       return originalOn(channel, (...args: any[]) => {
         console.log(`[IPC] Event: ${channel}`, args[1]);
         listener(...args);
       });
     };
   }
   ```

7. **Enable debug in development**
   Update `electron/main.ts`:
   ```typescript
   import { enableIPCDebug } from './ipcDebug';

   if (process.env.NODE_ENV === 'development') {
     enableIPCDebug();
   }
   ```

8. **Test all IPC flows**
   Create `scripts/test-ipc.md`:
   ```markdown
   # IPC Communication Test Checklist

   ## Timer Operations
   - [ ] Start timer via UI
   - [ ] Stop timer via UI
   - [ ] Get active timer on load
   - [ ] Get today's entries
   - [ ] Delete entry
   - [ ] Update notes on entry

   ## Task Operations
   - [ ] Get all tasks
   - [ ] Create new task
   - [ ] Select task from dropdown

   ## Config Operations
   - [ ] Load config on app start
   - [ ] Update theme via settings
   - [ ] Update sound preference
   - [ ] Update global shortcut
   - [ ] Get config path

   ## Events
   - [ ] timer:updated fires on start
   - [ ] timer:updated fires on stop
   - [ ] sound:play fires from shortcut
   - [ ] Events received in all open windows (if multiple)

   ## Window Operations
   - [ ] Hide window via close button
   - [ ] Show window via tray click

   ## Error Handling
   - [ ] Invalid task name handled
   - [ ] Network/DB errors don't crash app
   - [ ] Error messages shown to user

   ## Memory
   - [ ] Event listeners cleaned up on unmount
   - [ ] No memory leaks over time
   - [ ] App responsive after many operations
   ```

9. **Run comprehensive IPC test**
   ```bash
   npm run dev
   ```

   In browser console:
   ```javascript
   window.testIPC()
   ```

   Should see all tests pass

10. **Check for race conditions**
    Test rapid operations:
    - Start/stop timer quickly multiple times
    - Create many tasks rapidly
    - Switch views while loading

## Acceptance Criteria
- [ ] All IPC handlers registered
- [ ] All IPC channels documented
- [ ] Error handling on all handlers
- [ ] Event listeners properly cleaned up
- [ ] No memory leaks
- [ ] No race conditions
- [ ] Debug logging in development
- [ ] All IPC tests pass

## Common Issues to Fix
- **Unhandled promise rejections:** Add try/catch
- **Memory leaks:** Ensure `unsubscribe()` called
- **Stale closures:** Use refs or deps correctly
- **Race conditions:** Add debouncing if needed

## IPC Best Practices
- ✓ Always handle errors in IPC handlers
- ✓ Validate input parameters
- ✓ Return consistent response types
- ✓ Clean up event listeners
- ✓ Use `invoke` for request/response
- ✓ Use `send` for fire-and-forget
- ✓ Broadcast events to all windows
- ✓ Log operations in development

## Performance Monitoring
```typescript
// Add to IPC handlers for slow operations
const start = Date.now();
const result = await TimerService.startTimer(taskName);
const duration = Date.now() - start;
if (duration > 100) {
  console.warn(`Slow IPC operation: timer:start took ${duration}ms`);
}
```

## References
- project_init.md lines 21, 150, 232-236 (IPC & security)
- project_init.md lines 64-77 (WebPreferences with contextIsolation)
