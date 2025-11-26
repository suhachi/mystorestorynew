// src/pages/customer/CustomerOrderTrackPage.tsx
import React from 'react';

const parseOrderIdFromHash = (): string | null => {
  try {
    // 예: "#/customer-order-track?orderId=TEST-ORDER-123"
    const hash = window.location.hash || '';
    const [_, query = ''] = hash.split('?');
    const params = new URLSearchParams(query);
    return params.get('orderId');
  } catch {
    return null;
  }
};

const CustomerOrderTrackPage: React.FC = () => {
  const [orderId, setOrderId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setOrderId(parseOrderIdFromHash());
  }, []);

  // STEP 3-C: Missing orderId fallback UI
  if (!orderId) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h1 className="text-lg font-semibold text-gray-900 mb-2">
          주문 정보를 찾을 수 없습니다
        </h1>
        <p className="text-sm text-gray-600 mb-4">
          잘못된 링크이거나 주문이 만료되었을 수 있습니다.
        </p>
        <button
          className="px-4 py-2 rounded-md bg-black text-white text-sm hover:bg-gray-800 transition-colors"
          onClick={() => (window.location.href = '/#/')}
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-md px-4 py-6">
        <h1 className="text-lg font-semibold text-gray-900 mb-2">
          주문이 완료되었습니다
        </h1>
        {orderId && (
          <p className="text-sm text-gray-700">
            주문번호: <span className="font-mono">{orderId}</span>
          </p>
        )}
        <p className="mt-3 text-sm text-gray-600">
          주문 상태는 매장에서 확인 후 순차적으로 업데이트됩니다.
        </p>
      </div>
    </div>
  );
};

export default CustomerOrderTrackPage;
