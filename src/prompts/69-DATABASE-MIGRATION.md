# 69 - Database Migration & Backup

## 📌 목표
Firestore 데이터베이스 마이그레이션과 백업 시스템을 구축합니다.

**결과물**:
- 데이터 마이그레이션 스크립트
- 백업 자동화
- 복구 절차

**총 데이터 관리 시스템**

---

## 🔄 STEP 1: Firestore 마이그레이션

### 프롬프트 템플릿

```
Firestore 데이터 마이그레이션과 백업 시스템을 구축합니다.

## 1. 데이터 마이그레이션 개요

### 마이그레이션 시나리오
- 스키마 변경
- 새 필드 추가
- 데이터 구조 변경
- 환경 간 데이터 복사

## 2. 마이그레이션 스크립트

/scripts/migrate-data.ts 생성:

```typescript
import * as admin from 'firebase-admin';
import * as serviceAccount from './serviceAccountKey.json';

// Firebase Admin 초기화
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any)
});

const db = admin.firestore();

// 마이그레이션 함수들
async function addFieldToOrders() {
  console.log('📦 주문에 새 필드 추가 중...');
  
  const ordersRef = db.collection('orders');
  const snapshot = await ordersRef.get();
  
  const batch = db.batch();
  let count = 0;
  
  snapshot.forEach((doc) => {
    // 기존 데이터에 새 필드 추가
    batch.update(doc.ref, {
      deliveryMethod: 'delivery', // 기본값
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    count++;
    
    // Batch는 500개 제한
    if (count === 500) {
      console.log('500개 처리 완료, 배치 커밋...');
      batch.commit();
      count = 0;
    }
  });
  
  // 남은 것들 커밋
  if (count > 0) {
    await batch.commit();
  }
  
  console.log(`✅ 총 ${snapshot.size}개 주문 업데이트 완료`);
}

async function updateStoreStructure() {
  console.log('🏪 상점 구조 업데이트 중...');
  
  const storesRef = db.collection('stores');
  const snapshot = await storesRef.get();
  
  for (const doc of snapshot.docs) {
    const data = doc.data();
    
    // 기존 구조에서 새 구조로 변경
    const newData = {
      ...data,
      settings: {
        operatingHours: data.operatingHours || {},
        deliveryRadius: data.deliveryRadius || 3,
        minimumOrder: data.minimumOrder || 15000,
        acceptsOrders: data.isOpen !== undefined ? data.isOpen : true
      },
      // 기존 필드 삭제
      operatingHours: admin.firestore.FieldValue.delete(),
      deliveryRadius: admin.firestore.FieldValue.delete(),
      minimumOrder: admin.firestore.FieldValue.delete(),
      isOpen: admin.firestore.FieldValue.delete()
    };
    
    await doc.ref.update(newData);
  }
  
  console.log(`✅ 총 ${snapshot.size}개 상점 업데이트 완료`);
}

async function migrateMenuCategories() {
  console.log('🍽️ 메뉴 카테고리 마이그레이션 중...');
  
  const menusRef = db.collection('menus');
  const snapshot = await menusRef.get();
  
  const categoryMap: Record<string, string> = {
    '음료': 'beverage',
    '커피': 'coffee',
    '디저트': 'dessert',
    '음식': 'food'
  };
  
  const batch = db.batch();
  
  snapshot.forEach((doc) => {
    const data = doc.data();
    const oldCategory = data.category;
    const newCategory = categoryMap[oldCategory] || 'other';
    
    batch.update(doc.ref, {
      category: newCategory,
      categoryLegacy: oldCategory // 기존 값 보존
    });
  });
  
  await batch.commit();
  console.log(`✅ 총 ${snapshot.size}개 메뉴 카테고리 업데이트 완료`);
}

// 실행
async function runMigrations() {
  try {
    console.log('🚀 마이그레이션 시작...\n');
    
    await addFieldToOrders();
    await updateStoreStructure();
    await migrateMenuCategories();
    
    console.log('\n✅ 모든 마이그레이션 완료!');
    process.exit(0);
  } catch (error) {
    console.error('❌ 마이그레이션 실패:', error);
    process.exit(1);
  }
}

runMigrations();
```

실행:

```bash
# TypeScript 실행
npx ts-node scripts/migrate-data.ts

# 또는 컴파일 후 실행
tsc scripts/migrate-data.ts
node scripts/migrate-data.js
```

## 3. 백업 스크립트

/scripts/backup-firestore.sh 생성:

```bash
#!/bin/bash

# 설정
PROJECT_ID="mystorestory-prod"
BUCKET_NAME="gs://mystorestory-backup"
DATE=$(date +%Y-%m-%d-%H-%M-%S)
BACKUP_NAME="firestore-backup-${DATE}"

echo "📦 Firestore 백업 시작..."
echo "프로젝트: $PROJECT_ID"
echo "버킷: $BUCKET_NAME"
echo "백업명: $BACKUP_NAME"

# Firestore 백업 (gcloud 명령어 필요)
gcloud firestore export \
  $BUCKET_NAME/$BACKUP_NAME \
  --project=$PROJECT_ID \
  --async

echo "✅ 백업 작업이 시작되었습니다"
echo "상태 확인: gcloud firestore operations list --project=$PROJECT_ID"
```

실행 권한:

```bash
chmod +x scripts/backup-firestore.sh
./scripts/backup-firestore.sh
```

## 4. 백업 복구 스크립트

/scripts/restore-firestore.sh 생성:

```bash
#!/bin/bash

# 설정
PROJECT_ID="mystorestory-prod"
BUCKET_NAME="gs://mystorestory-backup"

# 백업 목록 확인
echo "📋 백업 목록:"
gsutil ls $BUCKET_NAME/

# 백업명 입력
read -p "복구할 백업명 입력: " BACKUP_NAME

echo "⚠️  경고: 기존 데이터가 덮어씌워집니다!"
read -p "계속하시겠습니까? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
  echo "❌ 취소되었습니다"
  exit 0
fi

echo "📥 Firestore 복구 시작..."

gcloud firestore import \
  $BUCKET_NAME/$BACKUP_NAME \
  --project=$PROJECT_ID \
  --async

echo "✅ 복구 작업이 시작되었습니다"
```

## 5. 자동 백업 (Cloud Scheduler)

Cloud Functions로 자동 백업:

/functions/src/scheduled/autoBackup.ts:

```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// 매일 새벽 3시 백업
export const scheduledFirestoreBackup = functions
  .region('asia-northeast3')
  .pubsub.schedule('0 3 * * *')  // Cron 표현식
  .timeZone('Asia/Seoul')
  .onRun(async (context) => {
    const projectId = process.env.GCP_PROJECT;
    const databaseName = `projects/${projectId}/databases/(default)`;
    
    const client = new admin.firestore.v1.FirestoreAdminClient();
    
    const timestamp = new Date().toISOString().split('T')[0];
    const bucket = `gs://mystorestory-backup/scheduled/${timestamp}`;
    
    try {
      const [operation] = await client.exportDocuments({
        name: databaseName,
        outputUriPrefix: bucket
      });
      
      console.log('✅ 백업 시작:', operation.name);
      
      return { success: true, operation: operation.name };
    } catch (error) {
      console.error('❌ 백업 실패:', error);
      throw error;
    }
  });
```

배포:

```bash
firebase deploy --only functions:scheduledFirestoreBackup
```

## 6. 데이터 검증 스크립트

/scripts/validate-data.ts:

```typescript
import * as admin from 'firebase-admin';

const db = admin.firestore();

async function validateOrders() {
  console.log('🔍 주문 데이터 검증 중...');
  
  const ordersRef = db.collection('orders');
  const snapshot = await ordersRef.get();
  
  const errors = [];
  
  snapshot.forEach((doc) => {
    const data = doc.data();
    
    // 필수 필드 확인
    if (!data.customerId) {
      errors.push(`주문 ${doc.id}: customerId 누락`);
    }
    
    if (!data.storeId) {
      errors.push(`주문 ${doc.id}: storeId 누락`);
    }
    
    if (!data.items || data.items.length === 0) {
      errors.push(`주문 ${doc.id}: items 비어있음`);
    }
    
    if (!data.total || data.total <= 0) {
      errors.push(`주문 ${doc.id}: total 유효하지 않음`);
    }
    
    // 상태 확인
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'completed', 'cancelled'];
    if (!validStatuses.includes(data.status)) {
      errors.push(`주문 ${doc.id}: 유효하지 않은 status - ${data.status}`);
    }
  });
  
  if (errors.length > 0) {
    console.error(`❌ ${errors.length}개 오류 발견:`);
    errors.forEach(err => console.error(`   - ${err}`));
  } else {
    console.log(`✅ 모든 주문 데이터 정상 (${snapshot.size}개)`);
  }
  
  return errors.length === 0;
}

async function validateStores() {
  console.log('🔍 상점 데이터 검증 중...');
  
  const storesRef = db.collection('stores');
  const snapshot = await storesRef.get();
  
  const errors = [];
  
  snapshot.forEach((doc) => {
    const data = doc.data();
    
    if (!data.name) {
      errors.push(`상점 ${doc.id}: name 누락`);
    }
    
    if (!data.ownerId) {
      errors.push(`상점 ${doc.id}: ownerId 누락`);
    }
    
    if (!data.category) {
      errors.push(`상점 ${doc.id}: category 누락`);
    }
  });
  
  if (errors.length > 0) {
    console.error(`❌ ${errors.length}개 오류 발견:`);
    errors.forEach(err => console.error(`   - ${err}`));
  } else {
    console.log(`✅ 모든 상점 데이터 정상 (${snapshot.size}개)`);
  }
  
  return errors.length === 0;
}

async function runValidation() {
  const ordersValid = await validateOrders();
  const storesValid = await validateStores();
  
  if (ordersValid && storesValid) {
    console.log('\n✅ 모든 데이터 검증 통과');
    process.exit(0);
  } else {
    console.log('\n❌ 데이터 검증 실패');
    process.exit(1);
  }
}

runValidation();
```

## 7. 환경 간 데이터 복사

/scripts/copy-data.ts:

```typescript
import * as admin from 'firebase-admin';

// Source (스테이징)
const sourceApp = admin.initializeApp({
  credential: admin.credential.cert('./staging-key.json')
}, 'source');
const sourceDb = sourceApp.firestore();

// Target (개발)
const targetApp = admin.initializeApp({
  credential: admin.credential.cert('./dev-key.json')
}, 'target');
const targetDb = targetApp.firestore();

async function copyCollection(collectionName: string) {
  console.log(`📦 ${collectionName} 복사 중...`);
  
  const sourceSnapshot = await sourceDb.collection(collectionName).get();
  
  const batch = targetDb.batch();
  let count = 0;
  
  for (const doc of sourceSnapshot.docs) {
    const targetRef = targetDb.collection(collectionName).doc(doc.id);
    batch.set(targetRef, doc.data());
    count++;
    
    if (count === 500) {
      await batch.commit();
      count = 0;
    }
  }
  
  if (count > 0) {
    await batch.commit();
  }
  
  console.log(`✅ ${sourceSnapshot.size}개 문서 복사 완료`);
}

async function copyAllData() {
  const collections = ['stores', 'menus', 'users'];
  
  for (const collection of collections) {
    await copyCollection(collection);
  }
  
  console.log('✅ 모든 데이터 복사 완료');
}

copyAllData();
```

## 8. 백업 보존 정책

Cloud Storage Lifecycle 설정:

```json
{
  "lifecycle": {
    "rule": [
      {
        "action": {
          "type": "Delete"
        },
        "condition": {
          "age": 90,
          "matchesPrefix": ["firestore-backup-"]
        }
      },
      {
        "action": {
          "type": "SetStorageClass",
          "storageClass": "NEARLINE"
        },
        "condition": {
          "age": 30,
          "matchesPrefix": ["firestore-backup-"]
        }
      }
    ]
  }
}
```

적용:

```bash
gsutil lifecycle set lifecycle.json gs://mystorestory-backup
```

## 9. 백업 모니터링

Slack 알림:

```typescript
async function notifyBackupStatus(success: boolean, details: string) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  
  const message = {
    text: success ? '✅ 백업 성공' : '❌ 백업 실패',
    attachments: [{
      color: success ? 'good' : 'danger',
      fields: [{
        title: '상세',
        value: details,
        short: false
      }, {
        title: '시간',
        value: new Date().toISOString(),
        short: true
      }]
    }]
  };
  
  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message)
  });
}
```

IMPORTANT:
- 마이그레이션 스크립트 (스키마 변경)
- 백업 자동화 (Cloud Scheduler)
- 복구 절차
- 데이터 검증
- 환경 간 복사
- 보존 정책 (90일)
- 모니터링 & 알림
```

---

## 📝 핵심 포인트

### 마이그레이션 전략
1. **테스트 환경 먼저**: 스테이징에서 테스트
2. **백업 필수**: 마이그레이션 전 백업
3. **롤백 계획**: 실패 시 복구 방법
4. **점진적 적용**: 배치로 나눠서 처리

### 백업 정책
- **일일 백업**: Cloud Scheduler
- **보존 기간**: 90일
- **스토리지 클래스**: 30일 후 NEARLINE

---

## ✅ 완료 체크리스트

- [ ] 마이그레이션 스크립트
- [ ] 백업 스크립트
- [ ] 복구 절차
- [ ] 자동 백업 (Scheduler)
- [ ] 데이터 검증
- [ ] 모니터링

---

## 📝 다음 단계

**70-MONITORING-LOGGING.md**로 이동합니다.
