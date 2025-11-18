# 66 - Deployment to Firebase

## 📌 목표
Firebase에 프로덕션 배포를 진행합니다. (이미 T14-Deployment-Guide.md 존재)

**결과물**:
- Firebase Hosting 배포
- Cloud Functions 배포
- Firestore Rules & Indexes
- 환경 설정

**총 배포 가이드**

---

## 🔄 STEP 1: Firebase 프로젝트 설정

### 프롬프트 템플릿

```
Firebase에 MyStoreStory를 배포합니다.

## 1. Firebase 프로젝트 생성

Firebase Console (https://console.firebase.google.com):

1. **새 프로젝트 생성**
   - 프로젝트 이름: `mystorestory-prod`
   - Google Analytics: 활성화 (선택)

2. **Authentication 설정**
   - Email/Password 활성화
   - Google 로그인 활성화 (선택)

3. **Firestore Database 생성**
   - 위치: asia-northeast3 (서울)
   - 모드: 프로덕션 모드

4. **Storage 설정**
   - 기본 위치: asia-northeast3

5. **Hosting 활성화**
   - 기본 설정으로 진행

## 2. Firebase CLI 설치

```bash
# Firebase CLI 글로벌 설치
npm install -g firebase-tools

# 버전 확인 (v13.x.x 이상)
firebase --version

# Firebase 로그인
firebase login

# 브라우저에서 Google 계정 인증
```

## 3. Firebase 초기화 (이미 완료된 경우 스킵)

```bash
# 프로젝트 루트에서
firebase init

# 선택할 기능:
- Firestore
- Functions
- Hosting

# Firestore 설정:
- Rules file: firestore.rules
- Indexes file: firestore.indexes.json

# Functions 설정:
- Language: TypeScript
- ESLint: Yes
- Install dependencies: Yes

# Hosting 설정:
- Public directory: dist
- Single-page app: Yes
- GitHub Actions: No (나중에 설정)
```

## 4. 환경 변수 설정

### .env.production 생성

```bash
# .env.production
VITE_FIREBASE_API_KEY=your_production_api_key
VITE_FIREBASE_AUTH_DOMAIN=mystorestory-prod.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mystorestory-prod
VITE_FIREBASE_STORAGE_BUCKET=mystorestory-prod.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### .gitignore 확인

```
.env
.env.local
.env.production
.env.development
.firebase
.firebaserc
firebase-debug.log
```

## 5. 프로젝트 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 확인
ls dist/  # index.html, assets/ 등이 생성되어야 함

# 로컬에서 프로덕션 빌드 테스트
npm run preview
```

## 6. Firestore Rules 배포

firestore.rules 확인:

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
    
    // 사용자
    match /users/{userId} {
      allow read, write: if isOwner(userId);
      allow read: if hasRole('admin');
    }
    
    // 상점
    match /stores/{storeId} {
      allow write: if isOwner(resource.data.ownerId);
      allow read: if true;
    }
    
    // 주문
    match /orders/{orderId} {
      allow create: if isSignedIn();
      allow read: if isOwner(resource.data.customerId) || hasRole('admin');
      allow update: if isSignedIn() && 
        get(/databases/$(database)/documents/stores/$(resource.data.storeId)).data.ownerId == request.auth.uid;
    }
    
    // 메뉴
    match /menus/{menuId} {
      allow write: if isSignedIn() &&
        get(/databases/$(database)/documents/stores/$(resource.data.storeId)).data.ownerId == request.auth.uid;
      allow read: if true;
    }
  }
}
```

배포:

```bash
# Rules 배포
firebase deploy --only firestore:rules

# 배포 확인
firebase firestore:rules
```

## 7. Firestore Indexes 배포

firestore.indexes.json 확인:

```json
{
  "indexes": [
    {
      "collectionGroup": "orders",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "storeId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "orders",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "customerId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "orders",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ]
}
```

배포:

```bash
# Indexes 배포 (5-10분 소요)
firebase deploy --only firestore:indexes

# 인덱스 생성 상태 확인
firebase firestore:indexes

# 상태가 "READY"가 될 때까지 대기
```

## 8. Cloud Functions 배포

### Functions 빌드

```bash
cd functions

# 의존성 설치
npm install

# TypeScript 빌드
npm run build

# 빌드 확인
ls lib/  # index.js가 생성되어야 함
```

