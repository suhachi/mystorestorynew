import React, { createContext, useContext, useReducer, useEffect } from 'react';

// 데이터 타입 정의
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: 'basic' | 'pro' | 'enterprise';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  createdAt: string;
  lastLogin?: string;
}

export interface Store {
  id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  businessNumber?: string;
  ownerId: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  createdAt: string;
  logo?: string;
  coverImage?: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
  operatingHours: {
    [key: string]: { open: string; close: string; closed: boolean };
  };
}

export interface AppBuilderData {
  step: number;
  subdomain: string;
  subdomainError: string;
  storeInfo: {
    name: string;
    description: string;
    category: string; // 업종 선택
    address: string;
    phone: string;
    operatingHours: any;
    ownerInfo: {
      name: string;
      phone: string;
      email: string;
      businessNumber: string;
    };
  };
  
  // 2단계: 플랜 선택 & 핵심 기능
  planSelection: {
    selectedPlan: 'basic' | 'pro' | 'enterprise';
    selectedFeatures: {
      dashboard: 'basic' | 'pro' | 'enterprise';
      menu: 'basic' | 'pro' | 'enterprise';
    };
  };
  
  // 3단계: 주문 & 결제 설정
  orderPayment: {
    orderModes: {
      pickup: boolean;
      delivery: boolean;
      reservation: boolean;
    };
    paymentSettings: {
      methods: string[];
      minOrderAmount: number;
      deliveryFee: number;
      freeDeliveryThreshold: number;
    };
  };
  
  // 4단계: 고객 관리 & 마케팅
  customerMarketing: {
    customerManagement: {
      enabled: boolean;
      level: 'basic' | 'pro' | 'enterprise';
    };
    marketingTools: {
      coupons: boolean;
      points: boolean;
      level: 'basic' | 'pro' | 'enterprise';
    };
    analytics: {
      enabled: boolean;
      level: 'basic' | 'pro' | 'enterprise';
    };
  };
  
  // 5단계: 브랜딩 (기존 확장)
  branding: {
    logo?: string;
    coverImage?: string;
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
  
  // 기존 필드들 유지 (하위 호환성)
  features: string[];
  theme: {
    templateId: string;
    customizations: any;
  };
  menu: {
    categories: MenuCategory[];
    items: MenuItem[];
  };
  payment: {
    methods: string[];
    minOrderAmount: number;
    maxOrderAmount: number;
    deliveryFee: number;
    freeDeliveryThreshold: number;
    deliveryAreas: string[];
  };
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
    templates: any;
  };
  finalSettings: {
    appName: string;
    description: string;
    icon?: string;
    splashScreen?: string;
    domain?: string;
  };
}

export interface MenuCategory {
  id: string;
  name: string;
  order: number;
  active: boolean;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  options: MenuOption[];
  popular: boolean;
  available: boolean;
  inventory?: number;
}

export interface MenuOption {
  id: string;
  name: string;
  type: 'size' | 'extra' | 'choice';
  choices: {
    name: string;
    price: number;
  }[];
  required: boolean;
}

