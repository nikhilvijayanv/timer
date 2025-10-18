# Task 17: Configure Global Keyboard Shortcut Handling

**Phase:** 4 - Electron Main Process
**Dependencies:** Task 12 (Config service), Task 15 (Menu bar created)

## Description
Implement global keyboard shortcut functionality that toggles the timer (start if stopped, stop if running) based on config.json settings.

## Implementation Steps

1. **Create electron/shortcuts.ts**
   ```typescript
   import { app, globalShortcut } from 'electron';
   import { getConfig } from './config';
   import { TimerService } from './services/TimerService';
   import { updateTrayTitle } from './menuBar';

   let registeredShortcut: string | null = null;

   /**
    * Register global shortcut from config
    */
   export function registerGlobalShortcut(): boolean {
     const config = getConfig();
     const shortcut = config.globalShortcut;

     // Unregister existing shortcut if any
     if (registeredShortcut) {
       globalShortcut.unregister(registeredShortcut);
       registeredShortcut = null;
     }

     try {
       const success = globalShortcut.register(shortcut, () => {
         handleShortcutPressed();
       });

       if (success) {
         registeredShortcut = shortcut;
         console.log(`Global shortcut registered: ${shortcut}`);
         return true;
       } else {
         console.error(`Failed to register shortcut: ${shortcut}`);
         return false;
       }
     } catch (error) {
       console.error(`Error registering shortcut: ${shortcut}`, error);
       return false;
     }
   }

   /**
    * Handle global shortcut press - toggle timer
    */
   function handleShortcutPressed(): void {
     console.log('Global shortcut pressed');

     const activeTimer = TimerService.getActiveTimer();

     if (activeTimer) {
       // Stop active timer
       const stopped = TimerService.stopTimer();
       console.log('Timer stopped via shortcut:', stopped);

       // Update tray
       updateTrayTitle('Timer');

       // TODO: Play stop sound (will implement in Phase 6)
     } else {
       // Start new timer with default task name
       const defaultTaskName = 'Quick Timer';
       const timerId = TimerService.startTimer(defaultTaskName);
       console.log('Timer started via shortcut:', timerId);

       // TODO: Play start sound (will implement in Phase 6)
     }
   }

   /**
    * Unregister all shortcuts
    */
   export function unregisterGlobalShortcut(): void {
     if (registeredShortcut) {
       globalShortcut.unregister(registeredShortcut);
       console.log('Global shortcut unregistered');
       registeredShortcut = null;
     }
   }

   /**
    * Unregister all shortcuts on quit
    */
   export function unregisterAllShortcuts(): void {
     globalShortcut.unregisterAll();
     console.log('All global shortcuts unregistered');
     registeredShortcut = null;
   }

   /**
    * Check if a shortcut is registered
    */
   export function isShortcutRegistered(): boolean {
     return registeredShortcut !== null;
   }

   /**
    * Get currently registered shortcut
    */
   export function getRegisteredShortcut(): string | null {
     return registeredShortcut;
   }
   ```

2. **Update electron/main.ts to register shortcut**
   ```typescript
   import { registerGlobalShortcut, unregisterAllShortcuts } from './shortcuts';

   app.whenReady().then(() => {
     // ... existing initialization ...

     // Register global shortcut
     const shortcutRegistered = registerGlobalShortcut();
     if (!shortcutRegistered) {
       console.warn('Could not register global shortcut. Check config.json');
     }

     // ... rest of initialization ...
   });

   app.on('before-quit', () => {
     // ... existing cleanup ...
     unregisterAllShortcuts();
   });
   ```

3. **Add shortcut validation to config.ts**
   Update the `isValidShortcut` function if needed:
   ```typescript
   export function isValidShortcut(shortcut: string): boolean {
     // Electron accelerator format validation
     const parts = shortcut.split('+');

     // Must have at least one modifier and one key
     if (parts.length < 2) return false;

     const validModifiers = [
       'CommandOrControl', 'CmdOrCtrl', 'Command', 'Cmd',
       'Control', 'Ctrl', 'Alt', 'Option', 'AltGr',
       'Shift', 'Super', 'Meta'
     ];

     // Check if all parts except the last are valid modifiers
     for (let i = 0; i < parts.length - 1; i++) {
       if (!validModifiers.includes(parts[i])) {
         return false;
       }
     }

     // Last part should be a key (simplified check)
     const key = parts[parts.length - 1];
     return key.length > 0;
   }
   ```

4. **Add IPC handler for shortcut management**
   Update `electron/ipcHandlers.ts`:
   ```typescript
   import { registerGlobalShortcut, getRegisteredShortcut } from './shortcuts';

   export function registerIPCHandlers() {
     // ... existing handlers ...

     // Shortcut handlers
     ipcMain.handle('shortcuts:get', async () => {
       return getRegisteredShortcut();
     });

     ipcMain.handle('shortcuts:register', async (_event, shortcut: string) => {
       // Update config first
       updateConfig({ globalShortcut: shortcut });

       // Then register the new shortcut
       return registerGlobalShortcut();
     });
   }
   ```

5. **Update preload.ts to expose shortcut API**
   ```typescript
   const electronAPI = {
     // ... existing APIs ...

     shortcuts: {
       get: () => ipcRenderer.invoke('shortcuts:get'),
       register: (shortcut: string) => ipcRenderer.invoke('shortcuts:register', shortcut),
     },
   };
   ```

6. **Test global shortcut**
   ```bash
   npm run dev
   ```

   Test:
   - Press the default shortcut: `Cmd+Option+Shift+.` (macOS) or `Ctrl+Alt+Shift+.` (Windows/Linux)
   - Should toggle timer on/off
   - Check console logs for "Timer started/stopped via shortcut"
   - Verify timer entries created in database

7. **Test shortcut registration failure**
   Edit config.json with an invalid shortcut:
   ```json
   {
     "globalShortcut": "InvalidShortcut"
   }
   ```

   Restart app and verify it logs a warning

## Acceptance Criteria
- [ ] Global shortcut registered on app start
- [ ] Shortcut from config.json is used
- [ ] Pressing shortcut toggles timer (start/stop)
- [ ] Invalid shortcuts handled gracefully
- [ ] Shortcuts unregistered on app quit
- [ ] Can change shortcut via IPC
- [ ] Shortcut works even when app window is hidden

## Shortcut Format
Electron accelerator format:
- Modifiers: `CommandOrControl`, `Cmd`, `Ctrl`, `Alt`, `Shift`, `Super`
- Keys: A-Z, 0-9, F1-F24, punctuation (`.`, `,`, `/`, etc.)
- Format: `Modifier+Modifier+Key`

Examples:
- `CommandOrControl+Alt+Shift+.` (cross-platform)
- `Command+Shift+T` (macOS)
- `Ctrl+Alt+P` (Windows/Linux)

## Testing Different Shortcuts
Try these shortcuts in config.json:
```json
{ "globalShortcut": "CommandOrControl+Shift+T" }
{ "globalShortcut": "Alt+Shift+Space" }
{ "globalShortcut": "CommandOrControl+Alt+Shift+." }
```

## Troubleshooting
- **Shortcut doesn't work:** Check if another app is using it
- **Registration fails:** Validate shortcut format
- **Works inconsistently:** Make sure app is in focus or has accessibility permissions (macOS)

## References
- project_init.md lines 52, 162-167 (Global shortcut requirements)
- project_init.md lines 108, 117-119 (Config usage)
- [Electron Accelerator](https://www.electronjs.org/docs/latest/api/accelerator)
