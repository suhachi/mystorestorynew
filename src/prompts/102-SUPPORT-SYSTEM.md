# 102 - Support System Setup

## 📌 목표
고객 지원 시스템을 구축합니다.

**결과물**: 지원 채널, 티켓 시스템, SLA

---

## 프롬프트

```
MyStoreStory 고객을 위한 완벽한 지원 시스템을 구축합니다.

## 💬 Support System Setup

### 1. 지원 채널

#### 이메일 지원
```
support@mystorestory.com

SLA:
- 일반: 24시간 내 응답
- Pro: 12시간 내
- Enterprise: 2시간 내
```

#### 라이브 채팅
```tsx
<LiveChat>
  <Widget position="bottom-right">
    <Avatar>고객 지원</Avatar>
    <OnlineStatus>온라인</OnlineStatus>
  </Widget>
  
  <ChatWindow>
    <Messages />
    <QuickReplies>
      - 앱 만들기 도움
      - 결제 문의
      - 기술 지원
    </QuickReplies>
    <InputBox />
  </ChatWindow>
</LiveChat>

운영 시간: 평일 09:00-18:00
```

#### 전화 지원
```
1588-1234

운영 시간:
- 평일: 09:00-18:00
- 주말/공휴일: 휴무

Enterprise: 24/7 우선 지원
```

#### 헬프센터
```
https://help.mystorestory.com

- 검색 가능한 FAQ
- 비디오 가이드
- 단계별 튜토리얼
- 커뮤니티 포럼
```

---

### 2. 티켓 시스템

#### 티켓 우선순위

```typescript
enum Priority {
  P0 = 'Critical',    // 서비스 다운
  P1 = 'High',        // 주요 기능 오류
  P2 = 'Medium',      // 일반 문의
  P3 = 'Low'          // 개선 요청
}

const SLA = {
  P0: { response: '30min', resolution: '4h' },
  P1: { response: '2h', resolution: '24h' },
  P2: { response: '24h', resolution: '72h' },
  P3: { response: '48h', resolution: '1week' }
};
```

#### 티켓 플로우

```
[신규] → [할당] → [진행 중] → [대기] → [해결됨] → [완료]
           ↓
      [에스컬레이션]
```

---

### 3. FAQ 시스템

#### 자주 묻는 질문 (Top 20)

```markdown
### 일반

Q1: 앱 만드는데 얼마나 걸리나요?
A: 약 3-5분입니다.

Q2: 비용은 얼마인가요?
A: Basic 무료, Pro ₩29,000/월, Enterprise 문의

Q3: 플랜 변경은?
A: 언제든 가능합니다.

### 기술

Q4: 지원하는 브라우저는?
A: Chrome, Safari, Firefox, Edge (최신 버전)

Q5: 모바일에서도 사용 가능한가요?
A: 네, 반응형으로 최적화되어 있습니다.

Q6: 데이터는 안전한가요?
A: Firebase 보안 시스템으로 암호화 저장됩니다.

### 기능

Q7: 메뉴는 몇 개까지?
A: Basic 50개, Pro 200개, Enterprise 무제한

Q8: 결제 수단은?
A: 신용카드, 카카오페이, 토스페이 등

Q9: 배달은 어떻게?
A: 자체 배달, 배달대행, 픽업 선택 가능

### 요금

Q10: 환불 정책은?
A: 7일 이내 전액 환불, 14일 이내 50%

... (Q11-Q20)
```

---

### 4. 셀프 서비스

#### 도움말 위젯

```tsx
<HelpWidget>
  {/* 컨텍스트 도움말 */}
  <ContextualHelp page={currentPage}>
    <QuickTips />
    <RelatedArticles />
    <VideoGuide />
  </ContextualHelp>
  
  {/* 검색 */}
  <SearchBox>
    <Autocomplete source="help-articles" />
    <PopularSearches />
  </SearchBox>
  
  {/* 문의하기 */}
  <ContactOptions>
    <LiveChat />
    <Email />
    <Phone />
  </ContactOptions>
