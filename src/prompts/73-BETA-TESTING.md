# 73 - Beta Testing & Staging

## 📌 목표
베타 테스트 및 스테이징 환경을 구축합니다.

**결과물**:
- 스테이징 환경
- 베타 프로그램
- 테스트 가이드
- 피드백 수집

**총 개념 정리**

---

## 🔄 STEP 1: 스테이징 환경 설정

### 프롬프트 템플릿

```
베타 테스트 및 스테이징 환경을 구축합니다.

## 1. Firebase 스테이징 프로젝트

### 프로젝트 생성

Firebase Console:
1. "프로젝트 추가": `mystorestory-staging`
2. 앱 등록: 웹 앱
3. Firebase SDK 설정 복사

### .firebaserc 설정

```json
{
  "projects": {
    "default": "mystorestory-prod",
    "staging": "mystorestory-staging",
    "development": "mystorestory-dev"
  }
}
```

프로젝트 전환:

```bash
# 스테이징으로 전환
firebase use staging

# 현재 프로젝트 확인
firebase use
```

## 2. 환경별 설정

### .env.staging

```bash
VITE_FIREBASE_API_KEY=staging_api_key
VITE_FIREBASE_AUTH_DOMAIN=mystorestory-staging.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mystorestory-staging

# 스테이징 플래그
VITE_IS_STAGING=true
VITE_SHOW_DEBUG=true
```

### 빌드 & 배포

```bash
# 스테이징 빌드
npm run build:staging

# 스테이징 배포
firebase use staging
firebase deploy
```

## 3. 베타 프로그램 관리

components/beta/BetaSignup.tsx:

```typescript
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { toast } from 'sonner@2.0.3';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase-config';

export function BetaSignup() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [experience, setExperience] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreed) {
      toast.error('베타 테스트 약관에 동의해주세요');
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, 'beta_testers'), {
        email,
        name,
        experience,
        status: 'pending',
        createdAt: Date.now()
      });

      toast.success('베타 테스터 신청이 완료되었습니다!');
      
      // 이메일 발송
      await sendWelcomeEmail(email, name);
      
      setEmail('');
      setName('');
      setExperience('');
      setAgreed(false);
    } catch (error) {
      toast.error('신청에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <Label>이름</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <Label>이메일</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <Label>배달앱 운영 경험</Label>
        <select
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="w-full border rounded p-2"
          required
        >
          <option value="">선택하세요</option>
          <option value="none">없음</option>
          <option value="beginner">초급 (1년 미만)</option>
          <option value="intermediate">중급 (1-3년)</option>
          <option value="advanced">고급 (3년 이상)</option>
        </select>
      </div>

      <div className="flex items-start gap-2">
        <Checkbox
          checked={agreed}
          onCheckedChange={setAgreed}
        />
        <label className="text-sm">
          베타 테스트 약관 및 개인정보 수집에 동의합니다
        </label>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? '신청중...' : '베타 테스터 신청'}
      </Button>
    </form>
  );
}
```

## 4. 베타 테스터 관리 대시보드

pages/admin/beta-testers.tsx:

```typescript
import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