// 업종별 기본 설정 추가
export const CATEGORY_DEFAULTS = {
  korean: {
    name: '한식',
    icon: '🍚',
    color: 'bg-red-50 border-red-200',
    defaultSettings: {
      operatingHours: {
        monday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
        tuesday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
        wednesday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
        thursday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
        friday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
        saturday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
        sunday: { isOpen: false, openTime: '09:00', closeTime: '22:00' }
      }
    }
  },
  western: {
    name: '양식',
    icon: '🍝',
    color: 'bg-blue-50 border-blue-200',
    defaultSettings: {
      operatingHours: {
        monday: { isOpen: true, openTime: '11:00', closeTime: '22:00' },
        tuesday: { isOpen: true, openTime: '11:00', closeTime: '22:00' },
        wednesday: { isOpen: true, openTime: '11:00', closeTime: '22:00' },
        thursday: { isOpen: true, openTime: '11:00', closeTime: '22:00' },
        friday: { isOpen: true, openTime: '11:00', closeTime: '23:00' },
        saturday: { isOpen: true, openTime: '11:00', closeTime: '23:00' },
        sunday: { isOpen: true, openTime: '11:00', closeTime: '22:00' }
      }
    }
  },
  chinese: {
    name: '중식',
    icon: '🥟',
    color: 'bg-yellow-50 border-yellow-200',
    defaultSettings: {
      operatingHours: {
        monday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
        tuesday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
        wednesday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
        thursday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
        friday: { isOpen: true, openTime: '10:00', closeTime: '23:00' },
        saturday: { isOpen: true, openTime: '10:00', closeTime: '23:00' },
        sunday: { isOpen: true, openTime: '10:00', closeTime: '22:00' }
      }
    }
  },
  japanese: {
    name: '일식',
    icon: '🍣',
    color: 'bg-green-50 border-green-200',
    defaultSettings: {
      operatingHours: {
        monday: { isOpen: true, openTime: '11:30', closeTime: '22:00' },
        tuesday: { isOpen: true, openTime: '11:30', closeTime: '22:00' },
        wednesday: { isOpen: true, openTime: '11:30', closeTime: '22:00' },
        thursday: { isOpen: true, openTime: '11:30', closeTime: '22:00' },
        friday: { isOpen: true, openTime: '11:30', closeTime: '23:00' },
        saturday: { isOpen: true, openTime: '11:30', closeTime: '23:00' },
        sunday: { isOpen: true, openTime: '11:30', closeTime: '22:00' }
      }
    }
  },
  snack: {
    name: '분식',
    icon: '🍜',
    color: 'bg-orange-50 border-orange-200',
    defaultSettings: {
      operatingHours: {
        monday: { isOpen: true, openTime: '08:00', closeTime: '21:00' },
        tuesday: { isOpen: true, openTime: '08:00', closeTime: '21:00' },
        wednesday: { isOpen: true, openTime: '08:00', closeTime: '21:00' },
        thursday: { isOpen: true, openTime: '08:00', closeTime: '21:00' },
        friday: { isOpen: true, openTime: '08:00', closeTime: '21:00' },
        saturday: { isOpen: true, openTime: '08:00', closeTime: '21:00' },
        sunday: { isOpen: true, openTime: '08:00', closeTime: '21:00' }
      }
    }
  },
  jokbal: {
    name: '족발',
    icon: '🍖',
    color: 'bg-purple-50 border-purple-200',
    defaultSettings: {
      operatingHours: {
        monday: { isOpen: true, openTime: '16:00', closeTime: '02:00' },
        tuesday: { isOpen: true, openTime: '16:00', closeTime: '02:00' },
        wednesday: { isOpen: true, openTime: '16:00', closeTime: '02:00' },
        thursday: { isOpen: true, openTime: '16:00', closeTime: '02:00' },
        friday: { isOpen: true, openTime: '16:00', closeTime: '03:00' },
        saturday: { isOpen: true, openTime: '16:00', closeTime: '03:00' },
        sunday: { isOpen: true, openTime: '16:00', closeTime: '02:00' }
      }
    }
  },
  cafe: {
    name: '카페/베이커리',
    icon: '☕',
    color: 'bg-amber-50 border-amber-200',
    defaultSettings: {
      operatingHours: {
        monday: { isOpen: true, openTime: '07:00', closeTime: '22:00' },
        tuesday: { isOpen: true, openTime: '07:00', closeTime: '22:00' },
        wednesday: { isOpen: true, openTime: '07:00', closeTime: '22:00' },
        thursday: { isOpen: true, openTime: '07:00', closeTime: '22:00' },
        friday: { isOpen: true, openTime: '07:00', closeTime: '23:00' },
        saturday: { isOpen: true, openTime: '08:00', closeTime: '23:00' },
        sunday: { isOpen: true, openTime: '08:00', closeTime: '22:00' }
      }
    }
  },
  pizza: {
    name: '피자',
    icon: '🍕',
    color: 'bg-red-50 border-red-200',
    defaultSettings: {
      operatingHours: {
        monday: { isOpen: true, openTime: '11:00', closeTime: '23:00' },
        tuesday: { isOpen: true, openTime: '11:00', closeTime: '23:00' },
        wednesday: { isOpen: true, openTime: '11:00', closeTime: '23:00' },
        thursday: { isOpen: true, openTime: '11:00', closeTime: '23:00' },
        friday: { isOpen: true, openTime: '11:00', closeTime: '24:00' },
        saturday: { isOpen: true, openTime: '11:00', closeTime: '24:00' },
        sunday: { isOpen: true, openTime: '11:00', closeTime: '23:00' }
      }
    }
  },
  chicken: {
    name: '치킨',
    icon: '🍗',
    color: 'bg-yellow-50 border-yellow-200',
    defaultSettings: {
      operatingHours: {
        monday: { isOpen: true, openTime: '15:00', closeTime: '01:00' },
        tuesday: { isOpen: true, openTime: '15:00', closeTime: '01:00' },
        wednesday: { isOpen: true, openTime: '15:00', closeTime: '01:00' },
        thursday: { isOpen: true, openTime: '15:00', closeTime: '01:00' },
        friday: { isOpen: true, openTime: '15:00', closeTime: '02:00' },
        saturday: { isOpen: true, openTime: '15:00', closeTime: '02:00' },
        sunday: { isOpen: true, openTime: '15:00', closeTime: '01:00' }
      }
    }
  },
  other: {
    name: '기타',
    icon: '🍽️',
    color: 'bg-gray-50 border-gray-200',
    defaultSettings: {
      operatingHours: {
        monday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
        tuesday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
        wednesday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
        thursday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
        friday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
        saturday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
        sunday: { isOpen: true, openTime: '09:00', closeTime: '22:00' }
      }
    }
  }
};

