import React, { useState } from 'react';
import { 
  Target, TrendingUp, TrendingDown, Calendar, BarChart3, 
  Filter, Download, DollarSign, Users, ShoppingCart, Clock
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { 
  BarChart as RechartsBarChart, Bar, LineChart as RechartsLineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { toast } from 'sonner@2.0.3';

interface AverageOrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AverageOrderDetailModal({ isOpen, onClose }: AverageOrderDetailModalProps) {
  const [activeTab, setActiveTab] = useState('daily');
  const [selectedPeriod, setSelectedPeriod] = useState('7days');

  // 하루 평균 매출 데이터
  const dailyData = {
    today: 6054,
    yesterday: 5820,
    weekAvg: 6054,
    monthAvg: 5890,
    growth: 4.0
  };

  // 일주일 평균 주문금액 데이터
  const weeklyData = [
    { day: '월', avgOrder: 6000, orders: 28, revenue: 168000 },
    { day: '화', avgOrder: 6000, orders: 32, revenue: 192000 },
    { day: '수', avgOrder: 6000, orders: 25, revenue: 150000 },
    { day: '목', avgOrder: 6000, orders: 38, revenue: 228000 },
    { day: '금', avgOrder: 6000, orders: 42, revenue: 252000 },
    { day: '토', avgOrder: 6000, orders: 35, revenue: 210000 },
    { day: '일', avgOrder: 6000, orders: 24, revenue: 144000 }
  ];

  // 1달 평균 주문금액 데이터
  const monthlyData = [
    { week: '1주차', avgOrder: 5800, orders: 180, revenue: 1044000 },
    { week: '2주차', avgOrder: 5950, orders: 195, revenue: 1160250 },
    { week: '3주차', avgOrder: 6100, orders: 210, revenue: 1281000 },
    { week: '4주차', avgOrder: 6054, orders: 224, revenue: 1356000 }
  ];

  // 기간 설정 평균 주문금액 데이터
  const customPeriodData = [
    { period: '최근 7일', avgOrder: 6054, orders: 224, revenue: 1356000 },
    { period: '최근 30일', avgOrder: 5890, orders: 950, revenue: 5595500 },
    { period: '최근 3개월', avgOrder: 5750, orders: 2800, revenue: 16100000 },
    { period: '연간', avgOrder: 5620, orders: 11200, revenue: 62944000 }
  ];

  // 시간대별 평균 주문금액 데이터
  const hourlyAvgData = [
    { hour: '07:00', avgOrder: 5500, orders: 3 },
    { hour: '08:00', avgOrder: 5800, orders: 6 },
    { hour: '09:00', avgOrder: 6000, orders: 8 },
    { hour: '10:00', avgOrder: 6200, orders: 7 },
    { hour: '11:00', avgOrder: 6100, orders: 9 },
    { hour: '12:00', avgOrder: 6500, orders: 15 },
    { hour: '13:00', avgOrder: 6400, orders: 12 },
    { hour: '14:00', avgOrder: 6300, orders: 10 },
    { hour: '15:00', avgOrder: 6200, orders: 11 },
    { hour: '16:00', avgOrder: 6100, orders: 8 },
    { hour: '17:00', avgOrder: 6000, orders: 10 },
    { hour: '18:00', avgOrder: 5900, orders: 7 }
  ];

  // 고객 세그먼트별 평균 주문금액
  const customerSegmentData = [
    { segment: 'VIP', avgOrder: 8500, customers: 45, revenue: 382500 },
    { segment: 'Gold', avgOrder: 6500, customers: 89, revenue: 578500 },
    { segment: 'Silver', avgOrder: 5500, customers: 156, revenue: 858000 },
    { segment: 'Bronze', avgOrder: 4500, customers: 234, revenue: 1053000 }
  ];

  const handleDownloadReport = () => {
    toast.success('평균 주문액 상세 리포트가 다운로드됩니다!');
    console.log('📊 평균 주문액 리포트 다운로드');
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
            <Target className="w-6 h-6 text-orange-600" />
            평균 주문액 상세 분석
          </DialogTitle>
          <DialogDescription>
            기간별 및 고객 세그먼트별 평균 주문금액을 확인하세요.
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

          {/* 요약 정보 */}
          <Card className="p-6">
            <h3 className="text-heading-3 text-gray-900 mb-4">평균 주문액 요약</h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-heading-2 text-orange-600">₩{dailyData.today.toLocaleString()}</div>
                <div className="text-body-small text-gray-600">오늘 평균</div>
              </div>
              <div>
                <div className="text-heading-2 text-blue-600">₩{dailyData.weekAvg.toLocaleString()}</div>
                <div className="text-body-small text-gray-600">주간 평균</div>
              </div>
              <div>
                <div className="text-heading-2 text-green-600">₩{dailyData.monthAvg.toLocaleString()}</div>
                <div className="text-body-small text-gray-600">월간 평균</div>
              </div>
              <div>
                <div className="text-heading-2 text-purple-600">+{dailyData.growth}%</div>
                <div className="text-body-small text-gray-600">전일 대비</div>
              </div>
            </div>
          </Card>

          {/* 탭 메뉴 */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="daily">하루 평균</TabsTrigger>
              <TabsTrigger value="weekly">일주일 평균</TabsTrigger>
              <TabsTrigger value="monthly">1달 평균</TabsTrigger>
              <TabsTrigger value="custom">기간 설정</TabsTrigger>
            </TabsList>

            {/* 하루 평균 탭 */}
            <TabsContent value="daily" className="space-y-4">
              <Card className="p-6">
                <h3 className="text-heading-3 text-gray-900 mb-4">하루 평균 매출 (객단가)</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Target className="w-5 h-5 text-orange-600" />
                        <span className="text-gray-700 font-medium">오늘 평균</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">₩{dailyData.today.toLocaleString()}</div>
                        <div className="text-body-small text-gray-500">현재</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-700 font-medium">어제 평균</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">₩{dailyData.yesterday.toLocaleString()}</div>
                        <div className="text-body-small text-gray-500">비교 기준</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700 font-medium">성장률</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">+{dailyData.growth}%</div>
                        <div className="text-body-small text-gray-500">전일 대비</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">시간대별 평균 주문금액</h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <RechartsBarChart data={hourlyAvgData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`₩${value.toLocaleString()}`, '평균 주문금액']} />
                        <Bar dataKey="avgOrder" fill="#F59E0B" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Card>

              {/* 시간대별 상세 분석 */}
              <Card className="p-6">
                <h3 className="text-heading-3 text-gray-900 mb-4">시간대별 상세 분석</h3>
                <div className="grid grid-cols-4 gap-3">
                  {hourlyAvgData.map((hour, index) => (
                    <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-body-small text-gray-600">{hour.hour}</div>
                      <div className="font-semibold text-gray-900">₩{hour.avgOrder.toLocaleString()}</div>
                      <div className="text-caption text-gray-500">{hour.orders}건</div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* 일주일 평균 탭 */}
            <TabsContent value="weekly" className="space-y-4">
              <Card className="p-6">
                <h3 className="text-heading-3 text-gray-900 mb-4">일주일 평균 주문금액</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₩${value.toLocaleString()}`, '평균 주문금액']} />
                    <Area type="monotone" dataKey="avgOrder" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
                
                <div className="mt-4 grid grid-cols-7 gap-2">
                  {weeklyData.map((day, index) => (
                    <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-body-small text-gray-600">{day.day}</div>
                      <div className="font-semibold text-gray-900">₩{day.avgOrder.toLocaleString()}</div>
                      <div className="text-caption text-gray-500">{day.orders}건</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* 요일별 상세 분석 */}
              <Card className="p-6">
                <h3 className="text-heading-3 text-gray-900 mb-4">요일별 상세 분석</h3>
                <div className="space-y-3">
                  {weeklyData.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700 font-medium">{day.day}요일</span>
                      </div>
                      <div className="flex gap-6">
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">₩{day.avgOrder.toLocaleString()}</div>
                          <div className="text-body-small text-gray-500">평균 주문액</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">{day.orders}건</div>
                          <div className="text-body-small text-gray-500">주문 수</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* 1달 평균 탭 */}
            <TabsContent value="monthly" className="space-y-4">
              <Card className="p-6">
                <h3 className="text-heading-3 text-gray-900 mb-4">1달 평균 주문금액</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₩${value.toLocaleString()}`, '평균 주문금액']} />
                    <Line type="monotone" dataKey="avgOrder" stroke="#10B981" strokeWidth={3} />
                  </RechartsLineChart>
                </ResponsiveContainer>
                
                <div className="mt-4 grid grid-cols-4 gap-4">
                  {monthlyData.map((week, index) => (
                    <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-body-small text-gray-600">{week.week}</div>
                      <div className="text-heading-4 text-gray-900">₩{week.avgOrder.toLocaleString()}</div>
                      <div className="text-caption text-gray-500">{week.orders}건</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* 주차별 상세 분석 */}
              <Card className="p-6">
                <h3 className="text-heading-3 text-gray-900 mb-4">주차별 상세 분석</h3>
                <div className="space-y-3">
                  {monthlyData.map((week, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <BarChart3 className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700 font-medium">{week.week}</span>
                      </div>
                      <div className="flex gap-6">
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">₩{week.avgOrder.toLocaleString()}</div>
                          <div className="text-body-small text-gray-500">평균 주문액</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">{week.orders}건</div>
                          <div className="text-body-small text-gray-500">주문 수</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">₩{week.revenue.toLocaleString()}</div>
                          <div className="text-body-small text-gray-500">총 매출</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* 기간 설정 탭 */}
            <TabsContent value="custom" className="space-y-4">
              <Card className="p-6">
                <h3 className="text-heading-3 text-gray-900 mb-4">기간 설정 평균 주문금액</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={customPeriodData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₩${value.toLocaleString()}`, '평균 주문금액']} />
                    <Bar dataKey="avgOrder" fill="#8B5CF6" />
                  </RechartsBarChart>
                </ResponsiveContainer>
                
                <div className="mt-4 space-y-3">
                  {customPeriodData.map((period, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700 font-medium">{period.period}</span>
                      </div>
                      <div className="flex gap-6">
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">₩{period.avgOrder.toLocaleString()}</div>
                          <div className="text-body-small text-gray-500">평균 주문액</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">{period.orders.toLocaleString()}건</div>
                          <div className="text-body-small text-gray-500">총 주문</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">₩{period.revenue.toLocaleString()}</div>
                          <div className="text-body-small text-gray-500">총 매출</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          {/* 고객 세그먼트별 평균 주문금액 */}
          <Card className="p-6">
            <h3 className="text-heading-3 text-gray-900 mb-4">고객 세그먼트별 평균 주문금액</h3>
            <div className="grid grid-cols-4 gap-4 mb-4">
              {customerSegmentData.map((segment, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-body-small text-gray-600">{segment.segment}</div>
                  <div className="text-heading-4 text-gray-900">₩{segment.avgOrder.toLocaleString()}</div>
                  <div className="text-caption text-gray-500">{segment.customers}명</div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {customerSegmentData.map((segment, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700 font-medium">{segment.segment} 고객</span>
                  </div>
                  <div className="flex gap-6">
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">₩{segment.avgOrder.toLocaleString()}</div>
                      <div className="text-body-small text-gray-500">평균 주문액</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{segment.customers}명</div>
                      <div className="text-body-small text-gray-500">고객 수</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">₩{segment.revenue.toLocaleString()}</div>
                      <div className="text-body-small text-gray-500">총 매출</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
          <Button onClick={handleDownloadReport} className="bg-orange-600 hover:bg-orange-700">
            <Download className="w-4 h-4 mr-2" />
            리포트 다운로드
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}