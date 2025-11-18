# 🚀 빠른 시작 가이드

MyStoreStory 프로젝트를 **30-40시간** 안에 완전히 재구축하는 가이드입니다.

---

## ⚡ 5분 안에 시작하기

### 1. 준비물 확인
- [ ] AI 도구 (Figma Make, ChatGPT, Claude 등)
- [ ] 텍스트 에디터 또는 IDE
- [ ] 기본적인 React/TypeScript 지식

### 2. 첫 프롬프트 실행

**복사해서 AI에게 붙여넣기:**

```
MyStoreStory라는 노코드 배달앱 빌더 웹 애플리케이션을 만들 것입니다.

## 프로젝트 개요
- 서비스명: MyStoreStory
- 목적: 배달 수수료 없는 자체 배달앱을 노코드로 구축
- 타겟: 소상공인 (카페, 레스토랑, 베이커리 등)
- 기술 스택: React, TypeScript, Tailwind CSS v4.0, ShadCN/UI

## 요구사항

1. App.tsx를 생성하되 단순한 "MyStoreStory - 준비 중" 메시지만 표시
2. 다음 디렉토리 구조를 생성:
   - /components (컴포넌트)
   - /pages (페이지 컴포넌트)
   - /types (TypeScript 타입)
   - /constants (상수)
   - /hooks (커스텀 훅)
   - /services (API 서비스)
   - /styles (스타일)

3. /styles/globals.css 생성:
   - Tailwind v4.0 기본 import
   - CSS 변수로 디자인 토큰 정의 (@layer base 내부):
     * --color-primary: 37 99 235 (Blue #2563eb)
     * --color-primary-foreground: 255 255 255
     * --color-secondary: 241 245 249 (Slate-100)
     * --color-secondary-foreground: 15 23 42 (Slate-900)
     * --color-accent: 16 185 129 (Emerald-500)
     * --color-destructive: 239 68 68 (Red-500)
     * --color-border: 226 232 240 (Slate-200)
     * --color-background: 255 255 255
     * --color-foreground: 15 23 42
     * --radius: 0.5rem
   - 기본 Typography 스타일 (h1-h6, p, a):
     * h1: 2.25rem / 700 / 2.5rem
     * h2: 1.875rem / 700 / 2.25rem
     * h3: 1.5rem / 600 / 2rem
     * h4: 1.25rem / 600 / 1.75rem
     * h5: 1.125rem / 600 / 1.75rem
     * h6: 1rem / 600 / 1.5rem
     * p: 1rem / 400 / 1.5rem
     * a: underline on hover

4. README.md 생성:
   - 프로젝트 소개
   - 기술 스택
   - 개발 가이드

IMPORTANT:
- Tailwind의 text-*, font-*, leading-* 클래스는 사용하지 마세요 (globals.css 기본 스타일 사용)
- 모든 컴포넌트는 함수형 + TypeScript
- Primary 컬러는 Blue #2563eb로 고정
```

### 3. 결과 확인

AI가 생성한 파일들을 확인:
- [ ] App.tsx
- [ ] styles/globals.css
- [ ] README.md
- [ ] 디렉토리 구조

### 4. 다음 단계

**01-PROJECT-INIT.md**의 STEP 2로 진행하세요!

---

## 📅 일정 계획

### Week 1 (Day 1-3): 기초 설정
**목표**: Phase 1-2 완료 (기초 + 핵심 페이지)

| 일차 | 작업 | 예상 시간 | 완료 |
|------|------|----------|------|
| Day 1 | Phase 1 (01-04) | 3시간 | [ ] |
| Day 2 | Phase 2 Part 1 (05-06) | 4시간 | [ ] |
| Day 3 | Phase 2 Part 2 (07-08) | 4시간 | [ ] |

**마일스톤**: 디자인 시스템 + 앱 빌더 기본 구조 완성

