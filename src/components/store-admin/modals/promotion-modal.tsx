import React, { useState } from 'react';
import { Target, Calendar, Percent, DollarSign, Users, Clock, Gift, Tag, Zap } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';
import { toast } from 'sonner@2.0.3';

interface PromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  menu: any;
}

export function PromotionModal({ isOpen, onClose, menu }: PromotionModalProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [promotionData, setPromotionData] = useState({
    type: 'discount', // 'discount', 'bogo', 'combo'
    discountType: 'percentage', // 'percentage', 'fixed'
    discountValue: '10',
    startDate: '',
    endDate: '',
    targetCustomers: 'all', // 'all', 'new', 'vip'
    minOrderAmount: '',
    maxUses: '100',
    description: ''
  });

  const handleInputChange = (field: string, value: any) => {
    setPromotionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreatePromotion = async () => {
    // 필수 필드 검증
    if (!promotionData.startDate || !promotionData.endDate) {
      toast.error('시작일과 종료일을 모두 입력해주세요.');
      return;
    }

    if (!promotionData.discountValue || parseInt(promotionData.discountValue) <= 0) {
      toast.error('올바른 할인 값을 입력해주세요.');
      return;
    }

    setIsCreating(true);

    try {
      // 프로모션 생성 API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const promotionType = promotionData.type === 'discount' ? '할인' :
                          promotionData.type === 'bogo' ? '1+1' : '세트 할인';
      
      toast.success(`${menu.name} ${promotionType} 프로모션이 성공적으로 생성되었습니다! 🎉`);
      
      console.log('🎯 프로모션 생성:', {
        menu: menu.name,
        ...promotionData
      });
      
      onClose();
    } catch (error) {
      toast.error('프로모션 생성 중 오류가 발생했습니다.');
    } finally {
      setIsCreating(false);
    }
  };

  const getPromotionPreview = () => {
    if (promotionData.type === 'discount') {
      const discountText = promotionData.discountType === 'percentage' 
        ? `${promotionData.discountValue}% 할인`
        : `₩${parseInt(promotionData.discountValue || '0').toLocaleString()} 할인`;
      
      return `${menu.name} ${discountText}`;
    } else if (promotionData.type === 'bogo') {
      return `${menu.name} 1+1 이벤트`;
    } else {
      return `${menu.name} 세트 할인`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-heading-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <span>프로모션 설정</span>
              <p className="text-body text-gray-600 font-normal mt-1">{menu?.name}</p>
            </div>
          </DialogTitle>
          <DialogDescription>
            {menu?.name}에 대한 프로모션을 설정하여 매출을 증대시키세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 프로모션 미리보기 */}
          <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-white shadow-sm flex items-center justify-center text-2xl">
                {menu?.image || '🍽️'}
              </div>
              <div>
                <h4 className="text-heading-4 text-gray-900 mb-1">프로모션 미리보기</h4>
                <p className="text-body text-purple-700 font-medium">{getPromotionPreview()}</p>
                <p className="text-body-small text-gray-600 mt-1">고객에게 이렇게 표시됩니다</p>
              </div>
            </div>
          </Card>

          {/* 프로모션 타입 선택 */}
          <Card className="p-4">
            <Label className="text-body font-medium text-gray-900 mb-3 block">
              프로모션 타입 선택
            </Label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleInputChange('type', 'discount')}
                className={`p-4 border rounded-lg text-center transition-all ${
                  promotionData.type === 'discount' 
                    ? 'border-purple-500 bg-purple-50 shadow-sm' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Percent className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <div className="text-body-small font-medium text-gray-900">할인</div>
                <div className="text-caption text-gray-600">가격 할인</div>
              </button>
              <button
                type="button"
                onClick={() => handleInputChange('type', 'bogo')}
                className={`p-4 border rounded-lg text-center transition-all ${
                  promotionData.type === 'bogo' 
                    ? 'border-green-500 bg-green-50 shadow-sm' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Gift className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <div className="text-body-small font-medium text-gray-900">1+1</div>
                <div className="text-caption text-gray-600">하나 더</div>
              </button>
              <button
                type="button"
                onClick={() => handleInputChange('type', 'combo')}
                className={`p-4 border rounded-lg text-center transition-all ${
                  promotionData.type === 'combo' 
                    ? 'border-blue-500 bg-blue-50 shadow-sm' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Tag className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <div className="text-body-small font-medium text-gray-900">세트</div>
                <div className="text-caption text-gray-600">조합 할인</div>
              </button>
            </div>
          </Card>

          {/* 할인 설정 (할인 타입일 때만 표시) */}
          {promotionData.type === 'discount' && (
            <Card className="p-4">
              <h4 className="text-body font-medium text-gray-900 mb-4">할인 설정</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discountType" className="text-body-small text-gray-700 mb-2 block">
                    할인 유형
                  </Label>
                  <Select 
                    value={promotionData.discountType} 
                    onValueChange={(value) => handleInputChange('discountType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">퍼센트 할인 (%)</SelectItem>
                      <SelectItem value="fixed">고정 금액 할인 (원)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="discountValue" className="text-body-small text-gray-700 mb-2 block">
                    할인 값
                  </Label>
                  <div className="relative">
                    {promotionData.discountType === 'percentage' ? (
                      <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    ) : (
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    )}
                    <Input
                      id="discountValue"
                      type="number"
                      value={promotionData.discountValue}
                      onChange={(e) => handleInputChange('discountValue', e.target.value)}
                      placeholder={promotionData.discountType === 'percentage' ? '10' : '1000'}
                      className="pl-10"
                    />
                  </div>
                  {promotionData.discountType === 'percentage' && (
                    <p className="text-caption text-gray-500 mt-1">1-100 사이의 값을 입력하세요</p>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* 프로모션 기간 */}
          <Card className="p-4">
            <h4 className="text-body font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary-blue" />
              프로모션 기간
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate" className="text-body-small text-gray-700 mb-2 block">
                  시작일시
                </Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={promotionData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endDate" className="text-body-small text-gray-700 mb-2 block">
                  종료일시
                </Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={promotionData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* 대상 고객 및 조건 설정 */}
          <Card className="p-4">
            <h4 className="text-body font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary-blue" />
              대상 고객 및 조건
            </h4>
            <div className="space-y-4">
              <div>
                <Label htmlFor="targetCustomers" className="text-body-small text-gray-700 mb-2 block">
                  대상 고객
                </Label>
                <Select 
                  value={promotionData.targetCustomers} 
                  onValueChange={(value) => handleInputChange('targetCustomers', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 고객</SelectItem>
                    <SelectItem value="new">신규 고객 (첫 주문)</SelectItem>
                    <SelectItem value="vip">VIP 고객 (10회 이상 주문)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="minOrderAmount" className="text-body-small text-gray-700 mb-2 block">
                  최소 주문 금액 (원)
                </Label>
                <Input
                  id="minOrderAmount"
                  type="number"
                  value={promotionData.minOrderAmount}
                  onChange={(e) => handleInputChange('minOrderAmount', e.target.value)}
                  placeholder="0 (제한 없음)"
                />
                <p className="text-caption text-gray-500 mt-1">0원 입력 시 제한 없음</p>
              </div>
              
              <div>
                <Label htmlFor="maxUses" className="text-body-small text-gray-700 mb-2 block">
                  최대 사용 횟수 (고객당)
                </Label>
                <Input
                  id="maxUses"
                  type="number"
                  value={promotionData.maxUses}
                  onChange={(e) => handleInputChange('maxUses', e.target.value)}
                  placeholder="100"
                />
                <p className="text-caption text-gray-500 mt-1">고객 1명이 최대 몇 번까지 사용할 수 있는지</p>
              </div>
            </div>
          </Card>

          {/* 프로모션 설명 */}
          <Card className="p-4">
            <Label htmlFor="description" className="text-body font-medium text-gray-900 mb-3 block">
              프로모션 설명 (선택사항)
            </Label>
            <textarea
              id="description"
              value={promotionData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="고객에게 표시될 프로모션 설명을 입력하세요 (예: 오늘만 특가! 놓치면 후회하는 할인)"
              rows={3}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent resize-none text-body-small"
            />
            <p className="text-caption text-gray-500 mt-2">
              고객 앱에서 이 설명이 프로모션과 함께 표시됩니다
            </p>
          </Card>

          {/* 프로모션 효과 예상 */}
          <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <h4 className="text-body font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" />
              예상 효과
            </h4>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-white rounded-lg border">
                <p className="text-body-small text-gray-600 mb-1">예상 주문 증가</p>
                <p className="text-heading-4 text-success-green">
                  {promotionData.type === 'discount' ? '+25%' : 
                   promotionData.type === 'bogo' ? '+40%' : '+35%'}
                </p>
              </div>
              <div className="p-3 bg-white rounded-lg border">
                <p className="text-body-small text-gray-600 mb-1">예상 신규 고객</p>
                <p className="text-heading-4 text-blue-600">
                  {promotionData.type === 'discount' ? '+15명' : 
                   promotionData.type === 'bogo' ? '+20명' : '+18명'}
                </p>
              </div>
            </div>
            <p className="text-caption text-gray-600 mt-3 text-center">
              ※ 과거 유사 프로모션 데이터를 기준으로 한 예상치입니다
            </p>
          </Card>
        </div>

        <Separator />

        <div className="flex justify-between items-center">
          <div className="text-body-small text-gray-600">
            프로모션 생성 후 즉시 활성화됩니다
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} disabled={isCreating}>
              취소
            </Button>
            <Button 
              onClick={handleCreatePromotion}
              className="bg-purple-600 hover:bg-purple-700"
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  생성 중...
                </>
              ) : (
                <>
                  <Target className="w-4 h-4 mr-2" />
                  프로모션 생성
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}