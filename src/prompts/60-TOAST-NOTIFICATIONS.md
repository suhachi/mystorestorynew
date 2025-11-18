# 60 - Toast Notifications System

## 📌 목표
완전한 Toast 알림 시스템을 구축합니다. (이미 Sonner 존재)

**결과물**:
- Sonner Toast 시스템 활용
- 알림 패턴
- 사용자 피드백

**총 개념 정리**

---

## 🔄 STEP 1: Sonner Toast System

### 프롬프트 템플릿

```
Sonner를 활용한 Toast 알림 시스템을 구축합니다.

## 1. Sonner 설정 (이미 존재)

/components/ui/sonner.tsx 활용:

App.tsx에 Toaster 추가:

```typescript
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* 라우트들 */}
        </Routes>
      </Router>
      
      {/* Toast 컨테이너 */}
      <Toaster />
    </>
  );
}
```

## 2. 기본 Toast 사용법

```typescript
import { toast } from 'sonner@2.0.3';

// 성공 알림
toast.success('주문이 완료되었습니다');

// 에러 알림
toast.error('주문 처리에 실패했습니다');

// 정보 알림
toast.info('새로운 주문이 도착했습니다');

// 경고 알림
toast.warning('재고가 부족합니다');

// 로딩 알림
const toastId = toast.loading('처리중...');

// 업데이트
toast.success('완료!', { id: toastId });

// 기본 알림
toast('알림 메시지');
```

## 3. 고급 Toast 옵션

### 설명 추가

```typescript
toast.success('주문 완료', {
  description: '주문번호: #12345'
});

toast.error('로그인 실패', {
  description: '이메일 또는 비밀번호를 확인해주세요'
});
```

### 액션 버튼

```typescript
toast.success('메뉴가 추가되었습니다', {
  action: {
    label: '취소',
    onClick: () => {
      console.log('취소됨');
    }
  }
});

toast.info('새 주문이 도착했습니다', {
  action: {
    label: '확인',
    onClick: () => {
      // 주문 페이지로 이동
      window.location.href = '/store/orders';
    }
  }
});
```

### 지속 시간 설정

```typescript
// 5초간 표시
toast.success('저장되었습니다', {
  duration: 5000
});

// 무한 표시 (수동으로 닫아야 함)
toast.info('중요한 공지사항', {
  duration: Infinity
});
```

### 위치 설정

```typescript
toast.success('알림', {
  position: 'top-right' // top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
});
```

## 4. Promise Toast

비동기 작업 처리:

```typescript
async function saveData() {
  await toast.promise(
    saveToDatabase(), 
    {
      loading: '저장중...',
      success: '저장되었습니다',
      error: '저장에 실패했습니다'
    }
  );
}

// 더 자세한 메시지
toast.promise(
  createOrder(),
  {
    loading: '주문 생성중...',
    success: (data) => `주문 #${data.orderId}가 생성되었습니다`,
    error: (err) => `에러: ${err.message}`
  }
);
```

## 5. Custom Toast

### 커스텀 컴포넌트

```typescript
import { toast } from 'sonner@2.0.3';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

function OrderCompleteToast({ orderId }: { orderId: string }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle className="w-6 h-6 text-green-500" />
      <div>
        <p className="font-bold">주문 완료!</p>
        <p className="text-sm text-gray-600">주문번호: #{orderId}</p>
      </div>
    </div>
  );
}

// 사용
toast.custom((t) => <OrderCompleteToast orderId="12345" />);
```

### 커스텀 스타일

```typescript
toast.success('성공!', {
  className: 'bg-green-50 border-green-200',
  style: {
    background: '#f0fdf4',
    borderColor: '#86efac'
  }
});
```

## 6. Toast 패턴별 사용

### CRUD 작업

```typescript
// 생성
async function createItem() {
  try {
    const result = await api.create(data);
    toast.success('항목이 생성되었습니다');
    return result;
  } catch (error) {
    toast.error('생성에 실패했습니다');
    throw error;
  }
}

// 수정
async function updateItem() {
  const toastId = toast.loading('수정중...');
  
  try {
    await api.update(data);
    toast.success('수정되었습니다', { id: toastId });
  } catch (error) {
    toast.error('수정에 실패했습니다', { id: toastId });
  }
}

