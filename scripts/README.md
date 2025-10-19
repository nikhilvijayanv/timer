# Scripts

Automation scripts for GitHub workflow and project management.

## 🚀 Initial Setup

### `setup-github.sh`

**Complete automated GitHub setup**

```bash
./scripts/setup-github.sh
```

Does everything:

- ✅ Creates GitHub repository
- ✅ Pushes code
- ✅ Enables Actions
- ✅ Creates all 35 issues
- ✅ Creates project board
- ✅ Sets up labels
- ✅ Configures permissions

**Run this first!**

## 📋 Daily Workflow

### `quick-start.sh`

**Start working on next task**

```bash
./scripts/quick-start.sh
```

- Finds next open task
- Shows task details
- Creates branch
- Checks out branch
- Ready to work!

### `status.sh`

**View project progress**

```bash
./scripts/status.sh
```

Shows:

- Overall progress (%)
- Phase breakdown
- Current work
- Open PRs
- Next task

## 🔧 Utilities

### `create-all-issues.sh`

**Create all 35 issues**

```bash
./scripts/create-all-issues.sh
```

Use if you already have a repo and just need issues.

### `add-issues-to-project.sh`

**Add issues to project board**

```bash
./scripts/add-issues-to-project.sh
```

Bulk-adds all issues to your project board.

## 📖 Typical Workflow

### First Time Setup

```bash
# 1. Run complete setup
./scripts/setup-github.sh

# This does EVERYTHING automatically!
```

### Daily Development

```bash
# 1. Check status
./scripts/status.sh

# 2. Start next task
./scripts/quick-start.sh

# 3. Work on task
# ... make changes ...

# 4. Commit
git add .
git commit -m "Implement feature (progress on #1)"

# 5. Push
git push

# 6. Create PR
gh pr create --fill

# 7. Merge when ready
gh pr merge

# 8. Repeat!
```

## 🎯 Quick Reference

```bash
# Complete setup (first time)
./scripts/setup-github.sh

# Start next task
./scripts/quick-start.sh

# Check progress
./scripts/status.sh

# View all tasks
gh issue list --label task

# View open tasks
gh issue list --label task --state open

# View completed tasks
gh issue list --label task --state closed

# Create PR
gh pr create --fill

# Check PR status
gh pr status

# Merge PR
gh pr merge
```

## 🔒 Requirements

All scripts require:

- GitHub CLI (`gh`) installed
- Authenticated with GitHub (`gh auth login`)
- Run from project root directory

## 🎨 Features

**setup-github.sh:**

- Interactive prompts
- Error checking
- Color-coded output
- Progress indicators
- Idempotent (safe to re-run)

**quick-start.sh:**

- Auto-finds next task
- Shows task details
- Creates proper branch name
- Helpful next steps

**status.sh:**

- Visual progress bars
- Phase breakdown
- Current work summary
- Next task suggestion

## 💡 Tips

1. **Run setup once** at the start
2. **Use quick-start** daily
3. **Check status** frequently
4. **Automate everything** possible

## 🆘 Troubleshooting

**"gh: command not found"**

- Install GitHub CLI: https://cli.github.com/

**"Not logged in"**

```bash
gh auth login
```

**"Permission denied"**

```bash
chmod +x scripts/*.sh
```

**"Repository already exists"**

- Setup script will ask if you want to use it
- Or manually configure with other scripts

## 🚀 Advanced

### Custom Labels

Edit `setup-github.sh` and modify the `LABELS` array:

```bash
LABELS=(
    "custom-label:color:description"
    # add more...
)
```

### Skip Steps

Comment out sections in `setup-github.sh`:

```bash
# echo "Step 4: Creating Labels"
# for label in "${LABELS[@]}"; do
#     ...
# done
```

### Batch Operations

```bash
# Close multiple issues
for i in {1..5}; do
    gh issue close $i
done

# Label multiple issues
for i in {1..5}; do
    gh issue edit $i --add-label "priority-high"
done
```

---

**Ready to automate?** Run `./scripts/setup-github.sh` to get started!
