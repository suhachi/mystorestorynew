# 63 - PWA (Progressive Web App) Features

## 📌 목표
PWA 기능을 구축합니다.

**결과물**:
- manifest.json
- Service Worker
- 오프라인 지원
- 홈 화면 추가
- 푸시 알림

**총 개념 정리**

---

## 🔄 STEP 1: Manifest.json

### 프롬프트 템플릿

```
Progressive Web App (PWA) 기능을 구축합니다.

## 1. manifest.json

public/manifest.json 생성:

```json
{
  "name": "MyStoreStory - 배달앱 제작 플랫폼",
  "short_name": "MyStoreStory",
  "description": "노코드로 배달앱을 만들 수 있는 서비스",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2563EB",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/desktop.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    },
    {
      "src": "/screenshots/mobile.png",
      "sizes": "750x1334",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ],
  "categories": ["business", "productivity", "food"],
  "lang": "ko",
  "dir": "ltr"
}
```

index.html에 연결:

```html
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#2563EB" />
```

## 2. Service Worker

public/sw.js 생성:

```javascript
const CACHE_NAME = 'mystorestory-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/globals.css',
  '/icons/icon-192x192.png'
];

// 설치 (Install)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 활성화 (Activate)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch (네트워크 요청 가로채기)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 캐시에 있으면 캐시 반환
        if (response) {
          return response;
        }

        // 없으면 네트워크 요청
        return fetch(event.request)
          .then((response) => {
            // 유효한 응답인지 확인
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // 응답 복사 후 캐시에 저장
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
      .catch(() => {
        // 오프라인 페이지 표시
        return caches.match('/offline.html');
      })
  );
});

// 푸시 알림
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    data: {
      url: data.url
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 알림 클릭
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
```

## 3. Service Worker 등록

```typescript
// /utils/register-sw.ts
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered:', registration);
        })
        .catch((error) => {
          console.log('SW registration failed:', error);
        });
    });
  }
}

// App.tsx
import { useEffect } from 'react';
import { registerServiceWorker } from './utils/register-sw';

function App() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return <div>{/* 앱 컨텐츠 */}</div>;
}
```

## 4. 홈 화면 추가 안내

```typescript
import { useState, useEffect } from 'react';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { X } from 'lucide-react';

function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`User response: ${outcome}`);
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <Card className="fixed bottom-4 left-4 right-4 p-4 shadow-lg z-50">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-bold mb-1">앱 설치</h3>
          <p className="text-sm text-gray-600">
            홈 화면에 추가하여 빠르게 접근하세요
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleInstall}>
            설치
          </Button>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => setShowPrompt(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
```

## 5. 오프라인 페이지

public/offline.html 생성:

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>오프라인 - MyStoreStory</title>
  <style>
    body {
      font-family: sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #f3f4f6;
    }
    .container {
      text-align: center;
      padding: 2rem;
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    h1 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    p {
      color: #6b7280;
    }
    button {
      margin-top: 1rem;
      padding: 0.75rem 1.5rem;
      background: #2563EB;
      color: white;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>오프라인</h1>
    <p>인터넷 연결을 확인해주세요</p>
    <button onclick="window.location.reload()">
      다시 시도
    </button>
  </div>
</body>
</html>
```

## 6. 푸시 알림 권한 요청

```typescript
async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return;
  }

  const permission = await Notification.requestPermission();

  if (permission === 'granted') {
    console.log('Notification permission granted');
    
    // FCM 토큰 가져오기 (Firebase Cloud Messaging)
    const messaging = getMessaging();
    const token = await getToken(messaging, {
      vapidKey: 'YOUR_VAPID_KEY'
    });
    
    console.log('FCM Token:', token);
    
    // 서버에 토큰 저장
    await saveTokenToServer(token);
  }
}

// 사용
<Button onClick={requestNotificationPermission}>
  알림 허용
</Button>
```

## 7. 백그라운드 동기화

```javascript
// Service Worker
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-orders') {
    event.waitUntil(syncOrders());
  }
});

async function syncOrders() {
  // 오프라인에서 생성된 주문 동기화
  const orders = await getOfflineOrders();
  
  for (const order of orders) {
    try {
      await fetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify(order)
      });
      
      await deleteOfflineOrder(order.id);
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }
}
```

```typescript
// 클라이언트
async function createOrder(order: Order) {
  try {
    // 온라인이면 즉시 전송
    if (navigator.onLine) {
      await fetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify(order)
      });
    } else {
      // 오프라인이면 저장
      await saveOfflineOrder(order);
      
      // 백그라운드 동기화 등록
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('sync-orders');
    }
  } catch (error) {
    console.error('Failed to create order:', error);
  }
}
```

## 8. 앱 업데이트 알림

```typescript
function AppUpdatePrompt() {
  const [newVersionAvailable, setNewVersionAvailable] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setNewVersionAvailable(true);
      });
    }
  }, []);

  if (!newVersionAvailable) return null;

  return (
    <Card className="fixed top-4 left-4 right-4 p-4 bg-blue-50 border-blue-200 z-50">
      <div className="flex items-center justify-between">
        <p className="text-sm">새 버전이 있습니다</p>
        <Button 
          size="sm" 
          onClick={() => window.location.reload()}
        >
          업데이트
        </Button>
      </div>
    </Card>
  );
}
```

## 9. 캐시 전략

```javascript
// 1. Cache First (정적 파일)
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/static/')) {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
  }
});

// 2. Network First (API)
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
    );
  }
});

// 3. Stale While Revalidate (이미지)
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/images/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(response => {
          const fetchPromise = fetch(event.request).then(networkResponse => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
          return response || fetchPromise;
        });
      })
    );
  }
});
```

IMPORTANT:
- manifest.json (앱 메타데이터)
- Service Worker (오프라인, 캐싱)
- 홈 화면 추가
- 푸시 알림
- 백그라운드 동기화
- 오프라인 지원
```

---

## 📝 핵심 포인트

### PWA 3대 요소
1. **HTTPS**: 보안 연결 필수
2. **Manifest**: 앱 정보
3. **Service Worker**: 오프라인 지원

### 주요 기능
- **오프라인 작동**: 캐시된 데이터 사용
- **홈 화면 추가**: 앱처럼 사용
- **푸시 알림**: 백그라운드 알림
- **빠른 로딩**: 캐시 전략

---

## ✅ 완료 체크리스트

- [ ] manifest.json
- [ ] Service Worker
- [ ] 홈 화면 추가
- [ ] 오프라인 페이지
- [ ] 푸시 알림
- [ ] 캐시 전략

---

## 📝 다음 단계

**64-ANALYTICS-TRACKING.md**로 이동합니다.
