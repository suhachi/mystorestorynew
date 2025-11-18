// MyStoreStory 플랜별 제한 상수 정의
// 각 플랜별 기능 제한 및 허용 사항 명시

export const PLAN_LIMITS = {
  basic: {
    // 메뉴 관리 제한
    menuItems: 10,           // 최대 메뉴 수
    menuOptions: 3,          // 메뉴당 최대 옵션 수
    categories: 3,           // 최대 카테고리 수
    menuImages: 'basic',     // 이미지 품질 제한
    
    // 주문 관리 제한
    orderHistoryDays: 7,     // 주문 이력 조회 기간 (일)
    orderSearchFilters: ['status', 'date'], // 검색 필터 제한
    orderAnalytics: false,   // 주문 분석 기능
    
    // 고객 관리 제한
    customerTiers: false,    // 고객 등급 시스템
    customerSegmentation: false, // 고객 세분화
    loyaltyProgram: false,   // 충성도 프로그램
    advancedLoyaltyProgram: false, // 고급 충성도 프로그램
    customerAnalytics: false, // 고객 분석
    
    // 매출 분석 제한
    advancedAnalytics: false, // 고급 분석 도구
    salesPrediction: false,  // 매출 예측
    comparisonAnalysis: false, // 비교 분석
    customReports: false,    // 커스텀 리포트
    
    // 상점 설정 제한
    apiAccess: false,        // API 접근
    multiStore: false,       // 다중 상점 관리
    customDomain: false,     // 커스텀 도메인
    whiteLabel: false,       // 화이트라벨
    multiUser: false,        // 다중 사용자 관리
    
    // 마케팅 도구 제한
    emailMarketing: false,   // 이메일 마케팅
    smsMarketing: false,     // SMS 마케팅
    pushNotifications: false, // 푸시 알림
    couponSystem: false,     // 쿠폰 시스템
    
    // 지원 제한
    phoneSupport: false,     // 전화 지원
    dedicatedManager: false, // 전담 매니저
    consulting: false,       // 컨설팅 서비스
    prioritySupport: false   // 우선 지원
  },
  
  pro: {
    // 메뉴 관리 제한
    menuItems: 50,           // 최대 메뉴 수
    menuOptions: 10,         // 메뉴당 최대 옵션 수
    categories: 10,          // 최대 카테고리 수
    menuImages: 'high',      // 고화질 이미지
    
    // 주문 관리 제한
    orderHistoryDays: 30,    // 주문 이력 조회 기간 (일)
    orderSearchFilters: ['status', 'date', 'customer', 'amount'], // 검색 필터
    orderAnalytics: true,    // 주문 분석 기능
    
    // 고객 관리 제한
    customerTiers: true,     // 고객 등급 시스템
    customerSegmentation: true, // 고객 세분화
    loyaltyProgram: true,    // 충성도 프로그램
    advancedLoyaltyProgram: false, // 고급 충성도 프로그램
    customerAnalytics: true, // 고객 분석
    
    // 매출 분석 제한
    advancedAnalytics: true, // 고급 분석 도구
    salesPrediction: false,  // 매출 예측 (Pro에서는 제한)
    comparisonAnalysis: true, // 비교 분석
    customReports: false,    // 커스텀 리포트 (Pro에서는 제한)
    
    // 상점 설정 제한
    apiAccess: false,        // API 접근 (Pro에서는 제한)
    multiStore: false,       // 다중 상점 관리 (Pro에서는 제한)
    customDomain: false,     // 커스텀 도메인 (Pro에서는 제한)
    whiteLabel: false,       // 화이트라벨 (Pro에서는 제한)
    multiUser: false,        // 다중 사용자 관리 (Pro에서는 제한)
    
    // 마케팅 도구 제한
    emailMarketing: true,    // 이메일 마케팅
    smsMarketing: false,     // SMS 마케팅 (Pro에서는 제한)
    pushNotifications: true, // 푸시 알림
    couponSystem: true,      // 쿠폰 시스템
    
    // 지원 제한
    phoneSupport: false,     // 전화 지원 (Pro에서는 제한)
    dedicatedManager: false, // 전담 매니저 (Pro에서는 제한)
    consulting: false,       // 컨설팅 서비스 (Pro에서는 제한)
    prioritySupport: true    // 우선 지원
  },
  
  enterprise: {
    // 메뉴 관리 제한
    menuItems: -1,           // 무제한
    menuOptions: -1,         // 무제한
    categories: -1,          // 무제한
    menuImages: 'all',       // 모든 이미지 옵션
    
    // 주문 관리 제한
    orderHistoryDays: -1,    // 전체 기간
    orderSearchFilters: 'all', // 모든 검색 필터
    orderAnalytics: true,    // 주문 분석 기능
    
    // 고객 관리 제한
    customerTiers: true,     // 고객 등급 시스템
    customerSegmentation: true, // 고객 세분화
    loyaltyProgram: true,    // 충성도 프로그램
    advancedLoyaltyProgram: true, // 고급 충성도 프로그램
    customerAnalytics: true, // 고객 분석
    
    // 매출 분석 제한
    advancedAnalytics: true, // 고급 분석 도구
    salesPrediction: true,   // 매출 예측
    comparisonAnalysis: true, // 비교 분석
    customReports: true,     // 커스텀 리포트
    
    // 상점 설정 제한
    apiAccess: true,         // API 접근
    multiStore: true,        // 다중 상점 관리
    customDomain: true,      // 커스텀 도메인
    whiteLabel: true,        // 화이트라벨
    multiUser: true,         // 다중 사용자 관리
    
    // 마케팅 도구 제한
    emailMarketing: true,    // 이메일 마케팅
    smsMarketing: true,      // SMS 마케팅
    pushNotifications: true, // 푨시 알림
    couponSystem: true,      // 쿠폰 시스템
    
    // 지원 제한
    phoneSupport: true,      // 전화 지원
    dedicatedManager: true,  // 전담 매니저
    consulting: true,        // 컨설팅 서비스
    prioritySupport: true    // 우선 지원
  }
};

