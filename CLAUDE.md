# CLAUDE.md

## Project Overview
A macOS menu bar timer app built with Electron, React, shadcn/ui, and Tailwind CSS. Designed for freelancers or developers to track billable hours via simple task entry and start/stop functionality, with support for future advanced project management features.

**Primary Interface:** Menu bar application (lives in macOS menu bar, not dock)

## Architecture and Stack
- **Framework:** Electron 38.3.0 (latest stable, Oct 2025)
- **Frontend:** React 19.0.0 (stable, Dec 2024) with TypeScript
- **UI Library:** shadcn/ui (Radix primitives, Tailwind CSS 4)
- **Styling:** Tailwind CSS 4.0 (stable, Jan 2025)
- **Database:** SQLite via `better-sqlite3` (Node.js native module)
- **Build Tool:** Vite 7.1.10 (stable, requires Node.js 20.19+/22.12+)
- **Testing:** Vitest, Playwright (for future)
- **Icons:** Lucide-react (heroicons compatible)
- **Menu Bar:** Electron built-in Tray API (core feature)

## Project Structure
```
root/
│─ electron/              # All main process (Electron)
│  │- main.ts            # App initialization, menu bar setup
│  │- preload.ts         # IPC bridge (contextBridge)
│  │- config.ts          # Config file management (config.json)
│  │- menuBar.ts         # Tray icon, popover window management
│  │- services/
│     ├─ TimerService.ts # SQLite logic for timer
│     └─ SoundService.ts # Audio playback (start.wav/stop.wav)
└─ src/                  # React renderer process (popover UI)
   ├─ components/
   │   └─ ui/            # shadcn/ui components, copied into project
   ├─ features/
   │   ├─ Timer/         # Timer logic/components
   │   ├─ Tasks/         # Task management (CRUD)
   │   ├─ Projects/      # For future PM features
   │   └─ Reports/       # For analytics
   ├─ hooks/
   ├─ contexts/
   ├─ App.tsx
   ├─ main.tsx
   ├─ index.css          # Tailwind entry
   └─ assets/
       ├─ start.wav      # Custom start beep
       ├─ stop.wav       # Custom stop beep
       └─ icons/
```

## Features
- **Menu bar integration** (core feature):
  - Timer display in menu bar title (e.g., "⏱ 1:23:45")
  - Click to open popover window below menu bar icon
  - Hidden from dock (`app.dock.hide()`)
  - Frameless popover window (360x480px, skipTaskbar)
- **Configurable global keyboard shortcut** (default: `CommandOrControl+Alt+Shift+.`)
  - Configured via `config.json` in `app.getPath('userData')`
  - Manually editable, app restart required
- Persistent storage of task, start_time, and log entries using SQLite
- No background setInterval; UI calculates elapsed time on demand
- System beep with two distinct audio files (start.wav, stop.wav)
- Clean, modern UI using shadcn/ui components with Tailwind themes
- Projects and reporting view (future extension)

## macOS-Specific Architecture

### Menu Bar Window Configuration
```typescript
const popoverWindow = new BrowserWindow({
  width: 360,
  height: 480,
  show: false,
  frame: false,           // Frameless for native popover look
  resizable: false,       // Fixed size
  skipTaskbar: true,      // Don't show in app switcher
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    preload: path.join(__dirname, 'preload.js')
  }
});
```

### Application Behavior
```typescript
// Hide from dock
app.dock.hide();

// Don't quit when all windows closed (menu bar apps stay running)
app.on('window-all-closed', (e) => e.preventDefault());

// Only quit on explicit quit
let willQuitApp = false;
app.on('before-quit', () => { willQuitApp = true; });
```

### Native Module Requirements
- **better-sqlite3** requires native compilation for Electron 38
- Use `electron-rebuild` in postinstall:
  ```json
  "postinstall": "electron-rebuild"
  ```
- Ensure Vite externalizes native modules properly

## User Configuration (config.json)

**Location:** `~/Library/Application Support/[AppName]/config.json`

**Default config.json:**
```json
{
  "globalShortcut": "CommandOrControl+Alt+Shift+.",
  "theme": "system",
  "soundEnabled": true,
  "startSound": "start.wav",
  "stopSound": "stop.wav"
}
```

**Usage:**
- Users manually edit config.json
- Restart app to apply changes
- Invalid shortcuts fall back to default with notification

## Key Cloud Agent Actions
1. **Setup electron + vite + react + typescript**
   - Use Vite 7+ template with Electron 38
   - Configure for Node.js 20.19+ or 22.12+ (required by Vite 7)
   - Set up electron-rebuild for better-sqlite3

