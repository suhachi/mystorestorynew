# 74 - Troubleshooting Guide

## 📌 목표
일반적인 문제와 해결 방법을 정리합니다.

**결과물**:
- 문제 해결 가이드
- 일반적인 오류
- 디버깅 팁

**총 트러블슈팅 가이드**

---

## 🔄 STEP 1: 일반적인 문제 해결

### 프롬프트 템플릿

```
MyStoreStory 애플리케이션의 일반적인 문제와 해결 방법을 정리합니다.

## 🔧 Troubleshooting Guide

### 1. 빌드 & 배포 문제

#### ❌ 문제: 프로덕션 빌드 실패

**증상**:
```bash
npm run build
# Error: Cannot resolve module 'firebase/app'
```

**해결 방법**:
```bash
# 1. node_modules 삭제 및 재설치
rm -rf node_modules package-lock.json
npm install

# 2. 캐시 클리어
npm cache clean --force

# 3. Node.js 버전 확인 (v18+ 필요)
node --version

# 4. 다시 빌드
npm run build
```

#### ❌ 문제: Firebase 배포 실패

**증상**:
```bash
firebase deploy
# Error: HTTP Error: 403, Forbidden
```

**해결 방법**:
```bash
# 1. Firebase 로그인 확인
firebase login --reauth

# 2. 프로젝트 확인
firebase use
firebase projects:list

# 3. 올바른 프로젝트 선택
firebase use production

# 4. 권한 확인
# Firebase Console → IAM에서 권한 확인
```

### 2. Firebase 문제

#### ❌ 문제: Firestore Permission Denied

**증상**:
```javascript
// Error: Missing or insufficient permissions
```

**해결 방법**:

1. **Security Rules 확인**:
```javascript
// firestore.rules
match /orders/{orderId} {
  // ❌ 잘못된 규칙
  allow read: if false;
  
  // ✅ 올바른 규칙
  allow read: if request.auth != null;
}
```

2. **배포 확인**:
```bash
firebase deploy --only firestore:rules
```

3. **인증 상태 확인**:
```typescript
import { getAuth } from 'firebase/auth';

const auth = getAuth();
console.log('현재 사용자:', auth.currentUser);
```

#### ❌ 문제: Cloud Functions 타임아웃

**증상**:
```
Function execution took 60001 ms, finished with status: 'timeout'
```

**해결 방법**:

1. **타임아웃 설정 증가**:
```typescript
// functions/src/index.ts
export const myFunction = functions
  .runWith({
    timeoutSeconds: 300, // 5분
    memory: '1GB'
  })
  .https.onCall(async (data, context) => {
    // ...
  });
```

2. **비동기 처리 최적화**:
```typescript
// ❌ 느린 방법
for (const item of items) {
  await processItem(item);
}

// ✅ 병렬 처리
await Promise.all(items.map(item => processItem(item)));
```

### 3. 인증 문제

#### ❌ 문제: 로그인 실패

**증상**:
```
Firebase: Error (auth/invalid-email)
```

**해결 방법**:

1. **이메일 형식 검증**:
```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  toast.error('올바른 이메일을 입력하세요');
  return;
}
```

2. **Firebase Console 확인**:
- Authentication → Sign-in method
- Email/Password 활성화 확인

#### ❌ 문제: 세션 만료

**증상**:
```
User logged out unexpectedly
```

**해결 방법**:

1. **Persistence 설정**:
```typescript
import { setPersistence, browserLocalPersistence } from 'firebase/auth';

await setPersistence(auth, browserLocalPersistence);
```

2. **토큰 갱신**:
```typescript
import { getIdToken } from 'firebase/auth';

// 토큰 강제 갱신
const token = await getIdToken(user, true);
```

### 4. 데이터 문제

#### ❌ 문제: 데이터가 표시되지 않음

**증상**:
```typescript
// 빈 배열만 반환됨
const orders = [];
```

**해결 방법**:

1. **쿼리 확인**:
```typescript
// ❌ 잘못된 쿼리
const ordersRef = collection(db, 'orders');
const q = query(ordersRef, where('status', '=', 'pending'));

