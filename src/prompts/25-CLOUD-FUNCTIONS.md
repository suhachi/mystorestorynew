# 25 - Cloud Functions v2

## 📌 목표
Cloud Functions v2를 사용한 실제 백엔드 로직을 구축합니다.

**결과물**:
- Cloud Functions 프로젝트 구조
- Callable Functions (setOrderStatus, renderTemplate, retryNotify)
- Queue Functions (delayedNotify)
- Trigger Functions (historyNotify, tokenCleanup)
- Firebase 설정 파일

---

## 🔄 STEP 1: Functions 프로젝트 구조

### 프롬프트 템플릿

```
Cloud Functions v2 프로젝트 구조를 만듭니다.

## 요구사항

1. /functions/package.json 생성:

```json
{
  "name": "mystorystory-functions",
  "version": "1.0.0",
  "description": "Cloud Functions for MyStoreStory",
  "scripts": {
    "build": "tsc",
    "serve": "npm run build && firebase emulators:start --only functions",
    "shell": "npm run build && firebase functions:shell",
    "start": "npm run shell",
    "deploy": "firebase deploy --only functions",
    "logs": "firebase functions:log"
  },
  "engines": {
    "node": "18"
  },
  "main": "lib/index.js",
  "dependencies": {
    "firebase-admin": "^12.0.0",
    "firebase-functions": "^5.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  },
  "private": true
}
```

2. /functions/tsconfig.json 생성:

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "outDir": "lib",
    "sourceMap": true,
    "strict": true,
    "target": "ES2021",
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "compileOnSave": true,
  "include": ["src"]
}
```

3. /functions/.gitignore 생성:

```
node_modules/
lib/
*.log
.env
.runtimeconfig.json
```

IMPORTANT:
- Node 18 사용
- Cloud Functions v2 (firebase-functions ^5.0.0)
- TypeScript 사용
```

### 예상 결과

```
/functions/package.json
/functions/tsconfig.json
/functions/.gitignore
```

### 검증 체크리스트

- [ ] package.json 생성됨
- [ ] tsconfig.json 생성됨
- [ ] .gitignore 생성됨

---

## 🔄 STEP 2: Auth 및 Secrets 유틸리티

### 프롬프트 템플릿

```
Functions에서 사용할 인증 및 시크릿 관리 유틸리티를 만듭니다.

## 요구사항

1. /functions/src/auth.ts 생성:

```typescript
import { CallableRequest } from 'firebase-functions/v2/https';

// 인증된 사용자 확인
export const requireAuth = (request: CallableRequest): string => {
  if (!request.auth) {
    throw new Error('인증이 필요합니다');
  }
  return request.auth.uid;
};

// 관리자 권한 확인
export const requireAdmin = async (
  request: CallableRequest,
  admin: any
): Promise<string> => {
  const uid = requireAuth(request);
  
  const userDoc = await admin.firestore().collection('users').doc(uid).get();
  const userData = userDoc.data();
  
  if (!userData || userData.role !== 'admin') {
    throw new Error('관리자 권한이 필요합니다');
  }
  
  return uid;
};

// 스토어 소유자 권한 확인
export const requireStoreOwner = async (
  request: CallableRequest,
  admin: any,
  storeId: string
): Promise<string> => {
  const uid = requireAuth(request);
  
  const storeDoc = await admin.firestore().collection('stores').doc(storeId).get();
  const storeData = storeDoc.data();
  
  if (!storeData || storeData.ownerId !== uid) {
    throw new Error('스토어 소유자 권한이 필요합니다');
  }
  
  return uid;
};
```

2. /functions/src/secrets.ts 생성:

```typescript
import { defineSecret } from 'firebase-functions/v2/params';

// FCM Server Key
export const fcmServerKey = defineSecret('FCM_SERVER_KEY');

// Slack Webhook URL
export const slackWebhookUrl = defineSecret('SLACK_WEBHOOK_URL');

// 기타 API Keys (필요시 추가)
export const mailgunApiKey = defineSecret('MAILGUN_API_KEY');
export const twilioAuthToken = defineSecret('TWILIO_AUTH_TOKEN');
```

IMPORTANT:
- defineSecret으로 민감 정보 관리
- 실제 배포 시 Firebase Console에서 설정
- 로컬 개발 시 .env.local 사용
```

### 예상 결과

```
/functions/src/auth.ts
/functions/src/secrets.ts
```

### 검증 체크리스트

- [ ] auth.ts 생성됨
- [ ] secrets.ts 생성됨
- [ ] 타입 오류 없음

---

## 🔄 STEP 3: Callable Functions

### 프롬프트 템플릿

```
클라이언트에서 호출 가능한 Functions을 만듭니다.

## 요구사항

1. /functions/src/callables/setOrderStatus.ts 생성:

```typescript
import { onCall } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { requireAuth } from '../auth';

interface SetOrderStatusData {
  orderId: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';
  note?: string;
}

export const setOrderStatus = onCall(async (request) => {
  // 인증 확인
  const uid = requireAuth(request);
  
  const { orderId, status, note } = request.data as SetOrderStatusData;
  
  if (!orderId || !status) {
    throw new Error('orderId와 status는 필수입니다');
  }
  
  const db = admin.firestore();
  const orderRef = db.collection('orders').doc(orderId);
  const orderDoc = await orderRef.get();
  
  if (!orderDoc.exists) {
    throw new Error('주문을 찾을 수 없습니다');
  }
  
  const orderData = orderDoc.data()!;
  
  // 스토어 소유자 권한 확인
  const storeDoc = await db.collection('stores').doc(orderData.storeId).get();
  const storeData = storeDoc.data();
  
  if (!storeData || storeData.ownerId !== uid) {
    throw new Error('권한이 없습니다');
  }
  
  // 상태 업데이트
  const now = new Date();
  await orderRef.update({
    status,
    updatedAt: now,
    statusHistory: admin.firestore.FieldValue.arrayUnion({
      status,
      timestamp: now,
      note: note || getDefaultNote(status),
    }),
  });
  
  return { success: true, orderId, newStatus: status };
});

const getDefaultNote = (status: string): string => {
  const notes: Record<string, string> = {
    pending: '주문이 접수되었습니다',
    confirmed: '주문이 확인되었습니다',
    preparing: '주문을 준비 중입니다',
    ready: '주문이 준비되었습니다',
    delivering: '배달이 시작되었습니다',
    delivered: '배달이 완료되었습니다',
    cancelled: '주문이 취소되었습니다',
  };
  return notes[status] || '상태가 변경되었습니다';
};
```

2. /functions/src/callables/renderTemplate.ts 생성:

```typescript
import { onCall } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { requireAuth } from '../auth';

interface RenderTemplateData {
  templateId: string;
  variables: Record<string, string>;
}

export const renderTemplate = onCall(async (request) => {
  requireAuth(request);
  
  const { templateId, variables } = request.data as RenderTemplateData;
  
  if (!templateId || !variables) {
    throw new Error('templateId와 variables는 필수입니다');
  }
  
  const db = admin.firestore();
  const templateDoc = await db.collection('notificationTemplates').doc(templateId).get();
  
  if (!templateDoc.exists) {
    throw new Error('템플릿을 찾을 수 없습니다');
  }
  
  const template = templateDoc.data()!;
  
  // 템플릿 렌더링
  let title = template.title;
  let body = template.body;
  
  // 변수 치환 ({{variableName}} 형식)
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    title = title.replace(regex, value);
    body = body.replace(regex, value);
  });
  
  return {
    title,
    body,
    variables: template.variables,
  };
});
```

3. /functions/src/callables/retryNotify.ts 생성:

```typescript
import { onCall } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { requireAuth } from '../auth';
import { sendPushNotification } from '../services/fcm';

interface RetryNotifyData {
  notificationId: string;
}

export const retryNotify = onCall(async (request) => {
  const uid = requireAuth(request);
  
  const { notificationId } = request.data as RetryNotifyData;
  
  if (!notificationId) {
    throw new Error('notificationId는 필수입니다');
  }
  
  const db = admin.firestore();
  const notifDoc = await db.collection('notifications').doc(notificationId).get();
  
  if (!notifDoc.exists) {
    throw new Error('알림을 찾을 수 없습니다');
  }
  
  const notif = notifDoc.data()!;
  
  // 권한 확인 (자신의 알림만 재시도 가능)
  if (notif.userId !== uid) {
    throw new Error('권한이 없습니다');
  }
  
  // FCM 토큰 가져오기
  const userDoc = await db.collection('users').doc(uid).get();
  const userData = userDoc.data();
  const fcmToken = userData?.fcmToken;
  
  if (!fcmToken) {
    throw new Error('FCM 토큰이 없습니다');
  }
  
  // 푸시 알림 재전송
  await sendPushNotification({
    token: fcmToken,
    title: notif.title,
    body: notif.body,
    data: notif.data || {},
  });
  
  return { success: true, notificationId };
});
```

IMPORTANT:
- onCall로 클라이언트에서 직접 호출 가능
- 인증 및 권한 체크 필수
- 에러 핸들링 철저히
```

### 예상 결과

```
/functions/src/callables/setOrderStatus.ts
/functions/src/callables/renderTemplate.ts
/functions/src/callables/retryNotify.ts
```

### 검증 체크리스트

- [ ] 3개 Callable Functions 생성
- [ ] 인증 로직 포함
- [ ] 권한 체크 로직

---

## 🔄 STEP 4: Queue Functions

### 프롬프트 템플릿

```
Task Queue를 사용한 비동기 처리 Functions을 만듭니다.

## 요구사항

/functions/src/queues/delayedNotify.ts 생성:

```typescript
import { onTaskDispatched } from 'firebase-functions/v2/tasks';
import * as admin from 'firebase-admin';
import { sendPushNotification } from '../services/fcm';

interface DelayedNotifyPayload {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  delayMinutes?: number;
}

export const delayedNotify = onTaskDispatched(
  {
    retryConfig: {
      maxAttempts: 3,
      minBackoffSeconds: 60,
    },
    rateLimits: {
      maxConcurrentDispatches: 10,
    },
  },
  async (request) => {
    const payload = request.data as DelayedNotifyPayload;
    
    const db = admin.firestore();
    
    // 사용자 FCM 토큰 가져오기
    const userDoc = await db.collection('users').doc(payload.userId).get();
    const userData = userDoc.data();
    
    if (!userData || !userData.fcmToken) {
      console.log(`No FCM token for user ${payload.userId}`);
      return;
    }
    
    // 알림 설정 확인
    const settingsDoc = await db
      .collection('userNotificationSettings')
      .doc(payload.userId)
      .get();
    
    const settings = settingsDoc.data();
    
    if (!settings?.push?.enabled) {
      console.log(`Push notifications disabled for user ${payload.userId}`);
      return;
    }
    
    // 푸시 알림 전송
    await sendPushNotification({
      token: userData.fcmToken,
      title: payload.title,
      body: payload.body,
      data: payload.data || {},
    });
    
    // 알림 기록 저장
    await db.collection('notifications').add({
      userId: payload.userId,
      title: payload.title,
      body: payload.body,
      data: payload.data || {},
      read: false,
      priority: 'normal',
      type: 'system',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    console.log(`Delayed notification sent to user ${payload.userId}`);
  }
);
```

IMPORTANT:
- 재시도 설정 (최대 3번)
- Rate Limiting (최대 10개 동시 처리)
- 사용자 설정 확인 후 전송
```

### 예상 결과

```
/functions/src/queues/delayedNotify.ts
```

### 검증 체크리스트

- [ ] Queue Function 생성
- [ ] 재시도 설정
- [ ] Rate Limiting 설정

---

## 🔄 STEP 5: Trigger Functions

### 프롬프트 템플릿

```
Firestore 트리거와 스케줄 트리거 Functions을 만듭니다.

## 요구사항

1. /functions/src/triggers/historyNotify.ts 생성:

```typescript
import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';
import { sendPushNotification } from '../services/fcm';
import { sendSlackNotification } from '../services/slack';

export const historyNotify = onDocumentUpdated(
  'orders/{orderId}',
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    
    if (!before || !after) return;
    
    // 상태가 변경되었는지 확인
    if (before.status === after.status) return;
    
    const orderId = event.params.orderId;
    const newStatus = after.status;
    const customerMasked = after.customerMasked;
    
    console.log(`Order ${orderId} status changed: ${before.status} -> ${newStatus}`);
    
    // 고객에게 푸시 알림
    const db = admin.firestore();
    
    // customerMasked에서 실제 userId 찾기 (실제로는 orders에 userId 저장)
    // 여기서는 Mock으로 처리
    const userId = after.userId || 'mock-user-id';
    
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();
    
    if (userData?.fcmToken) {
      await sendPushNotification({
        token: userData.fcmToken,
        title: '주문 상태 업데이트',
        body: `주문(${orderId})이 ${getStatusLabel(newStatus)} 상태입니다`,
        data: {
          type: 'order_status_change',
          orderId,
          status: newStatus,
        },
      });
    }
    
    // Slack 알림 (관리자용)
    await sendSlackNotification({
      text: `[주문 상태 변경] ${orderId}: ${before.status} → ${newStatus}`,
      channel: '#orders',
    });
  }
);

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: '대기중',
    confirmed: '확인됨',
    preparing: '준비중',
    ready: '준비완료',
    delivering: '배달중',
    delivered: '배달완료',
    cancelled: '취소됨',
  };
  return labels[status] || status;
};
```

2. /functions/src/triggers/tokenCleanup.ts 생성:

```typescript
import { onSchedule } from 'firebase-functions/v2/scheduler';
import * as admin from 'firebase-admin';

export const tokenCleanup = onSchedule(
  {
    schedule: 'every day 03:00',
    timeZone: 'Asia/Seoul',
  },
  async () => {
    console.log('Starting FCM token cleanup...');
    
    const db = admin.firestore();
    const now = Date.now();
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
    
    // 30일 이상 사용하지 않은 토큰 삭제
    const usersSnapshot = await db.collection('users').get();
    
    let cleanedCount = 0;
    
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      
      if (userData.fcmToken && userData.fcmTokenUpdatedAt) {
        const tokenUpdatedAt = userData.fcmTokenUpdatedAt.toMillis();
        
        if (tokenUpdatedAt < thirtyDaysAgo) {
          await userDoc.ref.update({
            fcmToken: admin.firestore.FieldValue.delete(),
            fcmTokenUpdatedAt: admin.firestore.FieldValue.delete(),
          });
          cleanedCount++;
        }
      }
    }
    
    console.log(`FCM token cleanup completed. Cleaned ${cleanedCount} tokens.`);
  }
);
```

IMPORTANT:
- Firestore 트리거로 자동 실행
- 스케줄 트리거로 정기 작업
- 로깅 철저히
```

### 예상 결과

```
/functions/src/triggers/historyNotify.ts
/functions/src/triggers/tokenCleanup.ts
```

### 검증 체크리스트

- [ ] Firestore 트리거 생성
- [ ] 스케줄 트리거 생성
- [ ] 로깅 포함

---

## 🔄 STEP 6: Services (FCM, Slack, Templates)

### 프롬프트 템플릿

```
Functions에서 사용할 서비스 모듈을 만듭니다.

## 요구사항

1. /functions/src/services/fcm.ts 생성:

```typescript
import * as admin from 'firebase-admin';

interface PushNotificationPayload {
  token: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}

export const sendPushNotification = async (
  payload: PushNotificationPayload
): Promise<void> => {
  try {
    const message = {
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: payload.data || {},
      token: payload.token,
    };
    
    const response = await admin.messaging().send(message);
    console.log('FCM message sent successfully:', response);
  } catch (error) {
    console.error('Error sending FCM message:', error);
    throw error;
  }
};

export const sendMulticastNotification = async (
  tokens: string[],
  title: string,
  body: string,
  data?: Record<string, any>
): Promise<void> => {
  try {
    const message = {
      notification: { title, body },
      data: data || {},
      tokens,
    };
    
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log(`FCM multicast sent: ${response.successCount} success, ${response.failureCount} failure`);
    
    // 실패한 토큰 처리
    if (response.failureCount > 0) {
      const failedTokens: string[] = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(tokens[idx]);
        }
      });
      console.log('Failed tokens:', failedTokens);
    }
  } catch (error) {
    console.error('Error sending multicast:', error);
    throw error;
  }
};
```

2. /functions/src/services/slack.ts 생성:

```typescript
import { slackWebhookUrl } from '../secrets';

interface SlackMessage {
  text: string;
  channel?: string;
}

export const sendSlackNotification = async (
  message: SlackMessage
): Promise<void> => {
  try {
    const webhookUrl = slackWebhookUrl.value();
    
    if (!webhookUrl) {
      console.log('Slack webhook URL not configured');
      return;
    }
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: message.text,
        channel: message.channel || '#general',
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Slack API error: ${response.statusText}`);
    }
    
    console.log('Slack notification sent successfully');
  } catch (error) {
    console.error('Error sending Slack notification:', error);
    // Slack 실패는 critical하지 않으므로 throw하지 않음
  }
};
```

3. /functions/src/services/templates.ts 생성:

```typescript
import * as admin from 'firebase-admin';

