import React, { useState, useEffect } from 'react';
import { AppProvider, AppRouter, useApp } from './app-router';
import { EnhancedToast } from './enhanced-components';
import { useResponsive } from './responsive-optimizations';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, AlertTriangle, Info, Wifi, WifiOff } from 'lucide-react';

export function FinalConnectedApp() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

function AppContent() {
  const { state } = useApp();
  const { isMobile } = useResponsive();
  const [toasts, setToasts] = useState<Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast('인터넷 연결이 복구되었습니다', 'success');
    };

    const handleOffline = () => {
      setIsOnline(false);
      showToast('인터넷 연결이 끊어졌습니다', 'error');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Toast management
  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Loading screen
  if (state.isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Network Status Indicator */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-0 right-0 z-50 bg-error-red text-white p-2 text-center text-body-small"
          >
            <div className="flex items-center justify-center gap-2">
              <WifiOff size={16} />
              <span>오프라인 상태입니다</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main App Router */}
      <div className={!isOnline ? 'pt-10' : ''}>
        <AppRouter />
      </div>

      {/* Toast Notifications */}
      <div className={`fixed top-4 right-4 z-50 space-y-2 ${isMobile ? 'left-4' : ''}`}>
        <AnimatePresence>
          {toasts.map((toast) => (
            <EnhancedToast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              isVisible={true}
              onClose={() => removeToast(toast.id)}
              duration={5000}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Global Accessibility Features */}
      <AccessibilityFeatures />

      {/* Performance Monitor (Dev only) */}
      {process.env.NODE_ENV === 'development' && <PerformanceMonitor />}
    </div>
  );
}

// Loading Screen Component
function LoadingScreen() {
  const [loadingText, setLoadingText] = useState('로딩 중');

  useEffect(() => {
    const texts = ['로딩 중', '로딩 중.', '로딩 중..', '로딩 중...'];
    let index = 0;

    const interval = setInterval(() => {
      setLoadingText(texts[index % texts.length]);
      index++;
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-primary-blue border-t-transparent rounded-full mx-auto mb-4"
        />
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-body text-gray-600"
        >
          {loadingText}
        </motion.div>
      </div>
    </div>
  );
}

// Accessibility Features
function AccessibilityFeatures() {
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Apply font size
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  useEffect(() => {
    // Apply high contrast mode
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    // Apply reduced motion
    if (reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [reducedMotion]);

  // Skip to main content
  const skipToMain = () => {
    const main = document.querySelector('main');
    if (main) {
      main.focus();
      main.scrollIntoView();
    }
  };

  return (
    <>
      {/* Skip Link */}
      <button
        onClick={skipToMain}
        className="sr-only focus:not-sr-only fixed top-4 left-4 z-50 px-4 py-2 bg-primary-blue text-white rounded-lg"
      >
        메인 콘텐츠로 건너뛰기
      </button>

      {/* Accessibility Panel (Hidden by default, can be toggled) */}
      <div className="sr-only">
        <div className="space-y-4">
          <div>
            <label className="block text-label text-gray-700 mb-2">
              글자 크기
            </label>
            <input
              type="range"
              min="14"
              max="20"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
              />
              <span className="text-body">고대비 모드</span>
            </label>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
              />
              <span className="text-body">애니메이션 줄이기</span>
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

// Performance Monitor (Development only)
function PerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    fps: 0,
    memory: 0,
    renderTime: 0
  });

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();

    const measurePerformance = () => {
      frameCount++;
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;

      if (deltaTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / deltaTime);
        const memory = (performance as any).memory ? 
          Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024) : 0;

        setMetrics({
          fps,
          memory,
          renderTime: Math.round(deltaTime / frameCount * 100) / 100
        });

        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(measurePerformance);
    };

    measurePerformance();
  }, []);

  return (
    <div className="fixed bottom-4 left-4 bg-gray-900 text-white p-3 rounded-lg text-caption font-mono z-50">
      <div>FPS: {metrics.fps}</div>
      <div>Memory: {metrics.memory}MB</div>
      <div>Render: {metrics.renderTime}ms</div>
    </div>
  );
}

// Global Error Boundary
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md text-center">
            <div className="w-16 h-16 bg-error-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle size={32} className="text-error-red" />
            </div>
            <h1 className="text-heading-2 text-gray-900 mb-4">
              앱에 오류가 발생했습니다
            </h1>
            <p className="text-body text-gray-600 mb-6">
              페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary-blue text-white rounded-lg hover:bg-primary-blue-dark transition-colors"
            >
              페이지 새로고침
            </button>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 text-left">
                <summary className="text-body-small text-gray-500 cursor-pointer">
                  기술적 세부사항
                </summary>
                <pre className="mt-2 p-3 bg-gray-100 rounded text-caption overflow-auto">
                  {this.state.error?.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Service Worker Registration (for PWA features)
export function registerServiceWorker() {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully');
        
        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.addEventListener('statechange', () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New update available
                  console.log('New content is available; please refresh.');
                } else {
                  // Content is cached for offline use
                  console.log('Content is cached for offline use.');
                }
              }
            });
          }
        });
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    });
  }
}

// CSS Injection for accessibility and responsive improvements
const injectGlobalStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    /* High Contrast Mode */
    .high-contrast {
      filter: contrast(150%) brightness(110%);
    }

    /* Reduced Motion */
    .reduce-motion * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }

    /* Focus Styles */
    *:focus {
      outline: 2px solid var(--primary-blue) !important;
      outline-offset: 2px !important;
    }

    /* Touch Targets */
    @media (max-width: 767px) {
      button, a, input, select, textarea {
        min-height: 44px;
        min-width: 44px;
      }
    }

    /* Smooth Scrolling */
    html {
      scroll-behavior: smooth;
    }

    /* Print Styles */
    @media print {
      * {
        background: white !important;
        color: black !important;
        box-shadow: none !important;
      }
      
      .no-print {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(style);
};

// Initialize global styles
if (typeof document !== 'undefined') {
  injectGlobalStyles();
}