/**
 * Customer App Preview by Plan
 * 플랜별 고객 앱 미리보기 컴포넌트
 */

import React, { useState } from 'react';
import { 
  Home, Search, ShoppingCart, User, Heart, Gift, 
  Star, MapPin, Clock, Phone, ChevronRight, Bell,
  CreditCard, Truck, Package, TrendingUp
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

type PlanType = 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface CustomerAppPreviewProps {
  plan: PlanType;
  device: DeviceType;
}

export function CustomerAppPreview({ plan, device }: CustomerAppPreviewProps) {
  const [activeTab, setActiveTab] = useState('home');

  // Plan-based feature flags
  const features = {
    points: plan !== 'FREE',
    coupons: plan !== 'FREE',
    favorites: true,
    reviews: true,
    orderTracking: true,
    customColors: plan !== 'FREE',
    recommendations: plan === 'PREMIUM' || plan === 'ENTERPRISE',
    aiRecommendations: plan === 'ENTERPRISE',
    loyaltyTiers: plan === 'PREMIUM' || plan === 'ENTERPRISE',
    advancedSearch: plan === 'PREMIUM' || plan === 'ENTERPRISE',
  };

  // Device dimensions
  const deviceStyles = {
    mobile: 'w-[375px] h-[667px]',
    tablet: 'w-[768px] h-[1024px]',
    desktop: 'w-full h-[800px]',
  };

  const containerClass = device === 'desktop' 
    ? 'w-full h-full' 
    : `${deviceStyles[device]} mx-auto border-8 border-gray-800 rounded-3xl overflow-hidden shadow-2xl`;

  return (
    <div className={containerClass}>
      {/* Status Bar (Mobile/Tablet only) */}
      {device !== 'desktop' && (
        <div className="bg-gray-900 text-white px-4 py-2 flex items-center justify-between text-xs">
          <div>9:41</div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-3 border border-white rounded-sm" />
            <div className="text-xs">100%</div>
          </div>
        </div>
      )}

      {/* App Content */}
      <div className="bg-white h-full overflow-auto">
        {/* Header */}
        <div className="bg-primary-blue text-white p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold">맛있는 음식점</h1>
              <div className="flex items-center gap-1 text-xs opacity-90 mt-1">
                <MapPin className="w-3 h-3" />
                <span>서울시 강남구</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-white/10 rounded-full">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-full">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -mt-2 -mr-2 bg-error-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  2
                </span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={features.advancedSearch ? "메뉴, 카테고리, 재료 검색..." : "메뉴 검색..."}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white text-gray-900 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Points/Rewards Banner (if enabled) */}
        {features.points && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 mx-4 mt-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm opacity-90">내 포인트</div>
                <div className="text-2xl font-bold">2,500P</div>
                {features.loyaltyTiers && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3" />
                    <span className="text-xs">골드 회원</span>
                  </div>
                )}
              </div>
              <Button size="sm" variant="secondary">
                사용하기
              </Button>
            </div>
          </div>
        )}

        {/* AI Recommendations (ENTERPRISE only) */}
        {features.aiRecommendations && (
          <div className="px-4 mt-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-primary-blue" />
              <h2 className="font-semibold">AI 맞춤 추천</h2>
              <Badge variant="outline" className="text-xs">
                ENTERPRISE
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3">
                <div className="aspect-square bg-gray-200 rounded-lg mb-2" />
                <div className="font-medium text-sm">김치찌개</div>
                <div className="text-xs text-gray-600">회원님이 좋아할 메뉴</div>
                <div className="text-primary-blue font-bold mt-1">12,000원</div>
              </Card>
              <Card className="p-3">
                <div className="aspect-square bg-gray-200 rounded-lg mb-2" />
                <div className="font-medium text-sm">제육볶음</div>
                <div className="text-xs text-gray-600">98% 일치율</div>
                <div className="text-primary-blue font-bold mt-1">11,000원</div>
              </Card>
            </div>
          </div>
        )}

        {/* Coupons Section (if enabled) */}
        {features.coupons && (
          <div className="px-4 mt-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">사용 가능한 쿠폰</h2>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg min-w-[200px]">
                <Gift className="w-5 h-5 mb-2" />
                <div className="font-bold">3,000원 할인</div>
                <div className="text-xs opacity-90">15,000원 이상 주문 시</div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg min-w-[200px]">
                <Gift className="w-5 h-5 mb-2" />
                <div className="font-bold">배달비 무료</div>
                <div className="text-xs opacity-90">20,000원 이상 주문 시</div>
              </div>
            </div>
          </div>
        )}

        {/* Menu Categories */}
        <div className="px-4 mt-6">
          <h2 className="font-semibold mb-3">카테고리</h2>
          <div className="grid grid-cols-4 gap-3">
            {['전체', '인기', '한식', '중식', '양식', '일식', '분식', '치킨'].slice(0, plan === 'FREE' ? 4 : 8).map((cat) => (
              <button key={cat} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2" />
                <div className="text-xs text-center">{cat}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Menu List */}
        <div className="px-4 mt-6 pb-24">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">인기 메뉴</h2>
            {features.recommendations && (
              <Badge variant="outline" className="text-xs">
                추천순
              </Badge>
            )}
          </div>
          <div className="space-y-3">
            {[
              { name: '김치찌개', price: 12000, rating: 4.8, reviews: 234 },
              { name: '제육볶음', price: 11000, rating: 4.9, reviews: 189 },
              { name: '된장찌개', price: 10000, rating: 4.7, reviews: 156 },
            ].map((item, idx) => (
              <Card key={idx} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-medium">{item.name}</div>
                      {features.favorites && (
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Heart className="w-4 h-4 text-gray-400" />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{item.rating}</span>
                      <span className="text-gray-400">({item.reviews})</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="font-bold text-primary-blue">
                        {item.price.toLocaleString()}원
                      </div>
                      <Button size="sm" variant="outline">
                        담기
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
          <div className="flex items-center justify-around max-w-md mx-auto">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg ${
                activeTab === 'home' ? 'text-primary-blue' : 'text-gray-400'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-xs">홈</span>
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg ${
                activeTab === 'search' ? 'text-primary-blue' : 'text-gray-400'
              }`}
            >
              <Search className="w-5 h-5" />
              <span className="text-xs">검색</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg ${
                activeTab === 'orders' ? 'text-primary-blue' : 'text-gray-400'
              }`}
            >
              <Package className="w-5 h-5" />
              <span className="text-xs">주문</span>
            </button>
            {features.points && (
              <button
                onClick={() => setActiveTab('rewards')}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg ${
                  activeTab === 'rewards' ? 'text-primary-blue' : 'text-gray-400'
                }`}
              >
                <Gift className="w-5 h-5" />
                <span className="text-xs">혜택</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg ${
                activeTab === 'profile' ? 'text-primary-blue' : 'text-gray-400'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-xs">MY</span>
            </button>
          </div>
        </div>
      </div>

      {/* Plan Watermark (FREE plan only) */}
      {plan === 'FREE' && device !== 'desktop' && (
        <div className="absolute bottom-16 right-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
          Powered by MyStoreStory
        </div>
      )}
    </div>
  );
}
