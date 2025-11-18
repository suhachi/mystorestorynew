# 72 - A/B Testing

## 📌 목표
A/B 테스트 시스템을 구축합니다.

**결과물**:
- Feature Flags
- A/B 테스트 컴포넌트
- 실험 추적
- 결과 분석

**총 개념 정리**

---

## 🔄 STEP 1: Feature Flags

### 프롬프트 템플릿

```
A/B 테스트와 Feature Flags 시스템을 구축합니다.

## 1. Feature Flags 시스템

utils/featureFlags.ts:

```typescript
interface FeatureFlags {
  newDashboard: boolean;
  advancedAnalytics: boolean;
  socialLogin: boolean;
  darkMode: boolean;
}

// Firebase Remote Config 또는 하드코딩
const defaultFlags: FeatureFlags = {
  newDashboard: false,
  advancedAnalytics: true,
  socialLogin: false,
  darkMode: false
};

export function useFeatureFlag(flagName: keyof FeatureFlags): boolean {
  const [enabled, setEnabled] = useState(defaultFlags[flagName]);

  useEffect(() => {
    // Firebase Remote Config에서 가져오기
    // const value = await getValue(flagName);
    // setEnabled(value);
  }, [flagName]);

  return enabled;
}

// 사용
function Dashboard() {
  const showNewDashboard = useFeatureFlag('newDashboard');

  return (
    <div>
      {showNewDashboard ? (
        <NewDashboard />
      ) : (
        <OldDashboard />
      )}
    </div>
  );
}
```

## 2. Firebase Remote Config

firebase-config.ts에 추가:

```typescript
import { getRemoteConfig, getValue, fetchAndActivate } from 'firebase/remote-config';

const remoteConfig = getRemoteConfig(app);

// 기본값 설정
remoteConfig.defaultConfig = {
  new_dashboard: false,
  advanced_analytics: false,
  social_login: false
};

// 개발 환경에서는 캐시 최소화
if (import.meta.env.DEV) {
  remoteConfig.settings.minimumFetchIntervalMillis = 0;
}

// Remote Config 가져오기
export async function initRemoteConfig() {
  try {
    await fetchAndActivate(remoteConfig);
    console.log('Remote Config activated');
  } catch (error) {
    console.error('Remote Config failed:', error);
  }
}

// Feature Flag 값 가져오기
export function getFeatureFlag(key: string): boolean {
  const value = getValue(remoteConfig, key);
  return value.asBoolean();
}
```

## 3. A/B 테스트 컴포넌트

components/experiments/ABTest.tsx:

```typescript
import { useState, useEffect } from 'react';

interface ABTestProps {
  experimentName: string;
  variantA: React.ReactNode;
  variantB: React.ReactNode;
  onImpression?: (variant: 'A' | 'B') => void;
}

export function ABTest({ 
  experimentName, 
  variantA, 
  variantB,
  onImpression 
}: ABTestProps) {
  const [variant, setVariant] = useState<'A' | 'B' | null>(null);

  useEffect(() => {
    // 사용자에게 변형 할당
    const assignedVariant = getAssignedVariant(experimentName);
    setVariant(assignedVariant);

    // 노출 추적
    if (onImpression) {
      onImpression(assignedVariant);
    }

    // Analytics 이벤트
    analytics.event('experiment_impression', {
      experiment_name: experimentName,
      variant: assignedVariant
    });
  }, [experimentName]);

  if (!variant) return null;

  return variant === 'A' ? <>{variantA}</> : <>{variantB}</>;
}

// 변형 할당 (사용자별 일관성 유지)
function getAssignedVariant(experimentName: string): 'A' | 'B' {
  const userId = getCurrentUserId() || getSessionId();
  const hash = hashCode(userId + experimentName);
  
  // 50/50 분할
  return hash % 2 === 0 ? 'A' : 'B';
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}
```

## 4. 실험 추적

utils/experimentTracking.ts:

```typescript
interface ExperimentEvent {
  experimentName: string;
  variant: 'A' | 'B';
  eventType: 'impression' | 'click' | 'conversion';
  userId?: string;
  timestamp: number;
}

