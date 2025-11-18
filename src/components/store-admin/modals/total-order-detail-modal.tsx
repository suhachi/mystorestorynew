import React, { useState } from 'react';
import { 
  ShoppingCart, BarChart3, PieChart, TrendingUp, Calendar, 
  Filter, Download, Eye, Package, Clock, CheckCircle, AlertCircle
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Input } from '../../ui/input';
import { 
  BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { toast } from 'sonner@2.0.3';

interface TotalOrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TotalOrderDetailModal({ isOpen, onClose }: TotalOrderDetailModalProps) {
  const [activeTab, setActiveTab] = useState('menu');
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [searchTerm, setSearchTerm] = useState('');

  // 메뉴별 주문 데이터
  const menuOrderData = [
    { name: '아메리카노', orders: 47, revenue: 211500, percentage: 21.0, category: '커피' },
    { name: '카페 라떼', orders: 32, revenue: 160000, percentage: 14.3, category: '커피' },
    { name: '카푸치노', orders: 28, revenue: 154000, percentage: 12.5, category: '커피' },
    { name: '치즈케이크', orders: 25, revenue: 162500, percentage: 11.2, category: '디저트' },
    { name: '초콜릿 쿠키', orders: 18, revenue: 54000, percentage: 8.0, category: '디저트' },
    { name: '아이스티', orders: 14, revenue: 56000, percentage: 6.3, category: '음료' },
    { name: '에스프레소', orders: 12, revenue: 60000, percentage: 5.4, category: '커피' },
    { name: '모카', orders: 10, revenue: 55000, percentage: 4.5, category: '커피' },
    { name: '바닐라 라떼', orders: 8, revenue: 40000, percentage: 3.6, category: '커피' },
    { name: '카라멜 마키아토', orders: 6, revenue: 33000, percentage: 2.7, category: '커피' }
  ];

  // 주문 상태별 데이터
  const orderStatusData = [
    { status: '완료', count: 168, percentage: 75.0, color: '#10B981' },
    { status: '준비중', count: 34, percentage: 15.2, color: '#F59E0B' },
    { status: '대기', count: 22, percentage: 9.8, color: '#3B82F6' }
  ];

  // 주문 트렌드 데이터
  const orderTrendData = [
    { day: '월', orders: 28, revenue: 168000 },
    { day: '화', orders: 32, revenue: 192000 },
    { day: '수', orders: 25, revenue: 150000 },
    { day: '목', orders: 38, revenue: 228000 },
    { day: '금', orders: 42, revenue: 252000 },
    { day: '토', orders: 35, revenue: 210000 },
    { day: '일', orders: 24, revenue: 144000 }
  ];

  // 카테고리별 주문 데이터
  const categoryOrderData = [
    { category: '커피', orders: 161, percentage: 71.9, color: '#3B82F6' },
    { category: '디저트', orders: 43, percentage: 19.2, color: '#10B981' },
    { category: '음료', orders: 20, percentage: 8.9, color: '#F59E0B' }
  ];

  const totalOrders = menuOrderData.reduce((sum, item) => sum + item.orders, 0);
  const totalRevenue = menuOrderData.reduce((sum, item) => sum + item.revenue, 0);

  // 검색 필터링
  const filteredMenuData = menuOrderData.filter(menu => 
    menu.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadReport = () => {
    toast.success('총 주문 상세 리포트가 다운로드됩니다!');
    console.log('📊 총 주문 리포트 다운로드');
  };

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    toast.success(`${period} 기간으로 변경되었습니다!`);
    console.log(`📅 기간 변경: ${period}`);
  };

  const handleMenuDetail = (menu: any) => {
    toast.success(`${menu.name} 상세 정보를 확인합니다!`);
    console.log(`🍽️ 메뉴 상세: ${menu.name}`);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
            총 주문 상세 분석
          </DialogTitle>
          <DialogDescription>
            메뉴별 주문량과 주문 트렌드를 확인하세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 기간 선택 및 검색 */}
          <Card className="p-4">
            <div className="flex items-center justify-between gap-4">
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
              <div className="flex-1 max-w-md">
                <Input
                  placeholder="메뉴명으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* 요약 정보 */}
          <Card className="p-6">
            <h3 className="text-heading-3 text-gray-900 mb-4">주문 요약</h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-heading-2 text-blue-600">{totalOrders}</div>
                <div className="text-body-small text-gray-600">총 주문</div>
              </div>
              <div>
                <div className="text-heading-2 text-green-600">₩{totalRevenue.toLocaleString()}</div>
                <div className="text-body-small text-gray-600">총 매출</div>
              </div>
              <div>
                <div className="text-heading-2 text-purple-600">{menuOrderData.length}</div>
                <div className="text-body-small text-gray-600">메뉴 수</div>
              </div>
              <div>
                <div className="text-heading-2 text-orange-600">₩{Math.round(totalRevenue / totalOrders).toLocaleString()}</div>
                <div className="text-body-small text-gray-600">평균 주문액</div>
              </div>
            </div>
          </Card>

          {/* 탭 메뉴 */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="menu">메뉴별 주문</TabsTrigger>
              <TabsTrigger value="status">주문 상태</TabsTrigger>
              <TabsTrigger value="trend">주문 트렌드</TabsTrigger>
            </TabsList>

            {/* 메뉴별 주문 탭 */}
            <TabsContent value="menu" className="space-y-4">
              {/* 카테고리별 요약 */}
              <Card className="p-6">
                <h3 className="text-heading-3 text-gray-900 mb-4">카테고리별 주문 요약</h3>
                <div className="grid grid-cols-3 gap-4">
                  {categoryOrderData.map((category, index) => (
                    <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-body-small text-gray-600">{category.category}</div>
                      <div className="text-heading-4 text-gray-900">{category.orders}건</div>
                      <div className="text-caption text-gray-500">{category.percentage}%</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* 메뉴별 주문 목록 */}
              <Card className="p-6">
                <h3 className="text-heading-3 text-gray-900 mb-4">메뉴별 주문 상세</h3>
                <div className="space-y-3">
                  {filteredMenuData.map((menu, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="w-8 h-8 flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <div>
                          <div className="font-semibold text-gray-900">{menu.name}</div>
                          <div className="text-body-small text-gray-600">{menu.category}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">{menu.orders}건</div>
                          <div className="text-body-small text-gray-500">{menu.percentage}%</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">₩{menu.revenue.toLocaleString()}</div>
                          <div className="text-body-small text-gray-500">매출</div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleMenuDetail(menu)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          상세
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* 메뉴별 차트 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-heading-3 text-gray-900 mb-4">상위 메뉴 주문량</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsBarChart data={filteredMenuData.slice(0, 5)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}건`, '주문량']} />
                      <Bar dataKey="orders" fill="#3B82F6" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="p-6">
                  <h3 className="text-heading-3 text-gray-900 mb-4">카테고리별 주문 비율</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={categoryOrderData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="orders"
                        label={({ category, percentage }) => `${category} ${percentage}%`}
                      >
                        {categoryOrderData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}건`, '주문량']} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            </TabsContent>

            {/* 주문 상태 탭 */}
            <TabsContent value="status" className="space-y-4">
              <Card className="p-6">
                <h3 className="text-heading-3 text-gray-900 mb-4">주문 상태별 분석</h3>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {orderStatusData.map((status, index) => (
                    <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        {status.status === '완료' && <CheckCircle className="w-5 h-5 text-green-600" />}
                        {status.status === '준비중' && <Clock className="w-5 h-5 text-yellow-600" />}
                        {status.status === '대기' && <AlertCircle className="w-5 h-5 text-blue-600" />}
                        <span className="font-semibold text-gray-900">{status.status}</span>
                      </div>
                      <div className="text-heading-2 text-gray-900">{status.count}건</div>
                      <div className="text-body-small text-gray-500">{status.percentage}%</div>
                    </div>
                  ))}
                </div>
                
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={orderStatusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}건`, '주문량']} />
                    <Bar dataKey="count" fill="#3B82F6" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </Card>

              {/* 주문 상태 상세 분석 */}
              <Card className="p-6">
                <h3 className="text-heading-3 text-gray-900 mb-4">주문 상태 상세 분석</h3>
                <div className="space-y-3">
                  {orderStatusData.map((status, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: status.color }}
                        />
                        <span className="text-gray-700 font-medium">{status.status}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{status.count}건</div>
                        <div className="text-body-small text-gray-500">{status.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* 주문 트렌드 탭 */}
            <TabsContent value="trend" className="space-y-4">
              <Card className="p-6">
                <h3 className="text-heading-3 text-gray-900 mb-4">주문 트렌드</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={orderTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="orders" stroke="#3B82F6" strokeWidth={2} name="주문수" />
                    <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} name="매출" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              {/* 요일별 상세 분석 */}
              <Card className="p-6">
                <h3 className="text-heading-3 text-gray-900 mb-4">요일별 상세 분석</h3>
                <div className="space-y-3">
                  {orderTrendData.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700 font-medium">{day.day}요일</span>
                      </div>
                      <div className="flex gap-6">
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">{day.orders}건</div>
                          <div className="text-body-small text-gray-500">주문</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">₩{day.revenue.toLocaleString()}</div>
                          <div className="text-body-small text-gray-500">매출</div>
                        </div>
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
          <Button onClick={handleDownloadReport} className="bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            리포트 다운로드
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}