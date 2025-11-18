# 33 - 배포 준비 & 최종 체크리스트

## 📌 목표
프로덕션 배포를 위한 최종 점검 및 문서화를 완료합니다.

**결과물**:
- 배포 체크리스트
- 스모크 테스트 가이드
- 프로덕션 최적화
- 최종 문서

---

## 🔄 STEP 1: Firebase 배포 스크립트

### 프롬프트 템플릿

```
Firebase 배포를 위한 스크립트를 만듭니다.

## 요구사항

1. /scripts/deploy.sh 생성:

```bash
#!/bin/bash

echo "🚀 MyStoreStory 배포 시작..."
echo ""

# 1. 환경 변수 확인
if [ -z "$FIREBASE_PROJECT" ]; then
  echo "⚠️  FIREBASE_PROJECT 환경 변수가 설정되지 않았습니다."
  echo "   export FIREBASE_PROJECT=your-project-id"
  exit 1
fi

echo "✅ 프로젝트: $FIREBASE_PROJECT"
echo ""

# 2. Firestore Rules 검증
echo "📋 Firestore Rules 검증 중..."
firebase deploy --only firestore:rules --project $FIREBASE_PROJECT --dry-run
if [ $? -ne 0 ]; then
  echo "❌ Firestore Rules 검증 실패"
  exit 1
fi
echo "✅ Firestore Rules 검증 완료"
echo ""

# 3. Firestore Indexes 검증
echo "📋 Firestore Indexes 검증 중..."
firebase deploy --only firestore:indexes --project $FIREBASE_PROJECT --dry-run
if [ $? -ne 0 ]; then
  echo "❌ Firestore Indexes 검증 실패"
  exit 1
fi
echo "✅ Firestore Indexes 검증 완료"
echo ""

# 4. Cloud Functions 빌드
echo "🔨 Cloud Functions 빌드 중..."
cd functions
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Functions 빌드 실패"
  exit 1
fi
cd ..
echo "✅ Functions 빌드 완료"
echo ""

# 5. 배포 확인
echo "🤔 정말 배포하시겠습니까? (y/n)"
read -r response
if [[ ! "$response" =~ ^[Yy]$ ]]; then
  echo "❌ 배포 취소됨"
  exit 1
fi

# 6. 실제 배포
echo "🚀 배포 시작..."
echo ""

echo "📦 Firestore Rules 배포..."
firebase deploy --only firestore:rules --project $FIREBASE_PROJECT

echo "📦 Firestore Indexes 배포..."
firebase deploy --only firestore:indexes --project $FIREBASE_PROJECT

echo "📦 Cloud Functions 배포..."
firebase deploy --only functions --project $FIREBASE_PROJECT

echo ""
echo "✅ 배포 완료!"
echo ""
echo "📝 다음 단계:"
echo "   1. Firebase Console에서 배포 확인"
echo "   2. 스모크 테스트 실행"
echo "   3. 모니터링 설정 확인"
```

2. /scripts/local-test.sh 생성:

```bash
#!/bin/bash

echo "🧪 로컬 테스트 환경 시작..."
echo ""

# Firebase Emulators 시작
echo "🔥 Firebase Emulators 시작 중..."
firebase emulators:start --only firestore,functions,auth

# Emulator UI: http://localhost:4000
# Firestore: http://localhost:8080
# Functions: http://localhost:5001
# Auth: http://localhost:9099
```

IMPORTANT:
- 배포 전 검증 단계 포함
- 확인 프롬프트로 실수 방지
- 단계별 로깅
```

### 예상 결과

```
/scripts/deploy.sh
/scripts/local-test.sh
```

### 검증 체크리스트

- [ ] deploy.sh 생성
- [ ] local-test.sh 생성
- [ ] 실행 권한 설정 (`chmod +x scripts/*.sh`)

---

## 🔄 STEP 2: 배포 체크리스트 문서

### 프롬프트 템플릿

```
배포 전 확인해야 할 체크리스트 문서를 만듭니다.

## 요구사항

/docs/T14-GO-CHECKLIST.md 생성:

```markdown
# MyStoreStory 배포 체크리스트

## 🎯 배포 전 필수 체크

### 1. 코드 품질
- [ ] 모든 TypeScript 타입 오류 해결
- [ ] Console.log/console.error 적절히 사용 (민감정보 제외)
- [ ] 주석 정리 (TODO, FIXME 등)
- [ ] 사용하지 않는 코드 제거
- [ ] 임포트 정리 (unused imports 제거)

