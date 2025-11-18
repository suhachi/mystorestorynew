/**
 * App Preview by Plan
 * 플랜별 배달앱 미리보기 시스템
 * 
 * Usage: /?route=app-preview-by-plan
 */

import React, { useState } from 'react';
import { Smartphone, Tablet, Monitor, Check, X, Zap, Crown, Star, Package } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { CustomerAppPreview } from '../components/examples/customer-app-preview-by-plan';

type PlanType = 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface PlanFeatures {
  plan: PlanType;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  features: {
    category: string;
    items: {
      name: string;
      enabled: boolean;
      limit?: string;
    }[];
  }[];
}

const PLAN_FEATURES: PlanFeatures[] = [
  {
    plan: 'FREE',
    name: '무료 플랜',
    icon: <Package className="w-5 h-5" />,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    features: [
      {
        category: '기본 기능',
        items: [
          { name: '메뉴 관리', enabled: true, limit: '최대 20개' },
          { name: '주문 접수', enabled: true, limit: '월 50건' },
          { name: '주문 알림', enabled: true },
          { name: '기본 통계', enabled: true },
        ]
      },
      {
        category: '고급 기능',
        items: [
          { name: '포인트 시스템', enabled: false },
          { name: '쿠폰 관리', enabled: false },
          { name: '고객 세분화', enabled: false },
          { name: '고급 분석', enabled: false },
        ]
      },
      {
        category: '브랜딩',
        items: [
          { name: '커스텀 로고', enabled: true },
          { name: '커스텀 컬러', enabled: false },
          { name: '로고 제거', enabled: false },
        ]
      }
    ]
  },
  {
    plan: 'BASIC',
    name: '베이직 플랜',
    icon: <Zap className="w-5 h-5" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    features: [
      {
        category: '기본 기능',
        items: [
          { name: '메뉴 관리', enabled: true, limit: '최대 100개' },
          { name: '주문 접수', enabled: true, limit: '월 500건' },
          { name: '주문 알림', enabled: true },
          { name: '기본 통계', enabled: true },
        ]
      },
      {
        category: '고급 기능',
        items: [
          { name: '포인트 시스템', enabled: true, limit: '기본' },
          { name: '쿠폰 관리', enabled: true, limit: '3개' },
          { name: '고객 세분화', enabled: false },
          { name: '고급 분석', enabled: false },
        ]
      },
      {
        category: '브랜딩',
        items: [
          { name: '커스텀 로고', enabled: true },
          { name: '커스텀 컬러', enabled: true },
          { name: '로고 제거', enabled: false },
        ]
      }
    ]
  },
  {
    plan: 'PREMIUM',
    name: '프리미엄 플랜',
    icon: <Star className="w-5 h-5" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    features: [
      {
        category: '기본 기능',
        items: [
          { name: '메뉴 관리', enabled: true, limit: '무제한' },
          { name: '주문 접수', enabled: true, limit: '무제한' },
          { name: '주문 알림', enabled: true },
          { name: '기본 통계', enabled: true },
        ]
      },
      {
        category: '고급 기능',
        items: [
          { name: '포인트 시스템', enabled: true, limit: '고급' },
          { name: '쿠폰 관리', enabled: true, limit: '10개' },
          { name: '고객 세분화', enabled: true },
          { name: '고급 분석', enabled: true },
        ]
      },
      {
        category: '브랜딩',
        items: [
          { name: '커스텀 로고', enabled: true },
          { name: '커스텀 컬러', enabled: true },
          { name: '로고 제거', enabled: true },
        ]
      }
    ]
  },
  {
    plan: 'ENTERPRISE',
    name: '엔터프라이즈 플랜',
    icon: <Crown className="w-5 h-5" />,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    features: [
      {
        category: '기본 기능',
        items: [
          { name: '메뉴 관리', enabled: true, limit: '무제한' },
          { name: '주문 접수', enabled: true, limit: '무제한' },
          { name: '주문 알림', enabled: true },
          { name: '기본 통계', enabled: true },
        ]
      },
      {
        category: '고급 기능',
        items: [
          { name: '포인트 시스템', enabled: true, limit: '커스텀' },
          { name: '쿠폰 관리', enabled: true, limit: '무제한' },
          { name: '고객 세분화', enabled: true },
          { name: '고급 분석', enabled: true },
          { name: 'AI 추천 시스템', enabled: true },
          { name: '다중 매장 관리', enabled: true },
        ]
      },
      {
        category: '브랜딩',
        items: [
          { name: '커스텀 로고', enabled: true },
          { name: '커스텀 컬러', enabled: true },
          { name: '로고 제거', enabled: true },
          { name: '완전 화이트라벨', enabled: true },
        ]
      }
    ]
  }
];

