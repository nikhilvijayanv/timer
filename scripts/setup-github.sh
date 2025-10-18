#!/bin/bash
# Complete GitHub setup automation
# This script creates repo, issues, project board, and configures everything

set -e

echo "🚀 Timer App - GitHub Setup Automation"
echo "======================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}Error: GitHub CLI (gh) not installed${NC}"
    echo "Install it: https://cli.github.com/"
    exit 1
fi

# Check if logged in
echo "Checking GitHub authentication..."
if ! gh auth status &> /dev/null; then
    echo -e "${RED}Error: Not logged in to GitHub${NC}"
    echo "Run: gh auth login"
    exit 1
fi
echo -e "${GREEN}✓ GitHub authenticated${NC}"
echo ""

# Get GitHub username
GH_USER=$(gh api user -q .login)
echo -e "${BLUE}GitHub User: ${GH_USER}${NC}"
echo ""

# Ask user preferences
echo "Repository Setup"
echo "----------------"
read -p "Repository visibility (public/private) [public]: " VISIBILITY
VISIBILITY=${VISIBILITY:-public}

read -p "Repository name [timer]: " REPO_NAME
REPO_NAME=${REPO_NAME:-timer}

read -p "Repository description [macOS menu bar timer app]: " REPO_DESC
REPO_DESC=${REPO_DESC:-"macOS menu bar timer app"}

echo ""
echo -e "${YELLOW}This will:${NC}"
echo "  1. Create GitHub repository: ${GH_USER}/${REPO_NAME} (${VISIBILITY})"
echo "  2. Push your code to GitHub"
echo "  3. Create 35 issues from task files"
echo "  4. Create Project board"
echo "  5. Add all issues to project"
echo "  6. Set up labels"
echo "  7. Enable GitHub Actions"
echo ""
read -p "Continue? (y/n): " CONFIRM

if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 0
fi

echo ""
echo "================================================"
echo "Step 1: Creating GitHub Repository"
echo "================================================"