2. **Add Tailwind CSS 4** (stable as of Jan 2025)
   - Configure as per Tailwind 4 docs (CSS-first config)
   - Set `src/` as content root

3. **Initialize shadcn/ui** (`npx shadcn@latest init`)
   - Add components: button, input, card, badge, dialog, tabs, dropdown-menu
   - Configure for Tailwind 4 compatibility

4. **Implement MenuBar module:**
   - Create Tray with dynamic title (timer display)
   - Position popover window below tray icon
   - Handle show/hide on click and outside clicks

5. **Implement Config module:**
   - Load config.json from userData path
   - Create defaults if not exists
   - Validate and register global shortcut
   - Expose config via IPC

6. **Implement TimerService:**
   - Schema: tasks, time_entries tables (NO active_timer table)
   - Find active timer: `SELECT * FROM time_entries WHERE end_time IS NULL`
   - Log start/stop events by timestamp, duration
   - Expose via preload.ts (IPC, contextBridge)

7. **Implement SoundService:**
   - Use HTML5 Audio in renderer with start.wav/stop.wav
   - Load from assets folder
   - Respect soundEnabled config

8. **Renderer Components (Popover UI):**
   - CompactTimerView (current running timer, stop button)
   - QuickTaskEntry (start new timer)
   - TodayEntries (scrollable list of today's logs)
   - Menu button → open full window for Projects/Reports (future)

9. **Global Shortcut:**
   - Register from config.json on startup
   - Toggle timer (start if stopped, stop if running)
   - Handle registration failures gracefully

10. **Build for macOS using electron-builder:**
    - Target: macOS (dmg)
    - Universal binary (Intel + Apple Silicon) optional
    - No code signing for personal project (can add later)

## SQLite Schema (Simplified)

```sql
-- Tasks table
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  created_at INTEGER DEFAULT (strftime('%s','now') * 1000)
);

-- Time entries table
CREATE TABLE time_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  task_id INTEGER NOT NULL,
  start_time INTEGER NOT NULL,
  end_time INTEGER,              -- NULL = timer currently running
  duration_seconds INTEGER,      -- Calculated on stop
  notes TEXT,
  FOREIGN KEY (task_id) REFERENCES tasks(id)
);

-- To find active timer:
-- SELECT * FROM time_entries WHERE end_time IS NULL LIMIT 1;
```

**Note:** No `active_timer` table needed. Active timer is simply a time_entry with `end_time IS NULL`.

## shadcn/ui Install Example
```bash
npx shadcn@latest init
npx shadcn@latest add button input card badge dialog tabs dropdown-menu
```

## Audio Files
- Place `start.wav` and `stop.wav` in `src/assets/`
- Use HTML5 Audio in renderer process:
  ```typescript
  const audio = new Audio('/assets/start.wav');
  audio.play();
  ```

## macOS Build
- Use electron-builder
- Script in `package.json`: `"build:mac": "electron-builder --mac"`
- Configuration:
  ```json
  "mac": {
    "target": ["dmg"],
    "category": "public.app-category.productivity",
    "icon": "build/icon.icns"
  }
  ```
- Optional: Add `--universal` flag for universal binary (Intel + Apple Silicon)

## Tests/Quality Gates
- At minimum: basic unit test for TimerService and a Playwright test for timer flow
- Add lint/prettier config for consistent code style
- Test native module rebuild works correctly

## Security/IPC
- Use contextBridge for all Electron API access
- Disable nodeIntegration in BrowserWindow
- Enable contextIsolation
- Follow Electron security best practices

## Node.js Version Requirement
**IMPORTANT:** Vite 7 requires Node.js 20.19+ or 22.12+ (Node 18 reached EOL in April 2025)

Verify version before starting:
```bash
node --version  # Must be 20.19+, 22.12+, or later
```

## Documentation Links
- [Electron 38 docs](https://www.electronjs.org/docs/latest/)
- [React 19 docs](https://react.dev/)
- [Tailwind CSS 4 docs](https://tailwindcss.com/docs)
- [Vite 7 docs](https://vite.dev/)
- [shadcn/ui docs](https://ui.shadcn.com/docs/installation)
- [better-sqlite3 docs](https://github.com/WiseLibs/better-sqlite3)

## Author and Purpose
Generated for use with Claude Code agent. Designated owner: [Your Name/Org Here].
Target platform: macOS (initial focus).
