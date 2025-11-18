# 108 - Go-Live Checklist

## 📌 목표
최종 Go-Live 체크리스트를 작성합니다.

**결과물**: 최종 체크리스트, 승인 문서

---

## 프롬프트

```
MyStoreStory를 프로덕션 환경에 배포하기 위한 최종 체크리스트입니다.

## 🚦 Go-Live Checklist

### Phase 1: 배포 전 최종 확인 (D-1)

#### 코드 & 빌드
- [✓] 모든 코드 리뷰 완료
- [✓] 모든 테스트 통과 (Unit, E2E)
- [✓] 프로덕션 빌드 성공
- [✓] Bundle 크기 확인 (< 1.5 MB)
- [✓] Lighthouse 점수 90+

#### 인프라
- [✓] Firebase Production 프로젝트
- [✓] Firestore 인덱스 배포
- [✓] Security Rules 배포
- [✓] Cloud Functions 배포
- [✓] 도메인 & SSL 설정

#### 환경 변수
- [✓] Production 환경 변수 설정
- [✓] API 키 확인
- [✓] Secrets 설정 (Cloud Functions)

#### 백업
- [✓] Database 백업
- [✓] 코드 백업 (Git tag)
- [✓] 설정 백업

---

### Phase 2: 배포 (D-Day)

#### 배포 실행
```bash
# 1. 최종 확인
git status
git log -1

# 2. Production 배포
firebase use production
./scripts/deploy.sh --production

# 3. 배포 확인
firebase hosting:sites:list
firebase functions:list
```

#### 체크리스트
- [ ] Hosting 배포 완료
- [ ] Functions 배포 완료
- [ ] DNS 전파 확인
- [ ] SSL 인증서 활성화

---

### Phase 3: 검증 (D-Day +30min)

#### Smoke Tests
- [ ] 홈페이지 접근 (mystorestory.com)
- [ ] 로그인/회원가입
- [ ] 앱 빌더 (6 Steps)
- [ ] 주문 생성
- [ ] 결제 테스트
- [ ] 알림 전송

#### 성능
- [ ] Lighthouse 점수 확인
- [ ] 페이지 로드 < 3s
- [ ] API 응답 < 1s

#### 모니터링
- [ ] Firebase Performance
- [ ] Google Analytics
- [ ] Error Tracking
- [ ] Cloud Monitoring

---

### Phase 4: 공지 (D-Day +1h)

#### 대외 공지
- [ ] 공식 웹사이트
- [ ] 소셜 미디어 (Twitter, Facebook)
- [ ] 프레스 릴리즈
- [ ] 뉴스레터

#### 내부 공지
- [ ] 팀 전체 이메일
- [ ] Slack 공지
- [ ] 파트너사 통보

---

### Phase 5: 모니터링 (D-Day ~ D+7)

#### 24시간 모니터링
- [ ] 트래픽 모니터링
- [ ] 에러율 < 1%
- [ ] 응답 시간 < 2s
- [ ] 사용자 피드백 수집

#### 일일 리포트
- [ ] 방문자 수
- [ ] 회원가입 수
- [ ] 앱 생성 수
- [ ] 주문 수
- [ ] 주요 이슈

---

### 롤백 계획

#### 롤백 조건
- 에러율 > 5%
- 서비스 다운 > 5분
- Critical 버그 발견
- 보안 이슈

#### 롤백 절차
```bash
# 1. 이전 버전 확인
firebase hosting:releases

# 2. 롤백 실행
firebase hosting:rollback

# 3. 검증
npm run test:smoke

# 4. 공지
# 팀, 사용자에게 알림
```

---

### 최종 승인

#### 승인 서명

```
기술 리더: ________________  날짜: __________
제품 매니저: ______________  날짜: __________
CEO: _____________________  날짜: __________

Go-Live 승인: ✅
```

---

IMPORTANT: 모든 체크리스트 완료, 백업 완료, 롤백 준비, 팀 대기
```

---

## 📝 마지막: **109-POST-LAUNCH-MONITORING.md**
