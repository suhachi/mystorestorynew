# 66 - Deployment Guide (Firebase)

## 📌 목표
Firebase Hosting으로 배포합니다. (이미 T14-Deployment-Guide.md 존재)

**결과물**:
- Firebase Hosting 배포
- Functions 배포
- Firestore Rules 배포
- 환경 설정

**총 개념 정리**

---

## 🔄 STEP 1: Firebase 프로젝트 설정

### 프롬프트 템플릿

```
Firebase Hosting과 Functions로 배포합니다.

## 1. Firebase 프로젝트 생성

Firebase Console (https://console.firebase.google.com):
1. "프로젝트 추가" 클릭
2. 프로젝트 이름: `mystorestory-prod`
3. Google Analytics 활성화 (선택)
4. 프로젝트 생성 완료

## 2. Firebase CLI 설치

```bash
# Firebase CLI 설치
npm install -g firebase-tools

# 버전 확인
firebase --version  # 13.x.x 이상

# 로그인
firebase login

# 프로젝트 초기화
firebase init
```

초기화 시 선택사항:
- ✅ Hosting
- ✅ Firestore
- ✅ Functions
- ✅ Storage (선택)

## 3. firebase.json 설정

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
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
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "functions": [
    {
      "source": "functions",
      "codebase": "default",
      "ignore": [
        "node_modules",
        ".git",
        "firebase-debug.log",
        "firebase-debug.*.log"
      ],
      "predeploy": [
        "npm --prefix \"$RESOURCE_DIR\" run build"
      ]
    }
  ]
}
```

## 4. 환경 변수 설정

### .env.production

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=mystorestory-prod.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mystorestory-prod
VITE_FIREBASE_STORAGE_BUCKET=mystorestory-prod.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

Firebase Console에서 가져오기:
1. 프로젝트 설정 > 일반
2. "내 앱" > "웹 앱" 추가
3. Firebase SDK snippet 복사

## 5. 빌드

```bash
# 의존성 설치
npm install

# 프로덕션 빌드
npm run build

# 빌드 결과 확인
ls dist/
```

## 6. Firestore Rules 배포

firestore.rules 확인:

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
    
    // 사용자
    match /users/{userId} {
      allow read, write: if isOwner(userId);
    }
    
    // 상점
    match /stores/{storeId} {
      allow read: if true;
      allow write: if isSignedIn() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'owner';
    }
    
    // 주문
    match /orders/{orderId} {
      allow create: if isSignedIn();
      allow read: if isOwner(resource.data.customerId) || 
        isOwner(resource.data.storeOwnerId);
      allow update: if isOwner(resource.data.storeOwnerId);
    }
  }
}
```

배포:

```bash
firebase deploy --only firestore:rules
```

## 7. Functions 배포

```bash
# Functions 디렉토리로 이동
cd functions

# 의존성 설치
npm install

# 빌드
npm run build

# 배포
cd ..
firebase deploy --only functions

# 특정 함수만 배포
firebase deploy --only functions:setOrderStatus
```

## 8. Hosting 배포

```bash
# 전체 배포
firebase deploy

# Hosting만 배포
firebase deploy --only hosting

# 배포 URL 확인
# https://mystorestory-prod.web.app
```

## 9. 커스텀 도메인 설정

Firebase Console:
1. Hosting > 도메인 추가
2. 도메인 입력: `mystorestory.com`
3. DNS 레코드 추가:
   - Type: A
   - Name: @
   - Value: 151.101.1.195, 151.101.65.195
4. 확인 대기 (최대 24시간)

## 10. 배포 스크립트

scripts/deploy.sh:

```bash
#!/bin/bash

echo "🚀 MyStoreStory 배포 시작..."

# 환경 선택
echo "배포 환경을 선택하세요:"
echo "1) Production"
echo "2) Staging"
read -p "선택 (1 or 2): " env

if [ "$env" = "1" ]; then
  PROJECT="mystorestory-prod"
  echo "✅ Production 환경 선택"
elif [ "$env" = "2" ]; then
  PROJECT="mystorestory-staging"
  echo "✅ Staging 환경 선택"
else
  echo "❌ 잘못된 선택"
  exit 1
fi

# Firebase 프로젝트 선택
firebase use $PROJECT

# 빌드
echo "📦 빌드 중..."
npm run build

# Firestore Rules
echo "📋 Firestore Rules 배포..."
firebase deploy --only firestore:rules

# Functions
echo "⚡ Functions 배포..."
cd functions
npm install
npm run build
cd ..
firebase deploy --only functions

# Hosting
echo "🌐 Hosting 배포..."
firebase deploy --only hosting

echo "✅ 배포 완료!"
echo "🔗 URL: https://$PROJECT.web.app"
```

실행:

```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

## 11. 배포 후 확인

### 체크리스트

```markdown
- [ ] 홈페이지 로드 확인
- [ ] 로그인 동작 확인
- [ ] App Builder 동작 확인
- [ ] 주문 생성 테스트
- [ ] Functions 로그 확인
- [ ] Firestore 데이터 확인
- [ ] 성능 측정 (Lighthouse)
```

### Lighthouse 점수 목표

- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

## 12. 롤백

문제 발생 시:

```bash
# 이전 버전으로 롤백
firebase hosting:clone mystorestory-prod:previous mystorestory-prod:live

# 특정 버전으로
firebase hosting:clone mystorestory-prod:abc123 mystorestory-prod:live
```

## 13. CI/CD (다음 프롬프트에서 상세)

GitHub Actions로 자동 배포:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Firebase

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: mystorestory-prod
```

IMPORTANT:
- Firebase Hosting (dist 폴더)
- Functions 배포
- Firestore Rules
- 환경 변수 (.env.production)
- 커스텀 도메인
- 배포 스크립트
- 롤백 준비
```

---

## 📝 핵심 포인트

### 배포 순서
1. **빌드**: `npm run build`
2. **Rules**: `firebase deploy --only firestore:rules`
3. **Functions**: `firebase deploy --only functions`
4. **Hosting**: `firebase deploy --only hosting`

### 중요 파일
- `firebase.json`: Firebase 설정
- `firestore.rules`: 보안 규칙
- `.env.production`: 환경 변수
- `scripts/deploy.sh`: 배포 스크립트

---

## ✅ 완료 체크리스트

- [ ] Firebase 프로젝트 생성
- [ ] firebase.json 설정
- [ ] 환경 변수 설정
- [ ] Firestore Rules 배포
- [ ] Functions 배포
- [ ] Hosting 배포
- [ ] 커스텀 도메인

---

## 📝 다음 단계

**67-CI-CD-PIPELINE.md**로 이동합니다.
