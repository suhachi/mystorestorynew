#!/bin/bash

###############################################################################
# MyStoreStory T14 로컬 테스트 스크립트
# Usage: ./scripts/local-test.sh
###############################################################################

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}======================================"
echo "MyStoreStory T14 로컬 테스트"
echo -e "======================================${NC}"

# Step 1: TypeScript 타입 체크
echo -e "\n${GREEN}[1/5] Running TypeScript type check...${NC}"
pnpm typecheck || {
    echo -e "${YELLOW}Warning: Type errors found. Continue anyway? (yes/no)${NC}"
    read confirm
    [ "$confirm" != "yes" ] && exit 1
}

# Step 2: Functions 빌드
echo -e "\n${GREEN}[2/5] Building Cloud Functions...${NC}"
cd functions
npm install
npm run build
cd ..

# Step 3: Firestore 에뮬레이터 시작 (백그라운드)
echo -e "\n${GREEN}[3/5] Starting Firebase emulators...${NC}"
firebase emulators:start --only firestore,functions &
EMULATOR_PID=$!

# Wait for emulators to start
echo -e "${YELLOW}Waiting for emulators to start (10 seconds)...${NC}"
sleep 10

# Step 4: 프론트엔드 개발 서버 시작
echo -e "\n${GREEN}[4/5] Starting frontend dev server...${NC}"
npm run dev &
DEV_PID=$!

# Step 5: 브라우저 열기
echo -e "\n${GREEN}[5/5] Opening browser...${NC}"
sleep 3
open http://localhost:5173

# Info
echo -e "\n${GREEN}======================================"
echo "✅ Local test environment ready!"
echo "======================================${NC}"
echo ""
echo "Emulators:"
echo "  - Firestore: http://localhost:8080"
echo "  - Functions: http://localhost:5001"
echo ""
echo "Frontend:"
echo "  - Dev Server: http://localhost:5173"
echo ""
echo "Test routes:"
echo "  - Checkout: http://localhost:5173/?route=customer-checkout"
echo "  - Order Track: http://localhost:5173/?route=customer-order-track&orderId=test"
echo "  - Notify Ops: http://localhost:5173/?route=owner-notify-ops"
echo "  - Templates: http://localhost:5173/?route=owner-notify-templates"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all servers${NC}"

# Cleanup on exit
cleanup() {
    echo -e "\n${GREEN}Stopping servers...${NC}"
    kill $EMULATOR_PID 2>/dev/null || true
    kill $DEV_PID 2>/dev/null || true
    firebase emulators:stop
    exit 0
}

trap cleanup INT TERM

# Wait
wait