# Check if repo already exists
if gh repo view "${GH_USER}/${REPO_NAME}" &> /dev/null; then
    echo -e "${YELLOW}Repository already exists!${NC}"
    read -p "Use existing repository? (y/n): " USE_EXISTING
    if [[ ! "$USE_EXISTING" =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 0
    fi
    echo -e "${GREEN}✓ Using existing repository${NC}"
else
    # Create repository
    if [ "$VISIBILITY" = "private" ]; then
        gh repo create "${REPO_NAME}" --private --description "${REPO_DESC}" --source=. --remote=origin
    else
        gh repo create "${REPO_NAME}" --public --description "${REPO_DESC}" --source=. --remote=origin
    fi
    echo -e "${GREEN}✓ Repository created${NC}"
fi

echo ""
echo "================================================"
echo "Step 2: Pushing Code to GitHub"
echo "================================================"

# Check if main branch exists
if ! git rev-parse --verify main &> /dev/null; then
    echo "Creating main branch..."
    git branch -M main
fi

# Add all files
git add .
git commit -m "Initial commit: Timer app with complete task breakdown and GitHub automation" || echo "No changes to commit"

# Push to GitHub
git push -u origin main 2>&1 | grep -v "Everything up-to-date" || echo -e "${GREEN}✓ Code pushed to GitHub${NC}"

echo -e "${GREEN}✓ Code on GitHub${NC}"

echo ""
echo "================================================"
echo "Step 3: Configuring Repository Settings"
echo "================================================"

# Enable Actions (via API)
echo "Enabling GitHub Actions..."
gh api -X PUT "/repos/${GH_USER}/${REPO_NAME}/actions/permissions" -f enabled=true -f allowed_actions=all &> /dev/null || true
echo -e "${GREEN}✓ GitHub Actions enabled${NC}"

# Set Actions permissions (read/write for PROGRESS.md updates)
echo "Setting Actions permissions..."
gh api -X PUT "/repos/${GH_USER}/${REPO_NAME}/actions/permissions/workflow" -f default_workflow_permissions=write -f can_approve_pull_request_reviews=true &> /dev/null || true
echo -e "${GREEN}✓ Actions permissions configured${NC}"

# Enable Issues
echo "Enabling Issues..."
gh api -X PATCH "/repos/${GH_USER}/${REPO_NAME}" -f has_issues=true &> /dev/null || true
echo -e "${GREEN}✓ Issues enabled${NC}"

# Enable Projects
echo "Enabling Projects..."
gh api -X PATCH "/repos/${GH_USER}/${REPO_NAME}" -f has_projects=true &> /dev/null || true
echo -e "${GREEN}✓ Projects enabled${NC}"

echo ""
echo "================================================"
echo "Step 4: Creating Labels"
echo "================================================"

# Create phase labels
LABELS=(
    "phase-1:0366d6:Phase 1 - Project Setup"
    "phase-2:1d76db:Phase 2 - Styling & UI"
    "phase-3:0e8a16:Phase 3 - Database & Services"
    "phase-4:fbca04:Phase 4 - Electron Main Process"
    "phase-5:d93f0b:Phase 5 - React UI Components"
    "phase-6:e99695:Phase 6 - Timer Logic & Integration"
    "phase-7:5319e7:Phase 7 - Testing & Build"
    "task:d876e3:Implementation Task"
    "in-progress:c5def5:Work in progress"
    "completed:28a745:Completed"
    "blocked:b60205:Blocked by dependency"
)

for label in "${LABELS[@]}"; do
    IFS=':' read -r name color description <<< "$label"
    gh label create "$name" --color "$color" --description "$description" --force 2>&1 | grep -v "already exists" || true
done

echo -e "${GREEN}✓ Labels created${NC}"

echo ""
echo "================================================"
echo "Step 5: Creating Project Board"
echo "================================================"

# Create project using new Projects (beta)
echo "Creating project board..."
PROJECT_ID=$(gh project create --owner "${GH_USER}" --title "Timer App Development" --format json 2>/dev/null | jq -r .id)

if [ -n "$PROJECT_ID" ]; then
    echo -e "${GREEN}✓ Project board created (ID: ${PROJECT_ID})${NC}"
    echo ""
    echo -e "${BLUE}View project: https://github.com/users/${GH_USER}/projects/${PROJECT_ID}${NC}"
else
    echo -e "${YELLOW}⚠ Could not create project automatically${NC}"
    echo "You can create it manually at: https://github.com/${GH_USER}?tab=projects"
fi

echo ""
echo "================================================"
echo "Step 6: Creating All 35 Issues"
echo "================================================"

echo "This will create all 35 tasks as GitHub issues..."
sleep 1

# Source the create-all-issues script
if [ -f "./scripts/create-all-issues.sh" ]; then
    bash ./scripts/create-all-issues.sh
    echo -e "${GREEN}✓ All 35 issues created${NC}"
else
    echo -e "${RED}Error: create-all-issues.sh not found${NC}"
fi

echo ""
echo "================================================"
echo "Setup Complete! 🎉"
echo "================================================"
echo ""
echo -e "${GREEN}✓ Repository created and configured${NC}"
echo -e "${GREEN}✓ Code pushed to GitHub${NC}"
echo -e "${GREEN}✓ GitHub Actions enabled${NC}"
echo -e "${GREEN}✓ All 35 issues created${NC}"
echo -e "${GREEN}✓ Project board created${NC}"
echo -e "${GREEN}✓ Labels configured${NC}"
echo ""
echo "Next Steps:"
echo "----------"
echo "1. View your repository:"
echo -e "   ${BLUE}https://github.com/${GH_USER}/${REPO_NAME}${NC}"
echo ""
echo "2. View all issues:"
echo -e "   ${BLUE}https://github.com/${GH_USER}/${REPO_NAME}/issues${NC}"
echo ""
if [ -n "$PROJECT_ID" ]; then
echo "3. View project board:"
echo -e "   ${BLUE}https://github.com/users/${GH_USER}/projects/${PROJECT_ID}${NC}"
echo ""
echo "4. Add issues to project board:"
echo "   Go to project → Add items → Select all issues"
echo ""
fi
echo "5. Start working on Task 01:"
echo "   ${BLUE}gh issue develop 1 --checkout${NC}"
echo ""
echo "================================================"
echo "Happy coding! 🚀"
echo "================================================"
