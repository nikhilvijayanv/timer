#!/bin/bash
# Show project status and progress

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}📊 Timer App - Project Status${NC}"
echo "=============================="
echo ""

# Check gh CLI
if ! command -v gh &> /dev/null; then
    echo "Error: GitHub CLI (gh) not installed"
    exit 1
fi

# Repository info
REPO=$(gh repo view --json nameWithOwner,url,isPrivate -q '{name: .nameWithOwner, url: .url, private: .isPrivate}')
REPO_NAME=$(echo "$REPO" | jq -r .name)
REPO_URL=$(echo "$REPO" | jq -r .url)
IS_PRIVATE=$(echo "$REPO" | jq -r .private)

echo -e "${BLUE}Repository:${NC} ${REPO_NAME}"
echo -e "${BLUE}URL:${NC} ${REPO_URL}"
echo -e "${BLUE}Visibility:${NC} $([ "$IS_PRIVATE" = "true" ] && echo "Private" || echo "Public")"
echo ""

# Issue stats
echo "Task Progress:"
echo "--------------"

TOTAL=$(gh issue list --label task --limit 1000 --json number | jq 'length')
OPEN=$(gh issue list --label task --state open --limit 1000 --json number | jq 'length')
CLOSED=$(gh issue list --label task --state closed --limit 1000 --json number | jq 'length')
IN_PROGRESS=$(gh issue list --label in-progress --limit 1000 --json number | jq 'length')

PERCENT=0
if [ "$TOTAL" -gt 0 ]; then
    PERCENT=$((CLOSED * 100 / TOTAL))
fi

echo -e "${GREEN}Completed:${NC} ${CLOSED}/${TOTAL} (${PERCENT}%)"
echo -e "${YELLOW}In Progress:${NC} ${IN_PROGRESS}"
echo -e "${BLUE}Open:${NC} ${OPEN}"
echo ""

# Show progress bar
FILLED=$((PERCENT / 10))
EMPTY=$((10 - FILLED))
BAR=$(printf '█%.0s' $(seq 1 $FILLED))
BAR+=$(printf '░%.0s' $(seq 1 $EMPTY))
echo -e "Progress: [${BAR}] ${PERCENT}%"
echo ""

# Phase breakdown
echo "By Phase:"
echo "---------"
for i in {1..7}; do
    PHASE_TOTAL=$(gh issue list --label "phase-${i}" --label task --limit 1000 --json number | jq 'length')
    PHASE_DONE=$(gh issue list --label "phase-${i}" --label task --state closed --limit 1000 --json number | jq 'length')

    if [ "$PHASE_TOTAL" -gt 0 ]; then
        PHASE_PERCENT=$((PHASE_DONE * 100 / PHASE_TOTAL))
        PHASE_FILLED=$((PHASE_PERCENT / 10))
        PHASE_EMPTY=$((10 - PHASE_FILLED))
        PHASE_BAR=$(printf '█%.0s' $(seq 1 $PHASE_FILLED))
        PHASE_BAR+=$(printf '░%.0s' $(seq 1 $PHASE_EMPTY))

        echo -e "Phase ${i}: [${PHASE_BAR}] ${PHASE_DONE}/${PHASE_TOTAL} (${PHASE_PERCENT}%)"
    fi
done
echo ""

# Current work
if [ "$IN_PROGRESS" -gt 0 ]; then
    echo "Currently Working On:"
    echo "--------------------"
    gh issue list --label in-progress --json number,title,url --jq '.[] | "  #\(.number): \(.title)\n    \(.url)"'
    echo ""
fi

# Pull requests
PR_OPEN=$(gh pr list --limit 1000 --json number | jq 'length')
if [ "$PR_OPEN" -gt 0 ]; then
    echo "Open Pull Requests: ${PR_OPEN}"
    gh pr list --json number,title,url --jq '.[] | "  #\(.number): \(.title)\n    \(.url)"'
    echo ""
fi

# Recent activity
echo "Recent Activity:"
echo "----------------"
gh issue list --label task --state all --limit 5 --json number,title,state,closedAt --jq '.[] | "  #\(.number): \(.title) [\(.state)]"'
echo ""

# Next up
NEXT=$(gh issue list --label task --state open --limit 1 --json number,title --jq '.[0] | "#\(.number): \(.title)"')
if [ -n "$NEXT" ]; then
    echo -e "${YELLOW}Next Task:${NC}"
    echo "  ${NEXT}"
    echo ""
    echo "Start: ${BLUE}./scripts/quick-start.sh${NC}"
fi

echo ""
echo "Commands:"
echo "---------"
echo "  View all tasks: ${BLUE}gh issue list --label task${NC}"
echo "  Start next task: ${BLUE}./scripts/quick-start.sh${NC}"
echo "  View PROGRESS.md: ${BLUE}cat PROGRESS.md${NC}"
echo "  View project board: ${BLUE}gh project list${NC}"