// 플랜별 제한사항 관리
export const PLAN_LIMITS = {
  Basic: {
    price: '29,000원/월',
    features: ['기본 기능', '최대 10개 메뉴', '기본 분석'],
    restrictions: ['사업자 정보 불필요', '영업시간 설정 불필요'],
    requiredFields: ['name', 'phone', 'address']
  },
  Pro: {
    price: '79,000원/월',
    features: ['고급 기능', '최대 50개 메뉴', '고급 분석', '포인트 적립'],
    restrictions: ['사업자 정보 필수', '영업시간 설정 선택'],
    requiredFields: ['name', 'phone', 'address', 'businessNumber', 'ownerName']
  },
  Enterprise: {
    price: '199,000원/월',
    features: ['모든 기능', '무제한 메뉴', '고급 분석', '고급 포인트', '쿠폰 시스템'],
    restrictions: ['사업자 정보 필수', '영업시간 설정 필수'],
    requiredFields: ['name', 'phone', 'address', 'businessNumber', 'ownerName', 'operatingHours']
  }
};

export interface Order {
  id: string;
  storeId: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryAddress: string;
  customerPhone: string;
  paymentMethod: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';
  createdAt: string;
  deliveryTime?: string;
  specialRequests?: string;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  options: {
    name: string;
    choice: string;
    price: number;
  }[];
}

// 액션 타입 정의
type DataAction =
  | { type: 'SET_CURRENT_USER'; payload: User | null }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: { id: string; updates: Partial<User> } }
  | { type: 'DELETE_USER'; payload: string }
  | { type: 'SET_STORES'; payload: Store[] }
  | { type: 'ADD_STORE'; payload: Store }
  | { type: 'UPDATE_STORE'; payload: { id: string; updates: Partial<Store> } }
  | { type: 'DELETE_STORE'; payload: string }
  | { type: 'SET_APP_BUILDER_DATA'; payload: Partial<AppBuilderData> }
  | { type: 'UPDATE_APP_BUILDER_STEP'; payload: number }
  | { type: 'RESET_APP_BUILDER_DATA' }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER'; payload: { id: string; updates: Partial<Order> } }
  | { type: 'SET_LOADING'; payload: { key: string; loading: boolean } }
  | { type: 'SET_ERROR'; payload: { key: string; error: string | null } };

