# 69 - Database Backup & Recovery

## 📌 목표
Firestore 백업 및 복구 시스템을 구축합니다.

**결과물**:
- 자동 백업
- 수동 백업
- 데이터 복구
- 마이그레이션

**총 개념 정리**

---

## 🔄 STEP 1: Firestore 자동 백업

### 프롬프트 템플릿

```
Firestore 데이터 백업 및 복구 시스템을 구축합니다.

## 1. GCP 자동 백업 설정

### Cloud Console에서 설정

1. **Cloud Firestore 백업 활성화**
   - GCP Console > Firestore > 백업
   - "백업 일정 만들기" 클릭

2. **백업 일정 설정**
   ```
   - 이름: daily-backup
   - 빈도: 매일
   - 시간: 02:00 (사용량 적은 시간)
   - 보관 기간: 30일
   - 위치: asia-northeast3 (서울)
   ```

3. **자동 백업 확인**
   ```bash
   gcloud firestore operations list
   ```

## 2. gcloud CLI로 수동 백업

### 백업 생성

```bash
# 전체 백업
gcloud firestore export gs://mystorestory-backup/$(date +%Y%m%d) \
  --project=mystorestory-prod

# 특정 컬렉션만 백업
gcloud firestore export gs://mystorestory-backup/$(date +%Y%m%d) \
  --collection-ids=orders,users,stores \
  --project=mystorestory-prod

# 백업 상태 확인
gcloud firestore operations list --project=mystorestory-prod
```

### 백업 스크립트

scripts/backup.sh:

```bash
#!/bin/bash

PROJECT_ID="mystorestory-prod"
BUCKET="gs://mystorestory-backup"
DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_PATH="$BUCKET/$DATE"

echo "🔄 Starting Firestore backup..."
echo "Project: $PROJECT_ID"
echo "Backup path: $BACKUP_PATH"

# 백업 실행
gcloud firestore export $BACKUP_PATH \
  --project=$PROJECT_ID

if [ $? -eq 0 ]; then
  echo "✅ Backup completed successfully!"
  echo "📦 Backup location: $BACKUP_PATH"
  
  # Slack 알림 (선택)
  curl -X POST $SLACK_WEBHOOK_URL \
    -H 'Content-Type: application/json' \
    -d "{\"text\":\"✅ Firestore backup completed: $BACKUP_PATH\"}"
else
  echo "❌ Backup failed!"
  exit 1
fi

# 30일 이상 된 백업 삭제
echo "🗑️  Cleaning old backups..."
gsutil -m rm -r $(gsutil ls $BUCKET | grep -v "$(date +%Y%m --date='30 days ago')")

echo "✅ Cleanup completed!"
```

## 3. Cloud Storage 버킷 생성

```bash
# 백업용 버킷 생성
gsutil mb -l asia-northeast3 gs://mystorestory-backup

# 버킷 수명 주기 설정 (30일 후 자동 삭제)
cat > lifecycle.json << EOF
{
  "lifecycle": {
    "rule": [
      {
        "action": {"type": "Delete"},
        "condition": {"age": 30}
      }
    ]
  }
}
EOF

gsutil lifecycle set lifecycle.json gs://mystorestory-backup
```

## 4. 데이터 복구

### 전체 복구

```bash
# 백업 목록 확인
gsutil ls gs://mystorestory-backup/

# 특정 백업 복구
gcloud firestore import gs://mystorestory-backup/20241101-020000 \
  --project=mystorestory-prod

# 복구 상태 확인
gcloud firestore operations list --project=mystorestory-prod
```

### 특정 컬렉션만 복구

```bash
gcloud firestore import gs://mystorestory-backup/20241101-020000 \
  --collection-ids=orders \
  --project=mystorestory-prod
```

## 5. 데이터 마이그레이션

### 개발 → 스테이징 복사

```bash
# 개발 환경에서 내보내기
gcloud firestore export gs://mystorestory-backup/dev-to-staging \
  --project=mystorestory-dev

# 스테이징 환경으로 가져오기
gcloud firestore import gs://mystorestory-backup/dev-to-staging \
  --project=mystorestory-staging
```

## 6. Cloud Functions로 자동 백업

functions/src/scheduledBackup.ts:

```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const scheduledFirestoreBackup = functions
  .region('asia-northeast3')
  .pubsub
  .schedule('0 2 * * *')  // 매일 02:00
  .timeZone('Asia/Seoul')
  .onRun(async (context) => {
    const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;
    const databaseName = `projects/${projectId}/databases/(default)`;
    
    const client = new admin.firestore.v1.FirestoreAdminClient();
    
    const timestamp = new Date().toISOString().split('T')[0];
    const bucket = `gs://mystorestory-backup/${timestamp}`;

    try {
      const [operation] = await client.exportDocuments({
        name: databaseName,
        outputUriPrefix: bucket,
        collectionIds: []  // 빈 배열 = 모든 컬렉션
      });

      console.log(`Backup started: ${operation.name}`);
      
      // Slack 알림
      await notifySlack(`✅ Firestore backup started: ${bucket}`);
      
      return { success: true, operation: operation.name };
    } catch (error) {
      console.error('Backup failed:', error);
      
      // 에러 알림
      await notifySlack(`❌ Firestore backup failed: ${error.message}`);
      
      throw error;
    }
  });

