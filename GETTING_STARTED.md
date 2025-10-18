# Getting Started with Timer App Development

This guide will get you from zero to fully automated GitHub workflow in **5 minutes**!

## ✅ Prerequisites

1. **GitHub CLI installed** (you have this!)
   ```bash
   gh --version  # Should show version
   ```

2. **Logged in to GitHub**
   ```bash
   gh auth status  # Should show "Logged in"
   ```

   If not logged in:
   ```bash
   gh auth login
   ```

## 🚀 Quick Start (5 minutes)

### Option 1: Full Automation (Recommended)

**ONE COMMAND does everything:**

```bash
./scripts/setup-github.sh
```

This will:
1. ✅ Create GitHub repository
2. ✅ Push all your code
3. ✅ Create all 35 task issues
4. ✅ Create project board
5. ✅ Set up labels and automation
6. ✅ Enable GitHub Actions
7. ✅ Configure everything

**Just answer a few prompts and you're done!**

### Option 2: Manual Setup

If you prefer control:

```bash
# 1. Create repo
gh repo create timer --public --source=. --remote=origin
git push -u origin main

# 2. Create all issues
./scripts/create-all-issues.sh

# 3. Create project (web UI)
# Go to: https://github.com/your-username?tab=projects
# Click "New project" → Board template

# 4. Add issues to project
./scripts/add-issues-to-project.sh
```

## 📋 Daily Workflow

Once set up, your daily workflow is super simple:

```bash
# Morning: Check what's next
./scripts/status.sh

# Start next task
./scripts/quick-start.sh
# → Auto-creates branch
# → Shows task details
# → Ready to code!

# Work on task
npm run dev
# ... make changes ...

# Commit changes
git add .
git commit -m "Implement feature (progress on #1)"
git push

# Create pull request
gh pr create --fill
# → Auto-links to issue
# → Uses PR template

# When done, merge
gh pr merge
# → Issue auto-closed
# → PROGRESS.md auto-updated
# → Branch auto-deleted
```

## 🎯 What You Get

After running setup, you'll have:

- ✅ **35 GitHub Issues** - One per task
- ✅ **Project Board** - Visual kanban board
- ✅ **Automated Workflow** - PRs auto-link to issues
- ✅ **Auto-updating PROGRESS.md** - Tracks completion
- ✅ **Labels** - Organized by phase
- ✅ **Templates** - Consistent issues and PRs
- ✅ **GitHub Actions** - Automates everything

## 📊 Monitoring Progress

```bash
# Quick status
./scripts/status.sh

# View in browser
gh repo view --web

# View project board
gh project list
```

**Output shows:**
- Overall progress (%)
- Phase breakdown
- Current work
- Next task
- Recent activity

## 🎨 Example Session

```bash
# Run once at start
$ ./scripts/setup-github.sh
🚀 Timer App - GitHub Setup Automation
=======================================
Repository visibility (public/private) [public]: public
Repository name [timer]: timer
...
✅ Setup Complete! All 35 issues created

# Daily workflow
$ ./scripts/quick-start.sh
🚀 Timer App - Quick Start
==========================
Next task:
  Issue #1: Task 01: Initialize Electron + Vite + React
Start working on this task? (y/n): y
✓ Ready to work!

# Work, commit, PR, merge...

$ ./scripts/status.sh
📊 Timer App - Project Status
==============================
Repository: username/timer
Task Progress:
--------------
Completed: 1/35 (3%)
In Progress: 1
Open: 33
Progress: [█░░░░░░░░░] 3%
```

## 🔧 Available Scripts

Located in `scripts/`:

| Script | Purpose | When to Use |
|--------|---------|-------------|
| **setup-github.sh** | Complete setup | **First time only** |
| **quick-start.sh** | Start next task | **Every day** |
| **status.sh** | View progress | **Frequently** |
| create-all-issues.sh | Create issues | If setup didn't run |
| add-issues-to-project.sh | Add to board | Manual project setup |

## 💡 Tips

1. **Run setup once** - It's idempotent (safe to re-run)
2. **Use quick-start daily** - Automates branch creation
3. **Check status often** - See your progress
4. **Commit frequently** - Small, focused commits
5. **Use `gh pr create --fill`** - Auto-fills PR template

## 🎓 Learning the Workflow

### First Task Walkthrough

```bash
# 1. Start
./scripts/quick-start.sh

# 2. Read task file
cat contexts/tasks/phase1-01-initialize-electron-vite-react.md

# 3. Follow instructions in task file
npm create vite@latest . -- --template react-ts
# ... etc ...

# 4. Commit as you go
git commit -m "Set up Vite config (progress on #1)"

# 5. When done, verify acceptance criteria
# Check off all [ ] items in task file

# 6. Create PR
gh pr create --fill

# 7. Merge
gh pr merge

# 8. Next task!
./scripts/quick-start.sh
```

## 🆘 Troubleshooting

**"gh: command not found"**
```bash
# Install GitHub CLI
brew install gh  # macOS
# or visit: https://cli.github.com/
```

**"Not logged in to GitHub"**
```bash
gh auth login
# Follow prompts
```

**"Permission denied"**
```bash
chmod +x scripts/*.sh
```

**"Repository already exists"**
- Setup script will detect and ask if you want to use it
- Or delete and re-create: `gh repo delete username/timer`

**"Can't create project"**
- Projects v2 API may have restrictions
- Create manually: https://github.com/username?tab=projects
- Then run: `./scripts/add-issues-to-project.sh`

## 🎯 Success Criteria

You're ready when you see:

✅ Repository created on GitHub
✅ All 35 issues visible
✅ Project board created
✅ Actions enabled
✅ First issue shows in quick-start

## 🚀 Ready?

**Run this now:**

```bash
./scripts/setup-github.sh
```

**Then start coding:**

```bash
./scripts/quick-start.sh
```

---

**Questions?** Check:
- `scripts/README.md` - Script documentation
- `docs/GITHUB_WORKFLOW.md` - Detailed workflow guide
- `docs/GITHUB_FREE_SETUP.md` - Free tier specifics

**Let's build this timer app!** 🎉
