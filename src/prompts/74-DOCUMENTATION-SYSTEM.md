# 74 - Documentation System

## 📌 목표
완전한 문서화 시스템을 구축합니다.

**결과물**:
- API 문서
- 사용자 가이드
- 개발자 문서
- FAQ

**총 개념 정리**

---

## 🔄 STEP 1: 문서 구조

### 프롬프트 템플릿

```
완전한 문서화 시스템을 구축합니다.

## 1. 문서 디렉토리 구조

```
docs/
├── api/                  # API 레퍼런스
│   ├── authentication.md
│   ├── orders.md
│   ├── menus.md
│   └── customers.md
├── guides/               # 사용자 가이드
│   ├── getting-started.md
│   ├── app-builder.md
│   ├── store-management.md
│   └── customer-app.md
├── developers/           # 개발자 문서
│   ├── setup.md
│   ├── architecture.md
│   ├── contributing.md
│   └── deployment.md
├── troubleshooting/      # 문제 해결
│   ├── common-issues.md
│   └── faq.md
└── README.md            # 메인 문서
```

## 2. README.md

```markdown
# MyStoreStory

> 배달 수수료 없는 자체 배달앱 구축 플랫폼

## 🚀 빠른 시작

### 사용자
1. [회원가입](https://mystorestory.com/signup)
2. [앱 빌더로 이동](https://mystorestory.com/app-builder)
3. 5분 만에 앱 생성!

### 개발자
```bash
# 저장소 클론
git clone https://github.com/mystorestory/app.git

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

## 📚 문서

- [사용자 가이드](./docs/guides/)
- [API 레퍼런스](./docs/api/)
- [개발자 문서](./docs/developers/)
- [FAQ](./docs/troubleshooting/faq.md)

## 🎯 주요 기능

- ✅ 노코드 앱 빌더
- ✅ 실시간 주문 관리
- ✅ 고객 관리 시스템
- ✅ 매출 분석 대시보드
- ✅ 포인트 적립 시스템

## 📞 문의

- 이메일: support@mystorestory.com
- Slack: [커뮤니티 참여](https://mystorestory.slack.com)
- 이슈: [GitHub Issues](https://github.com/mystorestory/app/issues)

## 📄 라이선스

MIT License
```

## 3. 사용자 가이드

docs/guides/getting-started.md:

```markdown
# 시작하기

MyStoreStory에 오신 것을 환영합니다!

## 1단계: 회원가입

1. [회원가입 페이지](https://mystorestory.com/signup) 접속
2. 이메일과 비밀번호 입력
3. 이메일 인증

## 2단계: 앱 빌더 시작

1. [앱 빌더](https://mystorestory.com/app-builder) 접속
2. "새 앱 만들기" 클릭

## 3단계: 기본 정보 입력

- 상점 이름
- 카테고리
- 위치
- 운영 시간

## 4단계: 플랜 선택

### Basic (무료)
- 메뉴 50개
- 월 1,000개 주문

### Pro (₩29,000/월)
- 메뉴 200개
- 월 5,000개 주문
- 고급 분석

### Enterprise (문의)
- 무제한
- 전담 지원

## 5단계: 기능 선택

- [ ] 대시보드
- [ ] 메뉴 관리
- [ ] 주문 관리
- [ ] 고객 관리
- [ ] 분석
- [ ] 포인트

## 6단계: 앱 생성

"앱 만들기" 클릭 → 5분 대기 → 완료!

## 다음 단계

- [메뉴 추가하기](./menu-management.md)
- [첫 주문 받기](./first-order.md)
- [고객 관리](./customer-management.md)
```

## 4. API 문서

docs/api/orders.md:

```markdown
# Orders API

주문 관리 API

## 주문 생성

```http
POST /api/orders
Content-Type: application/json
Authorization: Bearer <token>

{
  "storeId": "store123",
  "customerId": "customer123",
  "items": [
    {
      "menuId": "menu123",
      "quantity": 2,
      "price": 5000
    }
  ],
  "total": 10000,
  "customerInfo": {
    "name": "홍길동",
    "phone": "010-1234-5678",
    "address": "서울시 강남구..."
  }
}
```

응답:

```json
{
  "success": true,
  "orderId": "order123",
  "status": "pending",
  "createdAt": "2024-11-01T12:00:00Z"
}
```

## 주문 조회

```http
GET /api/orders/:orderId
Authorization: Bearer <token>
```

응답:

```json
{
  "orderId": "order123",
  "status": "delivered",
  "items": [...],
  "total": 10000,
  "createdAt": "2024-11-01T12:00:00Z",
  "updatedAt": "2024-11-01T13:30:00Z"
}
```

## 주문 상태 업데이트

```http
PATCH /api/orders/:orderId/status
Content-Type: application/json
Authorization: Bearer <token>

{
  "status": "confirmed"
}
```

## 에러 코드

- `400`: 잘못된 요청
- `401`: 인증 실패
- `403`: 권한 없음
- `404`: 주문 없음
- `500`: 서버 오류
```

## 5. 개발자 문서

docs/developers/architecture.md:

```markdown
# 아키텍처

## 기술 스택

### Frontend
- **React**: UI 프레임워크
- **TypeScript**: 타입 안전성
- **Tailwind CSS**: 스타일링
- **Vite**: 빌드 도구

### Backend
- **Firebase**: BaaS
  - Authentication: 인증
  - Firestore: 데이터베이스
  - Functions: 서버리스
  - Hosting: 정적 호스팅

### 상태 관리
- React Context
- useState/useEffect

### 라우팅
- React Router v6

## 프로젝트 구조

```
src/
├── components/        # React 컴포넌트
│   ├── admin/        # 관리자
│   ├── store-admin/  # 사장님
│   ├── customer/     # 고객
│   └── ui/           # UI 컴포넌트
├── hooks/            # 커스텀 훅
├── pages/            # 페이지
├── utils/            # 유틸리티
├── types/            # 타입 정의
└── firebase-config.ts # Firebase 설정
```

## 데이터 모델

### Users
```typescript
interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'customer' | 'owner' | 'admin';
  storeId?: string;
}
```

### Orders
```typescript
interface Order {
  id: string;
  storeId: string;
  customerId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';
  createdAt: number;
}
```

## 보안

- Firebase Security Rules
- HTTPS only
- CORS 설정
- Rate Limiting
```

## 6. FAQ

docs/troubleshooting/faq.md:

```markdown
# 자주 묻는 질문 (FAQ)

## 일반

### Q: MyStoreStory는 무엇인가요?
A: 배달 수수료 없는 자체 배달앱을 노코드로 만들 수 있는 플랫폼입니다.

### Q: 비용은 얼마인가요?
A: Basic (무료), Pro (₩29,000/월), Enterprise (문의)

### Q: 앱 만드는데 얼마나 걸리나요?
A: 약 5분이면 앱을 생성할 수 있습니다.

## 기술

### Q: 어떤 기술을 사용하나요?
A: React, TypeScript, Firebase, Tailwind CSS

### Q: 모바일 앱도 있나요?
A: 현재는 웹 앱(PWA)만 제공합니다.

### Q: API를 제공하나요?
A: 네, REST API를 제공합니다. [API 문서](../api/)

## 문제 해결

### Q: 로그인이 안 돼요
A: 
1. 이메일 인증 완료 확인
2. 비밀번호 재설정 시도
3. 캐시 삭제 후 재시도

### Q: 주문이 안 들어와요
A:
1. 상점 운영 시간 확인
2. 메뉴 활성화 확인
3. 알림 설정 확인

### Q: 결제가 안 돼요
A:
1. 결제 수단 확인
2. 한도 확인
3. 고객센터 문의

## 계정

### Q: 계정을 삭제하고 싶어요
A: 설정 > 계정 > 계정 삭제

### Q: 이메일을 변경하고 싶어요
A: 설정 > 프로필 > 이메일 변경

## 문의

더 궁금하신 점이 있으면:
- 이메일: support@mystorestory.com
- 채팅: [실시간 채팅](https://mystorestory.com/chat)
```

## 7. 문서 사이트 (Docusaurus)

```bash
# Docusaurus 설치
npx create-docusaurus@latest docs-site classic

# 개발 서버
cd docs-site
npm start
```

docusaurus.config.js:

```javascript
module.exports = {
  title: 'MyStoreStory Docs',
  tagline: '배달앱 제작 플랫폼',
  url: 'https://docs.mystorestory.com',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  
  themeConfig: {
    navbar: {
      title: 'MyStoreStory',
      items: [
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/api',
          label: 'API',
          position: 'left',
        },
        {
          href: 'https://github.com/mystorestory/app',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/intro',
            },
            {
              label: 'API Reference',
              to: '/api',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} MyStoreStory.`,
    },
  },
};
```

## 8. 인라인 문서

컴포넌트에 JSDoc 추가:

```typescript
/**
 * 주문 생성 함수
 * 
 * @param orderData - 주문 데이터
 * @param orderData.storeId - 상점 ID
 * @param orderData.items - 주문 항목
 * @returns 생성된 주문 ID
 * 
 * @example
 * ```typescript
 * const orderId = await createOrder({
 *   storeId: 'store123',
 *   items: [{ menuId: 'menu123', quantity: 2 }]
 * });
 * ```
 */
export async function createOrder(orderData: OrderData): Promise<string> {
  // 구현
}
```

IMPORTANT:
- README.md (프로젝트 소개)
- 사용자 가이드 (단계별)
- API 문서 (엔드포인트, 예제)
- 개발자 문서 (아키텍처, 설정)
- FAQ (자주 묻는 질문)
- Docusaurus (문서 사이트)
- JSDoc (인라인 문서)
```

---

## 📝 핵심 포인트

### 좋은 문서의 특징
1. **명확함**: 간단하고 이해하기 쉬움
2. **완전함**: 모든 기능 설명
3. **정확함**: 최신 정보 유지
4. **예제**: 실제 사용 예시

### 문서 타입
- **Tutorial**: 단계별 가이드
- **How-to**: 특정 작업 방법
- **Reference**: API, 설정 레퍼런스
- **Explanation**: 개념, 이론 설명

---

## ✅ 완료 체크리스트

- [ ] README.md
- [ ] 사용자 가이드
- [ ] API 문서
- [ ] 개발자 문서
- [ ] FAQ
- [ ] Docusaurus 사이트

---

## 📝 다음 단계

**75-FINAL-CHECKLIST.md**로 이동합니다.
