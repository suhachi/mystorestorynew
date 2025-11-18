import { 
  Home, Menu as MenuIcon, ShoppingCart, User, Search, 
  Heart, Bell, Star 
} from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface CustomerAppLayoutProps {
  children?: React.ReactNode;
}

export function CustomerAppLayout({ children }: CustomerAppLayoutProps) {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="h-15 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        {/* Left: Store Logo/Name */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center">
            <ImageWithFallback 
              src="figma:asset/4045e6f074ff4480cd95c7c5514e0728fe19fc42.png"
              alt="MyStoreStory 로고"
              className="w-8 h-8 object-contain"
            />
          </div>
          <div className="text-heading-4 text-gray-900">카페 마이스토리</div>
        </div>

        {/* Center: Search (Optional) */}
        <div className="hidden sm:flex items-center max-w-sm mx-4 flex-1">
          <div className="relative w-full">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="메뉴 검색..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full text-body-small focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            />
          </div>
        </div>

        {/* Right: Cart */}
        <div className="flex items-center gap-3">
          <button className="relative p-2 text-gray-600 hover:text-gray-900">
            <Heart size={20} />
          </button>
          <button className="relative p-2 text-gray-600 hover:text-gray-900">
            <ShoppingCart size={20} />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary-blue rounded-full flex items-center justify-center">
              <span className="text-caption text-white">2</span>
            </div>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4">
        {children || (
          <div className="space-y-6">
            {/* Desktop Navigation (Hidden on Mobile) */}
            <div className="hidden md:flex items-center gap-6 bg-white p-4 rounded-lg border border-gray-200">
              <button className="px-4 py-2 text-body-small text-primary-blue bg-primary-blue-50 rounded-lg">
                홈
              </button>
              <button className="px-4 py-2 text-body-small text-gray-600 hover:bg-gray-50 rounded-lg">
                메뉴
              </button>
              <button className="px-4 py-2 text-body-small text-gray-600 hover:bg-gray-50 rounded-lg">
                이벤트
              </button>
              <button className="px-4 py-2 text-body-small text-gray-600 hover:bg-gray-50 rounded-lg">
                공지사항
              </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <div className="text-body text-gray-500">고객용 앱 콘텐츠 영역</div>
              <div className="text-body-small text-gray-400 mt-2">여기에 고객용 앱 페이지 내용이 들어갑니다</div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation Bar (Mobile/Tablet) */}
      <nav className="md:hidden h-20 bg-white border-t border-gray-200 px-4">
        <div className="flex items-center justify-around h-full">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 p-2 min-w-0 ${
              activeTab === 'home' ? 'text-primary-blue' : 'text-gray-400'
            }`}
          >
            <Home size={20} />
            <span className="text-caption">홈</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('menu')}
            className={`flex flex-col items-center gap-1 p-2 min-w-0 ${
              activeTab === 'menu' ? 'text-primary-blue' : 'text-gray-400'
            }`}
          >
            <MenuIcon size={20} />
            <span className="text-caption">메뉴</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex flex-col items-center gap-1 p-2 min-w-0 relative ${
              activeTab === 'orders' ? 'text-primary-blue' : 'text-gray-400'
            }`}
          >
            <ShoppingCart size={20} />
            <span className="text-caption">주문</span>
            <div className="absolute -top-1 right-1 w-4 h-4 bg-error-red rounded-full flex items-center justify-center">
              <span className="text-caption text-white">1</span>
            </div>
          </button>
          
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 p-2 min-w-0 ${
              activeTab === 'profile' ? 'text-primary-blue' : 'text-gray-400'
            }`}
          >
            <User size={20} />
            <span className="text-caption">마이</span>
          </button>
        </div>
      </nav>

      {/* Tablet Navigation (768px-1023px) */}
      <div className="hidden md:block lg:hidden fixed left-0 top-1/2 transform -translate-y-1/2 z-50">
        <div className="bg-white border border-gray-200 rounded-r-lg shadow-md p-2">
          <nav className="flex flex-col gap-2">
            <button className="p-3 text-primary-blue bg-primary-blue-50 rounded-lg">
              <Home size={20} />
            </button>
            <button className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
              <MenuIcon size={20} />
            </button>
            <button className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg relative">
              <ShoppingCart size={20} />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-error-red rounded-full flex items-center justify-center">
                <span className="text-caption text-white">1</span>
              </div>
            </button>
            <button className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
              <User size={20} />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}