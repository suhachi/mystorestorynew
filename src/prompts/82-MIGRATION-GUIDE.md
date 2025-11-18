# 82 - Migration Guide

## 📌 목표
버전 업그레이드 및 마이그레이션 가이드를 작성합니다.

**결과물**:
- 버전 업그레이드 가이드
- 데이터 마이그레이션
- Breaking Changes
- 호환성 가이드

**총 마이그레이션 가이드**

---

## 🔄 STEP 1: 마이그레이션 가이드

### 프롬프트 템플릿

```
MyStoreStory 버전 업그레이드 및 마이그레이션 가이드입니다.

## 🔄 Migration Guide

### 1. 개요

#### 버전 관리 정책

**Semantic Versioning**:
```
MAJOR.MINOR.PATCH

예: 1.2.3
- MAJOR (1): Breaking Changes
- MINOR (2): 새 기능 (하위 호환)
- PATCH (3): 버그 수정
```

**릴리즈 주기**:
- **MAJOR**: 6개월 ~ 1년
- **MINOR**: 1-2개월
- **PATCH**: 수시

---

### 2. v1.0 → v2.0 마이그레이션

#### Breaking Changes

##### 1. Firebase SDK 업데이트

**변경 사항**:
```typescript
// v1.0 (Firebase v9)
import firebase from 'firebase/app';
import 'firebase/firestore';

const db = firebase.firestore();

// v2.0 (Firebase v10)
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
```

**마이그레이션 단계**:

```bash
# 1. Firebase 패키지 업데이트
npm install firebase@latest

# 2. Import 문 수정
# 모든 파일에서 Firebase import 변경

# 3. 테스트
npm test
npm run build

# 4. 배포
firebase deploy
```

---

##### 2. Order Status 변경

**변경 사항**:
```typescript
// v1.0
type OrderStatus = 'new' | 'confirmed' | 'completed';

// v2.0
type OrderStatus = 
  | 'pending'      // 'new' → 'pending'
  | 'confirmed'
  | 'preparing'    // 추가
  | 'ready'        // 추가
  | 'delivering'   // 추가
  | 'completed'
  | 'cancelled';   // 추가
```

**데이터 마이그레이션**:

```typescript
// /scripts/migrate-order-status.ts

import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

async function migrateOrderStatus() {
  const ordersRef = db.collection('orders');
  const snapshot = await ordersRef.where('status', '==', 'new').get();

  const batch = db.batch();
  
  snapshot.forEach(doc => {
    batch.update(doc.ref, { status: 'pending' });
  });

  await batch.commit();
  console.log(`✅ ${snapshot.size} orders migrated`);
}

migrateOrderStatus();
```

실행:
```bash
npx ts-node scripts/migrate-order-status.ts
```

---

##### 3. Points System 구조 변경

**변경 사항**:
```typescript
// v1.0
interface Customer {
  id: string;
  points: number;  // 단순 숫자
}

// v2.0
interface Customer {
  id: string;
  points: {
    total: number;
    available: number;
    expired: number;
    history: PointHistory[];
  };
}
```

**마이그레이션 스크립트**:

```typescript
async function migratePointsSystem() {
  const customersRef = db.collection('customers');
  const snapshot = await customersRef.get();

  for (const doc of snapshot.docs) {
    const data = doc.data();
    
    // 기존 points를 새 구조로 변환
    await doc.ref.update({
      points: {
        total: data.points || 0,
        available: data.points || 0,
        expired: 0,
        history: []
      }
    });
  }

  console.log(`✅ ${snapshot.size} customers migrated`);
}
```

---

#### 신규 기능

##### 1. 실시간 주문 알림

**설정 방법**:

```typescript
// 1. FCM 토큰 등록
import { getMessaging, getToken } from 'firebase/messaging';

const messaging = getMessaging();
const token = await getToken(messaging);

// 2. Firestore에 저장
await updateDoc(doc(db, 'users', userId), {
  fcmToken: token
});
```

##### 2. 고급 분석 (Pro 플랜)

**활성화**:

1. 대시보드 → 설정 → 분석
2. "고급 분석 활성화" 클릭
3. Google Analytics 연동 (선택)

**사용 가능 메트릭**:
- 시간대별 매출
- 메뉴별 매출 비중
- 고객 세그먼트 분석
- 재방문율

---

### 3. 플랜 업그레이드 마이그레이션

#### Basic → Pro 업그레이드

**변경 사항**:
```typescript
// 활성화되는 기능
- advancedAnalytics
- loyaltyPoints
- promotions
- customNotifications
- prioritySupport
```

**데이터 마이그레이션**: 없음 (즉시 활성화)

**주의사항**:
- 포인트 시스템 처음 활성화 시 초기 설정 필요
- 기존 고객에게 포인트 소급 적용 여부 결정

---

#### Pro → Enterprise 업그레이드

**변경 사항**:
- 모든 제한 해제
- API 액세스
- 전담 매니저
- 커스텀 개발

**온보딩 프로세스**:
1. 영업팀 미팅
2. 요구사항 분석
3. 커스텀 기능 개발
4. 마이그레이션 계획 수립
5. 실행

---

### 4. 데이터베이스 스키마 변경

#### Firestore 컬렉션 구조 변경

**v1.0**:
```
/orders/{orderId}
  - customerId
  - items
  - total
  - status
```

**v2.0**:
```
/orders/{orderId}
  - storeId (추가)
  - customerId
  - items
  - total
  - status
  - deliveryMethod (추가)
  - paymentMethod (추가)
  - createdAt (추가)
  - updatedAt (추가)