export const renderNotificationTemplate = async (
  templateId: string,
  variables: Record<string, string>
): Promise<{ title: string; body: string }> => {
  const db = admin.firestore();
  const templateDoc = await db.collection('notificationTemplates').doc(templateId).get();
  
  if (!templateDoc.exists) {
    throw new Error(`Template ${templateId} not found`);
  }
  
  const template = templateDoc.data()!;
  
  let title = template.title;
  let body = template.body;
  
  // 변수 치환
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    title = title.replace(regex, value);
    body = body.replace(regex, value);
  });
  
  return { title, body };
};
```

IMPORTANT:
- FCM SDK 사용
- Slack Webhook 연동
- 템플릿 렌더링 로직
```

### 예상 결과

```
/functions/src/services/fcm.ts
/functions/src/services/slack.ts
/functions/src/services/templates.ts
```

### 검증 체크리스트

- [ ] FCM 서비스 생성
- [ ] Slack 서비스 생성
- [ ] Templates 서비스 생성

---

## 🔄 STEP 7: Functions Index (메인 엔트리)

### 프롬프트 템플릿

```
모든 Functions을 export하는 메인 index.ts를 만듭니다.

## 요구사항

/functions/src/index.ts 생성:

```typescript
import * as admin from 'firebase-admin';

