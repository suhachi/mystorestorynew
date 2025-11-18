# Firebase 배포 가이드

**프로젝트**: MyStoreStory
**Firebase 프로젝트 ID**: mystorestory
**프로젝트 번호**: 102904078280

---

## 📌 목표
Firebase에 프로덕션 배포를 진행합니다.

**결과물**:
- Firebase Hosting 배포
- Cloud Functions 배포
- Firestore Rules & Indexes
- 환경 설정

---

## 🔄 STEP 1: Firebase 프로젝트 설정

### Firebase Console 설정

Firebase Console (https://console.firebase.google.com):

1. **프로젝트 확인**
   - 프로젝트 이름: `mystorestory`
   - 프로젝트 ID: `mystorestory`
   - 프로젝트 번호: `102904078280`

2. **Authentication 설정**
   - Email/Password 활성화
   - Google 로그인 활성화 (선택)

3. **Firestore Database 확인**
   - 위치: asia-northeast3 (서울)
   - 모드: 프로덕션 모드

4. **Storage 설정**
   - 기본 위치: asia-northeast3

5. **Hosting 활성화**
   - 기본 설정으로 진행

---

## 🔄 STEP 2: Firebase CLI 설치 및 로그인

### Firebase CLI 설치

```bash
# Firebase CLI 글로벌 설치
npm install -g firebase-tools

# 또는 pnpm 사용
pnpm add -g firebase-tools
```

### Firebase 로그인

```bash
# Firebase 로그인
firebase login

# 프로젝트 확인
firebase projects:list
```

### 프로젝트 연결

```bash
# 프로젝트 디렉토리로 이동
cd MY_STORE_STORYdesign

# Firebase 프로젝트 초기화 (이미 되어 있으면 생략)
firebase init

# 프로젝트 선택
firebase use mystorestory
```

---

## 🔄 STEP 3: 환경 변수 설정

### Firebase Functions 환경 변수

```bash
# 환경 변수 설정
firebase functions:config:set \
  app.api_key="your-api-key" \
  app.env="production"
```

### 로컬 환경 변수 (.env)

```env
# .env.local (로컬 개발용)
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=mystorestory.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mystorestory
VITE_FIREBASE_STORAGE_BUCKET=mystorestory.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=102904078280
VITE_FIREBASE_APP_ID=your-app-id
```

---

## 🔄 STEP 4: 빌드 및 배포

### 1. 프로젝트 빌드

```bash
# 의존성 설치
pnpm install

# 프로젝트 빌드
pnpm build
```

### 2. Firestore Rules & Indexes 배포

```bash
# Firestore Rules 배포
firebase deploy --only firestore:rules

# Firestore Indexes 배포
firebase deploy --only firestore:indexes
```

### 3. Cloud Functions 배포

```bash
# Functions 빌드
cd functions
pnpm install
pnpm build
cd ..

# Functions 배포
firebase deploy --only functions
```

### 4. Hosting 배포

```bash
# Hosting 배포
firebase deploy --only hosting
```

### 5. 전체 배포

```bash
# 모든 서비스 한 번에 배포
firebase deploy
```

---

## 🔄 STEP 5: 배포 확인

### Hosting 확인

```bash
# 배포된 사이트 확인
firebase hosting:channel:list

# 사이트 URL
https://mystorestory.web.app
https://mystorestory.firebaseapp.com
```

### Functions 확인

```bash
# Functions 목록 확인
firebase functions:list
```

### Firestore 확인

- Firebase Console에서 Firestore 데이터 확인
- Rules가 정상 적용되었는지 확인
- Indexes가 생성되었는지 확인

---

## 📋 배포 체크리스트

### 배포 전 확인

- [ ] Firebase 프로젝트 설정 완료
- [ ] Firebase CLI 설치 및 로그인 완료
- [ ] 환경 변수 설정 완료
- [ ] 프로젝트 빌드 성공
- [ ] Firestore Rules 검증 완료
- [ ] Firestore Indexes 생성 완료

### 배포 중 확인

- [ ] Firestore Rules 배포 성공
- [ ] Firestore Indexes 배포 성공
- [ ] Cloud Functions 배포 성공
- [ ] Hosting 배포 성공

### 배포 후 확인

- [ ] 사이트 접속 확인
- [ ] Authentication 작동 확인
- [ ] Firestore 데이터 접근 확인
- [ ] Storage 접근 확인
- [ ] Functions 호출 확인

---

## 🚨 문제 해결

### 일반적인 문제

1. **빌드 실패**
   ```bash
   # 의존성 재설치
   rm -rf node_modules
   pnpm install
   pnpm build
   ```

2. **Functions 배포 실패**
   ```bash
   # Functions 디렉토리 확인
   cd functions
   pnpm install
   pnpm build
   ```

3. **Hosting 배포 실패**
   ```bash
   # 빌드 출력 디렉토리 확인
   # firebase.json의 "public": "dist" 확인
   ```

---

## 📚 참고 자료

- Firebase 공식 문서: https://firebase.google.com/docs
- Firebase CLI 문서: https://firebase.google.com/docs/cli
- 프로젝트 README: `README-FIREBASE.md`

---

**작성일**: 2024년 1월 25일
**상태**: ✅ 배포 가이드 완료