### Secrets 설정

```bash
# Slack Webhook URL 설정
firebase functions:secrets:set SLACK_WEBHOOK_URL
# 입력: https://hooks.slack.com/services/YOUR_WEBHOOK_URL

# Secrets 확인
firebase functions:secrets:access SLACK_WEBHOOK_URL
```

### Functions 배포

```bash
cd ..  # 프로젝트 루트로

# 모든 Functions 배포 (첫 배포는 5-10분 소요)
firebase deploy --only functions

# 특정 Function만 배포
firebase deploy --only functions:setOrderStatus
firebase deploy --only functions:historyNotify

# 배포 확인
firebase functions:list

# 로그 확인
firebase functions:log
```

## 9. Hosting 배포

```bash
# Hosting 배포
firebase deploy --only hosting

# 특정 타겟 배포 (다중 사이트)
firebase deploy --only hosting:mystorestory

# 배포 확인
firebase hosting:sites:list
```

## 10. 전체 배포

```bash
# 모든 것 한번에 배포
firebase deploy

# 배포 내역:
# - Firestore Rules
# - Firestore Indexes
# - Cloud Functions
# - Hosting

# 배포 시간: 약 10-15분
```

## 11. 배포 확인

### A. Hosting 확인

```bash
# 배포된 URL 확인
firebase hosting:sites:list

# 브라우저에서 접속
https://mystorestory-prod.web.app
https://mystorestory-prod.firebaseapp.com
```

### B. Functions 확인

```bash
# Functions 목록
firebase functions:list

# 특정 Function 로그
firebase functions:log --only setOrderStatus

# 실시간 로그 (tail)
firebase functions:log --only setOrderStatus --lines 50
```

### C. Firestore 확인

Firebase Console에서:
- Firestore Database → 데이터 확인
- Rules → 규칙 확인
- Indexes → 인덱스 상태 확인 (모두 READY)

## 12. 커스텀 도메인 설정

### Firebase Console에서:

1. **Hosting → Custom Domain**
2. **도메인 추가**: `mystorestory.com`
3. **DNS 설정**:
   ```
   Type: A
   Name: @
   Value: [Firebase IP]

   Type: A
   Name: www
   Value: [Firebase IP]
   ```
4. **SSL 인증서 자동 발급** (24-48시간)

### firebase.json 설정

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      },
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

## 13. 배포 스크립트

/scripts/deploy.sh 생성:

```bash
#!/bin/bash

echo "🚀 MyStoreStory 배포 시작..."

# 1. 프로젝트 선택
echo "📦 프로젝트 설정..."
firebase use production

# 2. 프론트엔드 빌드
echo "🔨 프론트엔드 빌드..."
npm run build

# 3. Functions 빌드
echo "⚡ Functions 빌드..."
cd functions
npm run build
cd ..

# 4. 배포
echo "🚀 배포 중..."
firebase deploy

echo "✅ 배포 완료!"
echo "🌐 URL: https://mystorestory-prod.web.app"
```

실행:

```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

IMPORTANT:
- Firebase CLI v13.x.x 이상
- Node.js v18.x.x 이상
- .env.production 설정
- Firestore Rules & Indexes
- Cloud Functions Secrets
- 커스텀 도메인 (선택)
```

---

## 📝 핵심 포인트

### 배포 순서
1. **Firebase 프로젝트 생성**
2. **환경 변수 설정**
3. **프로젝트 빌드**
4. **Firestore Rules & Indexes**
5. **Cloud Functions**
6. **Hosting**
7. **도메인 연결**

### 배포 시간
- **Hosting**: 1-2분
- **Functions**: 5-10분 (첫 배포)
- **Indexes**: 5-10분
- **전체**: 약 15-20분

---

## ✅ 완료 체크리스트

- [ ] Firebase 프로젝트 생성
- [ ] CLI 설치 & 로그인
- [ ] 환경 변수 설정
- [ ] 프로젝트 빌드
- [ ] Firestore Rules 배포
- [ ] Firestore Indexes 배포
- [ ] Cloud Functions 배포
- [ ] Hosting 배포
- [ ] 커스텀 도메인 설정

---

## 📝 다음 단계

**67-CI-CD-PIPELINE.md**로 이동합니다.
