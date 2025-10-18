#!/bin/bash
# Add all issues to a GitHub Project board

set -e

echo "📊 Add Issues to Project Board"
echo "================================"
echo ""

# Check gh CLI
if ! command -v gh &> /dev/null; then
    echo "Error: GitHub CLI (gh) not installed"
    exit 1
fi

# Get username
GH_USER=$(gh api user -q .login)

# List projects
echo "Your projects:"
gh project list --owner "${GH_USER}" --format json | jq -r '.projects[] | "\(.number): \(.title)"'

echo ""
read -p "Enter project number: " PROJECT_NUM

if [ -z "$PROJECT_NUM" ]; then
    echo "Error: No project number provided"
    exit 1
fi

echo ""
echo "Getting project ID..."
PROJECT_ID=$(gh project list --owner "${GH_USER}" --format json | jq -r ".projects[] | select(.number == $PROJECT_NUM) | .id")

if [ -z "$PROJECT_ID" ]; then
    echo "Error: Could not find project #${PROJECT_NUM}"
    exit 1
fi

echo "Project ID: ${PROJECT_ID}"
echo ""
echo "Adding all issues to project..."

# Get repository name
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)

# Get all issues with task label
ISSUES=$(gh issue list --repo "$REPO" --label task --limit 100 --json number --jq '.[].number')

COUNT=0
for ISSUE_NUM in $ISSUES; do
    echo "Adding issue #${ISSUE_NUM}..."
    gh project item-add "$PROJECT_NUM" --owner "${GH_USER}" --url "https://github.com/${REPO}/issues/${ISSUE_NUM}" 2>&1 | grep -v "already exists" || true
    ((COUNT++))
done

echo ""
echo "✅ Added ${COUNT} issues to project board"
echo ""
echo "View project: https://github.com/users/${GH_USER}/projects/${PROJECT_NUM}"