### 2. 보안
- [ ] PII(개인 식별 정보) 노출 확인
  - customerMasked만 사용
  - 실명, 이메일, 전화번호 직접 노출 금지
- [ ] API Keys 환경 변수 처리
  - Firebase Config는 public OK
  - FCM Server Key, Slack Webhook 등은 Secrets 사용
- [ ] Firestore Rules 검증
  - 읽기/쓰기 권한 적절히 설정
  - 테스트 모드(allow read, write: if true) 제거
- [ ] CORS 설정 확인

### 3. Firebase 설정
- [ ] Firestore Rules 최신화
- [ ] Firestore Indexes 생성
- [ ] Cloud Functions Secrets 설정
  - FCM_SERVER_KEY
  - SLACK_WEBHOOK_URL
  - MAILGUN_API_KEY (선택)
  - TWILIO_AUTH_TOKEN (선택)
- [ ] Authentication 설정
  - 이메일/비밀번호 활성화
  - 소셜 로그인 설정 (선택)

### 4. 기능 테스트
- [ ] 회원가입/로그인 테스트
- [ ] 앱 빌더 6단계 완료 가능
- [ ] 주문 생성 테스트
- [ ] 주문 상태 변경 테스트
- [ ] 알림 전송 테스트
- [ ] 플랜별 제한사항 작동 확인
- [ ] 모바일 반응형 확인

### 5. 성능
- [ ] 이미지 최적화 (Unsplash 이미지 사용)
- [ ] 번들 크기 확인
- [ ] Lighthouse 점수 확인 (목표: 90+)
- [ ] 로딩 상태 표시 (Skeleton, Spinner 등)

### 6. 사용자 경험
- [ ] 에러 메시지 사용자 친화적
- [ ] 로딩 인디케이터 적절히 사용
- [ ] 빈 상태(Empty State) 처리
- [ ] 성공/실패 피드백 (Toast 등)
- [ ] 접근성 기본 준수 (alt 텍스트, 레이블 등)

### 7. 문서화
- [ ] README.md 업데이트
- [ ] API 문서 (Functions)
- [ ] 배포 가이드
- [ ] 스모크 테스트 가이드
- [ ] 트러블슈팅 가이드

### 8. 모니터링
- [ ] Firebase Analytics 설정
- [ ] Error Logging (Sentry 등, 선택)
- [ ] Performance Monitoring
- [ ] Function Logs 확인 방법

### 9. 백업 & 롤백
- [ ] Firestore 백업 설정
- [ ] 이전 버전 Functions 보관
- [ ] 롤백 계획 수립

---

## 🚀 배포 절차

### Step 1: 최종 테스트
```bash
# 로컬 Emulator 테스트
npm run test:local

# E2E 테스트 (있는 경우)
npm run test:e2e
```

### Step 2: 빌드 & 검증
```bash
# Functions 빌드
cd functions
npm run build

# Firestore Rules 검증
firebase deploy --only firestore:rules --dry-run
```

### Step 3: 배포 실행
```bash
# 배포 스크립트 실행
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

### Step 4: 배포 후 확인
- [ ] Firebase Console에서 배포 상태 확인
- [ ] Functions 로그 확인
- [ ] 실제 앱에서 스모크 테스트
- [ ] 에러 모니터링 확인

---

## 📋 스모크 테스트

배포 후 즉시 실행:

1. **인증 테스트**
   - [ ] 회원가입 가능
   - [ ] 로그인 가능
   - [ ] 로그아웃 가능

2. **주요 기능 테스트**
   - [ ] 앱 빌더로 앱 생성 가능
   - [ ] 주문 생성 가능
   - [ ] 주문 상태 변경 가능
   - [ ] 알림 전송 확인

3. **데이터 확인**
   - [ ] Firestore에 데이터 저장 확인
   - [ ] 데이터 읽기 권한 확인
   - [ ] 데이터 업데이트 확인

4. **성능 확인**
   - [ ] 페이지 로딩 속도 (< 3초)
   - [ ] Functions 응답 속도 (< 2초)
   - [ ] 에러율 확인

---

## 🆘 롤백 절차

문제 발생 시:

```bash
# Functions 이전 버전으로 롤백
firebase functions:rollback FUNCTION_NAME

# Firestore Rules 롤백
# Firebase Console에서 이전 버전 선택 후 배포

# 전체 롤백
git revert HEAD
./scripts/deploy.sh
```

---

## 📞 배포 후 모니터링

### 체크 항목 (첫 24시간)
- [ ] Error Rate < 1%
- [ ] Function 실행 성공률 > 99%
- [ ] 사용자 이탈률 확인
- [ ] 피드백 수집

### 주간 체크
- [ ] 활성 사용자 수
- [ ] 주문 수
- [ ] 매출
- [ ] 고객 리뷰

---

**Last Updated**: 2025-10-31  
**Version**: 1.0.0
```

