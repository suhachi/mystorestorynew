# 64 - Analytics & Tracking

## 📌 목표
분석 및 추적 시스템을 구축합니다.

**결과물**:
- Google Analytics 4
- 이벤트 추적
- 사용자 행동 분석
- 전환 추적

**총 개념 정리**

---

## 🔄 STEP 1: Google Analytics 4

### 프롬프트 템플릿

```
Google Analytics 4와 이벤트 추적 시스템을 구축합니다.

## 1. Google Analytics 4 설정

index.html에 GA4 추가:

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    page_title: document.title,
    page_path: window.location.pathname
  });
</script>
```

## 2. 페이지뷰 추적

```typescript
// /utils/analytics.ts
export const analytics = {
  // 페이지뷰
  pageView: (path: string, title: string) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', 'G-XXXXXXXXXX', {
        page_path: path,
        page_title: title
      });
    }
  },

  // 이벤트
  event: (eventName: string, params?: any) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', eventName, params);
    }
  }
};

// React Router 연동
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { analytics } from './utils/analytics';

function App() {
  const location = useLocation();

  useEffect(() => {
    analytics.pageView(location.pathname, document.title);
  }, [location]);

  return <div>{/* 앱 */}</div>;
}
```

## 3. 이벤트 추적

### 버튼 클릭

```typescript
// 회원가입 버튼
<Button onClick={() => {
  analytics.event('sign_up', {
    method: 'email'
  });
  handleSignUp();
}}>
  회원가입
</Button>

// 플랜 선택
<Button onClick={() => {
  analytics.event('select_plan', {
    plan_name: 'Pro',
    plan_price: 29000
  });
  handleSelectPlan('Pro');
}}>
  Pro 플랜 선택
</Button>
```

### 폼 제출

```typescript
const handleSubmit = async (data: FormData) => {
  analytics.event('form_submit', {
    form_name: 'app_builder',
    form_step: currentStep
  });

  try {
    await submitForm(data);
    
    analytics.event('form_complete', {
      form_name: 'app_builder'
    });
  } catch (error) {
    analytics.event('form_error', {
      form_name: 'app_builder',
      error_message: error.message
    });
  }
};
```

### 검색

```typescript
const handleSearch = (query: string) => {
  analytics.event('search', {
    search_term: query,
    page_location: location.pathname
  });

  performSearch(query);
};
```

### 주문 생성

```typescript
const handleCreateOrder = async (order: Order) => {
  // 주문 시작
  analytics.event('begin_checkout', {
    currency: 'KRW',
    value: order.total,
    items: order.items.map(item => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity
    }))
  });

  try {
    const result = await createOrder(order);

    // 주문 완료
    analytics.event('purchase', {
      transaction_id: result.orderId,
      currency: 'KRW',
      value: order.total,
      items: order.items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity
      }))
    });
  } catch (error) {
    analytics.event('checkout_error', {
      error_message: error.message
    });
  }
};
```

## 4. 전환 추적

### 회원가입

```typescript
analytics.event('sign_up', {
  method: 'email'
});

// GA4에서 전환으로 설정
```

### 앱 생성 완료

```typescript
analytics.event('app_created', {
  app_name: appName,
  plan_type: planType,
  features_count: selectedFeatures.length
});
```

### 플랜 업그레이드

```typescript
analytics.event('upgrade_plan', {
  from_plan: 'Basic',
  to_plan: 'Pro',
  upgrade_value: 29000
});
```

## 5. 사용자 속성

```typescript
// 사용자 역할 설정
analytics.event('set_user_properties', {
  user_role: 'owner',
  subscription_plan: 'Pro',
  store_count: 2
});

// 커스텀 차원
gtag('set', 'user_properties', {
  plan_type: 'Pro',
  industry: 'cafe'
});
```

## 6. E-commerce 이벤트

```typescript
// 상품 조회
analytics.event('view_item', {
  currency: 'KRW',
  value: 4500,
  items: [{
    item_id: 'coffee_americano',
    item_name: '아메리카노',
    price: 4500,
    item_category: 'coffee'
  }]
});

// 장바구니 추가
analytics.event('add_to_cart', {
  currency: 'KRW',
  value: 4500,
  items: [{
    item_id: 'coffee_americano',
    item_name: '아메리카노',
    price: 4500,
    quantity: 1
  }]
});

// 장바구니 제거
analytics.event('remove_from_cart', {
  currency: 'KRW',
  value: 4500,
  items: [{
    item_id: 'coffee_americano',
    item_name: '아메리카노'
  }]
});
```

