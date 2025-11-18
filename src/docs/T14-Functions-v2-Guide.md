# T14 Cloud Functions v2 & Secrets Implementation Guide

**Status:** Documentation only (Functions folder not present in project)  
**Target:** Backend implementation for T14-06 ~ T14-11

---

## Overview

All Cloud Functions must use **Firebase Functions v2** API with:
- ✅ `onCall` for callable functions
- ✅ `onDocumentCreated`, `onDocumentUpdated` for Firestore triggers
- ✅ `onMessagePublished` for Pub/Sub (queues)
- ✅ `defineSecret` for secrets management
- ✅ Admin SDK for FCM messaging
- ❌ NO `process.env` direct access
- ❌ NO Functions v1 API (`functions.https.onRequest`, etc.)

---

## Project Structure

```
functions/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts                 # Export all functions
│   ├── callables/
│   │   ├── setOrderStatus.ts    # T14-08: Update order status
│   │   ├── renderTemplate.ts    # T14-11: Server-side template render
│   │   └── retryNotify.ts       # T14-09: Retry failed notifications
│   ├── triggers/
│   │   ├── historyNotify.ts     # T14-08: History onCreate → notify
│   │   └── tokenCleanup.ts      # T14-10: Clean expired FCM tokens
│   ├── queues/
│   │   └── delayedNotify.ts     # T14-10: Quiet hours queue processor
│   ├── services/
│   │   ├── fcm.ts               # FCM Admin SDK wrapper
│   │   ├── slack.ts             # Slack webhook with timeout
│   │   └── templates.ts         # Template rendering (mustache)
│   └── types/
│       ├── order.ts
│       └── notification.ts
└── .secret.local                # Local secrets (gitignored)
```

---

## 1. Secrets Management

### Define Secrets

```typescript
// functions/src/secrets.ts
import { defineSecret } from 'firebase-functions/params';

export const SLACK_WEBHOOK_URL = defineSecret('SLACK_WEBHOOK_URL');
export const FCM_SERVER_KEY = defineSecret('FCM_SERVER_KEY'); // Not needed with Admin SDK
```

### Set Secrets (CLI)

```bash
# Development
firebase functions:secrets:set SLACK_WEBHOOK_URL --data-file .secret.local

# Production
firebase functions:secrets:set SLACK_WEBHOOK_URL
# (Interactive prompt)
```

### Use Secrets in Functions

```typescript
import { onCall } from 'firebase-functions/v2/https';
import { SLACK_WEBHOOK_URL } from './secrets';

export const sendSlackNotification = onCall(
  { secrets: [SLACK_WEBHOOK_URL] }, // Declare secret dependency
  async (request) => {
    const webhookUrl = SLACK_WEBHOOK_URL.value(); // Access secret value
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: request.data.message }),
      signal: AbortSignal.timeout(5000) // 5s timeout
    });
    
    if (!response.ok) {
      throw new Error(`Slack webhook failed: ${response.status}`);
    }
    
    return { success: true };
  }
);
```

---

## 2. FCM with Admin SDK

### Initialize Admin SDK

```typescript
// functions/src/index.ts
import * as admin from 'firebase-admin';

admin.initializeApp();
```

### Send FCM Message

```typescript
// functions/src/services/fcm.ts
import { getMessaging } from 'firebase-admin/messaging';

export async function sendFCMMessage(params: {
  token: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const message = {
      token: params.token,
      notification: {
        title: params.title,
        body: params.body
      },
      data: params.data || {}
    };

    const messageId = await getMessaging().send(message);
    
    return { success: true, messageId };
  } catch (error: any) {
    console.error('[FCM] Send failed:', error);
    
    // Handle specific FCM errors
    if (error.code === 'messaging/invalid-registration-token') {
      return { success: false, error: 'INVALID_REGISTRATION' };
    }
    if (error.code === 'messaging/registration-token-not-registered') {
      return { success: false, error: 'FCM_TOKEN_EXPIRED' };
    }
    
    return { success: false, error: error.message };
  }
}
```

---

## 3. Callable Functions

### setOrderStatus (T14-08, T14-09)

```typescript
// functions/src/callables/setOrderStatus.ts
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

export const setOrderStatus = onCall(
  { region: 'asia-northeast3' },
  async (request) => {
    // Auth check
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Authentication required');
    }

    const { storeId, orderId, status, note, mutationId } = request.data;

    // Validate inputs
    if (!storeId || !orderId || !status) {
      throw new HttpsError('invalid-argument', 'Missing required fields');
    }

    const db = getFirestore();
    const orderRef = db.doc(`stores/${storeId}/orders/${orderId}`);

    try {
      // Idempotency check
      if (mutationId) {
        const mutationRef = db.doc(`ops/mutations/${mutationId}`);
        const mutationDoc = await mutationRef.get();
        
        if (mutationDoc.exists) {
          console.log('[setOrderStatus] Mutation already processed:', mutationId);
          return { success: true, idempotent: true };
        }
      }

      // Transaction for atomicity
      const result = await db.runTransaction(async (transaction) => {
        const orderDoc = await transaction.get(orderRef);
        
        if (!orderDoc.exists) {
          throw new HttpsError('not-found', 'Order not found');
        }

        const order = orderDoc.data();

        // Update order status
        transaction.update(orderRef, {
          status,
          updatedAt: FieldValue.serverTimestamp()
        });

        // Create history entry
        const historyRef = orderRef.collection('history').doc();
        transaction.set(historyRef, {
          status,
          note: note || '',
          createdAt: FieldValue.serverTimestamp(),
          actor: request.auth!.uid
        });

        // Record mutation for idempotency
        if (mutationId) {
          transaction.set(db.doc(`ops/mutations/${mutationId}`), {
            processed: true,
            timestamp: FieldValue.serverTimestamp()
          });
        }

        return { success: true };
      });

      console.log('[setOrderStatus] Order status updated:', { storeId, orderId, status });
      
      return result;
    } catch (error: any) {
      console.error('[setOrderStatus] Failed:', error);
      throw new HttpsError('internal', error.message);
    }
  }
);
```

