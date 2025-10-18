# GitHub Workflow & Task Completion Process

This document outlines the standard workflow for completing tasks in this project.

**IMPORTANT**: This workflow MUST be followed for every task completion.

## Post-Merge Workflow (After Each Task)

After a PR is merged, **ALWAYS** follow these steps before starting the next task:

### 1. Switch to Main Branch
```bash
git checkout main
```

### 2. Pull Latest Changes
```bash
git pull origin main
```
This ensures you have all merged changes from the completed task, including:
- Code changes from the merged PR
- Updated PROGRESS.md (via GitHub automation)
- Any other merged commits

### 3. Create New Feature Branch
```bash
git checkout -b task-{number}-{short-description}
```

**Examples:**
- `git checkout -b task-04-create-project-structure`
- `git checkout -b task-05-configure-electron-builder`
- `git checkout -b task-10-implement-sqlite-schema`

**Branch naming convention:**
- Always use `task-{number}` prefix
- Use kebab-case for description
- Keep description short (3-5 words max)

---

## Task Completion Workflow

### 1. Create Feature Branch
```bash
git checkout -b task-{number}-{short-description}
```

### 2. Implement the Task
- Follow acceptance criteria in `contexts/tasks/phase{X}-{number}-*.md`
- Test changes thoroughly
- Ensure `npm run dev` still works

### 3. Commit Changes
Use conventional commit format with issue reference:
```bash
git add .
git commit -m "{type}: {description} (fixes #{issue-number})"
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
git commit -m "feat: create project directory structure (fixes #4)"
git commit -m "fix: resolve TypeScript error in main.ts (fixes #12)"
git commit -m "chore: update dependencies (fixes #20)"
```

**IMPORTANT:** Always include `(fixes #{issue-number})` to auto-close the issue when PR merges.

### 4. Push Branch
```bash
git push -u origin HEAD
```

Or explicitly:
```bash
git push -u origin task-{number}-{description}
```

### 5. Create Pull Request
```bash
gh pr create --title "Task {number}: {description}" --body "Closes #{issue-number}

## Changes
- List key changes here
- One change per line

## Acceptance Criteria
- [x] Criterion 1 from task file
- [x] Criterion 2 from task file
- [x] All criteria met

## Testing
- Describe how you tested this
- E.g., 'npm run dev works without errors'
"
```

**Example:**
```bash
gh pr create --title "Task 4: Create project directory structure" --body "Closes #4

## Changes
- Created electron/services/ directory
- Created src/features/ with Timer, Tasks, Projects, Reports subdirectories
- Added placeholder files for main modules
- Created basic App.tsx and main.tsx

## Acceptance Criteria
- [x] All directories exist as per project structure
- [x] Placeholder files created for main modules
- [x] Directory structure matches project_init.md specification
- [x] npm run dev still works after restructuring

## Testing
- Verified directory structure with tree command
- Ran npm run dev successfully
"
```

### 6. Verify PR Links to Issue
- PR description should show "Closes #{issue-number}"
- Issue page should show linked PR
- GitHub Actions workflows should run automatically

### 7. Review and Merge
- Wait for any CI checks to pass
- Review the changes
- Merge the PR (GitHub will auto-close the linked issue)
- Branch will auto-delete after merge

### 8. Repeat: Start Next Task
- Go to **Post-Merge Workflow** (top of this file)
- Switch to main, pull latest, create new branch
- Begin next task

---

## GitHub Automation

The following automations are configured via workflows:

### On PR Open
- **move-to-in-progress.yml**: Moves linked issue to "In Progress" on project board
- **issue-automation.yml**: Adds "in-progress" label, posts work-in-progress comment

### On PR Merge
- **issue-automation.yml**: Auto-closes linked issue, adds "completed" label
- **update-progress.yml**: Updates PROGRESS.md to mark task as complete

### On Issue Creation
- **issue-automation.yml**: Auto-adds phase labels (phase-1, phase-2, etc.)

---

## Task Completion Checklist

Before pushing and creating a PR, verify:

- [ ] All acceptance criteria met (check `contexts/tasks/phase{X}-{number}-*.md`)
- [ ] Code tested and working
- [ ] `npm run dev` runs without errors
- [ ] No TypeScript errors
- [ ] Feature branch created with correct naming
- [ ] Changes committed with conventional commit message
- [ ] Commit message includes `(fixes #{issue-number})`
- [ ] Branch pushed to GitHub
- [ ] PR created with proper description
- [ ] PR links to issue (shows "Closes #X")
- [ ] Ready for review/merge

## After PR is Merged

**CRITICAL STEP**: Before starting the next task:

1. Switch to main: `git checkout main`
2. Pull latest changes: `git pull origin main`
3. Create new feature branch: `git checkout -b task-{next-number}-{description}`

What happens automatically when PR is merged:
- Issue auto-closes (via "Closes #X" in PR body)
- Branch auto-deletes (GitHub setting)
- GitHub project board updates (via automation)
- PROGRESS.md updates (via `.github/workflows/update-progress.yml`)

---

## Common Commands Quick Reference

```bash
# Start new task (after PR merge)
git checkout main
git pull origin main
git checkout -b task-{number}-{description}

# Commit and push
git add .
git commit -m "feat: {description} (fixes #{issue})"
git push -u origin HEAD

# Create PR
gh pr create --title "Task {number}: {description}" --body "Closes #{issue}..."

# Check status
git status
git branch
gh pr list
gh issue list
```

---

## Notes

- **Always** pull from main before creating a new branch
- **Never** commit directly to main
- **Always** link PRs to issues using "Closes #X" or "Fixes #X"
- Use descriptive commit messages that explain **what** and **why**
- Keep commits atomic (one logical change per commit)
- Push early and often to avoid losing work
