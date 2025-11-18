import { useState, useMemo } from 'react';
import { FeatureCard } from './useDragAndDrop';
import { usePlanLimits } from './usePlanLimits';

export function useFeatureCards(currentPlan: 'Basic' | 'Pro' | 'Enterprise' = 'Basic') {
  const { checkFeatureAccess } = usePlanLimits();

  // 기본 포함 기능 (로그인/회원가입)
  const defaultFeatures: FeatureCard[] = [
    {
      id: 'auth-login',
      type: 'default',
      category: 'auth',
      name: '로그인',
      description: '사용자 로그인 기능',
      icon: '🔐',
      requiredPlan: 'Basic',
      isDefault: true,
      isEnabled: true,
      features: ['email-login', 'social-login', 'password-reset']
    },
    {
      id: 'auth-signup',
      type: 'default',
      category: 'auth',
      name: '회원가입',
      description: '사용자 회원가입 기능',
      icon: '📝',
      requiredPlan: 'Basic',
      isDefault: true,
      isEnabled: true,
      features: ['email-signup', 'profile-setup', 'terms-agreement']
    },
    {
      id: 'auth-profile',
      type: 'default',
      category: 'auth',
      name: '프로필 관리',
      description: '사용자 프로필 정보 관리',
      icon: '👤',
      requiredPlan: 'Basic',
      isDefault: true,
      isEnabled: true,
      features: ['profile-edit', 'password-change', 'account-settings']
    }
  ];

  // 선택 가능한 기능카드들
  const selectableFeatures: FeatureCard[] = [
    // 대시보드 기능카드
    {
      id: 'dashboard-basic',
      type: 'plan-specific',
      category: 'dashboard',
      name: '기본 대시보드',
      description: 'KPI 카드와 기본 차트 제공',
      icon: '📊',
      requiredPlan: 'Basic',
      isDefault: false,
      isEnabled: checkFeatureAccess(currentPlan, 'dashboard'),
      features: ['kpi-cards', 'basic-charts', 'recent-orders']
    },
    {
      id: 'dashboard-pro',
      type: 'plan-specific',
      category: 'dashboard',
      name: '고급 대시보드',
      description: '실시간 새로고침과 상세 차트',
      icon: '📈',
      requiredPlan: 'Pro',
      isDefault: false,
      isEnabled: checkFeatureAccess(currentPlan, 'advancedDashboard'),
      features: ['realtime-refresh', 'detailed-charts', 'custom-widgets']
    },
    {
      id: 'dashboard-enterprise',
      type: 'plan-specific',
      category: 'dashboard',
      name: '엔터프라이즈 대시보드',
      description: '모든 KPI와 고급 분석 차트',
      icon: '🚀',
      requiredPlan: 'Enterprise',
      isDefault: false,
      isEnabled: checkFeatureAccess(currentPlan, 'enterpriseDashboard'),
      features: ['all-kpis', 'advanced-analytics', 'predictive-charts']
    },

    // 메뉴 관리 기능카드
    {
      id: 'menu-basic',
      type: 'plan-specific',
      category: 'menu',
      name: '기본 메뉴 관리',
      description: '메뉴 CRUD와 카테고리 관리',
      icon: '🍕',
      requiredPlan: 'Basic',
      isDefault: false,
      isEnabled: checkFeatureAccess(currentPlan, 'menuManagement'),
      features: ['menu-crud', 'category-management', 'basic-options']
    },
    {
      id: 'menu-pro',
      type: 'plan-specific',
      category: 'menu',
      name: '고급 메뉴 관리',
      description: '옵션 관리, 재고 관리, 이미지 업로드',
      icon: '🍽️',
      requiredPlan: 'Pro',
      isDefault: false,
      isEnabled: checkFeatureAccess(currentPlan, 'advancedMenuManagement'),
      features: ['option-management', 'inventory-tracking', 'image-upload']
    },
    {
      id: 'menu-enterprise',
      type: 'plan-specific',
      category: 'menu',
      name: '엔터프라이즈 메뉴',
      description: '고급 옵션, 자동 재고, 메뉴 분석',
      icon: '🏪',
      requiredPlan: 'Enterprise',
      isDefault: false,
      isEnabled: checkFeatureAccess(currentPlan, 'enterpriseMenuManagement'),
      features: ['advanced-options', 'auto-inventory', 'menu-analytics']
    },

    // 주문 관리 기능카드
    {
      id: 'order-basic',
      type: 'plan-specific',
      category: 'order',
      name: '기본 주문 관리',
      description: '주문 목록과 상태 관리',
      icon: '📦',
      requiredPlan: 'Basic',
      isDefault: false,
      isEnabled: checkFeatureAccess(currentPlan, 'orderManagement'),
      features: ['order-list', 'status-management', 'basic-details']
    },
    {
      id: 'order-pro',
      type: 'plan-specific',
      category: 'order',
      name: '고급 주문 관리',
      description: '주문 검색/필터, 결제 정보',
      icon: '📋',
      requiredPlan: 'Pro',
      isDefault: false,
      isEnabled: checkFeatureAccess(currentPlan, 'advancedOrderManagement'),
      features: ['order-search', 'advanced-filters', 'payment-details']
    },
    {
      id: 'order-enterprise',
      type: 'plan-specific',
      category: 'order',
      name: '엔터프라이즈 주문',
      description: '고급 주문 분석, 자동 처리',
      icon: '⚡',
      requiredPlan: 'Enterprise',
      isDefault: false,
      isEnabled: checkFeatureAccess(currentPlan, 'enterpriseOrderManagement'),
      features: ['order-analytics', 'auto-processing', 'bulk-operations']
    },

    // 고객 관리 기능카드
    {
      id: 'customer-basic',
      type: 'plan-specific',
      category: 'customer',
      name: '기본 고객 관리',
      description: '고객 목록과 기본 정보',
      icon: '👥',
      requiredPlan: 'Basic',
      isDefault: false,
      isEnabled: checkFeatureAccess(currentPlan, 'customerManagement'),
      features: ['customer-list', 'basic-info', 'contact-details']
    },
    {
      id: 'customer-pro',
      type: 'plan-specific',
      category: 'customer',
      name: '고급 고객 관리',
      description: '고객 등급, 충성도 포인트',
      icon: '⭐',
      requiredPlan: 'Pro',
      isDefault: false,
      isEnabled: checkFeatureAccess(currentPlan, 'advancedCustomerManagement'),
      features: ['customer-tiers', 'loyalty-points', 'purchase-history']
    },
    {
      id: 'customer-enterprise',
      type: 'plan-specific',
      category: 'customer',
      name: '고객 세분화',
      description: '고급 고객 분석과 세분화',
      icon: '🎯',
      requiredPlan: 'Enterprise',
      isDefault: false,
      isEnabled: checkFeatureAccess(currentPlan, 'customerSegmentation'),
      features: ['customer-segmentation', 'behavior-analysis', 'predictive-analytics']
    },

    // 매출 분석 기능카드
    {
      id: 'analytics-basic',
      type: 'plan-specific',
      category: 'analytics',
      name: '기본 매출 분석',
      description: '기본 매출 분석과 리포트',
      icon: '📊',
      requiredPlan: 'Basic',
      isDefault: false,
      isEnabled: checkFeatureAccess(currentPlan, 'salesAnalytics'),
      features: ['basic-sales-reports', 'daily-summary', 'monthly-trends']
    },
    {
      id: 'analytics-pro',
      type: 'plan-specific',
      category: 'analytics',
      name: '고급 매출 분석',
      description: '시간대별 분석, 상세 모달',
      icon: '📈',
      requiredPlan: 'Pro',
      isDefault: false,
      isEnabled: checkFeatureAccess(currentPlan, 'advancedAnalytics'),
      features: ['hourly-analysis', 'detailed-modals', 'comparative-reports']
    },
    {
      id: 'analytics-enterprise',
      type: 'plan-specific',
      category: 'analytics',
      name: '고급 분석 리포트',
      description: '고급 분석 리포트, 예측 분석',
      icon: '🚀',
      requiredPlan: 'Enterprise',
      isDefault: false,
      isEnabled: checkFeatureAccess(currentPlan, 'advancedAnalyticsReport'),
      features: ['advanced-reports', 'predictive-analytics', 'ai-insights']
    },

    // 상점 설정 기능카드
    {
      id: 'settings-basic',
      type: 'plan-specific',
      category: 'settings',
      name: '기본 상점 설정',
      description: '기본 정보와 운영 시간',
      icon: '⚙️',
      requiredPlan: 'Basic',
      isDefault: false,
      isEnabled: checkFeatureAccess(currentPlan, 'storeSettings'),
      features: ['basic-info', 'operating-hours', 'contact-info']
    },
    {
      id: 'settings-pro',
      type: 'plan-specific',
      category: 'settings',
      name: '고급 상점 설정',
      description: '브랜딩, 알림 설정',
      icon: '🎨',
      requiredPlan: 'Pro',
      isDefault: false,
      isEnabled: checkFeatureAccess(currentPlan, 'advancedStoreSettings'),
      features: ['branding', 'notification-settings', 'advanced-preferences']
    },
    {
      id: 'settings-enterprise',
      type: 'plan-specific',
      category: 'settings',
      name: '엔터프라이즈 설정',
      description: '고급 브랜딩, 다중 상점 관리',
      icon: '🏢',
      requiredPlan: 'Enterprise',
      isDefault: false,
      isEnabled: checkFeatureAccess(currentPlan, 'enterpriseStoreSettings'),
      features: ['advanced-branding', 'multi-store', 'enterprise-features']
    },

    // 포인트 적립 시스템 (Pro/Enterprise)
    {
      id: 'points-pro',
      type: 'plan-specific',
      category: 'points',
      name: '포인트 적립',
      description: 'n% 적립, 스탬프 적립, 포인트 사용',
      icon: '🎁',
      requiredPlan: 'Pro',
      isDefault: false,
      isEnabled: checkFeatureAccess(currentPlan, 'loyaltyProgram'),
      features: ['percentage-points', 'stamp-system', 'point-redemption']
    },
    {
      id: 'points-enterprise',
      type: 'plan-specific',
      category: 'points',
      name: '고급 포인트 시스템',
      description: '고급 포인트 시스템과 분석',
      icon: '💎',
      requiredPlan: 'Enterprise',
      isDefault: false,
      isEnabled: checkFeatureAccess(currentPlan, 'advancedLoyaltyProgram'),
      features: ['advanced-points', 'loyalty-analytics', 'tier-benefits']
    }
  ];

  // Coming Soon 카드들 (Enterprise)
  const comingSoonFeatures: FeatureCard[] = [
    {
      id: 'coming-seasonal-menu',
      type: 'coming-soon',
      category: 'menu',
      name: '계절 메뉴 관리',
      description: '계절별 메뉴 자동 관리 시스템',
      icon: '🌸',
      requiredPlan: 'Enterprise',
      isDefault: false,
      isEnabled: false,
      features: ['seasonal-scheduling', 'auto-rotation', 'seasonal-analytics']
    },
    {
      id: 'coming-multi-store',
      type: 'coming-soon',
      category: 'settings',
      name: '다중 상점 관리',
      description: '여러 매장을 통합 관리',
      icon: '🏪',
      requiredPlan: 'Enterprise',
      isDefault: false,
      isEnabled: false,
      features: ['multi-store-dashboard', 'centralized-management', 'cross-store-analytics']
    },
    {
      id: 'coming-marketing',
      type: 'coming-soon',
      category: 'customer',
      name: '고급 마케팅 도구',
      description: '자동화된 마케팅 캠페인',
      icon: '📢',
      requiredPlan: 'Enterprise',
      isDefault: false,
      isEnabled: false,
      features: ['automated-campaigns', 'email-marketing', 'social-media-integration']
    },
    {
      id: 'coming-inventory',
      type: 'coming-soon',
      category: 'menu',
      name: '재고 관리 시스템',
      description: '실시간 재고 추적과 자동 주문',
      icon: '📦',
      requiredPlan: 'Enterprise',
      isDefault: false,
      isEnabled: false,
      features: ['real-time-tracking', 'auto-ordering', 'supplier-integration']
    },
    {
      id: 'coming-competitor',
      type: 'coming-soon',
      category: 'analytics',
      name: '경쟁업체 비교',
      description: '경쟁업체 분석과 시장 동향',
      icon: '🔍',
      requiredPlan: 'Enterprise',
      isDefault: false,
      isEnabled: false,
      features: ['competitor-analysis', 'market-trends', 'pricing-optimization']
    },
    {
      id: 'coming-api',
      type: 'coming-soon',
      category: 'settings',
      name: 'API 연동',
      description: '외부 시스템과의 API 연동',
      icon: '🔗',
      requiredPlan: 'Enterprise',
      isDefault: false,
      isEnabled: false,
      features: ['rest-api', 'webhook-support', 'third-party-integrations']
    },
    {
      id: 'coming-security',
      type: 'coming-soon',
      category: 'settings',
      name: '고급 보안',
      description: '고급 보안 기능과 감사 로그',
      icon: '🔒',
      requiredPlan: 'Enterprise',
      isDefault: false,
      isEnabled: false,
      features: ['advanced-encryption', 'audit-logs', 'compliance-tools']
    }
  ];

  // 플랜별 필터링된 카드들
  const availableFeatures = useMemo(() => {
    return selectableFeatures.filter(card => {
      // 플랜별 접근 권한 체크
      const planOrder = { 'Basic': 1, 'Pro': 2, 'Enterprise': 3 };
      const currentPlanLevel = planOrder[currentPlan];
      const requiredPlanLevel = planOrder[card.requiredPlan];
      
      return currentPlanLevel >= requiredPlanLevel;
    });
  }, [currentPlan, selectableFeatures]);

  // 카테고리별 그룹핑
  const featuresByCategory = useMemo(() => {
    const categories = {
      auth: defaultFeatures.filter(card => card.category === 'auth'),
      dashboard: availableFeatures.filter(card => card.category === 'dashboard'),
      menu: availableFeatures.filter(card => card.category === 'menu'),
      order: availableFeatures.filter(card => card.category === 'order'),
      customer: availableFeatures.filter(card => card.category === 'customer'),
      analytics: availableFeatures.filter(card => card.category === 'analytics'),
      settings: availableFeatures.filter(card => card.category === 'settings'),
      points: availableFeatures.filter(card => card.category === 'points'),
      comingSoon: comingSoonFeatures
    };

    return categories;
  }, [defaultFeatures, availableFeatures, comingSoonFeatures]);

  return {
    defaultFeatures,
    selectableFeatures,
    comingSoonFeatures,
    availableFeatures,
    featuresByCategory,
    currentPlan
  };
}