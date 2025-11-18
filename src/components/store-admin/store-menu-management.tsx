import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, Edit3, Trash2, Eye, MoreVertical,
  Package, DollarSign, TrendingUp, Clock, Star, Camera, Upload,
  AlertCircle, Crown, Zap
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Progress } from '../ui/progress';
import { usePlanLimits } from '../../hooks/usePlanLimits';
import { EnhancedPlanAccessControl, PlanAccessControl } from './common/plan-access-control';
import { toast } from 'sonner@2.0.3';

// Mock 상품 데이터
const mockMenuItems = [
  {
    id: '1',
    name: '아메리카노',
    description: '깊고 진한 맛의 클래식 아메리카노',
    price: 4500,
    category: 'coffee',
    status: 'active',
    stock: 100,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop',
    sales: 1250,
    rating: 4.8,
    createdAt: '2024-01-15',
    options: [
      { name: '사이즈', values: ['Small', 'Medium', 'Large'], prices: [0, 500, 1000] },
      { name: '샷 추가', values: ['기본', '1샷 추가', '2샷 추가'], prices: [0, 500, 1000] }
    ]
  },
  {
    id: '2',
    name: '카페 라떼',
    description: '부드러운 우유와 에스프레소의 완벽한 조화',
    price: 5000,
    category: 'coffee',
    status: 'active',
    stock: 85,
    image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9d?w=200&h=200&fit=crop',
    sales: 890,
    rating: 4.7,
    createdAt: '2024-01-15',
    options: [
      { name: '사이즈', values: ['Small', 'Medium', 'Large'], prices: [0, 500, 1000] }
    ]
  },
  {
    id: '3',
    name: '카푸치노',
    description: '진한 에스프레소와 풍성한 우유 거품',
    price: 5500,
    category: 'coffee',
    status: 'active',
    stock: 92,
    image: 'https://images.unsplash.com/photo-1534687584862-d562565b9295?w=200&h=200&fit=crop',
    sales: 654,
    rating: 4.6,
    createdAt: '2024-01-15',
    options: []
  },
  {
    id: '4',
    name: '초콜릿 케이크',
    description: '달콤하고 촉촉한 수제 초콜릿 케이크',
    price: 6500,
    category: 'dessert',
    status: 'active',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=200&h=200&fit=crop',
    sales: 234,
    rating: 4.9,
    createdAt: '2024-01-16',
    options: []
  },
  {
    id: '5',
    name: '치즈케이크',
    description: '부드럽고 진한 크림치즈의 풍미',
    price: 7000,
    category: 'dessert',
    status: 'sold_out',
    stock: 0,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=200&h=200&fit=crop',
    sales: 456,
    rating: 4.8,
    createdAt: '2024-01-16',
    options: []
  }
];

interface StoreMenuManagementProps {
  currentPlan?: 'basic' | 'pro' | 'enterprise';
}

