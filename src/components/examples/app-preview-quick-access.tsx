/**
 * App Preview Quick Access
 * 플랜별 앱 미리보기 빠른 접근 컴포넌트
 */

import React from 'react';
import { Smartphone, Eye, Zap, Star, Crown, Package } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { useNavigation } from '../system/app-router';

export function AppPreviewQuickAccess() {
  const { navigate } = useNavigation();

  const plans = [
    {
      id: 'FREE',
      name: '무료 플랜',
      icon: <Package className="w-8 h-8" />,
      color: 'from-gray-400 to-gray-600',
      description: '기본 기능으로 시작하기',
      features: ['메뉴 20개', '월 50건 주문', '기본 통계']
    },
    {
      id: 'BASIC',
      name: '베이직 플랜',
      icon: <Zap className="w-8 h-8" />,
      color: 'from-blue-400 to-blue-600',
      description: '비즈니스 필수 기능',
      features: ['메뉴 100개', '월 500건', '포인트/쿠폰']
    },
    {
      id: 'PREMIUM',
      name: '프리미엄 플랜',
      icon: <Star className="w-8 h-8" />,
      color: 'from-purple-400 to-purple-600',
      description: '고급 마케팅 도구',
      features: ['무제한 메뉴', '고급 분석', 'AI 추천']
    },
    {
      id: 'ENTERPRISE',
      name: '엔터프라이즈',
      icon: <Crown className="w-8 h-8" />,
      color: 'from-amber-400 to-amber-600',
      description: '완전한 커스터마이징',
      features: ['다중 매장', 'API 연동', '전담 지원']
    }
  ];

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary-blue text-white px-4 py-2 rounded-full mb-4">
            <Smartphone className="w-5 h-5" />
            <span className="font-medium">플랜별 앱 미리보기</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            실제 고객이 보게 될 앱을<br />플랜별로 확인하세요
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            각 플랜에 따라 어떤 기능이 활성화되는지, 
            고객에게 어떻게 보이는지 실시간으로 체험해보세요.
          </p>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className="relative overflow-hidden hover:shadow-xl transition-all group cursor-pointer"
              onClick={() => navigate('app-preview-by-plan', { plan: plan.id })}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              
              <div className="p-6 relative">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${plan.color} text-white mb-4`}>
                  {plan.icon}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                
                <p className="text-sm text-gray-600 mb-4">
                  {plan.description}
                </p>
                
                <div className="space-y-2 mb-6">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-blue" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  className="w-full group-hover:bg-primary-blue group-hover:text-white transition-colors"
                  variant="outline"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  미리보기
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Full Preview Button */}
        <div className="text-center">
          <Button 
            size="lg"
            onClick={() => navigate('app-preview-by-plan')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg"
          >
            <Smartphone className="w-5 h-5 mr-3" />
            전체 미리보기로 이동
          </Button>
          <p className="text-sm text-gray-500 mt-3">
            플랜을 자유롭게 전환하며 비교할 수 있습니다
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">실시간 미리보기</h3>
            <p className="text-sm text-gray-600">
              플랜을 변경하면 즉시 화면에 반영됩니다
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">반응형 테스트</h3>
            <p className="text-sm text-gray-600">
              모바일, 태블릿, 데스크톱 모두 확인 가능
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">기능 비교</h3>
            <p className="text-sm text-gray-600">
              플랜별 활성화 기능을 한눈에 파악
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
