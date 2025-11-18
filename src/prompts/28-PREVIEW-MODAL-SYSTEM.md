# 28 - App Preview Modal System

## 📌 목표
앱 빌더에서 생성한 앱을 미리보기하고 검증하는 모달 시스템을 구축합니다.

**결과물**:
- app-preview-modal.tsx - 앱 미리보기 모달

**총 1개 파일**

---

## 🔄 STEP 1: App Preview Modal

### 프롬프트 템플릿

```
앱 생성 전 미리보기 및 검증 모달을 만듭니다.

## 요구사항

/components/app-builder/app-preview-modal.tsx 생성:

```typescript
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
      toast.success('앱 생성을 시작합니다...');
      
      // Simulate generation time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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

  // Get enabled features
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            앱 미리보기
          </DialogTitle>
          <DialogDescription>
            생성될 앱을 미리 확인하고 검증합니다
          </DialogDescription>
        </DialogHeader>

        {/* Validation Alerts */}
        {validationErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-bold mb-2">다음 항목을 확인해주세요:</p>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="preview">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preview">미리보기</TabsTrigger>
            <TabsTrigger value="features">기능 요약</TabsTrigger>
            <TabsTrigger value="validation">검증 결과</TabsTrigger>
          </TabsList>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-4">
            {/* Device Selector */}
            <div className="flex justify-center gap-2">
              <Button
                variant={activeDevice === 'mobile' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveDevice('mobile')}
              >
                <Smartphone className="w-4 h-4 mr-2" />
                모바일
              </Button>
              <Button
                variant={activeDevice === 'tablet' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveDevice('tablet')}
              >
                <Tablet className="w-4 h-4 mr-2" />
                태블릿
              </Button>
              <Button
                variant={activeDevice === 'desktop' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveDevice('desktop')}
              >
                <Monitor className="w-4 h-4 mr-2" />
                데스크톱
              </Button>
            </div>

            {/* Device Frame */}
            <div className="flex justify-center">
              <div className={`${getDeviceFrame(activeDevice)} bg-slate-100 rounded-lg border-2 border-slate-300 overflow-auto p-4`}>
                {/* Store Header Preview */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                  <div className="flex items-center gap-3">
                    {data.branding?.logo ? (
                      <img src={data.branding.logo} alt="Logo" className="w-12 h-12 rounded" />
                    ) : (
                      <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center">
                        <Store className="w-6 h-6 text-primary" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold">{data.storeInfo?.name || '상점명'}</h3>
                      <p className="text-sm text-slate-600">{data.storeInfo?.description || '설명'}</p>
                    </div>
                    <Badge>{data.selectedPlan || 'Basic'}</Badge>
                  </div>
                </div>

                {/* Features Preview */}
                <div className="grid grid-cols-2 gap-2">
                  <Card>
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4" />
                        주문
                      </CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        분석
                      </CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        고객
                      </CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        설정
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  활성화된 기능
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {getEnabledFeatures().map((feature, index) => (
                    <Badge key={index} variant="outline" className="bg-green-50">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {getDisabledFeatures().length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    선택적 기능
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {getDisabledFeatures().map((feature, index) => (
                      <Badge key={index} variant="outline" className="bg-orange-50">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Validation Tab */}
          <TabsContent value="validation" className="space-y-4">
            {validationErrors.length === 0 ? (
              <Alert>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription>
                  모든 필수 항목이 완료되었습니다. 앱을 생성할 준비가 되었습니다!
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {validationErrors.length}개의 필수 항목이 완료되지 않았습니다
                </AlertDescription>
              </Alert>
            )}

            {/* Store Info Summary */}
            <Card>
              <CardHeader>
                <CardTitle>상점 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">서브도메인</span>
                  <span>{data.subdomain || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">상점명</span>
                  <span>{data.storeInfo?.name || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">플랜</span>
                  <Badge>{data.selectedPlan || '-'}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">사장님</span>
                  <span>{data.storeInfo?.ownerInfo?.name || '-'}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isGenerating}>
            취소
          </Button>
          <Button 
            onClick={handleGenerateApp} 
            disabled={validationErrors.length > 0 || isGenerating}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                생성 중...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                앱 생성하기
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
```

IMPORTANT:
- 3개 탭 (미리보기, 기능 요약, 검증 결과)
- 디바이스별 미리보기 (모바일, 태블릿, 데스크톱)
- 실시간 검증 (필수 항목 체크)
- 활성화/비활성화 기능 표시
- 앱 생성 버튼 (검증 통과 시만 활성화)
```

### 예상 결과

```
/components/app-builder/app-preview-modal.tsx
```

---

## 📝 핵심 포인트

### 3개 탭
1. **미리보기**: 디바이스별 앱 화면
2. **기능 요약**: 활성화/비활성화 기능 목록
3. **검증 결과**: 필수 항목 완료 여부

### 검증 항목
- 서브도메인
- 상점명
- 사장님 정보 (이름, 이메일)
- 플랜 선택

### 디바이스 프레임
- 모바일: 320px width
- 태블릿: 768px width
- 데스크톱: Full width

---

## ✅ 완료 체크리스트

- [ ] app-preview-modal.tsx 생성
- [ ] 3개 탭 구현
- [ ] 디바이스별 미리보기
- [ ] 검증 로직
- [ ] 앱 생성 버튼

---

## 📝 다음 단계

**29-COMPLETE-INTEGRATION-DEMO.md**로 이동하여 통합 데모를 구축합니다.
