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
  shortcuts: {
    get: () => Promise<string | null>;
    register: (shortcut: string) => Promise<boolean>;
  };
  on: (channel: string, callback: (...args: any[]) => void) => () => void;
  removeAllListeners: (channel: string) => void;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
