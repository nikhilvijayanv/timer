
# Project Overview
A macOS menu bar timer app built with Electron, React, shadcn/ui, and Tailwind CSS. Designed for freelancers or developers to track billable hours via simple task entry and start/stop functionality, with support for future advanced project management features.

## Context Files Lookup
- Project initial plan: -> contexts/project_init.md
- Task breakdown: -> PROGRESS.md
- Individual tasks: -> contexts/tasks/
- Git workflow: -> contexts/workflow.md

## GitHub Workflow - MUST FOLLOW

**All workflow details are in:** `contexts/workflow.md`

**Quick Summary:**
1. Create feature branch: `git checkout -b task-{number}-{description}`
2. Implement task following acceptance criteria in `contexts/tasks/`
3. Commit with: `git commit -m "feat: {description} (fixes #{issue})"`
4. Push and create PR: `gh pr create --title "Task {number}: {description}" --body "Closes #{issue}..."`
5. After merge: `git checkout main && git pull && git checkout -b task-{next}...`

**Important:**
- Always include `(fixes #{issue-number})` in commit messages
- Always include `Closes #{issue-number}` in PR description
- Always pull from main before starting a new task
- See `contexts/workflow.md` for complete workflow details and checklist
