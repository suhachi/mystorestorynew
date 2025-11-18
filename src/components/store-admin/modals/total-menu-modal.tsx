import React, { useState } from 'react';
import { Package, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { toast } from 'sonner';

interface TotalMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TotalMenuModal({ isOpen, onClose }: TotalMenuModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const menuData = [
    {
      id: 1,
      name: '아메리카노',
      category: '커피',
      price: 4500,
      status: '판매중',
      orders: 47,
      revenue: 211500,
      image: '☕',
      description: '깊고 진한 맛의 클래식 아메리카노'
    },
    {
      id: 2,
      name: '카페 라떼',
      category: '커피',
      price: 5000,
      status: '판매중',
      orders: 32,
      revenue: 160000,
      image: '🥛',
      description: '부드러운 우유와 에스프레소의 완벽한 조화'
    },
    {
      id: 3,
      name: '카푸치노',
      category: '커피',
      price: 5500,
      status: '판매중',
      orders: 28,
      revenue: 154000,
      image: '☕',
      description: '거품이 풍부한 이탈리안 스타일 커피'
    },
    {
      id: 4,
      name: '치즈케이크',
      category: '디저트',
      price: 6500,
      status: '판매중',
      orders: 25,
      revenue: 162500,
      image: '🍰',
      description: '진한 치즈 맛의 클래식 케이크'
    },
    {
      id: 5,
      name: '초콜릿 쿠키',
      category: '디저트',
      price: 3000,
      status: '판매중',
      orders: 18,
      revenue: 54000,
      image: '🍪',
      description: '달콤한 초콜릿이 들어간 바삭한 쿠키'
    },
    {
      id: 6,
      name: '아이스티',
      category: '음료',
      price: 4000,
      status: '판매중',
      orders: 14,
      revenue: 56000,
      image: '🧊',
      description: '시원하고 상큼한 아이스티'
    }
  ];

  const filteredMenus = menuData.filter(menu => {
    const matchesSearch = menu.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '전체' || menu.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddMenu = () => {
    toast.success('새 메뉴 추가 기능이 실행됩니다!');
    onClose();
  };

  const handleEditMenu = (menu: any) => {
    toast.success(`${menu.name} 수정 기능이 실행됩니다!`);
  };

  const handleDeleteMenu = (menu: any) => {
    toast.success(`${menu.name} 삭제 기능이 실행됩니다!`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" />
            총 메뉴 관리
          </DialogTitle>
          <DialogDescription>
            현재 등록된 모든 메뉴를 확인하고 관리하세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 검색 및 필터 */}
          <Card className="p-4">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <Input
                  placeholder="메뉴명으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg"
              >
                <option value="전체">전체 카테고리</option>
                <option value="커피">커피</option>
                <option value="디저트">디저트</option>
                <option value="음료">음료</option>
              </select>
              <Button onClick={handleAddMenu} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                새 메뉴 추가
              </Button>
            </div>
          </Card>

          {/* 메뉴 목록 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMenus.map((menu) => (
              <Card key={menu.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{menu.image}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{menu.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {menu.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{menu.description}</p>
                    <div className="text-sm text-gray-500 mb-3">
                      <div>가격: ₩{menu.price.toLocaleString()}</div>
                      <div>주문: {menu.orders}건</div>
                      <div>매출: ₩{menu.revenue.toLocaleString()}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditMenu(menu)}>
                        <Edit className="w-3 h-3 mr-1" />
                        수정
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteMenu(menu)}>
                        <Trash2 className="w-3 h-3 mr-1" />
                        삭제
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* 요약 정보 */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">메뉴 요약</h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{menuData.length}</div>
                <div className="text-sm text-gray-600">총 메뉴</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {menuData.reduce((sum, menu) => sum + menu.orders, 0)}
                </div>
                <div className="text-sm text-gray-600">총 주문</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  ₩{menuData.reduce((sum, menu) => sum + menu.revenue, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">총 매출</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  ₩{Math.round(menuData.reduce((sum, menu) => sum + menu.revenue, 0) / menuData.reduce((sum, menu) => sum + menu.orders, 0)).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">평균 주문액</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Package className="w-4 h-4 mr-2" />
            메뉴 관리 페이지로 이동
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}