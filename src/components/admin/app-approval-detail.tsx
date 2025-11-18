import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  ArrowLeft, CheckCircle, XCircle, Clock, 
  CreditCard, Settings, Save, TestTube,
  Eye, EyeOff, AlertCircle, Info, Crown,
  Star, Building, Mail, Phone
} from 'lucide-react';
import { useNavigation } from '../system/app-router';
import { InteractiveInput } from '../interactions/interactive-input';
import { InteractiveButton } from '../interactions/interactive-button';
import { Checkbox } from '../ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { AppApprovalRequest } from './app-approval-management';

interface PaymentIntegrationConfig {
  nicepayApiKey: string;
  nicepaySecretKey: string;
  nicepaySdkVersion: string;
  isTestMode: boolean;
  webhookUrl: string;
  paymentMethods: string[];
  isConfigured: boolean;
}

export function AppApprovalDetail({ requestId }: { requestId?: string }) {
  const { navigate } = useNavigation();
  const [request] = useState<AppApprovalRequest>({
    id: requestId || 'req-001',
    requestId: 'APP-20240928-001',
    storeName: '카페 마이스토리',
    subdomain: 'cafe-mystory',
    ownerName: '김사장',
    ownerEmail: 'owner@cafe-mystory.com',
    ownerPhone: '010-1234-5678',
    planType: 'enterprise',
    status: 'under-review',
    requestDate: '2024-09-28T10:30:00Z',
    appConfig: {
      storeInfo: { name: '카페 마이스토리', category: '카페' },
      planSelection: { plan: 'enterprise' },
      orderPayment: { paymentMethods: ['card', 'kakao', 'naver'] },
      customerMarketing: { loyaltyProgram: true },
      branding: { primaryColor: '#3B82F6' },
      finalSettings: { features: ['delivery', 'pickup', 'reservation'] }
    },
    priority: 'normal',
    estimatedProcessingTime: '1-2 영업일',
    notes: '카페 체인점으로 기존 POS 시스템과 연동 필요'
  });

  const [paymentConfig, setPaymentConfig] = useState<PaymentIntegrationConfig>({
    nicepayApiKey: '',
    nicepaySecretKey: '',
    nicepaySdkVersion: '2.0',
    isTestMode: true,
    webhookUrl: `https://${request.subdomain}.mystory.kr/webhook/nicepay`,
    paymentMethods: ['card', 'kakao', 'naver'],
    isConfigured: false
  });

  const [showApiKeys, setShowApiKeys] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const getPlanIcon = (planType: string) => {
    switch (planType) {
      case 'enterprise':
        return <Crown className="w-6 h-6 text-purple-600" />;
      case 'pro':
        return <Star className="w-6 h-6 text-blue-600" />;
      case 'basic':
        return <Building className="w-6 h-6 text-gray-600" />;
      default:
        return <Building className="w-6 h-6 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />대기중</Badge>;
      case 'under-review':
        return <Badge className="bg-blue-100 text-blue-800"><Eye className="w-3 h-3 mr-1" />검토중</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />승인됨</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />거부됨</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleSavePaymentConfig = () => {
    console.log('결제 연동 설정 저장:', paymentConfig);
    // 실제 결제 연동 설정 저장 로직
    setPaymentConfig(prev => ({ ...prev, isConfigured: true }));
    alert('나이스페이 결제 연동 설정이 저장되었습니다.');
  };

  const handleTestPaymentConnection = async () => {
    setIsTesting(true);
    try {
      // 나이스페이 API 연결 테스트 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('결제 연동 테스트 성공');
      alert('나이스페이 API 연결 테스트가 성공했습니다!');
    } catch (error) {
      console.error('결제 연동 테스트 실패:', error);
      alert('나이스페이 API 연결 테스트가 실패했습니다. API 키를 확인해주세요.');
    } finally {
      setIsTesting(false);
    }
  };

  const handleApproveRequest = () => {
    if (!paymentConfig.isConfigured) {
      alert('결제 연동 설정을 완료한 후 승인할 수 있습니다.');
      return;
    }
    
    console.log('승인 처리:', request);
    alert(`${request.storeName}의 앱 배포가 승인되었습니다.`);
    navigate('admin-app-approval');
  };

  const handleRejectRequest = () => {
    const reason = prompt('거부 사유를 입력해주세요:');
    if (reason) {
      console.log('거부 처리:', request, reason);
      alert(`${request.storeName}의 앱 배포가 거부되었습니다.`);
      navigate('admin-app-approval');
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('admin-app-approval')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          승인 요청 목록으로
        </Button>
        <div className="h-8 w-px bg-gray-300" />
        <div>
          <h1 className="font-bold text-gray-900">앱 승인 요청 상세</h1>
          <p className="text-gray-600">요청 ID: {request.requestId}</p>
        </div>
      </div>

      {/* 요청 정보 */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {getPlanIcon(request.planType)}
            <div>
              <h2 className="font-semibold text-gray-900">{request.storeName}</h2>
              <p className="text-gray-600">{request.subdomain}.mystory.kr</p>
            </div>
          </div>
          {getStatusBadge(request.status)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-gray-500">사장명</label>
              <p className="font-medium text-gray-900">{request.ownerName}</p>
            </div>
            <div>
              <label className="text-gray-500">이메일</label>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <p className="font-medium text-gray-900">{request.ownerEmail}</p>
              </div>
            </div>
            <div>
              <label className="text-gray-500">전화번호</label>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <p className="font-medium text-gray-900">{request.ownerPhone}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-gray-500">플랜</label>
              <p className="font-medium text-gray-900 capitalize">{request.planType}</p>
            </div>
            <div>
              <label className="text-gray-500">요청일</label>
              <p className="font-medium text-gray-900">
                {new Date(request.requestDate).toLocaleDateString('ko-KR')}
              </p>
            </div>
            <div>
              <label className="text-gray-500">처리 예정</label>
              <p className="font-medium text-gray-900">{request.estimatedProcessingTime}</p>
            </div>
          </div>
        </div>

        {request.notes && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" />
              <p className="text-blue-800">{request.notes}</p>
            </div>
          </div>
        )}
      </Card>

      {/* 앱 설정 정보 */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">앱빌드 설정 정보</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">기본 정보</h4>
            <p className="text-gray-600">카테고리: {request.appConfig.storeInfo?.category}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">플랜 선택</h4>
            <p className="text-gray-600">플랜: {request.appConfig.planSelection?.plan}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">결제 수단</h4>
            <p className="text-gray-600">
              {request.appConfig.orderPayment?.paymentMethods?.join(', ')}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">고객 관리</h4>
            <p className="text-gray-600">
              적립제: {request.appConfig.customerMarketing?.loyaltyProgram ? '활성화' : '비활성화'}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">브랜딩</h4>
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded" 
                style={{ backgroundColor: request.appConfig.branding?.primaryColor }}
              ></div>
              <p className="text-gray-600">{request.appConfig.branding?.primaryColor}</p>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">서비스 기능</h4>
            <p className="text-gray-600">
              {request.appConfig.finalSettings?.features?.join(', ')}
            </p>
          </div>
        </div>
      </Card>

      {/* 결제 연동 설정 */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-gray-900">나이스페이 결제 연동 설정</h3>
            <p className="text-gray-600">상점별 결제 시스템 설정을 완료해주세요</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowApiKeys(!showApiKeys)}
            >
              {showApiKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showApiKeys ? '숨기기' : '보기'}
            </Button>
            <Badge className={paymentConfig.isConfigured ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
              {paymentConfig.isConfigured ? '설정 완료' : '설정 필요'}
            </Badge>
          </div>
        </div>

        <div className="space-y-6">
          {/* 나이스페이 API 설정 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-label text-gray-700 mb-2 block">
                나이스페이 API 키
              </label>
              <div className="flex gap-2">
                <InteractiveInput
                  type={showApiKeys ? "text" : "password"}
                  value={paymentConfig.nicepayApiKey}
                  onChange={(e) => setPaymentConfig({...paymentConfig, nicepayApiKey: e.target.value})}
                  placeholder="나이스페이 API 키를 입력하세요"
                  className="flex-1"
                />
                <InteractiveButton 
                  variant="secondary" 
                  size="sm"
                  onClick={handleTestPaymentConnection}
                  disabled={isTesting || !paymentConfig.nicepayApiKey}
                >
                  {isTesting ? '테스트 중...' : '테스트'}
                </InteractiveButton>
              </div>
            </div>
            
            <div>
              <label className="text-label text-gray-700 mb-2 block">
                나이스페이 Secret 키
              </label>
              <InteractiveInput
                type={showApiKeys ? "text" : "password"}
                value={paymentConfig.nicepaySecretKey}
                onChange={(e) => setPaymentConfig({...paymentConfig, nicepaySecretKey: e.target.value})}
                placeholder="나이스페이 Secret 키를 입력하세요"
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-label text-gray-700 mb-2 block">
                SDK 버전
              </label>
              <Select 
                value={paymentConfig.nicepaySdkVersion}
                onValueChange={(value) => setPaymentConfig({...paymentConfig, nicepaySdkVersion: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1.0">SDK v1.0</SelectItem>
                  <SelectItem value="2.0">SDK v2.0 (권장)</SelectItem>
                  <SelectItem value="3.0">SDK v3.0 (최신)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-label text-gray-700 mb-2 block">
                Webhook URL
              </label>
              <InteractiveInput
                type="url"
                value={paymentConfig.webhookUrl}
                onChange={(e) => setPaymentConfig({...paymentConfig, webhookUrl: e.target.value})}
                placeholder={`https://${request.subdomain}.mystory.kr/webhook/nicepay`}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="testMode"
              checked={paymentConfig.isTestMode}
              onCheckedChange={(checked) => setPaymentConfig({...paymentConfig, isTestMode: !!checked})}
            />
            <label htmlFor="testMode" className="font-medium text-gray-700">
              테스트 모드 활성화 (실제 결제 전 테스트용)
            </label>
          </div>

          {/* 결제 수단 선택 */}
          <div>
            <label className="text-label text-gray-700 mb-2 block">
              활성화할 결제 수단
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['card', 'kakao', 'naver', 'payco'].map(method => (
                <div key={method} className="flex items-center space-x-2">
                  <Checkbox 
                    id={method}
                    checked={paymentConfig.paymentMethods.includes(method)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setPaymentConfig({
                          ...paymentConfig, 
                          paymentMethods: [...paymentConfig.paymentMethods, method]
                        });
                      } else {
                        setPaymentConfig({
                          ...paymentConfig, 
                          paymentMethods: paymentConfig.paymentMethods.filter(m => m !== method)
                        });
                      }
                    }}
                  />
                  <label htmlFor={method} className="font-medium text-gray-700 capitalize">
                    {method === 'card' ? '신용카드' : 
                     method === 'kakao' ? '카카오페이' :
                     method === 'naver' ? '네이버페이' : '페이코'}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* 알림 */}
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>중요:</strong> 나이스페이 API 키와 Secret 키는 상점에서 직접 발급받아야 합니다. 
              테스트 모드를 활성화하면 실제 결제가 진행되지 않습니다.
            </AlertDescription>
          </Alert>

          {/* 저장 버튼 */}
          <div className="flex justify-end">
            <InteractiveButton
              variant="primary"
              onClick={handleSavePaymentConfig}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              결제 연동 설정 저장
            </InteractiveButton>
          </div>
        </div>
      </Card>

      {/* 액션 버튼 */}
      <div className="flex justify-end gap-3">
        <Button 
          variant="outline"
          onClick={handleRejectRequest}
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          <XCircle className="w-4 h-4 mr-2" />
          거부
        </Button>
        <Button 
          onClick={handleApproveRequest}
          disabled={!paymentConfig.isConfigured}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          승인 {!paymentConfig.isConfigured && '(결제 설정 완료 필요)'}
        </Button>
      </div>
    </div>
  );
}