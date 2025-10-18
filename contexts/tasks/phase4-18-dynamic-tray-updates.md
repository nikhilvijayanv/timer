# Task 18: Implement Dynamic Tray Title Updates

**Phase:** 4 - Electron Main Process
**Dependencies:** Task 15 (Menu bar created), Task 11 (TimerService)

## Description
Add functionality to update the menu bar tray title to display the elapsed time when a timer is running (e.g., "⏱ 1:23:45").

## Implementation Steps

1. **Create timer display utility**
   Create `electron/utils/timeFormat.ts`:
   ```typescript
   /**
    * Format seconds into HH:MM:SS or MM:SS
    */
   export function formatElapsedTime(seconds: number): string {
     const hours = Math.floor(seconds / 3600);
     const minutes = Math.floor((seconds % 3600) / 60);
     const secs = seconds % 60;

     if (hours > 0) {
       return `${hours}:${pad(minutes)}:${pad(secs)}`;
     } else {
       return `${minutes}:${pad(secs)}`;
     }
   }

   /**
    * Pad number with leading zero
    */
   function pad(num: number): string {
     return num.toString().padStart(2, '0');
   }

   /**
    * Get elapsed seconds from start time
    */
   export function getElapsedSeconds(startTime: number): number {
     return Math.floor((Date.now() - startTime) / 1000);
   }

   /**
    * Format tray title with timer emoji and time
    */
   export function formatTrayTitle(elapsedSeconds: number | null): string {
     if (elapsedSeconds === null) {
       return 'Timer'; // No active timer
     }

     const timeStr = formatElapsedTime(elapsedSeconds);
     return `⏱ ${timeStr}`;
   }
   ```

2. **Create tray update service**
   Create `electron/trayUpdater.ts`:
   ```typescript
   import { TimerService } from './services/TimerService';
   import { updateTrayTitle } from './menuBar';
   import { getElapsedSeconds, formatTrayTitle } from './utils/timeFormat';

   let updateInterval: NodeJS.Timeout | null = null;

   /**
    * Start updating tray title every second
    */
   export function startTrayUpdates(): void {
     // Clear existing interval
     stopTrayUpdates();

     // Update immediately
     updateTrayDisplay();

     // Then update every second
     updateInterval = setInterval(() => {
       updateTrayDisplay();
     }, 1000);

     console.log('Tray updates started');
   }

   /**
    * Stop updating tray title
    */
   export function stopTrayUpdates(): void {
     if (updateInterval) {
       clearInterval(updateInterval);
       updateInterval = null;
       console.log('Tray updates stopped');
     }
   }

   /**
    * Update tray display based on active timer
    */
   function updateTrayDisplay(): void {
     const activeTimer = TimerService.getActiveTimer();

     if (activeTimer) {
       const elapsedSeconds = getElapsedSeconds(activeTimer.start_time);
       const title = formatTrayTitle(elapsedSeconds);
       updateTrayTitle(title);
     } else {
       updateTrayTitle('Timer');
     }
   }

   /**
    * Force immediate tray update
    */
   export function refreshTrayDisplay(): void {
     updateTrayDisplay();
   }
   ```

3. **Start tray updates in main.ts**
   ```typescript
   import { startTrayUpdates, stopTrayUpdates } from './trayUpdater';

   app.whenReady().then(() => {
     // ... existing initialization ...

     createMenuBarTray(mainWindow);

     // Start tray title updates
     startTrayUpdates();

     // ... rest of initialization ...
   });

   app.on('before-quit', () => {
     // ... existing cleanup ...
     stopTrayUpdates();
   });
   ```

4. **Update shortcuts.ts to refresh tray**
   ```typescript
   import { refreshTrayDisplay } from './trayUpdater';

   function handleShortcutPressed(): void {
     console.log('Global shortcut pressed');

     const activeTimer = TimerService.getActiveTimer();

     if (activeTimer) {
       TimerService.stopTimer();
       console.log('Timer stopped via shortcut');
     } else {
       const defaultTaskName = 'Quick Timer';
       TimerService.startTimer(defaultTaskName);
       console.log('Timer started via shortcut');
     }

     // Refresh tray immediately
     refreshTrayDisplay();
   }
   ```

5. **Add IPC event to notify renderer of timer changes**
   Update `electron/ipcHandlers.ts`:
   ```typescript
   import { BrowserWindow } from 'electron';
   import { refreshTrayDisplay } from './trayUpdater';

   export function registerIPCHandlers() {
     // ... existing handlers ...

     ipcMain.handle('timer:start', async (_event, taskName: string) => {
       const result = TimerService.startTimer(taskName);

       // Refresh tray immediately
       refreshTrayDisplay();

       // Notify all windows
       BrowserWindow.getAllWindows().forEach((win) => {
         win.webContents.send('timer:updated');
       });

       return result;
     });

     ipcMain.handle('timer:stop', async () => {
       const result = TimerService.stopTimer();

       // Refresh tray immediately
       refreshTrayDisplay();

       // Notify all windows
       BrowserWindow.getAllWindows().forEach((win) => {
         win.webContents.send('timer:updated');
       });

       return result;
     });
   }
   ```

6. **Test tray updates**
   ```bash
   npm run dev
   ```

   Test:
   - Start a timer via global shortcut
   - Watch menu bar - should show "⏱ 0:01", "⏱ 0:02", etc.
   - Stop timer - should show "Timer"
   - Start another timer - time should reset and count up

7. **Test performance**
   Monitor CPU usage - the 1-second interval should be minimal impact

## Acceptance Criteria
- [ ] Tray title shows elapsed time when timer running
- [ ] Format is "⏱ MM:SS" for times under 1 hour
- [ ] Format is "⏱ H:MM:SS" for times over 1 hour
- [ ] Updates every second
- [ ] Shows "Timer" when no timer is active
- [ ] Updates stop when app quits
- [ ] CPU usage remains low (< 1%)
- [ ] Tray updates immediately on start/stop

## Display Examples
```
No timer:     Timer
0-59 mins:    ⏱ 12:34
1+ hours:     ⏱ 1:23:45
Long times:   ⏱ 12:34:56
```

## Performance Considerations
- setInterval runs in main process (lightweight)
- Only queries database once per second (fast with indexed queries)
- String formatting is trivial CPU cost
- Consider pausing updates when window is hidden (optimization for later)

## Alternative Implementations (Not for this task)
- Event-driven updates (only when timer state changes)
- Renderer-driven updates (send time to main process)
- Use native timers instead of setInterval

## Future Enhancements (Not in this task)
- Show task name in tray tooltip
- Different icons for running vs stopped
- Badge/notification dot on tray icon
- Configurable update frequency

## References
- project_init.md lines 48 (Timer display in menu bar title)
- project_init.md lines 23, 136-140 (MenuBar module)
