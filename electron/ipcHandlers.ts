import { ipcMain, BrowserWindow } from 'electron';
import { TimerService } from './services/TimerService';
import { getConfig, updateConfig, getConfigPath } from './config';
import { hideWindow } from './menuBar';
import { registerGlobalShortcut, getRegisteredShortcut } from './shortcuts';
import { refreshTrayDisplay } from './trayUpdater';

export function registerIPCHandlers() {
  // Timer handlers
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

  ipcMain.handle('timer:getTotalTimeForTask', async (_event, taskId: number) => {
    return TimerService.getTotalTimeForTask(taskId);
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

  console.log('IPC handlers registered');
}
