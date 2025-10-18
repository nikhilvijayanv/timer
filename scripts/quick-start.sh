#!/bin/bash
# Quick start - begin work on next task

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🚀 Timer App - Quick Start${NC}"
echo "=========================="
echo ""

# Check gh CLI
if ! command -v gh &> /dev/null; then
    echo "Error: GitHub CLI (gh) not installed"
    exit 1
fi

# Find next open task
echo "Finding next open task..."
NEXT_ISSUE=$(gh issue list --label task --limit 1 --json number,title --jq '.[0]')

if [ -z "$NEXT_ISSUE" ]; then
    echo -e "${GREEN}🎉 All tasks complete!${NC}"
    exit 0
fi

ISSUE_NUM=$(echo "$NEXT_ISSUE" | jq -r .number)
ISSUE_TITLE=$(echo "$NEXT_ISSUE" | jq -r .title)

echo ""
echo -e "${YELLOW}Next task:${NC}"
echo -e "  Issue #${ISSUE_NUM}: ${ISSUE_TITLE}"
echo ""

# Extract task number from title
TASK_NUM=$(echo "$ISSUE_TITLE" | grep -oE "Task [0-9]+" | grep -oE "[0-9]+")

if [ -z "$TASK_NUM" ]; then
    echo "Error: Could not parse task number"
    exit 1
fi

# Find task file
TASK_FILE=$(find contexts/tasks -name "phase*-${TASK_NUM}-*.md" | head -1)

if [ ! -f "$TASK_FILE" ]; then
    echo "Error: Task file not found"
    exit 1
fi

echo -e "${BLUE}Task file:${NC} ${TASK_FILE}"
echo ""

read -p "View task details? (y/n): " VIEW_TASK
if [[ "$VIEW_TASK" =~ ^[Yy]$ ]]; then
    echo ""
    echo "=========================================="
    cat "$TASK_FILE"
    echo "=========================================="
    echo ""
fi

read -p "Start working on this task? (y/n): " START_WORK
if [[ ! "$START_WORK" =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 0
fi

# Create branch and check out
echo ""
echo "Creating branch from issue..."

# Extract branch name from title
BRANCH_NAME=$(echo "$ISSUE_TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/task /task-/' | sed 's/[^a-z0-9-]/-/g' | sed 's/--*/-/g' | sed 's/-$//')

# Checkout branch
gh issue develop "$ISSUE_NUM" --checkout --name "$BRANCH_NAME" 2>&1 || git checkout -b "$BRANCH_NAME"

echo ""
echo -e "${GREEN}✓ Ready to work!${NC}"
echo ""
echo "Branch: ${BRANCH_NAME}"
echo "Issue: #${ISSUE_NUM}"
echo "Task file: ${TASK_FILE}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Read task file: ${BLUE}cat ${TASK_FILE}${NC}"
echo "  2. Make changes"
echo "  3. Commit: ${BLUE}git commit -m 'your message (progress on #${ISSUE_NUM})'${NC}"
echo "  4. Create PR: ${BLUE}gh pr create --fill${NC}"
echo ""
