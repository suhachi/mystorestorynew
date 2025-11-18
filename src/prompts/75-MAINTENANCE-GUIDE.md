# 75 - Maintenance & Operations Guide

## 📌 목표
프로덕션 운영 및 유지보수 가이드를 정리합니다.

**결과물**:
- 일상 운영 가이드
- 정기 점검 항목
- 업데이트 절차
- 긴급 대응

**총 운영 가이드**

---

## 🔄 STEP 1: 일상 운영

### 프롬프트 템플릿

```
프로덕션 환경의 일상 운영 및 유지보수 가이드입니다.

## 🛠️ Maintenance & Operations Guide

### 1. 일일 점검 (Daily) ☀️

#### A. 시스템 상태 확인

```bash
# Firebase Console 확인
# - Hosting: 정상 작동 확인
# - Functions: 에러율 < 1%
# - Firestore: 읽기/쓰기 정상
# - Authentication: 로그인 성공률

# Cloud Monitoring 확인
https://console.cloud.google.com/monitoring
```

#### B. 에러 로그 확인

```bash
# Cloud Logging에서 ERROR 로그 확인
severity >= ERROR
timestamp >= "today"

# 주요 Functions 로그
firebase functions:log --only setOrderStatus
firebase functions:log --only historyNotify
```

#### C. 성능 메트릭

```bash
# Firebase Performance Monitoring
# - 페이지 로드 시간: < 3s
# - API 응답 시간: < 1s
# - 에러율: < 1%
```

#### D. 사용자 피드백

```bash
# 고객 문의 확인
# - 이메일
# - Slack 채널
# - 소셜 미디어
```

### 2. 주간 점검 (Weekly) 📅

#### A. 백업 확인

```bash
# 백업 목록 확인
gsutil ls gs://mystorestory-backup/

# 최신 백업 날짜 확인
gsutil ls -l gs://mystorestory-backup/ | tail -n 5

# 백업 크기 확인
du -sh gs://mystorestory-backup/
```

#### B. 보안 업데이트

```bash
# npm 취약점 확인
npm audit

# 고위험 취약점 수정
npm audit fix

# 의존성 업데이트 확인
npm outdated
```

#### C. 데이터베이스 정리

```bash
# 오래된 로그 삭제 (30일 이상)
# 임시 데이터 정리
# 삭제된 문서 정리
```

#### D. 성능 리포트

```bash
# Lighthouse 스코어 확인
npm run lighthouse

# 번들 크기 확인
npm run build
du -sh dist/

# Web Vitals 확인
# - LCP < 2.5s
# - FID < 100ms
# - CLS < 0.1
```

### 3. 월간 점검 (Monthly) 📊

#### A. 종합 분석

```bash
# Google Analytics 리포트
# - 사용자 수
# - 페이지뷰
# - 전환율
# - 이탈률

# Firebase Analytics
# - 활성 사용자
# - 이벤트 추적
# - 사용자 행동
```

#### B. 비용 최적화

```bash
# Firebase 비용 확인
https://console.firebase.google.com/u/0/project/_/usage

# 주요 비용 항목:
# - Firestore 읽기/쓰기
# - Functions 실행 시간
# - Hosting 대역폭
# - Storage 용량

# 최적화 방안:
# - 불필요한 쿼리 제거
# - 캐싱 전략 개선
# - 이미지 최적화
```

#### C. 용량 관리

```bash
# Firestore 용량
# - 총 문서 수
# - 컬렉션별 크기
# - 증가 추세

# Storage 용량
# - 이미지 파일
# - 백업 파일
# - 로그 파일
```

#### D. 보안 감사

```bash
# Security Rules 검토
firebase deploy --only firestore:rules --dry-run

# 권한 관리
# - Firebase Console → IAM
# - 불필요한 권한 제거
# - 최소 권한 원칙

# API 키 로테이션
# - 주요 API 키 갱신
# - Secrets 업데이트
```

### 4. 업데이트 절차 🔄

#### A. 의존성 업데이트

```bash
# 1. 브랜치 생성
git checkout -b chore/update-dependencies

