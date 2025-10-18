#!/bin/bash
# Create all 35 tasks as GitHub issues

set -e

echo "Creating all 35 tasks as GitHub issues..."
echo "This will create issues linked to task files in contexts/tasks/"
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "Error: GitHub CLI (gh) is not installed"
    echo "Install it: https://cli.github.com/"
    exit 1
fi

# Check if logged in
if ! gh auth status &> /dev/null; then
    echo "Error: Not logged in to GitHub CLI"
    echo "Run: gh auth login"
    exit 1
fi

# Phase 1
gh issue create --title "Task 01: Initialize Electron + Vite + React + TypeScript" \
  --label "task,phase-1" \
  --body "See contexts/tasks/phase1-01-initialize-electron-vite-react.md"

gh issue create --title "Task 02: Configure Vite for Electron compatibility" \
  --label "task,phase-1" \
  --body "See contexts/tasks/phase1-02-configure-vite-for-electron.md"

gh issue create --title "Task 03: Set up electron-rebuild for better-sqlite3" \
  --label "task,phase-1" \
  --body "See contexts/tasks/phase1-03-setup-electron-rebuild.md"

gh issue create --title "Task 04: Create project directory structure" \
  --label "task,phase-1" \
  --body "See contexts/tasks/phase1-04-create-project-structure.md"

gh issue create --title "Task 05: Configure electron-builder for macOS" \
  --label "task,phase-1" \
  --body "See contexts/tasks/phase1-05-configure-electron-builder.md"

# Phase 2
gh issue create --title "Task 06: Install and configure Tailwind CSS 4" \
  --label "task,phase-2" \
  --body "See contexts/tasks/phase2-06-install-tailwind-css.md"

gh issue create --title "Task 07: Initialize shadcn/ui with required components" \
  --label "task,phase-2" \
  --body "See contexts/tasks/phase2-07-initialize-shadcn-ui.md"

gh issue create --title "Task 08: Set up base styles and theme configuration" \
  --label "task,phase-2" \
  --body "See contexts/tasks/phase2-08-configure-theme-system.md"

gh issue create --title "Task 09: Add Lucide React icons" \
  --label "task,phase-2" \
  --body "See contexts/tasks/phase2-09-add-icons.md"

# Phase 3
gh issue create --title "Task 10: Implement SQLite schema" \
  --label "task,phase-3" \
  --body "See contexts/tasks/phase3-10-implement-sqlite-schema.md"

gh issue create --title "Task 11: Create TimerService with database operations" \
  --label "task,phase-3" \
  --body "See contexts/tasks/phase3-11-create-timer-service.md"

gh issue create --title "Task 12: Create Config service for settings management" \
  --label "task,phase-3" \
  --body "See contexts/tasks/phase3-12-create-config-service.md"

gh issue create --title "Task 13: Create SoundService placeholder" \
  --label "task,phase-3" \
  --body "See contexts/tasks/phase3-13-create-sound-service.md"

# Phase 4
gh issue create --title "Task 14: Implement main.ts (app initialization)" \
  --label "task,phase-4" \
  --body "See contexts/tasks/phase4-14-implement-main-process.md"

gh issue create --title "Task 15: Create menuBar.ts (tray icon & popover)" \
  --label "task,phase-4" \
  --body "See contexts/tasks/phase4-15-create-menu-bar-tray.md"

gh issue create --title "Task 16: Implement preload.ts (IPC bridge)" \
  --label "task,phase-4" \
  --body "See contexts/tasks/phase4-16-implement-preload-ipc.md"

gh issue create --title "Task 17: Configure global keyboard shortcuts" \
  --label "task,phase-4" \
  --body "See contexts/tasks/phase4-17-implement-global-shortcuts.md"

gh issue create --title "Task 18: Implement dynamic tray title updates" \
  --label "task,phase-4" \
  --body "See contexts/tasks/phase4-18-dynamic-tray-updates.md"

# Phase 5
gh issue create --title "Task 19: Create Timer components (CompactTimerView, QuickTaskEntry)" \
  --label "task,phase-5" \
  --body "See contexts/tasks/phase5-19-create-timer-components.md"

gh issue create --title "Task 20: Build TodayEntries list component" \
  --label "task,phase-5" \
  --body "See contexts/tasks/phase5-20-create-today-entries-list.md"

gh issue create --title "Task 21: Implement Task management UI (CRUD)" \
  --label "task,phase-5" \
  --body "See contexts/tasks/phase5-21-create-tasks-management-ui.md"

gh issue create --title "Task 22: Create Projects & Reports placeholders" \
  --label "task,phase-5" \
  --body "See contexts/tasks/phase5-22-create-projects-reports-placeholders.md"

gh issue create --title "Task 23: Build main app layout with navigation" \
  --label "task,phase-5" \
  --body "See contexts/tasks/phase5-23-build-app-layout.md"

# Phase 6
gh issue create --title "Task 24: Integrate timer start/stop end-to-end" \
  --label "task,phase-6" \
  --body "See contexts/tasks/phase6-24-integrate-timer-start-stop.md"

gh issue create --title "Task 25: Add real-time elapsed time display" \
  --label "task,phase-6" \
  --body "See contexts/tasks/phase6-25-add-elapsed-time-display.md"

gh issue create --title "Task 26: Implement sound playback with HTML5 Audio" \
  --label "task,phase-6" \
  --body "See contexts/tasks/phase6-26-implement-sound-playback.md"

gh issue create --title "Task 27: Sync config settings with UI" \
  --label "task,phase-6" \
  --body "See contexts/tasks/phase6-27-sync-config-with-ui.md"

gh issue create --title "Task 28: Wire up all IPC communication and events" \
  --label "task,phase-6" \
  --body "See contexts/tasks/phase6-28-wire-up-ipc-events.md"

gh issue create --title "Task 29: Final integration testing and bug fixes" \
  --label "task,phase-6" \
  --body "See contexts/tasks/phase6-29-final-integration-testing.md"

# Phase 7
gh issue create --title "Task 30: Add ESLint and Prettier configuration" \
  --label "task,phase-7" \
  --body "See contexts/tasks/phase7-30-add-eslint-prettier.md"

gh issue create --title "Task 31: Write unit tests for TimerService (Vitest)" \
  --label "task,phase-7" \
  --body "See contexts/tasks/phase7-31-write-unit-tests.md"

gh issue create --title "Task 32: Create E2E tests with Playwright" \
  --label "task,phase-7" \
  --body "See contexts/tasks/phase7-32-create-e2e-tests.md"

gh issue create --title "Task 33: Configure production build" \
  --label "task,phase-7" \
  --body "See contexts/tasks/phase7-33-configure-production-build.md"

gh issue create --title "Task 34: Test native module rebuild" \
  --label "task,phase-7" \
  --body "See contexts/tasks/phase7-34-test-native-module-rebuild.md"

gh issue create --title "Task 35: Final polish and documentation" \
  --label "task,phase-7" \
  --body "See contexts/tasks/phase7-35-final-polish-and-documentation.md"

echo ""
echo "✅ All 35 issues created!"
echo ""
echo "Next steps:"
echo "1. Create GitHub Project board"
echo "2. Add all issues to project"
echo "3. Start with Task 01"
echo ""
echo "View issues: gh issue list"