export function BetaTestersDashboard() {
  const [testers, setTesters] = useState([]);

  useEffect(() => {
    loadTesters();
  }, []);

  const loadTesters = async () => {
    const q = query(
      collection(db, 'beta_testers'),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setTesters(data);
  };

  const approveTester = async (testerId: string) => {
    await updateDoc(doc(db, 'beta_testers', testerId), {
      status: 'approved',
      approvedAt: Date.now()
    });

    // 승인 이메일 발송
    const tester = testers.find(t => t.id === testerId);
    await sendApprovalEmail(tester.email, tester.name);

    loadTesters();
    toast.success('베타 테스터가 승인되었습니다');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">베타 테스터 관리</h1>
        <div className="flex gap-2">
          <Badge>대기: {testers.filter(t => t.status === 'pending').length}</Badge>
          <Badge className="bg-green-100 text-green-700">
            승인: {testers.filter(t => t.status === 'approved').length}
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        {testers.map((tester) => (
          <Card key={tester.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{tester.name}</h3>
                    <Badge className={
                      tester.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }>
                      {tester.status === 'approved' ? '승인됨' : '대기중'}
                    </Badge>
                  </div>
                  <p className="text-gray-600">{tester.email}</p>
                  <p className="text-sm text-gray-500">
                    경험: {tester.experience}
                  </p>
                  <p className="text-xs text-gray-400">
                    신청일: {new Date(tester.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {tester.status === 'pending' && (
                  <Button
                    onClick={() => approveTester(tester.id)}
                    size="sm"
                  >
                    승인
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

## 5. 베타 배지

components/beta/BetaBadge.tsx:

```typescript
export function BetaBadge() {
  if (!import.meta.env.VITE_IS_STAGING) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-orange-500 text-white text-center py-2 z-50">
      ⚠️ 베타 버전입니다. 피드백을 남겨주세요!
    </div>
  );
}

// App.tsx에서 사용
function App() {
  return (
    <div>
      <BetaBadge />
      {/* 나머지 앱 */}
    </div>
  );
}
```

## 6. 테스트 가이드

docs/BETA-TESTING-GUIDE.md:

```markdown
# 베타 테스트 가이드

## 환영합니다!

MyStoreStory 베타 테스터가 되어주셔서 감사합니다.

## 테스트 환경

- **URL**: https://mystorestory-staging.web.app
- **테스트 계정**: beta@test.com / beta1234
- **테스트 기간**: 2024-11-01 ~ 2024-11-30

## 테스트 시나리오

### 1. 회원가입 & 로그인
- [ ] 이메일로 회원가입
- [ ] 로그인
- [ ] 로그아웃

### 2. 앱 빌더
- [ ] 새 앱 만들기
- [ ] 기능 선택
- [ ] 플랜 선택
- [ ] 앱 생성 완료

### 3. 상점 관리
- [ ] 대시보드 확인
- [ ] 메뉴 추가
- [ ] 주문 관리
- [ ] 고객 관리

### 4. 고객 앱
- [ ] 메뉴 탐색
- [ ] 장바구니 추가
- [ ] 주문하기
- [ ] 주문 추적

## 피드백 방법

### 1. 버그 리포트
- 우측 하단 피드백 버튼 클릭
- "버그 리포트" 선택
- 상세 설명 작성

### 2. 기능 요청
- 피드백 버튼 > "기능 요청"
- 원하는 기능 설명

### 3. 일반 의견
- 피드백 버튼 > "일반 피드백"
- 자유롭게 작성

## 주의사항

- 베타 버전이므로 데이터가 삭제될 수 있습니다
- 실제 결제를 하지 마세요 (테스트 모드)
- 개인정보를 공유하지 마세요

## 보상

베타 테스트 참여자 전원에게:
- Pro 플랜 3개월 무료
- 특별 할인 쿠폰
- 베타 테스터 전용 기능 조기 접근

## 문의

support@mystorestory.com
```

## 7. 베타 피드백 수집

자동으로 수집되는 정보:
- 페이지 방문 기록
- 에러 로그
- 성능 메트릭
- 기능 사용 빈도

수동 피드백:
- 피드백 폼
- 설문조사
- 인터뷰

## 8. 스테이징 배포 체크리스트

```markdown
### 배포 전
- [ ] 로컬 테스트 완료
- [ ] 코드 리뷰 완료
- [ ] 테스트 작성 완료

### 배포
- [ ] staging 브랜치로 머지
- [ ] CI/CD 자동 배포
- [ ] 배포 완료 확인

### 배포 후
- [ ] 스모크 테스트
- [ ] 베타 테스터에게 알림
- [ ] 모니터링 확인
```

## 9. 베타 기간 관리

utils/betaAccess.ts:

```typescript
export function isBetaPeriod(): boolean {
  const now = Date.now();
  const betaStart = new Date('2024-11-01').getTime();
  const betaEnd = new Date('2024-11-30').getTime();
  
  return now >= betaStart && now <= betaEnd;
}

export function checkBetaAccess(user: User): boolean {
  // 베타 테스터 확인
  if (user.betaTester) return true;
  
  // 베타 기간 확인
  if (!isBetaPeriod()) return false;
  
  // 베타 코드 확인
  if (user.betaCode) return true;
  
  return false;
}

// 사용
function App() {
  const { user } = useAuth();
  
  if (!checkBetaAccess(user)) {
    return <BetaAccessDenied />;
  }
  
  return <MainApp />;
}
```

IMPORTANT:
- 스테이징 환경 (별도 Firebase 프로젝트)
- 베타 테스터 신청 폼
- 베타 관리 대시보드
- 테스트 가이드
- 피드백 수집
- 베타 배지
- 접근 제어
```

---

## 📝 핵심 포인트

### 스테이징 vs 프로덕션
- **Staging**: 베타 테스트, 실험적 기능
- **Production**: 안정적인 버전

### 베타 프로그램 단계
1. **모집**: 베타 테스터 신청
2. **선발**: 적합한 테스터 승인
3. **테스트**: 가이드에 따라 테스트
4. **피드백**: 버그, 의견 수집
5. **개선**: 피드백 반영

---

## ✅ 완료 체크리스트

- [ ] 스테이징 환경
- [ ] 베타 신청 폼
- [ ] 베타 관리 대시보드
- [ ] 테스트 가이드
- [ ] 피드백 수집

---

## 📝 다음 단계

**74-DOCUMENTATION-SYSTEM.md**로 이동합니다.