# 2. 의존성 확인
npm outdated

# 3. 주요 패키지 업데이트
npm update

# 4. 메이저 버전 업데이트 (주의)
npm install react@latest
npm install firebase@latest

# 5. 테스트
npm test
npm run build

# 6. PR 생성
git commit -m "chore: 의존성 업데이트"
git push origin chore/update-dependencies
```

#### B. Firebase SDK 업데이트

```bash
# 1. 현재 버전 확인
npm list firebase

# 2. 최신 버전 확인
npm info firebase version

# 3. 업데이트
npm install firebase@latest

# 4. Breaking Changes 확인
# Firebase Release Notes 참조

# 5. 코드 수정 (필요시)
# 6. 테스트
# 7. 스테이징 배포
# 8. 프로덕션 배포
```

#### C. Node.js 버전 업그레이드

```bash
# 1. LTS 버전 확인
https://nodejs.org/

# 2. 로컬 업그레이드
nvm install 20
nvm use 20

# 3. Functions runtime 업데이트
# functions/package.json
{
  "engines": {
    "node": "20"
  }
}

# 4. CI/CD 업데이트
# .github/workflows/*.yml
- uses: actions/setup-node@v4
  with:
    node-version: '20'

# 5. 테스트 및 배포
```

### 5. 긴급 대응 🚨

#### A. 서비스 다운

```bash
# 1. 상태 확인
# Firebase Status: https://status.firebase.google.com/
# Cloud Status: https://status.cloud.google.com/

# 2. 로그 확인
firebase functions:log --lines 100

# 3. 롤백 (필요시)
firebase hosting:rollback

# 4. 팀 알림
# Slack: #incidents
```

#### B. 보안 사고

```bash
# 1. 즉시 조치
# - 의심되는 계정 비활성화
# - API 키 로테이션
# - Security Rules 강화

# 2. 영향 범위 파악
# - 접근 로그 확인
# - 변경된 데이터 확인
# - 유출 가능성 평가

# 3. 복구
# - 백업에서 복원
# - 비밀번호 재설정
# - 사용자 알림

# 4. 사후 조치
# - 보안 강화
# - 문서화
# - 재발 방지
```

#### C. 성능 저하

```bash
# 1. 원인 파악
# - Cloud Monitoring 확인
# - Functions 타임아웃
# - Firestore 쿼리 느림
# - 네트워크 이슈

# 2. 임시 조치
# - 캐시 증가
# - Rate Limiting
# - 리소스 스케일업

# 3. 근본 해결
# - 코드 최적화
# - 인덱스 추가
# - 쿼리 개선
```

### 6. 모니터링 대시보드 📈

#### A. 실시간 메트릭

```typescript
// /pages/admin/operations-dashboard.tsx
function OperationsDashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">운영 대시보드</h1>
      
      {/* 시스템 상태 */}
      <Card>
        <CardHeader>
          <CardTitle>시스템 상태</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <StatusIndicator 
              label="Hosting" 
              status="healthy" 
            />
            <StatusIndicator 
              label="Functions" 
              status="healthy" 
            />
            <StatusIndicator 
              label="Firestore" 
              status="healthy" 
            />
            <StatusIndicator 
              label="Auth" 
              status="healthy" 
            />
          </div>
        </CardContent>
      </Card>
      
      {/* 주요 메트릭 */}
      <Card>
        <CardHeader>
          <CardTitle>주요 메트릭 (24시간)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <MetricCard 
              label="활성 사용자" 
              value="1,234" 
              change="+12%" 
            />
            <MetricCard 
              label="총 주문" 
              value="567" 
              change="+8%" 
            />
            <MetricCard 
              label="에러율" 
              value="0.3%" 
              change="-0.2%" 
            />
            <MetricCard 
              label="응답시간" 
              value="850ms" 
              change="-50ms" 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

### 7. 백업 & 복구 전략 💾

#### A. 백업 종류

