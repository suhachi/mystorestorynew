# 68 - Environment Setup & Configuration

## 📌 목표
개발/스테이징/프로덕션 환경을 설정합니다.

**결과물**:
- 환경별 설정 파일
- 환경 변수 관리
- 개발 도구 설정

**총 환경 구성**

---

## 🔄 STEP 1: 환경 분리

### 프롬프트 템플릿

```
개발, 스테이징, 프로덕션 환경을 설정합니다.

## 1. 환경 개요

### 3가지 환경
- **Development**: 로컬 개발 환경
- **Staging**: 테스트 환경
- **Production**: 실서비스 환경

## 2. 환경 변수 파일

### .env.development

```bash
# Firebase Development
VITE_FIREBASE_API_KEY=dev_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=mystorestory-dev.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mystorestory-dev
VITE_FIREBASE_STORAGE_BUCKET=mystorestory-dev.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:dev123

# API URLs
VITE_API_BASE_URL=http://localhost:5001/mystorestory-dev/asia-northeast3

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_SENTRY=false
VITE_ENABLE_DEBUG_MODE=true

# External APIs (Mock)
VITE_PAYMENT_API_KEY=mock_payment_key
VITE_MAPS_API_KEY=mock_maps_key
```

### .env.staging

```bash
# Firebase Staging
VITE_FIREBASE_API_KEY=staging_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=mystorestory-staging.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mystorestory-staging
VITE_FIREBASE_STORAGE_BUCKET=mystorestory-staging.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=234567890
VITE_FIREBASE_APP_ID=1:234567890:web:staging123

# API URLs
VITE_API_BASE_URL=https://asia-northeast3-mystorestory-staging.cloudfunctions.net

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_SENTRY=true
VITE_ENABLE_DEBUG_MODE=true

# External APIs (Test)
VITE_PAYMENT_API_KEY=test_payment_key
VITE_MAPS_API_KEY=test_maps_key
```

### .env.production

```bash
# Firebase Production
VITE_FIREBASE_API_KEY=prod_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=mystorestory-prod.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mystorestory-prod
VITE_FIREBASE_STORAGE_BUCKET=mystorestory-prod.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=345678901
VITE_FIREBASE_APP_ID=1:345678901:web:prod123

# API URLs
VITE_API_BASE_URL=https://asia-northeast3-mystorestory-prod.cloudfunctions.net

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_SENTRY=true
VITE_ENABLE_DEBUG_MODE=false

# External APIs (Live)
VITE_PAYMENT_API_KEY=live_payment_key
VITE_MAPS_API_KEY=live_maps_key

# Google Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 3. 환경별 빌드 스크립트

package.json 수정:

```json
{
  "scripts": {
    "dev": "vite --mode development",
    "dev:staging": "vite --mode staging",
    "dev:prod": "vite --mode production",
    
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "build:staging": "vite build --mode staging",
    "build:prod": "vite build --mode production",
    
    "preview": "vite preview",
    "preview:staging": "vite preview --mode staging",
    "preview:prod": "vite preview --mode production"
  }
}
```

## 4. Firebase 환경 설정

### .firebaserc

```json
{
  "projects": {
    "default": "mystorestory-dev",
    "development": "mystorestory-dev",
    "staging": "mystorestory-staging",
    "production": "mystorestory-prod"
  },
  "targets": {
    "mystorestory-dev": {
      "hosting": {
        "app": ["mystorestory-dev"]
      }
    },
    "mystorestory-staging": {
      "hosting": {
        "app": ["mystorestory-staging"]
      }
    },
    "mystorestory-prod": {
      "hosting": {
        "app": ["mystorestory-prod"]
      }
    }
  }
}
```

### 환경 전환

```bash
# 개발 환경
firebase use development

# 스테이징 환경
firebase use staging

# 프로덕션 환경
firebase use production

# 현재 환경 확인
firebase use
```

## 5. TypeScript 환경 변수 타입

/src/env.d.ts 생성:

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Firebase
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
  
  // API
  readonly VITE_API_BASE_URL: string
  
  // Feature Flags
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_SENTRY: string
  readonly VITE_ENABLE_DEBUG_MODE: string
  
  // External APIs
  readonly VITE_PAYMENT_API_KEY?: string
  readonly VITE_MAPS_API_KEY?: string
  readonly VITE_GA_MEASUREMENT_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

## 6. 환경 변수 사용

/src/config/env.ts 생성:

```typescript
export const env = {
  // Firebase
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  },
  
  // API
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  
  // Feature Flags
  features: {
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    sentry: import.meta.env.VITE_ENABLE_SENTRY === 'true',
    debugMode: import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true'
  },
  
  // External APIs
  paymentApiKey: import.meta.env.VITE_PAYMENT_API_KEY,
  mapsApiKey: import.meta.env.VITE_MAPS_API_KEY,
  gaId: import.meta.env.VITE_GA_MEASUREMENT_ID,
  
  // Environment
  isDevelopment: import.meta.env.MODE === 'development',
  isStaging: import.meta.env.MODE === 'staging',
  isProduction: import.meta.env.MODE === 'production'
};

// 환경 검증
if (!env.firebase.apiKey) {
  throw new Error('VITE_FIREBASE_API_KEY is required');
}

if (!env.firebase.projectId) {
  throw new Error('VITE_FIREBASE_PROJECT_ID is required');
}
```

사용 예시:

```typescript
import { env } from './config/env';

// Firebase 초기화
const firebaseConfig = env.firebase;

// Feature Flag
if (env.features.analytics) {
  // Analytics 초기화
}

// 환경별 로직
if (env.isDevelopment) {
  console.log('개발 환경');
} else if (env.isStaging) {
  console.log('스테이징 환경');
} else if (env.isProduction) {
  console.log('프로덕션 환경');
}
```

## 7. 개발 도구 설정

### VS Code 설정

/.vscode/settings.json:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

### VS Code 확장 프로그램

/.vscode/extensions.json:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "firebase.vscode-firebase-explorer",
    "ms-vscode.vscode-typescript-next",
    "github.copilot",
    "usernamehw.errorlens"
  ]
}
```

## 8. ESLint 설정

/.eslintrc.json:

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "react-hooks"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

## 9. Prettier 설정

/.prettierrc:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always"
}
```

## 10. Git Hooks (Husky)

설치:

```bash
npm install --save-dev husky lint-staged

# Husky 초기화
npx husky install
npm pkg set scripts.prepare="husky install"

# Pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"
```

package.json:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

## 11. 환경별 Feature Flags

/src/config/features.ts:

```typescript
import { env } from './env';

export const features = {
  // 분석
  analytics: env.features.analytics && {
    google: env.gaId !== undefined,
    mixpanel: false
  },
  
  // 에러 추적
  errorTracking: env.features.sentry && {
    sentry: true
  },
  
  // 결제
  payment: {
    toss: env.isProduction,
    kakaopay: env.isProduction,
    mock: env.isDevelopment
  },
  
  // 지도
  maps: {
    kakao: env.mapsApiKey !== undefined,
    google: false
  },
  
  // 디버그
  debug: {
    console: env.isDevelopment || env.features.debugMode,
    devtools: env.isDevelopment
  }
};
```

## 12. 환경 검증 스크립트

/scripts/validate-env.js:

```javascript
const fs = require('fs');
const path = require('path');

const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID'
];

function validateEnv(envFile) {
  const envPath = path.join(__dirname, '..', envFile);
  
  if (!fs.existsSync(envPath)) {
    console.error(`❌ ${envFile} not found`);
    return false;
  }
  
  const content = fs.readFileSync(envPath, 'utf8');
  const missing = [];
  
  requiredEnvVars.forEach(varName => {
    if (!content.includes(varName)) {
      missing.push(varName);
    }
  });
  
  if (missing.length > 0) {
    console.error(`❌ Missing variables in ${envFile}:`);
    missing.forEach(v => console.error(`   - ${v}`));
    return false;
  }
  
  console.log(`✅ ${envFile} validated`);
  return true;
}

// 모든 환경 파일 검증
const envFiles = ['.env.development', '.env.staging', '.env.production'];
const allValid = envFiles.every(validateEnv);

if (!allValid) {
  process.exit(1);
}
```

실행:

```bash
node scripts/validate-env.js
```

IMPORTANT:
- 3가지 환경 (Dev, Staging, Prod)
- 환경별 .env 파일
- Firebase 프로젝트 분리
- TypeScript 타입 정의
- Feature Flags
- 개발 도구 설정
- Git Hooks (Husky)
```

---

## 📝 핵심 포인트

### 환경 구분
- **Development**: 로컬, Mock 데이터
- **Staging**: 테스트, 실제 API
- **Production**: 실서비스

### 환경 변수 관리
- `.env.*` 파일로 분리
- TypeScript 타입 정의
- 환경 검증 스크립트

---

## ✅ 완료 체크리스트

- [ ] .env 파일 생성
- [ ] Firebase 프로젝트 분리
- [ ] TypeScript 타입 정의
- [ ] Feature Flags
- [ ] 개발 도구 설정
- [ ] Git Hooks

---

## 📝 다음 단계

**69-DATABASE-MIGRATION.md**로 이동합니다.
