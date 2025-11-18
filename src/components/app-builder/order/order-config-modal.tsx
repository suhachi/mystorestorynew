import React, { useState, useEffect } from 'react';
import { FeatureCard } from '../../../hooks/useDragAndDrop';
import { OrderConfig, useOrderConfig } from '../../../hooks/useOrderConfig';
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
  ShoppingCart, Activity, CreditCard, Bell, BarChart3, Crown, 
  Zap, TrendingUp, Eye, RefreshCw, Palette, Download, 
  Upload, RotateCcw, CheckCircle, AlertCircle, Info,
  Plus, Minus, Star, Target, Clock, AlertTriangle,
  Globe, Brain, Shield, Users, Settings, Search,
  Filter, MessageSquare, Smartphone, ExternalLink
} from 'lucide-react';

interface OrderConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: FeatureCard;
  currentPlan: 'Basic' | 'Pro' | 'Enterprise';
  onSave: (config: OrderConfig) => void;
  initialConfig?: OrderConfig;
}

export function OrderConfigModal({ 
  isOpen, 
  onClose, 
  card, 
  currentPlan, 
  onSave,
  initialConfig 
}: OrderConfigModalProps) {
  const { loadConfig, saveConfig, getDefaultOrderConfig, getActiveFeatureCount, getOrderLimits, exportConfig, importConfig } = useOrderConfig();
  const { checkFeatureAccess } = usePlanLimits();
  
  const [config, setConfig] = useState<OrderConfig>(() => 
    initialConfig || loadConfig(card.id, currentPlan)
  );
  const [activeTab, setActiveTab] = useState('orders');
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
      case 'advancedSearch':
      case 'orderFiltering':
      case 'paymentDetails':
      case 'smsNotifications':
      case 'autoConfirmation':
      case 'orderAnalytics':
        return currentPlan === 'Pro' || currentPlan === 'Enterprise';
      case 'aiOrderProcessing':
      case 'paymentFraudDetection':
      case 'aiOrderRouting':
      case 'advancedOrderAnalytics':
      case 'erpIntegration':
        return currentPlan === 'Enterprise';
      default:
        return true;
    }
  };

  // 설정 업데이트
  const updateConfig = (section: keyof OrderConfig, key: string, value: boolean | string | number) => {
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
    const defaultConfig = getDefaultOrderConfig(currentPlan);
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
      a.download = `order-config-${card.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // 통계 정보
  const stats = getActiveFeatureCount(config);
  const limits = getOrderLimits(config);

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
                <ShoppingCart className="w-4 h-4 text-blue-600" />
                <div className="text-body-small">일일 주문</div>
              </div>
              <div className="text-2xl font-bold text-blue-600">{limits.maxOrdersPerDay}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-600" />
                <div className="text-body-small">히스토리</div>
              </div>
              <div className="text-2xl font-bold text-green-600">{limits.maxOrderHistory}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-600" />
                <div className="text-body-small">주문 상태</div>
              </div>
              <div className="text-2xl font-bold text-purple-600">{limits.statusCount}개</div>
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
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              주문 관리
            </TabsTrigger>
            <TabsTrigger value="status" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              상태 관리
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              결제 관리
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              알림 설정
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              분석 설정
            </TabsTrigger>
          </TabsList>

          {/* 주문 관리 설정 */}
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  주문 관리 설정
                </CardTitle>
                <CardDescription>
                  주문 목록, 검색, 처리 방식을 설정하세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 기본 주문 관리 설정 */}
                <div>
                  <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    기본 설정 (모든 플랜)
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">주문 목록</div>
                        <div className="text-body-small text-gray-500">실시간 주문 목록 표시</div>
                      </div>
                      <Switch 
                        checked={config.orderManagement.orderList}
                        onCheckedChange={(checked) => updateConfig('orderManagement', 'orderList', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">상태 관리</div>
                        <div className="text-body-small text-gray-500">주문 상태 변경 및 추적</div>
                      </div>
                      <Switch 
                        checked={config.orderManagement.statusManagement}
                        onCheckedChange={(checked) => updateConfig('orderManagement', 'statusManagement', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">기본 상세 정보</div>
                        <div className="text-body-small text-gray-500">주문 기본 정보 표시</div>
                      </div>
                      <Switch 
                        checked={config.orderManagement.basicDetails}
                        onCheckedChange={(checked) => updateConfig('orderManagement', 'basicDetails', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">주문 히스토리</div>
                        <div className="text-body-small text-gray-500">과거 주문 내역 조회</div>
                      </div>
                      <Switch 
                        checked={config.orderManagement.orderHistory}
                        onCheckedChange={(checked) => updateConfig('orderManagement', 'orderHistory', checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Pro 주문 관리 설정 */}
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
                            <div className="font-medium">고급 검색</div>
                            <div className="text-body-small text-gray-500">다중 조건 검색 및 필터링</div>
                          </div>
                          <Switch 
                            checked={config.orderManagement.advancedSearch || false}
                            onCheckedChange={(checked) => updateConfig('orderManagement', 'advancedSearch', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">주문 필터링</div>
                            <div className="text-body-small text-gray-500">상태, 날짜, 금액별 필터</div>
                          </div>
                          <Switch 
                            checked={config.orderManagement.orderFiltering || false}
                            onCheckedChange={(checked) => updateConfig('orderManagement', 'orderFiltering', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">일괄 작업</div>
                            <div className="text-body-small text-gray-500">여러 주문 동시 처리</div>
                          </div>
                          <Switch 
                            checked={config.orderManagement.bulkOperations || false}
                            onCheckedChange={(checked) => updateConfig('orderManagement', 'bulkOperations', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">주문 템플릿</div>
                            <div className="text-body-small text-gray-500">자주 사용하는 주문 템플릿</div>
                          </div>
                          <Switch 
                            checked={config.orderManagement.orderTemplates || false}
                            onCheckedChange={(checked) => updateConfig('orderManagement', 'orderTemplates', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Enterprise 주문 관리 설정 */}
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
                            <div className="font-medium">AI 주문 처리</div>
                            <div className="text-body-small text-gray-500">AI 기반 자동 주문 처리</div>
                          </div>
                          <Switch 
                            checked={config.orderManagement.aiOrderProcessing || false}
                            onCheckedChange={(checked) => updateConfig('orderManagement', 'aiOrderProcessing', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">예측 주문</div>
                            <div className="text-body-small text-gray-500">고객 패턴 기반 주문 예측</div>
                          </div>
                          <Switch 
                            checked={config.orderManagement.predictiveOrdering || false}
                            onCheckedChange={(checked) => updateConfig('orderManagement', 'predictiveOrdering', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">동적 가격 책정</div>
                            <div className="text-body-small text-gray-500">수요에 따른 실시간 가격 조정</div>
                          </div>
                          <Switch 
                            checked={config.orderManagement.dynamicPricing || false}
                            onCheckedChange={(checked) => updateConfig('orderManagement', 'dynamicPricing', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">다중 채널 주문</div>
                            <div className="text-body-small text-gray-500">여러 채널의 주문 통합 관리</div>
                          </div>
                          <Switch 
                            checked={config.orderManagement.multiChannelOrders || false}
                            onCheckedChange={(checked) => updateConfig('orderManagement', 'multiChannelOrders', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 상태 관리 설정 */}
          <TabsContent value="status" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  주문 상태 설정
                </CardTitle>
                <CardDescription>
                  주문 상태 플로우와 자동화 설정을 관리하세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 기본 상태 설정 */}
                <div>
                  <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    기본 상태 (모든 플랜)
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="font-medium">대기중</span>
                      </div>
                      <Switch 
                        checked={config.statusFlow.pending}
                        onCheckedChange={(checked) => updateConfig('statusFlow', 'pending', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="font-medium">확인됨</span>
                      </div>
                      <Switch 
                        checked={config.statusFlow.confirmed}
                        onCheckedChange={(checked) => updateConfig('statusFlow', 'confirmed', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="font-medium">준비중</span>
                      </div>
                      <Switch 
                        checked={config.statusFlow.preparing}
                        onCheckedChange={(checked) => updateConfig('statusFlow', 'preparing', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="font-medium">준비완료</span>
                      </div>
                      <Switch 
                        checked={config.statusFlow.ready}
                        onCheckedChange={(checked) => updateConfig('statusFlow', 'ready', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium">완료</span>
                      </div>
                      <Switch 
                        checked={config.statusFlow.completed}
                        onCheckedChange={(checked) => updateConfig('statusFlow', 'completed', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="font-medium">취소</span>
                      </div>
                      <Switch 
                        checked={config.statusFlow.cancelled}
                        onCheckedChange={(checked) => updateConfig('statusFlow', 'cancelled', checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Pro 상태 관리 설정 */}
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
                            <div className="font-medium">커스텀 상태</div>
                            <div className="text-body-small text-gray-500">사용자 정의 주문 상태 추가</div>
                          </div>
                          <Switch 
                            checked={config.statusFlow.customStatuses || false}
                            onCheckedChange={(checked) => updateConfig('statusFlow', 'customStatuses', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">상태 자동화</div>
                            <div className="text-body-small text-gray-500">조건에 따른 자동 상태 변경</div>
                          </div>
                          <Switch 
                            checked={config.statusFlow.statusAutomation || false}
                            onCheckedChange={(checked) => updateConfig('statusFlow', 'statusAutomation', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">상태 알림</div>
                            <div className="text-body-small text-gray-500">상태 변경 시 자동 알림</div>
                          </div>
                          <Switch 
                            checked={config.statusFlow.statusNotifications || false}
                            onCheckedChange={(checked) => updateConfig('statusFlow', 'statusNotifications', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 결제 관리 설정 */}
          <TabsContent value="payment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  결제 관리 설정
                </CardTitle>
                <CardDescription>
                  결제 방법, 환불, 분석 설정을 관리하세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentPlan === 'Basic' ? (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      결제 관리 기능은 Pro 플랜 이상에서 사용할 수 있습니다. 
                      업그레이드하여 더 많은 기능을 이용하세요.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    {/* Pro 결제 관리 설정 */}
                    <div>
                      <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                        <Crown className="w-4 h-4 text-blue-600" />
                        Pro 설정 (Pro/Enterprise)
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">결제 상세 정보</div>
                            <div className="text-body-small text-gray-500">결제 방법 및 상세 내역</div>
                          </div>
                          <Switch 
                            checked={config.payment?.paymentDetails || false}
                            onCheckedChange={(checked) => updateConfig('payment', 'paymentDetails', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">결제 방법 관리</div>
                            <div className="text-body-small text-gray-500">다양한 결제 수단 지원</div>
                          </div>
                          <Switch 
                            checked={config.payment?.paymentMethods || false}
                            onCheckedChange={(checked) => updateConfig('payment', 'paymentMethods', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">환불 관리</div>
                            <div className="text-body-small text-gray-500">환불 처리 및 관리</div>
                          </div>
                          <Switch 
                            checked={config.payment?.refundManagement || false}
                            onCheckedChange={(checked) => updateConfig('payment', 'refundManagement', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">결제 분석</div>
                            <div className="text-body-small text-gray-500">결제 패턴 및 통계 분석</div>
                          </div>
                          <Switch 
                            checked={config.payment?.paymentAnalytics || false}
                            onCheckedChange={(checked) => updateConfig('payment', 'paymentAnalytics', checked)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Enterprise 결제 관리 설정 */}
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
                                <div className="font-medium">고급 결제 방법</div>
                                <div className="text-body-small text-gray-500">암호화폐, 간편결제 등</div>
                              </div>
                              <Switch 
                                checked={config.payment?.advancedPaymentMethods || false}
                                onCheckedChange={(checked) => updateConfig('payment', 'advancedPaymentMethods', checked)}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <div className="font-medium">결제 사기 탐지</div>
                                <div className="text-body-small text-gray-500">AI 기반 사기 거래 탐지</div>
                              </div>
                              <Switch 
                                checked={config.payment?.paymentFraudDetection || false}
                                onCheckedChange={(checked) => updateConfig('payment', 'paymentFraudDetection', checked)}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <div className="font-medium">해외 결제</div>
                                <div className="text-body-small text-gray-500">다국가 통화 및 결제</div>
                              </div>
                              <Switch 
                                checked={config.payment?.internationalPayments || false}
                                onCheckedChange={(checked) => updateConfig('payment', 'internationalPayments', checked)}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <div className="font-medium">결제 최적화</div>
                                <div className="text-body-small text-gray-500">결제 성공률 최적화</div>
                              </div>
                              <Switch 
                                checked={config.payment?.paymentOptimization || false}
                                onCheckedChange={(checked) => updateConfig('payment', 'paymentOptimization', checked)}
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

          {/* 알림 설정 */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  알림 설정
                </CardTitle>
                <CardDescription>
                  주문 알림과 자동화 설정을 관리하세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 기본 알림 설정 */}
                <div>
                  <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    기본 설정 (모든 플랜)
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">신규 주문 알림</div>
                        <div className="text-body-small text-gray-500">새로운 주문 접수 알림</div>
                      </div>
                      <Switch 
                        checked={config.notifications.newOrderAlert}
                        onCheckedChange={(checked) => updateConfig('notifications', 'newOrderAlert', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">상태 변경 알림</div>
                        <div className="text-body-small text-gray-500">주문 상태 변경 알림</div>
                      </div>
                      <Switch 
                        checked={config.notifications.statusChangeAlert}
                        onCheckedChange={(checked) => updateConfig('notifications', 'statusChangeAlert', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">기본 이메일 알림</div>
                        <div className="text-body-small text-gray-500">이메일을 통한 기본 알림</div>
                      </div>
                      <Switch 
                        checked={config.notifications.basicEmail}
                        onCheckedChange={(checked) => updateConfig('notifications', 'basicEmail', checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Pro 알림 설정 */}
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
                            <div className="font-medium">SMS 알림</div>
                            <div className="text-body-small text-gray-500">문자 메시지 알림</div>
                          </div>
                          <Switch 
                            checked={config.notifications.smsNotifications || false}
                            onCheckedChange={(checked) => updateConfig('notifications', 'smsNotifications', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">푸시 알림</div>
                            <div className="text-body-small text-gray-500">모바일 앱 푸시 알림</div>
                          </div>
                          <Switch 
                            checked={config.notifications.pushNotifications || false}
                            onCheckedChange={(checked) => updateConfig('notifications', 'pushNotifications', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">커스텀 알림</div>
                            <div className="text-body-small text-gray-500">사용자 정의 알림 규칙</div>
                          </div>
                          <Switch 
                            checked={config.notifications.customAlerts || false}
                            onCheckedChange={(checked) => updateConfig('notifications', 'customAlerts', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">알림 템플릿</div>
                            <div className="text-body-small text-gray-500">미리 정의된 알림 템플릿</div>
                          </div>
                          <Switch 
                            checked={config.notifications.notificationTemplates || false}
                            onCheckedChange={(checked) => updateConfig('notifications', 'notificationTemplates', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Enterprise 알림 설정 */}
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
                            <div className="font-medium">실시간 알림</div>
                            <div className="text-body-small text-gray-500">실시간 알림 시스템</div>
                          </div>
                          <Switch 
                            checked={config.notifications.realTimeNotifications || false}
                            onCheckedChange={(checked) => updateConfig('notifications', 'realTimeNotifications', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">AI 알림 최적화</div>
                            <div className="text-body-small text-gray-500">AI 기반 알림 타이밍 최적화</div>
                          </div>
                          <Switch 
                            checked={config.notifications.aiNotificationOptimization || false}
                            onCheckedChange={(checked) => updateConfig('notifications', 'aiNotificationOptimization', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 분석 설정 */}
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  분석 설정
                </CardTitle>
                <CardDescription>
                  주문 분석과 리포트 설정을 관리하세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentPlan === 'Basic' ? (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      주문 분석 기능은 Pro 플랜 이상에서 사용할 수 있습니다. 
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
                            <div className="font-medium">주문 분석</div>
                            <div className="text-body-small text-gray-500">주문 패턴 및 통계 분석</div>
                          </div>
                          <Switch 
                            checked={config.analytics?.orderAnalytics || false}
                            onCheckedChange={(checked) => updateConfig('analytics', 'orderAnalytics', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">고객 행동 분석</div>
                            <div className="text-body-small text-gray-500">고객 주문 패턴 분석</div>
                          </div>
                          <Switch 
                            checked={config.analytics?.customerBehavior || false}
                            onCheckedChange={(checked) => updateConfig('analytics', 'customerBehavior', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">피크 시간 분석</div>
                            <div className="text-body-small text-gray-500">주문 집중 시간대 분석</div>
                          </div>
                          <Switch 
                            checked={config.analytics?.peakTimeAnalysis || false}
                            onCheckedChange={(checked) => updateConfig('analytics', 'peakTimeAnalysis', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">주문 트렌드</div>
                            <div className="text-body-small text-gray-500">주문 변화 추이 분석</div>
                          </div>
                          <Switch 
                            checked={config.analytics?.orderTrends || false}
                            onCheckedChange={(checked) => updateConfig('analytics', 'orderTrends', checked)}
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
                                <div className="font-medium">고급 주문 분석</div>
                                <div className="text-body-small text-gray-500">AI 기반 고급 주문 분석</div>
                              </div>
                              <Switch 
                                checked={config.analytics?.advancedOrderAnalytics || false}
                                onCheckedChange={(checked) => updateConfig('analytics', 'advancedOrderAnalytics', checked)}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <div className="font-medium">고객 생애 가치</div>
                                <div className="text-body-small text-gray-500">고객별 LTV 분석</div>
                              </div>
                              <Switch 
                                checked={config.analytics?.customerLifetimeValue || false}
                                onCheckedChange={(checked) => updateConfig('analytics', 'customerLifetimeValue', checked)}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <div className="font-medium">주문 최적화</div>
                                <div className="text-body-small text-gray-500">주문 프로세스 최적화 제안</div>
                              </div>
                              <Switch 
                                checked={config.analytics?.orderOptimization || false}
                                onCheckedChange={(checked) => updateConfig('analytics', 'orderOptimization', checked)}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <div className="font-medium">경쟁사 분석</div>
                                <div className="text-body-small text-gray-500">경쟁업체 주문 패턴 비교</div>
                              </div>
                              <Switch 
                                checked={config.analytics?.competitiveAnalysis || false}
                                onCheckedChange={(checked) => updateConfig('analytics', 'competitiveAnalysis', checked)}
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