export function StoreMenuManagement({ currentPlan = 'basic' }: StoreMenuManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState('');

  // 현재 사용량 계산
  const currentUsage = {
    menuItems: mockMenuItems.length,
    menuOptions: Math.max(...mockMenuItems.map(item => item.options?.length || 0)),
    categories: new Set(mockMenuItems.map(item => item.category)).size
  };

  // 플랜별 제한 훅 사용
  const planLimits = usePlanLimits(currentPlan, currentUsage);

  // 플랜별 제한 체크 함수들
  const checkMenuLimit = (feature: string, currentValue?: number) => {
    return planLimits.checkFeatureLimit(feature, currentValue);
  };

  // 메뉴 추가 시 제한 체크
  const handleAddMenu = () => {
    const menuCheck = checkMenuLimit('menuItems', mockMenuItems.length + 1);
    
    if (menuCheck.allowed) {
      setIsAddModalOpen(true);
      console.log('✅ 메뉴 추가 허용');
    } else {
      setUpgradeFeature('menuItems');
      setShowUpgradeModal(true);
      toast.error(menuCheck.message);
      console.log('🚫 메뉴 추가 제한:', menuCheck.message);
    }
  };

  // 옵션 추가 시 제한 체크
  const handleAddOption = (menuItem: any) => {
    const currentOptionCount = menuItem.options?.length || 0;
    const optionCheck = checkMenuLimit('menuOptions', currentOptionCount + 1);
    
    if (optionCheck.allowed) {
      console.log('✅ 옵션 추가 허용');
      toast.success('옵션이 추가되었습니다.');
    } else {
      setUpgradeFeature('menuOptions');
      setShowUpgradeModal(true);
      toast.error(optionCheck.message);
      console.log('🚫 옵션 추가 제한:', optionCheck.message);
    }
  };

  // 카테고리 추가 시 제한 체크
  const handleAddCategory = () => {
    const currentCategoryCount = new Set(mockMenuItems.map(item => item.category)).size;
    const categoryCheck = checkMenuLimit('categories', currentCategoryCount + 1);
    
    if (categoryCheck.allowed) {
      console.log('✅ 카테고리 추가 허용');
      toast.success('카테고리가 추가되었습니다.');
    } else {
      setUpgradeFeature('categories');
      setShowUpgradeModal(true);
      toast.error(categoryCheck.message);
      console.log('🚫 카테고리 추가 제한:', categoryCheck.message);
    }
  };

  // 플랜별 제한 정보 표시
  const renderPlanLimitInfo = () => {
    const menuLimit = checkMenuLimit('menuItems');
    const optionLimit = checkMenuLimit('menuOptions');
    const categoryLimit = checkMenuLimit('categories');

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* 메뉴 수 제한 */}
        <Card className={`p-4 ${menuLimit.allowed ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">메뉴 수</span>
            {!menuLimit.allowed && <AlertCircle className="w-4 h-4 text-yellow-600" />}
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {mockMenuItems.length} / {menuLimit.limit === -1 ? '∞' : menuLimit.limit}
          </div>
          <Progress 
            value={planLimits.getUsageProgress('menuItems')} 
            className="h-2 mt-2"
          />
          <div className="text-xs text-gray-500 mt-1">
            {menuLimit.message}
          </div>
        </Card>

        {/* 옵션 수 제한 */}
        <Card className={`p-4 ${optionLimit.allowed ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">메뉴별 최대 옵션 수</span>
            {!optionLimit.allowed && <AlertCircle className="w-4 h-4 text-yellow-600" />}
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {Math.max(...mockMenuItems.map(item => item.options?.length || 0))} / {optionLimit.limit === -1 ? '∞' : optionLimit.limit}
          </div>
          <Progress 
            value={planLimits.getUsageProgress('menuOptions')} 
            className="h-2 mt-2"
          />
          <div className="text-xs text-gray-500 mt-1">
            {optionLimit.message}
          </div>
        </Card>

        {/* 카테고리 수 제한 */}
        <Card className={`p-4 ${categoryLimit.allowed ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">카테고리 수</span>
            {!categoryLimit.allowed && <AlertCircle className="w-4 h-4 text-yellow-600" />}
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {new Set(mockMenuItems.map(item => item.category)).size} / {categoryLimit.limit === -1 ? '∞' : categoryLimit.limit}
          </div>
          <Progress 
            value={planLimits.getUsageProgress('categories')} 
            className="h-2 mt-2"
          />
          <div className="text-xs text-gray-500 mt-1">
            {categoryLimit.message}
          </div>
        </Card>
      </div>
    );
  };

  // 업그레이드 메시지 생성
  const getUpgradeMessage = (feature: string) => {
    const messages = {
      menuItems: `현재 ${currentPlan} 플랜에서는 메뉴 수가 제한되어 있습니다. 더 많은 메뉴를 추가하려면 상위 플랜으로 업그레이드하세요.`,
      menuOptions: `현재 ${currentPlan} 플랜에서는 메뉴 옵션 수가 제한되어 있습니다. 더 많은 옵션을 추가하려면 상위 플랜으로 업그레이드하세요.`,
      categories: `현재 ${currentPlan} 플랜에서는 카테고리 수가 제한되어 있습니다. 더 많은 카테고리를 추가하려면 상위 플랜으로 업그레이드하세요.`
    };
    return messages[feature as keyof typeof messages] || '플랜 업그레이드가 필요합니다.';
  };

  // 필터링된 메뉴 아이템
  const filteredItems = mockMenuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryLabel = (category: string) => {
    const categories = {
      coffee: '커피',
      dessert: '디저트',
      beverage: '음료',
      food: '음식'
    };
    return categories[category as keyof typeof categories] || category;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success-green-50 text-success-green';
      case 'sold_out': return 'bg-error-red-50 text-error-red';
      case 'inactive': return 'bg-gray-50 text-gray-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return '판매중';
      case 'sold_out': return '품절';
      case 'inactive': return '판매중지';
      default: return status;
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsAddModalOpen(true);
  };

  const handleDelete = (itemId: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      console.log('Delete item:', itemId);
      toast.success('상품이 삭제되었습니다.');
    }
  };

  const handleFilterReset = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setStatusFilter('all');
    toast.success('필터가 초기화되었습니다.');
  };

  return (
    <div className="space-y-6 p-6">
      {/* 페이지 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-heading-1 text-gray-900">상품 관리</h1>
          <p className="text-body text-gray-600 mt-1">메뉴를 등록하고 관리하세요</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleAddMenu}
            className="bg-primary-blue hover:bg-primary-blue-dark"
            disabled={!checkMenuLimit('menuItems', mockMenuItems.length + 1).allowed}
          >
            <Plus className="w-4 h-4 mr-2" />
            상품 추가
            {!checkMenuLimit('menuItems', mockMenuItems.length + 1).allowed && (
              <Crown className="w-4 h-4 ml-2" />
            )}
          </Button>
        </div>
      </div>

      {/* 플랜별 제한 정보 표시 */}
      {renderPlanLimitInfo()}

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-small text-gray-600">전체 상품</p>
              <p className="text-heading-3 text-gray-900">{mockMenuItems.length}개</p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-small text-gray-600">판매중 상품</p>
              <p className="text-heading-3 text-success-green">
                {mockMenuItems.filter(item => item.status === 'active').length}개
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-success-green" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-small text-gray-600">품절 상품</p>
              <p className="text-heading-3 text-error-red">
                {mockMenuItems.filter(item => item.status === 'sold_out').length}개
              </p>
            </div>
            <Clock className="w-8 h-8 text-error-red" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-small text-gray-600">평균 가격</p>
              <p className="text-heading-3 text-gray-900">
                ₩{Math.round(mockMenuItems.reduce((sum, item) => sum + item.price, 0) / mockMenuItems.length).toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* 필터 및 검색 */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="상품명 검색..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="카테고리" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 카테고리</SelectItem>
              <SelectItem value="coffee">커피</SelectItem>
              <SelectItem value="dessert">디저트</SelectItem>
              <SelectItem value="beverage">음료</SelectItem>
              <SelectItem value="food">음식</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="상태" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 상태</SelectItem>
              <SelectItem value="active">판매중</SelectItem>
              <SelectItem value="sold_out">품절</SelectItem>
              <SelectItem value="inactive">판매중지</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={handleFilterReset}>
            <Filter className="w-4 h-4 mr-2" />
            필터 초기화
          </Button>
        </div>
      </Card>

      {/* 상품 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <Badge className={getStatusColor(item.status)}>
                {getStatusLabel(item.status)}
              </Badge>
              
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                  <Edit3 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="mb-4">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <h3 className="text-heading-4 text-gray-900 mb-1">{item.name}</h3>
              <p className="text-body-small text-gray-600 mb-2">{item.description}</p>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-heading-4 text-primary-blue">₩{item.price.toLocaleString()}</span>
                <span className="text-body-small text-gray-500">• {getCategoryLabel(item.category)}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-body-small">
                <span className="text-gray-600">재고:</span>
                <span className={item.stock > 10 ? 'text-success-green' : 'text-error-red'}>
                  {item.stock}개
                </span>
              </div>
              <div className="flex justify-between text-body-small">
                <span className="text-gray-600">판매량:</span>
                <span className="text-gray-900">{item.sales}개</span>
              </div>
              <div className="flex justify-between text-body-small">
                <span className="text-gray-600">평점:</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-gray-900">{item.rating}</span>
                </div>
              </div>
              
              {/* 옵션 정보 및 추가 버튼 */}
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-body-small text-gray-600">
                  옵션: {item.options?.length || 0}개
                </span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleAddOption(item)}
                  disabled={!checkMenuLimit('menuOptions', item.options?.length || 0 + 1).allowed}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  옵션 추가
                  {!checkMenuLimit('menuOptions', item.options?.length || 0 + 1).allowed && (
                    <Crown className="w-3 h-3 ml-1" />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 상품 추가/편집 모달 */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? '상품 편집' : '새 상품 추가'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* 상품 이미지 */}
            <div>
              <label className="text-label text-gray-900 mb-2 block">상품 이미지</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-body-small text-gray-600 mb-2">이미지를 업로드하세요</p>
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  파일 선택
                </Button>
              </div>
            </div>
            
            {/* 기본 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-label text-gray-900 mb-2 block">상품명 *</label>
                <Input placeholder="상품명을 입력하세요" defaultValue={editingItem?.name} />
              </div>
              
              <div>
                <label className="text-label text-gray-900 mb-2 block">카테고리 *</label>
                <Select defaultValue={editingItem?.category || "coffee"}>
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coffee">커피</SelectItem>
                    <SelectItem value="dessert">디저트</SelectItem>
                    <SelectItem value="beverage">음료</SelectItem>
                    <SelectItem value="food">음식</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="text-label text-gray-900 mb-2 block">상품 설명</label>
              <Textarea 
                placeholder="상품에 대한 설명을 입력하세요"
                defaultValue={editingItem?.description}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-label text-gray-900 mb-2 block">가격 *</label>
                <Input 
                  type="number" 
                  placeholder="0" 
                  defaultValue={editingItem?.price}
                />
              </div>
              
              <div>
                <label className="text-label text-gray-900 mb-2 block">재고 수량</label>
                <Input 
                  type="number" 
                  placeholder="0" 
                  defaultValue={editingItem?.stock}
                />
              </div>
              
              <div>
                <label className="text-label text-gray-900 mb-2 block">상태</label>
                <Select defaultValue={editingItem?.status || "active"}>
                  <SelectTrigger>
                    <SelectValue placeholder="상태 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">판매중</SelectItem>
                    <SelectItem value="inactive">판매중지</SelectItem>
                    <SelectItem value="sold_out">품절</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* 옵션 설정 - 플랜별 제한 적용 */}
            <EnhancedPlanAccessControl
              currentPlan={currentPlan}
              featureName="상품 옵션"
              feature="menuOptions"
              requiresPlan="pro"
            >
              <div>
                <label className="text-label text-gray-900 mb-2 block">상품 옵션</label>
                <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-body-small text-gray-700">옵션을 추가하여 다양한 선택지를 제공하세요</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAddOption(editingItem)}
                      disabled={!checkMenuLimit('menuOptions', editingItem?.options?.length || 0 + 1).allowed}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      옵션 추가
                    </Button>
                  </div>
                  
                  {editingItem?.options?.map((option: any, index: number) => (
                    <div key={index} className="border border-gray-100 rounded p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{option.name}</span>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {option.values.map((value: string, valueIndex: number) => (
                          <div key={valueIndex} className="flex gap-2 text-body-small">
                            <span className="flex-1">{value}</span>
                            <span className="text-gray-600">+₩{option.prices[valueIndex].toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </EnhancedPlanAccessControl>
            
            {/* 액션 버튼 */}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)} className="flex-1">
                취소
              </Button>
              <Button className="flex-1 bg-primary-blue hover:bg-primary-blue-dark">
                {editingItem ? '수정하기' : '추가하기'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 업그레이드 모달 */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5" />
              플랜 업그레이드 필요
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">플랜 제한 도달</h3>
              <p className="text-gray-600">
                {getUpgradeMessage(upgradeFeature)}
              </p>
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button 
                onClick={() => setShowUpgradeModal(false)} 
                variant="outline" 
                className="flex-1"
              >
                나중에
              </Button>
              <Button 
                onClick={() => {
                  console.log('업그레이드 페이지로 이동');
                  setShowUpgradeModal(false);
                  toast.success('업그레이드 페이지로 이동합니다.');
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Crown className="w-4 h-4 mr-2" />
                업그레이드
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}