```

**마이그레이션**:

```typescript
async function migrateOrderSchema() {
  const ordersRef = db.collection('orders');
  const snapshot = await ordersRef.get();

  for (const doc of snapshot.docs) {
    const data = doc.data();
    
    await doc.ref.update({
      storeId: data.storeId || 'default-store',
      deliveryMethod: data.deliveryMethod || 'delivery',
      paymentMethod: data.paymentMethod || 'cash',
      createdAt: data.createdAt || Date.now(),
      updatedAt: Date.now()
    });
  }

  console.log(`✅ ${snapshot.size} orders updated`);
}
```

---

### 5. API 변경 사항

#### v1.0 → v2.0 API Changes

##### 주문 생성 API

**v1.0**:
```typescript
// Old API
await createOrder({
  customerId: 'user123',
  items: [...],
  total: 10000
});
```

**v2.0**:
```typescript
// New API
await createOrder({
  storeId: 'store123',  // 추가 필수
  customerId: 'user123',
  items: [...],
  total: 10000,
  deliveryMethod: 'delivery',  // 추가 필수
  paymentMethod: 'card'  // 추가 필수
});
```

**마이그레이션**:
- 기존 코드에 `storeId`, `deliveryMethod`, `paymentMethod` 추가
- 기본값 설정 또는 사용자 입력으로 변경

---

##### Cloud Functions API

**v1.0**:
```typescript
// Old Function
export const updateOrder = functions.https.onCall(async (data) => {
  // ...
});
```

**v2.0**:
```typescript
// New Function (리전 지정)
export const updateOrder = functions
  .region('asia-northeast3')
  .https.onCall(async (data, context) => {
    // 인증 체크 추가
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Authentication required'
      );
    }
    // ...
  });
```

---

### 6. 프론트엔드 변경 사항

#### React 18 업그레이드

**변경 사항**:
```typescript
// v1.0 (React 17)
import ReactDOM from 'react-dom';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// v2.0 (React 18)
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

#### Tailwind CSS v4 업그레이드

**변경 사항**:
- `@tailwind` 대신 `@import`
- CSS 변수 시스템 변경
- JIT 모드 기본 활성화

**마이그레이션**:
```css
/* v1.0 (Tailwind v3) */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* v2.0 (Tailwind v4) */
@import "tailwindcss";
```

---

### 7. 환경 변수 변경

#### .env 파일 구조

**v1.0**:
```bash
REACT_APP_FIREBASE_API_KEY=xxx
REACT_APP_FIREBASE_PROJECT_ID=xxx
```

**v2.0** (Vite):
```bash
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_PROJECT_ID=xxx
```

**마이그레이션**:
1. 모든 `REACT_APP_` → `VITE_` 변경
2. 코드에서 `process.env.REACT_APP_` → `import.meta.env.VITE_` 변경

---

### 8. 마이그레이션 체크리스트

#### 배포 전

- [ ] 백업 생성
```bash
./scripts/backup-firestore.sh
```

- [ ] 스테이징 환경 테스트
```bash
firebase use staging
npm run build:staging
firebase deploy
```

- [ ] 마이그레이션 스크립트 준비
```bash
npx ts-node scripts/migrate-*.ts
```

- [ ] 롤백 계획 수립

#### 배포 중

- [ ] 서비스 공지
  - 이메일 발송
  - 대시보드 배너
  - 예상 소요 시간

- [ ] 마이그레이션 실행
```bash
# 1. 데이터 마이그레이션
npx ts-node scripts/migrate-all.ts

# 2. 애플리케이션 배포
firebase use production
firebase deploy
```

- [ ] 검증
  - 주요 기능 테스트
  - 데이터 무결성 확인
  - 에러 로그 확인

#### 배포 후

- [ ] 모니터링 (24시간)
  - 에러율 확인
  - 성능 메트릭
  - 사용자 피드백

- [ ] 공지
  - 마이그레이션 완료 공지
  - 새 기능 안내
  - 변경 사항 문서

---

### 9. 롤백 가이드

#### 롤백 시나리오

**시나리오 1**: 애플리케이션 오류

```bash
# 이전 버전으로 롤백
firebase hosting:rollback

# 특정 버전으로
firebase hosting:clone project:version1 project:live
```

**시나리오 2**: 데이터 마이그레이션 오류

```bash
# 백업에서 복구
gcloud firestore import gs://mystorestory-backup/[DATE]

# 특정 컬렉션만
gcloud firestore import gs://mystorestory-backup/[DATE] \
  --collection-ids=orders
```

---

### 10. 지원

#### 마이그레이션 지원

**Basic 플랜**:
- 문서 제공
- 이메일 지원

**Pro 플랜**:
- 1:1 지원
- 화상 회의 지원

**Enterprise 플랜**:
- 전담 마이그레이션 지원
- 현장 지원 (선택)
- 데이터 마이그레이션 대행

**문의**: migration@mystorestory.com

IMPORTANT:
- 반드시 백업 먼저
- 스테이징에서 테스트
- 롤백 계획 필수
- 사용자 공지
- 단계별 실행
- 모니터링 필수
```

---

## 📝 핵심 포인트

### 마이그레이션 원칙
1. **백업 우선**: 항상 백업 먼저
2. **테스트**: 스테이징 환경에서 테스트
3. **단계적**: 한 번에 하나씩
4. **롤백 준비**: 문제 발생 시 즉시 롤백

### Breaking Changes 관리
- 최소 1개월 전 공지
- 마이그레이션 가이드 제공
- 지원 기간 설정
- 자동 마이그레이션 제공 (가능 시)

---

## ✅ 완료 체크리스트

- [ ] 백업 완료
- [ ] 마이그레이션 스크립트 준비
- [ ] 스테이징 테스트
- [ ] 롤백 계획
- [ ] 사용자 공지
- [ ] 실행
- [ ] 검증
- [ ] 모니터링

---

## 📝 다음 단계

**83-STYLE-GUIDE.md**로 이동합니다.
