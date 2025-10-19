const { contextBridge, ipcRenderer } = require('electron');

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
    getTotalTimeForTask: (taskId: number) =>
      ipcRenderer.invoke('timer:getTotalTimeForTask', taskId),
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

  // Shortcut operations
  shortcuts: {
    get: () => ipcRenderer.invoke('shortcuts:get'),
    register: (shortcut: string) => ipcRenderer.invoke('shortcuts:register', shortcut),
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

// Type definitions for TypeScript
export type ElectronAPI = typeof electronAPI;