// 상태 타입 정의
interface DataState {
  currentUser: User | null;
  users: User[];
  stores: Store[];
  appBuilderData: AppBuilderData;
  orders: Order[];
  loading: { [key: string]: boolean };
  errors: { [key: string]: string | null };
}

// 초기 상태
const initialAppBuilderData: AppBuilderData = {
  step: 1,
  subdomain: '',
  subdomainError: '',
  storeInfo: {
    name: '',
    description: '',
    category: '', // 업종 선택
    address: '',
    phone: '',
    operatingHours: {
      monday: { open: '09:00', close: '22:00', closed: false },
      tuesday: { open: '09:00', close: '22:00', closed: false },
      wednesday: { open: '09:00', close: '22:00', closed: false },
      thursday: { open: '09:00', close: '22:00', closed: false },
      friday: { open: '09:00', close: '22:00', closed: false },
      saturday: { open: '09:00', close: '22:00', closed: false },
      sunday: { open: '09:00', close: '22:00', closed: false }
    },
    ownerInfo: {
      name: '',
      phone: '',
      email: '',
      businessNumber: ''
    }
  },
  
  // 2단계: 플랜 선택 & 핵심 기능
  planSelection: {
    selectedPlan: 'Basic',
    selectedFeatures: {
      dashboard: 'basic',
      menu: 'basic'
    }
  },
  
  // 3단계: 주문 & 결제 설정
  orderPayment: {
    orderModes: {
      pickup: true,
      delivery: false,
      reservation: false
    },
    paymentSettings: {
      methods: ['card'],
      minOrderAmount: 0,
      deliveryFee: 3000,
      freeDeliveryThreshold: 20000
    }
  },
  
  // 4단계: 고객 관리 & 마케팅
  customerMarketing: {
    customerManagement: {
      enabled: true,
      level: 'basic'
    },
    marketingTools: {
      coupons: false,
      points: false,
      level: 'basic'
    },
    analytics: {
      enabled: true,
      level: 'basic'
    }
  },
  
  // 5단계: 브랜딩
  branding: {
    primaryColor: '#2563eb',
    secondaryColor: '#64748b',
    fontFamily: 'Inter'
  },
  
  // 기존 필드들 유지 (하위 호환성)
  features: [],
  theme: {
    templateId: 'modern',
    customizations: {}
  },
  menu: {
    categories: [],
    items: []
  },
  payment: {
    methods: [],
    minOrderAmount: 0,
    maxOrderAmount: 100000,
    deliveryFee: 3000,
    freeDeliveryThreshold: 20000,
    deliveryAreas: []
  },
  notifications: {
    push: true,
    email: true,
    sms: false,
    templates: {}
  },
  finalSettings: {
    appName: '',
    description: ''
  }
};

const initialState: DataState = {
  currentUser: null,
  users: [],
  stores: [],
  appBuilderData: initialAppBuilderData,
  orders: [],
  loading: {},
  errors: {}
};

