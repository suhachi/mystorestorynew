import { 
  Home, Settings, Users, Store, BarChart, Bell, Search, 
  User, ChevronDown, Menu, X, Globe, CreditCard, MapPin,
  MessageSquare, FileText, Download, Star
} from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useNavigation } from '../system/app-router';
import { ApiIntegrationProvider } from '../system/api-integration-system';

interface AdminMasterLayoutProps {
  children?: React.ReactNode;
}

export function AdminMasterLayout({ children }: AdminMasterLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { navigate } = useNavigation();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-280 bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `} style={{ width: '280px' }}>
        {/* 로고 영역 제거됨 - 전역 헤더 사용 */}
        
        {/* 사이드바 닫기 버튼 */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 bg-white">
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate('home')}
          >
            <div className="w-8 h-8 bg-primary-blue rounded-lg flex items-center justify-center flex-shrink-0">
              <Store size={20} className="text-white" />
            </div>
            <span className="text-heading-4 text-gray-900">MyStoreStory</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu Area */}
        <div className="flex-1 px-4 py-6">
          <nav className="space-y-2">
            <div className="text-caption text-gray-500 px-3 mb-3">메인 메뉴</div>
            <button 
              onClick={() => navigate('admin-dashboard')}
              className="w-full flex items-center gap-3 px-3 py-2 text-body-small text-primary-blue bg-primary-blue-50 rounded-lg"
            >
              <Home size={20} />
              <span>대시보드</span>
            </button>
            <button 
              onClick={() => navigate('admin-stores')}
              className="w-full flex items-center gap-3 px-3 py-2 text-body-small text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <Store size={20} />
              <span>상점 관리</span>
            </button>
            <button 
              onClick={() => navigate('admin-users')}
              className="w-full flex items-center gap-3 px-3 py-2 text-body-small text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <Users size={20} />
              <span>사용자 관리</span>
            </button>
            <button 
              onClick={() => navigate('admin-analytics')}
              className="w-full flex items-center gap-3 px-3 py-2 text-body-small text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <BarChart size={20} />
              <span>통계 분석</span>
            </button>
            
            <div className="text-caption text-gray-500 px-3 mb-3 mt-6">게시판 관리</div>
            <button 
              onClick={() => navigate('admin-dashboard', { type: 'notices' })}
              className="w-full flex items-center gap-3 px-3 py-2 text-body-small text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <FileText size={20} />
              <span>공지사항 관리</span>
            </button>
            <button 
              onClick={() => navigate('admin-dashboard', { type: 'downloads' })}
              className="w-full flex items-center gap-3 px-3 py-2 text-body-small text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <Download size={20} />
              <span>다운로드 관리</span>
            </button>
            <button 
              onClick={() => navigate('admin-dashboard', { type: 'reviews' })}
              className="w-full flex items-center gap-3 px-3 py-2 text-body-small text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <Star size={20} />
              <span>리뷰 관리</span>
            </button>
            
            <div className="text-caption text-gray-500 px-3 mb-3 mt-6">API 관리</div>
            <button 
              onClick={() => navigate('admin-dashboard', { type: 'api-management' })}
              className="w-full flex items-center gap-3 px-3 py-2 text-body-small text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <Globe size={20} />
              <span>API 통합 관리</span>
            </button>
            
            <div className="text-caption text-gray-500 px-3 mb-3 mt-6">앱 관리</div>
            <button 
              onClick={() => navigate('admin-app-approval')}
              className="w-full flex items-center gap-3 px-3 py-2 text-body-small text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <FileText size={20} />
              <span>앱 승인 요청 관리</span>
            </button>
            
            <div className="text-caption text-gray-500 px-3 mb-3 mt-6">시스템</div>
            <button 
              onClick={() => navigate('admin-settings')}
              className="w-full flex items-center gap-3 px-3 py-2 text-body-small text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <Settings size={20} />
              <span>시스템 설정</span>
            </button>
          </nav>
        </div>

        {/* User Info Area */}
        <div className="h-20 px-4 border-t border-gray-200 flex items-center">
          <div className="flex items-center gap-3 w-full">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <User size={20} className="text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-body-small text-gray-900 truncate">관리자</div>
              <div className="text-caption text-gray-500">admin@mystory.com</div>
            </div>
            <ChevronDown size={16} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 기존 톱바 제거됨 - 전역 헤더 사용 */}
        
        {/* 페이지 콘텐츠 */}
        <main className="flex-1 overflow-auto">
          <ApiIntegrationProvider>
            {children || (
              <div className="p-6">
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                  <div className="text-body text-gray-500">메인 콘텐츠 영역</div>
                  <div className="text-body-small text-gray-400 mt-2">여기에 실제 페이지 내용이 들어갑니다</div>
                </div>
              </div>
            )}
          </ApiIntegrationProvider>
        </main>
      </div>
    </div>
  );
}