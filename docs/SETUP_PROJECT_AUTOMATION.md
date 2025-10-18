# Setup Project Board Automation

Your project board needs automation rules to automatically move issues between columns.

## 🎯 Quick Setup (2 minutes)

### Step 1: Go to Your Project Board

Your board: https://github.com/users/nikhilvijayanv/projects/1

(Or find it at: https://github.com/nikhilvijayanv?tab=projects)

### Step 2: Set Up "In Progress" Automation

1. **Click the "⋯" (three dots)** on the **"In Progress"** column header
2. **Click "Workflows"**
3. **Turn ON these automations:**

   **Item added to project:**
   - ✅ Set status to: In Progress
   - When: Issue is added to project with label `in-progress`

   **Pull request opened:**
   - ✅ Set status to: In Progress
   - When: Pull request is opened that mentions an issue

   **Item assigned:**
   - ✅ Set status to: In Progress
   - When: Issue is assigned

### Step 3: Set Up "Done" Automation

1. **Click the "⋯" (three dots)** on the **"Done"** column header
2. **Click "Workflows"**
3. **Turn ON these automations:**

   **Issue closed:**
   - ✅ Set status to: Done
   - When: Issue is closed

   **Pull request merged:**
   - ✅ Set status to: Done
   - When: Pull request is merged

### Step 4: Set Up "Todo" Automation (Optional)

1. **Click the "⋯" (three dots)** on the **"Todo"** column
2. **Click "Workflows"**
3. **Turn ON:**

   **Item added to project:**
   - ✅ Set status to: Todo
   - When: Item is added to project

   **Issue reopened:**
   - ✅ Set status to: Todo
   - When: Issue is reopened

---

## 🔄 How It Works After Setup

### When You Start a Task:

```bash
# 1. Start task
gh issue develop 1 --checkout
# → Creates branch from issue

# 2. Make changes
git commit -m "Your changes (progress on #1)"

# 3. Create PR
gh pr create --fill --body "Closes #1"
```

**What happens automatically:**
1. ✅ Issue gets labeled `in-progress` (GitHub Actions)
2. ✅ Issue moves to "In Progress" column (Project automation)
3. ✅ Comment added to issue (GitHub Actions)

### When You Finish a Task:

```bash
# Merge PR
gh pr merge
```

**What happens automatically:**
1. ✅ PR merges
2. ✅ Issue auto-closes (because PR said "Closes #1")
3. ✅ Issue labeled `completed` (GitHub Actions)
4. ✅ Issue moves to "Done" column (Project automation)
5. ✅ PROGRESS.md auto-updates (GitHub Actions)
6. ✅ Branch auto-deleted

---

## 🎨 Visual Workflow

```
Todo Column          In Progress Column       Done Column
┌────────────┐       ┌────────────┐          ┌────────────┐
│ Task 01    │       │            │          │            │
│ Task 02    │  ───> │            │    ───>  │            │
│ Task 03    │       │            │          │            │
│ ...        │       │            │          │            │
└────────────┘       └────────────┘          └────────────┘

Actions that trigger movement:
→ Create PR: Moves to "In Progress"
→ Merge PR: Moves to "Done"
```

---

## 🎯 Quick Reference

| Action | Board Movement | Who Does It |
|--------|---------------|-------------|
| Add issue to project | → Todo | Manual or Auto |
| Create branch (`gh issue develop`) | No movement | - |
| Create PR mentioning issue | → In Progress | **Project Automation** |
| Assign issue to yourself | → In Progress | **Project Automation** |
| Merge PR | → Done | **Project Automation** |
| Close issue | → Done | **Project Automation** |

---

## 🔧 Advanced Automation Options

### Create Custom Automation:

1. **Click "⋯"** on any column
2. **Click "Workflows"**
3. **Click "+ Workflow"** to create custom rules

**Examples:**

- **Auto-archive** items in Done after 30 days
- **Label-based movement** - Move when specific label added
- **Assignee-based** - Move when assigned to you
- **Custom triggers** - Based on comments, milestones, etc.

### Built-in Triggers Available:

- Item added to project
- Item reopened
- Item closed
- Pull request merged
- Pull request opened
- Pull request closed
- Pull request reopened
- Pull request ready for review
- Pull request converted to draft
- Item assigned
- Item unassigned

---

## ✅ Verification

After setting up automation, test it:

1. **Manually move Task 35** to "In Progress"
2. **Check if it worked** - Should move!
3. **Create a test issue**, add to project
4. **Should appear in "Todo"** automatically

---

## 💡 Pro Tips

1. **Keep it simple** - The basic automations above work great
2. **Don't over-automate** - Too many rules can be confusing
3. **Test with one issue** first before relying on it
4. **Manual override** - You can always drag items manually

---

## 🆘 Troubleshooting

**Automation not working?**
- Make sure you saved the workflow settings
- Refresh the project board page
- Check if the trigger actually happened (PR created, issue closed, etc.)

**Items not moving?**
- Verify automation is ON (green toggle)
- Check the automation rules match your actions
- Try manually dragging one item to test

**Wrong column?**
- Multiple automations can conflict
- Last automation rule wins
- Manually drag to correct column

---

## 🚀 You're All Set!

After configuring these automations, your workflow is:

```bash
# Start task
./scripts/quick-start.sh  # Creates branch

# Work...
git commit -m "Changes (progress on #1)"

# Create PR
gh pr create --fill

# → Issue automatically moves to "In Progress"

# Merge when done
gh pr merge

# → Issue automatically moves to "Done"
# → PROGRESS.md automatically updates
```

**Everything else is automatic!** 🎉
