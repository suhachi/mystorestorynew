# 81 - Frequently Asked Questions (FAQ)

## 📌 목표
자주 묻는 질문과 답변을 정리합니다.

**결과물**:
- 사용자 FAQ
- 개발자 FAQ
- 트러블슈팅 FAQ

**총 FAQ 문서**

---

## 🔄 STEP 1: FAQ

### 프롬프트 템플릿

```
MyStoreStory의 자주 묻는 질문과 답변입니다.

## ❓ Frequently Asked Questions

### 📱 일반 FAQ

#### Q1. MyStoreStory는 무엇인가요?
**A**: MyStoreStory는 배달 수수료 없이 자체 배달앱을 노코드로 만들 수 있는 플랫폼입니다. 카페, 음식점, 베이커리 등 다양한 업종에서 사용할 수 있습니다.

---

#### Q2. 앱 만드는데 얼마나 걸리나요?
**A**: 약 3-5분이면 앱이 생성됩니다. 정보 입력과 설정을 포함해도 10-15분 정도면 충분합니다.

**단계**:
1. 기본 정보 입력 (2분)
2. 플랜 선택 (1분)
3. 기능 설정 (3분)
4. 디자인 설정 (2분)
5. 앱 생성 (3-5분)

---

#### Q3. 비용은 얼마인가요?
**A**: 3가지 플랜이 있습니다.

| 플랜 | 월 비용 | 주요 기능 |
|------|---------|----------|
| Basic | 무료 | 메뉴 50개, 월 1,000개 주문 |
| Pro | ₩29,000 | 메뉴 200개, 월 5,000개 주문, 고급 분석 |
| Enterprise | 문의 | 무제한, 전담 지원 |

**추가 비용 없음**: 배달앱 수수료 없이 플랜 비용만 지불하면 됩니다.

---

#### Q4. 플랜은 언제든 변경 가능한가요?
**A**: 네, 언제든 업그레이드/다운그레이드 가능합니다.

**업그레이드**:
- 즉시 적용
- 차액만 결제

**다운그레이드**:
- 다음 결제일부터 적용
- 환불 없음

---

#### Q5. 고객이 앱을 어떻게 사용하나요?
**A**: 고객은 웹 브라우저로 접속하여 주문할 수 있습니다.

**접속 방법**:
1. **웹 브라우저**: `mystorestory.com/store/your-store-id`
2. **PWA 설치** (선택): "홈 화면에 추가" 클릭
3. **QR 코드**: 상점 QR 코드 스캔

**장점**:
- 앱 다운로드 불필요
- 모든 기기에서 사용 가능
- 자동 업데이트

---

#### Q6. 결제는 어떻게 되나요?
**A**: 다양한 결제 수단을 지원합니다.

**지원 결제 수단**:
- 신용카드/체크카드
- 카카오페이
- 토스페이
- 네이버페이 (준비 중)
- 현장 결제

**PG사**: KG이니시스, 토스페이먼츠 연동

**수수료**: PG사 기본 수수료만 발생 (약 2.5-3.5%)

---

#### Q7. 배달은 어떻게 하나요?
**A**: 3가지 방법을 선택할 수 있습니다.

1. **자체 배달**: 자체 배달원 운영
2. **배달대행**: 배달대행 서비스 연동 (준비 중)
3. **픽업**: 고객이 직접 방문하여 수령

**권장**: 초기에는 픽업 또는 자체 배달, 주문량 증가 시 배달대행

---

#### Q8. 메뉴는 몇 개까지 등록할 수 있나요?
**A**: 플랜에 따라 다릅니다.

- **Basic**: 50개
- **Pro**: 200개
- **Enterprise**: 무제한

**팁**: 인기 메뉴 위주로 등록하고, 계절별로 메뉴 변경

---

#### Q9. 포인트 적립은 어떻게 설정하나요?
**A**: Pro 플랜 이상에서 설정 가능합니다.

**설정 방법**:
1. 대시보드 → 설정 → 포인트
2. 적립률 설정 (예: 5%)
3. 최소 사용 포인트 (예: 1,000P)
4. 유효기간 (예: 1년)

**예시**: 10,000원 주문 시 500 포인트 적립

---

#### Q10. 고객 데이터는 안전한가요?
**A**: 네, Firebase 보안 시스템으로 안전하게 보관됩니다.

**보안 조치**:
- SSL/TLS 암호화
- Firebase Security Rules
- 개인정보 암호화 저장
- 정기 백업
- GDPR 준수

---

### 💻 개발자 FAQ

#### Q11. 기술 스택은 무엇인가요?
**A**:

**Frontend**:
- React 18.3.1
- TypeScript
- Tailwind CSS v4
- Vite

**Backend**:
- Firebase (BaaS)
- Cloud Functions (Node.js 20)
- Firestore
- Cloud Storage

---

#### Q12. 로컬 개발 환경 설정은?
**A**:

```bash
# 1. 저장소 클론
git clone https://github.com/mystorestory/app.git

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
cp .env.example .env.development