async function notifySlack(message: string) {
  // Slack Webhook 호출
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (webhookUrl) {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message })
    });
  }
}
```

배포:

```bash
firebase deploy --only functions:scheduledFirestoreBackup
```

## 7. 백업 모니터링

### Cloud Monitoring 알림

```bash
# gcloud CLI로 알림 정책 생성
gcloud alpha monitoring policies create \
  --notification-channels=CHANNEL_ID \
  --display-name="Firestore Backup Failed" \
  --condition-display-name="Backup Operation Failed" \
  --condition-threshold-value=1 \
  --condition-threshold-duration=60s
```

## 8. 데이터 무결성 검증

scripts/verify-backup.sh:

```bash
#!/bin/bash

BACKUP_PATH=$1

if [ -z "$BACKUP_PATH" ]; then
  echo "Usage: ./scripts/verify-backup.sh gs://bucket/path"
  exit 1
fi

echo "🔍 Verifying backup: $BACKUP_PATH"

# 백업 파일 목록
echo "📁 Files in backup:"
gsutil ls -r $BACKUP_PATH

# 백업 메타데이터 확인
METADATA=$(gsutil ls -L $BACKUP_PATH/all_namespaces/all_kinds/all_namespaces_all_kinds.export_metadata)

echo ""
echo "📊 Backup metadata:"
echo "$METADATA"

# 파일 크기 확인
SIZE=$(gsutil du -s $BACKUP_PATH | awk '{print $1}')
echo ""
echo "💾 Total backup size: $(numfmt --to=iec-i --suffix=B $SIZE)"

echo ""
echo "✅ Backup verification completed!"
```

## 9. 복구 테스트

scripts/test-restore.sh:

```bash
#!/bin/bash

echo "⚠️  TESTING RESTORE - USE TEST PROJECT ONLY"
echo ""

# 테스트 프로젝트로 전환
firebase use mystorestory-test

# 최신 백업 찾기
LATEST_BACKUP=$(gsutil ls gs://mystorestory-backup/ | sort -r | head -1)

echo "📦 Latest backup: $LATEST_BACKUP"
echo ""
read -p "Continue with restore test? (y/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "🔄 Starting restore..."
  
  gcloud firestore import $LATEST_BACKUP \
    --project=mystorestory-test
  
  echo "✅ Restore test completed!"
  echo "🔍 Please verify data in test project"
else
  echo "❌ Restore test cancelled"
fi
```

## 10. 재해 복구 계획 (DRP)

### 복구 시간 목표 (RTO)

- **긴급**: 1시간 이내
- **일반**: 4시간 이내
- **낮은 우선순위**: 24시간 이내

### 복구 지점 목표 (RPO)

- **일일 백업**: 최대 24시간 데이터 손실
- **실시간 복제**: 데이터 손실 없음 (Firestore 자동)

### 복구 절차

1. **문제 확인**
   ```bash
   # Firestore 상태 확인
   gcloud firestore operations list
   ```

2. **백업 선택**
   ```bash
   # 최신 백업 찾기
   gsutil ls -l gs://mystorestory-backup/ | sort -k2 -r
   ```

3. **복구 실행**
   ```bash
   # 선택한 백업 복구
   gcloud firestore import gs://mystorestory-backup/YYYYMMDD
   ```

4. **검증**
   ```bash
   # 데이터 확인
   # 애플리케이션 테스트
   # 사용자 피드백 수집
   ```

5. **알림**
   - 팀에 복구 완료 알림
   - 사용자에게 서비스 정상화 공지

## 11. 백업 체크리스트

```markdown
### 일일 백업
- [ ] 자동 백업 실행 확인
- [ ] 백업 크기 확인
- [ ] 에러 로그 확인

### 주간 백업
- [ ] 백업 무결성 검증
- [ ] 복구 테스트 (테스트 환경)
- [ ] 오래된 백업 정리

### 월간 백업
- [ ] 재해 복구 계획 리뷰
- [ ] 백업 저장소 용량 확인
- [ ] 복구 절차 문서 업데이트
```

IMPORTANT:
- GCP 자동 백업 (매일)
- 수동 백업 스크립트
- Cloud Storage 버킷
- 데이터 복구 절차
- 마이그레이션 스크립트
- 백업 모니터링
- 복구 테스트
- DRP (재해 복구 계획)
```

---

## 📝 핵심 포인트

### 백업 전략 (3-2-1 규칙)
- **3개 복사본**: 원본 + 2개 백업
- **2개 다른 미디어**: Cloud Storage + 로컬
- **1개 오프사이트**: 다른 지역

### RTO vs RPO
- **RTO** (Recovery Time Objective): 복구 시간
- **RPO** (Recovery Point Objective): 데이터 손실 허용

---

## ✅ 완료 체크리스트

- [ ] 자동 백업 설정
- [ ] 백업 스크립트
- [ ] 복구 절차
- [ ] 백업 모니터링
- [ ] 복구 테스트
- [ ] DRP 문서

---

## 📝 다음 단계

**70-MONITORING-LOGGING.md**로 이동합니다.
