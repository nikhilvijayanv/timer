import { app, BrowserWindow, Menu } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase, closeDatabase } from './database';
import { initConfig } from './config';
import { createMenuBarTray, destroyTray } from './menuBar';
import { registerIPCHandlers } from './ipcHandlers';
import { registerGlobalShortcut, unregisterAllShortcuts } from './shortcuts';
import { startTrayUpdates, stopTrayUpdates } from './trayUpdater';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

  // Register IPC handlers
  registerIPCHandlers();

  // Register global shortcut
  const shortcutRegistered = registerGlobalShortcut();
  if (!shortcutRegistered) {
    console.warn('Could not register global shortcut. Check config.json');
  }

  // Create window
  mainWindow = createWindow();

  // Create menu bar tray
  createMenuBarTray(mainWindow);

  // Start tray title updates
  startTrayUpdates();

  console.log('App ready. Config:', config);
});

// macOS specific: Don't quit when all windows are closed
app.on('window-all-closed', (e) => {
  e.preventDefault();
});

// Quit app completely
app.on('before-quit', () => {
  willQuitApp = true;
  stopTrayUpdates();
  unregisterAllShortcuts();
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