IMPORTANT:
- 모든 항목 체크 후 배포
- 스모크 테스트 필수
- 롤백 계획 준비
```

### 예상 결과

```
/docs/T14-GO-CHECKLIST.md
```

### 검증 체크리스트

- [ ] 체크리스트 문서 생성
- [ ] 모든 섹션 포함
- [ ] 실행 가능한 스크립트

---

## 🔄 STEP 3: 스모크 테스트 가이드

### 프롬프트 템플릿

```
배포 후 즉시 실행할 스모크 테스트 가이드를 만듭니다.

## 요구사항

/docs/T14-Smoke-Test-Checklist.md 생성:

```markdown
# 스모크 테스트 체크리스트

배포 후 15분 이내에 완료해야 하는 핵심 기능 테스트

---

## 🔐 1. 인증 플로우 (5분)

### 1.1 회원가입
1. 랜딩 페이지 접속
2. "시작하기" 버튼 클릭
3. 이메일/비밀번호 입력
4. 회원가입 완료 확인
   - ✅ 성공 메시지 표시
   - ✅ 자동 로그인
   - ✅ 대시보드로 이동

### 1.2 로그아웃
1. 우측 상단 사용자 메뉴
2. "로그아웃" 클릭
3. 랜딩 페이지로 리다이렉트 확인

### 1.3 로그인
1. "로그인" 버튼 클릭
2. 이메일/비밀번호 입력
3. 대시보드 접근 확인

---

## 🛠️ 2. 앱 빌더 (5분)

### 2.1 기본 정보 입력 (Step 1)
1. "앱 만들기" 클릭
2. 스토어 이름 입력: "테스트 카페"
3. 업종 선택: "카페"
4. 다음 단계로 이동 확인

### 2.2 플랜 선택 (Step 2)
1. BASIC 플랜 선택
2. 플랜 설명 표시 확인
3. 다음 단계로 이동

### 2.3 최종 확인 (Step 6)
1. 모든 단계 건너뛰기
2. "앱 생성" 버튼 클릭
3. 성공 메시지 확인
4. 앱 미리보기 가능 확인

---

## 📦 3. 주문 시스템 (3분)

### 3.1 주문 생성
1. Store Admin 대시보드 접속
2. 테스트 주문 생성
   - 상품: "아메리카노"
   - 수량: 2
   - 금액: 9,000원
3. 주문 목록에 표시 확인

### 3.2 주문 상태 변경
1. 생성한 주문 클릭
2. 상태 변경: pending → confirmed
3. 타임라인 업데이트 확인
4. 상태 배지 색상 변경 확인

---

## 🔔 4. 알림 시스템 (2분)

### 4.1 알림 설정 확인
1. 사용자 프로필 → 알림 설정
2. Push 알림 ON 상태 확인
3. 설정 저장

### 4.2 테스트 알림 전송
1. Admin 대시보드 → 알림 관리
2. 테스트 알림 전송
3. 알림 수신 확인 (브라우저 또는 앱)

---

## 📊 5. 데이터 확인 (3분)

### 5.1 Firestore 데이터
1. Firebase Console → Firestore
2. 컬렉션 확인:
   - ✅ users (사용자 데이터)
   - ✅ stores (스토어 데이터)
   - ✅ orders (주문 데이터)
   - ✅ notifications (알림 데이터)

### 5.2 Functions 로그
1. Firebase Console → Functions
2. 최근 실행 로그 확인
3. 에러 없는지 확인

---

## 🎨 6. UI/UX (2분)

### 6.1 반응형 테스트
1. 브라우저 창 크기 조절
2. 모바일 뷰 (< 768px) 확인
3. 탭/메뉴 작동 확인

### 6.2 기본 인터랙션
1. 버튼 hover 효과
2. 모달 열기/닫기
3. 폼 입력 및 유효성 검사

---

## ⚡ 7. 성능 (2분)

### 7.1 페이지 로딩
1. 랜딩 페이지 로딩 시간 측정
   - ✅ 목표: < 3초
2. 대시보드 로딩 시간 측정
   - ✅ 목표: < 2초

### 7.2 Functions 응답
1. 주문 생성 API 응답 시간
   - ✅ 목표: < 2초
2. 상태 변경 API 응답 시간
   - ✅ 목표: < 1초

---

## 📝 테스트 결과 기록

| 항목 | 결과 | 비고 |
|------|------|------|
| 회원가입 | ✅ / ❌ |  |
| 로그인 | ✅ / ❌ |  |
| 앱 빌더 | ✅ / ❌ |  |
| 주문 생성 | ✅ / ❌ |  |
| 주문 상태 변경 | ✅ / ❌ |  |
| 알림 전송 | ✅ / ❌ |  |
| Firestore 데이터 | ✅ / ❌ |  |
| Functions 로그 | ✅ / ❌ |  |
| 반응형 | ✅ / ❌ |  |
| 성능 | ✅ / ❌ |  |

---

## 🚨 문제 발생 시

### Critical (즉시 롤백)
- [ ] 로그인 불가
- [ ] 주문 생성 실패
- [ ] Functions 에러율 > 10%

### High (24시간 내 수정)
- [ ] 알림 전송 실패
- [ ] 일부 페이지 로딩 느림
- [ ] UI 깨짐

### Medium (1주일 내 수정)
- [ ] 사소한 UI 버그
- [ ] 텍스트 오타
- [ ] 개선 사항

---

**테스트 완료 시간**: _______  
**테스터**: _______  
**전체 결과**: ✅ Pass / ❌ Fail  
**비고**: _______
```

