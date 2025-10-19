# Task 16: Implement preload.ts (IPC Bridge with contextBridge)

**Phase:** 4 - Electron Main Process
**Dependencies:** Task 11 (TimerService created), Task 12 (Config service created)

## Description

Implement the preload script that safely exposes Electron APIs to the renderer process using contextBridge, following security best practices.

## Implementation Steps

1. **Update electron/preload.ts with full IPC bridge**

   ```typescript
   import { contextBridge, ipcRenderer } from 'electron';

   // Define the API interface that will be exposed to renderer
   const electronAPI = {
     // Timer operations
     timer: {
       start: (taskName: string) => ipcRenderer.invoke('timer:start', taskName),
       stop: () => ipcRenderer.invoke('timer:stop'),
       getActive: () => ipcRenderer.invoke('timer:getActive'),
       getTodayEntries: () => ipcRenderer.invoke('timer:getTodayEntries'),
       deleteEntry: (entryId: number) => ipcRenderer.invoke('timer:deleteEntry', entryId),
       updateNotes: (entryId: number, notes: string) =>
         ipcRenderer.invoke('timer:updateNotes', entryId, notes),
     },

     // Task operations
     tasks: {
       getAll: () => ipcRenderer.invoke('tasks:getAll'),
       create: (name: string) => ipcRenderer.invoke('tasks:create', name),
     },

     // Config operations
     config: {
       get: () => ipcRenderer.invoke('config:get'),
       update: (updates: any) => ipcRenderer.invoke('config:update', updates),
       getPath: () => ipcRenderer.invoke('config:getPath'),
     },

     // Window operations
     window: {
       hide: () => ipcRenderer.send('window:hide'),
       show: () => ipcRenderer.send('window:show'),
     },

     // Event listeners
     on: (channel: string, callback: (...args: any[]) => void) => {
       const validChannels = ['timer:updated', 'config:updated', 'tray:clicked'];

       if (validChannels.includes(channel)) {
         const subscription = (_event: any, ...args: any[]) => callback(...args);
         ipcRenderer.on(channel, subscription);

         // Return unsubscribe function
         return () => {
           ipcRenderer.removeListener(channel, subscription);
         };
       }

       throw new Error(`Invalid channel: ${channel}`);
     },

     // Remove listener
     removeAllListeners: (channel: string) => {
       ipcRenderer.removeAllListeners(channel);
     },
   };

   // Expose the API to the renderer process
   contextBridge.exposeInMainWorld('electron', electronAPI);

   // Type definitions for TypeScript (will create in next step)
   export type ElectronAPI = typeof electronAPI;
   ```

