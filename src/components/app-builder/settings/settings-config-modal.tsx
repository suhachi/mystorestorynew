import React, { useState } from 'react';
import { 
  Store, Clock, CreditCard, Bell, Shield, Settings, 
  X, Download, Upload, RotateCcw
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { toast } from 'sonner';
import { FeatureCard } from '../../../hooks/useDragAndDrop';
import { SettingsConfig, useSettingsConfig } from '../../../hooks/useSettingsConfig';
import { BasicInfoConfigSection } from './basic-info-config-section';
import { OperatingHoursConfigSection } from './operating-hours-config-section';
import { PaymentConfigSection } from './payment-config-section';
import { NotificationsConfigSection } from './notifications-config-section';
import { SecurityConfigSection } from './security-config-section';
import { AdvancedConfigSection } from './advanced-config-section';

interface SettingsConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: FeatureCard;
  currentPlan: 'Basic' | 'Pro' | 'Enterprise';
  onSave: (config: SettingsConfig) => void;
  initialConfig?: SettingsConfig;
}

export function SettingsConfigModal({ 
  isOpen, 
  onClose, 
  card, 
  currentPlan, 
  onSave,
  initialConfig 
}: SettingsConfigModalProps) {
  const { loadConfig, saveConfig, resetConfig, exportConfig, validateConfig } = useSettingsConfig();
  const [config, setConfig] = useState<SettingsConfig>(() => 
    initialConfig || loadConfig(card.id, currentPlan)
  );
  const [activeTab, setActiveTab] = useState('basic');
  const [isExporting, setIsExporting] = useState(false);

  // 플랜별 기능 접근 권한 확인
  const canUseFeature = (feature: string) => {
    switch (feature) {
      case 'storeLogo':
      case 'seasonalHours':
      case 'multiLocation':
      case 'paymentMethods':
      case 'loyaltyProgram':
      case 'thirdPartyIntegrations':
        return currentPlan === 'Pro' || currentPlan === 'Enterprise';
      case 'whiteLabeling':
      case 'multiTenant':
      case 'advancedAnalytics':
      case 'customWorkflows':
      case 'prioritySupport':
        return currentPlan === 'Enterprise';
      default:
        return true;
    }
  };

  const handleSave = () => {
    if (!validateConfig(config, currentPlan)) {
      toast.error('필수 설정이 누락되었습니다. 모든 필수 항목을 확인해주세요.');
      return;
    }

    saveConfig(card.id, config);
    onSave(config);
    toast.success('상점 설정이 성공적으로 저장되었습니다!');
    onClose();
  };

  const handleReset = () => {
    const defaultConfig = resetConfig(card.id, currentPlan);
    setConfig(defaultConfig);
    toast.success('설정이 기본값으로 초기화되었습니다.');
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      exportConfig(card.id);
      toast.success('설정이 파일로 내보내졌습니다.');
    } catch (error) {
      toast.error('설정 내보내기에 실패했습니다.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const importedConfig = JSON.parse(event.target?.result as string);
            setConfig(importedConfig);
            toast.success('설정이 성공적으로 가져와졌습니다.');
          } catch (error) {
            toast.error('잘못된 설정 파일입니다.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const updateConfig = (section: keyof SettingsConfig, updates: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...updates
      }
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-3xl">{card.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                {card.name} 설정
                <Badge className={`
                  ${currentPlan === 'Basic' ? 'bg-gray-100 text-gray-700' :
                    currentPlan === 'Pro' ? 'bg-blue-100 text-blue-700' :
                    'bg-purple-100 text-purple-700'}
                `}>
                  {currentPlan}
                </Badge>
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>
            {card.description} - 플랜에 따라 사용할 수 있는 설정 기능이 다릅니다.
          </DialogDescription>
        </DialogHeader>

        {/* 설정 관리 버튼 */}
        <div className="flex justify-between items-center border-b pb-4">
          <div className="text-body-small text-gray-600">
            현재 플랜: <span className="font-medium">{currentPlan}</span>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleImport}
            >
              <Upload className="w-4 h-4 mr-2" />
              가져오기
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExport}
              disabled={isExporting}
            >
              <Download className="w-4 h-4 mr-2" />
              내보내기
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleReset}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              초기화
            </Button>
          </div>
        </div>

        {/* 설정 탭 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Store className="w-4 h-4" />
              기본 정보
            </TabsTrigger>
            <TabsTrigger value="hours" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              운영 시간
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              결제 설정
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              알림 설정
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              보안 설정
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              고급 설정
            </TabsTrigger>
          </TabsList>

          {/* 기본 정보 설정 */}
          <TabsContent value="basic" className="space-y-4">
            <BasicInfoConfigSection 
              config={config} 
              onChange={(updates) => updateConfig('basicInfo', updates)}
              currentPlan={currentPlan} 
              canUseFeature={canUseFeature}
            />
          </TabsContent>

          {/* 운영 시간 설정 */}
          <TabsContent value="hours" className="space-y-4">
            <OperatingHoursConfigSection 
              config={config} 
              onChange={(updates) => updateConfig('operatingHours', updates)}
              currentPlan={currentPlan} 
              canUseFeature={canUseFeature}
            />
          </TabsContent>

          {/* 결제 설정 */}
          <TabsContent value="payment" className="space-y-4">
            {currentPlan === 'Basic' ? (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-body font-medium text-gray-700 mb-2">
                  Pro 플랜 이상에서 사용 가능
                </h3>
                <p className="text-body-small text-gray-500">
                  결제 설정 기능을 사용하려면 플랜을 업그레이드하세요.
                </p>
                <Button className="mt-4" size="sm">
                  플랜 업그레이드
                </Button>
              </div>
            ) : (
              <PaymentConfigSection 
                config={config} 
                onChange={(updates) => updateConfig('paymentSettings', updates)}
                currentPlan={currentPlan} 
                canUseFeature={canUseFeature}
              />
            )}
          </TabsContent>

          {/* 알림 설정 */}
          <TabsContent value="notifications" className="space-y-4">
            <NotificationsConfigSection 
              config={config} 
              onChange={(updates) => updateConfig('notifications', updates)}
              currentPlan={currentPlan} 
              canUseFeature={canUseFeature}
            />
          </TabsContent>

          {/* 보안 설정 */}
          <TabsContent value="security" className="space-y-4">
            <SecurityConfigSection 
              config={config} 
              onChange={(updates) => updateConfig('security', updates)}
              currentPlan={currentPlan} 
              canUseFeature={canUseFeature}
            />
          </TabsContent>

          {/* 고급 설정 */}
          <TabsContent value="advanced" className="space-y-4">
            {currentPlan === 'Basic' ? (
              <div className="text-center py-8">
                <Settings className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-body font-medium text-gray-700 mb-2">
                  Pro 플랜 이상에서 사용 가능
                </h3>
                <p className="text-body-small text-gray-500">
                  고급 설정 기능을 사용하려면 플랜을 업그레이드하세요.
                </p>
                <Button className="mt-4" size="sm">
                  플랜 업그레이드
                </Button>
              </div>
            ) : (
              <AdvancedConfigSection 
                config={config} 
                onChange={updateConfig}
                currentPlan={currentPlan} 
                canUseFeature={canUseFeature}
              />
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSave}>
            설정 저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}