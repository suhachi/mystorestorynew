# 100 - User Onboarding Flow

## 📌 목표
신규 사용자 온보딩 플로우를 설계합니다.

**결과물**: 온보딩 플로우, 튜토리얼, 체크리스트

---

## 프롬프트

```
MyStoreStory 신규 사용자를 위한 완벽한 온보딩 경험을 만듭니다.

## 👋 User Onboarding Flow

### 1. 온보딩 여정

#### Step 1: 첫 방문 (0분)

**랜딩 페이지**:
```tsx
<Hero>
  <h1>배달 수수료 없는 자체 배달앱</h1>
  <p>3분 만에 나만의 배달앱 만들기</p>
  <Button>무료로 시작하기</Button>
</Hero>

<ValueProposition>
  ✅ 수수료 0원
  ✅ 3분 만에 앱 생성
  ✅ 고객 관리 시스템
</ValueProposition>
```

**CTAs**:
- 무료로 시작하기 (Primary)
- 데모 보기 (Secondary)
- 가격 확인 (Tertiary)

---

#### Step 2: 회원가입 (2분)

**간소화된 폼**:
```tsx
<SignupForm>
  <Input name="email" placeholder="이메일" required />
  <Input name="password" type="password" placeholder="비밀번호 (8자 이상)" required />
  <Input name="name" placeholder="이름" required />
  <Button>가입하기</Button>
</SignupForm>

{/* 소셜 로그인 */}
<SocialLogin>
  <GoogleButton />
  <KakaoButton />
</SocialLogin>
```

**가입 즉시**:
- 환영 이메일 발송
- 대시보드로 리디렉션
- 온보딩 투어 시작

---

#### Step 3: 환영 & 목표 설정 (1분)

**Welcome Modal**:
```tsx
<WelcomeModal>
  <h2>환영합니다, {name}님! 👋</h2>
  <p>MyStoreStory와 함께 시작해볼까요?</p>
  
  <GoalSelector>
    <Option value="create_app">
      📱 앱 만들기
      <small>3분 완성</small>
    </Option>
    <Option value="explore">
      🔍 둘러보기
      <small>기능 탐색</small>
    </Option>
    <Option value="demo">
      🎬 데모 보기
      <small>비디오 튜토리얼</small>
    </Option>
  </GoalSelector>
</WelcomeModal>
```

---

#### Step 4: 가이드 투어 (5분)

**Interactive Tour**:
```typescript
const tourSteps = [
  {
    target: '#create-app-button',
    title: '앱 만들기',
    content: '여기서 새로운 앱을 만들 수 있어요',
    placement: 'bottom'
  },
  {
    target: '#dashboard',
    title: '대시보드',
    content: '주문, 매출, 고객을 한눈에 확인하세요',
    placement: 'right'
  },
  {
    target: '#menu-management',
    title: '메뉴 관리',
    content: '메뉴를 추가하고 수정할 수 있어요',
    placement: 'right'
  }
];

<Tour steps={tourSteps} />
```

---

#### Step 5: 첫 앱 만들기 (10분)

**Guided App Builder**:
```tsx
<AppBuilder guided>
  {/* Step 1 */}
  <StepOne>
    <Tooltip>
      상점 이름을 입력하세요
      예: "카페 마이스토리"
    </Tooltip>
    <ProgressIndicator>1/6 단계</ProgressIndicator>
  </StepOne>
  
  {/* Step 2 */}
  <StepTwo>
    <PlanComparison>
      <RecommendedBadge plan="Pro">
        가장 인기있는 플랜
      </RecommendedBadge>
    </PlanComparison>
  </StepTwo>
  
  {/* ... Steps 3-6 */}
</AppBuilder>
```

**실시간 도움말**:
- 각 단계마다 툴팁
- 예시 데이터 제공
- "잘 하셨어요!" 격려 메시지

---

#### Step 6: 축하 & 다음 단계 (2분)

**Success Screen**:
```tsx
<SuccessModal>
  <Confetti />
  <h1>🎉 축하합니다!</h1>
  <p>앱이 생성되었어요</p>
  
  <AppPreview storeId={newStoreId} />
  
  <NextSteps>
    <Step checked>✅ 앱 만들기</Step>
    <Step>📝 메뉴 등록하기</Step>
    <Step>🚀 앱 공유하기</Step>
  </NextSteps>
  
  <Actions>
    <Button onClick={goToMenus}>메뉴 등록하기</Button>
    <Button variant="outline" onClick={viewApp}>앱 보기</Button>
  </Actions>
</SuccessModal>
```

---

### 2. 온보딩 체크리스트

#### 필수 단계 (Core)

```tsx
<OnboardingChecklist>
  <Task id="signup" status="completed">
    ✅ 회원가입
  </Task>
  <Task id="create_app" status="in_progress">
    📱 앱 만들기 (진행 중)
    <Progress value={60} />
  </Task>
  <Task id="add_menu" status="pending">
    📝 메뉴 5개 추가
    <small>0/5 완료</small>
  </Task>
  <Task id="customize" status="pending">
    🎨 브랜딩 설정
  </Task>
  <Task id="share" status="pending">
    🚀 앱 공유하기
  </Task>
