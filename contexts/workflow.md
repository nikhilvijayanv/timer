# GitHub Workflow & Phase Completion Process

This document outlines the standard workflow for completing phases in this project.

**IMPORTANT**: This workflow MUST be followed for every phase completion.

---

## Overview: One PR Per Phase

This project uses a **phase-based workflow** where each phase (containing multiple tasks) is completed in a single branch and submitted as one pull request.

**Example for Phase 4:**

- Branch: `phase-4-electron-main-process`
- Tasks: 14, 15, 16, 17, 18 (5 tasks total)
- Commits: One commit per task (5 commits)
- PR: One PR that closes all 5 issues

**Benefits:**

- Fewer PRs to review and merge
- Cohesive changes grouped by phase
- Easier to test complete features
- Cleaner git history

---

## Phase Workflow

### 1. Start New Phase

After previous phase is merged (or when starting fresh):

```bash
# Switch to main and pull latest
git checkout main
git pull origin main

# Create phase branch
git checkout -b phase-{number}-{phase-name}
```

**Examples:**

- `git checkout -b phase-4-electron-main-process`
- `git checkout -b phase-5-react-ui-components`
- `git checkout -b phase-6-timer-logic-integration`

**Branch naming convention:**

- Use `phase-{number}` prefix
- Add descriptive phase name from PROGRESS.md
- Use kebab-case

---

### 2. Implement Tasks Iteratively

For each task in the phase:

#### a) Implement the Task

- Follow acceptance criteria in `contexts/tasks/phase{X}-{number}-*.md`
- Test changes thoroughly
- Ensure `npm run dev` still works

#### b) Commit the Task

Use conventional commit format with issue reference:

```bash
git add .
git commit -m "{type}: {task description} (fixes #{issue-number})"
```

**Commit message types:**

- `feat:` - New features
- `fix:` - Bug fixes
- `chore:` - Maintenance tasks (build, deps, etc.)
- `docs:` - Documentation updates
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `style:` - Code formatting

**Examples:**

```bash
git commit -m "feat: implement main.ts app initialization (fixes #14)"
git commit -m "feat: create menu bar tray with positioning (fixes #15)"
git commit -m "feat: implement preload IPC bridge (fixes #16)"
```

**IMPORTANT:** Always include `(fixes #{issue-number})` to auto-close the issue when PR merges.

#### c) Continue to Next Task

- Stay on the same branch
- Implement next task in the phase
- Commit when complete
- Repeat until all phase tasks are done

---

### 3. Push Branch (Can Push Anytime)

You can push your branch at any time to back up work:

```bash
git push -u origin HEAD
```

Or explicitly:

```bash
git push origin phase-{number}-{description}
```

**Note:** Pushing does NOT create a PR. You create the PR manually when ready.

---

### 4. Create Pull Request (When Phase Complete)

Only create PR after **ALL tasks in the phase** are complete:

```bash
gh pr create --title "Phase {number}: {phase name}" --body "Closes #{issue1}, Closes #{issue2}, ...

## Phase Summary
Brief description of what this phase accomplishes

## Tasks Completed
- [x] Task {N}: {description} (#{issue})
- [x] Task {N+1}: {description} (#{issue})
- [x] Task {N+2}: {description} (#{issue})

## Changes
- Key change 1
- Key change 2
- Key change 3

## Testing
- How you tested the phase
- E.g., 'npm run dev works, all features functional'
"
```

**Example for Phase 4:**

```bash
gh pr create --title "Phase 4: Electron Main Process" --body "Closes #14, Closes #15, Closes #16, Closes #17, Closes #18

## Phase Summary
Implements the complete Electron main process including app initialization, menu bar integration, IPC communication, keyboard shortcuts, and dynamic tray updates.

## Tasks Completed
- [x] Task 14: Implement main.ts (app initialization) (#14)
- [x] Task 15: Create menuBar.ts (tray icon & popover) (#15)
- [x] Task 16: Implement preload.ts (IPC bridge) (#16)
- [x] Task 17: Configure global keyboard shortcuts (#17)
- [x] Task 18: Implement dynamic tray title updates (#18)

## Changes
- Complete main process with single instance lock and macOS behavior
- Menu bar tray with icon and popover positioning
- IPC bridge exposing timer, config, and system APIs
- Global keyboard shortcut for quick timer toggle
- Dynamic tray title showing elapsed time

## Testing
- Verified menu bar app behavior (hidden from dock)
- Tested tray icon click and popover positioning
- Confirmed IPC communication works from renderer
- Tested global shortcuts
- Verified tray title updates with running timer
- All TypeScript compilation successful
- npm run dev works without errors

🤖 Generated with [Claude Code](https://claude.com/claude-code)
"
```

