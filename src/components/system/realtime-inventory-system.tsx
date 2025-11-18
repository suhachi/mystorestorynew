import React, { useState, useEffect, useMemo } from 'react';
import { useRealtimeData, Inventory } from './realtime-data-context';
import { InteractiveButton } from '../interactions/interactive-button';
import { InteractiveModal } from '../interactions/interactive-modal';
import { InteractiveInput } from '../interactions/interactive-input';
import { 
  Package, AlertTriangle, Plus, Minus, Edit, Trash2,
  TrendingUp, TrendingDown, BarChart3, RefreshCw,
  Search, Filter, Settings, Download, Upload,
  Eye, MoreVertical, Star, Tag, Image as ImageIcon,
  Calendar, DollarSign, Archive, Zap, ShoppingCart,
  Truck, FileText, QrCode, Scan, CheckCircle2,
  XCircle, Clock, RotateCcw, AlertCircle, X
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Checkbox } from '../ui/checkbox';

// 재고 상태 타입
type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'reorder_needed';

// 재고 상태별 색상
const stockStatusColors = {
  in_stock: 'bg-green-500',
  low_stock: 'bg-yellow-500',
  out_of_stock: 'bg-red-500',
  reorder_needed: 'bg-orange-500'
} as const;

const stockStatusTexts = {
  in_stock: '정상',
  low_stock: '부족',
  out_of_stock: '품절',
  reorder_needed: '발주 필요'
} as const;