### Week 2 (Day 4-6): Admin & Store
**목표**: Phase 3-4 완료 (관리자 영역)

| 일차 | 작업 | 예상 시간 | 완료 |
|------|------|----------|------|
| Day 4 | Phase 3 (09-11) | 4시간 | [ ] |
| Day 5 | Phase 4 Part 1 (12-13) | 4시간 | [ ] |
| Day 6 | Phase 4 Part 2 (14-15) | 4시간 | [ ] |

**마일스톤**: Admin & Store Admin 대시보드 완성

### Week 3 (Day 7-9): Customer & Orders
**목표**: Phase 5-6 완료 (고객 앱 + 주문)

| 일차 | 작업 | 예상 시간 | 완료 |
|------|------|----------|------|
| Day 7 | Phase 5 (16-18) | 4시간 | [ ] |
| Day 8 | Phase 6 (19-21) | 3시간 | [ ] |
| Day 9 | 버퍼 (테스트 & 버그 수정) | 3시간 | [ ] |

**마일스톤**: 전체 주문 플로우 작동

### Week 4 (Day 10-12): 알림 & 고급
**목표**: Phase 7-8 완료 (알림 + 고급 기능)

| 일차 | 작업 | 예상 시간 | 완료 |
|------|------|----------|------|
| Day 10 | Phase 7 (22-25) | 5시간 | [ ] |
| Day 11 | Phase 8 Part 1 (26-28) | 4시간 | [ ] |
| Day 12 | Phase 8 Part 2 (29-30) | 4시간 | [ ] |

**마일스톤**: Cloud Functions + 실시간 시스템 작동

### Week 5 (Day 13-15): 테스팅 & 배포
**목표**: Phase 9 완료 (배포 준비)

| 일차 | 작업 | 예상 시간 | 완료 |
|------|------|----------|------|
| Day 13 | Phase 9 (31-33) | 3시간 | [ ] |
| Day 14 | 전체 테스트 & 버그 수정 | 4시간 | [ ] |
| Day 15 | 배포 & 문서화 | 3시간 | [ ] |

**마일스톤**: 프로덕션 배포 완료 🎉

---

## 🎯 체크포인트

각 Phase 완료 시 다음을 확인하세요:

### Phase 1 완료 ✅
- [ ] 디자인 시스템 페이지 접근 가능 (`?design-system`)
- [ ] 4가지 레이아웃 확인 가능 (`?layouts`)
- [ ] 28개 ShadCN 컴포넌트 작동
- [ ] 타입 오류 없음

### Phase 2 완료 ✅
- [ ] 랜딩 페이지 렌더링
- [ ] 로그인/회원가입 폼 작동
- [ ] 플랜 선택 UI 표시
- [ ] 앱 빌더 6단계 네비게이션

### Phase 3 완료 ✅
- [ ] Admin 대시보드 KPI 표시
- [ ] 사용자 관리 CRUD
- [ ] 스토어 관리 리스트
- [ ] 분석 차트 렌더링

### Phase 4 완료 ✅
- [ ] Store 대시보드 실시간 KPI
- [ ] 주문 리스트 필터링
- [ ] 메뉴 추가/편집/삭제
- [ ] 매출 분석 차트

### Phase 5 완료 ✅
- [ ] 고객 앱 하단 탭 네비게이션
- [ ] 메뉴 브라우징
- [ ] 장바구니 작동
- [ ] 체크아웃 프로세스

### Phase 6 완료 ✅
- [ ] 주문 생성 성공
- [ ] 주문 상태 변경 가능
- [ ] OrderTimeline 표시
- [ ] 실시간 업데이트 (Mock)

### Phase 7 완료 ✅
- [ ] Cloud Functions 빌드 성공
- [ ] Callable Functions 3개
- [ ] Queue Functions 1개
- [ ] Trigger Functions 2개

### Phase 8 완료 ✅
- [ ] 플랜별 앱 미리보기
- [ ] 실시간 대시보드
- [ ] API 통합 시스템
- [ ] 반응형 확인