// Firebase Admin 초기화
admin.initializeApp();

// Callable Functions
export { setOrderStatus } from './callables/setOrderStatus';
export { renderTemplate } from './callables/renderTemplate';
export { retryNotify } from './callables/retryNotify';

// Queue Functions
export { delayedNotify } from './queues/delayedNotify';

// Trigger Functions
export { historyNotify } from './triggers/historyNotify';
export { tokenCleanup } from './triggers/tokenCleanup';
```

IMPORTANT:
- admin.initializeApp() 먼저 호출
- 모든 Functions export
- 배포 시 자동으로 인식됨
```

### 예상 결과

```
/functions/src/index.ts
```

### 검증 체크리스트

- [ ] index.ts 생성
- [ ] 모든 Functions export
- [ ] admin.initializeApp() 포함

---

## ✅ Phase 7-4 완료 체크리스트

- [ ] Functions 프로젝트 구조
- [ ] Auth & Secrets 유틸리티
- [ ] 3개 Callable Functions
- [ ] 1개 Queue Function
- [ ] 2개 Trigger Functions
- [ ] 3개 Service 모듈
- [ ] index.ts 메인 엔트리

---

## 📝 다음 단계

**26-APP-PREVIEW.md**로 이동하여 플랜별 앱 미리보기 시스템을 구축합니다.

---

## ❓ FAQ

**Q: Functions v2와 v1의 차이는?**
A: v2는 더 나은 성능, 동시성 제어, Task Queue 지원 등이 추가되었습니다.

**Q: Secrets는 어떻게 설정하나요?**
A: Firebase Console에서 설정하거나 `firebase functions:secrets:set FCM_SERVER_KEY` 명령어 사용.

**Q: 로컬 테스트는?**
A: `npm run serve`로 Firebase Emulator에서 테스트 가능합니다.

**Q: 배포는?**
A: `npm run deploy` 또는 `firebase deploy --only functions` 사용.
