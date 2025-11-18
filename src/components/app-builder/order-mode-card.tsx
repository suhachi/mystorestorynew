import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  ShoppingCart, 
  Clock, 
  MapPin, 
  CreditCard, 
  Bell, 
  Settings,
  CheckCircle,
  AlertTriangle,
  Info,
  Zap,
  Crown,
  Star,
  Truck,
  Store,
  Smartphone,
  Monitor,
  DollarSign,
  Package,
  Navigation,
  Timer,
  Phone,
  Wallet,
  QrCode
} from 'lucide-react';
import { useAppBuilder } from '../system/data-context';
import { toast } from 'sonner@2.0.3';

interface OrderMode {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  requiredPlan: 'Basic' | 'Pro' | 'Enterprise';
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

interface OrderModeCardProps {
  currentPlan: 'Basic' | 'Pro' | 'Enterprise';
  onModeChange: (modeId: string, enabled: boolean) => void;
  onSettingsChange: (settings: OrderSettings) => void;
}

interface OrderSettings {
  deliveryMode: 'delivery' | 'pickup' | 'both';
  paymentMethods: string[];
  orderTimeLimit: number;
  notificationSettings: {
    orderReceived: boolean;
    orderPrepared: boolean;
    orderDelivered: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
  };
  deliverySettings: {
    radius: number;
    fee: number;
    freeDeliveryThreshold: number;
    estimatedTime: number;
  };
  pickupSettings: {
    preparationTime: number;
    waitingAreaCapacity: number;
    advanceOrderTime: number;
  };
  operatingHours: {
    delivery: {
      start: string;
      end: string;
    };
    pickup: {
      start: string;
      end: string;
    };
  };
}

export function OrderModeCard({ 
  currentPlan, 
  onModeChange, 
  onSettingsChange 
}: OrderModeCardProps) {
  const [orderSettings, setOrderSettings] = useState<OrderSettings>({
    deliveryMode: 'both',
    paymentMethods: ['card', 'cash'],
    orderTimeLimit: 30,
    notificationSettings: {
      orderReceived: true,
      orderPrepared: true,
      orderDelivered: true,
      smsNotifications: currentPlan !== 'Basic',
      pushNotifications: currentPlan !== 'Basic'
    },
    deliverySettings: {
      radius: 5,
      fee: 3000,
      freeDeliveryThreshold: 20000,
      estimatedTime: 30
    },
    pickupSettings: {
      preparationTime: 15,
      waitingAreaCapacity: 10,
      advanceOrderTime: 60
    },
    operatingHours: {
      delivery: {
        start: '09:00',
        end: '22:00'
      },
      pickup: {
        start: '09:00',
        end: '23:00'
      }
    }
  });

  const [selectedTab, setSelectedTab] = useState<'modes' | 'settings' | 'payments'>('modes');

  // 주문 모드 정의
  const orderModes: OrderMode[] = [
    {
      id: 'delivery',
      name: '배달 주문',
      description: '고객이 주문한 음식을 배달하는 서비스',
      icon: <Truck className="w-6 h-6" />,
      features: [
        '배달 지역 설정',
        '배달비 계산',
        '실시간 배달 추적',
        '배달원 관리',
        '배달 시간 예측'
      ],
      requiredPlan: 'Basic',
      isEnabled: orderSettings.deliveryMode === 'delivery' || orderSettings.deliveryMode === 'both',
      onToggle: (enabled) => {
        const newMode = enabled 
          ? (orderSettings.deliveryMode === 'pickup' ? 'both' : 'delivery')
          : 'pickup';
        handleSettingsChange({ deliveryMode: newMode });
        onModeChange('delivery', enabled);
        toast.success(`배달 주문 ${enabled ? '활성화' : '비활성화'}되었습니다.`);
      }
    },
    {
      id: 'pickup',
      name: '포장 주문',
      description: '고객이 매장에서 직접 픽업하는 서비스',
      icon: <Store className="w-6 h-6" />,
      features: [
        '포장 준비 시간 설정',
        '픽업 대기열 관리',
        '픽업 완료 알림',
        '포장 상태 추적',
        '대기 시간 최적화'
      ],
      requiredPlan: 'Basic',
      isEnabled: orderSettings.deliveryMode === 'pickup' || orderSettings.deliveryMode === 'both',
      onToggle: (enabled) => {
        const newMode = enabled 
          ? (orderSettings.deliveryMode === 'delivery' ? 'both' : 'pickup')
          : 'delivery';
        handleSettingsChange({ deliveryMode: newMode });
        onModeChange('pickup', enabled);
        toast.success(`포장 주문 ${enabled ? '활성화' : '비활성화'}되었습니다.`);
      }
    }
  ];

  // 결제 방법 옵션
  const paymentOptions = [
    { id: 'card', name: '카드 결제', icon: <CreditCard className="w-4 h-4" />, plan: 'Basic' },
    { id: 'cash', name: '현금 결제', icon: <DollarSign className="w-4 h-4" />, plan: 'Basic' },
    { id: 'mobile', name: '모바일 결제', icon: <Smartphone className="w-4 h-4" />, plan: 'Pro' },
    { id: 'qr', name: 'QR 결제', icon: <QrCode className="w-4 h-4" />, plan: 'Pro' },
    { id: 'digital_wallet', name: '디지털 지갑', icon: <Wallet className="w-4 h-4" />, plan: 'Enterprise' }
  ];

  const handleSettingsChange = (newSettings: Partial<OrderSettings>) => {
    const updatedSettings = { ...orderSettings, ...newSettings };
    setOrderSettings(updatedSettings);
    onSettingsChange(updatedSettings);
  };

  const handlePaymentMethodToggle = (methodId: string, enabled: boolean) => {
    const requiredPlan = paymentOptions.find(p => p.id === methodId)?.plan || 'Basic';
    const planOrder = { 'Basic': 1, 'Pro': 2, 'Enterprise': 3 };
    
    if (planOrder[currentPlan] < planOrder[requiredPlan]) {
      toast.error(`${requiredPlan} 플랜에서 사용 가능한 기능입니다.`);
      return;
    }

    const methods = enabled
      ? [...orderSettings.paymentMethods, methodId]
      : orderSettings.paymentMethods.filter(m => m !== methodId);
    
    if (methods.length === 0) {
      toast.error('최소 1개의 결제 방법을 선택해야 합니다.');
      return;
    }
    
    handleSettingsChange({ paymentMethods: methods });
    const methodName = paymentOptions.find(p => p.id === methodId)?.name;
    toast.success(`${methodName} ${enabled ? '추가' : '제거'}되었습니다.`);
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'Basic': return <Crown className="w-4 h-4" />;
      case 'Pro': return <Zap className="w-4 h-4" />;
      case 'Enterprise': return <Star className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Basic': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Pro': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Enterprise': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">주문 모드 설정</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          고객이 주문할 수 있는 방식을 설정하세요. 배달, 포장, 또는 둘 다 선택할 수 있으며, 
          각 모드에 맞는 세부 설정을 구성할 수 있습니다.
        </p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex justify-center">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setSelectedTab('modes')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedTab === 'modes' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            주문 모드
          </button>
          <button
            onClick={() => setSelectedTab('settings')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedTab === 'settings' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            상세 설정
          </button>
          <button
            onClick={() => setSelectedTab('payments')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedTab === 'payments' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            결제 방법
          </button>
        </div>
      </div>

      {/* 주문 모드 탭 */}
      {selectedTab === 'modes' && (
        <div className="space-y-6">
          {/* 주문 모드 선택 */}
          <div className="grid md:grid-cols-2 gap-6">
            {orderModes.map((mode) => (
              <Card key={mode.id} className="relative">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                      {mode.icon}
                    </div>
                    {mode.name}
                    <Badge className={getPlanColor(mode.requiredPlan)}>
                      {getPlanIcon(mode.requiredPlan)}
                      <span className="ml-1">{mode.requiredPlan}</span>
                    </Badge>
                  </CardTitle>
                  <CardDescription>{mode.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* 모드 활성화 스위치 */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <Label htmlFor={`mode-${mode.id}`} className="text-sm font-medium">
                        {mode.name} 활성화
                      </Label>
                      <Switch
                        id={`mode-${mode.id}`}
                        checked={mode.isEnabled}
                        onCheckedChange={mode.onToggle}
                      />
                    </div>

                    {/* 기능 목록 */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">포함 기능:</h4>
                      <div className="space-y-1">
                        {mode.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 상태 표시 */}
                    <div className="pt-2 border-t">
                      <div className="flex items-center gap-2">
                        {mode.isEnabled ? (
                          <>
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-green-600">활성화됨</span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                            <span className="text-sm text-gray-500">비활성화됨</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 현재 모드 요약 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                현재 설정 요약
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {orderSettings.deliveryMode === 'delivery' ? '배달만' :
                     orderSettings.deliveryMode === 'pickup' ? '포장만' : '둘 다'}
                  </div>
                  <div className="text-sm text-gray-600">주문 모드</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {orderSettings.paymentMethods.length}개
                  </div>
                  <div className="text-sm text-gray-600">결제 방법</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {orderSettings.deliverySettings.radius}km
                  </div>
                  <div className="text-sm text-gray-600">배달 반경</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 상세 설정 탭 */}
      {selectedTab === 'settings' && (
        <div className="space-y-6">
          {/* 배달 설정 */}
          {(orderSettings.deliveryMode === 'delivery' || orderSettings.deliveryMode === 'both') && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  배달 설정
                </CardTitle>
                <CardDescription>배달 서비스 관련 세부 설정을 구성하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="radius" className="text-sm font-medium">배달 반경 (km)</Label>
                      <input
                        id="radius"
                        type="number"
                        min="1"
                        max="50"
                        value={orderSettings.deliverySettings.radius}
                        onChange={(e) => handleSettingsChange({
                          deliverySettings: {
                            ...orderSettings.deliverySettings,
                            radius: parseInt(e.target.value) || 1
                          }
                        })}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fee" className="text-sm font-medium">기본 배달비 (원)</Label>
                      <input
                        id="fee"
                        type="number"
                        min="0"
                        value={orderSettings.deliverySettings.fee}
                        onChange={(e) => handleSettingsChange({
                          deliverySettings: {
                            ...orderSettings.deliverySettings,
                            fee: parseInt(e.target.value) || 0
                          }
                        })}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="freeThreshold" className="text-sm font-medium">무료 배달 기준 (원)</Label>
                      <input
                        id="freeThreshold"
                        type="number"
                        min="0"
                        value={orderSettings.deliverySettings.freeDeliveryThreshold}
                        onChange={(e) => handleSettingsChange({
                          deliverySettings: {
                            ...orderSettings.deliverySettings,
                            freeDeliveryThreshold: parseInt(e.target.value) || 0
                          }
                        })}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estimatedTime" className="text-sm font-medium">예상 배달 시간 (분)</Label>
                      <input
                        id="estimatedTime"
                        type="number"
                        min="10"
                        max="120"
                        value={orderSettings.deliverySettings.estimatedTime}
                        onChange={(e) => handleSettingsChange({
                          deliverySettings: {
                            ...orderSettings.deliverySettings,
                            estimatedTime: parseInt(e.target.value) || 30
                          }
                        })}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 포장 설정 */}
          {(orderSettings.deliveryMode === 'pickup' || orderSettings.deliveryMode === 'both') && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="w-5 h-5" />
                  포장 설정
                </CardTitle>
                <CardDescription>포장 주문 관련 세부 설정을 구성하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="preparationTime" className="text-sm font-medium">기본 준비 시간 (분)</Label>
                    <input
                      id="preparationTime"
                      type="number"
                      min="5"
                      max="60"
                      value={orderSettings.pickupSettings.preparationTime}
                      onChange={(e) => handleSettingsChange({
                        pickupSettings: {
                          ...orderSettings.pickupSettings,
                          preparationTime: parseInt(e.target.value) || 15
                        }
                      })}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="waitingCapacity" className="text-sm font-medium">대기 구역 수용 인원</Label>
                    <input
                      id="waitingCapacity"
                      type="number"
                      min="1"
                      max="50"
                      value={orderSettings.pickupSettings.waitingAreaCapacity}
                      onChange={(e) => handleSettingsChange({
                        pickupSettings: {
                          ...orderSettings.pickupSettings,
                          waitingAreaCapacity: parseInt(e.target.value) || 10
                        }
                      })}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="advanceTime" className="text-sm font-medium">사전 주문 가능 시간 (분)</Label>
                    <input
                      id="advanceTime"
                      type="number"
                      min="30"
                      max="1440"
                      value={orderSettings.pickupSettings.advanceOrderTime}
                      onChange={(e) => handleSettingsChange({
                        pickupSettings: {
                          ...orderSettings.pickupSettings,
                          advanceOrderTime: parseInt(e.target.value) || 60
                        }
                      })}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 알림 설정 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                알림 설정
              </CardTitle>
              <CardDescription>고객 및 매장 알림 설정을 구성하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="orderReceived" className="text-sm font-medium">주문 접수 알림</Label>
                    <p className="text-xs text-gray-500">새 주문이 접수되었을 때 알림</p>
                  </div>
                  <Switch
                    id="orderReceived"
                    checked={orderSettings.notificationSettings.orderReceived}
                    onCheckedChange={(checked) => handleSettingsChange({
                      notificationSettings: {
                        ...orderSettings.notificationSettings,
                        orderReceived: checked
                      }
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="orderPrepared" className="text-sm font-medium">준비 완료 알림</Label>
                    <p className="text-xs text-gray-500">주문 준비가 완료되었을 때 고객에게 알림</p>
                  </div>
                  <Switch
                    id="orderPrepared"
                    checked={orderSettings.notificationSettings.orderPrepared}
                    onCheckedChange={(checked) => handleSettingsChange({
                      notificationSettings: {
                        ...orderSettings.notificationSettings,
                        orderPrepared: checked
                      }
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="orderDelivered" className="text-sm font-medium">배달 완료 알림</Label>
                    <p className="text-xs text-gray-500">배달이 완료되었을 때 알림</p>
                  </div>
                  <Switch
                    id="orderDelivered"
                    checked={orderSettings.notificationSettings.orderDelivered}
                    onCheckedChange={(checked) => handleSettingsChange({
                      notificationSettings: {
                        ...orderSettings.notificationSettings,
                        orderDelivered: checked
                      }
                    })}
                  />
                </div>
                
                {/* Pro/Enterprise 전용 알림 */}
                {currentPlan !== 'Basic' && (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="smsNotifications" className="text-sm font-medium">SMS 알림</Label>
                        <p className="text-xs text-gray-500">문자 메시지로 알림 발송</p>
                      </div>
                      <Switch
                        id="smsNotifications"
                        checked={orderSettings.notificationSettings.smsNotifications}
                        onCheckedChange={(checked) => handleSettingsChange({
                          notificationSettings: {
                            ...orderSettings.notificationSettings,
                            smsNotifications: checked
                          }
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="pushNotifications" className="text-sm font-medium">푸시 알림</Label>
                        <p className="text-xs text-gray-500">앱 푸시 알림 발송</p>
                      </div>
                      <Switch
                        id="pushNotifications"
                        checked={orderSettings.notificationSettings.pushNotifications}
                        onCheckedChange={(checked) => handleSettingsChange({
                          notificationSettings: {
                            ...orderSettings.notificationSettings,
                            pushNotifications: checked
                          }
                        })}
                      />
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 결제 방법 탭 */}
      {selectedTab === 'payments' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                결제 방법 설정
              </CardTitle>
              <CardDescription>고객이 사용할 수 있는 결제 방법을 선택하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {paymentOptions.map((option) => {
                  const isEnabled = orderSettings.paymentMethods.includes(option.id);
                  const planOrder = { 'Basic': 1, 'Pro': 2, 'Enterprise': 3 };
                  const isAvailable = planOrder[currentPlan] >= planOrder[option.plan];
                  
                  return (
                    <div
                      key={option.id}
                      className={`p-4 border rounded-lg transition-all ${
                        isEnabled 
                          ? 'border-primary-blue bg-primary-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      } ${!isAvailable ? 'opacity-50' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 rounded">
                            {option.icon}
                          </div>
                          <div>
                            <h4 className="font-medium">{option.name}</h4>
                            <div className="flex items-center gap-2">
                              <Badge className={getPlanColor(option.plan)} variant="outline">
                                {getPlanIcon(option.plan)}
                                <span className="ml-1">{option.plan}</span>
                              </Badge>
                              {!isAvailable && (
                                <Badge variant="outline" className="text-xs">
                                  업그레이드 필요
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Switch
                          checked={isEnabled}
                          onCheckedChange={(checked) => handlePaymentMethodToggle(option.id, checked)}
                          disabled={!isAvailable}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {orderSettings.paymentMethods.length === 0 && (
                <Alert className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    최소 1개의 결제 방법을 선택해야 합니다.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* 결제 설정 요약 */}
          <Card>
            <CardHeader>
              <CardTitle>선택된 결제 방법</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {orderSettings.paymentMethods.map(methodId => {
                  const method = paymentOptions.find(p => p.id === methodId);
                  return method ? (
                    <Badge key={methodId} variant="outline" className="flex items-center gap-1">
                      {method.icon}
                      {method.name}
                    </Badge>
                  ) : null;
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 플랜 업그레이드 안내 */}
      {currentPlan === 'Basic' && (
        <Alert>
          <Star className="h-4 w-4" />
          <AlertDescription>
            Pro 플랜으로 업그레이드하면 SMS 알림, 푸시 알림, 모바일 결제 등 고급 기능을 사용할 수 있습니다.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}