# 36 - Store Settings

## 📌 목표
설정 페이지를 구축합니다.

**결과물**:
- store-settings.tsx

**총 1개 파일**

---

## 🔄 STEP 1: Store Settings

### 프롬프트 템플릿

```
설정 페이지를 만듭니다.

## 요구사항

/components/store-admin/store-settings.tsx 생성:

기본 정보, 운영 시간, 결제 설정, 알림 설정

간단 구조:
```typescript
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Store, Clock, CreditCard, Bell, Shield, Palette } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function StoreSettings() {
  const [storeInfo, setStoreInfo] = useState({
    name: '카페 마이스토리',
    description: '맛있는 커피와 디저트를 제공하는 카페입니다',
    phone: '02-1234-5678',
    address: '서울특별시 강남구 테헤란로 123',
    businessNumber: '123-45-67890'
  });

  const [operatingHours, setOperatingHours] = useState({
    weekday: { open: '09:00', close: '22:00' },
    weekend: { open: '10:00', close: '23:00' }
  });

  const [notifications, setNotifications] = useState({
    newOrder: true,
    orderStatus: true,
    review: true,
    lowStock: false
  });

  const handleSave = () => {
    toast.success('설정이 저장되었습니다');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl">설정</h1>
        <p className="text-slate-600 mt-1">상점 정보와 운영 설정을 관리합니다</p>
      </div>

      <Tabs defaultValue="basic">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">
            <Store className="w-4 h-4 mr-2" />
            기본 정보
          </TabsTrigger>
          <TabsTrigger value="hours">
            <Clock className="w-4 h-4 mr-2" />
            운영 시간
          </TabsTrigger>
          <TabsTrigger value="payment">
            <CreditCard className="w-4 h-4 mr-2" />
            결제
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            알림
          </TabsTrigger>
          <TabsTrigger value="branding">
            <Palette className="w-4 h-4 mr-2" />
            브랜딩
          </TabsTrigger>
        </TabsList>

        {/* 기본 정보 */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>상점 기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">상점명</label>
                <Input
                  value={storeInfo.name}
                  onChange={(e) => setStoreInfo({ ...storeInfo, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">설명</label>
                <Textarea
                  value={storeInfo.description}
                  onChange={(e) => setStoreInfo({ ...storeInfo, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">전화번호</label>
                <Input
                  value={storeInfo.phone}
                  onChange={(e) => setStoreInfo({ ...storeInfo, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">주소</label>
                <Input
                  value={storeInfo.address}
                  onChange={(e) => setStoreInfo({ ...storeInfo, address: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">사업자번호</label>
                <Input
                  value={storeInfo.businessNumber}
                  onChange={(e) => setStoreInfo({ ...storeInfo, businessNumber: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 운영 시간 */}
        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle>운영 시간</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">평일 (월-금)</label>
                <div className="flex gap-2">
                  <Input
                    type="time"
                    value={operatingHours.weekday.open}
                    onChange={(e) => setOperatingHours({
                      ...operatingHours,
                      weekday: { ...operatingHours.weekday, open: e.target.value }
                    })}
                  />
                  <span className="flex items-center">-</span>
                  <Input
                    type="time"
                    value={operatingHours.weekday.close}
                    onChange={(e) => setOperatingHours({
                      ...operatingHours,
                      weekday: { ...operatingHours.weekday, close: e.target.value }
                    })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">주말 (토-일)</label>
                <div className="flex gap-2">
                  <Input
                    type="time"
                    value={operatingHours.weekend.open}
                    onChange={(e) => setOperatingHours({
                      ...operatingHours,
                      weekend: { ...operatingHours.weekend, open: e.target.value }
                    })}
                  />
                  <span className="flex items-center">-</span>
                  <Input
                    type="time"
                    value={operatingHours.weekend.close}
                    onChange={(e) => setOperatingHours({
                      ...operatingHours,
                      weekend: { ...operatingHours.weekend, close: e.target.value }
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 결제 설정 */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>결제 수단</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">신용/체크카드</p>
                  <p className="text-sm text-slate-600">모든 카드사 결제 가능</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">계좌이체</p>
                  <p className="text-sm text-slate-600">실시간 계좌이체</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">간편결제</p>
                  <p className="text-sm text-slate-600">카카오페이, 네이버페이 등</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">현장결제</p>
                  <p className="text-sm text-slate-600">현금, 카드 현장 결제</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 알림 설정 */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>알림 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">신규 주문 알림</p>
                  <p className="text-sm text-slate-600">새 주문이 들어올 때 알림</p>
                </div>
                <Switch
                  checked={notifications.newOrder}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, newOrder: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">주문 상태 변경 알림</p>
                  <p className="text-sm text-slate-600">주문 상태가 변경될 때 알림</p>
                </div>
                <Switch
                  checked={notifications.orderStatus}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, orderStatus: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">리뷰 알림</p>
                  <p className="text-sm text-slate-600">새 리뷰가 등록될 때 알림</p>
                </div>
                <Switch
                  checked={notifications.review}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, review: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">재고 부족 알림</p>
                  <p className="text-sm text-slate-600">재고가 부족할 때 알림 (Pro+)</p>
                </div>
                <Switch
                  checked={notifications.lowStock}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, lowStock: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 브랜딩 */}
        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>브랜딩 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">메인 컬러</label>
                <Input type="color" defaultValue="#2563EB" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">로고 이미지</label>
                <Button variant="outline">이미지 업로드</Button>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">커버 이미지</label>
                <Button variant="outline">이미지 업로드</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 저장 버튼 */}
      <div className="flex justify-end">
        <Button size="lg" onClick={handleSave}>
          설정 저장
        </Button>
      </div>
    </div>
  );
}
```

IMPORTANT:
- 5개 탭 (기본 정보, 운영 시간, 결제, 알림, 브랜딩)
- 폼 입력 컴포넌트
- 스위치 토글
- 저장 기능
```

---

## ✅ 완료 체크리스트

- [ ] store-settings.tsx

---

## 📝 다음 단계

**37-CUSTOMER-APP-LAYOUT.md**로 이동합니다.