// ✅ 올바른 쿼리
const ordersRef = collection(db, 'orders');
const q = query(ordersRef, where('status', '==', 'pending'));
```

2. **인덱스 확인**:
```bash
# firestore:indexes 상태 확인
firebase firestore:indexes

# 인덱스 배포
firebase deploy --only firestore:indexes
```

3. **데이터 구조 확인**:
```typescript
// Console에서 데이터 확인
console.log('Orders:', orders);
console.log('Query:', q);
```

#### ❌ 문제: 데이터 업데이트 안 됨

**증상**:
```typescript
// 업데이트 후에도 변경 안 됨
await updateDoc(docRef, { status: 'confirmed' });
```

**해결 방법**:

1. **Document ID 확인**:
```typescript
console.log('Document ID:', docRef.id);
console.log('Path:', docRef.path);
```

2. **권한 확인**:
```javascript
// firestore.rules
match /orders/{orderId} {
  allow update: if request.auth != null &&
    request.auth.uid == resource.data.ownerId;
}
```

3. **캐시 문제**:
```typescript
// 캐시 무시하고 서버에서 가져오기
import { getDocFromServer } from 'firebase/firestore';

const docSnap = await getDocFromServer(docRef);
```

### 5. UI 문제

#### ❌ 문제: 컴포넌트가 렌더링되지 않음

**증상**:
```
White screen or blank page
```

**해결 방법**:

1. **Console 에러 확인**:
```
F12 → Console 탭
```

2. **ErrorBoundary 확인**:
```typescript
// ErrorBoundary가 에러를 잡고 있는지 확인
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

3. **조건부 렌더링 확인**:
```typescript
// ❌ 잘못된 조건
{data && <Component data={data} />}

// ✅ 올바른 조건
{data ? <Component data={data} /> : <Loading />}
```

#### ❌ 문제: 스타일이 적용되지 않음

**증상**:
```
Tailwind classes not working
```

**해결 방법**:

1. **Tailwind 설정 확인**:
```javascript
// tailwind.config.js (Tailwind v3)
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // ...
}
```

2. **globals.css import 확인**:
```typescript
// main.tsx or App.tsx
import './styles/globals.css';
```

3. **빌드 재시작**:
```bash
npm run dev
```

### 6. 성능 문제

#### ❌ 문제: 페이지 로딩 느림

**증상**:
```
Page takes 5+ seconds to load
```

**해결 방법**:

1. **번들 분석**:
```bash
npm run build
# dist 폴더 크기 확인
```

2. **코드 스플리팅**:
```typescript
// ✅ Lazy loading 적용
const AdminDashboard = lazy(() => import('./pages/admin-dashboard'));
```

3. **이미지 최적화**:
```typescript
// ✅ Lazy loading
<img loading="lazy" src="..." />

// ✅ WebP 포맷
<picture>
  <source srcset="image.webp" type="image/webp" />
  <img src="image.jpg" />
</picture>
```

#### ❌ 문제: 무한 렌더링

**증상**:
```
Component renders infinitely
```

**해결 방법**:

1. **useEffect 의존성 확인**:
```typescript
// ❌ 잘못된 의존성
useEffect(() => {
  fetchData();
}, [fetchData]); // fetchData가 매번 새로 생성됨

// ✅ useCallback 사용
const fetchData = useCallback(async () => {
  // ...
}, []);

useEffect(() => {
  fetchData();
}, [fetchData]);
```

2. **상태 업데이트 확인**:
```typescript
// ❌ 잘못된 상태 업데이트
useEffect(() => {
  setCount(count + 1); // 무한 루프!
}, [count]);

// ✅ 올바른 상태 업데이트
useEffect(() => {
  setCount(prev => prev + 1);
}, []); // 빈 의존성
```

### 7. 환경 변수 문제

#### ❌ 문제: 환경 변수가 undefined

**증상**:
```typescript
console.log(import.meta.env.VITE_FIREBASE_API_KEY); // undefined
```

