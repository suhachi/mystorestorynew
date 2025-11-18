#!/bin/bash

###############################################################################
# MyStoreStory T14 배포 스크립트
# Usage: ./scripts/deploy.sh [staging|production]
###############################################################################

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Environment
ENV=${1:-staging}

echo -e "${GREEN}======================================"
echo "MyStoreStory T14 배포 스크립트"
echo "Environment: $ENV"
echo -e "======================================${NC}"

# Validation
if [ "$ENV" != "staging" ] && [ "$ENV" != "production" ]; then
    echo -e "${RED}Error: Invalid environment. Use 'staging' or 'production'${NC}"
    exit 1
fi

# Production warning
if [ "$ENV" == "production" ]; then
    echo -e "${YELLOW}⚠️  WARNING: Production deployment!${NC}"
    read -p "Are you sure? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        echo "Deployment cancelled."
        exit 0
    fi
fi

# Step 1: Switch Firebase project
echo -e "\n${GREEN}[1/7] Switching to $ENV project...${NC}"
firebase use $ENV
firebase projects:list

# Step 2: Build Functions
echo -e "\n${GREEN}[2/7] Building Cloud Functions...${NC}"
cd functions
npm install
npm run build
cd ..

# Step 3: Check Secrets
echo -e "\n${GREEN}[3/7] Checking secrets...${NC}"
firebase functions:secrets:access SLACK_WEBHOOK_URL > /dev/null 2>&1 || {
    echo -e "${YELLOW}Warning: SLACK_WEBHOOK_URL not set${NC}"
    read -p "Set SLACK_WEBHOOK_URL now? (yes/no): " set_secret
    if [ "$set_secret" == "yes" ]; then
        firebase functions:secrets:set SLACK_WEBHOOK_URL
    fi
}

# Step 4: Deploy Firestore Rules
echo -e "\n${GREEN}[4/7] Deploying Firestore rules...${NC}"
firebase deploy --only firestore:rules

# Step 5: Deploy Firestore Indexes
echo -e "\n${GREEN}[5/7] Deploying Firestore indexes...${NC}"
firebase deploy --only firestore:indexes
echo -e "${YELLOW}Note: Index creation may take 5-10 minutes${NC}"

# Step 6: Deploy Functions
echo -e "\n${GREEN}[6/7] Deploying Cloud Functions...${NC}"
firebase deploy --only functions

# Step 7: Verify deployment
echo -e "\n${GREEN}[7/7] Verifying deployment...${NC}"
firebase functions:list
firebase firestore:indexes

# Success
echo -e "\n${GREEN}======================================"
echo "✅ Deployment successful!"
echo "Environment: $ENV"
echo "======================================${NC}"

# Next steps
echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Run smoke tests: see docs/T14-Smoke-Test-Checklist.md"
echo "2. Monitor logs: firebase functions:log --follow"
echo "3. Check DLQ: https://console.firebase.google.com/project/<project-id>/firestore/data/ops/notifyFailures"

# Production-specific
if [ "$ENV" == "production" ]; then
    echo -e "\n${GREEN}Production deployment checklist:${NC}"
    echo "[ ] Announce maintenance window (if needed)"
    echo "[ ] Run smoke tests"
    echo "[ ] Monitor error rates (first 30 minutes)"
    echo "[ ] Notify team in Slack"
fi

exit 0
