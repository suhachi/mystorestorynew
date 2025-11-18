# 65 - Security Best Practices

## 📌 목표
보안 모범 사례를 적용합니다.

**결과물**:
- Firebase Security Rules
- XSS 방지
- CSRF 방지
- 환경 변수 관리
- 입력 검증

**총 개념 정리**

---

## 🔄 STEP 1: Firebase Security Rules

### 프롬프트 템플릿

```
웹 애플리케이션 보안 모범 사례를 적용합니다.

## 1. Firestore Security Rules

firestore.rules 설정:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // 헬퍼 함수
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    function hasRole(role) {
      return isSignedIn() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == role;
    }
    
    // 사용자 문서
    match /users/{userId} {
      // 자기 자신만 읽기/쓰기
      allow read, write: if isOwner(userId);
      
      // 관리자는 모든 사용자 읽기
      allow read: if hasRole('admin');
    }
    
    // 상점 문서
    match /stores/{storeId} {
      // 상점 주인만 쓰기
      allow write: if isOwner(resource.data.ownerId);
      
      // 모두 읽기 가능
      allow read: if true;
    }
    
    // 주문 문서
    match /orders/{orderId} {
      // 주문 생성 (인증된 사용자)
      allow create: if isSignedIn();
      
      // 자기 주문 읽기
      allow read: if isOwner(resource.data.customerId);
      
      // 상점 주인이 자기 상점 주문 읽기/수정
      allow read, update: if isSignedIn() && 
        get(/databases/$(database)/documents/stores/$(resource.data.storeId)).data.ownerId == request.auth.uid;
      
      // 관리자는 모든 주문 읽기
      allow read: if hasRole('admin');
    }
    
    // 메뉴 문서
    match /menus/{menuId} {
      // 상점 주인만 쓰기
      allow write: if isSignedIn() &&
        get(/databases/$(database)/documents/stores/$(resource.data.storeId)).data.ownerId == request.auth.uid;
      
      // 모두 읽기
      allow read: if true;
    }
    
    // 리뷰 문서
    match /reviews/{reviewId} {
      // 인증된 사용자만 생성
      allow create: if isSignedIn() && 
        request.resource.data.userId == request.auth.uid;
      
      // 자기 리뷰만 수정/삭제
      allow update, delete: if isOwner(resource.data.userId);
      
      // 모두 읽기
      allow read: if true;
    }
    
    // 데이터 검증
    match /orders/{orderId} {
      allow create: if isSignedIn() &&
        request.resource.data.keys().hasAll(['customerId', 'storeId', 'items', 'total']) &&
        request.resource.data.customerId == request.auth.uid &&
        request.resource.data.total > 0 &&
        request.resource.data.items.size() > 0;
    }
  }
}
```

## 2. XSS (Cross-Site Scripting) 방지

### React는 기본적으로 XSS 방지

```typescript
// ✅ 안전 - React가 자동으로 이스케이프
const userInput = '<script>alert("XSS")</script>';
<div>{userInput}</div>  // 스크립트 실행 안 됨

// ❌ 위험 - dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ HTML sanitize 라이브러리 사용
import DOMPurify from 'dompurify';

const sanitizedHTML = DOMPurify.sanitize(userInput);
<div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
```

### 입력 검증

```typescript
import { z } from 'zod';

// 스키마 정의
const orderSchema = z.object({
  customerName: z.string().min(2).max(50),
  customerPhone: z.string().regex(/^010-\d{4}-\d{4}$/),
  customerEmail: z.string().email().optional(),
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    quantity: z.number().positive(),
    price: z.number().positive()
  })).min(1)
});

// 검증
try {
  const validatedData = orderSchema.parse(formData);
  await createOrder(validatedData);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('Validation failed:', error.errors);
    toast.error('입력값을 확인해주세요');
  }
}
```

## 3. CSRF (Cross-Site Request Forgery) 방지

### Firebase는 기본적으로 CSRF 방지

```typescript
// Firebase SDK는 자동으로 CSRF 토큰 처리
import { doc, setDoc } from 'firebase/firestore';

// 안전 - Firebase가 자동으로 인증 토큰 포함
await setDoc(doc(db, 'orders', orderId), orderData);
```

### Custom API는 CSRF 토큰 사용

```typescript
// Express.js (백엔드)
import csrf from 'csurf';
const csrfProtection = csrf({ cookie: true });

app.post('/api/orders', csrfProtection, (req, res) => {
  // CSRF 토큰 검증됨
});

// React (프론트엔드)
const csrfToken = document.cookie
  .split('; ')
  .find(row => row.startsWith('_csrf='))
  ?.split('=')[1];

fetch('/api/orders', {
  method: 'POST',
  headers: {
    'CSRF-Token': csrfToken
  },
  body: JSON.stringify(orderData)
});
```

## 4. 환경 변수 관리

### .env 파일

```bash
# .env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id

# ❌ 절대 커밋하지 말 것
# API Keys, Secret Keys, Passwords
```

### .gitignore

```
.env
.env.local
.env.production
.env.development
```

### 환경 변수 사용

```typescript
// Vite
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID
};

// Create React App
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN
};
```

## 5. 인증 보안

### 비밀번호 강도

```typescript
function validatePassword(password: string): boolean {
  // 최소 8자, 대문자, 소문자, 숫자, 특수문자 포함
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
}

// 사용
if (!validatePassword(password)) {
  toast.error('비밀번호는 최소 8자, 대소문자, 숫자, 특수문자를 포함해야 합니다');
  return;
}
```