// 실시간 재고 관리 대시보드
export function RealtimeInventoryDashboard() {
  const { 
    state, 
    updateInventory, 
    addInventoryItem, 
    updateInventoryItem,
    removeInventoryItem,
    checkLowStock
  } = useRealtimeData();
  
  const [selectedItem, setSelectedItem] = useState<Inventory | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<StockStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'value' | 'updated'>('updated');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // 재고 상태 계산
  const getStockStatus = (item: Inventory): StockStatus => {
    if (item.currentStock === 0) return 'out_of_stock';
    if (item.currentStock <= item.reorderPoint) return 'reorder_needed';
    if (item.currentStock <= item.minStock) return 'low_stock';
    return 'in_stock';
  };

  // 재고 필터링 및 정렬
  const filteredAndSortedInventory = useMemo(() => {
    let filtered = state.inventory.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || getStockStatus(item) === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });

    // 정렬
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'stock':
          comparison = a.currentStock - b.currentStock;
          break;
        case 'value':
          comparison = (a.currentStock * a.price) - (b.currentStock * b.price);
          break;
        case 'updated':
          comparison = new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [state.inventory, searchTerm, categoryFilter, statusFilter, sortBy, sortOrder]);

  // 카테고리 목록
  const categories = useMemo(() => 
    Array.from(new Set(state.inventory.map(item => item.category))).sort(),
    [state.inventory]
  );

  // 재고 통계
  const inventoryStats = useMemo(() => {
    const totalValue = state.inventory.reduce((sum, item) => sum + (item.currentStock * item.price), 0);
    const totalCost = state.inventory.reduce((sum, item) => sum + (item.currentStock * item.cost), 0);
    const profit = totalValue - totalCost;
    const profitMargin = totalValue > 0 ? (profit / totalValue) * 100 : 0;

    return {
      total: state.inventory.length,
      inStock: state.inventory.filter(item => getStockStatus(item) === 'in_stock').length,
      lowStock: state.inventory.filter(item => getStockStatus(item) === 'low_stock').length,
      outOfStock: state.inventory.filter(item => getStockStatus(item) === 'out_of_stock').length,
      reorderNeeded: state.inventory.filter(item => getStockStatus(item) === 'reorder_needed').length,
      totalValue,
      totalCost,
      profit,
      profitMargin,
      averageStockLevel: state.inventory.length > 0 ? 
        state.inventory.reduce((sum, item) => sum + (item.currentStock / item.maxStock * 100), 0) / state.inventory.length : 0
    };
  }, [state.inventory]);

  // 모달 열기 함수들
  const openDetailModal = (item: Inventory) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const openEditModal = (item: Inventory) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  // 재고 수량 조정
  const adjustStock = async (itemId: string, adjustment: number) => {
    const item = state.inventory.find(inv => inv.id === itemId);
    if (item) {
      const newStock = Math.max(0, Math.min(item.maxStock, item.currentStock + adjustment));
      await updateInventory(itemId, newStock);
    }
  };

  // 선택된 아이템들 처리
  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredAndSortedInventory.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  // 일괄 작업
  const bulkUpdateStock = async (adjustment: number) => {
    for (const itemId of selectedItems) {
      await adjustStock(itemId, adjustment);
    }
    setSelectedItems([]);
  };

  const bulkUpdateAvailability = async (isAvailable: boolean) => {
    for (const itemId of selectedItems) {
      await updateInventoryItem(itemId, { isAvailable });
    }
    setSelectedItems([]);
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-heading-2 text-gray-900">실시간 재고 관리</h2>
          <p className="text-body text-gray-600">
            실시간으로 재고 현황을 확인하고 관리하세요
          </p>
        </div>
        
        <div className="flex gap-2">
          <InteractiveButton
            variant="secondary"
            size="sm"
            onClick={() => console.log('재고 데이터 가져오기')}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            가져오기
          </InteractiveButton>
          <InteractiveButton
            variant="secondary"
            size="sm"
            onClick={() => console.log('재고 데이터 내보내기')}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            내보내기
          </InteractiveButton>
          <InteractiveButton
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            재고 추가
          </InteractiveButton>
        </div>
      </div>

      {/* 긴급 알림 */}
      {(inventoryStats.outOfStock > 0 || inventoryStats.reorderNeeded > 0) && (
        <div className="space-y-2">
          {inventoryStats.outOfStock > 0 && (
            <Alert className="border-red-200 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>{inventoryStats.outOfStock}개 상품</strong>이 품절되었습니다.
                <button 
                  onClick={() => setStatusFilter('out_of_stock')}
                  className="underline ml-2 font-medium hover:text-red-900"
                >
                  확인하기
                </button>
              </AlertDescription>
            </Alert>
          )}
          
          {inventoryStats.reorderNeeded > 0 && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>{inventoryStats.reorderNeeded}개 상품</strong>의 발주가 필요합니다.
                <button 
                  onClick={() => setStatusFilter('reorder_needed')}
                  className="underline ml-2 font-medium hover:text-orange-900"
                >
                  확인하기
                </button>
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* 재고 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <InventoryStatCard
          icon={Package}
          title="전체 상품"
          value={inventoryStats.total}
          subtitle="개 품목"
          color="blue"
          onClick={() => setStatusFilter('all')}
        />
        <InventoryStatCard
          icon={CheckCircle2}
          title="정상 재고"
          value={inventoryStats.inStock}
          subtitle="충분한 재고"
          color="green"
          onClick={() => setStatusFilter('in_stock')}
        />
        <InventoryStatCard
          icon={AlertTriangle}
          title="재고 부족"
          value={inventoryStats.lowStock}
          subtitle="보충 필요"
          color="yellow"
          onClick={() => setStatusFilter('low_stock')}
        />
        <InventoryStatCard
          icon={XCircle}
          title="품절"
          value={inventoryStats.outOfStock}
          subtitle="즉시 보충"
          color="red"
          onClick={() => setStatusFilter('out_of_stock')}
        />
        <InventoryStatCard
          icon={DollarSign}
          title="재고 가치"
          value={inventoryStats.totalValue}
          subtitle={`이익률 ${inventoryStats.profitMargin.toFixed(1)}%`}
          color="purple"
          isAmount
        />
      </div>

      {/* 추가 분석 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-body flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              평균 재고율
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-body-small">
                <span>전체 재 수준</span>
                <span>{inventoryStats.averageStockLevel.toFixed(1)}%</span>
              </div>
              <Progress value={inventoryStats.averageStockLevel} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-body flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              수익 분석
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-body-small">
                <span>총 원가</span>
                <span>{inventoryStats.totalCost.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-body-small">
                <span>예상 수익</span>
                <span className="text-green-600">{inventoryStats.profit.toLocaleString()}원</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-body flex items-center gap-2">
              <Clock className="w-4 h-4" />
              최근 업데이트
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {state.inventory
                .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
                .slice(0, 3)
                .map(item => (
                  <div key={item.id} className="flex justify-between text-body-small">
                    <span className="truncate">{item.name}</span>
                    <span className="text-gray-500">
                      {new Date(item.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                ))
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 필터 및 검색 */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <InteractiveInput
            type="text"
            placeholder="상품명, SKU, 카테고리로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="카테고리 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 카테고리</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StockStatus | 'all')}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="상태 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 상태</SelectItem>
              <SelectItem value="in_stock">정상</SelectItem>
              <SelectItem value="low_stock">부족</SelectItem>
              <SelectItem value="out_of_stock">품절</SelectItem>
              <SelectItem value="reorder_needed">발주필요</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">이름순</SelectItem>
              <SelectItem value="stock">재고순</SelectItem>
              <SelectItem value="value">가치순</SelectItem>
              <SelectItem value="updated">업데이트순</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-1">
            <InteractiveButton
              variant={viewMode === 'grid' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="px-3"
            >
              <Package className="w-4 h-4" />
            </InteractiveButton>
            <InteractiveButton
              variant={viewMode === 'list' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="px-3"
            >
              <FileText className="w-4 h-4" />
            </InteractiveButton>
          </div>
        </div>
      </div>

      {/* 선택된 아이템 일괄 작업 */}
      {selectedItems.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-body-small text-blue-800">
                {selectedItems.length}개 항목이 선택되었습니다
              </span>
              <div className="flex gap-2">
                <InteractiveButton
                  variant="secondary"
                  size="sm"
                  onClick={() => bulkUpdateStock(1)}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  재고 증가
                </InteractiveButton>
                <InteractiveButton
                  variant="secondary"
                  size="sm"
                  onClick={() => bulkUpdateStock(-1)}
                  className="flex items-center gap-2"
                >
                  <Minus className="w-4 h-4" />
                  재고 감소
                </InteractiveButton>
                <InteractiveButton
                  variant="secondary"
                  size="sm"
                  onClick={() => bulkUpdateAvailability(false)}
                  className="flex items-center gap-2"
                >
                  <Archive className="w-4 h-4" />
                  판매 중지
                </InteractiveButton>
                <InteractiveButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedItems([])}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  선택 해제
                </InteractiveButton>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 재고 목록 */}
      <div className="space-y-4">
        {filteredAndSortedInventory.length === 0 ? (
          <EmptyInventoryState filter={statusFilter} searchTerm={searchTerm} />
        ) : (
          <>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <p className="text-body-small text-gray-600">
                  {filteredAndSortedInventory.length}개의 상품을 찾았습니다
                </p>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedItems.length === filteredAndSortedInventory.length && filteredAndSortedInventory.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="text-body-small text-gray-600">전체 선택</span>
                </div>
              </div>
              <InteractiveButton
                variant="ghost"
                size="sm"
                onClick={() => console.log('새로고침')}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                새로고침
              </InteractiveButton>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAndSortedInventory.map(item => (
                  <InventoryCard
                    key={item.id}
                    item={item}
                    isSelected={selectedItems.includes(item.id)}
                    onSelect={(checked) => handleSelectItem(item.id, checked)}
                    onViewDetail={() => openDetailModal(item)}
                    onEdit={() => openEditModal(item)}
                    onDelete={removeInventoryItem}
                    onAdjustStock={adjustStock}
                    getStockStatus={getStockStatus}
                  />
                ))}
              </div>
            ) : (
              <InventoryListView
                items={filteredAndSortedInventory}
                selectedItems={selectedItems}
                onSelect={handleSelectItem}
                onViewDetail={openDetailModal}
                onEdit={openEditModal}
                onDelete={removeInventoryItem}
                onAdjustStock={adjustStock}
                getStockStatus={getStockStatus}
              />
            )}

            {/* 페이지네이션 (필요시) */}
            {filteredAndSortedInventory.length > 20 && (
              <div className="flex justify-center mt-8">
                <InteractiveButton variant="secondary" size="md">
                  더 보기
                </InteractiveButton>
              </div>
            )}
          </>
        )}
      </div>

      {/* 모달들 */}
      <InventoryModals
        selectedItem={selectedItem}
        isDetailModalOpen={isDetailModalOpen}
        isEditModalOpen={isEditModalOpen}
        isAddModalOpen={isAddModalOpen}
        onCloseDetailModal={() => setIsDetailModalOpen(false)}
        onCloseEditModal={() => setIsEditModalOpen(false)}
        onCloseAddModal={() => setIsAddModalOpen(false)}
        onSaveEdit={async (updates) => {
          if (selectedItem) {
            await updateInventoryItem(selectedItem.id, updates);
            setIsEditModalOpen(false);
          }
        }}
        onSaveAdd={async (itemData) => {
          await addInventoryItem(itemData);
          setIsAddModalOpen(false);
        }}
      />
    </div>
  );
}