IMPORTANT:
- 15분 이내 완료 가능해야 함
- Critical 이슈는 즉시 롤백
- 모든 결과 문서화
```

### 예상 결과

```
/docs/T14-Smoke-Test-Checklist.md
```

### 검증 체크리스트

- [ ] 스모크 테스트 가이드 생성
- [ ] 모든 핵심 기능 포함
- [ ] 시간 제한 명시
- [ ] 결과 기록 양식 포함

---

## 🔄 STEP 4: 최종 README 업데이트

### 프롬프트 템플릿

```
프로젝트 README를 최종 업데이트합니다.

## 요구사항

/README.md 업데이트:

```markdown
# MyStoreStory

> 배달 수수료 없는 자체 배달앱을 노코드로 만드는 SaaS 플랫폼

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Firebase](https://img.shields.io/badge/Firebase-v10.0-orange.svg)](https://firebase.google.com)
[![React](https://img.shields.io/badge/React-18.0-blue.svg)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org)

---

## 📋 프로젝트 개요

MyStoreStory는 소상공인이 배달 플랫폼의 높은 수수료 없이 자체 배달앱을 쉽게 만들 수 있는 노코드 빌더입니다.

### 주요 기능
- 🎨 **6단계 앱 빌더**: 클릭 몇 번으로 앱 생성
- 📱 **실시간 미리보기**: 플랜별 앱 실시간 확인
- 📦 **주문 관리**: 실시간 주문 추적 & 상태 관리
- 🔔 **스마트 알림**: FCM 기반 Push, Email, SMS
- 📊 **분석 대시보드**: 매출, 고객, 인기 메뉴 분석
- 🎯 **4가지 플랜**: FREE, BASIC, PREMIUM, ENTERPRISE

---

## 🛠️ 기술 스택

### Frontend
- **React 18** + **TypeScript**
- **Tailwind CSS v4.0** (디자인 시스템)
- **ShadCN/UI** (컴포넌트 라이브러리)
- **Lucide React** (아이콘)
- **Recharts** (차트)

### Backend
- **Firebase**
  - Authentication (이메일/비밀번호, 소셜)
  - Firestore (NoSQL 데이터베이스)
  - Cloud Functions v2 (서버리스)
  - Cloud Messaging (FCM Push)

### 라이브러리
- **React Hook Form** + **Zod** (폼 & 검증)
- **React DnD** (드래그앤드롭)
- **Motion** (애니메이션)

---

## 🚀 시작하기

### 사전 요구사항
- Node.js 18+
- Firebase CLI
- Firebase 프로젝트

### 설치

1. 저장소 클론
```bash
git clone https://github.com/your-org/mystorystory.git
cd mystorystory
```

2. 의존성 설치
```bash
npm install
cd functions && npm install && cd ..
```

3. Firebase 설정
```bash
firebase login
firebase use --add
```

4. 환경 변수 설정
```bash
# .env.local 생성
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
# ... (기타 Firebase Config)
```

5. 로컬 개발 서버 실행
```bash
npm run dev

# 다른 터미널에서 Firebase Emulators 실행
./scripts/local-test.sh
```

---

## 📦 배포

### 1. 배포 전 체크리스트
[T14-GO-CHECKLIST.md](./docs/T14-GO-CHECKLIST.md) 확인

### 2. 배포 실행
```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