### Phase 9 완료 ✅
- [ ] 배포 스크립트 작동
- [ ] 스모크 테스트 통과
- [ ] 문서 완성
- [ ] 배포 성공

---

## 💡 프로 팁

### 시간 절약 팁
1. **한 번에 하나씩**: 여러 STEP을 동시에 하지 마세요
2. **검증 먼저**: 다음 단계로 넘어가기 전 검증 체크리스트 완료
3. **백업 자주**: 각 Phase 완료 후 Git commit
4. **문서 참고**: FAQ를 먼저 읽으세요

### 자주 하는 실수
❌ **순서 무시**: 01번부터 순서대로 하지 않음  
✅ **해결**: 반드시 순차적으로 진행

❌ **검증 생략**: 체크리스트 확인 안 함  
✅ **해결**: 각 STEP 후 반드시 검증

❌ **타입 오류 방치**: TypeScript 에러 무시  
✅ **해결**: 즉시 해결 후 진행

❌ **문서 안 읽기**: FAQ 무시  
✅ **해결**: 문제 생기면 FAQ 먼저 확인

### 효율적인 작업 흐름
```
1. 프롬프트 읽기 (2분)
   ↓
2. AI에게 프롬프트 전달 (1분)
   ↓
3. 코드 생성 대기 (2-5분)
   ↓
4. 결과 확인 (3분)
   ↓
5. 검증 체크리스트 (5분)
   ↓
6. 문제 있으면 수정, 없으면 다음 STEP
```

---

## 🆘 문제 해결

### 에러 발생 시

**Step 1**: 검증 체크리스트 확인
```
각 STEP의 "검증 체크리스트" 모두 완료했나요?
```

**Step 2**: 이전 단계 확인
```
이전 STEP에서 생성된 파일이 모두 있나요?
```

**Step 3**: 프롬프트 재실행
```
프롬프트를 정확히 복사했나요?
AI에게 다시 전달해보세요.
```

**Step 4**: FAQ 확인
```
해당 프롬프트 파일의 FAQ 섹션을 확인하세요.
```

### 자주 묻는 질문

**Q: 한 번에 여러 STEP을 해도 되나요?**  
A: 안 됩니다. 각 STEP은 독립적이며 검증이 필요합니다.

**Q: 프롬프트를 수정해도 되나요?**  
A: 네, 프로젝트에 맞게 커스터마이징 가능합니다.

**Q: 순서를 바꿔도 되나요?**  
A: 안 됩니다. 이전 단계의 코드를 다음 단계에서 사용합니다.

**Q: 일부만 구현하고 싶어요**  
A: 가능하지만 Phase 1은 필수입니다.

---

## 📞 지원 & 리소스

### 프롬프트 파일
- **00-INDEX.md**: 전체 개요
- **PROMPT-SUMMARY.md**: 요약
- **README.md**: 상세 가이드
- **01-33 파일들**: 실제 프롬프트

### 프로젝트 문서
- **T14-FINAL-REPORT.md**: 현재 상태
- **T14-GO-CHECKLIST.md**: 배포 체크리스트
- **TESTING-GUIDE.md**: 테스팅 가이드

### 외부 리소스
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com)
- [Firebase Docs](https://firebase.google.com/docs)

---

## 🎉 시작하기

준비되셨나요? **01-PROJECT-INIT.md**를 열어서 첫 번째 프롬프트를 실행하세요!

```bash
# 프롬프트 확인
cat prompts/01-PROJECT-INIT.md

# 또는 브라우저에서
open prompts/01-PROJECT-INIT.md
```

**행운을 빕니다! 🚀**

---

**Version**: 1.0.0  
**Last Updated**: 2025-10-31  
**Estimated Time**: 30-40 hours  
**Difficulty**: ⭐⭐⭐ (Intermediate)
