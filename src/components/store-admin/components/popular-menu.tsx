import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, ArrowRight, BarChart3, Eye, 
  Star, Package, DollarSign, Target
} from 'lucide-react';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Separator } from '../../ui/separator';
import { 
  BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { useNavigation } from '../../system/app-router';

interface PopularMenuProps {
  onViewAll?: () => void;
}

export function PopularMenu({ onViewAll }: PopularMenuProps) {
  const { navigate } = useNavigation();
  const [selectedMenu, setSelectedMenu] = useState<any>(null);

  const popularMenu = [
    { 
      id: 1,
      name: '아메리카노', 
      orders: 47, 
      revenue: 211500, 
      trend: 12.5,
      trendDirection: 'up',
      category: '커피',
      price: 4500,
      profit: 1410000,
      avgRating: 4.8,
      totalOrders: 1250,
      description: '깊고 진한 맛의 클래식 아메리카노',
      image: '☕',
      weeklyTrend: [
        { day: '월', orders: 38 },
        { day: '화', orders: 42 },
        { day: '수', orders: 35 },
        { day: '목', orders: 51 },
        { day: '금', orders: 47 },
        { day: '토', orders: 62 },
        { day: '일', orders: 47 }
      ]
    },
    { 
      id: 2,
      name: '카페 라떼', 
      orders: 32, 
      revenue: 160000, 
      trend: 8.3,
      trendDirection: 'up',
      category: '커피',
      price: 5000,
      profit: 960000,
      avgRating: 4.7,
      totalOrders: 890,
      description: '부드러운 우유와 에스프레소의 완벽한 조화',
      image: '🥛',
      weeklyTrend: [
        { day: '월', orders: 28 },
        { day: '화', orders: 31 },
        { day: '수', orders: 25 },
        { day: '목', orders: 35 },
        { day: '금', orders: 32 },
        { day: '토', orders: 40 },
        { day: '일', orders: 32 }
      ]
    },
    { 
      id: 3,
      name: '카푸치노', 
      orders: 28, 
      revenue: 154000, 
      trend: 15.2,
      trendDirection: 'up',
      category: '커피',
      price: 5500,
      profit: 840000,
      avgRating: 4.9,
      totalOrders: 720,
      description: '진한 에스프레소와 풍성한 우유 거품',
      image: '☕',
      weeklyTrend: [
        { day: '월', orders: 22 },
        { day: '화', orders: 26 },
        { day: '수', orders: 19 },
        { day: '목', orders: 31 },
        { day: '금', orders: 28 },
        { day: '토', orders: 35 },
        { day: '일', orders: 28 }
      ]
    },
    { 
      id: 4,
      name: '초콜릿 케이크', 
      orders: 18, 
      revenue: 117000, 
      trend: -2.1,
      trendDirection: 'down',
      category: '디저트',
      price: 6500,
      profit: 468000,
      avgRating: 4.6,
      totalOrders: 320,
      description: '달콤하고 촉촉한 수제 초콜릿 케이크',
      image: '🍰',
      weeklyTrend: [
        { day: '월', orders: 20 },
        { day: '화', orders: 18 },
        { day: '수', orders: 15 },
        { day: '목', orders: 22 },
        { day: '금', orders: 18 },
        { day: '토', orders: 25 },
        { day: '일', orders: 18 }
      ]
    }
  ];

  const handleMenuClick = (menu: any) => {
    setSelectedMenu(menu);
  };

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      // 기본 동작: 인기 메뉴 분석 페이지로 이동
      navigate('popular-menu-analysis');
    }
  };

  const getTrendIcon = (direction: string) => {
    return direction === 'up' ? TrendingUp : TrendingDown;
  };

  const getTrendColor = (direction: string) => {
    return direction === 'up' ? 'text-success-green' : 'text-error-red';
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-heading-3 text-gray-900">인기 메뉴</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleViewAll}
            className="text-primary-blue hover:text-primary-blue-dark hover:bg-primary-blue-50"
          >
            전체보기
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        <div className="space-y-3">
          {popularMenu.map((menu, index) => {
            const TrendIcon = getTrendIcon(menu.trendDirection);
            const trendColor = getTrendColor(menu.trendDirection);
            
            return (
              <Card 
                key={index} 
                className="p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary-blue group"
                onClick={() => handleMenuClick(menu)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-2xl">
                      {menu.image}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-body font-medium text-gray-900">{menu.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {menu.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-body-small text-gray-600">
                        <span>{menu.orders}주문</span>
                        <span>₩{menu.revenue.toLocaleString()}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span>{menu.avgRating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-1 text-body-small font-medium ${trendColor}`}>
                      <TrendIcon className="w-4 h-4" />
                      {Math.abs(menu.trend)}%
                    </div>
                    <Eye className="w-4 h-4 text-gray-400 group-hover:text-primary-blue transition-colors" />
                  </div>
                </div>
                
                {/* 미니 차트 */}
                <div className="h-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={menu.weeklyTrend}>
                      <Line 
                        type="monotone" 
                        dataKey="orders" 
                        stroke={menu.trendDirection === 'up' ? '#10B981' : '#EF4444'} 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 메뉴 상세 정보 모달 */}
      {selectedMenu && (
        <Dialog open={true} onOpenChange={() => setSelectedMenu(null)}>
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-heading-3">
                <div className="w-12 h-12 rounded-lg bg-primary-blue-50 flex items-center justify-center text-2xl">
                  {selectedMenu.image}
                </div>
                <div>
                  <span>{selectedMenu.name} 상세 분석</span>
                  <p className="text-body text-gray-600 font-normal mt-1">{selectedMenu.description}</p>
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* 메뉴 요약 정보 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 text-center bg-gradient-to-br from-green-50 to-green-100 border-success-green">
                  <DollarSign className="w-6 h-6 text-success-green mx-auto mb-2" />
                  <p className="text-body-small text-gray-600 mb-1">오늘 매출</p>
                  <p className="text-heading-4 text-success-green">₩{selectedMenu.revenue.toLocaleString()}</p>
                </Card>
                
                <Card className="p-4 text-center bg-gradient-to-br from-blue-50 to-blue-100 border-primary-blue">
                  <Package className="w-6 h-6 text-primary-blue mx-auto mb-2" />
                  <p className="text-body-small text-gray-600 mb-1">오늘 주문</p>
                  <p className="text-heading-4 text-primary-blue">{selectedMenu.orders}건</p>
                </Card>
                
                <Card className="p-4 text-center bg-gradient-to-br from-yellow-50 to-yellow-100 border-warning-yellow">
                  <Star className="w-6 h-6 text-warning-yellow mx-auto mb-2" />
                  <p className="text-body-small text-gray-600 mb-1">평균 평점</p>
                  <p className="text-heading-4 text-warning-yellow">{selectedMenu.avgRating}/5.0</p>
                </Card>
                
                <Card className="p-4 text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-500">
                  <Target className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-body-small text-gray-600 mb-1">총 수익</p>
                  <p className="text-heading-4 text-purple-600">₩{(selectedMenu.profit / 1000000).toFixed(1)}M</p>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 메뉴 기본 정보 */}
                <Card className="p-6">
                  <h4 className="text-heading-4 text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary-blue" />
                    메뉴 정보
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-body-small text-gray-600 mb-1">카테고리</p>
                        <Badge variant="outline">{selectedMenu.category}</Badge>
                      </div>
                      <div>
                        <p className="text-body-small text-gray-600 mb-1">가격</p>
                        <p className="text-body font-medium">₩{selectedMenu.price.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-body-small text-gray-600 mb-1">총 주문 수</p>
                        <p className="text-body font-medium">{selectedMenu.totalOrders.toLocaleString()}건</p>
                      </div>
                      <div>
                        <p className="text-body-small text-gray-600 mb-1">평점</p>
                        <div className="flex items-center gap-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${
                                  i < Math.floor(selectedMenu.avgRating) 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                          <span className="text-body-small text-gray-600 ml-1">
                            ({selectedMenu.avgRating})
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <p className="text-body-small text-gray-600 mb-2">성장률</p>
                      <div className="flex items-center gap-2">
                        {(() => {
                          const TrendIcon = getTrendIcon(selectedMenu.trendDirection);
                          const trendColor = getTrendColor(selectedMenu.trendDirection);
                          return (
                            <>
                              <TrendIcon className={`w-5 h-5 ${trendColor}`} />
                              <span className={`text-body font-medium ${trendColor}`}>
                                {selectedMenu.trendDirection === 'up' ? '+' : ''}{selectedMenu.trend}%
                              </span>
                              <span className="text-body-small text-gray-500">전주 대비</span>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* 주간 트렌드 차트 */}
                <Card className="p-6">
                  <h4 className="text-heading-4 text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary-blue" />
                    주간 주문 트렌드
                  </h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <RechartsBarChart data={selectedMenu.weeklyTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}건`, '주문 수']} />
                      <Bar 
                        dataKey="orders" 
                        fill={selectedMenu.trendDirection === 'up' ? '#10B981' : '#EF4444'}
                        radius={[4, 4, 0, 0]}
                      />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              {/* 성과 인사이트 */}
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-primary-blue">
                <h4 className="text-heading-4 text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary-blue" />
                  성과 인사이트
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-body font-medium text-gray-900 mb-2">🎯 주요 성과</h5>
                    <ul className="text-body-small text-gray-700 space-y-1">
                      <li>• 이번 주 {selectedMenu.trendDirection === 'up' ? '성장' : '감소'}률: {Math.abs(selectedMenu.trend)}%</li>
                      <li>• 주말 매출이 평일 대비 {selectedMenu.trendDirection === 'up' ? '40%' : '25%'} 높음</li>
                      <li>• 고객 만족도: {selectedMenu.avgRating}/5.0 (평균 이상)</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-body font-medium text-gray-900 mb-2">💡 개선 제안</h5>
                    <ul className="text-body-small text-gray-700 space-y-1">
                      {selectedMenu.trendDirection === 'up' ? (
                        <>
                          <li>• 재료 재고 확보로 품절 방지 권장</li>
                          <li>• 유사 메뉴 출시 고려</li>
                          <li>• 프로모션 확대 검토</li>
                        </>
                      ) : (
                        <>
                          <li>• 고객 피드백 분석 필요</li>
                          <li>• 레시피 개선 검토</li>
                          <li>• 마케팅 전략 재검토</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </Card>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
              <Button variant="outline" onClick={() => setSelectedMenu(null)}>
                닫기
              </Button>
              <Button className="bg-primary-blue hover:bg-primary-blue-dark">
                <Package className="w-4 h-4 mr-2" />
                메뉴 편집
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}