### 3. 스모크 테스트
[T14-Smoke-Test-Checklist.md](./docs/T14-Smoke-Test-Checklist.md) 실행

---

## 📁 프로젝트 구조

```
/
├── components/          # React 컴포넌트
│   ├── admin/          # 관리자 컴포넌트
│   ├── store-admin/    # 매장 관리자 컴포넌트
│   ├── app-builder/    # 앱 빌더 컴포넌트
│   ├── order/          # 주문 관련 컴포넌트
│   ├── layouts/        # 레이아웃 (4가지)
│   └── ui/             # ShadCN 컴포넌트
├── pages/              # 페이지 컴포넌트
├── types/              # TypeScript 타입
├── services/           # API 서비스
├── hooks/              # 커스텀 훅
├── constants/          # 상수
├── functions/          # Cloud Functions
│   └── src/
│       ├── callables/  # Callable Functions
│       ├── queues/     # Queue Functions
│       ├── triggers/   # Trigger Functions
│       └── services/   # FCM, Slack 등
├── docs/               # 문서
└── scripts/            # 배포 스크립트
```

---

## 🧪 테스트

### E2E 테스트 대시보드
```
http://localhost:3000?test-dashboard
```

### 디자인 시스템
```
http://localhost:3000?design-system
```

### 레이아웃 쇼케이스
```
http://localhost:3000?layouts
```

---

## 📚 문서

- [배포 가이드](./docs/T14-Deployment-Guide.md)
- [Cloud Functions 가이드](./docs/T14-Functions-v2-Guide.md)
- [앱 미리보기 가이드](./docs/APP-PREVIEW-GUIDE.md)
- [테스팅 가이드](./docs/TESTING-GUIDE.md)

---

## 🔒 보안

- ✅ PII 보호 (`customerMasked` 사용)
- ✅ Firestore Security Rules
- ✅ Cloud Functions 인증
- ✅ Secrets 관리 (defineSecret)
- ❌ Billing은 T18까지 OFF

---

## 📊 플랜

| 기능 | FREE | BASIC | PREMIUM | ENTERPRISE |
|------|------|-------|---------|------------|
| 최대 상품 | 10 | 50 | 200 | 무제한 |
| 월 주문 | 50 | 300 | 1,000 | 무제한 |
| 분석 | ✅ | ✅ | ✅ | ✅ |
| 고급 분석 | ❌ | ❌ | ✅ | ✅ |
| 커스텀 브랜딩 | ❌ | ✅ | ✅ | ✅ |
| API 접근 | ❌ | ❌ | ✅ | ✅ |

[전체 플랜 비교](./constants/plan-limits.ts)

---

## 🤝 기여

이슈와 PR은 언제나 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 참조

---

## 📞 문의

- Email: support@mystorystory.com
- Website: https://mystorystory.com
- Docs: https://docs.mystorystory.com

---

**Made with ❤️ by MyStoreStory Team**
```

IMPORTANT:
- 명확한 시작 가이드
- 프로젝트 구조 설명
- 보안 정책 명시
- 플랜 비교 포함
```

### 예상 결과

```
업데이트된 /README.md
```

### 검증 체크리스트

- [ ] README 업데이트됨
- [ ] 모든 섹션 포함
- [ ] 링크 작동 확인
- [ ] 배지 표시

---

## ✅ Phase 9-3 완료 체크리스트

- [ ] 배포 스크립트 (deploy.sh, local-test.sh)
- [ ] 배포 체크리스트 문서
- [ ] 스모크 테스트 가이드
- [ ] README 최종 업데이트
- [ ] 모든 문서 링크 확인

---

## 🎉 프로젝트 완성!

**축하합니다!** MyStoreStory 프로젝트가 100% 완성되었습니다.

### 최종 통계
- 📁 **총 파일**: 200+ 파일
- 🧩 **컴포넌트**: 65+ 개
- 📄 **페이지**: 20+ 개
- ⚡ **Cloud Functions**: 6개
- 📚 **문서**: 10+ 개

### 다음 단계
1. ✅ 스모크 테스트 실행
2. ✅ 프로덕션 배포
3. ✅ 모니터링 설정
4. ✅ 사용자 피드백 수집
5. ✅ 지속적인 개선

---

## ❓ FAQ

**Q: 배포 후 문제가 생기면?**
A: T14-GO-CHECKLIST.md의 롤백 절차를 따르세요.

**Q: 모니터링은 어떻게 하나요?**
A: Firebase Console에서 Analytics, Performance, Crashlytics 확인.

**Q: 다음 버전 개발은?**
A: T15부터 시작하며, Billing 기능이 추가됩니다.
