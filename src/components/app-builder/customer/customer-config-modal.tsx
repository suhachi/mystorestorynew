import React, { useState, useEffect } from 'react';
import { FeatureCard } from '../../../hooks/useDragAndDrop';
import { CustomerConfig, useCustomerConfig } from '../../../hooks/useCustomerConfig';
import { usePlanLimits } from '../../../hooks/usePlanLimits';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Switch } from '../../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Separator } from '../../ui/separator';
import { Alert, AlertDescription } from '../../ui/alert';
import { Slider } from '../../ui/slider';
import { 
  Users, User, Crown, Star, Gift, Target, Mail, MessageSquare,
  Bell, BarChart3, Brain, Zap, TrendingUp, Eye, RefreshCw, 
  Palette, Download, Upload, RotateCcw, CheckCircle, AlertCircle, 
  Info, Plus, Minus, Award, Heart, Shield, Clock, Calendar,
  Globe, Activity, Settings, Search, Filter, ExternalLink,
  Sparkles, Megaphone
} from 'lucide-react';

interface CustomerConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: FeatureCard;
  currentPlan: 'Basic' | 'Pro' | 'Enterprise';
  onSave: (config: CustomerConfig) => void;
  initialConfig?: CustomerConfig;
}

export function CustomerConfigModal({ 
  isOpen, 
  onClose, 
  card, 
  currentPlan, 
  onSave,
  initialConfig 
}: CustomerConfigModalProps) {
  const { loadConfig, saveConfig, getDefaultCustomerConfig, getActiveFeatureCount, getCustomerLimits, exportConfig, importConfig } = useCustomerConfig();
  const { checkFeatureAccess } = usePlanLimits();
  
  const [config, setConfig] = useState<CustomerConfig>(() => 
    initialConfig || loadConfig(card.id, currentPlan)
  );
  const [activeTab, setActiveTab] = useState('customers');
  const [hasChanges, setHasChanges] = useState(false);

  // 설정이 변경되었는지 추적
  useEffect(() => {
    const originalConfig = initialConfig || loadConfig(card.id, currentPlan);
    const hasConfigChanged = JSON.stringify(config) !== JSON.stringify(originalConfig);
    setHasChanges(hasConfigChanged);
  }, [config, card.id, currentPlan, initialConfig, loadConfig]);

  // 플랜별 기능 접근 권한 확인
  const canUseFeature = (feature: string) => {
    switch (feature) {
      case 'customerTiers':
      case 'loyaltyPoints':
      case 'emailMarketing':
      case 'customerBehavior':
      case 'autoTierUpgrade':
        return currentPlan === 'Pro' || currentPlan === 'Enterprise';
      case 'advancedSegmentation':
      case 'aiInsights':
      case 'churnPrediction':
      case 'personalizedCampaigns':
      case 'crmIntegration':
        return currentPlan === 'Enterprise';
      default:
        return true;
    }
  };

  // 설정 업데이트
  const updateConfig = (section: keyof CustomerConfig, key: string, value: boolean | string | number) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  // 설정 저장 및 적용
  const handleSave = () => {
    saveConfig(card.id, config);
    onSave(config);
    onClose();
  };

  // 설정 초기화
  const handleReset = () => {
    const defaultConfig = getDefaultCustomerConfig(currentPlan);
    setConfig(defaultConfig);
  };

  // 설정 내보내기
  const handleExport = () => {
    const exportData = exportConfig(card.id);
    if (exportData) {
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `customer-config-${card.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // 통계 정보
  const stats = getActiveFeatureCount(config);
  const limits = getCustomerLimits(config);

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
            {card.description} - 플랜에 따라 사용할 수 있는 기능이 다릅니다.
          </DialogDescription>
        </DialogHeader>

        {/* 통계 및 상태 */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <div className="text-body-small">최대 고객</div>
              </div>
              <div className="text-2xl font-bold text-blue-600">{limits.maxCustomers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-600" />
                <div className="text-body-small">데이터 보관</div>
              </div>
              <div className="text-2xl font-bold text-green-600">{limits.dataRetention}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-purple-600" />
                <div className="text-body-small">고객 등급</div>
              </div>
              <div className="text-2xl font-bold text-purple-600">{limits.tierCount}개</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-600" />
                <div className="text-body-small">총 기능</div>
              </div>
              <div className="text-2xl font-bold text-orange-600">{stats.total}</div>
            </CardContent>
          </Card>
        </div>

        {/* 변경사항 알림 */}
        {hasChanges && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              설정이 변경되었습니다. 저장하지 않으면 변경사항이 사라집니다.
            </AlertDescription>
          </Alert>
        )}

        {/* 설정 탭 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="customers" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              고객 관리
            </TabsTrigger>
            <TabsTrigger value="loyalty" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              충성도
            </TabsTrigger>
            <TabsTrigger value="segmentation" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              세분화
            </TabsTrigger>
            <TabsTrigger value="marketing" className="flex items-center gap-2">
              <Megaphone className="w-4 h-4" />
              마케팅
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              분석
            </TabsTrigger>
          </TabsList>

          {/* 고객 관리 설정 */}
          <TabsContent value="customers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  고객 관리 설정
                </CardTitle>
                <CardDescription>
                  고객 정보 관리 및 상호작용 설정을 관리하세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 기본 고객 관리 설정 */}
                <div>
                  <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    기본 설정 (모든 플랜)
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">고객 목록</div>
                        <div className="text-body-small text-gray-500">전체 고객 정보 관리</div>
                      </div>
                      <Switch 
                        checked={config.customerManagement.customerList}
                        onCheckedChange={(checked) => updateConfig('customerManagement', 'customerList', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">기본 정보</div>
                        <div className="text-body-small text-gray-500">이름, 연락처, 주소 관리</div>
                      </div>
                      <Switch 
                        checked={config.customerManagement.basicInfo}
                        onCheckedChange={(checked) => updateConfig('customerManagement', 'basicInfo', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">연락처 관리</div>
                        <div className="text-body-small text-gray-500">전화번호, 이메일 관리</div>
                      </div>
                      <Switch 
                        checked={config.customerManagement.contactDetails}
                        onCheckedChange={(checked) => updateConfig('customerManagement', 'contactDetails', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">주문 이력</div>
                        <div className="text-body-small text-gray-500">고객별 주문 내역 관리</div>
                      </div>
                      <Switch 
                        checked={config.customerManagement.orderHistory}
                        onCheckedChange={(checked) => updateConfig('customerManagement', 'orderHistory', checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Pro 고객 관리 설정 */}
                {(currentPlan === 'Pro' || currentPlan === 'Enterprise') && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                        <Crown className="w-4 h-4 text-blue-600" />
                        Pro 설정 (Pro/Enterprise)
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">고객 등급</div>
                            <div className="text-body-small text-gray-500">VIP, Gold, Silver, Bronze 등급</div>
                          </div>
                          <Switch 
                            checked={config.customerManagement.customerTiers || false}
                            onCheckedChange={(checked) => updateConfig('customerManagement', 'customerTiers', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">충성도 포인트</div>
                            <div className="text-body-small text-gray-500">포인트 적립 및 사용 관리</div>
                          </div>
                          <Switch 
                            checked={config.customerManagement.loyaltyPoints || false}
                            onCheckedChange={(checked) => updateConfig('customerManagement', 'loyaltyPoints', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">구매 이력 분석</div>
                            <div className="text-body-small text-gray-500">상세한 구매 패턴 분석</div>
                          </div>
                          <Switch 
                            checked={config.customerManagement.purchaseHistory || false}
                            onCheckedChange={(checked) => updateConfig('customerManagement', 'purchaseHistory', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">고객 세분화</div>
                            <div className="text-body-small text-gray-500">행동 기반 고객 분류</div>
                          </div>
                          <Switch 
                            checked={config.customerManagement.customerSegmentation || false}
                            onCheckedChange={(checked) => updateConfig('customerManagement', 'customerSegmentation', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Enterprise 고객 관리 설정 */}
                {currentPlan === 'Enterprise' && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                        <Crown className="w-4 h-4 text-purple-600" />
                        Enterprise 설정 (Enterprise)
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">고급 세분화</div>
                            <div className="text-body-small text-gray-500">AI 기반 고급 고객 세분화</div>
                          </div>
                          <Switch 
                            checked={config.customerManagement.advancedSegmentation || false}
                            onCheckedChange={(checked) => updateConfig('customerManagement', 'advancedSegmentation', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">AI 인사이트</div>
                            <div className="text-body-small text-gray-500">AI 기반 고객 행동 분석</div>
                          </div>
                          <Switch 
                            checked={config.customerManagement.aiInsights || false}
                            onCheckedChange={(checked) => updateConfig('customerManagement', 'aiInsights', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">예측 분석</div>
                            <div className="text-body-small text-gray-500">고객 행동 예측 및 분석</div>
                          </div>
                          <Switch 
                            checked={config.customerManagement.predictiveAnalytics || false}
                            onCheckedChange={(checked) => updateConfig('customerManagement', 'predictiveAnalytics', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">고객 여정 분석</div>
                            <div className="text-body-small text-gray-500">전체 고객 경험 여정 추적</div>
                          </div>
                          <Switch 
                            checked={config.customerManagement.customerJourney || false}
                            onCheckedChange={(checked) => updateConfig('customerManagement', 'customerJourney', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 충성도 프로그램 설정 */}
          <TabsContent value="loyalty" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  충성도 프로그램 설정
                </CardTitle>
                <CardDescription>
                  고객 충성도 및 리워드 프로그램을 설정하세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentPlan === 'Basic' ? (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      충성도 프로그램 기능은 Pro 플랜 이상에서 사용할 수 있습니다. 
                      업그레이드하여 더 많은 기능을 이용하세요.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    {/* Pro 충성도 설정 */}
                    <div>
                      <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                        <Crown className="w-4 h-4 text-blue-600" />
                        Pro 설정 (Pro/Enterprise)
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">포인트 시스템</div>
                            <div className="text-body-small text-gray-500">구매 시 포인트 적립</div>
                          </div>
                          <Switch 
                            checked={config.loyaltyProgram?.pointSystem || false}
                            onCheckedChange={(checked) => updateConfig('loyaltyProgram', 'pointSystem', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">등급별 혜택</div>
                            <div className="text-body-small text-gray-500">VIP, Gold, Silver 등급 혜택</div>
                          </div>
                          <Switch 
                            checked={config.loyaltyProgram?.tierBenefits || false}
                            onCheckedChange={(checked) => updateConfig('loyaltyProgram', 'tierBenefits', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">리워드 프로그램</div>
                            <div className="text-body-small text-gray-500">쿠폰, 할인 등 다양한 리워드</div>
                          </div>
                          <Switch 
                            checked={config.loyaltyProgram?.rewardProgram || false}
                            onCheckedChange={(checked) => updateConfig('loyaltyProgram', 'rewardProgram', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">스탬프 시스템</div>
                            <div className="text-body-small text-gray-500">방문 횟수 기반 스탬프 적립</div>
                          </div>
                          <Switch 
                            checked={config.loyaltyProgram?.stampSystem || false}
                            onCheckedChange={(checked) => updateConfig('loyaltyProgram', 'stampSystem', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">생일 리워드</div>
                            <div className="text-body-small text-gray-500">생일 기념 특별 혜택</div>
                          </div>
                          <Switch 
                            checked={config.loyaltyProgram?.birthdayRewards || false}
                            onCheckedChange={(checked) => updateConfig('loyaltyProgram', 'birthdayRewards', checked)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Enterprise 충성도 설정 */}
                    {currentPlan === 'Enterprise' && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                            <Crown className="w-4 h-4 text-purple-600" />
                            Enterprise 설정 (Enterprise)
                          </h4>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <div className="font-medium">추천 프로그램</div>
                                <div className="text-body-small text-gray-500">친구 추천 시 리워드 제공</div>
                              </div>
                              <Switch 
                                checked={config.loyaltyProgram?.referralProgram || false}
                                onCheckedChange={(checked) => updateConfig('loyaltyProgram', 'referralProgram', checked)}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <div className="font-medium">게임화 요소</div>
                                <div className="text-body-small text-gray-500">배지, 레벨 등 게임 요소</div>
                              </div>
                              <Switch 
                                checked={config.loyaltyProgram?.gamification || false}
                                onCheckedChange={(checked) => updateConfig('loyaltyProgram', 'gamification', checked)}
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 고객 세분화 설정 */}
          <TabsContent value="segmentation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  고객 세분화 설정
                </CardTitle>
                <CardDescription>
                  고객을 다양한 기준으로 분류하고 관리하세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentPlan === 'Basic' ? (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      고객 세분화 기능은 Pro 플랜 이상에서 사용할 수 있습니다. 
                      업그레이드하여 더 많은 기능을 이용하세요.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    {/* Pro 세분화 설정 */}
                    <div>
                      <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                        <Crown className="w-4 h-4 text-blue-600" />
                        Pro 설정 (Pro/Enterprise)
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">행동 기반 세분화</div>
                            <div className="text-body-small text-gray-500">구매 패턴, 방문 빈도 기반</div>
                          </div>
                          <Switch 
                            checked={config.segmentation?.behavioralSegmentation || false}
                            onCheckedChange={(checked) => updateConfig('segmentation', 'behavioralSegmentation', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">인구 통계 세분화</div>
                            <div className="text-body-small text-gray-500">나이, 성별, 지역 기반</div>
                          </div>
                          <Switch 
                            checked={config.segmentation?.demographicSegmentation || false}
                            onCheckedChange={(checked) => updateConfig('segmentation', 'demographicSegmentation', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">가치 기반 세분화</div>
                            <div className="text-body-small text-gray-500">구매 금액, 빈도 기반</div>
                          </div>
                          <Switch 
                            checked={config.segmentation?.valueSegmentation || false}
                            onCheckedChange={(checked) => updateConfig('segmentation', 'valueSegmentation', checked)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Enterprise 세분화 설정 */}
                    {currentPlan === 'Enterprise' && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                            <Crown className="w-4 h-4 text-purple-600" />
                            Enterprise 설정 (Enterprise)
                          </h4>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <div className="font-medium">심리학적 세분화</div>
                                <div className="text-body-small text-gray-500">라이프스타일, 가치관 기반</div>
                              </div>
                              <Switch 
                                checked={config.segmentation?.psychographicSegmentation || false}
                                onCheckedChange={(checked) => updateConfig('segmentation', 'psychographicSegmentation', checked)}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <div className="font-medium">커스텀 세그먼트</div>
                                <div className="text-body-small text-gray-500">사용자 정의 세분화 기준</div>
                              </div>
                              <Switch 
                                checked={config.segmentation?.customSegments || false}
                                onCheckedChange={(checked) => updateConfig('segmentation', 'customSegments', checked)}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <div className="font-medium">동적 세분화</div>
                                <div className="text-body-small text-gray-500">실시간 행동 기반 세분화</div>
                              </div>
                              <Switch 
                                checked={config.segmentation?.dynamicSegmentation || false}
                                onCheckedChange={(checked) => updateConfig('segmentation', 'dynamicSegmentation', checked)}
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 마케팅 도구 설정 */}  
          <TabsContent value="marketing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="w-5 h-5" />
                  마케팅 도구 설정
                </CardTitle>
                <CardDescription>
                  고객과의 커뮤니케이션 및 마케팅 도구를 설정하세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentPlan === 'Basic' ? (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      마케팅 도구 기능은 Pro 플랜 이상에서 사용할 수 있습니다. 
                      업그레이드하여 더 많은 기능을 이용하세요.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    {/* Pro 마케팅 설정 */}
                    <div>
                      <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                        <Crown className="w-4 h-4 text-blue-600" />
                        Pro 설정 (Pro/Enterprise)
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">이메일 마케팅</div>
                            <div className="text-body-small text-gray-500">이메일 캠페인 및 뉴스레터</div>
                          </div>
                          <Switch 
                            checked={config.marketing?.emailMarketing || false}
                            onCheckedChange={(checked) => updateConfig('marketing', 'emailMarketing', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">SMS 마케팅</div>
                            <div className="text-body-small text-gray-500">문자 메시지 캠페인</div>
                          </div>
                          <Switch 
                            checked={config.marketing?.smsMarketing || false}
                            onCheckedChange={(checked) => updateConfig('marketing', 'smsMarketing', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">푸시 알림</div>
                            <div className="text-body-small text-gray-500">모바일 앱 푸시 알림</div>
                          </div>
                          <Switch 
                            checked={config.marketing?.pushNotifications || false}
                            onCheckedChange={(checked) => updateConfig('marketing', 'pushNotifications', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">캠페인 관리</div>
                            <div className="text-body-small text-gray-500">마케팅 캠페인 생성 및 관리</div>
                          </div>
                          <Switch 
                            checked={config.marketing?.campaignManagement || false}
                            onCheckedChange={(checked) => updateConfig('marketing', 'campaignManagement', checked)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Enterprise 마케팅 설정 */}
                    {currentPlan === 'Enterprise' && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                            <Crown className="w-4 h-4 text-purple-600" />
                            Enterprise 설정 (Enterprise)
                          </h4>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <div className="font-medium">개인화 캠페인</div>
                                <div className="text-body-small text-gray-500">AI 기반 개인화된 마케팅</div>
                              </div>
                              <Switch 
                                checked={config.marketing?.personalizedCampaigns || false}
                                onCheckedChange={(checked) => updateConfig('marketing', 'personalizedCampaigns', checked)}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <div className="font-medium">동적 콘텐츠</div>
                                <div className="text-body-small text-gray-500">실시간 개인화 콘텐츠</div>
                              </div>
                              <Switch 
                                checked={config.marketing?.dynamicContent || false}
                                onCheckedChange={(checked) => updateConfig('marketing', 'dynamicContent', checked)}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <div className="font-medium">크로스 채널 마케팅</div>
                                <div className="text-body-small text-gray-500">다채널 통합 마케팅</div>
                              </div>
                              <Switch 
                                checked={config.marketing?.crossChannelMarketing || false}
                                onCheckedChange={(checked) => updateConfig('marketing', 'crossChannelMarketing', checked)}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <div className="font-medium">어트리뷰션 모델링</div>
                                <div className="text-body-small text-gray-500">마케팅 효과 추적 및 분석</div>
                              </div>
                              <Switch 
                                checked={config.marketing?.attributionModeling || false}
                                onCheckedChange={(checked) => updateConfig('marketing', 'attributionModeling', checked)}
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 고객 분석 설정 */}
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  고객 분석 설정
                </CardTitle>
                <CardDescription>
                  고객 행동 분석 및 인사이트 설정을 관리하세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentPlan === 'Basic' ? (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      고객 분석 기능은 Pro 플랜 이상에서 사용할 수 있습니다. 
                      업그레이드하여 더 많은 기능을 이용하세요.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    {/* Pro 분석 설정 */}
                    <div>
                      <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                        <Crown className="w-4 h-4 text-blue-600" />
                        Pro 설정 (Pro/Enterprise)
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">고객 행동 분석</div>
                            <div className="text-body-small text-gray-500">구매 패턴 및 행동 분석</div>
                          </div>
                          <Switch 
                            checked={config.analytics?.customerBehavior || false}
                            onCheckedChange={(checked) => updateConfig('analytics', 'customerBehavior', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">구매 패턴 분석</div>
                            <div className="text-body-small text-gray-500">구매 빈도 및 선호도 분석</div>
                          </div>
                          <Switch 
                            checked={config.analytics?.purchasePatterns || false}
                            onCheckedChange={(checked) => updateConfig('analytics', 'purchasePatterns', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">고객 유지 분석</div>
                            <div className="text-body-small text-gray-500">재방문률 및 유지율 분석</div>
                          </div>
                          <Switch 
                            checked={config.analytics?.retentionAnalysis || false}
                            onCheckedChange={(checked) => updateConfig('analytics', 'retentionAnalysis', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">고객 생애 가치</div>
                            <div className="text-body-small text-gray-500">CLV 분석 및 예측</div>
                          </div>
                          <Switch 
                            checked={config.analytics?.lifetimeValue || false}
                            onCheckedChange={(checked) => updateConfig('analytics', 'lifetimeValue', checked)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Enterprise 분석 설정 */}
                    {currentPlan === 'Enterprise' && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                            <Crown className="w-4 h-4 text-purple-600" />
                            Enterprise 설정 (Enterprise)
                          </h4>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <div className="font-medium">코호트 분석</div>
                                <div className="text-body-small text-gray-500">시간대별 고객 그룹 분석</div>
                              </div>
                              <Switch 
                                checked={config.analytics?.cohortAnalysis || false}
                                onCheckedChange={(checked) => updateConfig('analytics', 'cohortAnalysis', checked)}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <div className="font-medium">예측 인사이트</div>
                                <div className="text-body-small text-gray-500">AI 기반 예측 분석</div>
                              </div>
                              <Switch 
                                checked={config.analytics?.predictiveInsights || false}
                                onCheckedChange={(checked) => updateConfig('analytics', 'predictiveInsights', checked)}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <div className="font-medium">고객 만족도 분석</div>
                                <div className="text-body-small text-gray-500">피드백 기반 만족도 측정</div>
                              </div>
                              <Switch 
                                checked={config.analytics?.customerSatisfaction || false}
                                onCheckedChange={(checked) => updateConfig('analytics', 'customerSatisfaction', checked)}
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              초기화
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              내보내기
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button onClick={handleSave} disabled={!hasChanges}>
              <CheckCircle className="w-4 h-4 mr-2" />
              설정 저장
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}