**해결 방법**:

1. **파일명 확인**:
```bash
# ✅ 올바른 파일명
.env.production
.env.development

# ❌ 잘못된 파일명
env.production
.production.env
```

2. **prefix 확인**:
```bash
# ✅ Vite는 VITE_ prefix 필수
VITE_FIREBASE_API_KEY=xxx

# ❌ prefix 없음
FIREBASE_API_KEY=xxx
```

3. **서버 재시작**:
```bash
# 환경 변수 변경 후 반드시 재시작
npm run dev
```

### 8. 디버깅 팁 🔍

#### A. Console Logging

```typescript
// 상세한 로그
console.log('🔍 Order data:', order);
console.log('🔍 User:', user);
console.log('🔍 Status:', status);

// 조건부 로그
if (process.env.NODE_ENV === 'development') {
  console.log('Dev only:', data);
}
```

#### B. React DevTools

```bash
# 브라우저 확장 프로그램 설치
# Chrome: React Developer Tools
# Firefox: React DevTools

# Components 탭에서 props, state 확인
```

#### C. Network 탭

```bash
# F12 → Network 탭
# API 요청 확인
# - Status code
# - Response
# - Headers
```

#### D. Firebase Emulator

```bash
# 로컬에서 Firebase 테스트
firebase emulators:start

# Emulator UI
http://localhost:4000
```

### 9. 일반적인 에러 코드

#### Firebase Auth Errors

```typescript
switch (error.code) {
  case 'auth/invalid-email':
    message = '올바른 이메일을 입력하세요';
    break;
  case 'auth/user-disabled':
    message = '비활성화된 계정입니다';
    break;
  case 'auth/user-not-found':
    message = '사용자를 찾을 수 없습니다';
    break;
  case 'auth/wrong-password':
    message = '비밀번호가 틀렸습니다';
    break;
  case 'auth/too-many-requests':
    message = '너무 많은 시도입니다. 잠시 후 다시 시도하세요';
    break;
}
```

#### Firestore Errors

```typescript
switch (error.code) {
  case 'permission-denied':
    message = '권한이 없습니다';
    break;
  case 'not-found':
    message = '문서를 찾을 수 없습니다';
    break;
  case 'already-exists':
    message = '이미 존재합니다';
    break;
  case 'unavailable':
    message = '네트워크 연결을 확인하세요';
    break;
}
```

### 10. 지원 받기 💬

#### A. 로그 수집

```bash
# 1. 브라우저 Console 로그 복사
# 2. Network 탭 스크린샷
# 3. 재현 단계 작성
```

#### B. Issue 생성

```markdown
## 버그 설명
[간단한 설명]

## 재현 방법
1. 페이지 이동
2. 버튼 클릭
3. 에러 발생

## 예상 동작
[어떻게 동작해야 하는지]

## 실제 동작
[실제로 어떻게 동작하는지]

## 환경
- OS: macOS
- Browser: Chrome 120
- Version: 1.2.0

## 로그
```
[콘솔 로그 붙여넣기]
```
```

IMPORTANT:
- Console 로그 확인
- Firebase Rules 검증
- 네트워크 요청 확인
- 인덱스 상태 확인
- 환경 변수 검증
- 디버깅 도구 활용
```

---

## 📝 핵심 포인트

### 문제 해결 순서
1. **Console 확인**: 에러 메시지
2. **Network 확인**: API 요청
3. **Firebase Console**: Rules, 데이터
4. **문서 참조**: Firebase Docs
5. **팀 문의**: Slack, Issue

### 자주 발생하는 문제
- Permission Denied
- 환경 변수 undefined
- 무한 렌더링
- 데이터 안 나옴
- 빌드 실패

---

## ✅ 완료 체크리스트

- [ ] Console 에러 확인
- [ ] Firebase Rules 검증
- [ ] 환경 변수 확인
- [ ] 디버깅 도구 활용

---

## 📝 다음 단계

**75-MAINTENANCE-GUIDE.md**로 이동합니다.
