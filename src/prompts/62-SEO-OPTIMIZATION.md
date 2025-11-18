# 62 - SEO Optimization

## 📌 목표
검색 엔진 최적화(SEO)를 구축합니다.

**결과물**:
- Meta 태그
- Open Graph
- Structured Data
- Sitemap
- robots.txt

**총 개념 정리**

---

## 🔄 STEP 1: Meta Tags

### 프롬프트 템플릿

```
검색 엔진 최적화(SEO)를 구축합니다.

## 1. HTML Head 설정

index.html에 기본 메타 태그:

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <!-- 기본 메타 -->
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- SEO 메타 -->
  <title>MyStoreStory - 배달 수수료 없는 자체 배달앱 구축</title>
  <meta 
    name="description" 
    content="노코드로 배달앱을 만들 수 있는 서비스. 배달 수수료 없는 자체 배달앱을 5분 만에 구축하세요." 
  />
  <meta 
    name="keywords" 
    content="배달앱, 노코드, 자체앱, 배달 수수료, MyStoreStory, 배달앱 제작" 
  />
  
  <!-- 작성자 -->
  <meta name="author" content="MyStoreStory" />
  
  <!-- 로봇 -->
  <meta name="robots" content="index, follow" />
  
  <!-- Canonical URL -->
  <link rel="canonical" href="https://mystorestory.com" />
  
  <!-- 파비콘 -->
  <link rel="icon" type="image/png" href="/favicon.png" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
</head>
</html>
```

## 2. Open Graph (소셜 공유)

```html
<!-- Open Graph (Facebook, LinkedIn) -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://mystorestory.com" />
<meta property="og:title" content="MyStoreStory - 배달 수수료 없는 자체 배달앱" />
<meta 
  property="og:description" 
  content="노코드로 배달앱을 만들 수 있는 서비스. 5분 만에 구축하세요." 
/>
<meta property="og:image" content="https://mystorestory.com/og-image.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:site_name" content="MyStoreStory" />
<meta property="og:locale" content="ko_KR" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@mystorestory" />
<meta name="twitter:creator" content="@mystorestory" />
<meta name="twitter:title" content="MyStoreStory - 배달 수수료 없는 자체 배달앱" />
<meta 
  name="twitter:description" 
  content="노코드로 배달앱을 만들 수 있는 서비스. 5분 만에 구축하세요." 
/>
<meta name="twitter:image" content="https://mystorestory.com/twitter-image.jpg" />
```

## 3. Structured Data (JSON-LD)

### 조직 정보

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "MyStoreStory",
  "url": "https://mystorestory.com",
  "logo": "https://mystorestory.com/logo.png",
  "description": "배달 수수료 없는 자체 배달앱 구축 서비스",
  "sameAs": [
    "https://facebook.com/mystorestory",
    "https://twitter.com/mystorestory",
    "https://instagram.com/mystorestory"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+82-2-1234-5678",
    "contactType": "customer support",
    "availableLanguage": "Korean"
  }
}
</script>
```

### 제품 정보

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "MyStoreStory Pro 플랜",
  "description": "전문 배달앱 구축 플랜",
  "image": "https://mystorestory.com/products/pro.jpg",
  "offers": {
    "@type": "Offer",
    "price": "29000",
    "priceCurrency": "KRW",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "342"
  }
}
</script>
```

### 빵가루 네비게이션

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "홈",
      "item": "https://mystorestory.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "기능",
      "item": "https://mystorestory.com/features"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "가격",
      "item": "https://mystorestory.com/pricing"
    }
  ]
}
</script>
```

## 4. React Helmet (동적 메타 태그)

```typescript
import { Helmet } from 'react-helmet-async';

function LandingPage() {
  return (
    <>
      <Helmet>
        <title>MyStoreStory - 배달앱 제작 플랫폼</title>
        <meta 
          name="description" 
          content="노코드로 5분 만에 배달앱 구축" 
        />
        <link rel="canonical" href="https://mystorestory.com" />
        
        {/* Open Graph */}
        <meta property="og:title" content="MyStoreStory" />
        <meta property="og:description" content="..." />
        <meta property="og:image" content="/og-landing.jpg" />
      </Helmet>

      {/* 페이지 컨텐츠 */}
    </>
  );
}