**IMPORTANT:** List all issue numbers in the format `Closes #14, Closes #15, ...` so GitHub auto-closes all issues when PR merges.

---

### 5. Verify PR Links to Issues

- PR description should show all `Closes #{issue-number}` references
- Each issue page should show linked PR
- GitHub Actions workflows should run automatically

---

### 6. Review and Merge

- Wait for any CI checks to pass
- Review the changes
- Merge the PR (GitHub will auto-close ALL linked issues)
- Branch will auto-delete after merge

---

### 7. Repeat: Start Next Phase

- Go to **Step 1: Start New Phase**
- Switch to main, pull latest, create new phase branch
- Begin first task of next phase

---

## GitHub Automation

The following automations are configured via workflows:

### On PR Open

- **move-to-in-progress.yml**: Moves linked issues to "In Progress" on project board
- **issue-automation.yml**: Adds "in-progress" label to all linked issues

### On PR Merge

- **issue-automation.yml**: Auto-closes all linked issues, adds "completed" label
- **update-progress.yml**: Updates PROGRESS.md to mark tasks as complete

### On Issue Creation

- **issue-automation.yml**: Auto-adds phase labels (phase-1, phase-2, etc.)

---

## Phase Completion Checklist

Before creating a PR, verify:

- [ ] **All tasks in phase complete** (check `contexts/tasks/` files)
- [ ] One commit per task with proper format
- [ ] Each commit includes `(fixes #{issue-number})`
- [ ] All code tested and working
- [ ] `npm run dev` runs without errors
- [ ] No TypeScript errors
- [ ] PROGRESS.md updated for all tasks in phase
- [ ] Phase branch created with correct naming
- [ ] Branch pushed to GitHub
- [ ] Ready to create PR with all issue references

---

## Common Commands Quick Reference

```bash
# Start new phase
git checkout main
git pull origin main
git checkout -b phase-{number}-{name}

# After each task
git add .
git commit -m "feat: {task description} (fixes #{issue})"

# Backup work (optional, can do anytime)
git push -u origin HEAD

# When all phase tasks complete
gh pr create --title "Phase {N}: {name}" --body "Closes #X, Closes #Y..."

# Check status
git status
git log --oneline
gh pr list
gh issue list
```

---

## Example: Phase 4 Complete Workflow

```bash
# 1. Start phase
git checkout main
git pull origin main
git checkout -b phase-4-electron-main-process

# 2. Task 14
# ... implement task 14 ...
git add .
git commit -m "feat: implement main.ts app initialization (fixes #14)"

# 3. Task 15
# ... implement task 15 ...
git add .
git commit -m "feat: create menu bar tray with positioning (fixes #15)"

# 4. Task 16
# ... implement task 16 ...
git add .
git commit -m "feat: implement preload IPC bridge (fixes #16)"

# 5. Task 17
# ... implement task 17 ...
git add .
git commit -m "feat: configure global keyboard shortcuts (fixes #17)"

# 6. Task 18
# ... implement task 18 ...
git add .
git commit -m "feat: implement dynamic tray title updates (fixes #18)"

# 7. Push and create PR
git push -u origin phase-4-electron-main-process
gh pr create --title "Phase 4: Electron Main Process" --body "Closes #14, Closes #15, Closes #16, Closes #17, Closes #18..."
```

---

## Notes

- **One branch per phase** containing all phase tasks
- **One commit per task** with clear conventional commit messages
- **One PR per phase** that closes all task issues
- **Never** commit directly to main
- **Always** pull from main before creating a new phase branch
- **Always** link PRs to ALL phase issues using "Closes #X, Closes #Y, ..."
- Use descriptive commit messages that explain **what** and **why**
- Keep commits atomic (one task per commit)
- Push branch as needed to avoid losing work (doesn't auto-create PR)
- Only create PR when entire phase is complete and tested

---

## Migration from Task-Based Workflow

**Previous workflow:** One PR per task (Task 14 → PR, Task 15 → PR, etc.)
**New workflow:** One PR per phase (Phase 4 with Tasks 14-18 → One PR)

If you have incomplete tasks from a previous PR:

1. Complete remaining tasks on the phase branch
2. Make one commit per task
3. Create one final PR for the complete phase
