# 90 - Security Audit

## 📌 목표
보안 감사 및 취약점 스캔을 수행합니다.

**결과물**: 보안 체크리스트, 취약점 리포트, 개선 계획

---

## 프롬프트

```
MyStoreStory의 보안을 감사하고 취약점을 수정합니다.

## 🔒 Security Audit

### 1. 자동화 스캔

```bash
# npm audit
npm audit
npm audit fix

# Snyk
npx snyk test
npx snyk monitor
```

### 2. 보안 체크리스트

#### 인증/인가
- [ ] 비밀번호 강도 (8자 이상, 영문+숫자)
- [ ] JWT 토큰 검증
- [ ] Session 관리
- [ ] CSRF 보호
- [ ] Rate Limiting

#### 데이터 보호
- [ ] HTTPS 강제
- [ ] 민감 데이터 암호화
- [ ] Firestore Security Rules
- [ ] 환경 변수 보호
- [ ] API 키 보안

#### 입력 검증
- [ ] XSS 방지
- [ ] SQL Injection 방지
- [ ] 입력 sanitize
- [ ] 파일 업로드 검증

#### 의존성
- [ ] npm audit (취약점 0개)
- [ ] 정기 업데이트
- [ ] 신뢰할 수 있는 패키지만

### 3. Firebase Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    match /orders/{orderId} {
      allow read: if isSignedIn() && 
        (isOwner(resource.data.customerId) || 
         isOwner(resource.data.ownerId));
      allow create: if isSignedIn();
      allow update: if isOwner(resource.data.ownerId);
    }
  }
}
```

### 4. 보안 헤더

```typescript
// Firebase Hosting (firebase.json)
{
  "hosting": {
    "headers": [{
      "source": "**",
      "headers": [{
        "key": "X-Content-Type-Options",
        "value": "nosniff"
      }, {
        "key": "X-Frame-Options",
        "value": "DENY"
      }, {
        "key": "X-XSS-Protection",
        "value": "1; mode=block"
      }]
    }]
  }
}
```

### 5. 취약점 우선순위

**Critical**: 즉시 수정
**High**: 24시간 내
**Medium**: 1주일 내
**Low**: 다음 릴리즈

IMPORTANT: npm audit 0개, HTTPS 강제, Security Rules 검증, 정기 감사
```

---

## 📝 다음: **91-CODE-QUALITY.md**