// 리듀서
function dataReducer(state: DataState, action: DataAction): DataState {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    
    case 'SET_USERS':
      return { ...state, users: action.payload };
    
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id ? { ...user, ...action.payload.updates } : user
        )
      };
    
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload)
      };
    
    case 'SET_STORES':
      return { ...state, stores: action.payload };
    
    case 'ADD_STORE':
      return { ...state, stores: [...state.stores, action.payload] };
    
    case 'UPDATE_STORE':
      return {
        ...state,
        stores: state.stores.map(store =>
          store.id === action.payload.id ? { ...store, ...action.payload.updates } : store
        )
      };
    
    case 'DELETE_STORE':
      return {
        ...state,
        stores: state.stores.filter(store => store.id !== action.payload)
      };
    
    case 'SET_APP_BUILDER_DATA':
      return {
        ...state,
        appBuilderData: { ...state.appBuilderData, ...action.payload }
      };
    
    case 'UPDATE_APP_BUILDER_STEP':
      return {
        ...state,
        appBuilderData: { ...state.appBuilderData, step: action.payload }
      };
    
    case 'RESET_APP_BUILDER_DATA':
      return {
        ...state,
        appBuilderData: initialAppBuilderData
      };
    
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    
    case 'ADD_ORDER':
      return { ...state, orders: [...state.orders, action.payload] };
    
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id ? { ...order, ...action.payload.updates } : order
        )
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: { ...state.loading, [action.payload.key]: action.payload.loading }
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.payload.key]: action.payload.error }
      };
    
    default:
      return state;
  }
}

// 컨텍스트 생성
const DataContext = createContext<{
  state: DataState;
  dispatch: React.Dispatch<DataAction>;
} | null>(null);

// 프로바이더 컴포넌트
export function DataProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // 로컬 스토리지에서 데이터 로드
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('mystorystory-data');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (parsedData.currentUser) {
          dispatch({ type: 'SET_CURRENT_USER', payload: parsedData.currentUser });
        }
        if (parsedData.appBuilderData) {
          dispatch({ type: 'SET_APP_BUILDER_DATA', payload: parsedData.appBuilderData });
        }
      }
    } catch (error) {
      console.error('Failed to load data from localStorage:', error);
    }
  }, []);

  // 상태 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    try {
      const dataToSave = {
        currentUser: state.currentUser,
        appBuilderData: state.appBuilderData
      };
      localStorage.setItem('mystorystory-data', JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Failed to save data to localStorage:', error);
    }
  }, [state.currentUser, state.appBuilderData]);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
}

// 커스텀 훅
export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

// 사용자 관련 훅
export function useUser() {
  const { state, dispatch } = useData();

  const login = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'login', loading: true } });
    dispatch({ type: 'SET_ERROR', payload: { key: 'login', error: null } });

    try {
      // 임시 로그인 로직
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 테스트 사용자 데이터 - 이메일별로 역할 구분
      let user: User;
      
      if (email === 'admin@mystory.kr') {
        user = {
          id: 'admin_001',
          name: '시스템 관리자',
          email,
          phone: '010-0000-0001',
          plan: 'enterprise',
          status: 'active',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
      } else if (email === 'store@mystory.kr') {
        user = {
          id: 'store_001',
          name: '매장 관리자',
          email,
          phone: '010-0000-0002',
          plan: 'Pro',
          status: 'active',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
      } else if (email === 'builder@mystory.kr') {
        user = {
          id: 'builder_001',
          name: '앱 개발자',
          email,
          phone: '010-0000-0003',
          plan: 'Pro',
          status: 'active',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
      } else if (email === 'customer@mystory.kr') {
        user = {
          id: 'customer_001',
          name: '고객 사용자',
          email,
          phone: '010-0000-0004',
          plan: 'Basic',
          status: 'active',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
      } else {
        // 기본 사용자 로직 유지
        user = {
          id: Date.now().toString(),
          name: email.includes('admin') ? '관리자' : '사용자',
          email,
          phone: '010-1234-5678',
          plan: email.includes('pro') ? 'pro' : email.includes('enterprise') ? 'enterprise' : 'basic',
          status: 'active',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
      }

      dispatch({ type: 'SET_CURRENT_USER', payload: user });
      return user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '로그인에 실패했습니다.';
      dispatch({ type: 'SET_ERROR', payload: { key: 'login', error: errorMessage } });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'login', loading: false } });
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    plan: string;
  }) => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'register', loading: true } });
    dispatch({ type: 'SET_ERROR', payload: { key: 'register', error: null } });

    try {
      // 임시 회원가입 로직
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const user: User = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        plan: userData.plan as any,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      dispatch({ type: 'ADD_USER', payload: user });
      dispatch({ type: 'SET_CURRENT_USER', payload: user });
      return user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '회원가입에 실패했습니다.';
      dispatch({ type: 'SET_ERROR', payload: { key: 'register', error: errorMessage } });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'register', loading: false } });
    }
  };

  const logout = () => {
    dispatch({ type: 'SET_CURRENT_USER', payload: null });
    dispatch({ type: 'RESET_APP_BUILDER_DATA' });
  };

  return {
    currentUser: state.currentUser,
    loading: state.loading,
    errors: state.errors,
    login,
    register,
    logout
  };
}