// 삭제
async function deleteItem() {
  toast.success('삭제되었습니다', {
    action: {
      label: '취소',
      onClick: async () => {
        await api.restore(itemId);
        toast.success('복구되었습니다');
      }
    }
  });
}
```

### 폼 검증

```typescript
function validateForm() {
  if (!email) {
    toast.error('이메일을 입력해주세요');
    return false;
  }

  if (!isValidEmail(email)) {
    toast.error('올바른 이메일 형식이 아닙니다', {
      description: 'example@domain.com 형식으로 입력해주세요'
    });
    return false;
  }

  return true;
}
```

### 파일 업로드

```typescript
async function uploadFile(file: File) {
  const toastId = toast.loading(`${file.name} 업로드 중...`);

  try {
    const result = await uploadToServer(file);
    
    toast.success('업로드 완료!', {
      id: toastId,
      description: `${file.name} (${formatFileSize(file.size)})`
    });
    
    return result;
  } catch (error) {
    toast.error('업로드 실패', {
      id: toastId,
      description: error.message,
      action: {
        label: '재시도',
        onClick: () => uploadFile(file)
      }
    });
  }
}
```

### 실시간 알림

```typescript
// Firebase에서 새 주문 수신
onSnapshot(ordersCollection, (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === 'added') {
      const order = change.doc.data();
      
      toast.info('새 주문이 도착했습니다!', {
        description: `${order.customerName} - ${order.items.length}개 상품`,
        action: {
          label: '확인',
          onClick: () => {
            window.location.href = `/store/orders/${order.id}`;
          }
        },
        duration: 10000
      });
      
      // 사운드 재생
      playNotificationSound();
    }
  });
});
```

## 7. Toast Helper 함수

```typescript
// /utils/toast-helpers.ts
import { toast } from 'sonner@2.0.3';

export const toastHelpers = {
  // 성공 메시지
  success: (message: string, description?: string) => {
    toast.success(message, { description });
  },

  // 에러 메시지
  error: (message: string, error?: any) => {
    toast.error(message, {
      description: error?.message || '다시 시도해주세요'
    });
  },

  // 저장 완료
  saved: () => {
    toast.success('저장되었습니다');
  },

  // 복사 완료
  copied: () => {
    toast.success('복사되었습니다');
  },

  // 삭제 확인
  deleteConfirm: (onConfirm: () => void) => {
    toast.info('정말 삭제하시겠습니까?', {
      action: {
        label: '삭제',
        onClick: onConfirm
      }
    });
  },

  // 권한 없음
  noPermission: () => {
    toast.error('권한이 없습니다', {
      description: '관리자에게 문의하세요'
    });
  },

  // 네트워크 에러
  networkError: () => {
    toast.error('네트워크 오류', {
      description: '인터넷 연결을 확인해주세요'
    });
  }
};

// 사용
import { toastHelpers } from './utils/toast-helpers';

toastHelpers.saved();
toastHelpers.copied();
toastHelpers.deleteConfirm(() => deleteItem());
```

## 8. 전역 Toast 설정

```typescript
// Toaster 커스터마이징
<Toaster 
  position="top-right"
  toastOptions={{
    duration: 3000,
    className: 'font-sans',
    style: {
      background: 'white',
      border: '1px solid #e2e8f0'
    }
  }}
  richColors // success는 초록, error는 빨강 등
  closeButton // X 버튼 표시
/>
```

## 9. 모바일 최적화

```typescript
import { useIsMobile } from './components/ui/use-mobile';

function useToast() {
  const isMobile = useIsMobile();

  const show = (message: string, options = {}) => {
    toast(message, {
      position: isMobile ? 'bottom-center' : 'top-right',
      duration: isMobile ? 2000 : 3000,
      ...options
    });
  };

  return { show };
}

// 사용
const { show } = useToast();
show('알림 메시지');
```

## 10. Toast 큐 관리

```typescript
// 동시에 여러 Toast 표시 제한
let toastCount = 0;
const MAX_TOASTS = 3;

function showToast(message: string) {
  if (toastCount >= MAX_TOASTS) {
    console.log('Too many toasts, skipping:', message);
    return;
  }

  toastCount++;
  
  toast(message, {
    onDismiss: () => {
      toastCount--;
    },
    onAutoClose: () => {
      toastCount--;
    }
  });
}
```

IMPORTANT:
- Sonner 라이브러리 사용 (이미 설치됨)
- 4가지 타입 (success, error, info, warning)
- Promise Toast (비동기 작업)
- 액션 버튼 지원
- 커스텀 컴포넌트 가능
- 모바일 최적화
```

---

## 📝 핵심 포인트

### Toast 타입
1. **success**: 성공 (초록)
2. **error**: 실패 (빨강)
3. **info**: 정보 (파랑)
4. **warning**: 경고 (노랑)
5. **loading**: 로딩 (회전)

### 모범 사례
- **간결한 메시지**: 한 줄로 요약
- **설명 추가**: description으로 상세 정보
- **액션 제공**: 실행 취소, 재시도 버튼
- **적절한 지속 시간**: 중요도에 따라 조절

---

## ✅ 완료 체크리스트

- [ ] Sonner 설정
- [ ] 기본 Toast 사용
- [ ] Promise Toast
- [ ] Custom Toast
- [ ] Toast Helper
- [ ] 모바일 최적화

---

## 📝 다음 단계

**61-ACCESSIBILITY.md**로 이동합니다.