function PricingPage() {
  return (
    <>
      <Helmet>
        <title>가격 플랜 - MyStoreStory</title>
        <meta 
          name="description" 
          content="Basic, Pro, Enterprise 플랜 비교" 
        />
        <link rel="canonical" href="https://mystorestory.com/pricing" />
      </Helmet>

      {/* 가격 페이지 */}
    </>
  );
}
```

## 5. Sitemap.xml

public/sitemap.xml 생성:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- 홈페이지 -->
  <url>
    <loc>https://mystorestory.com/</loc>
    <lastmod>2024-11-01</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- 기능 -->
  <url>
    <loc>https://mystorestory.com/features</loc>
    <lastmod>2024-11-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- 가격 -->
  <url>
    <loc>https://mystorestory.com/pricing</loc>
    <lastmod>2024-11-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- 앱 빌더 -->
  <url>
    <loc>https://mystorestory.com/app-builder</loc>
    <lastmod>2024-11-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
```

## 6. robots.txt

public/robots.txt 생성:

```txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /store/
Disallow: /api/

Sitemap: https://mystorestory.com/sitemap.xml
```

## 7. URL 구조 최적화

```typescript
// ✅ 좋은 URL
https://mystorestory.com/features
https://mystorestory.com/pricing
https://mystorestory.com/app-builder

// ❌ 나쁜 URL
https://mystorestory.com/page?id=123
https://mystorestory.com/#/features
```

## 8. 이미지 SEO

```typescript
// Alt 텍스트
<img 
  src="/hero-image.jpg" 
  alt="배달앱 대시보드 스크린샷 - 실시간 주문 관리" 
/>

// 파일명 최적화
hero-dashboard-screenshot.jpg  // ✅
img123.jpg                     // ❌

// 이미지 압축
- WebP 포맷 사용
- 적절한 크기 (1200px 이하)
- Lazy loading
```

## 9. 페이지 속도 최적화

```typescript
// 1. 코드 스플리팅
const AdminDashboard = lazy(() => import('./pages/admin-dashboard'));

// 2. 이미지 최적화
<img loading="lazy" src="..." />

// 3. CSS 최소화
// Tailwind 빌드 시 자동 최적화

// 4. 폰트 최적화
// preload 중요 폰트
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin />

// 5. CDN 사용
// Firebase Hosting은 자동으로 CDN 제공
```

## 10. Google Analytics 설정

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## 11. Google Search Console 설정

```html
<!-- Search Console 소유권 확인 -->
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
```

## 12. SEO 체크리스트

```markdown
### 기본
- [ ] 모든 페이지에 고유한 title
- [ ] 모든 페이지에 description (150-160자)
- [ ] 모든 이미지에 alt 텍스트
- [ ] 의미 있는 URL 구조

### 메타 태그
- [ ] Open Graph 태그
- [ ] Twitter Card 태그
- [ ] Canonical URL
- [ ] robots 메타

### Structured Data
- [ ] Organization 스키마
- [ ] Product 스키마 (필요시)
- [ ] BreadcrumbList 스키마

### 기술적
- [ ] sitemap.xml
- [ ] robots.txt
- [ ] HTTPS
- [ ] 모바일 반응형
- [ ] 페이지 속도 (< 3초)

### 콘텐츠
- [ ] H1 태그 (페이지당 1개)
- [ ] H2, H3 계층 구조
- [ ] 내부 링크
- [ ] 외부 링크 (rel="noopener")

### 분석
- [ ] Google Analytics
- [ ] Google Search Console
- [ ] 성능 모니터링
```

IMPORTANT:
- 모든 페이지에 고유한 title, description
- Open Graph, Twitter Card
- Structured Data (JSON-LD)
- sitemap.xml, robots.txt
- 의미 있는 URL
- 이미지 최적화
- 페이지 속도 (<3초)
```

---

## 📝 핵심 포인트

### SEO 3대 요소
1. **컨텐츠**: 고유하고 가치 있는 내용
2. **기술**: 빠른 로딩, 모바일 최적화
3. **백링크**: 다른 사이트에서 링크

### Google 순위 요인
- **페이지 속도**: Core Web Vitals
- **모바일 친화성**: 반응형 디자인
- **HTTPS**: 보안 연결
- **콘텐츠 품질**: 유용한 정보
- **사용자 경험**: 이탈률, 체류 시간

---

## ✅ 완료 체크리스트

- [ ] Meta 태그
- [ ] Open Graph
- [ ] Structured Data
- [ ] Sitemap.xml
- [ ] robots.txt
- [ ] Google Analytics

---

## 📝 다음 단계

**63-PWA-FEATURES.md**로 이동합니다.