// 앱빌더 관련 훅
export function useAppBuilder() {
  const { state, dispatch } = useData();

  const updateStep = (step: number) => {
    dispatch({ type: 'UPDATE_APP_BUILDER_STEP', payload: step });
  };

  const updateData = (data: Partial<AppBuilderData>) => {
    dispatch({ type: 'SET_APP_BUILDER_DATA', payload: data });
  };

  const nextStep = () => {
    if (state.appBuilderData.step < 6) {
      dispatch({ type: 'UPDATE_APP_BUILDER_STEP', payload: state.appBuilderData.step + 1 });
    }
  };

  const prevStep = () => {
    if (state.appBuilderData.step > 1) {
      dispatch({ type: 'UPDATE_APP_BUILDER_STEP', payload: state.appBuilderData.step - 1 });
    }
  };

  const reset = () => {
    dispatch({ type: 'RESET_APP_BUILDER_DATA' });
  };

  // 서브도메인 유효성 검사
  const validateSubdomain = (domain: string) => {
    const regex = /^[a-z0-9-]+$/;
    return regex.test(domain) && domain.length >= 3 && domain.length <= 20;
  };

  const handleSubdomainChange = (value: string) => {
    const cleanValue = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    
    if (validateSubdomain(cleanValue)) {
      dispatch({ type: 'SET_APP_BUILDER_DATA', payload: { subdomain: cleanValue, subdomainError: '' } });
    } else if (cleanValue.length > 0) {
      dispatch({ type: 'SET_APP_BUILDER_DATA', payload: { 
        subdomain: cleanValue, 
        subdomainError: '영문자, 숫자, 하이픈만 사용 가능합니다 (3-20자)' 
      } });
    } else {
      dispatch({ type: 'SET_APP_BUILDER_DATA', payload: { subdomain: '', subdomainError: '' } });
    }
  };

  // 서브도메인 중복 확인
  const checkSubdomainAvailability = async () => {
    const subdomain = state.appBuilderData.subdomain;
    if (!subdomain) return;
    
    try {
      // 임시 중복 확인 로직 (실제로는 API 호출)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 테스트를 위한 금지된 서브도메인 목록
      const reservedSubdomains = ['admin', 'api', 'www', 'app', 'test', 'demo'];
      
      if (reservedSubdomains.includes(subdomain)) {
        dispatch({ type: 'SET_APP_BUILDER_DATA', payload: { 
          subdomainError: '이미 사용 중인 서브도메인입니다' 
        } });
      } else {
        dispatch({ type: 'SET_APP_BUILDER_DATA', payload: { subdomainError: '' } });
      }
    } catch (error) {
      console.error('서브도메인 확인 중 오류:', error);
      dispatch({ type: 'SET_APP_BUILDER_DATA', payload: { 
        subdomainError: '서브도메인 확인 중 오류가 발생했습니다' 
      } });
    }
  };

  // 폼 유효성 검사
  const isFormValid = () => {
    const { subdomain, subdomainError, storeInfo } = state.appBuilderData;
    return subdomain && 
           !subdomainError && 
           storeInfo.name && 
           storeInfo.ownerInfo.name &&
           storeInfo.ownerInfo.email;
  };

  const saveStep = (stepData: any) => {
    const currentStep = state.appBuilderData.step;
    const updates: Partial<AppBuilderData> = {};

    switch (currentStep) {
      case 1:
        if (stepData.subdomain !== undefined) {
          updates.subdomain = stepData.subdomain;
        }
        if (stepData.storeInfo) {
          updates.storeInfo = { ...state.appBuilderData.storeInfo, ...stepData.storeInfo };
        }
        break;
      case 2:
        updates.branding = { ...state.appBuilderData.branding, ...stepData };
        break;
      case 3:
        updates.features = stepData.features || state.appBuilderData.features;
        break;
      case 4:
        updates.theme = { ...state.appBuilderData.theme, ...stepData };
        break;
      case 5:
        updates.menu = { ...state.appBuilderData.menu, ...stepData };
        break;
      case 6:
        updates.payment = { ...state.appBuilderData.payment, ...stepData };
        break;
      case 7:
        updates.notifications = { ...state.appBuilderData.notifications, ...stepData };
        break;
      case 8:
        updates.finalSettings = { ...state.appBuilderData.finalSettings, ...stepData };
        break;
    }

    dispatch({ type: 'SET_APP_BUILDER_DATA', payload: updates });
  };

  // 앱빌드 화면으로 이동하는 함수 추가
  const goToAppBuilder = () => {
    console.log('앱빌드 화면으로 이동');
    // 첫 번째 단계 데이터를 저장하고 앱빌드 모드로 전환
    // 실제 네비게이션은 호출하는 곳에서 처리
  };

  // 앱 생성 요청 함수
  const submitAppRequest = async () => {
    try {
      // 최종 데이터 검증
      const { subdomain, subdomainError, storeInfo, planSelection, orderPayment, customerMarketing, branding } = state.appBuilderData;
      
      if (!subdomain || subdomainError || !storeInfo.name || !storeInfo.ownerInfo.name || !storeInfo.ownerInfo.email) {
        throw new Error('필수 정보가 누락되었습니다.');
      }

      // 앱 생성 요청 데이터 구성
      const appRequestData = {
        subdomain,
        storeInfo,
        planSelection,
        orderPayment,
        customerMarketing,
        branding,
        requestDate: new Date().toISOString(),
        status: 'pending'
      };

      // 실제로는 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 앱 생성 요청 완료 상태로 업데이트
      dispatch({ type: 'SET_APP_BUILDER_DATA', payload: { 
        finalSettings: {
          ...state.appBuilderData.finalSettings,
          appRequestId: Date.now().toString(),
          status: 'pending',
          requestDate: new Date().toISOString()
        }
      }});

      return appRequestData;
    } catch (error) {
      console.error('앱 생성 요청 실패:', error);
      throw error;
    }
  };

  return {
    data: state.appBuilderData,
    currentStep: state.appBuilderData.step,
    updateStep,
    updateData,
    nextStep,
    prevStep,
    saveStep,
    reset,
    handleSubdomainChange,
    checkSubdomainAvailability,
    isFormValid,
    goToAppBuilder,
    submitAppRequest
  };
}

// 주문 관련 훅
export function useOrders() {
  const { state, dispatch } = useData();

  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'createOrder', loading: true } });

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const order: Order = {
        ...orderData,
        id: Date.now().toString(),
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      dispatch({ type: 'ADD_ORDER', payload: order });
      return order;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '주문 생성에 실패했습니다.';
      dispatch({ type: 'SET_ERROR', payload: { key: 'createOrder', error: errorMessage } });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'createOrder', loading: false } });
    }
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    dispatch({ type: 'UPDATE_ORDER', payload: { id: orderId, updates: { status } } });
  };

  return {
    orders: state.orders,
    loading: state.loading,
    errors: state.errors,
    createOrder,
    updateOrderStatus
  };
}