</HelpWidget>
```

---

### 5. 지식 베이스

#### 구조

```
Help Center
├── Getting Started
│   ├── Signup
│   ├── Create App
│   └── Add Menu
├── Features
│   ├── Menu Management
│   ├── Order Management
│   ├── Customer Management
│   └── Analytics
├── Plans & Billing
│   ├── Plans Comparison
│   ├── Upgrade/Downgrade
│   └── Billing
├── Technical
│   ├── Browser Support
│   ├── API Documentation
│   └── Integrations
└── Policies
    ├── Terms of Service
    ├── Privacy Policy
    └── Refund Policy
```

---

### 6. 커뮤니티 포럼

```
https://community.mystorestory.com

카테고리:
- 📢 공지사항
- 💡 아이디어 제안
- 🐛 버그 리포트
- 🤝 도움 요청
- 📊 성공 사례
- 💬 자유 게시판

운영:
- 커뮤니티 매니저
- 파워 유저 (뱃지)
- 공식 답변 (Staff 뱃지)
```

---

### 7. 응답 템플릿

#### 일반 문의

```
안녕하세요 {name}님,

MyStoreStory 고객 지원팀입니다.

{질문}에 대한 답변입니다:
{답변}

추가로 궁금하신 점이 있으시면 언제든 문의해주세요.

감사합니다,
{agent_name}
MyStoreStory 팀
```

#### 기술 지원

```
안녕하세요 {name}님,

기술 지원팀입니다.

보고하신 이슈를 확인했습니다:
{issue_description}

해결 방법:
1. {step1}
2. {step2}
3. {step3}

문제가 해결되지 않으면 알려주세요.

감사합니다,
{agent_name}
기술 지원팀
```

---

### 8. 모니터링 & 메트릭

#### 주요 메트릭

```typescript
interface SupportMetrics {
  // 응답 시간
  avgResponseTime: number;  // 목표: < 2h
  
  // 해결 시간
  avgResolutionTime: number; // 목표: < 24h
  
  // 만족도
  csat: number; // 목표: > 4.5/5
  
  // 해결률
  firstContactResolution: number; // 목표: > 70%
  
  // 티켓 볼륨
  dailyTickets: number;
  
  // 백로그
  openTickets: number; // 목표: < 50
}
```

#### 대시보드

```tsx
<SupportDashboard>
  <MetricCard title="평균 응답 시간" value="1.8h" target="2h" status="✅" />
  <MetricCard title="고객 만족도" value="4.6/5" target="4.5/5" status="✅" />
  <MetricCard title="해결률" value="72%" target="70%" status="✅" />
  
  <TicketQueue>
    <Filter priority="P0" count={2} />
    <Filter priority="P1" count={5} />
    <Filter priority="P2" count={23} />
    <Filter priority="P3" count={15} />
  </TicketQueue>
  
  <RecentTickets limit={10} />
</SupportDashboard>
```

---

### 9. 에스컬레이션 프로세스

```
Level 1: 고객 지원 (일반 문의)
↓ (해결 불가)
Level 2: 기술 지원 (기술 이슈)
↓ (복잡한 이슈)
Level 3: 개발팀 (버그, 긴급)
↓ (Critical)
Level 4: CTO/CEO (서비스 다운)
```

#### 에스컬레이션 기준

```
- P0: 즉시 Level 3
- P1: 2시간 내 미해결 → Level 2
- P2: 24시간 내 미해결 → Level 2
- 고객 요청 시
- 복잡한 기술 이슈
```

---

### 10. 팀 구성

#### 인원

```
- 고객 지원 리더: 1명
- 고객 지원 담당: 3명
- 기술 지원: 2명
- 커뮤니티 매니저: 1명

총: 7명
```

#### 교대 근무

```
평일 09:00-18:00:
- 오전조 (09:00-14:00): 2명
- 오후조 (13:00-18:00): 2명
- 풀타임: 1명

주말/공휴일: 
- On-call (긴급만)
```

IMPORTANT: 빠른 응답, 친절한 서비스, 문제 해결, 지속적인 개선
```

---

## 📝 다음: **103-109 프롬프트 한번에 완성!**