# 4. 개발 서버 실행
npm run dev
```

**요구사항**:
- Node.js v18+
- npm v9+
- Firebase CLI v13+

---

#### Q13. Firebase Emulator 사용 방법은?
**A**:

```bash
# Emulator 시작
firebase emulators:start

# 특정 서비스만
firebase emulators:start --only firestore,functions

# UI 확인
http://localhost:4000
```

**장점**:
- 로컬 테스트
- 비용 절감
- 빠른 개발

---

#### Q14. 배포는 어떻게 하나요?
**A**:

```bash
# 1. 빌드
npm run build

# 2. Firebase 프로젝트 선택
firebase use production

# 3. 배포
firebase deploy

# 또는 스크립트 사용
./scripts/deploy.sh
```

**자동 배포**: GitHub Actions (main 브랜치 푸시 시)

---

#### Q15. Cloud Functions 디버깅은?
**A**:

```bash
# 로그 확인
firebase functions:log

# 특정 함수 로그
firebase functions:log --only setOrderStatus

# 실시간 로그
firebase functions:log --tail
```

**로컬 디버깅**:
```bash
cd functions
npm run serve
```

---

### 🔧 트러블슈팅 FAQ

#### Q16. 빌드가 실패해요
**A**: 가장 흔한 원인과 해결 방법:

**원인 1**: node_modules 문제
```bash
rm -rf node_modules package-lock.json
npm install
```

**원인 2**: Node.js 버전
```bash
node --version  # v18+ 필요
nvm use 18
```

**원인 3**: 캐시 문제
```bash
npm cache clean --force
```

---

#### Q17. Firestore Permission Denied 에러
**A**:

**해결 방법**:

1. **로그인 확인**
```typescript
import { getAuth } from 'firebase/auth';
const auth = getAuth();
console.log(auth.currentUser); // null이면 로그인 필요
```

2. **Security Rules 확인**
```javascript
// firestore.rules
match /orders/{orderId} {
  allow read: if request.auth != null;
}
```

3. **Rules 배포**
```bash
firebase deploy --only firestore:rules
```

---

#### Q18. 환경 변수가 undefined
**A**:

**확인 사항**:

1. **파일명 확인**
```
✅ .env.development
❌ env.development
❌ .development.env
```

2. **prefix 확인**
```bash
# ✅ Vite는 VITE_ prefix 필수
VITE_FIREBASE_API_KEY=xxx

