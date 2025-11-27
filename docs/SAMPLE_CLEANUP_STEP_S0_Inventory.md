# STEP S0: 샘플/데모 인벤토리

## 1. 라우트 (app-router.tsx)
| 경로 | 컴포넌트 | 예상 용도 | 처리 방안 |
| :--- | :--- | :--- | :--- |
| `/app-builder-demo` | `AppBuilderLegacyPage` | 구버전 앱 빌더 데모 | **REMOVE** |
| `/app-builder-legacy` | `AppBuilderLegacyPage` | 구버전 앱 빌더 | **REMOVE** |
| `/final-test-dashboard` | `FinalTestDashboard` | 테스트용 대시보드 | **REMOVE** |
| `/system-test` | `SystemTestDashboard` | 시스템 테스트 | **REMOVE** |
| `/enterprise-app-sample` | `EnterpriseDeliveryAppSample` | 엔터프라이즈 앱 샘플 | **REMOVE** |
| `/plan-usage-demo` | `PlanUsageDemo` | 플랜 사용량 데모 | **REMOVE** |
| `/customer-order-track-old` | `OrderTrackPage` | 구버전 주문 추적 | **REMOVE** |
| `/app-preview-by-plan` | `AppPreviewByPlan` | 플랜별 앱 미리보기 | **REMOVE** |
| `/app-preview-quick` | `AppPreviewQuickAccess` | 앱 미리보기 퀵 액세스 | **REMOVE** |
| `/design-system` | `DesignSystemPage` | 디자인 시스템 가이드 | **KEEP (Dev Only)** or **MOVE to deprecated** |

## 2. 컴포넌트 (src/components/examples 등)
| 파일 경로 | 예상 용도 | 처리 방안 |
| :--- | :--- | :--- |
| `src/components/examples/enterprise-delivery-app-sample.tsx` | 엔터프라이즈 앱 UI 샘플 | **REMOVE** |
| `src/components/examples/final-test-dashboard.tsx` | 테스트 대시보드 | **REMOVE** |
| `src/components/examples/plan-usage-demo.tsx` | 플랜 사용량 데모 | **REMOVE** |
| `src/components/examples/plan-limits-demo.tsx` | 플랜 제한 데모 | **REMOVE** |
| `src/components/app-builder/complete-integration-demo.tsx` | 앱 빌더 통합 데모 | **REMOVE** |
| `src/pages/app-builder-legacy-page.tsx` | 구버전 앱 빌더 페이지 | **REMOVE** |
| `src/pages/app-builder-step-*.tsx` | 구버전 앱 빌더 단계별 페이지 | **REMOVE** (if unused) |

## 3. 데이터 및 상수
| 항목 | 위치 | 내용 | 처리 방안 |
| :--- | :--- | :--- | :--- |
| `store_123` | `src/components/store-admin/store-settings.tsx` | 하드코딩된 Store ID | **TODO: Replace with dynamic ID** |
| `VITE_TEST_MODE` | `src/components/system/app-router.tsx` | 테스트 모드 플래그 | **KEEP (Mock Infra)** |

## 4. 기타
- `src/prompts/` 디렉토리는 개발 문서이므로 유지 또는 별도 문서 관리 폴더로 이동 고려.
- `src/assets` 및 `public` 폴더 내 미사용 이미지 확인 필요 (현재 폴더 구조 확인 불가로 보류).
