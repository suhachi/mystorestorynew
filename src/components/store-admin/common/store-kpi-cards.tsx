import React, { useState } from 'react';
import { 
  DollarSign, ShoppingCart, Users, TrendingUp, TrendingDown, 
  Clock, ArrowRight, Activity, Target
} from 'lucide-react';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { KPIDetailModal } from '../modals/kpi-detail-modal';
import { SalesDetailModal } from '../modals/sales-detail-modal';
import { useNavigation } from '../../system/app-router';

interface KPICardData {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  detailData: any;
}

export function StoreKPICards() {
  const [selectedKPI, setSelectedKPI] = useState<KPICardData | null>(null);
  const [showSalesDetailModal, setShowSalesDetailModal] = useState(false);
  const { navigate } = useNavigation();

  const kpiData: KPICardData[] = [
    {
      title: '오늘 매출',
      value: '₩1,250,000',
      change: '+12.5%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'text-success-green',
      bgColor: 'bg-success-green-50',
      detailData: {
        hourlyBreakdown: [
          { time: '00:00-06:00', amount: 120000, orders: 3 },
          { time: '06:00-12:00', amount: 450000, orders: 12 },
          { time: '12:00-18:00', amount: 680000, orders: 18 },
          { time: '18:00-24:00', amount: 1250000, orders: 47 }
        ],
        paymentMethods: [
          { method: '카드', amount: '₩875,000', percentage: 70 },
          { method: '현금', amount: '₩250,000', percentage: 20 },
          { method: '간편결제', amount: '₩125,000', percentage: 10 }
        ]
      }
    },
    {
      title: '오늘 주문',
      value: '47건',
      change: '+8.2%',
      changeType: 'increase',
      icon: ShoppingCart,
      color: 'text-primary-blue',
      bgColor: 'bg-primary-blue-50',
      detailData: {
        orderStatus: [
          { status: '완료', count: 35, percentage: 74.5 },
          { status: '준비중', count: 8, percentage: 17.0 },
          { status: '대기', count: 4, percentage: 8.5 }
        ],
        orderTypes: [
          { type: '매장', count: 28, percentage: 59.6 },
          { type: '포장', count: 19, percentage: 40.4 }
        ]
      }
    },
    {
      title: '신규 고객',
      value: '12명',
      change: '+15.3%',
      changeType: 'increase',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      detailData: {
        customerSources: [
          { source: '검색엔진', count: 5, percentage: 41.7 },
          { source: 'SNS', count: 4, percentage: 33.3 },
          { source: '지인추천', count: 2, percentage: 16.7 },
          { source: '기타', count: 1, percentage: 8.3 }
        ],
        ageGroups: [
          { age: '20대', count: 6, percentage: 50.0 },
          { age: '30대', count: 4, percentage: 33.3 },
          { age: '40대+', count: 2, percentage: 16.7 }
        ]
      }
    },
    {
      title: '평균 주문액',
      value: '₩26,600',
      change: '-2.1%',
      changeType: 'decrease',
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      detailData: {
        priceRanges: [
          { range: '₩10,000 미만', count: 8, percentage: 17.0 },
          { range: '₩10,000-20,000', count: 15, percentage: 31.9 },
          { range: '₩20,000-30,000', count: 18, percentage: 38.3 },
          { range: '₩30,000 이상', count: 6, percentage: 12.8 }
        ],
        popularCombinations: [
          { items: '아메리카노 + 크로와상', avgPrice: '₩8,500' },
          { items: '라떼 + 케이크', avgPrice: '₩15,000' },
          { items: '카푸치노 + 샐러드', avgPrice: '₩18,000' }
        ]
      }
    }
  ];

  const handleKPIClick = (kpi: KPICardData, index: number) => {
    console.log(`📊 KPI 카드 클릭: ${kpi.title}`);
    
    // 매출 카드인 경우 특별한 매출 상세 모달 표시
    if (index === 0) { // 오늘 매출
      setShowSalesDetailModal(true);
      console.log('💰 매출 상세 모달 열기');
      return;
    }
    
    // 평균 평점 카드인 경우 리뷰 관리 페이지로 이동
    if (kpi.title.includes('평점')) {
      navigate('customer-management'); // 또는 리뷰 관리 페이지
      console.log('⭐ 리뷰 관리 페이지로 이동');
      return;
    }
    
    // 기본 KPI 상세 모달 표시
    setSelectedKPI(kpi);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card 
              key={index} 
              className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] hover:border-primary-blue group"
              onClick={() => handleKPIClick(kpi, index)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <p className="text-body-small text-gray-600 mb-1">{kpi.title}</p>
                  <p className="text-heading-2 text-gray-900">{kpi.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${kpi.bgColor} group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {kpi.changeType === 'increase' ? (
                    <TrendingUp className="w-4 h-4 text-success-green mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-error-red mr-1" />
                  )}
                  <span className={`text-body-small font-medium ${
                    kpi.changeType === 'increase' ? 'text-success-green' : 'text-error-red'
                  }`}>
                    {kpi.change}
                  </span>
                  <span className="text-body-small text-gray-500 ml-1">전일 대비</span>
                </div>
                
                <div className="flex items-center text-body-small text-gray-400 group-hover:text-primary-blue transition-colors">
                  <Clock className="w-3 h-3 mr-1" />
                  <span className="mr-1">상세보기</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              
              {/* 호버 효과를 위한 추가 인디케이터 */}
              <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${kpi.changeType === 'increase' ? 'bg-success-green' : 'bg-error-red'} 
                             transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
                ></div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* KPI 상세 정보 모달 */}
      {selectedKPI && (
        <KPIDetailModal
          kpiData={selectedKPI}
          onClose={() => setSelectedKPI(null)}
        />
      )}

      {/* 매출 상세 정보 모달 */}
      <SalesDetailModal
        isOpen={showSalesDetailModal}
        onClose={() => setShowSalesDetailModal(false)}
      />
    </>
  );
}