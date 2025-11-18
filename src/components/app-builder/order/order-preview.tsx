import React from 'react';
import { OrderConfig } from '../../../hooks/useOrderConfig';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { 
  ShoppingCart, Activity, CreditCard, Bell, BarChart3, 
  Crown, Zap, Star, Target, Clock, TrendingUp,
  AlertTriangle, CheckCircle, Eye, Settings,
  Users, DollarSign, Brain, Shield, MessageSquare,
  Smartphone, RefreshCw, Search, Filter
} from 'lucide-react';

interface OrderPreviewProps {
  config: OrderConfig;
  plan: 'Basic' | 'Pro' | 'Enterprise';
  isCompact?: boolean;
}

export function OrderPreview({ config, plan, isCompact = false }: OrderPreviewProps) {
  
  // Mock 주문 데이터
  const mockOrders = [
    { id: '#2024-001', customer: '김민수', items: '불고기 버거 세트', amount: 12900, status: 'completed', time: '12:34' },
    { id: '#2024-002', customer: '이영희', items: '치킨 샐러드', amount: 8500, status: 'preparing', time: '12:28' },
    { id: '#2024-003', customer: '박철수', items: '아메리카노 2잔', amount: 9000, status: 'ready', time: '12:25' },
    { id: '#2024-004', customer: '정수연', items: '피자 마르게리타', amount: 15000, status: 'pending', time: '12:20' },
    { id: '#2024-005', customer: '최지훈', items: '파스타 세트', amount: 13500, status: 'confirmed', time: '12:15' }
  ];

  const mockPayments = [
    { method: '카드결제', count: 15, amount: 187500, percentage: 65 },
    { method: '현금결제', count: 8, amount: 95000, percentage: 25 },
    { method: '앱결제', count: 4, amount: 48000, percentage: 10 }
  ];

  // 주문 관리 미리보기 렌더링
  const renderOrderManagement = () => {
    if (!config.orderManagement.orderList) return null;

    return (
      <div className="space-y-3">
        <h4 className="text-body-small font-medium text-gray-700 flex items-center gap-1">
          <ShoppingCart className="w-3 h-3" />
          주문 관리
        </h4>
        
        <div className={`grid ${isCompact ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'} gap-2`}>
          {config.orderManagement.orderList && (
            <div className="p-2 rounded-lg border bg-white">
              <div className="flex items-center gap-1 mb-1">
                <ShoppingCart className="w-2 h-2 text-blue-600" />
                <span className="text-xs font-medium text-gray-900 truncate">
                  주문 목록
                </span>
              </div>
              <div className="text-xs text-gray-500">
                실시간 주문 관리
              </div>
            </div>
          )}
          
          {config.orderManagement.statusManagement && (
            <div className="p-2 rounded-lg border bg-white">
              <div className="flex items-center gap-1 mb-1">
                <Activity className="w-2 h-2 text-green-600" />
                <span className="text-xs font-medium text-gray-900 truncate">
                  상태 관리
                </span>
              </div>
              <div className="text-xs text-gray-500">
                주문 상태 추적
              </div>
            </div>
          )}
          
          {config.orderManagement.advancedSearch && plan !== 'Basic' && (
            <div className="p-2 rounded-lg border bg-white">
              <div className="flex items-center gap-1 mb-1">
                <Search className="w-2 h-2 text-purple-600" />
                <span className="text-xs font-medium text-gray-900 truncate">
                  고급 검색
                </span>
              </div>
              <div className="text-xs text-gray-500">
                다중 조건 검색
              </div>
            </div>
          )}
          
          {config.orderManagement.aiOrderProcessing && plan === 'Enterprise' && (
            <div className="p-2 rounded-lg border bg-white">
              <div className="flex items-center gap-1 mb-1">
                <Brain className="w-2 h-2 text-violet-600" />
                <span className="text-xs font-medium text-gray-900 truncate">
                  AI 처리
                </span>
              </div>
              <div className="text-xs text-gray-500">
                자동 주문 처리
              </div>
            </div>
          )}
        </div>

        {/* 주문 관리 기능 표시 */}
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {config.orderManagement.bulkOperations && plan !== 'Basic' && (
            <Badge variant="outline" className="text-xs h-4">
              <Crown className="w-2 h-2 mr-1" />
              일괄 작업
            </Badge>
          )}
          {config.orderManagement.orderTemplates && plan !== 'Basic' && (
            <Badge variant="outline" className="text-xs h-4">
              템플릿
            </Badge>
          )}
          {config.orderManagement.dynamicPricing && plan === 'Enterprise' && (
            <Badge variant="outline" className="text-xs h-4">
              <Zap className="w-2 h-2 mr-1" />
              동적 가격
            </Badge>
          )}
        </div>
      </div>
    );
  };

  // 주문 상태 미리보기 렌더링
  const renderStatusFlow = () => {
    const activeStatuses = [];
    if (config.statusFlow.pending) activeStatuses.push({ name: '대기', color: 'yellow', count: 3 });
    if (config.statusFlow.confirmed) activeStatuses.push({ name: '확인', color: 'blue', count: 5 });
    if (config.statusFlow.preparing) activeStatuses.push({ name: '준비중', color: 'orange', count: 2 });
    if (config.statusFlow.ready) activeStatuses.push({ name: '준비완료', color: 'purple', count: 1 });
    if (config.statusFlow.completed) activeStatuses.push({ name: '완료', color: 'green', count: 8 });
    if (config.statusFlow.cancelled) activeStatuses.push({ name: '취소', color: 'red', count: 0 });

    if (activeStatuses.length === 0) return null;

    return (
      <div className="space-y-3">
        <h4 className="text-body-small font-medium text-gray-700 flex items-center gap-1">
          <Activity className="w-3 h-3" />
          주문 상태
        </h4>
        
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {activeStatuses.slice(0, isCompact ? 4 : 6).map((status, index) => (
              <div key={index} className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${getStatusStyle(status.color)}`}>
                <div className={`w-2 h-2 rounded-full ${getStatusDotColor(status.color)}`} />
                <span>{status.name}</span>
                <span className="font-medium">({status.count})</span>
              </div>
            ))}
          </div>
          
          {activeStatuses.length > (isCompact ? 4 : 6) && (
            <div className="text-center">
              <span className="text-xs text-gray-500">
                +{activeStatuses.length - (isCompact ? 4 : 6)}개 더
              </span>
            </div>
          )}
        </div>

        {/* 상태 관리 기능 표시 */}
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {config.statusFlow.customStatuses && plan !== 'Basic' && (
            <Badge variant="outline" className="text-xs h-4">
              <Crown className="w-2 h-2 mr-1" />
              커스텀 상태
            </Badge>
          )}
          {config.statusFlow.statusAutomation && plan !== 'Basic' && (
            <Badge variant="outline" className="text-xs h-4">
              <Zap className="w-2 h-2 mr-1" />
              자동화
            </Badge>
          )}
        </div>
      </div>
    );
  };

  // 결제 관리 미리보기 렌더링
  const renderPaymentManagement = () => {
    if (!config.payment?.paymentDetails || plan === 'Basic') return null;

    return (
      <div className="space-y-3">
        <h4 className="text-body-small font-medium text-gray-700 flex items-center gap-1">
          <CreditCard className="w-3 h-3" />
          결제 관리
        </h4>
        
        <div className="space-y-2">
          {mockPayments.slice(0, isCompact ? 2 : 3).map((payment, index) => (
            <div key={index} className="flex items-center justify-between p-2 border rounded-lg bg-white">
              <div className="flex items-center gap-2">
                <CreditCard className="w-3 h-3 text-indigo-600" />
                <div className="flex-1">
                  <div className="text-xs font-medium text-gray-900">{payment.method}</div>
                  <div className="text-xs text-gray-500">{payment.count}건</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-medium text-gray-900">₩{payment.amount.toLocaleString()}</div>
                <div className="text-xs text-gray-500">{payment.percentage}%</div>
              </div>
            </div>
          ))}
        </div>

        {/* 결제 관리 기능 표시 */}
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {config.payment.refundManagement && (
            <Badge variant="outline" className="text-xs h-4">
              <RefreshCw className="w-2 h-2 mr-1" />
              환불 관리
            </Badge>
          )}
          {config.payment.paymentAnalytics && (
            <Badge variant="outline" className="text-xs h-4">
              <BarChart3 className="w-2 h-2 mr-1" />
              결제 분석
            </Badge>
          )}
          {config.payment.paymentFraudDetection && plan === 'Enterprise' && (
            <Badge variant="outline" className="text-xs h-4">
              <Shield className="w-2 h-2 mr-1" />
              사기 탐지
            </Badge>
          )}
        </div>
      </div>
    );
  };

  // 알림 설정 미리보기 렌더링
  const renderNotifications = () => {
    if (!config.notifications.newOrderAlert) return null;

    const activeNotifications = [];
    if (config.notifications.newOrderAlert) activeNotifications.push({ type: 'email', name: '신규 주문', icon: Bell });
    if (config.notifications.statusChangeAlert) activeNotifications.push({ type: 'email', name: '상태 변경', icon: Activity });
    if (config.notifications.smsNotifications && plan !== 'Basic') activeNotifications.push({ type: 'sms', name: 'SMS 알림', icon: MessageSquare });
    if (config.notifications.pushNotifications && plan !== 'Basic') activeNotifications.push({ type: 'push', name: '푸시 알림', icon: Smartphone });

    return (
      <div className="space-y-3">
        <h4 className="text-body-small font-medium text-gray-700 flex items-center gap-1">
          <Bell className="w-3 h-3" />
          알림 설정
        </h4>
        
        <div className="space-y-1">
          {activeNotifications.slice(0, isCompact ? 3 : 4).map((notification, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <notification.icon className="w-3 h-3 text-blue-500" />
              <span className="text-gray-600">{notification.name}</span>
              <Badge variant="outline" className="text-xs h-4">
                {notification.type.toUpperCase()}
              </Badge>
            </div>
          ))}
          
          {activeNotifications.length > (isCompact ? 3 : 4) && (
            <div className="text-center">
              <span className="text-xs text-gray-500">
                +{activeNotifications.length - (isCompact ? 3 : 4)}개 더
              </span>
            </div>
          )}
        </div>

        {/* 알림 기능 표시 */}
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {config.notifications.customAlerts && plan !== 'Basic' && (
            <Badge variant="outline" className="text-xs h-4">
              <Crown className="w-2 h-2 mr-1" />
              커스텀 알림
            </Badge>
          )}
          {config.notifications.aiNotificationOptimization && plan === 'Enterprise' && (
            <Badge variant="outline" className="text-xs h-4">
              <Brain className="w-2 h-2 mr-1" />
              AI 최적화
            </Badge>
          )}
        </div>
      </div>
    );
  };

  // 최근 주문 미리보기 렌더링
  const renderRecentOrders = () => {
    if (!config.orderManagement.orderList) return null;

    return (
      <div className="space-y-3">
        <h4 className="text-body-small font-medium text-gray-700 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          최근 주문
        </h4>
        
        <div className="space-y-2">
          {mockOrders.slice(0, isCompact ? 3 : 4).map((order, index) => (
            <div key={index} className="flex items-center gap-2 p-2 border rounded-lg bg-white">
              <div className={`w-2 h-2 rounded-full ${getStatusDotColor(getOrderStatusColor(order.status))}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-900">{order.id}</span>
                  <span className="text-xs text-gray-500">{order.time}</span>
                </div>
                <div className="text-xs text-gray-600 truncate">{order.items}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-medium text-gray-900">₩{order.amount.toLocaleString()}</div>
                <div className={`text-xs ${getStatusTextColor(getOrderStatusColor(order.status))}`}>
                  {getOrderStatusName(order.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 분석 정보 렌더링
  const renderAnalytics = () => {
    if (!config.analytics?.orderAnalytics || plan === 'Basic') return null;

    return (
      <div className="space-y-3">
        <h4 className="text-body-small font-medium text-gray-700 flex items-center gap-1">
          <BarChart3 className="w-3 h-3" />
          주문 분석
        </h4>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 border rounded-lg bg-white text-center">
            <div className="text-xs font-medium text-blue-800">오늘 주문</div>
            <div className="text-xs text-blue-600">27건</div>
          </div>
          
          <div className="p-2 border rounded-lg bg-white text-center">
            <div className="text-xs font-medium text-green-800">평균 주문</div>
            <div className="text-xs text-green-600">₩11,400</div>
          </div>
          
          {!isCompact && (
            <>
              <div className="p-2 border rounded-lg bg-white text-center">
                <div className="text-xs font-medium text-purple-800">완료율</div>
                <div className="text-xs text-purple-600">94%</div>
              </div>
              
              <div className="p-2 border rounded-lg bg-white text-center">
                <div className="text-xs font-medium text-orange-800">피크 시간</div>
                <div className="text-xs text-orange-600">12:00-13:00</div>
              </div>
            </>
          )}
        </div>

        {/* 분석 기능 표시 */}
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {config.analytics.customerBehavior && (
            <Badge variant="outline" className="text-xs h-4">
              <Users className="w-2 h-2 mr-1" />
              고객 행동
            </Badge>
          )}
          {config.analytics.advancedOrderAnalytics && plan === 'Enterprise' && (
            <Badge variant="outline" className="text-xs h-4">
              <TrendingUp className="w-2 h-2 mr-1" />
              고급 분석
            </Badge>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {renderOrderManagement()}
      {renderStatusFlow()}
      {renderRecentOrders()}
      {renderPaymentManagement()}
      {renderNotifications()}
      {renderAnalytics()}
    </div>
  );
}

// 헬퍼 함수들
function getStatusStyle(color: string) {
  const styles: Record<string, string> = {
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    red: 'bg-red-50 text-red-700 border-red-200'
  };
  return styles[color] || 'bg-gray-50 text-gray-700 border-gray-200';
}

function getStatusDotColor(color: string) {
  const colors: Record<string, string> = {
    yellow: 'bg-yellow-500',
    blue: 'bg-blue-500',
    orange: 'bg-orange-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    red: 'bg-red-500'
  };
  return colors[color] || 'bg-gray-500';
}

function getStatusTextColor(color: string) {
  const colors: Record<string, string> = {
    yellow: 'text-yellow-600',
    blue: 'text-blue-600',
    orange: 'text-orange-600',
    purple: 'text-purple-600',
    green: 'text-green-600',
    red: 'text-red-600'
  };
  return colors[color] || 'text-gray-600';
}

function getOrderStatusColor(status: string) {
  const statusColors: Record<string, string> = {
    pending: 'yellow',
    confirmed: 'blue',
    preparing: 'orange',
    ready: 'purple',
    completed: 'green',
    cancelled: 'red'
  };
  return statusColors[status] || 'gray';
}

function getOrderStatusName(status: string) {
  const statusNames: Record<string, string> = {
    pending: '대기',
    confirmed: '확인',
    preparing: '준비중',
    ready: '준비완료',
    completed: '완료',
    cancelled: '취소'
  };
  return statusNames[status] || '알 수 없음';
}