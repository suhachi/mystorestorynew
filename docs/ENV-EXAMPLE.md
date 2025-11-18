# 환경 변수 설정 가이드

## Firebase 환경 변수 설정

`.env.local` 파일을 프로젝트 루트에 생성하고 다음 내용을 추가하세요:

```env
# Firebase API Key
VITE_FIREBASE_API_KEY=your-api-key-here

# Firebase Auth Domain
VITE_FIREBASE_AUTH_DOMAIN=mystorestory.firebaseapp.com

# Firebase Project ID
VITE_FIREBASE_PROJECT_ID=mystorestory

# Firebase Storage Bucket
VITE_FIREBASE_STORAGE_BUCKET=mystorestory.appspot.com

# Firebase Messaging Sender ID
VITE_FIREBASE_MESSAGING_SENDER_ID=102904078280

# Firebase App ID
VITE_FIREBASE_APP_ID=your-app-id-here

# Google Analytics Measurement ID (선택)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Firebase Console에서 값 확인하기

1. Firebase Console 접속: https://console.firebase.google.com
2. 프로젝트 선택: `mystorestory`
3. 프로젝트 설정 > 일반 탭에서 웹 앱 설정 확인
4. Firebase SDK 설정에서 각 값 확인

## 주의사항

- `.env.local` 파일은 Git에 커밋하지 마세요 (이미 .gitignore에 포함됨)
- 실제 API 키는 절대 공개 저장소에 올리지 마세요
- 프로덕션 환경에서는 Firebase Console에서 환경 변수를 설정하세요

