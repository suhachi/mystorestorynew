import React from 'react';
import { X, TrendingUp, TrendingDown, Clock, DollarSign, Users, ShoppingCart } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { 
  BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

interface KPIDetailModalProps {
  kpiData: {
    title: string;
    value: string;
    change: string;
    changeType: 'increase' | 'decrease';
    detailData: any;
    icon: React.ComponentType<any>;
    color: string;
    bgColor: string;
  };
  onClose: () => void;
}

export function KPIDetailModal({ kpiData, onClose }: KPIDetailModalProps) {
  const { title, value, change, changeType, detailData, icon: Icon, color, bgColor } = kpiData;

  const renderDetailContent = () => {
    switch (title) {
      case '오늘 매출':
        return (
          <div className="space-y-6">
            {/* 시간대별 매출 */}
            <Card className="p-6">
              <h4 className="text-heading-4 text-gray-900 mb-4">시간대별 매출</h4>
              <ResponsiveContainer width="100%" height={250}>
                <RechartsBarChart data={detailData.hourlyBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}`, '매출']} />
                  <Bar dataKey="amount" fill="#10B981" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </Card>

            {/* 결제 수단별 매출 */}
            <Card className="p-6">
              <h4 className="text-heading-4 text-gray-900 mb-4">결제 수단별 매출</h4>
              <div className="space-y-3">
                {detailData.paymentMethods.map((method: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-body font-medium">{method.method}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-primary-blue rounded-full"
                          style={{ width: `${method.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-body-small text-gray-600 w-8">{method.percentage}%</span>
                      <span className="text-body font-semibold text-success-green w-20 text-right">{method.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );

      case '오늘 주문':
        return (
          <div className="space-y-6">
            {/* 주문 상태별 */}
            <Card className="p-6">
              <h4 className="text-heading-4 text-gray-900 mb-4">주문 상태별</h4>
              <div className="space-y-3">
                {detailData.orderStatus.map((status: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-body font-medium">{status.status}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${status.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-body-small text-gray-600 w-8">{status.percentage}%</span>
                      <span className="text-body font-semibold w-12 text-right">{status.count}건</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* 주문 유형별 */}
            <Card className="p-6">
              <h4 className="text-heading-4 text-gray-900 mb-4">주문 유형별</h4>
              <ResponsiveContainer width="100%" height={250}>
                <RechartsPieChart>
                  <Pie
                    data={detailData.orderTypes}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={100}
                    dataKey="count"
                    label={({ type, percentage }) => `${type} ${percentage}%`}
                  >
                    {detailData.orderTypes.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#3B82F6' : '#10B981'} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        );

      case '신규 고객':
        return (
          <div className="space-y-6">
            {/* 고객 유입 경로 */}
            <Card className="p-6">
              <h4 className="text-heading-4 text-gray-900 mb-4">고객 유입 경로</h4>
              <div className="space-y-3">
                {detailData.customerSources.map((source: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-body font-medium">{source.source}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-purple-600 rounded-full"
                          style={{ width: `${source.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-body-small text-gray-600 w-8">{source.percentage}%</span>
                      <span className="text-body font-semibold w-12 text-right">{source.count}명</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* 연령대별 */}
            <Card className="p-6">
              <h4 className="text-heading-4 text-gray-900 mb-4">연령대별 분포</h4>
              <ResponsiveContainer width="100%" height={250}>
                <RechartsBarChart data={detailData.ageGroups}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8B5CF6" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        );

      case '평균 주문액':
        return (
          <div className="space-y-6">
            {/* 주문액 구간별 */}
            <Card className="p-6">
              <h4 className="text-heading-4 text-gray-900 mb-4">주문액 구간별</h4>
              <div className="space-y-3">
                {detailData.priceRanges.map((range: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-body font-medium">{range.range}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-orange-600 rounded-full"
                          style={{ width: `${range.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-body-small text-gray-600 w-8">{range.percentage}%</span>
                      <span className="text-body font-semibold w-12 text-right">{range.count}건</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* 인기 조합 */}
            <Card className="p-6">
              <h4 className="text-heading-4 text-gray-900 mb-4">인기 메뉴 조합</h4>
              <div className="space-y-3">
                {detailData.popularCombinations.map((combo: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-body font-medium">{combo.items}</span>
                    <span className="text-body font-semibold text-orange-600">{combo.avgPrice}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-heading-3">
            <div className={`p-2 rounded-lg ${bgColor}`}>
              <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <span>{title} 상세 정보</span>
            <Badge variant={changeType === 'increase' ? 'default' : 'destructive'} className="ml-auto">
              {changeType === 'increase' ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              {change}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 현재 값 표시 */}
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-primary-blue">
            <div className="text-center">
              <p className="text-body text-gray-600 mb-2">현재 {title}</p>
              <p className="text-heading-1 text-gray-900 mb-2">{value}</p>
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <p className="text-body-small text-gray-500">전일 대비 {change}</p>
              </div>
            </div>
          </Card>

          {/* 상세 정보 */}
          {renderDetailContent()}
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            닫기
          </Button>
          <Button className="bg-primary-blue hover:bg-primary-blue-dark">
            리포트 다운로드
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}