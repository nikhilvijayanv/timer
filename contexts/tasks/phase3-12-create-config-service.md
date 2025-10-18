# Task 12: Create Config.ts for Configuration Management

**Phase:** 3 - Database & Core Services
**Dependencies:** Task 01 (Electron initialized)

## Description
Implement the configuration service that manages app settings stored in config.json in the userData directory.

## Implementation Steps

1. **Create electron/config.ts**
   ```typescript
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
   ```

2. **Initialize config in electron/main.ts**
   ```typescript
   import { initConfig, getConfig } from './config';

   app.whenReady().then(() => {
     // Initialize configuration first
     const config = initConfig();
     console.log('App config:', config);

     // Then initialize database
     initDatabase();

     createWindow();
   });
   ```

3. **Create config watcher (optional but useful)**
   Add to electron/config.ts:
   ```typescript
   import { watch } from 'fs';

   let configWatcher: fs.FSWatcher | null = null;

   /**
    * Watch config file for external changes
    * @param callback Function to call when config changes
    */
   export function watchConfig(callback: (config: AppConfig) => void): void {
     if (configWatcher) {
       configWatcher.close();
     }

     configWatcher = watch(configPath, (eventType) => {
       if (eventType === 'change') {
         console.log('Config file changed externally, reloading...');
         const reloadedConfig = initConfig();
         callback(reloadedConfig);
       }
     });

     console.log('Watching config file for changes');
   }

   /**
    * Stop watching config file
    */
   export function stopWatchingConfig(): void {
     if (configWatcher) {
       configWatcher.close();
       configWatcher = null;
       console.log('Stopped watching config file');
     }
   }
   ```

4. **Test configuration**
   Add temporary test code to main.ts:
   ```typescript
   app.whenReady().then(() => {
     const config = initConfig();
     console.log('Initial config:', config);

     // Test updating config
     updateConfig({ theme: 'dark', soundEnabled: false });

     // Test getting config
     const updated = getConfig();
     console.log('Updated config:', updated);

     // Show config path
     console.log('Config file location:', getConfigPath());

     initDatabase();
     createWindow();
   });
   ```

5. **Verify config file**
   After running the app, check that config.json was created:
   ```bash
   # macOS
   cat ~/Library/Application\ Support/Electron/config.json
   ```

   Should contain:
   ```json
   {
     "globalShortcut": "CommandOrControl+Alt+Shift+.",
     "theme": "system",
     "soundEnabled": true,
     "startSound": "start.wav",
     "stopSound": "stop.wav"
   }
   ```

## Acceptance Criteria
- [ ] Config service initializes on app startup
- [ ] Default config.json created if doesn't exist
- [ ] Existing config.json loaded correctly
- [ ] Config can be updated programmatically
- [ ] Changes persisted to config.json
- [ ] Config path accessible
- [ ] Config validation works for shortcuts
- [ ] File watcher detects external changes (optional)

## Config Schema
```typescript
interface AppConfig {
  globalShortcut: string;        // Default: 'CommandOrControl+Alt+Shift+.'
  theme: 'light' | 'dark' | 'system';  // Default: 'system'
  soundEnabled: boolean;         // Default: true
  startSound: string;            // Default: 'start.wav'
  stopSound: string;             // Default: 'stop.wav'
}
```

## References
- project_init.md lines 22, 101-120 (User Configuration section)
- project_init.md lines 52, 143-145 (Config module requirements)