## 7. 에러 추적

```typescript
// 에러 로깅
const logError = (error: Error, context?: string) => {
  analytics.event('exception', {
    description: error.message,
    fatal: false,
    context: context
  });

  console.error('Error:', error);
};

// 사용
try {
  await fetchData();
} catch (error) {
  logError(error, 'fetchData');
}
```

## 8. 성능 추적

```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  analytics.event(metric.name, {
    value: Math.round(metric.value),
    metric_id: metric.id,
    metric_delta: metric.delta
  });
}

// Web Vitals 측정
getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

## 9. 커스텀 Hook

```typescript
// /hooks/useAnalytics.ts
import { analytics } from '../utils/analytics';

export function useAnalytics() {
  const trackClick = (buttonName: string, params?: any) => {
    analytics.event('button_click', {
      button_name: buttonName,
      ...params
    });
  };

  const trackFormSubmit = (formName: string, params?: any) => {
    analytics.event('form_submit', {
      form_name: formName,
      ...params
    });
  };

  const trackError = (errorName: string, params?: any) => {
    analytics.event('error', {
      error_name: errorName,
      ...params
    });
  };

  return {
    trackClick,
    trackFormSubmit,
    trackError
  };
}

// 사용
function MyComponent() {
  const { trackClick } = useAnalytics();

  return (
    <Button onClick={() => {
      trackClick('create_app');
      handleCreateApp();
    }}>
      앱 만들기
    </Button>
  );
}
```

## 10. Google Tag Manager (선택)

```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXX');</script>
<!-- End Google Tag Manager -->

<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
```

## 11. 중요 이벤트 목록

```typescript
// 사용자 행동
- page_view          // 페이지 조회
- sign_up            // 회원가입
- login              // 로그인
- logout             // 로그아웃

// 앱 빌더
- app_builder_start  // 앱 빌더 시작
- feature_select     // 기능 선택
- plan_select        // 플랜 선택
- app_created        // 앱 생성 완료

// E-commerce
- view_item          // 상품 조회
- add_to_cart        // 장바구니 추가
- begin_checkout     // 체크아웃 시작
- purchase           // 구매 완료

// 주문
- order_create       // 주문 생성
- order_confirm      // 주문 확인
- order_complete     // 주문 완료
- order_cancel       // 주문 취소

// 검색
- search             // 검색

// 에러
- error              // 일반 에러
- exception          // 예외
- form_error         // 폼 에러

// 성능
- CLS                // Cumulative Layout Shift
- FID                // First Input Delay
- FCP                // First Contentful Paint
- LCP                // Largest Contentful Paint
- TTFB               // Time to First Byte
```

## 12. 개인정보 보호

```typescript
// 개인정보 제거
const sanitizeData = (data: any) => {
  // 이메일, 전화번호 등 제거
  const sanitized = { ...data };
  delete sanitized.email;
  delete sanitized.phone;
  delete sanitized.address;
  return sanitized;
};

// 사용
analytics.event('user_action', sanitizeData(userData));

// Cookie 동의
<Button onClick={() => {
  // Cookie 동의 후 GA 활성화
  gtag('consent', 'update', {
    analytics_storage: 'granted'
  });
}}>
  Cookie 동의
</Button>
```

IMPORTANT:
- Google Analytics 4 설정
- 페이지뷰 자동 추적
- 이벤트 추적 (클릭, 폼, 주문)
- 전환 추적 (회원가입, 구매)
- E-commerce 이벤트
- Web Vitals 측정
- 개인정보 보호
```

---

## 📝 핵심 포인트

### 추적해야 할 이벤트
1. **사용자**: 회원가입, 로그인
2. **앱 빌더**: 기능 선택, 플랜 선택
3. **주문**: 생성, 완료, 취소
4. **검색**: 검색어, 결과
5. **성능**: Web Vitals

### GA4 이벤트 구조
```typescript
gtag('event', 'event_name', {
  param1: 'value1',
  param2: 'value2'
});
```

---

## ✅ 완료 체크리스트

- [ ] GA4 설정
- [ ] 페이지뷰 추적
- [ ] 이벤트 추적
- [ ] 전환 추적
- [ ] Web Vitals
- [ ] 개인정보 보호

---

## 📝 다음 단계

**65-SECURITY-BEST-PRACTICES.md**로 이동합니다.