export function trackExperimentImpression(
  experimentName: string,
  variant: 'A' | 'B'
) {
  const event: ExperimentEvent = {
    experimentName,
    variant,
    eventType: 'impression',
    userId: getCurrentUserId(),
    timestamp: Date.now()
  };

  // Firestore에 저장
  addDoc(collection(db, 'experiments'), event);

  // Google Analytics
  analytics.event('experiment_impression', {
    experiment_name: experimentName,
    variant: variant
  });
}

export function trackExperimentClick(
  experimentName: string,
  variant: 'A' | 'B',
  elementId: string
) {
  const event: ExperimentEvent = {
    experimentName,
    variant,
    eventType: 'click',
    userId: getCurrentUserId(),
    timestamp: Date.now()
  };

  addDoc(collection(db, 'experiments'), event);

  analytics.event('experiment_click', {
    experiment_name: experimentName,
    variant: variant,
    element_id: elementId
  });
}

export function trackExperimentConversion(
  experimentName: string,
  variant: 'A' | 'B'
) {
  const event: ExperimentEvent = {
    experimentName,
    variant,
    eventType: 'conversion',
    userId: getCurrentUserId(),
    timestamp: Date.now()
  };

  addDoc(collection(db, 'experiments'), event);

  analytics.event('experiment_conversion', {
    experiment_name: experimentName,
    variant: variant
  });
}
```

## 5. 실험 예시

### CTA 버튼 테스트

```typescript
function PricingPage() {
  return (
    <div>
      <h1>가격 플랜</h1>
      
      <ABTest
        experimentName="cta_button_text"
        variantA={
          <Button 
            onClick={handleSignup}
            onClickCapture={() => trackExperimentClick('cta_button_text', 'A', 'signup_button')}
          >
            지금 시작하기
          </Button>
        }
        variantB={
          <Button 
            onClick={handleSignup}
            onClickCapture={() => trackExperimentClick('cta_button_text', 'B', 'signup_button')}
          >
            무료로 체험하기
          </Button>
        }
        onImpression={(variant) => trackExperimentImpression('cta_button_text', variant)}
      />
    </div>
  );
}
```

### 대시보드 레이아웃 테스트

```typescript
function Dashboard() {
  return (
    <ABTest
      experimentName="dashboard_layout"
      variantA={<CompactDashboard />}
      variantB={<DetailedDashboard />}
      onImpression={(variant) => trackExperimentImpression('dashboard_layout', variant)}
    />
  );
}
```

## 6. 실험 결과 분석

pages/admin/experiments-dashboard.tsx:

```typescript
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase-config';

interface ExperimentResult {
  variant: 'A' | 'B';
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  conversionRate: number;
}

