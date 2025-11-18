import React, { useState } from 'react';
import { Download, Eye, FileText, Calendar, BarChart3 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { toast } from 'sonner';

interface ReportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  period: string;
  data: any;
}

export function ReportPreviewModal({ isOpen, onClose, period, data }: ReportPreviewModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      // 실제 리포트 다운로드 로직
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('리포트가 성공적으로 다운로드되었습니다!');
      onClose();
    } catch (error) {
      toast.error('다운로드 중 오류가 발생했습니다.');
    } finally {
      setIsDownloading(false);
    }
  };

  const mockData = {
    totalMenus: 6,
    totalOrders: 164,
    totalRevenue: 879500,
    averageRating: 4.7,
    topMenus: [
      { id: 1, name: '아메리카노', category: '커피', orders: 45, revenue: 225000 },
      { id: 2, name: '카페라떼', category: '커피', orders: 32, revenue: 192000 },
      { id: 3, name: '치즈케이크', category: '디저트', orders: 28, revenue: 168000 },
      { id: 4, name: '크로와상', category: '베이커리', orders: 24, revenue: 144000 },
      { id: 5, name: '샐러드', category: '식사', orders: 20, revenue: 150000 }
    ]
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            인기 메뉴 분석 리포트 미리보기
          </DialogTitle>
          <DialogDescription>
            {period} 기간의 메뉴 분석 리포트를 미리보기하고 다운로드하세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 리포트 요약 */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">리포트 요약</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{mockData.totalMenus}</div>
                <div className="text-sm text-gray-600">총 메뉴</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{mockData.totalOrders}</div>
                <div className="text-sm text-gray-600">총 주문</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">₩{mockData.totalRevenue.toLocaleString()}</div>
                <div className="text-sm text-gray-600">총 매출</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{mockData.averageRating}</div>
                <div className="text-sm text-gray-600">평균 평점</div>
              </div>
            </div>
          </Card>

          {/* 상위 메뉴 순위 */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">상위 메뉴 순위</h3>
            <div className="space-y-3">
              {mockData.topMenus.map((menu, index) => (
                <div key={menu.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <Badge variant="outline" className="w-8 h-8 flex items-center justify-center">
                    {index + 1}
                  </Badge>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{menu.name}</div>
                    <div className="text-sm text-gray-600">{menu.category}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{menu.orders}건</div>
                    <div className="text-sm text-gray-600">₩{menu.revenue.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 차트 미리보기 */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">매출 트렌드</h3>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                <div>차트 미리보기</div>
              </div>
            </div>
          </Card>

          {/* 리포트 정보 */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">리포트 정보</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-gray-700">생성일시</div>
                <div className="text-gray-600">{new Date().toLocaleString()}</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">분석 기간</div>
                <div className="text-gray-600">{period}</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">포함 메뉴</div>
                <div className="text-gray-600">전체 메뉴</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">파일 형식</div>
                <div className="text-gray-600">PDF, Excel</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="bg-green-600 hover:bg-green-700"
          >
            <Download className="w-4 h-4 mr-2" />
            {isDownloading ? '다운로드 중...' : '리포트 다운로드'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}