```bash
# 1. 자동 백업 (매일 새벽 3시)
# Cloud Scheduler + Cloud Functions

# 2. 수동 백업 (배포 전)
./scripts/backup-firestore.sh

# 3. 이미지 백업
# Cloud Storage 자동 버전 관리
```

#### B. 복구 테스트

```bash
# 월 1회 복구 테스트 (스테이징)
# 1. 최신 백업 선택
# 2. 스테이징 환경에 복원
# 3. 데이터 무결성 확인
# 4. 기능 테스트
```

### 8. 운영 체크리스트 📋

#### 일일 (Daily)
- [ ] 에러 로그 확인
- [ ] 성능 메트릭 확인
- [ ] 고객 문의 응대

#### 주간 (Weekly)
- [ ] 백업 확인
- [ ] 보안 업데이트
- [ ] 성능 리포트

#### 월간 (Monthly)
- [ ] 종합 분석 리포트
- [ ] 비용 최적화
- [ ] 보안 감사
- [ ] 복구 테스트

#### 분기 (Quarterly)
- [ ] 대규모 리팩토링
- [ ] 아키텍처 리뷰
- [ ] 용량 계획
- [ ] 팀 회고

### 9. 연락처 & 에스컬레이션 📞

#### A. 온콜 담당

```yaml
주중 (월-금):
  - 1차: 개발팀 리더
  - 2차: CTO
  
주말:
  - 1차: 온콜 개발자
  - 2차: 개발팀 리더

긴급 연락처:
  - Slack: #incidents
  - 전화: 010-xxxx-xxxx
```

#### B. 에스컬레이션 기준

```yaml
Level 1 (경미):
  - 에러율 1-5%
  - 응답시간 > 3s
  - 담당: 개발자
  - 대응: 24시간 내

Level 2 (중요):
  - 에러율 5-10%
  - 일부 기능 장애
  - 담당: 팀 리더
  - 대응: 4시간 내

Level 3 (심각):
  - 에러율 > 10%
  - 서비스 다운
  - 보안 사고
  - 담당: CTO
  - 대응: 즉시
```

### 10. 문서화 📝

#### A. 운영 일지

```markdown
## 2024-11-01

### 이슈
- 13:30 Functions 타임아웃 발생
- 영향: setOrderStatus 함수
- 원인: Firestore 쿼리 최적화 필요

### 조치
- 인덱스 추가
- 쿼리 최적화
- 타임아웃 증가 (60s → 120s)

### 결과
- 14:00 정상화
- 에러율 0.5% → 0.1%
```

#### B. 변경 기록

```markdown
## Changelog

### 2024-11-01
- feat: 메뉴 카테고리 필터링 추가
- fix: 주문 상태 업데이트 오류 수정
- chore: Firebase SDK 업데이트 (v10.7.0 → v10.8.0)
```

IMPORTANT:
- 일일/주간/월간 점검
- 백업 & 복구 테스트
- 보안 업데이트
- 성능 모니터링
- 긴급 대응 계획
- 문서화
```

---

## 📝 핵심 포인트

### 운영 철학
1. **예방**: 문제 발생 전 감지
2. **신속**: 빠른 대응
3. **투명**: 상황 공유
4. **개선**: 재발 방지

### 모니터링 지표
- **가용성**: 99.9% 이상
- **에러율**: < 1%
- **응답시간**: < 2s
- **고객 만족도**: > 4.5/5

---

## ✅ 완료 체크리스트

- [ ] 일일 점검 루틴
- [ ] 주간 점검 루틴
- [ ] 월간 점검 루틴
- [ ] 긴급 대응 계획
- [ ] 백업 & 복구
- [ ] 문서화

---

## 🎉 10개 완료!

**66-75번 프롬프트 완성!**

현재 **80개 프롬프트 완성** (73%)

---

## 📝 다음 10개 (76-85번) 계획

- User Documentation
- Developer Documentation
- API Reference
- Component Library Docs
- Deployment Guide
- Best Practices
- FAQ
- Migration Guide
- Style Guide
- Contributing Guide
