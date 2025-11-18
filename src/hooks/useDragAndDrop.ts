import { useState, useCallback } from 'react';

export interface FeatureCard {
  id: string;
  type: 'default' | 'plan-specific' | 'coming-soon';
  category: 'auth' | 'dashboard' | 'menu' | 'order' | 'customer' | 'analytics' | 'settings' | 'points';
  name: string;
  description: string;
  icon: string;
  requiredPlan: 'Basic' | 'Pro' | 'Enterprise';
  isDefault: boolean; // 로그인/회원가입은 항상 true
  isEnabled: boolean;
  config?: any;
  features?: string[];
}

export interface CanvasItem {
  id: string;
  card: FeatureCard;
  position: { x: number; y: number };
  config: any;
  isActive: boolean;
}

export interface DragState {
  isDragging: boolean;
  draggedCard: FeatureCard | null;
  dropTarget: string | null;
}

export function useDragAndDrop() {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedCard: null,
    dropTarget: null
  });
  
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);

  // 드래그 시작
  const handleDragStart = useCallback((card: FeatureCard, event: React.DragEvent) => {
    setDragState({
      isDragging: true,
      draggedCard: card,
      dropTarget: null
    });
    
    // 드래그 데이터 설정
    event.dataTransfer.setData('application/json', JSON.stringify(card));
    event.dataTransfer.effectAllowed = 'copy';
    
    console.log('🎯 드래그 시작:', card.name);
  }, []);

  // 드래그 오버
  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }, []);

  // 드래그 엔터
  const handleDragEnter = useCallback((targetId: string, event: React.DragEvent) => {
    event.preventDefault();
    setDragState(prev => ({
      ...prev,
      dropTarget: targetId
    }));
  }, []);

  // 드래그 리브
  const handleDragLeave = useCallback((event: React.DragEvent) => {
    // 실제로 영역을 벗어났는지 체크
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;
    
    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setDragState(prev => ({
        ...prev,
        dropTarget: null
      }));
    }
  }, []);

  // 드롭
  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    
    try {
      const cardData = event.dataTransfer.getData('application/json');
      if (!cardData) return;
      
      const card: FeatureCard = JSON.parse(cardData);
      
      // 이미 추가된 카드인지 체크
      const existingItem = canvasItems.find(item => item.card.id === card.id);
      if (existingItem) {
        console.log('⚠️ 이미 추가된 카드:', card.name);
        return;
      }
      
      // 캔버스 위치 계산
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // 새 캔버스 아이템 생성
      const newItem: CanvasItem = {
        id: `${card.id}-${Date.now()}`,
        card,
        position: { x, y },
        config: {},
        isActive: true
      };
      
      setCanvasItems(prev => [...prev, newItem]);
      console.log('✅ 카드 추가됨:', card.name, `위치: (${x}, ${y})`);
      
    } catch (error) {
      console.error('❌ 드롭 처리 실패:', error);
    } finally {
      // 드래그 상태 리셋
      setDragState({
        isDragging: false,
        draggedCard: null,
        dropTarget: null
      });
    }
  }, [canvasItems]);

  // 드래그 종료
  const handleDragEnd = useCallback(() => {
    setDragState({
      isDragging: false,
      draggedCard: null,
      dropTarget: null
    });
  }, []);

  // 캔버스 아이템 제거
  const removeCanvasItem = useCallback((itemId: string) => {
    setCanvasItems(prev => prev.filter(item => item.id !== itemId));
    console.log('🗑️ 아이템 제거됨:', itemId);
  }, []);

  // 캔버스 아이템 활성/비활성 토글
  const toggleCanvasItem = useCallback((itemId: string) => {
    setCanvasItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, isActive: !item.isActive }
        : item
    ));
  }, []);

  // 캔버스 아이템 위치 업데이트
  const updateCanvasItemPosition = useCallback((itemId: string, position: { x: number; y: number }) => {
    setCanvasItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, position }
        : item
    ));
  }, []);

  // 캔버스 초기화
  const clearCanvas = useCallback(() => {
    setCanvasItems([]);
    console.log('🧹 캔버스 초기화됨');
  }, []);

  return {
    // 상태
    dragState,
    canvasItems,
    
    // 드래그앤드롭 핸들러들
    handleDragStart,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    
    // 캔버스 관리 함수들
    removeCanvasItem,
    toggleCanvasItem,
    updateCanvasItemPosition,
    clearCanvas,
    setCanvasItems
  };
}