// 재고 통계 카드 컴포넌트
function InventoryStatCard({ 
  icon: Icon, 
  title, 
  value, 
  subtitle, 
  color,
  isAmount = false,
  onClick 
}: {
  icon: React.ComponentType<any>;
  title: string;
  value: number;
  subtitle: string;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  isAmount?: boolean;
  onClick?: () => void;
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600'
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-body-small text-gray-600">{title}</p>
            <p className="text-heading-3 text-gray-900">
              {isAmount ? `${value.toLocaleString()}원` : value.toLocaleString()}
            </p>
            <p className="text-body-small text-gray-500 mt-1">{subtitle}</p>
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 재고 카드 컴포넌트
function InventoryCard({ 
  item, 
  isSelected,
  onSelect,
  onViewDetail, 
  onEdit, 
  onDelete, 
  onAdjustStock,
  getStockStatus
}: {
  item: Inventory;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onViewDetail: () => void;
  onEdit: () => void;
  onDelete: (itemId: string) => void;
  onAdjustStock: (itemId: string, adjustment: number) => void;
  getStockStatus: (item: Inventory) => StockStatus;
}) {
  const status = getStockStatus(item);
  const stockPercentage = Math.min(100, (item.currentStock / item.maxStock) * 100);

  return (
    <Card className={`hover:shadow-lg transition-shadow relative ${isSelected ? 'ring-2 ring-primary-blue' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isSelected}
              onCheckedChange={onSelect}
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-heading-4 text-gray-900 mb-1 truncate">{item.name}</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">{item.category}</Badge>
                <Badge className={`${stockStatusColors[status]} text-white text-xs`}>
                  {stockStatusTexts[status]}
                </Badge>
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InteractiveButton variant="ghost" size="sm" className="p-2">
                <MoreVertical className="w-4 h-4" />
              </InteractiveButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onViewDetail}>
                <Eye className="w-4 h-4 mr-2" />
                상세보기
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                편집
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAdjustStock(item.id, item.maxStock - item.currentStock)}>
                <Package className="w-4 h-4 mr-2" />
                재고 채우기
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(item.id)}
                className="text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 상품 이미지 */}
        {item.images.length > 0 ? (
          <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
            <img 
              src={item.images[0]} 
              alt={item.name}
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center"><ImageIcon class="w-8 h-8 text-gray-400" /></div>';
              }}
            />
          </div>
        ) : (
          <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
        )}

        {/* SKU 및 설명 */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <QrCode className="w-4 h-4 text-gray-400" />
            <span className="text-body-small text-gray-600">SKU: {item.sku}</span>
          </div>
          {item.description && (
            <p className="text-body-small text-gray-600 line-clamp-2">{item.description}</p>
          )}
        </div>

        {/* 재고 현황 */}
        <div className="space-y-2">
          <div className="flex justify-between text-body-small">
            <span className="text-gray-600">재고 현황</span>
            <span className="text-gray-900">
              {item.currentStock} / {item.maxStock}개
            </span>
          </div>
          <Progress value={stockPercentage} className="h-2" />
          <div className="flex justify-between text-caption text-gray-500">
            <span>최소: {item.minStock}개</span>
            <span>발주점: {item.reorderPoint}개</span>
          </div>
        </div>

        {/* 가격 정보 */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-body-small text-gray-600">판매가격</span>
            <span className="text-body text-gray-900">
              {item.price.toLocaleString()}원
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-body-small text-gray-600">원가</span>
            <span className="text-body-small text-gray-600">
              {item.cost.toLocaleString()}원
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-body-small text-gray-600">재고 가치</span>
            <span className="text-body text-primary-blue">
              {(item.currentStock * item.price).toLocaleString()}원
            </span>
          </div>
        </div>

        {/* 태그들 */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
            {item.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{item.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* 마지막 업데이트 */}
        <div className="text-caption text-gray-500">
          마지막 업데이트: {item.lastUpdated.toLocaleDateString()}
        </div>

        <Separator />

        {/* 빠른 조정 버튼 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <InteractiveButton
              variant="secondary"
              size="sm"
              onClick={() => onAdjustStock(item.id, -1)}
              disabled={item.currentStock === 0}
              className="p-2"
            >
              <Minus className="w-4 h-4" />
            </InteractiveButton>
            <span className="px-3 py-1 text-body-small bg-gray-100 rounded min-w-12 text-center">
              {item.currentStock}
            </span>
            <InteractiveButton
              variant="secondary"
              size="sm"
              onClick={() => onAdjustStock(item.id, 1)}
              disabled={item.currentStock >= item.maxStock}
              className="p-2"
            >
              <Plus className="w-4 h-4" />
            </InteractiveButton>
          </div>

          <div className="flex gap-1">
            <InteractiveButton
              variant="ghost"
              size="sm"
              onClick={onViewDetail}
              className="p-2"
            >
              <Eye className="w-4 h-4" />
            </InteractiveButton>
            <InteractiveButton
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="p-2"
            >
              <Edit className="w-4 h-4" />
            </InteractiveButton>
          </div>
        </div>

        {/* 가용성 표시 */}
        {!item.isAvailable && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-center">
            <span className="text-body-small text-red-700">판매 중지됨</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// 리스트 뷰 컴포넌트
function InventoryListView({ 
  items, 
  selectedItems,
  onSelect,
  onViewDetail, 
  onEdit, 
  onDelete, 
  onAdjustStock,
  getStockStatus
}: {
  items: Inventory[];
  selectedItems: string[];
  onSelect: (itemId: string, checked: boolean) => void;
  onViewDetail: (item: Inventory) => void;
  onEdit: (item: Inventory) => void;
  onDelete: (itemId: string) => void;
  onAdjustStock: (itemId: string, adjustment: number) => void;
  getStockStatus: (item: Inventory) => StockStatus;
}) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">
                  <Checkbox
                    checked={selectedItems.length === items.length && items.length > 0}
                    onCheckedChange={(checked) => {
                      items.forEach(item => onSelect(item.id, checked as boolean));
                    }}
                  />
                </th>
                <th className="p-4 text-left text-body-small text-gray-600">상품</th>
                <th className="p-4 text-left text-body-small text-gray-600">카테고리</th>
                <th className="p-4 text-left text-body-small text-gray-600">SKU</th>
                <th className="p-4 text-left text-body-small text-gray-600">재고</th>
                <th className="p-4 text-left text-body-small text-gray-600">상태</th>
                <th className="p-4 text-left text-body-small text-gray-600">가격</th>
                <th className="p-4 text-left text-body-small text-gray-600">가치</th>
                <th className="p-4 text-left text-body-small text-gray-600">액션</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const status = getStockStatus(item);
                const isSelected = selectedItems.includes(item.id);
                
                return (
                  <tr key={item.id} className={`border-t hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}>
                    <td className="p-4">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => onSelect(item.id, checked as boolean)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          {item.images.length > 0 ? (
                            <img 
                              src={item.images[0]} 
                              alt={item.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <ImageIcon className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-body text-gray-900">{item.name}</p>
                          {item.description && (
                            <p className="text-body-small text-gray-500 line-clamp-1">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">{item.category}</Badge>
                    </td>
                    <td className="p-4 text-body-small text-gray-600">{item.sku}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-body text-gray-900">{item.currentStock}</span>
                        <span className="text-body-small text-gray-500">/ {item.maxStock}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={`${stockStatusColors[status]} text-white`}>
                        {stockStatusTexts[status]}
                      </Badge>
                    </td>
                    <td className="p-4 text-body text-gray-900">
                      {item.price.toLocaleString()}원
                    </td>
                    <td className="p-4 text-body text-primary-blue">
                      {(item.currentStock * item.price).toLocaleString()}원
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <InteractiveButton
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewDetail(item)}
                          className="p-2"
                        >
                          <Eye className="w-4 h-4" />
                        </InteractiveButton>
                        <InteractiveButton
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(item)}
                          className="p-2"
                        >
                          <Edit className="w-4 h-4" />
                        </InteractiveButton>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <InteractiveButton variant="ghost" size="sm" className="p-2">
                              <MoreVertical className="w-4 h-4" />
                            </InteractiveButton>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onAdjustStock(item.id, 1)}>
                              <Plus className="w-4 h-4 mr-2" />
                              재고 증가
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onAdjustStock(item.id, -1)}>
                              <Minus className="w-4 h-4 mr-2" />
                              재고 감소
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => onDelete(item.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              삭제
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// 빈 상태 컴포넌트
function EmptyInventoryState({ filter, searchTerm }: { filter: StockStatus | 'all'; searchTerm: string }) {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-heading-4 text-gray-600 mb-2">
          {searchTerm ? '검색 결과가 없습니다' : '재고가 없습니다'}
        </p>
        <p className="text-body text-gray-500">
          {searchTerm 
            ? '다른 검색어를 시도해보세요.' 
            : filter === 'all' 
              ? '새로운 상품을 추가해보세요.'
              : `${stockStatusTexts[filter as StockStatus]} 상품이 없습니다.`
          }
        </p>
      </CardContent>
    </Card>
  );
}

// 모달 컴포넌트들을 위한 래퍼
function InventoryModals({ 
  selectedItem,
  isDetailModalOpen,
  isEditModalOpen,
  isAddModalOpen,
  onCloseDetailModal,
  onCloseEditModal,
  onCloseAddModal,
  onSaveEdit,
  onSaveAdd
}: {
  selectedItem: Inventory | null;
  isDetailModalOpen: boolean;
  isEditModalOpen: boolean;
  isAddModalOpen: boolean;
  onCloseDetailModal: () => void;
  onCloseEditModal: () => void;
  onCloseAddModal: () => void;
  onSaveEdit: (updates: Partial<Inventory>) => void;
  onSaveAdd: (item: Omit<Inventory, 'id' | 'lastUpdated'>) => void;
}) {
  return (
    <>
      {/* 상세 모달 */}
      <InteractiveModal
        isOpen={isDetailModalOpen}
        onClose={onCloseDetailModal}
        title="재고 상세 정보"
        size="lg"
      >
        {selectedItem && <InventoryDetailModal item={selectedItem} />}
      </InteractiveModal>

      {/* 편집 모달 */}
      <InteractiveModal
        isOpen={isEditModalOpen}
        onClose={onCloseEditModal}
        title="재고 편집"
        size="md"
      >
        {selectedItem && (
          <InventoryEditModal
            item={selectedItem}
            onSave={onSaveEdit}
            onClose={onCloseEditModal}
          />
        )}
      </InteractiveModal>

      {/* 추가 모달 */}
      <InteractiveModal
        isOpen={isAddModalOpen}
        onClose={onCloseAddModal}
        title="새 상품 추가"
        size="md"
      >
        <InventoryAddModal
          onSave={onSaveAdd}
          onClose={onCloseAddModal}
        />
      </InteractiveModal>
    </>
  );
}

// 재고 상세 모달
function InventoryDetailModal({ item }: { item: Inventory }) {
  return (
    <div className="space-y-6">
      {/* 기본 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-heading-3 text-gray-900">{item.name}</h3>
            <p className="text-body text-gray-600">{item.category}</p>
          </div>
          
          {item.description && (
            <div>
              <h4 className="text-heading-4 text-gray-900 mb-2">설명</h4>
              <p className="text-body text-gray-700">{item.description}</p>
            </div>
          )}

          <div>
            <h4 className="text-heading-4 text-gray-900 mb-2">SKU 정보</h4>
            <p className="text-body text-gray-700">{item.sku}</p>
            {item.barcode && (
              <p className="text-body-small text-gray-600">바코드: {item.barcode}</p>
            )}
          </div>
        </div>

        {/* 이미지 */}
        <div>
          <h4 className="text-heading-4 text-gray-900 mb-2">상품 이미지</h4>
          {item.images.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {item.images.map((image, index) => (
                <img 
                  key={index}
                  src={image} 
                  alt={`${item.name} ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>
          ) : (
            <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
      </div>

      {/* 재고 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-body">현재 재고</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-heading-2 text-primary-blue">{item.currentStock}</p>
            <p className="text-body-small text-gray-600">최대: {item.maxStock}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-body">재고 기준</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-body-small">
                <span>최소 재고:</span>
                <span>{item.minStock}</span>
              </div>
              <div className="flex justify-between text-body-small">
                <span>발주점:</span>
                <span>{item.reorderPoint}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-body">가격 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-body-small">
                <span>판매가:</span>
                <span>{item.price.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-body-small">
                <span>원가:</span>
                <span>{item.cost.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-body font-medium">
                <span>마진:</span>
                <span className="text-green-600">
                  {(((item.price - item.cost) / item.price) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 추가 정보 */}
      {(item.tags.length > 0 || item.nutritionInfo || item.supplier) && (
        <div className="space-y-4">
          {item.tags.length > 0 && (
            <div>
              <h4 className="text-heading-4 text-gray-900 mb-2">태그</h4>
              <div className="flex flex-wrap gap-2">
                {item.tags.map(tag => (
                  <Badge key={tag} variant="outline">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {item.supplier && (
            <div>
              <h4 className="text-heading-4 text-gray-900 mb-2">공급업체</h4>
              <p className="text-body text-gray-700">{item.supplier}</p>
            </div>
          )}

          {item.nutritionInfo && (
            <div>
              <h4 className="text-heading-4 text-gray-900 mb-2">영양 정보</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-heading-4 text-gray-900">{item.nutritionInfo.calories}</p>
                  <p className="text-body-small text-gray-600">칼로리</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-heading-4 text-gray-900">{item.nutritionInfo.protein}g</p>
                  <p className="text-body-small text-gray-600">단백질</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-heading-4 text-gray-900">{item.nutritionInfo.carbs}g</p>
                  <p className="text-body-small text-gray-600">탄수화물</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-heading-4 text-gray-900">{item.nutritionInfo.fat}g</p>
                  <p className="text-body-small text-gray-600">지방</p>
                </div>
              </div>
              {item.nutritionInfo.allergens.length > 0 && (
                <div className="mt-4">
                  <p className="text-body-small text-gray-600 mb-2">알레르기 정보:</p>
                  <div className="flex flex-wrap gap-1">
                    {item.nutritionInfo.allergens.map(allergen => (
                      <Badge key={allergen} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        {allergen}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// 재고 편집 모달
function InventoryEditModal({ 
  item, 
  onSave, 
  onClose 
}: {
  item: Inventory;
  onSave: (updates: Partial<Inventory>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: item.name,
    category: item.category,
    description: item.description || '',
    currentStock: item.currentStock,
    minStock: item.minStock,
    maxStock: item.maxStock,
    reorderPoint: item.reorderPoint,
    price: item.price,
    cost: item.cost,
    isAvailable: item.isAvailable,
    supplier: item.supplier || '',
    tags: item.tags.join(', ')
  });

  const handleSave = () => {
    onSave({
      ...formData,
      description: formData.description || undefined,
      supplier: formData.supplier || undefined,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-label text-gray-700 mb-2 block">상품명 *</label>
          <InteractiveInput
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div>
          <label className="text-label text-gray-700 mb-2 block">카테고리 *</label>
          <InteractiveInput
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-label text-gray-700 mb-2 block">설명</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg text-body"
            rows={3}
          />
        </div>

        <div>
          <label className="text-label text-gray-700 mb-2 block">현재 재고 *</label>
          <InteractiveInput
            type="number"
            value={formData.currentStock}
            onChange={(e) => setFormData({...formData, currentStock: Number(e.target.value)})}
            min={0}
          />
        </div>

        <div>
          <label className="text-label text-gray-700 mb-2 block">최대 재고 *</label>
          <InteractiveInput
            type="number"
            value={formData.maxStock}
            onChange={(e) => setFormData({...formData, maxStock: Number(e.target.value)})}
            min={1}
          />
        </div>

        <div>
          <label className="text-label text-gray-700 mb-2 block">최소 재고 *</label>
          <InteractiveInput
            type="number"
            value={formData.minStock}
            onChange={(e) => setFormData({...formData, minStock: Number(e.target.value)})}
            min={0}
          />
        </div>

        <div>
          <label className="text-label text-gray-700 mb-2 block">발주점 *</label>
          <InteractiveInput
            type="number"
            value={formData.reorderPoint}
            onChange={(e) => setFormData({...formData, reorderPoint: Number(e.target.value)})}
            min={0}
          />
        </div>

        <div>
          <label className="text-label text-gray-700 mb-2 block">판매가격 (원) *</label>
          <InteractiveInput
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
            min={0}
          />
        </div>

        <div>
          <label className="text-label text-gray-700 mb-2 block">원가 (원) *</label>
          <InteractiveInput
            type="number"
            value={formData.cost}
            onChange={(e) => setFormData({...formData, cost: Number(e.target.value)})}
            min={0}
          />
        </div>

        <div>
          <label className="text-label text-gray-700 mb-2 block">공급업체</label>
          <InteractiveInput
            type="text"
            value={formData.supplier}
            onChange={(e) => setFormData({...formData, supplier: e.target.value})}
          />
        </div>

        <div>
          <label className="text-label text-gray-700 mb-2 block">태그 (쉼표로 구분)</label>
          <InteractiveInput
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({...formData, tags: e.target.value})}
            placeholder="인기, 추천, 신상품"
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            checked={formData.isAvailable}
            onCheckedChange={(checked) => setFormData({...formData, isAvailable: checked as boolean})}
          />
          <label className="text-label text-gray-700">판매 가능</label>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <InteractiveButton
          variant="secondary"
          onClick={onClose}
          className="flex-1"
        >
          취소
        </InteractiveButton>
        <InteractiveButton
          variant="primary"
          onClick={handleSave}
          className="flex-1"
        >
          저장
        </InteractiveButton>
      </div>
    </div>
  );
}

// 재고 추가 모달
function InventoryAddModal({ 
  onSave, 
  onClose 
}: {
  onSave: (item: Omit<Inventory, 'id' | 'lastUpdated'>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    sku: '',
    currentStock: 0,
    minStock: 10,
    maxStock: 100,
    reorderPoint: 15,
    price: 0,
    cost: 0,
    isAvailable: true,
    supplier: '',
    barcode: '',
    images: [] as string[],
    tags: ''
  });

  const handleSave = () => {
    if (!formData.name.trim() || !formData.category.trim() || !formData.sku.trim()) return;

    onSave({
      name: formData.name.trim(),
      category: formData.category.trim(),
      description: formData.description.trim() || undefined,
      sku: formData.sku.trim(),
      currentStock: formData.currentStock,
      minStock: formData.minStock,
      maxStock: formData.maxStock,
      reorderPoint: formData.reorderPoint,
      price: formData.price,
      cost: formData.cost,
      isAvailable: formData.isAvailable,
      supplier: formData.supplier.trim() || undefined,
      barcode: formData.barcode.trim() || undefined,
      images: formData.images,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    });
  };

  const isValid = formData.name.trim() && formData.category.trim() && formData.sku.trim() && formData.price > 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-label text-gray-700 mb-2 block">상품명 *</label>
          <InteractiveInput
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="상품명을 입력하세요"
          />
        </div>

        <div>
          <label className="text-label text-gray-700 mb-2 block">카테고리 *</label>
          <InteractiveInput
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            placeholder="카테고리를 입력하세요"
          />
        </div>

        <div>
          <label className="text-label text-gray-700 mb-2 block">SKU *</label>
          <InteractiveInput
            type="text"
            value={formData.sku}
            onChange={(e) => setFormData({...formData, sku: e.target.value})}
            placeholder="SKU를 입력하세요"
          />
        </div>

        <div>
          <label className="text-label text-gray-700 mb-2 block">바코드</label>
          <InteractiveInput
            type="text"
            value={formData.barcode}
            onChange={(e) => setFormData({...formData, barcode: e.target.value})}
            placeholder="바코드를 입력하세요"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-label text-gray-700 mb-2 block">설명</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="상품 설명을 입력하세요"
            className="w-full p-3 border border-gray-300 rounded-lg text-body"
            rows={3}
          />
        </div>

        <div>
          <label className="text-label text-gray-700 mb-2 block">초기 재고</label>
          <InteractiveInput
            type="number"
            value={formData.currentStock}
            onChange={(e) => setFormData({...formData, currentStock: Number(e.target.value)})}
            min={0}
          />
        </div>

        <div>
          <label className="text-label text-gray-700 mb-2 block">최대 재고 *</label>
          <InteractiveInput
            type="number"
            value={formData.maxStock}
            onChange={(e) => setFormData({...formData, maxStock: Number(e.target.value)})}
            min={1}
          />
        </div>

        <div>
          <label className="text-label text-gray-700 mb-2 block">최소 재고</label>
          <InteractiveInput
            type="number"
            value={formData.minStock}
            onChange={(e) => setFormData({...formData, minStock: Number(e.target.value)})}
            min={0}
          />
        </div>

        <div>
          <label className="text-label text-gray-700 mb-2 block">발주점</label>
          <InteractiveInput
            type="number"
            value={formData.reorderPoint}
            onChange={(e) => setFormData({...formData, reorderPoint: Number(e.target.value)})}
            min={0}
          />
        </div>

        <div>
          <label className="text-label text-gray-700 mb-2 block">판매가격 (원) *</label>
          <InteractiveInput
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
            min={0}
            placeholder="0"
          />
        </div>

        <div>
          <label className="text-label text-gray-700 mb-2 block">원가 (원) *</label>
          <InteractiveInput
            type="number"
            value={formData.cost}
            onChange={(e) => setFormData({...formData, cost: Number(e.target.value)})}
            min={0}
            placeholder="0"
          />
        </div>

        <div>
          <label className="text-label text-gray-700 mb-2 block">공급업체</label>
          <InteractiveInput
            type="text"
            value={formData.supplier}
            onChange={(e) => setFormData({...formData, supplier: e.target.value})}
            placeholder="공급업체명"
          />
        </div>

        <div>
          <label className="text-label text-gray-700 mb-2 block">태그 (쉼표로 구분)</label>
          <InteractiveInput
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({...formData, tags: e.target.value})}
            placeholder="인기, 추천, 신상품"
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            checked={formData.isAvailable}
            onCheckedChange={(checked) => setFormData({...formData, isAvailable: checked as boolean})}
          />
          <label className="text-label text-gray-700">판매 가능</label>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <InteractiveButton
          variant="secondary"
          onClick={onClose}
          className="flex-1"
        >
          취소
        </InteractiveButton>
        <InteractiveButton
          variant="primary"
          onClick={handleSave}
          disabled={!isValid}
          className="flex-1"
        >
          추가
        </InteractiveButton>
      </div>
    </div>
  );
}