export function AppPreviewByPlan() {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('BASIC');
  const [deviceType, setDeviceType] = useState<DeviceType>('mobile');

  const currentPlan = PLAN_FEATURES.find(p => p.plan === selectedPlan)!;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">플랜별 앱 미리보기</h1>
              <p className="text-sm text-gray-600 mt-1">
                각 플랜에서 고객이 보게 될 배달앱을 실시간으로 확인하세요
              </p>
            </div>
            
            {/* Device Type Selector */}
            <div className="flex gap-2">
              <Button
                variant={deviceType === 'mobile' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDeviceType('mobile')}
              >
                <Smartphone className="w-4 h-4 mr-2" />
                모바일
              </Button>
              <Button
                variant={deviceType === 'tablet' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDeviceType('tablet')}
              >
                <Tablet className="w-4 h-4 mr-2" />
                태블릿
              </Button>
              <Button
                variant={deviceType === 'desktop' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDeviceType('desktop')}
              >
                <Monitor className="w-4 h-4 mr-2" />
                데스크톱
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Plan Selection & Features */}
          <div className="lg:col-span-1 space-y-6">
            {/* Plan Selector */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">플랜 선택</h2>
              <div className="space-y-3">
                {PLAN_FEATURES.map((plan) => (
                  <button
                    key={plan.plan}
                    onClick={() => setSelectedPlan(plan.plan)}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      selectedPlan === plan.plan
                        ? `border-primary-blue ${plan.bgColor}`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${plan.bgColor} ${plan.color}`}>
                          {plan.icon}
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">{plan.name}</div>
                          <div className="text-xs text-gray-500">{plan.plan}</div>
                        </div>
                      </div>
                      {selectedPlan === plan.plan && (
                        <Check className="w-5 h-5 text-primary-blue" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Feature Comparison */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">
                {currentPlan.name} 기능
              </h2>
              <div className="space-y-6">
                {currentPlan.features.map((category, idx) => (
                  <div key={idx}>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      {category.category}
                    </h3>
                    <div className="space-y-2">
                      {category.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex items-start gap-2">
                          {item.enabled ? (
                            <Check className="w-4 h-4 text-success-green mt-0.5 flex-shrink-0" />
                          ) : (
                            <X className="w-4 h-4 text-gray-300 mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm ${
                              item.enabled ? 'text-gray-900' : 'text-gray-400'
                            }`}>
                              {item.name}
                            </div>
                            {item.limit && item.enabled && (
                              <div className="text-xs text-gray-500">
                                {item.limit}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <div className="text-blue-600 mt-0.5">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-sm text-blue-900">
                  <div className="font-medium mb-1">실시간 미리보기</div>
                  <div className="text-blue-700">
                    오른쪽 화면은 실제 고객이 보게 될 앱 화면입니다. 
                    플랜을 변경하면 기능이 실시간으로 활성화/비활성화됩니다.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: App Preview */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold">고객 앱 미리보기</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {currentPlan.name} 기준
                  </p>
                </div>
                <Badge variant="outline" className={`${currentPlan.color} ${currentPlan.bgColor}`}>
                  {currentPlan.plan}
                </Badge>
              </div>

              {/* Device Frame */}
              <div className="bg-gray-100 rounded-lg p-8 flex justify-center">
                <CustomerAppPreview 
                  plan={selectedPlan}
                  device={deviceType}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