export function ExperimentsDashboard() {
  const [experiments, setExperiments] = useState<string[]>([]);
  const [selectedExperiment, setSelectedExperiment] = useState('');
  const [results, setResults] = useState<{A: ExperimentResult, B: ExperimentResult} | null>(null);

  useEffect(() => {
    loadExperiments();
  }, []);

  useEffect(() => {
    if (selectedExperiment) {
      loadResults(selectedExperiment);
    }
  }, [selectedExperiment]);

  const loadExperiments = async () => {
    // 실험 목록 가져오기
    const snapshot = await getDocs(collection(db, 'experiments'));
    const uniqueExperiments = [...new Set(snapshot.docs.map(doc => doc.data().experimentName))];
    setExperiments(uniqueExperiments);
  };

  const loadResults = async (experimentName: string) => {
    // A 변형 결과
    const aImpressions = await countEvents(experimentName, 'A', 'impression');
    const aClicks = await countEvents(experimentName, 'A', 'click');
    const aConversions = await countEvents(experimentName, 'A', 'conversion');

    // B 변형 결과
    const bImpressions = await countEvents(experimentName, 'B', 'impression');
    const bClicks = await countEvents(experimentName, 'B', 'click');
    const bConversions = await countEvents(experimentName, 'B', 'conversion');

    setResults({
      A: {
        variant: 'A',
        impressions: aImpressions,
        clicks: aClicks,
        conversions: aConversions,
        ctr: (aClicks / aImpressions) * 100,
        conversionRate: (aConversions / aImpressions) * 100
      },
      B: {
        variant: 'B',
        impressions: bImpressions,
        clicks: bClicks,
        conversions: bConversions,
        ctr: (bClicks / bImpressions) * 100,
        conversionRate: (bConversions / bImpressions) * 100
      }
    });
  };

  const countEvents = async (
    experimentName: string,
    variant: 'A' | 'B',
    eventType: string
  ): Promise<number> => {
    const q = query(
      collection(db, 'experiments'),
      where('experimentName', '==', experimentName),
      where('variant', '==', variant),
      where('eventType', '==', eventType)
    );
    const snapshot = await getDocs(q);
    return snapshot.size;
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">실험 결과</h1>

      {/* 실험 선택 */}
      <Select value={selectedExperiment} onValueChange={setSelectedExperiment}>
        <SelectTrigger className="w-80">
          <SelectValue placeholder="실험 선택" />
        </SelectTrigger>
        <SelectContent>
          {experiments.map(exp => (
            <SelectItem key={exp} value={exp}>{exp}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 결과 테이블 */}
      {results && (
        <div className="grid grid-cols-2 gap-4">
          {/* Variant A */}
          <Card>
            <CardHeader>
              <CardTitle>Variant A</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>노출수</span>
                <span className="font-bold">{results.A.impressions}</span>
              </div>
              <div className="flex justify-between">
                <span>클릭수</span>
                <span className="font-bold">{results.A.clicks}</span>
              </div>
              <div className="flex justify-between">
                <span>전환수</span>
                <span className="font-bold">{results.A.conversions}</span>
              </div>
              <div className="flex justify-between">
                <span>CTR</span>
                <span className="font-bold">{results.A.ctr.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span>전환율</span>
                <span className="font-bold text-green-600">
                  {results.A.conversionRate.toFixed(2)}%
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Variant B */}
          <Card>
            <CardHeader>
              <CardTitle>Variant B</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>노출수</span>
                <span className="font-bold">{results.B.impressions}</span>
              </div>
              <div className="flex justify-between">
                <span>클릭수</span>
                <span className="font-bold">{results.B.clicks}</span>
              </div>
              <div className="flex justify-between">
                <span>전환수</span>
                <span className="font-bold">{results.B.conversions}</span>
              </div>
              <div className="flex justify-between">
                <span>CTR</span>
                <span className="font-bold">{results.B.ctr.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span>전환율</span>
                <span className="font-bold text-green-600">
                  {results.B.conversionRate.toFixed(2)}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 승자 결정 */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle>결과</CardTitle>
          </CardHeader>
          <CardContent>
            {results.B.conversionRate > results.A.conversionRate ? (
              <p className="text-lg">
                🎉 <strong>Variant B</strong>가 <strong>Variant A</strong>보다{' '}
                <strong className="text-green-600">
                  {((results.B.conversionRate - results.A.conversionRate) / results.A.conversionRate * 100).toFixed(1)}%
                </strong>{' '}
                더 높은 전환율을 보입니다!
              </p>
            ) : (
              <p className="text-lg">
                Variant A가 더 높은 전환율을 보입니다.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

IMPORTANT:
- Feature Flags
- Firebase Remote Config
- A/B 테스트 컴포넌트
- 실험 추적 (노출/클릭/전환)
- 결과 분석 대시보드
- 통계적 유의성
```

---

## 📝 핵심 포인트

### A/B 테스트 프로세스
1. **가설 설정**: "버튼 텍스트를 바꾸면 클릭률이 증가할 것"
2. **실험 설계**: 50/50 분할
3. **실행**: 충분한 샘플 수집
4. **분석**: 통계적 유의성 확인
5. **결론**: 승자 결정

### 주요 메트릭
- **CTR** (Click-Through Rate): 클릭률
- **Conversion Rate**: 전환율
- **Statistical Significance**: 통계적 유의성

---

## ✅ 완료 체크리스트

- [ ] Feature Flags
- [ ] Remote Config
- [ ] A/B 테스트 컴포넌트
- [ ] 실험 추적
- [ ] 결과 분석

---

## 📝 다음 단계

**73-BETA-TESTING.md**로 이동합니다.
