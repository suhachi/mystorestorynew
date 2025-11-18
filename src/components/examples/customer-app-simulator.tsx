import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import { 
  Star,
  Heart,
  ShoppingCart,
  Search,
  Filter,
  MapPin,
  Clock,
  Phone,
  Gift,
  Crown,
  Plus,
  Minus,
  User,
  CreditCard,
  Smartphone,
  ArrowLeft,
  CheckCircle,
  Truck,
  Award
} from 'lucide-react';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  description: string;
  category: string;
  points: number;
  tags: string[];
  isRecommended?: boolean;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface Customer {
  name: string;
  tier: string;
  points: number;
  stamps: number;
  totalStamps: number;
}

export function CustomerAppSimulator() {
  const [currentView, setCurrentView] = useState<'home' | 'menu' | 'item' | 'cart' | 'checkout' | 'order'>('home');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // 고객 정보 (VIP 고객 시뮬레이션)
  const customer: Customer = {
    name: '김VIP',
    tier: 'VIP',
    points: 125000,
    stamps: 7,
    totalStamps: 10
  };

  // 상점 정보
  const storeInfo = {
    name: '럭셔리 레스토랑',
    rating: 4.8,
    reviewCount: 2847,
    deliveryTime: '25-35분',
    deliveryFee: 3000,
    minimumOrder: 30000,
    isOpen: true
  };

  // 메뉴 카테고리
  const categories = [
    { id: 'all', name: '전체', icon: '🍽️' },
    { id: 'steaks', name: '스테이크', icon: '🥩' },
    { id: 'seafood', name: '해산물', icon: '🦞' },
    { id: 'pasta', name: '파스타', icon: '🍝' },
    { id: 'wine', name: '와인', icon: '🍷' }
  ];

  // 메뉴 아이템
  const menuItems: MenuItem[] = [
    {
      id: 1,
      name: '와규 스테이크',
      price: 85000,
      originalPrice: 95000,
      image: '🥩',
      rating: 4.9,
      description: 'A5 등급 일본산 와규 스테이크',
      category: 'steaks',
      points: 8500,
      tags: ['AI 추천', '베스트셀러', 'VIP 할인'],
      isRecommended: true
    },
    {
      id: 2,
      name: '랍스터 테일',
      price: 120000,
      image: '🦞',
      rating: 4.8,
      description: '보스턴산 프레시 랍스터',
      category: 'seafood',
      points: 12000,
      tags: ['신메뉴', '한정수량'],
      isRecommended: false
    },
    {
      id: 3,
      name: '트뤼플 파스타',
      price: 45000,
      image: '🍝',
      rating: 4.7,
      description: '이탈리안 블랙 트뤼플 파스타',
      category: 'pasta',
      points: 4500,
      tags: ['계절 메뉴', '인기'],
      isRecommended: true
    },
    {
      id: 4,
      name: '프리미엄 와인',
      price: 65000,
      image: '🍷',
      rating: 4.6,
      description: '셰프 추천 하우스 와인',
      category: 'wine',
      points: 6500,
      tags: ['페어링 추천'],
      isRecommended: false
    }
  ];

  // 필터링된 메뉴
  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 장바구니 관리
  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      setCart(cart.filter(item => item.id !== id));
    } else {
      setCart(cart.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  // 총 금액 계산
  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalPoints = () => {
    return cart.reduce((total, item) => total + (item.points * item.quantity), 0);
  };

  const getItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // 홈 화면
  if (currentView === 'home') {
    return (
      <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xl">
        {/* 모바일 헤더 */}
        <div className="bg-primary-blue text-white p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-heading-4">안녕하세요, {customer.name}님!</h1>
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-100 text-purple-700">
                  <Crown className="w-3 h-3 mr-1" />
                  {customer.tier}
                </Badge>
                <span className="text-body-small">{customer.points.toLocaleString()}P 보유</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-white">
              <User className="w-5 h-5" />
            </Button>
          </div>
          
          {/* 스탬프 진행률 */}
          <div className="bg-blue-600 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-body-small">스탬프 수집</span>
              <span className="text-body-small">{customer.stamps}/{customer.totalStamps}</span>
            </div>
            <Progress value={(customer.stamps / customer.totalStamps) * 100} className="bg-blue-500" />
            <p className="text-body-small mt-1 opacity-90">
              {customer.totalStamps - customer.stamps}개 더 모으면 무료 음료!
            </p>
          </div>
        </div>

        {/* 상점 정보 */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-xl">
              🏆
            </div>
            <div>
              <h2 className="font-medium">{storeInfo.name}</h2>
              <div className="flex items-center gap-2 text-body-small text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span>{storeInfo.rating}</span>
                </div>
                <span>•</span>
                <span>{storeInfo.deliveryTime}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>영업중</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">
              배달비 ₩{storeInfo.deliveryFee.toLocaleString()}
            </Badge>
            <Badge variant="outline" className="text-xs">
              최소주문 ₩{storeInfo.minimumOrder.toLocaleString()}
            </Badge>
          </div>
        </div>

        {/* AI 추천 메뉴 */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-5 h-5 text-violet-600" />
            <h3 className="font-medium">AI가 추천하는 메뉴</h3>
            <Badge className="bg-violet-100 text-violet-700 text-xs">
              맞춤형
            </Badge>
          </div>
          
          <div className="space-y-3">
            {menuItems.filter(item => item.isRecommended).map((item) => (
              <div 
                key={item.id}
                className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  setSelectedItem(item);
                  setCurrentView('item');
                }}
              >
                <div className="text-2xl">{item.image}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{item.name}</p>
                    {item.originalPrice && (
                      <Badge className="bg-red-100 text-red-700 text-xs">할인</Badge>
                    )}
                  </div>
                  <p className="text-body-small text-gray-600 mb-1">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">₩{item.price.toLocaleString()}</span>
                      {item.originalPrice && (
                        <span className="text-body-small text-gray-500 line-through">
                          ₩{item.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Gift className="w-3 h-3 text-green-500" />
                      <span className="text-body-small text-green-600">{item.points}P</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 네비게이션 */}
        <div className="border-t border-gray-100 p-4">
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={() => setCurrentView('menu')}
              className="bg-primary-blue hover:bg-primary-blue-dark"
            >
              <Smartphone className="w-4 h-4 mr-2" />
              전체 메뉴 보기
            </Button>
            <Button 
              variant="outline"
              onClick={() => setCurrentView('cart')}
              className="relative"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              장바구니
              {getItemCount() > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {getItemCount()}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 메뉴 화면
  if (currentView === 'menu') {
    return (
      <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xl">
        {/* 헤더 */}
        <div className="bg-white border-b border-gray-100 p-4">
          <div className="flex items-center gap-3 mb-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setCurrentView('home')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="font-medium">메뉴</h1>
            <div className="ml-auto">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setCurrentView('cart')}
                className="relative"
              >
                <ShoppingCart className="w-4 h-4" />
                {getItemCount() > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {getItemCount()}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
          
          {/* 검색 */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="메뉴를 검색하세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* 카테고리 */}
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="whitespace-nowrap"
              >
                {category.icon} {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* 메뉴 리스트 */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {filteredMenuItems.map((item) => (
              <div 
                key={item.id}
                className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  setSelectedItem(item);
                  setCurrentView('item');
                }}
              >
                <div className="text-3xl">{item.image}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{item.name}</p>
                    {item.isRecommended && (
                      <Badge className="bg-violet-100 text-violet-700 text-xs">AI 추천</Badge>
                    )}
                    {item.originalPrice && (
                      <Badge className="bg-red-100 text-red-700 text-xs">할인</Badge>
                    )}
                  </div>
                  <p className="text-body-small text-gray-600 mb-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">₩{item.price.toLocaleString()}</span>
                      {item.originalPrice && (
                        <span className="text-body-small text-gray-500 line-through">
                          ₩{item.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span className="text-body-small">{item.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Gift className="w-3 h-3 text-green-500" />
                        <span className="text-body-small text-green-600">{item.points}P</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 장바구니 화면
  if (currentView === 'cart') {
    return (
      <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xl">
        {/* 헤더 */}
        <div className="bg-white border-b border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setCurrentView('menu')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="font-medium">장바구니</h1>
            <span className="text-body-small text-gray-600">({getItemCount()}개 상품)</span>
          </div>
        </div>

        {cart.length === 0 ? (
          // 빈 장바구니
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">장바구니가 비어있습니다</p>
              <Button onClick={() => setCurrentView('menu')}>
                메뉴 보러가기
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {/* 장바구니 아이템 */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="text-2xl">{item.image}</div>
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-body-small text-gray-600">₩{item.price.toLocaleString()}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Gift className="w-3 h-3 text-green-500" />
                        <span className="text-body-small text-green-600">
                          {item.points * item.quantity}P 적립
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 주문 요약 */}
            <div className="border-t border-gray-100 p-4">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>상품 금액</span>
                  <span>₩{getTotalAmount().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>배달비</span>
                  <span>₩{storeInfo.deliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>적립 포인트</span>
                  <span>+{getTotalPoints().toLocaleString()}P</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>총 결제 금액</span>
                  <span>₩{(getTotalAmount() + storeInfo.deliveryFee).toLocaleString()}</span>
                </div>
              </div>
              
              <Button 
                className="w-full bg-primary-blue hover:bg-primary-blue-dark"
                onClick={() => setCurrentView('checkout')}
                disabled={getTotalAmount() < storeInfo.minimumOrder}
              >
                {getTotalAmount() < storeInfo.minimumOrder ? 
                  `₩${(storeInfo.minimumOrder - getTotalAmount()).toLocaleString()} 더 주문하세요` :
                  '주문하기'
                }
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 주문 완료 화면
  if (currentView === 'order') {
    return (
      <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-heading-3 mb-2">주문이 완료되었습니다!</h1>
          <p className="text-gray-600 mb-6">
            주문번호: #ENT-2024-003<br/>
            예상 배달 시간: 25-35분
          </p>
          
          {/* 포인트 적립 안내 */}
          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Gift className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">포인트 적립 완료!</span>
            </div>
            <p className="text-green-700">
              {getTotalPoints().toLocaleString()}P가 적립되었습니다<br/>
              현재 보유 포인트: {(customer.points + getTotalPoints()).toLocaleString()}P
            </p>
          </div>
          
          {/* 스탬프 적립 안내 */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-800">스탬프 적립!</span>
            </div>
            <p className="text-blue-700">
              스탬프 1개가 추가되었습니다<br/>
              ({customer.stamps + 1}/{customer.totalStamps}) {customer.totalStamps - customer.stamps - 1}개 더 모으면 무료 음료!
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => {
                setCurrentView('home');
                setCart([]);
              }}
            >
              홈으로
            </Button>
            <Button className="flex-1 bg-primary-blue hover:bg-primary-blue-dark">
              <Truck className="w-4 h-4 mr-2" />
              배달 추적
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 기본 반환 (다른 뷰들...)
  return (
    <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xl">
      <div className="p-6 text-center">
        <p>View: {currentView}</p>
        <Button onClick={() => setCurrentView('home')}>홈으로</Button>
      </div>
    </div>
  );
}