import {
  AlertCircle,
  Bell,
  Camera,
  CreditCard,
  Download,
  Mail,
  Palette,
  Printer,
  QrCode,
  Save,
  Settings,
  Smartphone,
  Store,
  Upload
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import StorePaymentSettingsTab from '../admin/settings/StorePaymentSettingsTab';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';

export function StoreSettings() {
  const [activeTab, setActiveTab] = useState('basic');
  const [hasChanges, setHasChanges] = useState(false);

  // Mock 상점 설정 데이터
  const [storeSettings, setStoreSettings] = useState({
    // 기본 정보
    storeName: '카페 마이스토리',
    description: '신선한 원두로 만든 커피와 수제 디저트를 판매하는 카페입니다.',
    phone: '02-1234-5678',
    email: 'info@cafe-mystory.com',
    address: '서울특별시 강남구 테헤란로 123',
    detailAddress: '1층 101호',
    businessHours: {
      weekday: { open: '07:00', close: '22:00' },
      weekend: { open: '08:00', close: '23:00' }
    },

    // 운영 설정
    orderSettings: {
      pickupEnabled: true,
      deliveryEnabled: true,
      deliveryFee: 3000,
      freeDeliveryMinAmount: 20000,
      orderTimeLimit: 30,
      advanceOrderDays: 7
    },

    // 결제 설정
    paymentSettings: {
      cardEnabled: true,
      cashEnabled: true,
      digitalPayEnabled: true,
      loyaltyProgram: true,
      pointRate: 5 // 5%
    },

    // 알림 설정
    notificationSettings: {
      newOrderAlert: true,
      lowStockAlert: true,
      customerReview: true,
      dailySummary: true,
      emailNotifications: true,
      smsNotifications: false
    },

    // 브랜딩
    brandingSettings: {
      primaryColor: '#2563eb',
      secondaryColor: '#64748b',
      logoUrl: '',
      coverImageUrl: '',
      customDomain: ''
    }
  });

  const handleSave = () => {
    console.log('💾 상점 설정 저장:', storeSettings);
    setHasChanges(false);
    toast.success('상점 설정이 성공적으로 저장되었습니다!');
    // 실제로는 API 호출
  };

  const handleLogoUpload = () => {
    toast.success('로고 업로드 기능을 준비 중입니다!');
    console.log('📷 로고 업로드');
  };

  const handleCoverImageUpload = () => {
    toast.success('커버 이미지 업로드 기능을 준비 중입니다!');
    console.log('🖼️ 커버 이미지 업로드');
  };

  const handleQrDownload = () => {
    toast.success('QR 코드를 다운로드합니다!');
    console.log('📱 QR 코드 다운로드');
  };

  const handleQrPrint = () => {
    toast.success('QR 코드를 인쇄합니다!');
    console.log('🖨️ QR 코드 인쇄');
  };

  const updateSetting = (category: string, key: string, value: any) => {
    setStoreSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const updateNestedSetting = (category: string, subCategory: string, key: string, value: any) => {
    setStoreSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [subCategory]: {
          ...(prev[category as keyof typeof prev] as any)[subCategory],
          [key]: value
        }
      }
    }));
    setHasChanges(true);
  };

  return (
    <div className="space-y-6 p-6">
      {/* 페이지 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-heading-1 text-gray-900">상점 설정</h1>
          <p className="text-body text-gray-600 mt-1">상점의 기본 정보와 운영 설정을 관리하세요</p>
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              <AlertCircle className="w-4 h-4 mr-1" />
              변경사항 있음
            </Badge>
          )}
          <Button onClick={handleSave} className="bg-primary-blue hover:bg-primary-blue-dark">
            <Save className="w-4 h-4 mr-2" />
            설정 저장
          </Button>
        </div>
      </div>

      {/* 설정 탭 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <Store className="w-4 h-4" />
            기본 정보
          </TabsTrigger>
          <TabsTrigger value="operation" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            운영 설정
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            결제 설정
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            알림 설정
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            브랜딩
          </TabsTrigger>
        </TabsList>

        {/* 기본 정보 탭 */}
        <TabsContent value="basic" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-heading-3 text-gray-900 mb-6">기본 정보</h2>

            <div className="space-y-6">
              {/* 상점 로고 */}
              <div>
                <label className="text-label text-gray-900 mb-3 block">상점 로고</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    {storeSettings.brandingSettings.logoUrl ? (
                      <img
                        src={storeSettings.brandingSettings.logoUrl}
                        alt="Store Logo"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Camera className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <Button variant="outline" size="sm" onClick={handleLogoUpload}>
                      <Upload className="w-4 h-4 mr-2" />
                      로고 업로드
                    </Button>
                    <p className="text-caption text-gray-500 mt-1">권장 크기: 200x200px</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-label text-gray-900 mb-2 block">상점명 *</label>
                  <Input
                    value={storeSettings.storeName}
                    onChange={(e) => {
                      setStoreSettings(prev => ({ ...prev, storeName: e.target.value }));
                      setHasChanges(true);
                    }}
                    placeholder="상점명을 입력하세요"
                  />
                </div>

                <div>
                  <label className="text-label text-gray-900 mb-2 block">연락처 *</label>
                  <Input
                    value={storeSettings.phone}
                    onChange={(e) => {
                      setStoreSettings(prev => ({ ...prev, phone: e.target.value }));
                      setHasChanges(true);
                    }}
                    placeholder="02-1234-5678"
                  />
                </div>
              </div>

              <div>
                <label className="text-label text-gray-900 mb-2 block">상점 소개</label>
                <Textarea
                  value={storeSettings.description}
                  onChange={(e) => {
                    setStoreSettings(prev => ({ ...prev, description: e.target.value }));
                    setHasChanges(true);
                  }}
                  placeholder="상점에 대한 간단한 소개를 작성하세요"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-label text-gray-900 mb-2 block">이메일</label>
                  <Input
                    type="email"
                    value={storeSettings.email}
                    onChange={(e) => {
                      setStoreSettings(prev => ({ ...prev, email: e.target.value }));
                      setHasChanges(true);
                    }}
                    placeholder="store@example.com"
                  />
                </div>

                <div>
                  <label className="text-label text-gray-900 mb-2 block">웹사이트</label>
                  <Input
                    value={storeSettings.brandingSettings.customDomain}
                    onChange={(e) => updateSetting('brandingSettings', 'customDomain', e.target.value)}
                    placeholder="https://mystory.cafe"
                  />
                </div>
              </div>

              <div>
                <label className="text-label text-gray-900 mb-2 block">주소 *</label>
                <div className="space-y-3">
                  <Input
                    value={storeSettings.address}
                    onChange={(e) => {
                      setStoreSettings(prev => ({ ...prev, address: e.target.value }));
                      setHasChanges(true);
                    }}
                    placeholder="기본 주소"
                  />
                  <Input
                    value={storeSettings.detailAddress}
                    onChange={(e) => {
                      setStoreSettings(prev => ({ ...prev, detailAddress: e.target.value }));
                      setHasChanges(true);
                    }}
                    placeholder="상세 주소"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* 운영 시간 */}
          <Card className="p-6">
            <h2 className="text-heading-3 text-gray-900 mb-6">운영 시간</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-body font-medium text-gray-900 mb-3">평일 (월-금)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-label text-gray-900 mb-2 block">오픈 시간</label>
                    <Input
                      type="time"
                      value={storeSettings.businessHours.weekday.open}
                      onChange={(e) => updateNestedSetting('businessHours', 'weekday', 'open', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-label text-gray-900 mb-2 block">마감 시간</label>
                    <Input
                      type="time"
                      value={storeSettings.businessHours.weekday.close}
                      onChange={(e) => updateNestedSetting('businessHours', 'weekday', 'close', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-body font-medium text-gray-900 mb-3">주말 (토-일)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-label text-gray-900 mb-2 block">오픈 시간</label>
                    <Input
                      type="time"
                      value={storeSettings.businessHours.weekend.open}
                      onChange={(e) => updateNestedSetting('businessHours', 'weekend', 'open', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-label text-gray-900 mb-2 block">마감 시간</label>
                    <Input
                      type="time"
                      value={storeSettings.businessHours.weekend.close}
                      onChange={(e) => updateNestedSetting('businessHours', 'weekend', 'close', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* 운영 설정 탭 */}
        <TabsContent value="operation" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-heading-3 text-gray-900 mb-6">주문 설정</h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-body font-medium text-gray-900">매장 픽업</h3>
                  <p className="text-body-small text-gray-600">고객이 매장에서 직접 픽업할 수 있습니다</p>
                </div>
                <Switch
                  checked={storeSettings.orderSettings.pickupEnabled}
                  onCheckedChange={(checked) => updateSetting('orderSettings', 'pickupEnabled', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-body font-medium text-gray-900">배달 서비스</h3>
                  <p className="text-body-small text-gray-600">고객에게 배달 서비스를 제공합니다</p>
                </div>
                <Switch
                  checked={storeSettings.orderSettings.deliveryEnabled}
                  onCheckedChange={(checked) => updateSetting('orderSettings', 'deliveryEnabled', checked)}
                />
              </div>

              {storeSettings.orderSettings.deliveryEnabled && (
                <div className="ml-4 space-y-4 border-l-2 border-gray-100 pl-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-label text-gray-900 mb-2 block">배달비</label>
                      <Input
                        type="number"
                        value={storeSettings.orderSettings.deliveryFee}
                        onChange={(e) => updateSetting('orderSettings', 'deliveryFee', parseInt(e.target.value))}
                        placeholder="3000"
                      />
                    </div>
                    <div>
                      <label className="text-label text-gray-900 mb-2 block">무료배달 최소주문금액</label>
                      <Input
                        type="number"
                        value={storeSettings.orderSettings.freeDeliveryMinAmount}
                        onChange={(e) => updateSetting('orderSettings', 'freeDeliveryMinAmount', parseInt(e.target.value))}
                        placeholder="20000"
                      />
                    </div>
                  </div>
                </div>
              )}

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-label text-gray-900 mb-2 block">주문 처리 시간 (분)</label>
                  <Input
                    type="number"
                    value={storeSettings.orderSettings.orderTimeLimit}
                    onChange={(e) => updateSetting('orderSettings', 'orderTimeLimit', parseInt(e.target.value))}
                    placeholder="30"
                  />
                  <p className="text-caption text-gray-500 mt-1">평균적인 주문 준비 시간</p>
                </div>

                <div>
                  <label className="text-label text-gray-900 mb-2 block">사전 주문 가능 일수</label>
                  <Input
                    type="number"
                    value={storeSettings.orderSettings.advanceOrderDays}
                    onChange={(e) => updateSetting('orderSettings', 'advanceOrderDays', parseInt(e.target.value))}
                    placeholder="7"
                  />
                  <p className="text-caption text-gray-500 mt-1">미리 주문받을 수 있는 최대 일수</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* 결제 설정 탭 */}
        <TabsContent value="payment" className="space-y-6">
          {/* TODO: 실제 storeId를 Context나 URL에서 가져와야 함 */}
          <StorePaymentSettingsTab storeId="store_123" />

          {/* OLD MOCK PAYMENT UI START
          <Card className="p-6">
            <h2 className="text-heading-3 text-gray-900 mb-6">결제 방식</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <div>
                    <h3 className="text-body font-medium text-gray-900">카드 결제</h3>
                    <p className="text-body-small text-gray-600">신용카드, 체크카드 결제</p>
                  </div>
                </div>
                <Switch
                  checked={storeSettings.paymentSettings.cardEnabled}
                  onCheckedChange={(checked) => updateSetting('paymentSettings', 'cardEnabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-gray-600" />
                  <div>
                    <h3 className="text-body font-medium text-gray-900">현금 결제</h3>
                    <p className="text-body-small text-gray-600">현금 결제 받기</p>
                  </div>
                </div>
                <Switch
                  checked={storeSettings.paymentSettings.cashEnabled}
                  onCheckedChange={(checked) => updateSetting('paymentSettings', 'cashEnabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-gray-600" />
                  <div>
                    <h3 className="text-body font-medium text-gray-900">디지털 결제</h3>
                    <p className="text-body-small text-gray-600">카카오페이, 네이버페이 등</p>
                  </div>
                </div>
                <Switch
                  checked={storeSettings.paymentSettings.digitalPayEnabled}
                  onCheckedChange={(checked) => updateSetting('paymentSettings', 'digitalPayEnabled', checked)}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-heading-3 text-gray-900 mb-6">적립금 프로그램</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-body font-medium text-gray-900">적립금 프로그램 활성화</h3>
                  <p className="text-body-small text-gray-600">구매 금액에 따라 적립금을 제공합니다</p>
                </div>
                <Switch
                  checked={storeSettings.paymentSettings.loyaltyProgram}
                  onCheckedChange={(checked) => updateSetting('paymentSettings', 'loyaltyProgram', checked)}
                />
              </div>

              {storeSettings.paymentSettings.loyaltyProgram && (
                <div className="ml-4 border-l-2 border-gray-100 pl-4">
                  <div className="max-w-sm">
                    <label className="text-label text-gray-900 mb-2 block">적립률 (%)</label>
                    <Input
                      type="number"
                      value={storeSettings.paymentSettings.pointRate}
                      onChange={(e) => updateSetting('paymentSettings', 'pointRate', parseInt(e.target.value))}
                      placeholder="5"
                      min="0"
                      max="20"
                    />
                    <p className="text-caption text-gray-500 mt-1">구매 금액의 몇 %를 적립할지 설정</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
          OLD MOCK PAYMENT UI END */}
        </TabsContent>

        {/* 알림 설정 탭 */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-heading-3 text-gray-900 mb-6">알림 설정</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-body font-medium text-gray-900">새 주문 알림</h3>
                  <p className="text-body-small text-gray-600">새로운 주문이 들어올 때 알림을 받습니다</p>
                </div>
                <Switch
                  checked={storeSettings.notificationSettings.newOrderAlert}
                  onCheckedChange={(checked) => updateSetting('notificationSettings', 'newOrderAlert', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-body font-medium text-gray-900">재고 부족 알림</h3>
                  <p className="text-body-small text-gray-600">상품 재고가 부족할 때 알림을 받습니다</p>
                </div>
                <Switch
                  checked={storeSettings.notificationSettings.lowStockAlert}
                  onCheckedChange={(checked) => updateSetting('notificationSettings', 'lowStockAlert', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-body font-medium text-gray-900">고객 리뷰 알림</h3>
                  <p className="text-body-small text-gray-600">새로운 고객 리뷰가 등록될 때 알림을 받습니다</p>
                </div>
                <Switch
                  checked={storeSettings.notificationSettings.customerReview}
                  onCheckedChange={(checked) => updateSetting('notificationSettings', 'customerReview', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-body font-medium text-gray-900">일일 요약 알림</h3>
                  <p className="text-body-small text-gray-600">매일 매출 요약을 알림으로 받습니다</p>
                </div>
                <Switch
                  checked={storeSettings.notificationSettings.dailySummary}
                  onCheckedChange={(checked) => updateSetting('notificationSettings', 'dailySummary', checked)}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-heading-3 text-gray-900 mb-6">알림 방식</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <div>
                    <h3 className="text-body font-medium text-gray-900">이메일 알림</h3>
                    <p className="text-body-small text-gray-600">이메일로 알림을 받습니다</p>
                  </div>
                </div>
                <Switch
                  checked={storeSettings.notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => updateSetting('notificationSettings', 'emailNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-gray-600" />
                  <div>
                    <h3 className="text-body font-medium text-gray-900">SMS 알림</h3>
                    <p className="text-body-small text-gray-600">문자 메시지로 알림을 받습니다</p>
                  </div>
                </div>
                <Switch
                  checked={storeSettings.notificationSettings.smsNotifications}
                  onCheckedChange={(checked) => updateSetting('notificationSettings', 'smsNotifications', checked)}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* 브랜딩 탭 */}
        <TabsContent value="branding" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-heading-3 text-gray-900 mb-6">브랜드 컬러</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-label text-gray-900 mb-2 block">주 색상</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={storeSettings.brandingSettings.primaryColor}
                    onChange={(e) => updateSetting('brandingSettings', 'primaryColor', e.target.value)}
                    className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
                  />
                  <Input
                    value={storeSettings.brandingSettings.primaryColor}
                    onChange={(e) => updateSetting('brandingSettings', 'primaryColor', e.target.value)}
                    placeholder="#2563eb"
                  />
                </div>
              </div>

              <div>
                <label className="text-label text-gray-900 mb-2 block">보조 색상</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={storeSettings.brandingSettings.secondaryColor}
                    onChange={(e) => updateSetting('brandingSettings', 'secondaryColor', e.target.value)}
                    className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
                  />
                  <Input
                    value={storeSettings.brandingSettings.secondaryColor}
                    onChange={(e) => updateSetting('brandingSettings', 'secondaryColor', e.target.value)}
                    placeholder="#64748b"
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-heading-3 text-gray-900 mb-6">이미지 설정</h2>

            <div className="space-y-6">
              <div>
                <label className="text-label text-gray-900 mb-3 block">커버 이미지</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-body-small text-gray-600 mb-2">상점의 대�� 이미지를 업로드하세요</p>
                  <Button variant="outline" size="sm" onClick={handleCoverImageUpload}>
                    <Upload className="w-4 h-4 mr-2" />
                    이미지 업로드
                  </Button>
                  <p className="text-caption text-gray-500 mt-2">권장 크기: 1200x400px</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-heading-3 text-gray-900 mb-6">QR 코드</h2>

            <div className="flex items-center gap-6">
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                <QrCode className="w-16 h-16 text-gray-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-body font-medium text-gray-900 mb-2">상점 QR 코드</h3>
                <p className="text-body-small text-gray-600 mb-4">
                  고객들이 스캔하여 바로 주문할 수 있는 QR 코드입니다.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleQrDownload}>
                    <Download className="w-4 h-4 mr-2" />
                    QR 코드 다운로드
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleQrPrint}>
                    <Printer className="w-4 h-4 mr-2" />
                    인쇄하기
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 변경사항 저장 플로팅 버튼 */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={handleSave}
            className="bg-primary-blue hover:bg-primary-blue-dark shadow-lg"
            size="lg"
          >
            <Save className="w-5 h-5 mr-2" />
            변경사항 저장
          </Button>
        </div>
      )}
    </div>
  );
}
