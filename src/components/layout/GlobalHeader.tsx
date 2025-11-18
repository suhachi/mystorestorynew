import React from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useNavigation } from '../system/app-router';
import { Store, Sparkles } from 'lucide-react';

export function GlobalHeader() {
  const { navigate } = useNavigation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 - 홈으로 이동 */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate('home')}
          >
            <div className="w-10 h-10 bg-gradient-gold rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
              <Store size={20} className="text-gray-900" />
            </div>
            <span className="text-xl font-bold text-gray-900 group-hover:text-accent-gold transition-colors">MyStoreStory</span>
          </div>

          {/* 중앙 네비게이션 메뉴 */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => navigate('home')}
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors relative group"
            >
              홈
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-gold group-hover:w-full transition-all duration-300" />
            </button>
            <button 
              onClick={() => {
                navigate('home');
                setTimeout(() => {
                  const element = document.getElementById('features');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 100);
              }}
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors relative group"
            >
              기능
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-gold group-hover:w-full transition-all duration-300" />
            </button>
            <button 
              onClick={() => {
                navigate('home');
                setTimeout(() => {
                  const element = document.getElementById('pricing');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 100);
              }}
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors relative group"
            >
              가격
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-gold group-hover:w-full transition-all duration-300" />
            </button>
            <button 
              onClick={() => navigate('design-system')}
              className="text-sm font-medium text-secondary-indigo hover:text-secondary-indigo-dark transition-colors relative group"
            >
              <div className="flex items-center gap-1.5">
                <Sparkles size={14} />
                디자인 시스템
              </div>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary-indigo group-hover:w-full transition-all duration-300" />
            </button>
            <button 
              onClick={() => navigate('support')}
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors relative group"
            >
              고객지원
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-gold group-hover:w-full transition-all duration-300" />
            </button>
          </nav>

          {/* 우측 액션 버튼들 */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('login')}
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors hidden sm:block"
            >
              로그인
            </button>
            <button 
              onClick={() => navigate('register')}
              className="px-6 py-2.5 bg-gradient-gold text-gray-900 text-sm font-bold rounded-xl hover-glow-gold transition-all duration-300 ease-out hover:scale-105 active:scale-95 shadow-gold"
            >
              무료로 시작하기
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}