// 플랜별 제한 체크 함수들
export const checkPlanLimit = (plan: string, feature: string, value?: any): boolean => {
  const limits = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS];
  if (!limits) return false;
  
  const limit = limits[feature as keyof typeof limits];
  if (limit === true) return true;
  if (limit === false) return false;
  if (typeof limit === 'number') {
    if (limit === -1) return true; // 무제한
    return value ? value <= limit : true;
  }
  
  return true;
};

// 플랜별 제한 정보 가져오기
export const getPlanLimit = (plan: string, feature: string): any => {
  const limits = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS];
  return limits ? limits[feature as keyof typeof limits] : null;
};

// 플랜별 제한 메시지 생성
export const getLimitMessage = (plan: string, feature: string, currentValue?: any): string => {
  const limit = getPlanLimit(plan, feature);
  
  if (limit === true) return '사용 가능';
  if (limit === false) {
    const requiredPlan = getRequiredPlan(feature);
    return `이 기능은 ${requiredPlan} 플랜에서만 사용할 수 있습니다.`;
  }
  
  if (typeof limit === 'number') {
    if (limit === -1) return '무제한 사용 가능';
    if (currentValue && currentValue > limit) {
      return `${getFeatureName(feature)}은(는) ${limit}개까지만 사용할 수 있습니다. (현재: ${currentValue}개)`;
    }
    return `${getFeatureName(feature)}은(는) ${limit}개까지 사용할  있습니다.`;
  }
  
  return '제한 정보 없음';
};

// 기능별 한국어 이름 매핑
const getFeatureName = (feature: string): string => {
  const featureNames: { [key: string]: string } = {
    menuItems: '메뉴 항목',
    menuOptions: '메뉴 옵션',
    categories: '카테고리',
    orderHistoryDays: '주문 이력 조회 기간',
    customerTiers: '고객 등급 시스템',
    customerSegmentation: '고객 세분화',
    loyaltyProgram: '충성도 프로그램',
    advancedLoyaltyProgram: '고급 충성도 프로그램',
    customerAnalytics: '고객 분석',
    advancedAnalytics: '고급 분석',
    salesPrediction: '매출 예측',
    comparisonAnalysis: '비교 분석',
    customReports: '커스텀 리포트',
    apiAccess: 'API 접근',
    multiStore: '다중 상점 관리',
    customDomain: '커스텀 도메인',
    whiteLabel: '화이트라벨',
    multiUser: '다중 사용자 관리',
    emailMarketing: '이메일 마케팅',
    smsMarketing: 'SMS 마케팅',
    pushNotifications: '푸시 알림',
    couponSystem: '폰 시스템',
    phoneSupport: '전화 지원',
    dedicatedManager: '전담 매니저',
    consulting: '컨설팅 서비스',
    prioritySupport: '우선 지원'
  };
  
  return featureNames[feature] || feature;
};

