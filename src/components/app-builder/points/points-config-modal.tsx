import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Gift, ShoppingCart, Star, Crown, BarChart3 } from 'lucide-react';
import { FeatureCard } from '../feature-card';
import { PointsConfig, usePointsConfig } from '../../../hooks/usePointsConfig';
import { PointEarningConfigSection } from './point-earning-config-section';
import { PointRedemptionConfigSection } from './point-redemption-config-section';
import { StampSystemConfigSection } from './stamp-system-config-section';
import { LoyaltyTiersConfigSection } from './loyalty-tiers-config-section';
import { PointsAnalyticsConfigSection } from './points-analytics-config-section';

interface PointsConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: FeatureCard;
  currentPlan: 'Pro' | 'Enterprise';
  onSave: (config: PointsConfig) => void;
  initialConfig?: PointsConfig;
}

export function PointsConfigModal({ 
  isOpen, 
  onClose, 
  card, 
  currentPlan, 
  onSave,
  initialConfig 
}: PointsConfigModalProps) {
  const { loadConfig, saveConfig, validateConfig } = usePointsConfig();
  const [config, setConfig] = useState<PointsConfig>(() => 
    initialConfig || loadConfig(card.id, currentPlan)
  );
  const [activeTab, setActiveTab] = useState('earning');

  const handleSave = () => {
    if (validateConfig(config, currentPlan)) {
      saveConfig(card.id, config);
      onSave(config);
      onClose();
    } else {
      alert('현재 플랜에서 사용할 수 없는 기능이 포함되어 있습니다.');
    }
  };

  const handleReset = () => {
    const defaultConfig = loadConfig(card.id, currentPlan);
    setConfig(defaultConfig);
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
                  ${currentPlan === 'Pro' ? 'bg-blue-100 text-blue-700' :
                    'bg-purple-100 text-purple-700'}
                `}>
                  {currentPlan}
                </Badge>
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>
            {card.description} - 플랜에 따라 사용할 수 있는 포인트 기능이 다릅니다.
          </DialogDescription>
        </DialogHeader>

        {/* 설정 탭 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="earning" className="flex items-center gap-2">
              <Gift className="w-4 h-4" />
              포인트 적립
            </TabsTrigger>
            <TabsTrigger value="redemption" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              포인트 사용
            </TabsTrigger>
            <TabsTrigger value="stamps" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              스탬프
            </TabsTrigger>
            <TabsTrigger value="tiers" className="flex items-center gap-2">
              <Crown className="w-4 h-4" />
              등급
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              분석
            </TabsTrigger>
          </TabsList>

          {/* 포인트 적립 설정 */}
          <TabsContent value="earning" className="space-y-4">
            <PointEarningConfigSection 
              config={config} 
              onChange={setConfig} 
              currentPlan={currentPlan} 
            />
          </TabsContent>

          {/* 포인트 사용 설정 */}
          <TabsContent value="redemption" className="space-y-4">
            <PointRedemptionConfigSection 
              config={config} 
              onChange={setConfig} 
              currentPlan={currentPlan} 
            />
          </TabsContent>

          {/* 스탬프 설정 */}
          <TabsContent value="stamps" className="space-y-4">
            <StampSystemConfigSection 
              config={config} 
              onChange={setConfig} 
              currentPlan={currentPlan} 
            />
          </TabsContent>

          {/* 등급 설정 */}
          <TabsContent value="tiers" className="space-y-4">
            <LoyaltyTiersConfigSection 
              config={config} 
              onChange={setConfig} 
              currentPlan={currentPlan} 
            />
          </TabsContent>

          {/* 분석 설정 */}
          <TabsContent value="analytics" className="space-y-4">
            <PointsAnalyticsConfigSection 
              config={config} 
              onChange={setConfig} 
              currentPlan={currentPlan} 
            />
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleReset}>
              초기화
            </Button>
            <div className="text-body-small text-gray-500">
              마지막 저장: {new Date().toLocaleString()}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button onClick={handleSave}>
              설정 저장
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}