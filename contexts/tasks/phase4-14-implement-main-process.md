# Task 14: Implement main.ts (App Initialization & Menu Bar Behavior)

**Phase:** 4 - Electron Main Process
**Dependencies:** Task 10, 11, 12 (Database, Timer Service, Config ready)

## Description

Finalize the main.ts file to properly initialize the app as a menu bar application, hiding from dock and implementing proper lifecycle management.

## Implementation Steps

1. **Update electron/main.ts with complete implementation**

   ```typescript
   import { app, BrowserWindow, Menu } from 'electron';
   import path from 'path';
   import { initDatabase, closeDatabase } from './database';
   import { initConfig, getConfig } from './config';
   import { createMenuBarTray, destroyTray } from './menuBar';

   // Prevent multiple instances
   const gotTheLock = app.requestSingleInstanceLock();
   if (!gotTheLock) {
     app.quit();
   }

   let mainWindow: BrowserWindow | null = null;
   let willQuitApp = false;

   function createWindow(): BrowserWindow {
     mainWindow = new BrowserWindow({
       width: 360,
       height: 480,
       show: false,
       frame: false,
       resizable: false,
       skipTaskbar: true,
       webPreferences: {
         nodeIntegration: false,
         contextIsolation: true,
         preload: path.join(__dirname, 'preload.js'),
       },
     });

     // Load the app
     if (process.env.NODE_ENV === 'development') {
       mainWindow.loadURL('http://localhost:5173');
       // Uncomment to open DevTools in development
       // mainWindow.webContents.openDevTools({ mode: 'detach' });
     } else {
       mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
     }

     // Handle window blur (click outside)
     mainWindow.on('blur', () => {
       if (!mainWindow?.webContents.isDevToolsOpened()) {
         mainWindow?.hide();
       }
     });

     mainWindow.on('closed', () => {
       mainWindow = null;
     });

     return mainWindow;
   }

   // App initialization
   app.whenReady().then(() => {
     // Hide from dock (macOS)
     if (process.platform === 'darwin') {
       app.dock.hide();
     }

     // Initialize services
     console.log('Initializing app...');
     const config = initConfig();
     initDatabase();

     // Create window
     mainWindow = createWindow();

     // Create menu bar tray
     createMenuBarTray(mainWindow);

     console.log('App ready. Config:', config);
   });

   // macOS specific: Don't quit when all windows are closed
   app.on('window-all-closed', (e) => {
     e.preventDefault();
   });

   // Quit app completely
   app.on('before-quit', () => {
     willQuitApp = true;
     closeDatabase();
     destroyTray();
   });

   // Handle second instance
   app.on('second-instance', () => {
     // Show window if user tries to open app again
     if (mainWindow) {
       if (!mainWindow.isVisible()) {
         mainWindow.show();
       }
       mainWindow.focus();
     }
   });

   // macOS: Reopen window when clicking dock icon
   app.on('activate', () => {
     if (mainWindow && !mainWindow.isVisible()) {
       mainWindow.show();
     }
   });

   // Disable default menu in production
   if (process.env.NODE_ENV !== 'development') {
     Menu.setApplicationMenu(null);
   }
   ```

2. **Update package.json to set app name**

   ```json
   {
     "name": "timer",
     "productName": "Timer",
     "version": "0.1.0"
   }
   ```

3. **Test app lifecycle**

   ```bash
   npm run dev
   ```

   Verify:
   - App doesn't appear in dock
   - No default window opens
   - App stays running when window is closed
   - Can quit via menu or keyboard shortcut

4. **Create helper script to quit app**
   Add to package.json scripts:

   ```json
   {
     "scripts": {
       "quit": "killall Electron || true"
     }
   }
   ```

5. **Test single instance lock**
   - Run `npm run dev`
   - Try running `npm run dev` again in another terminal
   - Second instance should exit immediately

## Acceptance Criteria

- [ ] App hidden from dock on macOS
- [ ] Window doesn't show automatically
- [ ] App doesn't quit when window closed
- [ ] Single instance lock prevents multiple instances
- [ ] Database and config initialize on startup
- [ ] Services clean up on quit
- [ ] Window hides when clicking outside (on blur)

## macOS Menu Bar App Behavior

- **Dock:** Hidden (not in dock, not in app switcher)
- **Lifecycle:** Stays running when window closed
- **Window:** Frameless popover (360x480, not resizable)
- **Quit:** Only via explicit quit action

## Testing Commands

```bash
# Start app
npm run dev

# Force quit if needed
npm run quit

# Check if app is running
ps aux | grep Electron
```

## References

- project_init.md lines 47-51, 80-91 (Menu bar integration & behavior)
- project_init.md lines 64-78 (Window configuration)
