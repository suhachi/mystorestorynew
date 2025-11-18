import React, { useState } from 'react';
import { DollarSign, CreditCard, Banknote, Calendar, TrendingUp, Smartphone } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';

interface SalesDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SalesDetailModal({ isOpen, onClose }: SalesDetailModalProps) {
  const [activeTab, setActiveTab] = useState('today');

  const salesData = {
    today: {
      total: 1250000,
      card: 875000,
      cash: 250000,
      mobile: 125000,
      orders: 47
    },
    week: {
      total: 8795000,
      card: 6156500,
      cash: 1759000,
      mobile: 879500,
      orders: 329
    },
    month: {
      total: 35180000,
      card: 24626000,
      cash: 7036000,
      mobile: 3518000,
      orders: 1316
    }
  };

  const renderSalesContent = (period: string, data: any) => (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">총 매출</h3>
          <Badge variant="outline" className="text-lg font-bold text-green-600">
            ₩{data.total.toLocaleString()}
          </Badge>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <CreditCard className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-sm text-gray-600">카드 결제</div>
            <div className="text-lg font-semibold text-blue-600">
              ₩{data.card.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">
              {Math.round((data.card / data.total) * 100)}%
            </div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Banknote className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-sm text-gray-600">현금 결제</div>
            <div className="text-lg font-semibold text-green-600">
              ₩{data.cash.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">
              {Math.round((data.cash / data.total) * 100)}%
            </div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Smartphone className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-sm text-gray-600">간편결제</div>
            <div className="text-lg font-semibold text-purple-600">
              ₩{data.mobile.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">
              {Math.round((data.mobile / data.total) * 100)}%
            </div>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="text-sm text-gray-600">총 주문</div>
            <div className="text-lg font-semibold text-orange-600">
              {data.orders}건
            </div>
            <div className="text-xs text-gray-500">
              평균 ₩{Math.round(data.total / data.orders).toLocaleString()}
            </div>
          </div>
        </div>
      </Card>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">결제 수단별 상세 분석</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700 font-medium">카드 결제</span>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-900">₩{data.card.toLocaleString()}</div>
              <div className="text-sm text-gray-500">{Math.round((data.card / data.total) * 100)}%</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Banknote className="w-5 h-5 text-green-600" />
              <span className="text-gray-700 font-medium">현금 결제</span>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-900">₩{data.cash.toLocaleString()}</div>
              <div className="text-sm text-gray-500">{Math.round((data.cash / data.total) * 100)}%</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-purple-600" />
              <span className="text-gray-700 font-medium">간편결제</span>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-900">₩{data.mobile.toLocaleString()}</div>
              <div className="text-sm text-gray-500">{Math.round((data.mobile / data.total) * 100)}%</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-green-600" />
            매출 상세 분석
          </DialogTitle>
          <DialogDescription>
            기간별 매출 현황과 결제 수단별 분석을 확인하세요.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="today">오늘</TabsTrigger>
            <TabsTrigger value="week">이번 주</TabsTrigger>
            <TabsTrigger value="month">이번 달</TabsTrigger>
          </TabsList>
          
          <TabsContent value="today">
            {renderSalesContent('오늘', salesData.today)}
          </TabsContent>
          
          <TabsContent value="week">
            {renderSalesContent('이번 주', salesData.week)}
          </TabsContent>
          
          <TabsContent value="month">
            {renderSalesContent('이번 달', salesData.month)}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <DollarSign className="w-4 h-4 mr-2" />
            상세 리포트 다운로드
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}