import React, { useState } from 'react';
import { 
  DollarSign, CreditCard, Banknote, Smartphone, Calendar, 
  TrendingUp, BarChart3, PieChart, Download, Filter, X
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { 
  BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { toast } from 'sonner@2.0.3';

interface TotalSalesDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TotalSalesDetailModal({ isOpen, onClose }: TotalSalesDetailModalProps) {
  const [activeTab, setActiveTab] = useState('payment');
  const [selectedPeriod, setSelectedPeriod] = useState('7days');

  // 결제 수단별 매출 데이터
  const paymentMethodData = {
    total: 1356000,
    delivery: 542400,    // 배달앱 선결제 (40%)
    card: 406800,        // 만나서 카드 (30%)
    cash: 271200,        // 만나서 현금 (20%)
    mobile: 135600       // 간편결제 (10%)
  };

  // 기간별 매출 데이터
  const periodData = {
    total: 1356000,
    week: 9482000,       // 7일
    month: 40680000,     // 1달
    custom: 1356000     // 기간 설정
  };

  // 결제 수단별 차트 데이터
  const paymentChartData = [
    { name: '배달앱 선결제', value: paymentMethodData.delivery, color: '#3B82F6' },
    { name: '만나서 카드', value: paymentMethodData.card, color: '#10B981' },
    { name: '만나서 현금', value: paymentMethodData.cash, color: '#F59E0B' },
    { name: '간편결제', value: paymentMethodData.mobile, color: '#8B5CF6' }
  ];

  // 기간별 매출 차트 데이터
  const periodChartData = [
    { period: '총 매출', amount: periodData.total, percentage: 100 },
    { period: '7일 매출', amount: periodData.week, percentage: 100 },
    { period: '1달 매출', amount: periodData.month, percentage: 100 },
    { period: '기간 설정', amount: periodData.custom, percentage: 100 }
  ];

  const handleDownloadReport = () => {
    toast.success('총 매출 상세 리포트가 다운로드됩니다!');
    console.log('📊 총 매출 리포트 다운로드');
  };

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    toast.success(`${period} 기간으로 변경되었습니다!`);
    console.log(`📅 기간 변경: ${period}`);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-green-600" />
            총 매출 상세 분석
          </DialogTitle>
          <DialogDescription>
            결제 수단별 및 기간별 매출 분석을 확인하세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 기간 선택 */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">분석 기간</h3>
              <div className="flex gap-2">
                <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">최근 7일</SelectItem>
                    <SelectItem value="30days">최근 30일</SelectItem>
                    <SelectItem value="3months">최근 3개월</SelectItem>
                    <SelectItem value="year">연간</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  기간 설정
                </Button>
              </div>
            </div>
          </Card>

          {/* 탭 메뉴 */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="payment">결제 수단별 분석</TabsTrigger>
              <TabsTrigger value="period">기간별 분석</TabsTrigger>
            </TabsList>

            {/* 결제 수단별 분석 탭 */}
            <TabsContent value="payment" className="space-y-4">
              {/* 결제 수단별 요약 */}
              <Card className="p-6">
                <h3 className="text-heading-3 text-gray-900 mb-4">결제 수단별 매출 요약</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Smartphone className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-body-small text-gray-600">배달앱 선결제</div>
                    <div className="text-heading-4 text-blue-600">
                      ₩{paymentMethodData.delivery.toLocaleString()}
                    </div>
                    <div className="text-caption text-gray-500">40%</div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CreditCard className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-body-small text-gray-600">만나서 카드</div>
                    <div className="text-heading-4 text-green-600">
                      ₩{paymentMethodData.card.toLocaleString()}
                    </div>
                    <div className="text-caption text-gray-500">30%</div>
                  </div>
                  
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <Banknote className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <div className="text-body-small text-gray-600">만나서 현금</div>
                    <div className="text-heading-4 text-yellow-600">
                      ₩{paymentMethodData.cash.toLocaleString()}
                    </div>
                    <div className="text-caption text-gray-500">20%</div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Smartphone className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-body-small text-gray-600">간편결제</div>
                    <div className="text-heading-4 text-purple-600">
                      ₩{paymentMethodData.mobile.toLocaleString()}
                    </div>
                    <div className="text-caption text-gray-500">10%</div>
                  </div>
                </div>
              </Card>

              {/* 결제 수단별 차트 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-heading-3 text-gray-900 mb-4">결제 수단별 비율</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={paymentChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {paymentChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`₩${value.toLocaleString()}`, '매출']} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="p-6">
                  <h3 className="text-heading-3 text-gray-900 mb-4">결제 수단별 매출</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsBarChart data={paymentChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₩${value.toLocaleString()}`, '매출']} />
                      <Bar dataKey="value" fill="#3B82F6" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              {/* 결제 수단별 상세 분석 */}
              <Card className="p-6">
                <h3 className="text-heading-3 text-gray-900 mb-4">결제 수단별 상세 분석</h3>
                <div className="space-y-3">
                  {paymentChartData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-gray-700 font-medium">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">₩{item.value.toLocaleString()}</div>
                        <div className="text-body-small text-gray-500">
                          {Math.round((item.value / paymentMethodData.total) * 100)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* 기간별 분석 탭 */}
            <TabsContent value="period" className="space-y-4">
              {/* 기간별 요약 */}
              <Card className="p-6">
                <h3 className="text-heading-3 text-gray-900 mb-4">기간별 매출 요약</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-body-small text-gray-600">총 매출</div>
                    <div className="text-heading-4 text-green-600">
                      ₩{periodData.total.toLocaleString()}
                    </div>
                    <div className="text-caption text-gray-500">현재</div>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-body-small text-gray-600">7일 매출</div>
                    <div className="text-heading-4 text-blue-600">
                      ₩{periodData.week.toLocaleString()}
                    </div>
                    <div className="text-caption text-gray-500">주간</div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-body-small text-gray-600">1달 매출</div>
                    <div className="text-heading-4 text-purple-600">
                      ₩{periodData.month.toLocaleString()}
                    </div>
                    <div className="text-caption text-gray-500">월간</div>
                  </div>
                  
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <BarChart3 className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <div className="text-body-small text-gray-600">기간 설정</div>
                    <div className="text-heading-4 text-orange-600">
                      ₩{periodData.custom.toLocaleString()}
                    </div>
                    <div className="text-caption text-gray-500">사용자 설정</div>
                  </div>
                </div>
              </Card>

              {/* 기간별 차트 */}
              <Card className="p-6">
                <h3 className="text-heading-3 text-gray-900 mb-4">기간별 매출 트렌드</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={periodChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₩${value.toLocaleString()}`, '매출']} />
                    <Bar dataKey="amount" fill="#10B981" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </Card>

              {/* 기간별 상세 분석 */}
              <Card className="p-6">
                <h3 className="text-heading-3 text-gray-900 mb-4">기간별 상세 분석</h3>
                <div className="space-y-3">
                  {periodChartData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700 font-medium">{item.period}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">₩{item.amount.toLocaleString()}</div>
                        <div className="text-body-small text-gray-500">{item.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
          <Button onClick={handleDownloadReport} className="bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" />
            리포트 다운로드
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}