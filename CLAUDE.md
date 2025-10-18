
# Project Overview
A macOS menu bar timer app built with Electron, React, shadcn/ui, and Tailwind CSS. Designed for freelancers or developers to track billable hours via simple task entry and start/stop functionality, with support for future advanced project management features.

## Context Files Lookup
- Project initial plan: -> contexts/project_init.md
- Task breakdown: -> PROGRESS.md
- Individual tasks: -> contexts/tasks/

## GitHub Workflow - MUST FOLLOW

**IMPORTANT**: After completing each task, you MUST follow this workflow:

### 1. Create Feature Branch
```bash
git checkout -b task-{number}-{short-description}
# Example: git checkout -b task-01-init-electron-vite
```

### 2. Commit Changes
Use conventional commit format with issue reference:
```bash
git add .
git commit -m "feat: {description} (fixes #{issue-number})"
# Example: git commit -m "feat: initialize Electron + Vite + React + TypeScript (fixes #1)"
```

**Commit Message Guidelines:**
- Use `feat:` for new features
- Use `fix:` for bug fixes
- Use `chore:` for maintenance tasks
- Use `docs:` for documentation
- Always include `(fixes #{issue-number})` to auto-close issues

### 3. Push Branch
```bash
git push -u origin HEAD
```

### 4. Create Pull Request
```bash
gh pr create --title "Task {number}: {description}" --body "Closes #{issue-number}

## Changes
- List key changes here

## Acceptance Criteria
- [x] Criterion 1
- [x] Criterion 2
"
```

### 5. Verify PR Links to Issue
- PR should show "Closes #{issue-number}"
- Issue should show linked PR
- GitHub Actions should run (if configured)

### 6. After PR is Merged
- Issue auto-closes
- Branch auto-deletes
- GitHub board updates
- PROGRESS.md updates (via automation)

## Task Completion Checklist

When completing ANY task, verify:
- [ ] All acceptance criteria met (check contexts/tasks/phase{X}-{number}-*.md)
- [ ] Code tested and working
- [ ] Feature branch created
- [ ] Changes committed with proper message
- [ ] Branch pushed to GitHub
- [ ] PR created and linked to issue
- [ ] Ready for review/merge