### JWT 토큰 저장

```typescript
// ❌ 나쁜 예 - localStorage (XSS 취약)
localStorage.setItem('token', jwtToken);

// ✅ 좋은 예 - httpOnly Cookie (서버에서 설정)
// 서버: Set-Cookie: token=xxx; HttpOnly; Secure; SameSite=Strict

// Firebase는 자동으로 안전하게 토큰 관리
```

## 6. API 보안

### Rate Limiting

```typescript
// Cloud Functions
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100, // 최대 100 요청
  message: '너무 많은 요청입니다. 잠시 후 다시 시도하세요.'
});

app.use('/api/', limiter);
```

### API 키 검증

```typescript
// Cloud Functions
export const protectedFunction = functions.https.onCall(async (data, context) => {
  // 인증 확인
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', '로그인이 필요합니다');
  }

  // 역할 확인
  const userDoc = await admin.firestore()
    .collection('users')
    .doc(context.auth.uid)
    .get();

  if (userDoc.data()?.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', '권한이 없습니다');
  }

  // 처리
  return { success: true };
});
```

## 7. SQL Injection 방지

Firebase Firestore는 NoSQL이므로 SQL Injection 취약점 없음.

하지만 일반 SQL DB 사용 시:

```typescript
// ❌ 나쁜 예 - SQL Injection 취약
const query = `SELECT * FROM users WHERE email = '${email}'`;

// ✅ 좋은 예 - Prepared Statements
const query = 'SELECT * FROM users WHERE email = ?';
db.query(query, [email]);
```

## 8. Content Security Policy (CSP)

index.html에 CSP 메타 태그:

```html
<meta 
  http-equiv="Content-Security-Policy" 
  content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    connect-src 'self' https://*.googleapis.com https://*.firebaseio.com;
    font-src 'self' data:;
  "
/>
```

## 9. HTTPS 강제

Firebase Hosting은 자동으로 HTTPS 적용.

직접 서버 운영 시:

```javascript
// Express.js
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});
```

## 10. 민감한 데이터 제거

```typescript
// ❌ 나쁜 예 - 민감한 정보 노출
console.log('User data:', user);  // 비밀번호, 토큰 등 포함

// ✅ 좋은 예 - 필요한 정보만
console.log('User logged in:', { id: user.id, email: user.email });

// 프로덕션에서 console.log 제거
if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
  console.warn = () => {};
}
```

## 11. 보안 헤더

```javascript
// Express.js
import helmet from 'helmet';

app.use(helmet());

// 개별 헤더 설정
app.use(helmet.contentSecurityPolicy());
app.use(helmet.hsts());
app.use(helmet.noSniff());
app.use(helmet.xssFilter());
```

## 12. 보안 체크리스트

```markdown
### 인증/인가
- [ ] Firebase Auth 사용
- [ ] Security Rules 설정
- [ ] 역할 기반 접근 제어
- [ ] 비밀번호 강도 검증

### 데이터 보호
- [ ] HTTPS 사용
- [ ] 환경 변수로 API 키 관리
- [ ] .env 파일 .gitignore 추가
- [ ] 민감한 데이터 로깅 방지

### 입력 검증
- [ ] Zod 스키마 검증
- [ ] XSS 방지 (DOMPurify)
- [ ] SQL Injection 방지
- [ ] CSRF 토큰

### API 보안
- [ ] Rate Limiting
- [ ] API 인증
- [ ] CORS 설정
- [ ] 에러 메시지 최소화

### 헤더
- [ ] Content Security Policy
- [ ] X-Frame-Options
- [ ] X-Content-Type-Options
- [ ] HSTS

### 모니터링
- [ ] 에러 로깅
- [ ] 보안 이벤트 추적
- [ ] 정기 보안 업데이트
```

IMPORTANT:
- Firebase Security Rules
- XSS 방지 (DOMPurify)
- 입력 검증 (Zod)
- 환경 변수 관리
- HTTPS 강제
- Rate Limiting
- CSP 설정
- 비밀번호 강도
```

---

## 📝 핵심 포인트

### OWASP Top 10 (웹 보안 위협)
1. Injection (주입)
2. Broken Authentication (인증 취약점)
3. Sensitive Data Exposure (민감 데이터 노출)
4. XML External Entities (XXE)
5. Broken Access Control (접근 제어 취약점)
6. Security Misconfiguration (보안 설정 오류)
7. XSS (Cross-Site Scripting)
8. Insecure Deserialization (안전하지 않은 역직렬화)
9. Using Components with Known Vulnerabilities (알려진 취약점)
10. Insufficient Logging & Monitoring (불충분한 로깅)

### 보안 원칙
- **최소 권한**: 필요한 권한만 부여
- **심층 방어**: 여러 보안 계층
- **안전한 기본값**: 보수적인 기본 설정
- **검증**: 모든 입력 검증

---

## ✅ 완료 체크리스트

- [ ] Security Rules
- [ ] XSS 방지
- [ ] 입력 검증
- [ ] 환경 변수
- [ ] HTTPS
- [ ] CSP

---

## 🎉 10개 완료!

**56-65번 프롬프트 완성!**

현재 **70개 프롬프트 완성** (64%)

---

## 📝 다음 10개 (66-75번) 계획

- Deployment Guide
- CI/CD Pipeline
- Environment Setup
- Database Migration
- Backup & Recovery
- Monitoring & Logging
- Documentation Templates
- User Guides
- API Reference
- Troubleshooting Guide
