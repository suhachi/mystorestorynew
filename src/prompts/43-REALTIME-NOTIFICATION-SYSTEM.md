# 43 - Realtime Notification System

## 📌 목표
실시간 알림 시스템을 구축합니다. (이미 realtime-notifications.tsx 존재)

**결과물**:
- realtime-notifications.tsx (이미 존재) - 확인 및 문서화

**총 1개 파일 (확인)**

---

## 🔄 STEP 1: Realtime Notification System 확인

### 프롬프트 템플릿

```
/components/system/realtime-notifications.tsx 파일이 이미 존재합니다. 확인하고 문서화합니다.

## 기존 파일 확인

파일 위치: /components/system/realtime-notifications.tsx

주요 기능:
- Firebase Cloud Messaging (FCM) 연동
- 푸시 알림 권한 요청
- 디바이스 토큰 관리
- 실시간 알림 수신
- 알림 클릭 핸들링

## FCM 설정

```typescript
// firebase-messaging-sw.js (public 폴더)
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Background Message:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png',
    badge: '/badge.png',
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
```

## 사용 방법

```typescript
import { RealtimeNotifications } from './components/system/realtime-notifications';

function App() {
  const handleNotification = (notification) => {
    console.log('알림 수신:', notification);
    toast.success(notification.title);
  };

  return (
    <RealtimeNotifications 
      userId="user_123"
      onNotificationReceived={handleNotification}
    />
  );
}
```

## 알림 종류

```typescript
type NotificationType = 
  | 'order_new'        // 신규 주문
  | 'order_confirmed'  // 주문 확인
  | 'order_preparing'  // 준비 중
  | 'order_ready'      // 준비 완료
  | 'order_completed'  // 배달 완료
  | 'order_cancelled'  // 주문 취소
  | 'review_new'       // 신규 리뷰
  | 'promotion'        // 프로모션
  | 'system';          // 시스템 공지

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  createdAt: Date;
  read: boolean;
}
```

## Cloud Functions 트리거

```typescript
// functions/src/triggers/order-notification.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const sendOrderNotification = functions.firestore
  .document('orders/{orderId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    // 상태 변경 감지
    if (before.status !== after.status) {
      const messaging = admin.messaging();
      
      // 고객 FCM 토큰 가져오기
      const customerDoc = await admin.firestore()
        .collection('users')
        .doc(after.customerId)
        .get();
      
      const fcmToken = customerDoc.data()?.fcmToken;
      
      if (fcmToken) {
        const message = {
          notification: {
            title: '주문 상태 업데이트',
            body: getStatusMessage(after.status)
          },
          data: {
            orderId: context.params.orderId,
            status: after.status,
            type: 'order_update'
          },
          token: fcmToken
        };

        await messaging.send(message);
        console.log('알림 전송 완료:', context.params.orderId);
      }
    }
  });

function getStatusMessage(status: string): string {
  const messages = {
    confirmed: '주문이 확인되었습니다',
    preparing: '음식을 준비하고 있습니다',
    ready: '음식이 준비되었습니다',
    completed: '배달이 완료되었습니다'
  };
  return messages[status] || '주문 상태가 변경되었습니다';
}
```

## 토큰 관리

```typescript
import { getMessaging, getToken } from 'firebase/messaging';

// 토큰 요청
async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  
  if (permission === 'granted') {
    const messaging = getMessaging();
    const token = await getToken(messaging, {
      vapidKey: 'YOUR_VAPID_KEY'
    });

    // Firestore에 토큰 저장
    await updateDoc(doc(db, 'users', userId), {
      fcmToken: token,
      fcmTokenUpdatedAt: serverTimestamp()
    });

    console.log('FCM Token:', token);
    return token;
  }
}

// 토큰 갱신
messaging.onTokenRefresh(async () => {
  const newToken = await getToken(messaging);
  await updateDoc(doc(db, 'users', userId), {
    fcmToken: newToken,
    fcmTokenUpdatedAt: serverTimestamp()
  });
});
```

## 알림 UI

```typescript
import { Bell, X } from 'lucide-react';
import { Badge } from '../ui/badge';

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center">
            {unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-3 border-b flex items-center justify-between">
            <h3 className="font-bold">알림</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.map(notification => (
              <div 
                key={notification.id}
                className={`p-3 border-b hover:bg-slate-50 cursor-pointer ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <p className="font-medium text-sm">{notification.title}</p>
                <p className="text-xs text-slate-600">{notification.body}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {formatRelativeTime(notification.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

IMPORTANT:
- FCM 푸시 알림
- 포그라운드/백그라운드 알림
- 토큰 관리 및 갱신
- Cloud Functions 트리거
- 알림 읽음 상태 관리
```

---

## 📝 핵심 포인트

### 알림 흐름
1. **권한 요청**: Notification.requestPermission()
2. **토큰 발급**: getToken()
3. **토큰 저장**: Firestore에 저장
4. **이벤트 발생**: 주문 상태 변경
5. **Cloud Function**: FCM 메시지 전송
6. **클라이언트 수신**: onMessage 핸들러

### FCM 메시지 구조
```json
{
  "notification": {
    "title": "주문 확인",
    "body": "주문이 확인되었습니다"
  },
  "data": {
    "orderId": "order_123",
    "type": "order_confirmed"
  },
  "token": "fcm_token_here"
}
```

---

## ✅ 완료 체크리스트

- [ ] realtime-notifications.tsx 확인
- [ ] FCM 설정 문서화

---

## 📝 다음 단계

**44-PAYMENT-INTEGRATION.md**로 이동합니다.
