import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { useAppBuilder } from '../system/data-context';
import { ChevronLeft, ChevronRight, ShoppingBag, CreditCard, Truck, Clock, Check } from 'lucide-react';

export function StepThreeOrderPayment() {
  const { data, updateData, nextStep, prevStep } = useAppBuilder();
  const [orderModes, setOrderModes] = useState({
    pickup: data.orderPayment?.orderModes?.pickup || true,
    delivery: data.orderPayment?.orderModes?.delivery || false,
    reservation: data.orderPayment?.orderModes?.reservation || false
  });
  const [paymentSettings, setPaymentSettings] = useState({
    methods: data.orderPayment?.paymentSettings?.methods || ['card'],
    minOrderAmount: data.orderPayment?.paymentSettings?.minOrderAmount || 0,
    deliveryFee: data.orderPayment?.paymentSettings?.deliveryFee || 3000,
    freeDeliveryThreshold: data.orderPayment?.paymentSettings?.freeDeliveryThreshold || 20000
  });

  // 주문 모드 변경 핸들러
  const handleOrderModeChange = (mode: 'pickup' | 'delivery' | 'reservation', enabled: boolean) => {
    setOrderModes(prev => ({
      ...prev,
      [mode]: enabled
    }));
  };

  // 결제 방법 변경 핸들러
  const handlePaymentMethodChange = (method: string, enabled: boolean) => {
    setPaymentSettings(prev => ({
      ...prev,
      methods: enabled 
        ? [...prev.methods, method]
        : prev.methods.filter(m => m !== method)
    }));
  };

  // 결제 설정 변경 핸들러
  const handlePaymentSettingChange = (field: string, value: number) => {
    setPaymentSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 다음 단계로 진행
  const handleNext = () => {
    updateData({
      orderPayment: {
        orderModes,
        paymentSettings
      }
    });
    nextStep();
  };

  // 주문 모드 옵션
  const orderModeOptions = [
    {
      id: 'pickup',
      name: '매장 픽업',
      description: '고객이 직접 매장에서 픽업',
      icon: <ShoppingBag className="w-5 h-5" />,
      enabled: orderModes.pickup
    },
    {
      id: 'delivery',
      name: '배달 주문',
      description: '고객 주소로 배달',
      icon: <Truck className="w-5 h-5" />,
      enabled: orderModes.delivery
    },
    {
      id: 'reservation',
      name: '예약 주문',
      description: '미리 시간을 정해서 주문',
      icon: <Clock className="w-5 h-5" />,
      enabled: orderModes.reservation
    }
  ];

  // 결제 방법 옵션
  const paymentMethodOptions = [
    {
      id: 'card',
      name: '신용카드',
      description: '신용카드/체크카드 결제',
      icon: <CreditCard className="w-5 h-5" />,
      enabled: paymentSettings.methods.includes('card')
    },
    {
      id: 'cash',
      name: '현금 결제',
      description: '현금으로 직접 결제',
      icon: <ShoppingBag className="w-5 h-5" />,
      enabled: paymentSettings.methods.includes('cash')
    },
    {
      id: 'transfer',
      name: '계좌이체',
      description: '무통장 입금',
      icon: <CreditCard className="w-5 h-5" />,
      enabled: paymentSettings.methods.includes('transfer')
    }
  ];

  return (
    <div className="space-y-8">
      {/* 헤더 섹션 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">주문 & 결제 설정</h1>
        <p className="text-lg text-gray-600">
          고객이 주문할 수 있는 방식과 결제 방법을 설정하세요
        </p>
      </div>

      {/* 주문 모드 설정 섹션 */}
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">주문 모드 설정</h2>
          <p className="text-sm text-gray-600">고객이 주문할 수 있는 방식을 선택하세요</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          {orderModeOptions.map((option) => (
            <Card 
              key={option.id}
              className={`p-4 cursor-pointer transition-all ${
                option.enabled 
                  ? 'border-2 border-primary-blue bg-blue-50' 
                  : 'border-2 border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleOrderModeChange(option.id as any, !option.enabled)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${option.enabled ? 'bg-primary-blue text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {option.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{option.name}</h3>
                    <p className="text-xs text-gray-600">{option.description}</p>
                  </div>
                </div>
                <Switch
                  checked={option.enabled}
                  onCheckedChange={(checked) => handleOrderModeChange(option.id as any, checked)}
                />
              </div>
              {option.enabled && (
                <div className="flex items-center gap-1 text-primary-blue text-xs">
                  <Check className="w-3 h-3" />
                  <span>활성화됨</span>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* 배달 설정 (배달 모드가 활성화된 경우) */}
        {orderModes.delivery && (
          <Card className="mt-6 p-4 bg-blue-50 border-blue-200">
            <h3 className="font-medium text-blue-900 mb-4">배달 설정</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="deliveryFee" className="text-sm font-medium text-blue-800">
                  배달비 (원)
                </Label>
                <Input
                  id="deliveryFee"
                  type="number"
                  placeholder="3000"
                  value={paymentSettings.deliveryFee}
                  onChange={(e) => handlePaymentSettingChange('deliveryFee', parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="freeDeliveryThreshold" className="text-sm font-medium text-blue-800">
                  무료배달 기준금액 (원)
                </Label>
                <Input
                  id="freeDeliveryThreshold"
                  type="number"
                  placeholder="20000"
                  value={paymentSettings.freeDeliveryThreshold}
                  onChange={(e) => handlePaymentSettingChange('freeDeliveryThreshold', parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
            </div>
            <p className="text-xs text-blue-700 mt-2">
              {paymentSettings.freeDeliveryThreshold.toLocaleString()}원 이상 주문 시 배달비 무료
            </p>
          </Card>
        )}
      </Card>

      {/* 결제 방법 설정 섹션 */}
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">결제 방법 설정</h2>
          <p className="text-sm text-gray-600">고객이 사용할 수 있는 결제 방법을 선택하세요</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          {paymentMethodOptions.map((option) => (
            <Card 
              key={option.id}
              className={`p-4 cursor-pointer transition-all ${
                option.enabled 
                  ? 'border-2 border-primary-blue bg-blue-50' 
                  : 'border-2 border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handlePaymentMethodChange(option.id, !option.enabled)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${option.enabled ? 'bg-primary-blue text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {option.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{option.name}</h3>
                    <p className="text-xs text-gray-600">{option.description}</p>
                  </div>
                </div>
                <Switch
                  checked={option.enabled}
                  onCheckedChange={(checked) => handlePaymentMethodChange(option.id, checked)}
                />
              </div>
              {option.enabled && (
                <div className="flex items-center gap-1 text-primary-blue text-xs">
                  <Check className="w-3 h-3" />
                  <span>활성화됨</span>
                </div>
              )}
            </Card>
          ))}
        </div>
      </Card>

      {/* 주문 금액 설정 섹션 */}
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">주문 금액 설정</h2>
          <p className="text-sm text-gray-600">최소 주문 금액을 설정하세요</p>
        </div>
        
        <div className="max-w-md">
          <div>
            <Label htmlFor="minOrderAmount" className="text-sm font-medium text-gray-700">
              최소 주문 금액 (원)
            </Label>
            <Input
              id="minOrderAmount"
              type="number"
              placeholder="0"
              value={paymentSettings.minOrderAmount}
              onChange={(e) => handlePaymentSettingChange('minOrderAmount', parseInt(e.target.value) || 0)}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              0원으로 설정하면 최소 주문 금액 제한이 없습니다
            </p>
          </div>
        </div>
      </Card>

      {/* 설정 요약 */}
      <Card className="p-6 bg-green-50 border-green-200">
        <h3 className="font-semibold text-green-900 mb-3">설정 요약</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-green-700 font-medium mb-2">활성화된 주문 모드</div>
            <div className="space-y-1">
              {orderModeOptions.filter(option => option.enabled).map(option => (
                <div key={option.id} className="flex items-center gap-2 text-green-800">
                  <Check className="w-3 h-3" />
                  {option.name}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-green-700 font-medium mb-2">활성화된 결제 방법</div>
            <div className="space-y-1">
              {paymentMethodOptions.filter(option => option.enabled).map(option => (
                <div key={option.id} className="flex items-center gap-2 text-green-800">
                  <Check className="w-3 h-3" />
                  {option.name}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-green-300">
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-green-700 font-medium">최소 주문 금액</div>
              <div className="text-green-900">{paymentSettings.minOrderAmount.toLocaleString()}원</div>
            </div>
            {orderModes.delivery && (
              <>
                <div>
                  <div className="text-green-700 font-medium">배달비</div>
                  <div className="text-green-900">{paymentSettings.deliveryFee.toLocaleString()}원</div>
                </div>
                <div>
                  <div className="text-green-700 font-medium">무료배달 기준</div>
                  <div className="text-green-900">{paymentSettings.freeDeliveryThreshold.toLocaleString()}원 이상</div>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* 주의사항 */}
      <Card className="p-6 bg-yellow-50 border-yellow-200">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
            <ShoppingBag className="w-4 h-4 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-yellow-900 mb-2">주의사항</h3>
            <ul className="text-xs text-yellow-800 space-y-1">
              <li>• 최소 하나의 주문 모드는 반드시 활성화해야 합니다</li>
              <li>• 최소 하나의 결제 방법은 반드시 선택해야 합니다</li>
              <li>• 배달 모드 활성화 시 배달비와 무료배달 기준을 설정하세요</li>
              <li>• 설정은 앱 생성 후에도 변경할 수 있습니다</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* 네비게이션 버튼 */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep} className="flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" />
          이전
        </Button>
        <Button 
          onClick={handleNext} 
          className="flex items-center gap-2"
          disabled={
            !Object.values(orderModes).some(Boolean) || 
            paymentSettings.methods.length === 0
          }
        >
          다음
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}