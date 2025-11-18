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

import React, { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Separator } from '../../components/ui/separator';
import { ShoppingCart, AlertCircle, Check, CreditCard } from 'lucide-react';
import { createOrderPublic, calculateOrderTotals, addToRetryQueue } from '../../services/orders.public';
import { OrderItem, CreateOrderRequest } from '../../types/order';

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const totals = calculateOrderTotals(cartItems);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Prepare order request
      const orderRequest: CreateOrderRequest = {
        storeId: 'store_demo_001',
        items: cartItems,
        customer: {
          name: formData.customerName,
          phone: formData.customerPhone,
          email: formData.customerEmail || undefined
        },
        deliveryAddress: formData.addressStreet ? {
          street: formData.addressStreet,
          city: formData.addressCity,
          state: formData.addressState,
          zipCode: formData.addressZipCode,
          country: 'KR'
        } : undefined,
        specialRequests: formData.specialRequests || undefined
      };

      // Create order
      const order = await createOrderPublic(orderRequest);

      // Clear cart (in production, use cart context)
      console.log('[Checkout] Order created successfully, clearing cart');
      
      setSuccess(true);
      
      // Redirect to tracking page after 1.5 seconds
      setTimeout(() => {
        window.location.href = `/track/${order.id}`;
      }, 1500);

    } catch (err) {
      console.error('[Checkout] Order creation failed:', err);
      setError(err instanceof Error ? err.message : '주문 생성 중 오류가 발생했습니다.');
      
      // Add to retry queue if offline
      if (navigator.onLine === false) {
        try {
          addToRetryQueue({
            storeId: 'store_demo_001',
            items: cartItems,
            customer: {
              name: formData.customerName,
              phone: formData.customerPhone,
              email: formData.customerEmail || undefined
            }
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="mb-2 flex items-center gap-2">
            <ShoppingCart className="h-8 w-8" />
            주문하기
          </h1>
          <p className="text-secondary-gray">
            주문 정보를 입력해주세요
          </p>
        </div>
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
          <CreditCard className="h-3 w-3 mr-1" />
          Billing OFF (테스트 모드)
        </Badge>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary-gray">소계</span>
                <span>₩{totals.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-gray">세금</span>
                <span>₩{totals.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-gray">배달비</span>
                <span>₩{totals.delivery.toLocaleString()}</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between">
              <span className="font-semibold">총액</span>
              <span className="font-bold text-primary-blue">
                ₩{totals.total.toLocaleString()}
              </span>
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