---

## 4. Firestore Triggers

### onOrderHistoryCreated (T14-08)

```typescript
// functions/src/triggers/historyNotify.ts
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { getFirestore } from 'firebase-admin/firestore';
import { processHistoryNotification } from '../services/history-notify';

export const onOrderHistoryCreated = onDocumentCreated(
  {
    document: 'stores/{storeId}/orders/{orderId}/history/{historyId}',
    region: 'asia-northeast3'
  },
  async (event) => {
    const { storeId, orderId, historyId } = event.params;
    const historyEntry = event.data?.data();
    
    if (!historyEntry) {
      console.error('[Trigger] No history data');
      return;
    }

    const db = getFirestore();

    // Load order
    const orderDoc = await db.doc(`stores/${storeId}/orders/${orderId}`).get();
    const orderData = orderDoc.data();

    if (!orderData) {
      console.error('[Trigger] Order not found');
      return;
    }

    // Load user preferences
    const userId = orderData.userId;
    let userPrefs = null;
    
    if (userId) {
      const prefsDoc = await db.doc(`users/${userId}/prefs/notifications`).get();
      userPrefs = prefsDoc.data();
    }

    // Process notification
    const result = await processHistoryNotification({
      storeId,
      orderId,
      historyEntry,
      orderData,
      userPrefs
    });

    console.log('[Trigger] Notification result:', result);

    // Log warnings/failures to DLQ
    if (!result.success || result.warnings.length > 0) {
      await db.collection('ops/notifyFailures').add({
        type: 'history_notify',
        storeId,
        orderId,
        historyId,
        result,
        timestamp: FieldValue.serverTimestamp()
      });
    }
  }
);
```

---

## 5. Timeouts & AbortSignal

### Slack Webhook with Timeout

```typescript
// functions/src/services/slack.ts
export async function sendSlackMessage(params: {
  webhookUrl: string;
  text: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s

    const response = await fetch(params.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: params.text }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` };
    }

    return { success: true };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return { success: false, error: 'TIMEOUT_5S' };
    }
    return { success: false, error: error.message };
  }
}
```

---

## 6. Deployment

### Deploy All Functions

```bash
firebase deploy --only functions
```

### Deploy Specific Function

```bash
firebase deploy --only functions:setOrderStatus
```

### Set Secrets Before Deploy

```bash
firebase functions:secrets:set SLACK_WEBHOOK_URL
firebase functions:secrets:set FCM_SERVER_KEY
```

---

## 7. Testing

### Local Emulator

```bash
firebase emulators:start --only functions,firestore
```

### Call Function Locally

```typescript
// Frontend
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions(app, 'asia-northeast3');
const setOrderStatus = httpsCallable(functions, 'setOrderStatus');

const result = await setOrderStatus({
  storeId: 'store_001',
  orderId: 'ord_123',
  status: 'CONFIRMED',
  note: 'Customer confirmed',
  mutationId: '12345-abc'
});
```

---

## 8. Monitoring

### Cloud Logging

```bash
firebase functions:log --only setOrderStatus
```

### DLQ (Dead Letter Queue)

Failed notifications logged to: `ops/notifyFailures`

Fields:
- `type`: 'history_notify' | 'retry_notify'
- `storeId`, `orderId`, `historyId`
- `result`: { success, sent, queued, skipped, warnings }
- `timestamp`

---

## 9. Security Rules

See `/firestore.rules` for read/write permissions.

Key points:
- Callables: Auth required, role checks in function code
- Triggers: Run with admin privileges
- Secrets: Never exposed to client

---

## 10. Migration from v1 to v2

### Before (v1)

```typescript
import * as functions from 'firebase-functions';

export const myFunction = functions.https.onRequest((req, res) => {
  const apiKey = process.env.API_KEY; // ❌ Direct env access
  res.send('OK');
});
```

### After (v2)

```typescript
import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';

const API_KEY = defineSecret('API_KEY');

export const myFunction = onRequest(
  { secrets: [API_KEY] },
  (req, res) => {
    const apiKey = API_KEY.value(); // ✅ Secret via defineSecret
    res.send('OK');
  }
);
```

---

## References

- [Firebase Functions v2 Docs](https://firebase.google.com/docs/functions/2nd-gen)
- [defineSecret API](https://firebase.google.com/docs/functions/config-env#secret-manager)
- [FCM Admin SDK](https://firebase.google.com/docs/cloud-messaging/admin/send-messages)
- [Firestore Triggers v2](https://firebase.google.com/docs/functions/firestore-events-2nd-gen)
