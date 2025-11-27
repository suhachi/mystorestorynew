# STEP S1 — 샘플/데모 코드 정리 결과

## 1. 제거/격리된 라우트

### 제거된 라우트 (9개)
- **[삭제]** `/app-builder-demo` → AppBuilderLegacyPage
- **[삭제]** `/app-builder-legacy` → AppBuilderLegacyPage
- **[삭제]** `/final-test-dashboard` → FinalTestDashboard
- **[삭제]** `/system-test` → SystemTestDashboard
- **[삭제]** `/enterprise-app-sample` → EnterpriseDeliveryAppSample
- **[삭제]** `/plan-usage-demo` → PlanUsageDemo
- **[삭제]** `/customer-order-track-old` → OrderTrackPage (구버전)
- **[삭제]** `/app-preview-by-plan` → AppPreviewByPlan
- **[삭제]** `/app-preview-quick` → AppPreviewQuickAccess

### 유지된 라우트
- **[유지/DEV_ONLY]** `/design-system` → DesignSystemPage (주석 "Dev Only" 추가)

## 2. 제거/격리된 컴포넌트/페이지

### 제거된 Imports
- `EnterpriseDeliveryAppSample` from `../examples/enterprise-delivery-app-sample`
- `FinalTestDashboard` from `../examples/final-test-dashboard`
- `PlanUsageDemo` from `../examples/plan-usage-demo`
- `SystemTestDashboard` from `../system/system-test-dashboard`
- `OrderTrackPage` from `../../pages/customer/OrderTrackPage`
- `AppPreviewByPlan` from `../../pages/app-preview-by-plan`
- `AppPreviewQuickAccess` from `../examples/app-preview-quick-access`

### 파일 삭제 여부
- 이번 STEP에서는 라우트와 import만 제거했습니다.
- 실제 컴포넌트 파일들은 다음 단계에서 사용처 확인 후 삭제 예정입니다.

## 3. 빌드/테스트 결과

### 빌드 결과
- **상태**: ✅ 성공
- **빌드 시간**: 26.61s
- **번들 크기 변화**: 
  - Before: 2,644.71 kB (gzip: 622.28 kB)
  - After: 2,537.21 kB (gzip: 601.49 kB)
  - **감소량**: ~107 kB (약 4% 감소)

### 기본 플로우 페이지
- /#/store-settings - 예상 정상
- /#/customer-checkout - 예상 정상
- /#/customer-order-track - 예상 정상
- /#/admin-settings - 예상 정상
- /#/owner-orders-manage - 예상 정상

## 4. Rollback 전략

### Commit 정보
- **Branch**: `feature/cleanup-samples`
- **Commit Hash**: `91da4e4`
- **Commit Message**: "STEP S1 - remove sample/demo routes and components"

### Rollback 방법
문제 발생 시 다음 명령어로 되돌리기:
```bash
git reset --hard HEAD~1
# 또는
git revert 91da4e4
```

## 5. 다음 단계 (STEP S2)
- 실제 컴포넌트 파일 삭제 (사용처 확인 후)
- Firestore 샘플 데이터 정리
- `store_123` 하드코딩 ID 교체 (별도 리팩토링)
