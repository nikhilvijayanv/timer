# CLAUDE.md

## Project Overview
A cross-platform desktop timer and project management app built with Electron, React, shadcn/ui, and Tailwind CSS. Designed for freelancers or developers to track billable hours via simple task entry and start/stop functionality, with support for future advanced project management features.

## Architecture and Stack
- **Framework:** Electron 28+ (latest stable)
- **Frontend:** React 19+ with TypeScript
- **UI Library:** shadcn/ui (Radix primitives, Tailwind CSS 4)
- **Styling:** Tailwind CSS 4 (JIT mode enabled)
- **Database:** SQLite via `better-sqlite3` (Node.js native module)
- **Build Tool:** Vite 7+
- **Testing:** Vitest, Playwright (for future)
- **Icons:** Lucide-react (heroicons compatible)
- **System Tray:** Electron built-in Tray API (optional)

## Project Structure
```
root/
│─ electron/           # All main process (Electron)
│  │- main.ts
│  │- preload.ts
│  │- services/
│     ├─ TimerService.ts # SQLite logic for timer
│     └─ SoundService.ts # System beep logic (wav/mp3)
└─ src/                # React renderer process
   ├─ components/
   │   └─ ui/          # shadcn/ui components, copied into project
   ├─ features/
   │   ├─ Timer/       # Timer logic/components
   │   ├─ Tasks/       # Task management (CRUD)
   │   ├─ Projects/    # For future PM features
   │   └─ Reports/     # For analytics
   ├─ hooks/
   ├─ contexts/
   ├─ App.tsx
   ├─ main.tsx
   ├─ index.css        # Tailwind entry
   └─ assets/
       ├─ start.wav    # Custom start beep
       ├─ stop.wav     # Custom stop beep
       └─ icons/
```

## Features
- Global keyboard shortcut to start/stop timer (CMD+Ctrl+Alt+., platform-neutral, configurable)
- Persistent storage of task, start_time, and log entries using SQLite
- No background setInterval; UI calculates elapsed time on demand
- System beep with two distinct audio files (customizable)
- Clean, modern UI using shadcn/ui components with Tailwind themes
- Projects and reporting view (future extension)
- System tray integration with tooltip timer (optional, per platform)

## Key Cloud Agent Actions
1. **Setup electron + vite + react + typescript** (use template like electron-shadcn or set up manually)
2. **Add Tailwind CSS 4 and configure as per Tailwind docs (JIT mode, src/ as content root)**
3. **Initialize shadcn/ui (`npx shadcn@latest init`). Add components: button, input, card, badge, data-table, dialog, tabs, etc.**
4. **Implement TimerService:**
   - Schema: tasks, time_entries, active_timer tables
   - Log start/stop events by timestamp, duration
   - Expose via preload.ts (IPC, contextBridge)
5. **Implement SoundService:** Play `start.wav` and `stop.wav` using HTML5 Audio, Electron sound APIs, or Node.js modules.
6. **Renderer Components:**
   - TaskEntry (start a new timer)
   - TimerView (current running timer, stop button)
   - TodayEntries (history of today's logs)
   - Project/Reports page (stub, placeholder for extension)
7. **Global Shortcut:** Register Ctrl+Shift+T (CommandOrControl+Shift+T in Electron) to toggle timer.
8. **Persist and calculate elapsed time from start_time only, on demand**
9. **Build cross-platform scripts using electron-builder. Target: macOS (dmg/zip), Windows (exe/msi), Linux (AppImage/deb/rpm).**
10. **Optional:** Add system tray integration, dark mode, i18n support.

## Example SQLite Schema
```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  created_at INTEGER DEFAULT (strftime('%s','now') * 1000)
);
CREATE TABLE time_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  task_id INTEGER NOT NULL,
  start_time INTEGER NOT NULL,
  end_time INTEGER,
  duration_seconds INTEGER,
  notes TEXT,
  FOREIGN KEY (task_id) REFERENCES tasks(id)
);
CREATE TABLE active_timer (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  task_id INTEGER NOT NULL,
  task_name TEXT NOT NULL,
  start_time INTEGER NOT NULL,
  FOREIGN KEY (task_id) REFERENCES tasks(id)
);
```
## shadcn/ui Install Example
```bash
npx shadcn@latest init
npx shadcn@latest add button input card badge data-table dialog tabs
```

## Audio Files
- Place `start.wav` and `stop.wav` in `src/assets/` and use them in SoundService
- Optional: Use system beep if preferred

## Multi-Platform Build
- Use electron-builder
- Scripts: `build:mac`, `build:win`, `build:linux` mapped in `package.json`.

## Tests/Quality Gates
- At minimum: basic unit test for TimerService and a Playwright test for timer flow
- Add lint/prettier config for consistent code style

## Security/IPC
- Use contextBridge for all Electron API access
- Disable nodeIntegration in BrowserWindow
- Use electron-shadcn or Vite security best practices

## Documentation Links
- [shadcn/ui docs](https://ui.shadcn.com/docs/installation)
- [electron-shadcn template](https://github.com/LuanRoger/electron-shadcn)

## Author and Purpose
Generated for use with Claude/Cloud code agent. Designated owner: [Your Name/Org Here].

