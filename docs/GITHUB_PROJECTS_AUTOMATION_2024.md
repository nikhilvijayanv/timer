# GitHub Projects Automation - Updated Guide (2024)

The automation settings are **not in the column menu** - they're at the project level!

## 🎯 Find Automation Settings

### Location 1: Project Menu (Top Right)

1. **Open your project board**
2. **Look at the TOP RIGHT** of the page (not the column)
3. **Click the "⋮" (three vertical dots)** icon
4. **Click "Workflows"** from the dropdown

### Location 2: Project Settings

1. **Open your project board**
2. **Click "..." menu** (top right)
3. **Click "Settings"**
4. **Look for "Workflows"** in the left sidebar

---

## 🔄 Built-in Workflows Available

When you open Workflows, you'll see these options:

### 1. Auto-add to project

**What it does:** Automatically adds items when they match criteria

**Configure:**

- Click "Edit"
- Set filters (label, assignee, etc.)
- Choose target column (Todo, In Progress, Done)

**Example:**

```
When: Issue has label "in-progress"
Then: Set status to "In Progress"
```

### 2. Auto-archive

**What it does:** Moves items when they're closed/merged

**Configure:**

- Click "Edit"
- Choose when to trigger (issue closed, PR merged)
- Set target status (Done)

**Example:**

```
When: Issue is closed
Then: Set status to "Done"
```

### 3. Auto-update

**What it does:** Updates status based on events

**Configure:**

- Click "Edit"
- Choose trigger event
- Set new status

---

## 🎨 Step-by-Step Setup

### Step 1: Open Workflows

1. Go to your project: https://github.com/users/nikhilvijayanv/projects/1
2. Click **"⋮"** in top right corner
3. Click **"Workflows"**

### Step 2: Enable "Item Closed" Workflow

1. Find **"Item closed"** workflow
2. Click **"Edit"**
3. Set **"When"** = Issue is closed
4. Set **"Set status"** = Done
5. Click **"Save"**

### Step 3: Enable "Pull Request Merged" Workflow

1. Find **"Pull request merged"** workflow
2. Click **"Edit"**
3. Set **"Set status"** = Done
4. Click **"Save"**

### Step 4: Enable "Pull Request Opened" Workflow

1. Find **"Pull request opened"** workflow
2. Click **"Edit"**
3. Set **"Set status"** = In Progress
4. Click **"Save"**

---

## 🚫 If Workflows Menu Doesn't Exist

### Alternative: Use GitHub Actions Instead

Your GitHub Actions workflows (already set up) can update the project:

**File:** `.github/workflows/update-project.yml`

```yaml
name: Update Project Board

on:
  issues:
    types: [opened, closed, reopened, assigned]
  pull_request:
    types: [opened, closed, ready_for_review, converted_to_draft]

jobs:
  update-project:
    runs-on: ubuntu-latest
    steps:
      - name: Move to In Progress when PR opened
        if: github.event_name == 'pull_request' && github.event.action == 'opened'
        uses: actions/add-to-project@v0.5.0
        with:
          project-url: https://github.com/users/nikhilvijayanv/projects/1
          github-token: ${{ secrets.GITHUB_TOKEN }}
          labeled: in-progress
          column-name: In Progress

      - name: Move to Done when closed
        if: github.event.action == 'closed'
        uses: actions/add-to-project@v0.5.0
        with:
          project-url: https://github.com/users/nikhilvijayanv/projects/1
          github-token: ${{ secrets.GITHUB_TOKEN }}
          column-name: Done
```

---

## 💡 Manual Alternative

If automation is too complex, you can:

### Drag and Drop Manually

- **Starting work?** → Drag issue to "In Progress"
- **Finished?** → Drag issue to "Done"

Takes 2 seconds per task, totally fine for 35 tasks!

### Use Labels Instead

The GitHub Actions workflows already set labels:

- Issue gets `in-progress` label → You see it's being worked on
- Issue gets `completed` label → You see it's done
- PROGRESS.md auto-updates → You track completion

**You don't really need the board to move automatically!**

---

## 🎯 Recommended Approach

### Option 1: Manual Board Management (Simplest)

- Let GitHub Actions handle labels
- Manually drag issues on board
- PROGRESS.md tracks everything

### Option 2: Workflows (If Available)

- Find "⋮" menu in top right
- Click "Workflows"
- Enable automation

### Option 3: Skip Board Automation

- Just use the Issues list
- Labels show status
- PROGRESS.md tracks completion
- Run `./scripts/status.sh` to see progress

**Honestly, you don't need the board to be automatic!** The other automations (labels, PROGRESS.md) are more important and already work.

---

## ✅ What's Already Automatic (Without Board)

- ✅ Issues close when PR merged
- ✅ Labels update (`in-progress`, `completed`)
- ✅ PROGRESS.md updates
- ✅ Comments added to issues
- ✅ Branch deleted after merge

**That's the important stuff!** The board is just a visual nice-to-have.

---

## 🚀 Your Workflow Works Even Without Board Automation

```bash
# Start task
./scripts/quick-start.sh
# → Creates branch
# → Shows task details

# Work and commit
git commit -m "Changes (progress on #1)"

# Create PR
gh pr create --fill
# → Links to issue
# → Issue labeled "in-progress" ✅

# Merge PR
gh pr merge
# → Issue closes ✅
# → PROGRESS.md updates ✅
# → Issue labeled "completed" ✅

# Check progress
./scripts/status.sh
# → Shows completion %
```

**Everything important is already automatic!**

Board movement is just visual - you can manually drag tasks or ignore the board entirely.

---

**Bottom line:** Don't worry about the board automation. The important stuff (labels, PROGRESS.md, issue closing) already works!
