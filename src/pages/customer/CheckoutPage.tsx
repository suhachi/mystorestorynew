/**
 * Checkout Page
 * T14-06: Customer checkout with order creation (Billing OFF)
 *
 * Features:
 * - Contact/address/special requests form
 * - Cart total display
 * - "Billing OFF" badge
 * - Form validation
 * - Empty cart prevention
 * - Success redirect to /track/:id
 */

import { AlertCircle, Check, CreditCard, Package, ShoppingCart, Truck } from 'lucide-react';
import React, { useState } from 'react';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Separator } from '../../components/ui/separator';
import { Textarea } from '../../components/ui/textarea';
import { useCheckoutPaymentOptions } from '../../hooks/useCheckoutPaymentOptions';
import { addToRetryQueue, createOrderPublic } from '../../services/orders.public';
import { CreateOrderRequest, OrderItem, OrderType, PaymentMethod } from '../../types/order';

export default function CheckoutPage() {
  // Mock cart items (in production, get from cart context/state)
  const [cartItems] = useState<OrderItem[]>([
    {
      id: 'item1',
      name: '치즈버거',
      quantity: 2,
      price: 8000,
      subtotal: 16000,
      options: [
        { name: '사이즈', value: 'Large', price: 1000 }
      ]
    },
    {
      id: 'item2',
      name: '감자튀김',
      quantity: 1,
      price: 3000,
      subtotal: 3000
    }
  ]);

  // STEP 3-A: Empty cart defense
  const isCartEmpty = !cartItems || cartItems.length === 0;

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    addressStreet: '',
    addressCity: '',
    addressState: '',
    addressZipCode: '',
    specialRequests: ''
  });

  const [orderType, setOrderType] = useState<OrderType>('DELIVERY');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Final totals with delivery fee
  const totals = {
    ...baseTotals,
    delivery: deliveryFee,
    total: baseTotals.subtotal + baseTotals.tax + deliveryFee
  };

  // Get available payment options
  const globalOnlineFlag = import.meta.env.VITE_USE_ONLINE_PAYMENT === 'true';
  const paymentOptions = useCheckoutPaymentOptions({
    orderType,
    globalOnlineFlag,
    orderTotal: totals.total
  });

  // STEP 3-A: Empty cart fallback UI
  if (isCartEmpty) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
          <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            장바구니가 비어 있습니다
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            주문하실 메뉴를 먼저 선택해 주세요.
          </p>
          <button
            onClick={() => window.location.href = '/#/'}
            className="w-full px-4 py-2 rounded-md bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            메뉴 보러가기
          </button>
        </div>
      </div>
    );
  }


  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[CHECKOUT] Submit clicked'); // 🔥 DEBUG LOG
    setError(null);
    setLoading(true);

    try {
      // Validate payment method selection
      if (!selectedPaymentMethod) {
        setError('결제 방식을 선택해주세요.');
        setLoading(false);
        return;
      }

      // Prepare order request
      const orderRequest: CreateOrderRequest = {
        storeId: 'store_demo_001',
        orderType,
        items: cartItems,
        customer: {
          name: formData.customerName,
          phone: formData.customerPhone,
          email: formData.customerEmail || undefined
        },
        deliveryAddress: orderType === 'DELIVERY' ? {
          street: formData.addressStreet,
          city: formData.addressCity,
          state: formData.addressState,
          zipCode: formData.addressZipCode,
          country: 'KR'
        } : undefined,
        specialRequests: formData.specialRequests || undefined,
        paymentMethod: selectedPaymentMethod,
        deliveryFee: deliveryFee
      };

      console.log('[CHECKOUT] orderRequest:', orderRequest);

      // 1. Create Order (PENDING)
      const order = await createOrderPublic(orderRequest);
      console.log('[CHECKOUT] createOrder response:', order);

      // 2. Handle Payment Flow
      if (selectedPaymentMethod === 'APP_CARD') {
        // Online Payment Flow
        try {
          // Dynamic import to avoid SSR issues or circular deps
          const { requestNicepayPay } = await import('../../lib/payments/nicepay.client');
          const { confirmPaymentPublic } = await import('../../services/payments.public');

          // Get Nicepay settings (assuming they are available in context or hook,
          // but for now accessing via storePaymentSettings if we had it,
          // or using the ones from useCheckoutPaymentOptions logic if exposed.
          // Since we don't have direct access to store settings here easily without context,
          // we'll assume they are passed or available.
          // For this ATOMIC step, we'll use a placeholder or assume global config for demo.)

          // TODO: Fetch actual clientKey from store settings
          const clientKey = import.meta.env.VITE_NICEPAY_CLIENT_KEY || 'test_client_key';
          const USE_FIREBASE = import.meta.env.VITE_USE_FIREBASE === 'true';
          const USE_ONLINE_PAYMENT = import.meta.env.VITE_USE_ONLINE_PAYMENT === 'true';

          const paymentResult = await requestNicepayPay({
            clientId: clientKey,
            method: 'card',
            orderId: order.id,
            amount: totals.total,
            goodsName: cartItems[0].name + (cartItems.length > 1 ? ` 외 ${cartItems.length - 1}건` : ''),
            buyerName: formData.customerName,
            buyerTel: formData.customerPhone,
            buyerEmail: formData.customerEmail,
            returnUrl: `${window.location.origin}/api/payments/nicepay/return` // Fallback
          });

          console.log('[CHECKOUT] Payment success:', paymentResult);

          // 3. Confirm Payment (Server-side)
          if (USE_FIREBASE && USE_ONLINE_PAYMENT) {
            try {
              const confirmedOrder = await confirmPaymentPublic({
                storeId: order.storeId,
                orderId: order.id,
                tid: paymentResult.tid,
                amount: totals.total,
              });

              // 4. Redirect to Track Page (Confirmed)
              const redirectPath = `/#/customer-order-track?orderId=${confirmedOrder.id}`;
              window.location.href = redirectPath;
              return;
            } catch (confirmErr) {
              console.error('[PAYMENT] confirmPayment failed', confirmErr);
              // TODO: Show friendly error toast/alert
              // For now, we fall back to track page but user might see PENDING status
              // Ideally we should show "Payment verification failed, please contact support"
              setError('결제 승인에 실패했습니다. 관리자에게 문의해주세요.');
              return;
            }
          }

          // 4-1. Fallback for Mock/Dev (No Firebase)
          // Just redirect to track page
          console.log('[CHECKOUT] Mock mode: Proceeding to track page without server confirmation');
          const fallbackRedirect = `/#/customer-order-track?orderId=${order.id}`;
          window.location.href = fallbackRedirect;
          return;

        } catch (payErr) {
          console.error('[CHECKOUT] Payment failed:', payErr);
          // Don't throw, just show error in UI
          setError(payErr instanceof Error ? payErr.message : '결제 중 오류가 발생했습니다.');
          setLoading(false);
          return;
        }
      }

      // Clear cart (in production, use cart context)
      console.log('[Checkout] Order created successfully, clearing cart');

      setSuccess(true);

      // Redirect to tracking page using hash router
      const redirectPath = `/#/customer-order-track?orderId=${order.id}`;
      console.log('[CHECKOUT] navigating to:', redirectPath);

      setTimeout(() => {
        window.location.href = redirectPath;
      }, 1500);

    } catch (err) {
      console.error('[Checkout] Order creation failed:', err);
      setError(err instanceof Error ? err.message : '주문 생성 중 오류가 발생했습니다.');

      // Add to retry queue if offline
      if (navigator.onLine === false) {
        try {
          addToRetryQueue({
            storeId: 'store_demo_001',
            orderType,
            items: cartItems,
            customer: {
              name: formData.customerName,
              phone: formData.customerPhone,
              email: formData.customerEmail || undefined
            },
            paymentMethod: selectedPaymentMethod || 'MEET_CASH'
          });
          setError('오프라인 상태입니다. 온라인 상태가 되면 자동으로 주문이 생성됩니다.');
        } catch (queueErr) {
          console.error('[Checkout] Failed to add to retry queue:', queueErr);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.customerName.trim().length > 0 &&
    formData.customerPhone.trim().length >= 9 &&
    cartItems.length > 0;

  if (success) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-success-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-success-green" />
          </div>
          <h2 className="mb-2">주문이 완료되었습니다!</h2>
          <p className="text-secondary-gray mb-4">
            잠시 후 주문 추적 페이지로 이동합니다...
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="mb-2 flex items-center gap-2">
            <ShoppingCart className="h-8 w-8" />
            주문하기
          </h1>
          <p className="text-secondary-gray">
            주문 정보를 입력해주세요
          </p>
        </div>
        {import.meta.env.VITE_USE_ONLINE_PAYMENT === 'true' ? (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
            <CreditCard className="h-3 w-3 mr-1" />
            온라인 결제 가능
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
            <CreditCard className="h-3 w-3 mr-1" />
            현장 결제 / 계좌 이체 (온라인 결제 준비중)
          </Badge>
        )}
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 주문 유형 선택 */}
      <Card className="p-6 mb-6">
        <h3 className="mb-4">주문 유형</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            data-testid="order-type-delivery"
            onClick={() => {
              setOrderType('DELIVERY');
              setSelectedPaymentMethod(null); // Reset payment method
            }}
            className={`p-4 border-2 rounded-lg transition-all ${orderType === 'DELIVERY'
              ? 'border-primary-blue bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
              }`}
          >
            <Truck className={`h-6 w-6 mx-auto mb-2 ${orderType === 'DELIVERY' ? 'text-primary-blue' : 'text-gray-400'}`} />
            <div className="font-medium">배달</div>
            <div className="text-sm text-gray-500">주소지로 배달</div>
          </button>
          <button
            type="button"
            data-testid="order-type-pickup"
            onClick={() => {
              setOrderType('PICKUP');
              setSelectedPaymentMethod(null); // Reset payment method
            }}
            className={`p-4 border-2 rounded-lg transition-all ${orderType === 'PICKUP'
              ? 'border-primary-blue bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
              }`}
          >
            <Package className={`h-6 w-6 mx-auto mb-2 ${orderType === 'PICKUP' ? 'text-primary-blue' : 'text-gray-400'}`} />
            <div className="font-medium">포장</div>
            <div className="text-sm text-gray-500">매장에서 픽업</div>
          </button>
        </div>
      </Card>

      {/* 결제 방식 선택 */}
      <Card className="p-6 mb-6">
        <h3 className="mb-4">결제 방식</h3>
        {paymentOptions.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              선택 가능한 결제 방식이 없습니다. 관리자에게 문의하세요.
            </AlertDescription>
          </Alert>
        ) : (
          <RadioGroup
            value={selectedPaymentMethod || ''}
            onValueChange={(value) => setSelectedPaymentMethod(value as PaymentMethod)}
          >
            <div className="space-y-3">
              {paymentOptions.map((option) => (
                <div
                  key={option.key}
                  className={`flex items-start space-x-3 p-4 border-2 rounded-lg transition-all ${selectedPaymentMethod === option.key
                    ? 'border-primary-blue bg-blue-50'
                    : 'border-gray-200'
                    } ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-300'}`}
                  onClick={() => !option.disabled && setSelectedPaymentMethod(option.key)}
                >
                  <RadioGroupItem
                    value={option.key}
                    id={option.key}
                    data-testid={`payment-method-${option.key.toLowerCase().replace('_', '-')}`}
                    disabled={option.disabled}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor={option.key}
                      className={`font-medium ${option.disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {option.label}
                      {option.isOnline && (
                        <Badge variant="outline" className="ml-2 text-xs">온라인</Badge>
                      )}
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">
                      {option.disabled && option.disabledReason
                        ? option.disabledReason
                        : option.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>
        )}
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Order Form */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="mb-4">고객 정보</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="customerName">
                      이름 <span className="text-error-red">*</span>
                    </Label>
                    <Input
                      id="customerName"
                      value={formData.customerName}
                      onChange={(e) => handleInputChange('customerName', e.target.value)}
                      placeholder="홍길동"
                      required
                      aria-required="true"
                    />
                  </div>

                  <div>
                    <Label htmlFor="customerPhone">
                      전화번호 <span className="text-error-red">*</span>
                    </Label>
                    <Input
                      id="customerPhone"
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                      placeholder="010-1234-5678"
                      required
                      aria-required="true"
                      aria-describedby="phone-hint"
                    />
                    <p id="phone-hint" className="text-caption text-secondary-gray mt-1">
                      최소 9자리 숫자를 입력해주세요
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="customerEmail">
                      이메일 (선택)
                    </Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                      placeholder="example@email.com"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Delivery Address */}
              <div>
                <h3 className="mb-4">배달 주소 (선택)</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="addressStreet">주소</Label>
                    <Input
                      id="addressStreet"
                      value={formData.addressStreet}
                      onChange={(e) => handleInputChange('addressStreet', e.target.value)}
                      placeholder="서울시 강남구 테헤란로 123"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="addressCity">도시</Label>
                      <Input
                        id="addressCity"
                        value={formData.addressCity}
                        onChange={(e) => handleInputChange('addressCity', e.target.value)}
                        placeholder="서울"
                      />
                    </div>

                    <div>
                      <Label htmlFor="addressState">지역</Label>
                      <Input
                        id="addressState"
                        value={formData.addressState}
                        onChange={(e) => handleInputChange('addressState', e.target.value)}
                        placeholder="강남구"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="addressZipCode">우편번호</Label>
                    <Input
                      id="addressZipCode"
                      value={formData.addressZipCode}
                      onChange={(e) => handleInputChange('addressZipCode', e.target.value)}
                      placeholder="06234"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Special Requests */}
              <div>
                <Label htmlFor="specialRequests">
                  요청사항 (선택)
                </Label>
                <Textarea
                  id="specialRequests"
                  value={formData.specialRequests}
                  onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                  placeholder="배달 시 요청사항을 입력해주세요"
                  rows={3}
                />
              </div>

              <Button
                type="submit"
                data-testid="submit-order"
                className="w-full"
                disabled={!isFormValid || loading}
                aria-busy={loading}
              >
                {loading ? '주문 처리 중...' : `₩${totals.total.toLocaleString()} 주문하기`}
              </Button>
            </form>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="p-6 sticky top-6">
            <h3 className="mb-4">주문 요약</h3>

            <div className="space-y-3 mb-4">
              {cartItems.map((item, index) => (
                <div key={item.id || index} className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    ₩{item.subtotal.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">상품 합계</span>
                <span>₩{totals.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">배달비</span>
                <span>{deliveryFee === 0 ? '무료' : `₩${deliveryFee.toLocaleString()}`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">세금</span>
                <span>₩{totals.tax.toLocaleString()}</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between font-bold text-lg">
              <span>총 결제 금액</span>
              <span>₩{(totals.subtotal + deliveryFee + totals.tax).toLocaleString()}</span>
            </div>

            {totals.delivery > 0 && (
              <p className="text-caption text-secondary-gray mt-3">
                ₩20,000 이상 주문 시 배달비 무료
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