// 기능별 필요한 플랜 결정
const getRequiredPlan = (feature: string): string => {
  const enterpriseFeatures = [
    'apiAccess', 'multiStore', 'customDomain', 'whiteLabel', 'multiUser', 
    'salesPrediction', 'customReports', 'smsMarketing', 
    'phoneSupport', 'dedicatedManager', 'consulting', 'advancedLoyaltyProgram'
  ];
  
  const proFeatures = [
    'customerTiers', 'customerSegmentation', 'loyaltyProgram', 'customerAnalytics',
    'advancedAnalytics', 'comparisonAnalysis', 'orderAnalytics',
    'emailMarketing', 'pushNotifications', 'couponSystem', 'prioritySupport'
  ];
  
  if (enterpriseFeatures.includes(feature)) {
    return 'Enterprise';
  } else if (proFeatures.includes(feature)) {
    return 'Pro';
  }
  
  return 'Basic';
};

// 플랜별 업그레이드 메시지
export const getUpgradeMessage = (currentPlan: string, feature: string): string => {
  const requiredPlan = getRequiredPlan(feature);
  const featureName = getFeatureName(feature);
  
  const messages = {
    basic: {
      pro: `${featureName}을(를) 사용하려면 Pro 플랜으로 업그레이드하세요.`,
      enterprise: `${featureName}을(를) 사용하려면 Enterprise 플랜으로 업그레이드하세요.`
    },
    pro: {
      enterprise: `${featureName}을(를) 사용하려면 Enterprise 플랜으로 업그레이드하세요.`
    }
  };
  
  const planMessages = messages[currentPlan as keyof typeof messages];
  if (!planMessages) return '업그레이드가 필요합니다.';
  
  if (requiredPlan === 'Enterprise') {
    return planMessages.enterprise || 'Enterprise 플랜이 필요합니다.';
  } else if (requiredPlan === 'Pro' && currentPlan === 'basic') {
    return planMessages.pro || 'Pro 플랜이 필요합니다.';
  }
  
  return '업그레이드가 필요합니다.';
};

// 플랜별 가격 정보 (실제 가격은 별도 관리)
export const PLAN_PRICING = {
  basic: {
    monthly: 29000,
    yearly: 290000,
    yearlyDiscount: 2
  },
  pro: {
    monthly: 79000,
    yearly: 790000,
    yearlyDiscount: 2
  },
  enterprise: {
    monthly: 199000,
    yearly: 1990000,
    yearlyDiscount: 2
  }
};

// 플랜별 특징 요약
export const PLAN_FEATURES = {
  basic: {
    name: 'Basic',
    description: '개인 창업자를 위한 기본 플랜',
    highlights: [
      '최대 10개 메뉴',
      '7일 주문 이력',
      '기본 분석',
      '이메일 지원'
    ]
  },
  pro: {
    name: 'Pro',
    description: '성장하는 비즈니스를 위한 고급 플랜',
    highlights: [
      '최대 50개 메뉴',
      '30일 주문 이력',
      '고급 분석 + 고객 관리',
      '마케팅 도구 + 우선 지원'
    ]
  },
  enterprise: {
    name: 'Enterprise',
    description: '대규모 비즈니스를 위한 무제한 플랜',
    highlights: [
      '무제한 메뉴 + 다중 상점',
      '전체 기간 데이터',
      '모든 고급 기능 + API',
      '전담 매니저 + 컨설팅'
    ]
  }
};

// 플랜 비교를 위한 유틸리티 함수
export const comparePlans = (planA: string, planB: string): number => {
  const planOrder = { basic: 1, pro: 2, enterprise: 3 };
  return planOrder[planA as keyof typeof planOrder] - planOrder[planB as keyof typeof planOrder];
};

// 플랜 업그레이드 체크
export const canDowngrade = (currentPlan: string, targetPlan: string, currentUsage: any): boolean => {
  if (comparePlans(currentPlan, targetPlan) <= 0) return true;
  
  const targetLimits = PLAN_LIMITS[targetPlan as keyof typeof PLAN_LIMITS];
  
  // 현재 사용량이 타겟 플랜의 제한을 초과하는지 체크
  for (const [feature, usage] of Object.entries(currentUsage)) {
    const limit = targetLimits[feature as keyof typeof targetLimits];
    if (typeof limit === 'number' && limit !== -1 && usage > limit) {
      return false;
    }
    if (limit === false && usage > 0) {
      return false;
    }
  }
  
  return true;
};