</OnboardingChecklist>
```

**완료 시 보상**:
- 배지 획득
- Pro 플랜 7일 무료 체험
- 우선 지원

---

### 3. 인터랙티브 튜토리얼

#### 메뉴 추가 튜토리얼

```tsx
<Tutorial name="add_menu">
  <Step>
    <Highlight target="#add-menu-button">
      여기를 클릭하세요
    </Highlight>
    <Instruction>
      새 메뉴를 추가해볼까요?
    </Instruction>
  </Step>
  
  <Step>
    <FormHelper>
      <SampleData>
        메뉴명: 아메리카노
        가격: 4,500원
        카테고리: 커피
      </SampleData>
      <AutoFill>자동 입력</AutoFill>
    </FormHelper>
  </Step>
  
  <Step>
    <Success>
      🎉 첫 메뉴를 추가했어요!
      <NextButton>다음 메뉴 추가</NextButton>
    </Success>
  </Step>
</Tutorial>
```

---

### 4. 도움말 시스템

#### 컨텍스트 도움말

```tsx
<HelpSystem>
  {/* 페이지별 도움말 */}
  <PageHelp page="menu">
    <QuickTips>
      💡 팁: 인기 메뉴부터 등록하세요
      💡 팁: 메뉴 사진이 있으면 주문이 30% 증가해요
    </QuickTips>
  </PageHelp>
  
  {/* 검색 가능한 헬프센터 */}
  <HelpCenter>
    <SearchBar placeholder="무엇을 도와드릴까요?" />
    <PopularArticles>
      - 메뉴 추가하는 방법
      - 플랜 변경하기
      - 주문 관리하기
    </PopularArticles>
  </HelpCenter>
  
  {/* 라이브 채팅 */}
  <LiveChat>
    <Avatar>고객 지원</Avatar>
    <Message>
      무엇을 도와드릴까요? 😊
    </Message>
  </LiveChat>
</HelpSystem>
```

---

### 5. 이메일 온보딩 시퀀스

#### Day 0 (가입 즉시)

```
제목: 환영합니다! MyStoreStory 시작하기 🎉

안녕하세요 {name}님,

MyStoreStory에 가입해주셔서 감사합니다!

🚀 다음 단계:
1. 앱 만들기 (3분)
2. 메뉴 추가하기 (10분)
3. 앱 공유하기 (2분)

[앱 만들기 시작]

궁금한 점이 있으시면 언제든 답장해주세요.

감사합니다,
MyStoreStory 팀
```

#### Day 1

```
제목: {name}님의 첫 메뉴를 추가해보세요 📝

앱을 만드셨나요? 멋져요! 👏

이제 메뉴를 추가할 차례입니다.

💡 팁:
- 인기 메뉴 5개부터 시작
- 메뉴 사진 추가하면 주문 30% ↑
- 옵션 설정으로 다양한 선택지

[메뉴 추가하기]

도움이 필요하면 비디오 가이드를 확인하세요:
[메뉴 추가 가이드 보기]
```

#### Day 3

```
제목: 첫 주문을 받아보세요! 🎊

안녕하세요 {name}님,

앱과 메뉴가 준비되었다면
이제 첫 주문을 받을 준비가 된 거예요!

📱 앱 공유 방법:
1. QR 코드 다운로드
2. 매장에 부착
3. SNS에 공유

[QR 코드 받기]

성공 사례: "첫 주에 15개 주문 받았어요!" - 카페 OO

화이팅!
```

#### Day 7

```
제목: 일주일 회고 & Pro 플랜 무료 체험 🎁

{name}님과 함께한 첫 주를 돌아봐요:

✅ 앱 생성
✅ 메뉴 {menuCount}개 추가
✅ 주문 {orderCount}개 받음

🎁 특별 혜택:
Pro 플랜 7일 무료 체험

Pro 플랜의 모든 기능을 무료로 사용해보세요:
- 고급 분석
- 포인트 시스템
- 프로모션 기능
- 우선 지원

[무료 체험 시작]
```

---

### 6. 진행률 추적

```typescript
// 온보딩 진행률 계산
const onboardingProgress = {
  signup: 10,
  emailVerify: 20,
  createApp: 40,
  addMenu: 60,
  customize: 80,
  share: 100
};

const currentProgress = calculateProgress(user);

<ProgressBar value={currentProgress}>
  {currentProgress}% 완료
</ProgressBar>
```

---

### 7. A/B 테스트

```typescript
// 온보딩 플로우 최적화
const variants = {
  A: {
    welcomeModal: true,
    guidedTour: true,
    emailSequence: 'standard'
  },
  B: {
    welcomeModal: false,
    guidedTour: false,
    emailSequence: 'aggressive'
  }
};

// 메트릭
const metrics = {
  completionRate: 0.65, // 65% 완료율
  timeToFirstApp: '12min', // 첫 앱까지 평균 시간
  retentionDay7: 0.45 // 7일 리텐션
};
```

IMPORTANT: 간단하고 명확한 플로우, 즉각적인 가치 제공, 지속적인 도움말
```

---

## 📝 다음: **101-TRAINING-MATERIALS.md**
