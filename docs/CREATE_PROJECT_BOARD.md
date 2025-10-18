# Create GitHub Project Board - Visual Guide

## 🎯 Quick Links

**Your repository:** https://github.com/nikhilvijayanv/timer

**Projects tab:** https://github.com/nikhilvijayanv/timer/projects

**Direct create link:** https://github.com/nikhilvijayanv/timer/projects/new

---

## 📋 Step-by-Step Instructions

### Step 1: Go to Projects Tab

```
https://github.com/nikhilvijayanv/timer
```

At the top of your repo, click: **Projects**

### Step 2: Create New Project

You'll see: "Welcome to Projects!"

Click: **"New project"** (green button)

Or: **"Link a project" → "New project"**

### Step 3: Choose Template

Select: **"Board"** template

(The kanban-style board with columns)

### Step 4: Name Your Project

- **Title:** Timer App Development
- **Description:** Track all 35 implementation tasks

Click: **"Create project"**

### Step 5: Your Project is Created! 🎉

URL will be: `https://github.com/users/nikhilvijayanv/projects/1`

---

## 🔗 Add All 35 Issues to Board

### Quick Method (Recommended):

1. **In your project board**, click the **"+"** button
2. **Or** click **"Add items"** at the bottom
3. In the search, type: `is:issue label:task repo:nikhilvijayanv/timer`
4. **Select all 35 issues** (checkbox at top)
5. Click **"Add selected items"**

✅ **Done!** All tasks are now on your board!

### Alternative Method:

1. Go to **Issues tab**: https://github.com/nikhilvijayanv/timer/issues
2. Click on an issue
3. On the right sidebar, under **"Projects"**
4. Click **"Add to project"**
5. Select your board
6. Repeat for each issue (or use quick method above!)

---

## 🎨 Customize Your Board

### Add Custom Columns:

Default columns:
- 📋 **Todo** - Pending tasks
- 🏗️ **In Progress** - Current work
- ✅ **Done** - Completed tasks

You can add more:
- **Blocked** - Waiting on dependencies
- **Testing** - Code complete, testing
- **Review** - Waiting for review

### Click "+" next to columns to add new ones

---

## 🔄 Set Up Automation

Click **"⋯"** (three dots) on any column → **"Manage automation"**

**Recommended automations:**

**Todo column:**
- ✅ Auto-add items: Issues with label `task`
- ✅ Set status to: Todo

**In Progress column:**
- ✅ When PR is opened
- ✅ When issue is assigned

**Done column:**
- ✅ When PR is merged
- ✅ When issue is closed

---

## 📊 What You'll See

Your board will look like this:

```
┌──────────────┬──────────────┬──────────────┐
│    Todo      │ In Progress  │     Done     │
├──────────────┼──────────────┼──────────────┤
│ Task 01 ◯    │              │              │
│ Task 02 ◯    │              │              │
│ Task 03 ◯    │              │              │
│ ...          │              │              │
│ (35 total)   │              │              │
└──────────────┴──────────────┴──────────────┘
```

**As you work:**
- Drag tasks to "In Progress" when you start
- PRs automatically move tasks
- Completed tasks move to "Done"

---

## 🎯 After Setup

**Your project board URL:**
```
https://github.com/users/nikhilvijayanv/projects/1
```

**Bookmark it!**

**Access anytime:**
- Your profile → Projects tab
- Or: https://github.com/nikhilvijayanv?tab=projects

---

## 💡 Tips

1. **Pin the project** to your profile for quick access
2. **Use filters** to view by phase: `label:phase-1`
3. **Sort by** task number to see sequential order
4. **Create views** for different perspectives (by phase, by priority, etc.)

---

## 🚀 Ready!

Once your board is set up, start working:

```bash
./scripts/quick-start.sh
```

**Your workflow:**
1. Task appears in "Todo" column
2. Start work → Move to "In Progress" (or auto-moves when you create branch)
3. Create PR → Stays in "In Progress"
4. Merge PR → Auto-moves to "Done"

---

## 🆘 Troubleshooting

**"Can't find Projects tab"**
- Make sure you're on your repository page
- Projects should be between "Pull requests" and "Wiki"

**"Can't add issues to project"**
- Make sure the project is created
- Use the search method: `is:issue label:task`

**"Issues not showing up"**
- Refresh the page
- Check the filter/search
- Make sure issues have `task` label

---

**Need help?** All 35 issues are already created and labeled. Just create the board and add them!

**Next:** Start building with `./scripts/quick-start.sh`