# ❌ prefix 없음
FIREBASE_API_KEY=xxx
```

3. **서버 재시작**
```bash
npm run dev  # 재시작 필수
```

---

#### Q19. Firebase 배포 실패
**A**:

**확인 사항**:

1. **로그인 확인**
```bash
firebase login --reauth
```

2. **프로젝트 확인**
```bash
firebase use
firebase projects:list
```

3. **권한 확인**
- Firebase Console → IAM
- Editor 이상 권한 필요

---

#### Q20. 성능이 느려요
**A**:

**확인 사항**:

1. **번들 크기**
```bash
npm run build
du -sh dist/*
```

2. **이미지 최적화**
- WebP 포맷 사용
- 이미지 압축
- Lazy loading

3. **Code Splitting**
```typescript
const AdminDashboard = lazy(() => import('./pages/admin-dashboard'));
```

4. **Firestore 쿼리 최적화**
```typescript
// ✅ limit 사용
query(collection(db, 'orders'), limit(10))

// ❌ 전체 조회
getDocs(collection(db, 'orders'))
```

---

### 💡 기능별 FAQ

#### Q21. 포인트를 수동으로 적립할 수 있나요?
**A**: 네, 가능합니다.

**방법**:
1. 대시보드 → 고객 관리
2. 고객 선택 → "포인트 적립/차감"
3. 금액 입력 → 사유 입력 → 확인

---

#### Q22. 메뉴를 카테고리별로 정렬할 수 있나요?
**A**: 네, 자동으로 카테고리별로 정렬됩니다.

**카테고리 설정**:
1. 메뉴 추가/수정 시 카테고리 선택
2. 카테고리별로 자동 그룹핑
3. 순서 변경 가능 (드래그 앤 드롭)

---

#### Q23. 주문 알림을 어떻게 받나요?
**A**: 3가지 방법으로 알림을 받을 수 있습니다.

1. **푸시 알림**: 브라우저 알림 (권장)
2. **이메일**: 설정한 이메일로 수신
3. **Slack**: Slack 채널 연동 (Pro 이상)

**설정**: 대시보드 → 설정 → 알림

---

#### Q24. 영업 시간을 설정할 수 있나요?
**A**: 네, 요일별로 설정 가능합니다.

**설정 방법**:
1. 대시보드 → 설정 → 영업 시간
2. 요일별 시간 입력
3. 휴무일 설정

**예시**:
```
월-금: 08:00 - 22:00
토-일: 10:00 - 20:00
공휴일: 휴무
```

---

#### Q25. 통계는 어떻게 확인하나요?
**A**: 대시보드에서 확인할 수 있습니다.

**Basic**:
- 일일 매출
- 주문 건수
- 인기 메뉴

**Pro** (추가):
- 일별/주별/월별 매출 그래프
- 시간대별 분석
- 고객 분석
- 메뉴별 매출

**Enterprise** (추가):
- 커스텀 리포트
- 데이터 내보내기 (CSV, Excel)

---

### 📞 지원 FAQ

#### Q26. 기술 지원은 어떻게 받나요?
**A**:

**지원 채널**:
1. **이메일**: support@mystorestory.com
2. **라이브 채팅**: 웹사이트 우측 하단
3. **전화**: 1588-1234 (평일 09:00-18:00)
4. **헬프센터**: https://help.mystorestory.com

**우선순위**:
- Enterprise: 2시간 이내
- Pro: 24시간 이내
- Basic: 48시간 이내

---

#### Q27. 교육이나 매뉴얼이 있나요?
**A**: 네, 다양한 자료를 제공합니다.

**자료**:
1. **사용자 가이드**: 단계별 튜토리얼
2. **비디오 가이드**: YouTube 채널
3. **웨비나**: 월 1회 온라인 교육
4. **1:1 교육**: Enterprise 플랜 (무료)

---

#### Q28. 환불 정책은?
**A**:

**환불 조건**:
- 서비스 시작 7일 이내: 전액 환불
- 14일 이내: 50% 환불
- 그 이후: 환불 불가

**예외**: 서비스 장애로 인한 문제 시 별도 협의

---

#### Q29. 데이터를 내보낼 수 있나요?
**A**: Pro 이상 플랜에서 가능합니다.

**내보내기 가능 데이터**:
- 주문 내역 (CSV)
- 고객 정보 (CSV)
- 매출 리포트 (PDF, Excel)

**방법**: 대시보드 → 데이터 내보내기

---

#### Q30. 서비스를 해지하면 데이터는?
**A**:

**해지 시**:
- 즉시 서비스 중지
- 데이터는 30일간 보관
- 30일 이내 재가입 시 복구 가능

**데이터 백업**:
- 해지 전 데이터 내보내기 권장
- 백업 요청 시 별도 비용 발생 가능

IMPORTANT:
- 자주 묻는 질문 정기 업데이트
- 사용자 피드백 반영
- 검색 가능하게 구성
- 카테고리별 분류
```

---

## 📝 핵심 포인트

### FAQ 작성 원칙
1. **명확함**: 간단하고 이해하기 쉽게
2. **완전함**: 모든 정보 포함
3. **최신성**: 정기적 업데이트
4. **검색성**: 키워드 최적화

### 자주 묻는 질문 Top 5
1. 비용은 얼마인가요?
2. 앱 만드는데 얼마나 걸리나요?
3. 결제는 어떻게 되나요?
4. 고객이 앱을 어떻게 사용하나요?
5. 플랜 변경은 언제든 가능한가요?

---

## ✅ 완료 체크리스트

- [ ] 일반 FAQ (10개)
- [ ] 개발자 FAQ (5개)
- [ ] 트러블슈팅 FAQ (5개)
- [ ] 기능별 FAQ (5개)
- [ ] 지원 FAQ (5개)

---

## 📝 다음 단계

**82-MIGRATION-GUIDE.md**로 이동합니다.
