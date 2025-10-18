# GitHub Workflow Guide

Complete guide for using GitHub Issues, Projects, and Git integration for this project.

## 🎯 Complete Workflow

### 1. Create Issue for Task

```bash
# Go to GitHub → Issues → New Issue → "Implementation Task" template
# Or use GitHub CLI:
gh issue create --title "Task 01: Initialize Electron + Vite + React" \
  --label "task,phase-1" \
  --body "See contexts/tasks/phase1-01-initialize-electron-vite-react.md"
```

**Result:** Issue #1 created and auto-labeled with `phase-1` and `task`

### 2. Create Branch from Issue

**On GitHub:**
- Go to the issue
- Click "Create a branch" on right sidebar
- Branch name: `task-01-initialize-electron`

**Or via CLI:**
```bash
# Create and checkout branch
git checkout -b task-01-initialize-electron

# Push to remote
git push -u origin task-01-initialize-electron
```

**Branch Naming Convention:**
```
task-{number}-{short-description}

Examples:
- task-01-initialize-electron
- task-15-menu-bar-tray
- task-24-timer-integration
```

### 3. Work on Task

```bash
# Make changes
npm run dev

# Commit with issue reference
git add .
git commit -m "Implement Electron + Vite setup

- Set up Vite config for Electron
- Created main.ts and preload.ts
- Configured package.json scripts

Progress on #1"

# Push commits
git push
```

**Commit Message Format:**
```
Short summary (50 chars or less)

Detailed description:
- What you did
- Why you did it
- Any decisions made

Related to #1
```

### 4. Create Pull Request

```bash
# When ready, create PR
gh pr create --title "Task 01: Initialize Electron + Vite + React" \
  --body "Closes #1

## Changes
- Set up Electron + Vite + React
- Configured TypeScript
- Basic app structure

## Testing
- [x] App launches in dev mode
- [x] No console errors
- [x] All acceptance criteria met"
```

**PR Title Format:**
```
Task XX: [Task Name]

Examples:
- Task 01: Initialize Electron + Vite + React
- Task 15: Create Menu Bar Tray
```

**PR Body Must Include:**
- `Closes #XX` - Links PR to issue (auto-closes on merge)
- Changes made
- Testing checklist
- Acceptance criteria

### 5. Automated Actions

When PR is created:
- ✅ Issue gets "in-progress" label
- ✅ Comment added to issue: "🔧 Work in progress: #PR"
- ✅ Project board moves card to "In Progress"

When PR is merged:
- ✅ Issue automatically closed
- ✅ Issue gets "completed" label
- ✅ Comment added: "✅ Completed via #PR"
- ✅ PROGRESS.md updated automatically
- ✅ Project board moves card to "Done"

### 6. Move to Next Task

```bash
# Switch to main and pull
git checkout main
git pull

# Start next task
gh issue create --title "Task 02: Configure Vite for Electron"
git checkout -b task-02-configure-vite
```

## 🔗 Git Integration Features

### Commit Linking

**Link commits to issues:**
```bash
git commit -m "Add database schema

Part of #10"
```

**Close issues from commits:**
```bash
git commit -m "Complete timer service

Closes #11"
```

### PR Linking Keywords

Use these keywords in PR description to auto-close issues:
- `Closes #XX`
- `Fixes #XX`
- `Resolves #XX`

**Multiple issues:**
```markdown
Closes #10
Closes #11
Resolves #12
```

### Branch Protection (Optional)

Set up in GitHub Settings → Branches:
- ✅ Require PR before merging
- ✅ Require status checks (linter, tests)
- ✅ Require 1 approval (if collaborating)
- ✅ Delete branch on merge

## 📊 GitHub Projects Setup

### Create Project Board

1. Go to GitHub → Projects → New Project
2. Choose "Board" template
3. Name it "Timer App Development"

**Default Columns:**
- 📋 **Backlog** - All pending tasks
- 🏗️ **In Progress** - Currently working on
- 🧪 **Testing** - Code complete, testing
- ✅ **Done** - Completed and merged

### Automation Rules

**When issue created:**
- Add to "Backlog"

**When PR opened:**
- Move linked issue to "In Progress"

**When PR moved to draft:**
- Keep in "In Progress"

**When PR marked ready for review:**
- Move to "Testing"

**When PR merged:**
- Move to "Done"
- Close issue

### Add All 35 Tasks to Project

Use the helper script:

```bash
# Create all issues at once
./scripts/create-all-issues.sh
```

## 🎨 Labels

Auto-created labels:

**Phases:**
- `phase-1` - Project Setup
- `phase-2` - Styling & UI
- `phase-3` - Database & Services
- `phase-4` - Electron Main Process
- `phase-5` - React UI Components
- `phase-6` - Timer Logic & Integration
- `phase-7` - Testing & Build

**Status:**
- `task` - Implementation task
- `in-progress` - Work started
- `completed` - Task done
- `blocked` - Waiting on dependency

**Priority:**
- `priority-high` - Critical path
- `priority-medium` - Important
- `priority-low` - Nice to have

## 📈 Tracking Progress

### View Progress

**On GitHub:**
- Projects board shows visual progress
- Insights → Burndown chart
- Milestones show % complete

**Locally:**
```bash
# View PROGRESS.md (auto-updated)
cat PROGRESS.md

# See completed tasks
git log --grep="Task" --oneline
```

### Generate Reports

```bash
# All closed issues (completed tasks)
gh issue list --state closed --label task

# Current sprint
gh issue list --label in-progress

# Remaining work
gh issue list --state open --label task
```

## 🔄 Example Full Cycle

```bash
# 1. Create issue
gh issue create --title "Task 01: Initialize Electron" --label "task,phase-1"
# → Issue #1 created

# 2. Create branch
git checkout -b task-01-initialize-electron
git push -u origin task-01-initialize-electron

# 3. Do work
# ... make changes ...
git add .
git commit -m "Set up Electron + Vite

Progress on #1"
git push

# 4. Create PR
gh pr create --title "Task 01: Initialize Electron" --body "Closes #1"
# → Issue #1 labeled "in-progress"

# 5. Merge PR (when ready)
gh pr merge --squash
# → Issue #1 closed
# → PROGRESS.md updated
# → Project board updated

# 6. Repeat for next task
```

## 🎯 Best Practices

1. **One task = One issue = One branch = One PR**
2. **Always link PRs to issues** with `Closes #XX`
3. **Use conventional commit messages**
4. **Keep branches up to date** with main
5. **Delete branches after merge**
6. **Review acceptance criteria** before marking complete
7. **Update PROGRESS.md** if auto-update fails

## 🚀 Quick Commands

```bash
# List all open tasks
gh issue list --label task

# Start working on task
gh issue develop <issue-number> --checkout

# Create PR from current branch
gh pr create --web

# View project board
gh project list
gh project view <number>

# Mark issue as blocked
gh issue edit <number> --add-label blocked

# Close issue manually
gh issue close <number> --comment "Completed manually"
```

---

**Next:** Read the [Development Guide](DEVELOPMENT.md) to start implementing tasks!
