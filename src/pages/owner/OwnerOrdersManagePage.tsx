import { useState } from 'react';

interface MockOrder {
  id: string;
  status: string;
  customerName: string;
  total: number;
}

export function OwnerOrdersManagePage() {
  // Mock data for S2 test
  const [orders, setOrders] = useState<MockOrder[]>([
    { id: 'ORD-001', status: 'NEW', customerName: '홍길동', total: 15000 },
    { id: 'ORD-002', status: 'CONFIRMED', customerName: '김철수', total: 22000 },
    { id: 'ORD-003', status: 'DELIVERING', customerName: '이영희', total: 8500 }
  ]);

  // STEP 3-B: Status change with error handling
  const updateStatus = (orderId: string, newStatus: string) => {
    try {
      setOrders(prev => prev.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('[OwnerOrdersManagePage] 상태 변경 실패:', error);
      alert('주문 상태를 변경하는 중 문제가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto" data-testid="owner-orders-manage-page">
      <h1 className="text-2xl font-bold mb-6">주문 관리</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">주문 ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">고객명</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">금액</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map(order => (
              <tr key={order.id} data-testid={`order-row-${order.id}`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customerName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${order.status === 'NEW' ? 'bg-green-100 text-green-800' :
                      order.status === 'COOKING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.total.toLocaleString()}원</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {order.status === 'NEW' && (
                    <button
                      data-testid={`change-status-${order.id}`}
                      onClick={() => updateStatus(order.id, 'COOKING')}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      조리중으로 변경
                    </button>
                  )}
                  {order.status === 'COOKING' && (
                    <button
                      onClick={() => updateStatus(order.id, 'DELIVERING')}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      배달시작
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
