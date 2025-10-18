import { app } from 'electron';
import path from 'path';
import fs from 'fs';

export interface AppConfig {
  globalShortcut: string;
  theme: 'light' | 'dark' | 'system';
  soundEnabled: boolean;
  startSound: string;
  stopSound: string;
}

const DEFAULT_CONFIG: AppConfig = {
  globalShortcut: 'CommandOrControl+Alt+Shift+.',
  theme: 'system',
  soundEnabled: true,
  startSound: 'start.wav',
  stopSound: 'stop.wav',
};

let config: AppConfig = { ...DEFAULT_CONFIG };
let configPath: string = '';

/**
 * Initialize config - load from file or create with defaults
 */
export function initConfig(): AppConfig {
  const userDataPath = app.getPath('userData');
  configPath = path.join(userDataPath, 'config.json');

  console.log('Config path:', configPath);

  if (fs.existsSync(configPath)) {
    try {
      const fileContent = fs.readFileSync(configPath, 'utf-8');
      const loadedConfig = JSON.parse(fileContent);

      // Merge with defaults to ensure all keys exist
      config = { ...DEFAULT_CONFIG, ...loadedConfig };

      console.log('Config loaded:', config);
      return config;
    } catch (error) {
      console.error('Error loading config, using defaults:', error);
      config = { ...DEFAULT_CONFIG };
    }
  } else {
    console.log('Config file not found, creating with defaults');
    config = { ...DEFAULT_CONFIG };
    saveConfig();
  }

  return config;
}

/**
 * Get current configuration
 */
export function getConfig(): AppConfig {
  return { ...config };
}

/**
 * Update configuration and save to file
 */
export function updateConfig(updates: Partial<AppConfig>): AppConfig {
  config = { ...config, ...updates };
  saveConfig();
  console.log('Config updated:', config);
  return config;
}

/**
 * Save configuration to file
 */
export function saveConfig(): void {
  try {
    const userDataPath = app.getPath('userData');

    // Ensure userData directory exists
    if (!fs.existsSync(userDataPath)) {
      fs.mkdirSync(userDataPath, { recursive: true });
    }

    fs.writeFileSync(
      configPath,
      JSON.stringify(config, null, 2),
      'utf-8'
    );
    console.log('Config saved to:', configPath);
  } catch (error) {
    console.error('Error saving config:', error);
  }
}

/**
 * Reset configuration to defaults
 */
export function resetConfig(): AppConfig {
  config = { ...DEFAULT_CONFIG };
  saveConfig();
  console.log('Config reset to defaults');
  return config;
}

/**
 * Validate global shortcut format
 */
export function isValidShortcut(shortcut: string): boolean {
  // Basic validation - Electron will validate further
  const validKeys = /^(CommandOrControl|CmdOrCtrl|Command|Cmd|Control|Ctrl|Alt|Option|AltGr|Shift|Super|Meta)\+/;
  return validKeys.test(shortcut);
}

/**
 * Get config file path (useful for showing users where to edit)
 */
export function getConfigPath(): string {
  return configPath;
}
