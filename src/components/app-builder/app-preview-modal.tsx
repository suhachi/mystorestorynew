import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  Eye, 
  Smartphone, 
  Monitor, 
  Tablet,
  Zap,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Store,
  ShoppingBag,
  Settings,
  BarChart3,
  Users,
  Crown
} from 'lucide-react';
import { useAppBuilder } from '../system/data-context';
import { toast } from 'sonner@2.0.3';

interface AppPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate?: () => void;
}

export const AppPreviewModal: React.FC<AppPreviewModalProps> = ({
  isOpen,
  onClose,
  onGenerate
}) => {
  const { data } = useAppBuilder();
  const [activeDevice, setActiveDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Validate store config when modal opens
  useEffect(() => {
    if (isOpen && data) {
      const errors = validateStoreConfig();
      setValidationErrors(errors);
    }
  }, [isOpen, data]);

  // Validate store configuration
  const validateStoreConfig = () => {
    const errors: string[] = [];
    
    if (!data.subdomain) {
      errors.push('서브도메인이 설정되지 않았습니다');
    }
    
    if (!data.storeInfo?.name) {
      errors.push('상점명이 입력되지 않았습니다');
    }
    
    if (!data.storeInfo?.ownerInfo?.name) {
      errors.push('사장님 이름이 입력되지 않았습니다');
    }
    
    if (!data.storeInfo?.ownerInfo?.email) {
      errors.push('사장님 이메일이 입력되지 않았습니다');
    }
    
    if (!data.selectedPlan) {
      errors.push('플랜이 선택되지 않았습니다');
    }
    
    return errors;
  };

  const handleGenerateApp = async () => {
    if (validationErrors.length > 0) {
      toast.error('설정을 확인해주세요');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate app generation process
      toast.success('앱 생성을 시작합니다...');
      
      // Simulate generation time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Call the onGenerate callback
      if (onGenerate) {
        await onGenerate();
      }
      
      toast.success('앱이 성공적으로 생성되었습니다!');
      onClose();
    } catch (error) {
      toast.error('앱 생성 중 오류가 발생했습니다');
    } finally {
      setIsGenerating(false);
    }
  };

  const getDeviceFrame = (device: string) => {
    const frames = {
      mobile: 'w-80 h-[640px]',
      tablet: 'w-96 h-[512px]',
      desktop: 'w-full h-[600px] max-w-4xl'
    };
    return frames[device as keyof typeof frames] || frames.mobile;
  };

  const getDeviceScale = (device: string) => {
    const scales = {
      mobile: 'scale-90',
      tablet: 'scale-75',
      desktop: 'scale-60'
    };
    return scales[device as keyof typeof scales] || scales.mobile;
  };

  // Get enabled features based on current configuration
  const getEnabledFeatures = () => {
    const features: string[] = [];
    
    if (data.storeInfo?.name) features.push('기본 정보');
    if (data.selectedPlan) features.push(`${data.selectedPlan} 플랜`);
    if (data.features?.length) features.push('선택된 기능들');
    if (data.branding?.primaryColor) features.push('브랜딩');
    if (data.storeInfo?.operatingHours) features.push('운영시간');
    
    return features;
  };

  // Get disabled features
  const getDisabledFeatures = () => {
    const features: string[] = [];
    
    if (!data.branding?.logo) features.push('로고');
    if (!data.branding?.coverImage) features.push('커버 이미지');
    if (!data.storeInfo?.businessNumber) features.push('사업자번호');
    if (!data.storeInfo?.address) features.push('주소');
    
    return features;
  };

  if (!data) {
    return null;
  }

  const enabledFeatures = getEnabledFeatures();
  const disabledFeatures = getDisabledFeatures();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary-blue" />
            앱 미리보기
          </DialogTitle>
          <DialogDescription>
            설정한 내용이 실제 앱에서 어떻게 보이는지 확인하세요
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 디바이스 선택 탭 */}
          <Tabs value={activeDevice} onValueChange={(value) => setActiveDevice(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="mobile" className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                모바일
              </TabsTrigger>
              <TabsTrigger value="tablet" className="flex items-center gap-2">
                <Tablet className="w-4 h-4" />
                태블릿
              </TabsTrigger>
              <TabsTrigger value="desktop" className="flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                데스크톱
              </TabsTrigger>
            </TabsList>

            {/* 미리보기 영역 */}
            <TabsContent value={activeDevice} className="mt-6">
              <div className="flex justify-center">
                <div className={`${getDeviceFrame(activeDevice)} border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100`}>
                  <div className={`${getDeviceScale(activeDevice)} origin-top-left w-full h-full`}>
                    {/* Mock App Preview */}
                    <div className="w-full h-full bg-white">
                      {/* App Header */}
                      <div 
                        className="p-4 text-white"
                        style={{ backgroundColor: data.branding?.primaryColor || '#2563eb' }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                            <Store className="w-4 h-4" />
                          </div>
                          <div style={{ fontFamily: data.branding?.fontFamily || 'Inter' }}>
                            <h3 className="font-semibold">{data.storeInfo?.name || '상점명'}</h3>
                            <p className="text-sm opacity-90">배달앱</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* App Content */}
                      <div className="p-4 space-y-4">
                        {/* Navigation Cards */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-gray-50 rounded-lg text-center">
                            <ShoppingBag className="w-6 h-6 mx-auto mb-2 text-primary-blue" />
                            <p className="text-sm font-medium">메뉴</p>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg text-center">
                            <BarChart3 className="w-6 h-6 mx-auto mb-2 text-primary-blue" />
                            <p className="text-sm font-medium">주문현황</p>
                          </div>
                        </div>
                        
                        {/* Sample Menu Item */}
                        <div className="border rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">인기 메뉴</h4>
                              <p className="text-sm text-gray-600">맛있는 메뉴 설명</p>
                              <p 
                                className="font-semibold mt-1"
                                style={{ color: data.branding?.primaryColor || '#2563eb' }}
                              >
                                15,000원
                              </p>
                            </div>
                            <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                          </div>
                        </div>
                        
                        {/* Status Info */}
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>서브도메인:</strong> {data.subdomain || 'example'}.mystory-store.com
                          </p>
                          <p className="text-sm text-blue-800 mt-1">
                            <strong>플랜:</strong> {data.selectedPlan || 'Basic'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* 설정 요약 */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* 활성화된 기능 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  활성화된 기능
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {enabledFeatures.length > 0 ? (
                    enabledFeatures.map((feature, index) => (
                      <Badge key={index} variant="default" className="mr-2 mb-2">
                        {feature}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">활성화된 기능이 없습니다</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 선택사항 또는 미설정 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  선택사항
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {disabledFeatures.length > 0 ? (
                    disabledFeatures.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="mr-2 mb-2">
                        {feature}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">모든 기본 설정이 완료되었습니다</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 검증 오류 */}
          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium">설정을 확인해주세요:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* 앱 생성 안내 */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-green-900 mb-1">앱 생성 준비 완료</h3>
                  <p className="text-xs text-green-800">
                    설정이 완료되면 실제 작동하는 앱이 생성됩니다. 생성된 앱은 즉시 사용할 수 있으며, 
                    언제든지 설정을 변경할 수 있습니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 액션 버튼 */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              닫기
            </Button>
            <Button 
              onClick={handleGenerateApp}
              disabled={validationErrors.length > 0 || isGenerating}
              className="flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  생성 중...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  앱 생성하기
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};