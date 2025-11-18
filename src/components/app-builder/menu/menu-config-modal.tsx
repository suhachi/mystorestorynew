import React, { useState, useEffect } from 'react';
import { FeatureCard } from '../../../hooks/useDragAndDrop';
import { MenuConfig, useMenuConfig } from '../../../hooks/useMenuConfig';
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
  Package, Utensils, Image, Settings, BarChart3, Crown, 
  Zap, TrendingUp, Eye, RefreshCw, Palette, Download, 
  Upload, RotateCcw, CheckCircle, AlertCircle, Info,
  Plus, Minus, Star, Target, Clock, AlertTriangle,
  Globe, Brain, Shield, Users
} from 'lucide-react';

interface MenuConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: FeatureCard;
  currentPlan: 'Basic' | 'Pro' | 'Enterprise';
  onSave: (config: MenuConfig) => void;
  initialConfig?: MenuConfig;
}

export function MenuConfigModal({ 
  isOpen, 
  onClose, 
  card, 
  currentPlan, 
  onSave,
  initialConfig 
}: MenuConfigModalProps) {
  const { loadConfig, saveConfig, getDefaultMenuConfig, getActiveFeatureCount, getMenuLimits, exportConfig, importConfig } = useMenuConfig();
  const { checkFeatureAccess } = usePlanLimits();
  
  const [config, setConfig] = useState<MenuConfig>(() => 
    initialConfig || loadConfig(card.id, currentPlan)
  );
  const [activeTab, setActiveTab] = useState('categories');
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
      case 'categoryImages':
      case 'categoryDescription':
      case 'advancedOptions':
      case 'optionGroups':
      case 'nutritionalInfo':
      case 'multipleImages':
      case 'stockTracking':
      case 'menuTemplates':
        return currentPlan === 'Pro' || currentPlan === 'Enterprise';
      case 'dynamicCategories':
      case 'seasonalCategories':
      case 'aiRecommendations':
      case 'dynamicPricing':
      case 'aiImageGeneration':
      case 'predictiveRestocking':
      case 'whiteLabel':
        return currentPlan === 'Enterprise';
      default:
        return true;
    }
  };

  // 설정 업데이트
  const updateConfig = (section: keyof MenuConfig, key: string, value: boolean | string | number) => {
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
    const defaultConfig = getDefaultMenuConfig(currentPlan);
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
      a.download = `menu-config-${card.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // 통계 정보
  const stats = getActiveFeatureCount(config);
  const limits = getMenuLimits(config);

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
                <Package className="w-4 h-4 text-blue-600" />
                <div className="text-body-small">카테고리</div>
              </div>
              <div className="text-2xl font-bold text-blue-600">{limits.maxCategories}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-green-600" />
                <div className="text-body-small">메뉴 아이템</div>
              </div>
              <div className="text-2xl font-bold text-green-600">{limits.maxItems}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Image className="w-4 h-4 text-purple-600" />
                <div className="text-body-small">이미지 품질</div>
              </div>
              <div className="text-2xl font-bold text-purple-600">{limits.imageQuality}</div>
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
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              카테고리
            </TabsTrigger>
            <TabsTrigger value="items" className="flex items-center gap-2">
              <Utensils className="w-4 h-4" />
              메뉴 아이템
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              이미지
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              재고 관리
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              설정
            </TabsTrigger>
          </TabsList>

          {/* 카테고리 설정 */}
          <TabsContent value="categories" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  카테고리 설정
                </CardTitle>
                <CardDescription>
                  메뉴 카테고리 구성과 관리 설정을 조정하세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 기본 카테고리 설정 */}
                <div>
                  <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    기본 설정 (모든 플랜)
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">카테고리 관리</div>
                        <div className="text-body-small text-gray-500">카테고리 생성, 수정, 삭제</div>
                      </div>
                      <Switch 
                        checked={config.categories.categoryManagement}
                        onCheckedChange={(checked) => updateConfig('categories', 'categoryManagement', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">카테고리 순서 변경</div>
                        <div className="text-body-small text-gray-500">드래그앤드롭으로 순서 조정</div>
                      </div>
                      <Switch 
                        checked={config.categories.categoryOrdering}
                        onCheckedChange={(checked) => updateConfig('categories', 'categoryOrdering', checked)}
                      />
                    </div>
                    
                    {/* 카테고리 개수 제한 */}
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-medium">최대 카테고리 수</div>
                          <div className="text-body-small text-gray-500">생성 가능한 카테고리 개수</div>
                        </div>
                        <Badge variant="outline">
                          {config.categories.maxCategories === -1 ? '무제한' : `${config.categories.maxCategories}개`}
                        </Badge>
                      </div>
                      {currentPlan !== 'Basic' && config.categories.maxCategories !== -1 && (
                        <div className="space-y-2">
                          <Slider
                            value={[config.categories.maxCategories]}
                            onValueChange={([value]) => updateConfig('categories', 'maxCategories', value)}
                            max={currentPlan === 'Pro' ? 20 : 50}
                            min={1}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>1개</span>
                            <span>{currentPlan === 'Pro' ? '20개' : '50개'}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pro 카테고리 설정 */}
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
                            <div className="font-medium">카테고리 이미지</div>
                            <div className="text-body-small text-gray-500">카테고리별 대표 이미지 설정</div>
                          </div>
                          <Switch 
                            checked={config.categories.categoryImages || false}
                            onCheckedChange={(checked) => updateConfig('categories', 'categoryImages', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">카테고리 설명</div>
                            <div className="text-body-small text-gray-500">카테고리별 상세 설명 추가</div>
                          </div>
                          <Switch 
                            checked={config.categories.categoryDescription || false}
                            onCheckedChange={(checked) => updateConfig('categories', 'categoryDescription', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Enterprise 카테고리 설정 */}
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
                            <div className="font-medium">동적 카테고리</div>
                            <div className="text-body-small text-gray-500">시간대/상황별 자동 카테고리 변경</div>
                          </div>
                          <Switch 
                            checked={config.categories.dynamicCategories || false}
                            onCheckedChange={(checked) => updateConfig('categories', 'dynamicCategories', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">시즌 카테고리</div>
                            <div className="text-body-small text-gray-500">계절별 특별 카테고리 자동 관리</div>
                          </div>
                          <Switch 
                            checked={config.categories.seasonalCategories || false}
                            onCheckedChange={(checked) => updateConfig('categories', 'seasonalCategories', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 메뉴 아이템 설정 */}
          <TabsContent value="items" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="w-5 h-5" />
                  메뉴 아이템 설정
                </CardTitle>
                <CardDescription>
                  메뉴 아이템의 관리와 옵션 설정을 조정하세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 기본 메뉴 아이템 설정 */}
                <div>
                  <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    기본 설정 (모든 플랜)
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">메뉴 아이템 관리</div>
                        <div className="text-body-small text-gray-500">메뉴 생성, 수정, 삭제</div>
                      </div>
                      <Switch 
                        checked={config.menuItems.itemManagement}
                        onCheckedChange={(checked) => updateConfig('menuItems', 'itemManagement', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">기본 옵션</div>
                        <div className="text-body-small text-gray-500">사이즈, 온도 등 기본 옵션</div>
                      </div>
                      <Switch 
                        checked={config.menuItems.basicOptions}
                        onCheckedChange={(checked) => updateConfig('menuItems', 'basicOptions', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">가격 관리</div>
                        <div className="text-body-small text-gray-500">메뉴별 가격 설정 및 할인</div>
                      </div>
                      <Switch 
                        checked={config.menuItems.priceManagement}
                        onCheckedChange={(checked) => updateConfig('menuItems', 'priceManagement', checked)}
                      />
                    </div>
                    
                    {/* 메뉴 아이템 개수 제한 */}
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-medium">최대 메뉴 아이템 수</div>
                          <div className="text-body-small text-gray-500">등록 가능한 메뉴 개수</div>
                        </div>
                        <Badge variant="outline">
                          {config.menuItems.maxItems === -1 ? '무제한' : `${config.menuItems.maxItems}개`}
                        </Badge>
                      </div>
                      {currentPlan !== 'Basic' && config.menuItems.maxItems !== -1 && (
                        <div className="space-y-2">
                          <Slider
                            value={[config.menuItems.maxItems]}
                            onValueChange={([value]) => updateConfig('menuItems', 'maxItems', value)}
                            max={currentPlan === 'Pro' ? 100 : 200}
                            min={10}
                            step={5}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>10개</span>
                            <span>{currentPlan === 'Pro' ? '100개' : '200개'}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pro 메뉴 아이템 설정 */}
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
                            <div className="font-medium">고급 옵션</div>
                            <div className="text-body-small text-gray-500">복잡한 메뉴 옵션 구성</div>
                          </div>
                          <Switch 
                            checked={config.menuItems.advancedOptions || false}
                            onCheckedChange={(checked) => updateConfig('menuItems', 'advancedOptions', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">옵션 그룹</div>
                            <div className="text-body-small text-gray-500">체계적인 옵션 그룹 관리</div>
                          </div>
                          <Switch 
                            checked={config.menuItems.optionGroups || false}
                            onCheckedChange={(checked) => updateConfig('menuItems', 'optionGroups', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">영양 정보</div>
                            <div className="text-body-small text-gray-500">칼로리, 영양성분 정보</div>
                          </div>
                          <Switch 
                            checked={config.menuItems.nutritionalInfo || false}
                            onCheckedChange={(checked) => updateConfig('menuItems', 'nutritionalInfo', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">알레르기 정보</div>
                            <div className="text-body-small text-gray-500">알레르기 유발 요소 표시</div>
                          </div>
                          <Switch 
                            checked={config.menuItems.allergens || false}
                            onCheckedChange={(checked) => updateConfig('menuItems', 'allergens', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Enterprise 메뉴 아이템 설정 */}
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
                            <div className="font-medium">AI 메뉴 추천</div>
                            <div className="text-body-small text-gray-500">AI 기반 메뉴 조합 추천</div>
                          </div>
                          <Switch 
                            checked={config.menuItems.aiRecommendations || false}
                            onCheckedChange={(checked) => updateConfig('menuItems', 'aiRecommendations', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">동적 가격 책정</div>
                            <div className="text-body-small text-gray-500">수요에 따른 실시간 가격 조정</div>
                          </div>
                          <Switch 
                            checked={config.menuItems.dynamicPricing || false}
                            onCheckedChange={(checked) => updateConfig('menuItems', 'dynamicPricing', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">경쟁사 분석</div>
                            <div className="text-body-small text-gray-500">경쟁업체 메뉴 가격 비교</div>
                          </div>
                          <Switch 
                            checked={config.menuItems.competitorAnalysis || false}
                            onCheckedChange={(checked) => updateConfig('menuItems', 'competitorAnalysis', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 이미지 설정 */}
          <TabsContent value="images" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="w-5 h-5" />
                  이미지 설정
                </CardTitle>
                <CardDescription>
                  메뉴 이미지 업로드와 관리 설정을 조정하세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 기본 이미지 설정 */}
                <div>
                  <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    기본 설정 (모든 플랜)
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">이미지 업로드</div>
                        <div className="text-body-small text-gray-500">메뉴 이미지 업로드 기능</div>
                      </div>
                      <Switch 
                        checked={config.images.imageUpload}
                        onCheckedChange={(checked) => updateConfig('images', 'imageUpload', checked)}
                      />
                    </div>
                    
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-medium">이미지 품질</div>
                          <div className="text-body-small text-gray-500">업로드 이미지 품질 설정</div>
                        </div>
                        <Badge variant="outline">
                          {config.images.imageQuality}
                        </Badge>
                      </div>
                      <Select 
                        value={config.images.imageQuality}
                        onValueChange={(value) => updateConfig('images', 'imageQuality', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic (기본)</SelectItem>
                          {(currentPlan === 'Pro' || currentPlan === 'Enterprise') && (
                            <SelectItem value="high">High (고품질)</SelectItem>
                          )}
                          {currentPlan === 'Enterprise' && (
                            <SelectItem value="premium">Premium (최고품질)</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-medium">최대 파일 크기</div>
                          <div className="text-body-small text-gray-500">업로드 가능한 이미지 크기</div>
                        </div>
                        <Badge variant="outline">
                          {config.images.maxImageSize}
                        </Badge>
                      </div>
                      <Select 
                        value={config.images.maxImageSize}
                        onValueChange={(value) => updateConfig('images', 'maxImageSize', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2MB">2MB</SelectItem>
                          {(currentPlan === 'Pro' || currentPlan === 'Enterprise') && (
                            <SelectItem value="5MB">5MB</SelectItem>
                          )}
                          {currentPlan === 'Enterprise' && (
                            <SelectItem value="10MB">10MB</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Pro 이미지 설정 */}
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
                            <div className="font-medium">다중 이미지</div>
                            <div className="text-body-small text-gray-500">메뉴당 여러 이미지 업로드</div>
                          </div>
                          <Switch 
                            checked={config.images.multipleImages || false}
                            onCheckedChange={(checked) => updateConfig('images', 'multipleImages', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">이미지 최적화</div>
                            <div className="text-body-small text-gray-500">자동 이미지 압축 및 최적화</div>
                          </div>
                          <Switch 
                            checked={config.images.imageOptimization || false}
                            onCheckedChange={(checked) => updateConfig('images', 'imageOptimization', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Enterprise 이미지 설정 */}
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
                            <div className="font-medium">AI 이미지 생성</div>
                            <div className="text-body-small text-gray-500">AI로 메뉴 이미지 자동 생성</div>
                          </div>
                          <Switch 
                            checked={config.images.aiImageGeneration || false}
                            onCheckedChange={(checked) => updateConfig('images', 'aiImageGeneration', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">브랜드 일관성</div>
                            <div className="text-body-small text-gray-500">브랜드 가이드라인 자동 적용</div>
                          </div>
                          <Switch 
                            checked={config.images.brandConsistency || false}
                            onCheckedChange={(checked) => updateConfig('images', 'brandConsistency', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 재고 관리 설정 */}
          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  재고 관리 설정
                </CardTitle>
                <CardDescription>
                  메뉴 재고 추적과 관리 설정을 조정하세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentPlan === 'Basic' ? (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      재고 관리 기능은 Pro 플랜 이상에서 사용할 수 있습니다. 
                      업그레이드하여 더 많은 기능을 이용하세요.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    {/* Pro 재고 관리 설정 */}
                    <div>
                      <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                        <Crown className="w-4 h-4 text-blue-600" />
                        Pro 설정 (Pro/Enterprise)
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">재고 추적</div>
                            <div className="text-body-small text-gray-500">메뉴별 재고 수량 관리</div>
                          </div>
                          <Switch 
                            checked={config.inventory?.stockTracking || false}
                            onCheckedChange={(checked) => updateConfig('inventory', 'stockTracking', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">재고 부족 알림</div>
                            <div className="text-body-small text-gray-500">재고 부족 시 자동 알림</div>
                          </div>
                          <Switch 
                            checked={config.inventory?.lowStockAlerts || false}
                            onCheckedChange={(checked) => updateConfig('inventory', 'lowStockAlerts', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">자동 품절 처리</div>
                            <div className="text-body-small text-gray-500">재고 0개 시 자동 비활성화</div>
                          </div>
                          <Switch 
                            checked={config.inventory?.autoDisable || false}
                            onCheckedChange={(checked) => updateConfig('inventory', 'autoDisable', checked)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Enterprise 재고 관리 설정 */}
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
                                <div className="font-medium">예측 재고 보충</div>
                                <div className="text-body-small text-gray-500">AI 기반 재고 소모 예측</div>
                              </div>
                              <Switch 
                                checked={config.inventory?.predictiveRestocking || false}
                                onCheckedChange={(checked) => updateConfig('inventory', 'predictiveRestocking', checked)}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <div className="font-medium">공급업체 연동</div>
                                <div className="text-body-small text-gray-500">공급업체 시스템 직접 연동</div>
                              </div>
                              <Switch 
                                checked={config.inventory?.supplierIntegration || false}
                                onCheckedChange={(checked) => updateConfig('inventory', 'supplierIntegration', checked)}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <div className="font-medium">폐기물 추적</div>
                                <div className="text-body-small text-gray-500">식재료 폐기량 모니터링</div>
                              </div>
                              <Switch 
                                checked={config.inventory?.wasteTracking || false}
                                onCheckedChange={(checked) => updateConfig('inventory', 'wasteTracking', checked)}
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

          {/* 고급 설정 */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  고급 설정
                </CardTitle>
                <CardDescription>
                  메뉴 관리의 동작과 모양을 설정하세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 기본 설정 */}
                <div>
                  <h4 className="text-body font-medium mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    기본 설정 (모든 플랜)
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">메뉴 노출 관리</div>
                        <div className="text-body-small text-gray-500">메뉴별 노출/비노출 설정</div>
                      </div>
                      <Switch 
                        checked={config.settings.menuVisibility}
                        onCheckedChange={(checked) => updateConfig('settings', 'menuVisibility', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">품절 관리</div>
                        <div className="text-body-small text-gray-500">메뉴별 품절 토글 기능</div>
                      </div>
                      <Switch 
                        checked={config.settings.availabilityToggle}
                        onCheckedChange={(checked) => updateConfig('settings', 'availabilityToggle', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">기본 분석</div>
                        <div className="text-body-small text-gray-500">메뉴별 기본 통계 제공</div>
                      </div>
                      <Switch 
                        checked={config.settings.basicAnalytics}
                        onCheckedChange={(checked) => updateConfig('settings', 'basicAnalytics', checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Pro 설정 */}
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
                            <div className="font-medium">메뉴 템플릿</div>
                            <div className="text-body-small text-gray-500">미리 구성된 메뉴 템플릿</div>
                          </div>
                          <Switch 
                            checked={config.settings.menuTemplates || false}
                            onCheckedChange={(checked) => updateConfig('settings', 'menuTemplates', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">일괄 작업</div>
                            <div className="text-body-small text-gray-500">여러 메뉴 동시 수정</div>
                          </div>
                          <Switch 
                            checked={config.settings.bulkOperations || false}
                            onCheckedChange={(checked) => updateConfig('settings', 'bulkOperations', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">고급 분석</div>
                            <div className="text-body-small text-gray-500">상세한 메뉴 성과 분석</div>
                          </div>
                          <Switch 
                            checked={config.settings.advancedAnalytics || false}
                            onCheckedChange={(checked) => updateConfig('settings', 'advancedAnalytics', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Enterprise 설정 */}
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
                            <div className="font-medium">화이트 레이블</div>
                            <div className="text-body-small text-gray-500">브랜드 커스터마이징</div>
                          </div>
                          <Switch 
                            checked={config.settings.whiteLabel || false}
                            onCheckedChange={(checked) => updateConfig('settings', 'whiteLabel', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">API 접근</div>
                            <div className="text-body-small text-gray-500">외부 시스템 연동 API</div>
                          </div>
                          <Switch 
                            checked={config.settings.apiAccess || false}
                            onCheckedChange={(checked) => updateConfig('settings', 'apiAccess', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">커스텀 필드</div>
                            <div className="text-body-small text-gray-500">사용자 정의 메뉴 속성</div>
                          </div>
                          <Switch 
                            checked={config.settings.customFields || false}
                            onCheckedChange={(checked) => updateConfig('settings', 'customFields', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">다국어 지원</div>
                            <div className="text-body-small text-gray-500">메뉴 다국어 번역</div>
                          </div>
                          <Switch 
                            checked={config.settings.multiLanguage || false}
                            onCheckedChange={(checked) => updateConfig('settings', 'multiLanguage', checked)}
                          />
                        </div>
                      </div>
                    </div>
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