2. **Create TypeScript definitions for renderer**
   Create `src/types/electron.d.ts`:

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

   export interface AppConfig {
     globalShortcut: string;
     theme: 'light' | 'dark' | 'system';
     soundEnabled: boolean;
     startSound: string;
     stopSound: string;
   }

   export interface ElectronAPI {
     timer: {
       start: (taskName: string) => Promise<number | null>;
       stop: () => Promise<TimeEntry | null>;
       getActive: () => Promise<TimeEntry | null>;
       getTodayEntries: () => Promise<TimeEntry[]>;
       deleteEntry: (entryId: number) => Promise<boolean>;
       updateNotes: (entryId: number, notes: string) => Promise<boolean>;
     };
     tasks: {
       getAll: () => Promise<Task[]>;
       create: (name: string) => Promise<number>;
     };
     config: {
       get: () => Promise<AppConfig>;
       update: (updates: Partial<AppConfig>) => Promise<AppConfig>;
       getPath: () => Promise<string>;
     };
     window: {
       hide: () => void;
       show: () => void;
     };
     on: (channel: string, callback: (...args: any[]) => void) => () => void;
     removeAllListeners: (channel: string) => void;
   }

   declare global {
     interface Window {
       electron: ElectronAPI;
     }
   }
   ```

3. **Create IPC handlers in main process**
   Create `electron/ipcHandlers.ts`:

   ```typescript
   import { ipcMain, BrowserWindow } from 'electron';
   import { TimerService } from './services/TimerService';
   import { getConfig, updateConfig, getConfigPath } from './config';
   import { hideWindow } from './menuBar';

   export function registerIPCHandlers() {
     // Timer handlers
     ipcMain.handle('timer:start', async (_event, taskName: string) => {
       return TimerService.startTimer(taskName);
     });

     ipcMain.handle('timer:stop', async () => {
       return TimerService.stopTimer();
     });

     ipcMain.handle('timer:getActive', async () => {
       return TimerService.getActiveTimer();
     });

     ipcMain.handle('timer:getTodayEntries', async () => {
       return TimerService.getTodayEntries();
     });

     ipcMain.handle('timer:deleteEntry', async (_event, entryId: number) => {
       return TimerService.deleteTimeEntry(entryId);
     });

     ipcMain.handle('timer:updateNotes', async (_event, entryId: number, notes: string) => {
       return TimerService.updateNotes(entryId, notes);
     });

     // Task handlers
     ipcMain.handle('tasks:getAll', async () => {
       return TimerService.getAllTasks();
     });

     ipcMain.handle('tasks:create', async (_event, name: string) => {
       return TimerService.getOrCreateTask(name);
     });

     // Config handlers
     ipcMain.handle('config:get', async () => {
       return getConfig();
     });

     ipcMain.handle('config:update', async (_event, updates: any) => {
       return updateConfig(updates);
     });

     ipcMain.handle('config:getPath', async () => {
       return getConfigPath();
     });

     // Window handlers
     ipcMain.on('window:hide', () => {
       hideWindow();
     });

     ipcMain.on('window:show', (_event) => {
       const window = BrowserWindow.fromWebContents(_event.sender);
       window?.show();
     });

     console.log('IPC handlers registered');
   }
   ```

4. **Register IPC handlers in main.ts**

   ```typescript
   import { registerIPCHandlers } from './ipcHandlers';

   app.whenReady().then(() => {
     // ... existing initialization code ...

     // Register IPC handlers
     registerIPCHandlers();

     // ... rest of initialization ...
   });
   ```

5. **Test IPC communication**
   In src/App.tsx, add test code:

   ```typescript
   import { useEffect, useState } from 'react';

   function App() {
     const [activeTimer, setActiveTimer] = useState<any>(null);

     useEffect(() => {
       // Test IPC
       window.electron.timer.getActive().then((timer) => {
         console.log('Active timer:', timer);
         setActiveTimer(timer);
       });

       window.electron.config.get().then((config) => {
         console.log('Config:', config);
       });
     }, []);

     const handleStart = async () => {
       const result = await window.electron.timer.start('Test Task');
       console.log('Timer started:', result);
     };

     const handleStop = async () => {
       const result = await window.electron.timer.stop();
       console.log('Timer stopped:', result);
     };

     return (
       <div className="p-4">
         <h1>IPC Test</h1>
         <button onClick={handleStart}>Start Timer</button>
         <button onClick={handleStop}>Stop Timer</button>
         {activeTimer && <p>Active: {activeTimer.task_name}</p>}
       </div>
     );
   }

   export default App;
   ```

6. **Run and verify IPC**

   ```bash
   npm run dev
   ```

   Check console for:
   - "IPC handlers registered"
   - Config and active timer logs
   - Test start/stop buttons work

## Acceptance Criteria

- [ ] preload.ts exposes API via contextBridge
- [ ] TypeScript definitions created for renderer
- [ ] IPC handlers registered in main process
- [ ] Timer operations work via IPC
- [ ] Config operations work via IPC
- [ ] Task operations work via IPC
- [ ] Window operations work via IPC
- [ ] Event listeners can be registered
- [ ] No security warnings in console

## Security Checklist

- ✓ nodeIntegration disabled
- ✓ contextIsolation enabled
- ✓ Using contextBridge (not window directly)
- ✓ IPC channels are validated
- ✓ No eval or remote code execution
- ✓ Preload script limits exposed APIs

## IPC Communication Flow

```
Renderer (React)
  ↓ window.electron.timer.start()
Preload (contextBridge)
  ↓ ipcRenderer.invoke('timer:start')
Main Process (ipcMain)
  ↓ ipcMain.handle('timer:start')
TimerService
  ↓ Database operation
Return result
```

## References

- project_init.md lines 21, 150, 232-236 (IPC & security)
- project_init.md lines 64-77 (WebPreferences config)
