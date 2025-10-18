# GitHub Free Account Setup

This project works **100% on GitHub Free**! Here's how to set it up optimally.

## ✅ What Works (Everything Important!)

- Issues, Projects, PRs - Unlimited
- GitHub Actions - 2,000 min/month (plenty for this project)
- All automation workflows
- Issue/PR templates
- Labels and organization
- CLI (`gh`) - Full access

## 🚀 Quick Setup (5 minutes)

### 1. Create Repository

**Option A: Public Repo (Recommended)**
```bash
# Public = unlimited Actions minutes
gh repo create timer --public --source=. --remote=origin
git push -u origin main
```

**Option B: Private Repo**
```bash
# Private = 2,000 Actions minutes/month (still plenty)
gh repo create timer --private --source=. --remote=origin
git push -u origin main
```

**Recommendation:** Use **public** for unlimited Actions and portfolio visibility!

### 2. Enable GitHub Actions

Go to repo → Settings → Actions → General:
- ✅ Allow all actions and reusable workflows
- ✅ Read and write permissions (for PROGRESS.md auto-update)
- ✅ Allow GitHub Actions to create and approve pull requests

### 3. Create Project Board

```bash
# Create project
gh project create --title "Timer App Development" --owner @me

# Or via web UI:
# GitHub → Your repositories → timer → Projects → New project
# Choose: "Board" template
```

### 4. Create All Issues

```bash
# One command creates all 35 tasks
./scripts/create-all-issues.sh

# Then link to project (web UI is easiest)
# Projects → Add items → Select all 35 issues
```

### 5. Set Up Basic Branch Protection (Optional)

Settings → Branches → Add rule:
- Branch name pattern: `main`
- ✅ Require a pull request before merging
- ✅ Require status checks to pass (if you set up tests)

**Note:** Can't require reviewers on free tier, but that's fine for solo dev!

## 📊 GitHub Actions Budget

**Your workflows use ~1-2 minutes per task:**

```
35 tasks × 2 minutes = ~70 minutes total
Free tier = 2,000 minutes/month
Usage = 3.5% of free quota
```

**Conclusion:** Plenty of headroom! 🎉

**Check usage:**
Settings → Billing → Plans and usage → Actions

## 🔄 Recommended Workflow (Free-Optimized)

### For Public Repos (Unlimited Actions)
Use full automation - it's free!

```bash
# Everything works, use as designed
gh issue create --title "Task 01: ..."
gh issue develop 1 --checkout
# ... work ...
gh pr create --fill
gh pr merge
# PROGRESS.md auto-updates ✅
```

### For Private Repos (2,000 min/month)

Same workflow, but if you want to save minutes:

**Option 1: Keep auto-updates** (recommended)
- Still plenty of minutes for 35 tasks
- Worth it for convenience

**Option 2: Manual PROGRESS.md** (if worried about minutes)
```bash
# Disable auto-update workflow:
# Delete .github/workflows/update-progress.yml

# Update manually:
# Edit PROGRESS.md and commit
```

**Recommendation:** Keep automation! 70 minutes is nothing.

## 🎯 Feature Comparison

| Feature | Free | Team ($4/user/mo) |
|---------|------|-------------------|
| Issues | ✅ Unlimited | ✅ Unlimited |
| Projects | ✅ Unlimited | ✅ Unlimited |
| Actions (public) | ✅ Unlimited | ✅ Unlimited |
| Actions (private) | ✅ 2,000 min/mo | ✅ 3,000 min/mo |
| Pull requests | ✅ Unlimited | ✅ Unlimited |
| **Required reviewers** | ❌ No | ✅ Yes |
| **Code owners** | ❌ No | ✅ Yes |
| Branch protection | ✅ Basic | ✅ Advanced |
| **Our project needs** | ✅ **All met!** | Not needed |

## 💡 Free Tier Tips

### 1. Use Public Repo
- Unlimited Actions minutes
- Good for portfolio
- Open source contribution

### 2. Optimize Workflows
Already done! Our workflows are efficient:
- Only run when needed
- No unnecessary steps
- Skip if no changes

### 3. Monitor Usage
```bash
# Check Actions usage
gh api /users/:username/settings/billing/actions

# Or: Settings → Billing
```

### 4. Local Development
Most work happens locally:
- `npm run dev` - No GitHub usage
- `git commit` - No GitHub usage
- Only PRs use Actions

## 🚫 What You Can't Do (And Why It's OK)

### Required Reviewers
**Limitation:** Can't force yourself to review PRs

**Why it's OK:**
- You're solo dev
- Just review your own code before merging
- Use PR checklist

### Code Owners
**Limitation:** Can't auto-assign reviews

**Why it's OK:**
- You're the only owner
- No need for auto-assignment

### Advanced Branch Protection
**Limitation:** Can't require N approvals

**Why it's OK:**
- Basic protection still works
- Prevents accidental pushes to main
- Can still require status checks

## ✨ Free Tier Wins

What you GET for free:
1. ✅ Full automation pipeline
2. ✅ Professional project board
3. ✅ Issue tracking
4. ✅ PR templates and workflows
5. ✅ Auto-updating PROGRESS.md
6. ✅ All 35 tasks organized
7. ✅ Git integration
8. ✅ Portfolio-ready repo

**Cost:** $0/month 🎉

## 🎬 Getting Started

```bash
# 1. Push to GitHub (public recommended)
gh repo create timer --public --source=. --remote=origin
git push -u origin main

# 2. Enable Actions
# Settings → Actions → Enable

# 3. Create all issues
./scripts/create-all-issues.sh

# 4. Create project board
gh project create --title "Timer App" --owner @me

# 5. Start working!
gh issue develop 1 --checkout

# That's it! Everything just works. ✨
```

## 📈 Scaling Up (If Needed Later)

If you outgrow free tier:
- **GitHub Team:** $4/user/month
  - 3,000 Actions minutes
  - Required reviewers
  - More advanced features

But for this project:
- ✅ Free tier is perfect
- ✅ All features work
- ✅ No limitations hit

## 🆘 Troubleshooting Free Tier

**"Workflow didn't run"**
- Check Actions enabled
- Check permissions (read/write)
- Public repo = unlimited minutes

**"Out of Actions minutes"**
- Only possible on private repos
- Check Settings → Billing
- Switch to public or wait for reset

**"Can't enable branch protection"**
- Basic rules work on free
- Advanced rules need paid plan
- You don't need them for solo dev

**"Automation not working"**
- Verify `.github/workflows/` in repo
- Check Actions tab for errors
- Ensure permissions granted

## ✅ Bottom Line

**For this Timer project on GitHub Free:**
- ✅ Everything works perfectly
- ✅ No feature limitations hit
- ✅ Professional workflow
- ✅ Zero cost

**Recommendation:**
1. Use **public repository**
2. Enable all automations
3. Create project board
4. Follow standard workflow

**You have full access to everything you need!** 🚀

---

**Ready to start?** Run `./scripts/create-all-issues.sh` and begin Task 01!
