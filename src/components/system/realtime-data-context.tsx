import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react';

// 실시간 데이터 상태 타입 정의
interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  estimatedTime?: number;
  deliveryAddress?: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  notes?: string;
  trackingNumber?: string;
  priority: 'normal' | 'high' | 'urgent';
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  options?: OrderOption[];
  specialInstructions?: string;
}

interface OrderOption {
  name: string;
  value: string;
  price: number;
}

interface Inventory {
  id: string;
  name: string;
  category: string;
  description?: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  price: number;
  cost: number;
  isAvailable: boolean;
  lastUpdated: Date;
  supplier?: string;
  barcode?: string;
  sku: string;
  images: string[];
  tags: string[];
  nutritionInfo?: NutritionInfo;
}

interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  allergens: string[];
}

interface SalesData {
  totalRevenue: number;
  todayRevenue: number;
  yesterdayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  orderCount: number;
  todayOrderCount: number;
  yesterdayOrderCount: number;
  averageOrderValue: number;
  peakHours: { hour: number; orders: number; revenue: number }[];
  hourlyData: { hour: number; revenue: number; orders: number }[];
  dailyData: { date: string; revenue: number; orders: number }[];
  weeklyData: { week: string; revenue: number; orders: number }[];
  monthlyData: { month: string; revenue: number; orders: number }[];
  topItems: { id: string; name: string; quantity: number; revenue: number }[];
  topCategories: { category: string; quantity: number; revenue: number }[];
  customerSegments: { segment: string; count: number; revenue: number }[];
  paymentMethods: { method: string; count: number; revenue: number }[];
  conversionRate: number;
  repeatCustomerRate: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: CustomerAddress;
  dateJoined: Date;
  lastOrderDate?: Date;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  favoriteItems: string[];
  loyaltyPoints: number;
  loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  isVip: boolean;
  preferences: CustomerPreferences;
  orderHistory: string[];
  reviewCount: number;
  averageRating: number;
  marketingConsent: boolean;
  communicationPreferences: CommunicationPreferences;
}

interface CustomerAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: { lat: number; lng: number };
}

interface CustomerPreferences {
  dietaryRestrictions: string[];
  spiceLevel: 'mild' | 'medium' | 'hot';
  preferredPaymentMethod: string;
  deliveryInstructions?: string;
  preferredDeliveryTime?: string;
}

interface CommunicationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  marketing: boolean;
}

interface RealtimeState {
  // 주문 관련
  orders: Order[];
  pendingOrders: Order[];
  activeOrders: Order[];
  completedOrders: Order[];
  
  // 재고 관련
  inventory: Inventory[];
  lowStockItems: Inventory[];
  outOfStockItems: Inventory[];
  
  // 매출 관련
  salesData: SalesData;
  salesTargets: SalesTargets;
  
  // 고객 관련
  customers: Customer[];
  vipCustomers: Customer[];
  newCustomers: Customer[];
  
  // 알림 관련
  notifications: Notification[];
  unreadCount: number;
  criticalAlerts: Notification[];
  
  // 시스템 상태
  isConnected: boolean;
  lastSync: Date | null;
  syncInProgress: boolean;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'offline';
  
  // 분석 데이터
  analytics: AnalyticsData;
  reports: Report[];
  
  // 설정
  settings: SystemSettings;
}

interface SalesTargets {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
}

interface Notification {
  id: string;
  type: 'order' | 'inventory' | 'payment' | 'system' | 'customer' | 'promotion';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent' | 'critical';
  isRead: boolean;
  createdAt: Date;
  expiresAt?: Date;
  action?: NotificationAction;
  metadata?: Record<string, any>;
  tags: string[];
}

interface NotificationAction {
  label: string;
  handler: () => void;
  type: 'primary' | 'secondary' | 'danger';
}

interface AnalyticsData {
  realtimeVisitors: number;
  conversionRate: number;
  bounceRate: number;
  averageSessionDuration: number;
  topPages: { page: string; views: number }[];
  trafficSources: { source: string; visits: number }[];
  deviceTypes: { device: string; percentage: number }[];
  geographicData: { country: string; visits: number }[];
}

interface Report {
  id: string;
  name: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  generatedAt: Date;
  data: any;
  summary: string;
}

interface SystemSettings {
  businessHours: BusinessHours;
  notifications: NotificationSettings;
  payments: PaymentSettings;
  delivery: DeliverySettings;
  taxes: TaxSettings;
  currency: string;
  timezone: string;
  language: string;
}

interface BusinessHours {
  [key: string]: { open: string; close: string; isOpen: boolean };
}

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  realtime: boolean;
  digest: boolean;
}

interface PaymentSettings {
  acceptedMethods: string[];
  minimumAmount: number;
  tip: boolean;
  tipPercentages: number[];
}

interface DeliverySettings {
  enabled: boolean;
  radius: number;
  minimumOrder: number;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  estimatedTime: number;
}

interface TaxSettings {
  rate: number;
  included: boolean;
  displayType: 'inclusive' | 'exclusive';
}

// 액션 타입들
type RealtimeAction =
  | { type: 'SET_CONNECTION_STATUS'; payload: { status: boolean; quality: RealtimeState['connectionQuality'] } }
  | { type: 'SET_LAST_SYNC'; payload: Date }
  | { type: 'SET_SYNC_STATUS'; payload: boolean }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER'; payload: { id: string; updates: Partial<Order> } }
  | { type: 'REMOVE_ORDER'; payload: string }
  | { type: 'UPDATE_INVENTORY'; payload: Inventory[] }
  | { type: 'UPDATE_INVENTORY_ITEM'; payload: { id: string; updates: Partial<Inventory> } }
  | { type: 'ADD_INVENTORY_ITEM'; payload: Inventory }
  | { type: 'REMOVE_INVENTORY_ITEM'; payload: string }
  | { type: 'UPDATE_SALES_DATA'; payload: Partial<SalesData> }
  | { type: 'ADD_CUSTOMER'; payload: Customer }
  | { type: 'UPDATE_CUSTOMER'; payload: { id: string; updates: Partial<Customer> } }
  | { type: 'REMOVE_CUSTOMER'; payload: string }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'UPDATE_NOTIFICATION'; payload: { id: string; updates: Partial<Notification> } }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS'; payload: void }
  | { type: 'UPDATE_ANALYTICS'; payload: Partial<AnalyticsData> }
  | { type: 'ADD_REPORT'; payload: Report }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<SystemSettings> }
  | { type: 'SYNC_ALL_DATA'; payload: Partial<RealtimeState> }
  | { type: 'RESET_STATE'; payload: void };

// 초기 상태
const initialState: RealtimeState = {
  orders: [],
  pendingOrders: [],
  activeOrders: [],
  completedOrders: [],
  inventory: [],
  lowStockItems: [],
  outOfStockItems: [],
  salesData: {
    totalRevenue: 0,
    todayRevenue: 0,
    yesterdayRevenue: 0,
    weekRevenue: 0,
    monthRevenue: 0,
    orderCount: 0,
    todayOrderCount: 0,
    yesterdayOrderCount: 0,
    averageOrderValue: 0,
    peakHours: [],
    hourlyData: [],
    dailyData: [],
    weeklyData: [],
    monthlyData: [],
    topItems: [],
    topCategories: [],
    customerSegments: [],
    paymentMethods: [],
    conversionRate: 0,
    repeatCustomerRate: 0
  },
  salesTargets: {
    daily: 500000,
    weekly: 3500000,
    monthly: 15000000,
    yearly: 180000000
  },
  customers: [],
  vipCustomers: [],
  newCustomers: [],
  notifications: [],
  unreadCount: 0,
  criticalAlerts: [],
  isConnected: false,
  lastSync: null,
  syncInProgress: false,
  connectionQuality: 'offline',
  analytics: {
    realtimeVisitors: 0,
    conversionRate: 0,
    bounceRate: 0,
    averageSessionDuration: 0,
    topPages: [],
    trafficSources: [],
    deviceTypes: [],
    geographicData: []
  },
  reports: [],
  settings: {
    businessHours: {
      monday: { open: '09:00', close: '21:00', isOpen: true },
      tuesday: { open: '09:00', close: '21:00', isOpen: true },
      wednesday: { open: '09:00', close: '21:00', isOpen: true },
      thursday: { open: '09:00', close: '21:00', isOpen: true },
      friday: { open: '09:00', close: '21:00', isOpen: true },
      saturday: { open: '10:00', close: '22:00', isOpen: true },
      sunday: { open: '10:00', close: '20:00', isOpen: true }
    },
    notifications: {
      email: true,
      sms: true,
      push: true,
      realtime: true,
      digest: false
    },
    payments: {
      acceptedMethods: ['card', 'cash', 'kakaopay', 'naverpay'],
      minimumAmount: 5000,
      tip: true,
      tipPercentages: [10, 15, 20]
    },
    delivery: {
      enabled: true,
      radius: 5,
      minimumOrder: 15000,
      deliveryFee: 3000,
      freeDeliveryThreshold: 30000,
      estimatedTime: 30
    },
    taxes: {
      rate: 10,
      included: true,
      displayType: 'inclusive'
    },
    currency: 'KRW',
    timezone: 'Asia/Seoul',
    language: 'ko'
  }
};

// 리듀서 함수
function realtimeReducer(state: RealtimeState, action: RealtimeAction): RealtimeState {
  switch (action.type) {
    case 'SET_CONNECTION_STATUS':
      return { 
        ...state, 
        isConnected: action.payload.status,
        connectionQuality: action.payload.quality
      };
      
    case 'SET_LAST_SYNC':
      return { ...state, lastSync: action.payload };
      
    case 'SET_SYNC_STATUS':
      return { ...state, syncInProgress: action.payload };
      
    case 'ADD_ORDER':
      const newOrder = action.payload;
      const updatedOrders = [newOrder, ...state.orders];
      return {
        ...state,
        orders: updatedOrders,
        pendingOrders: newOrder.status === 'pending' 
          ? [newOrder, ...state.pendingOrders]
          : state.pendingOrders,
        activeOrders: ['accepted', 'preparing', 'ready', 'delivering'].includes(newOrder.status)
          ? [newOrder, ...state.activeOrders]
          : state.activeOrders,
        completedOrders: ['completed', 'cancelled'].includes(newOrder.status)
          ? [newOrder, ...state.completedOrders]
          : state.completedOrders
      };
      
    case 'UPDATE_ORDER':
      const { id, updates } = action.payload;
      const orderIndex = state.orders.findIndex(order => order.id === id);
      if (orderIndex === -1) return state;
      
      const updatedOrder = { ...state.orders[orderIndex], ...updates, updatedAt: new Date() };
      const newOrders = [...state.orders];
      newOrders[orderIndex] = updatedOrder;
      
      return {
        ...state,
        orders: newOrders,
        pendingOrders: state.pendingOrders.map(order => 
          order.id === id ? updatedOrder : order
        ).filter(order => order.status === 'pending'),
        activeOrders: state.activeOrders.map(order => 
          order.id === id ? updatedOrder : order
        ).filter(order => ['accepted', 'preparing', 'ready', 'delivering'].includes(order.status)),
        completedOrders: state.completedOrders.map(order => 
          order.id === id ? updatedOrder : order
        ).filter(order => ['completed', 'cancelled'].includes(order.status))
      };
      
    case 'REMOVE_ORDER':
      const orderId = action.payload;
      return {
        ...state,
        orders: state.orders.filter(order => order.id !== orderId),
        pendingOrders: state.pendingOrders.filter(order => order.id !== orderId),
        activeOrders: state.activeOrders.filter(order => order.id !== orderId),
        completedOrders: state.completedOrders.filter(order => order.id !== orderId)
      };
      
    case 'UPDATE_INVENTORY':
      const newInventory = action.payload;
      return {
        ...state,
        inventory: newInventory,
        lowStockItems: newInventory.filter(item => item.currentStock <= item.minStock && item.currentStock > 0),
        outOfStockItems: newInventory.filter(item => item.currentStock === 0)
      };
      
    case 'UPDATE_INVENTORY_ITEM':
      const inventoryIndex = state.inventory.findIndex(item => item.id === action.payload.id);
      if (inventoryIndex === -1) return state;
      
      const updatedInventoryItem = { 
        ...state.inventory[inventoryIndex], 
        ...action.payload.updates,
        lastUpdated: new Date()
      };
      const newInventoryList = [...state.inventory];
      newInventoryList[inventoryIndex] = updatedInventoryItem;
      
      return {
        ...state,
        inventory: newInventoryList,
        lowStockItems: newInventoryList.filter(item => item.currentStock <= item.minStock && item.currentStock > 0),
        outOfStockItems: newInventoryList.filter(item => item.currentStock === 0)
      };
      
    case 'ADD_INVENTORY_ITEM':
      const newInventoryItem = action.payload;
      const allInventory = [...state.inventory, newInventoryItem];
      return {
        ...state,
        inventory: allInventory,
        lowStockItems: allInventory.filter(item => item.currentStock <= item.minStock && item.currentStock > 0),
        outOfStockItems: allInventory.filter(item => item.currentStock === 0)
      };
      
    case 'REMOVE_INVENTORY_ITEM':
      const filteredInventory = state.inventory.filter(item => item.id !== action.payload);
      return {
        ...state,
        inventory: filteredInventory,
        lowStockItems: filteredInventory.filter(item => item.currentStock <= item.minStock && item.currentStock > 0),
        outOfStockItems: filteredInventory.filter(item => item.currentStock === 0)
      };
      
    case 'UPDATE_SALES_DATA':
      return {
        ...state,
        salesData: { ...state.salesData, ...action.payload }
      };
      
    case 'ADD_CUSTOMER':
      const newCustomer = action.payload;
      const customerList = [newCustomer, ...state.customers];
      return {
        ...state,
        customers: customerList,
        vipCustomers: customerList.filter(customer => customer.isVip),
        newCustomers: customerList.filter(customer => {
          const daysSinceJoined = (new Date().getTime() - new Date(customer.dateJoined).getTime()) / (1000 * 60 * 60 * 24);
          return daysSinceJoined <= 7;
        })
      };
      
    case 'UPDATE_CUSTOMER':
      const customerUpdateIndex = state.customers.findIndex(customer => customer.id === action.payload.id);
      if (customerUpdateIndex === -1) return state;
      
      const updatedCustomer = { ...state.customers[customerUpdateIndex], ...action.payload.updates };
      const newCustomers = [...state.customers];
      newCustomers[customerUpdateIndex] = updatedCustomer;
      
      return {
        ...state,
        customers: newCustomers,
        vipCustomers: newCustomers.filter(customer => customer.isVip),
        newCustomers: newCustomers.filter(customer => {
          const daysSinceJoined = (new Date().getTime() - new Date(customer.dateJoined).getTime()) / (1000 * 60 * 60 * 24);
          return daysSinceJoined <= 7;
        })
      };
      
    case 'REMOVE_CUSTOMER':
      const filteredCustomers = state.customers.filter(customer => customer.id !== action.payload);
      return {
        ...state,
        customers: filteredCustomers,
        vipCustomers: filteredCustomers.filter(customer => customer.isVip),
        newCustomers: filteredCustomers.filter(customer => {
          const daysSinceJoined = (new Date().getTime() - new Date(customer.dateJoined).getTime()) / (1000 * 60 * 60 * 24);
          return daysSinceJoined <= 7;
        })
      };
      
    case 'ADD_NOTIFICATION':
      const notification = action.payload;
      const notifications = [notification, ...state.notifications];
      return {
        ...state,
        notifications,
        unreadCount: notification.isRead ? state.unreadCount : state.unreadCount + 1,
        criticalAlerts: notification.priority === 'critical' 
          ? [notification, ...state.criticalAlerts]
          : state.criticalAlerts
      };
      
    case 'UPDATE_NOTIFICATION':
      const notificationUpdateIndex = state.notifications.findIndex(n => n.id === action.payload.id);
      if (notificationUpdateIndex === -1) return state;
      
      const updatedNotification = { ...state.notifications[notificationUpdateIndex], ...action.payload.updates };
      const newNotifications = [...state.notifications];
      newNotifications[notificationUpdateIndex] = updatedNotification;
      
      return {
        ...state,
        notifications: newNotifications,
        criticalAlerts: newNotifications.filter(n => n.priority === 'critical' && !n.isRead)
      };
      
    case 'MARK_NOTIFICATION_READ':
      const notificationId = action.payload;
      const notificationToUpdate = state.notifications.find(n => n.id === notificationId);
      if (!notificationToUpdate || notificationToUpdate.isRead) return state;
      
      const markedNotifications = state.notifications.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      );
      
      return {
        ...state,
        notifications: markedNotifications,
        unreadCount: Math.max(0, state.unreadCount - 1),
        criticalAlerts: markedNotifications.filter(n => n.priority === 'critical' && !n.isRead)
      };
      
    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
        unreadCount: 0,
        criticalAlerts: []
      };
      
    case 'UPDATE_ANALYTICS':
      return {
        ...state,
        analytics: { ...state.analytics, ...action.payload }
      };
      
    case 'ADD_REPORT':
      return {
        ...state,
        reports: [action.payload, ...state.reports]
      };
      
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
      
    case 'SYNC_ALL_DATA':
      return { ...state, ...action.payload };
      
    case 'RESET_STATE':
      return initialState;
      
    default:
      return state;
  }
}

// 컨텍스트 인터페이스
interface RealtimeContextType {
  state: RealtimeState;
  
  // 주문 관련 함수들
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  updateOrder: (orderId: string, updates: Partial<Order>) => Promise<void>;
  cancelOrder: (orderId: string, reason?: string) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  
  // 재고 관련 함수들
  updateInventory: (itemId: string, newStock: number) => Promise<void>;
  addInventoryItem: (item: Omit<Inventory, 'id' | 'lastUpdated'>) => Promise<void>;
  updateInventoryItem: (itemId: string, updates: Partial<Inventory>) => Promise<void>;
  removeInventoryItem: (itemId: string) => Promise<void>;
  checkLowStock: () => Inventory[];
  
  // 고객 관련 함수들
  addCustomer: (customer: Omit<Customer, 'id' | 'dateJoined'>) => Promise<void>;
  updateCustomer: (customerId: string, updates: Partial<Customer>) => Promise<void>;
  removeCustomer: (customerId: string) => Promise<void>;
  getCustomerInsights: (customerId: string) => Promise<any>;
  
  // 알림 관련 함수들
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  clearAllNotifications: () => void;
  
  // 매출 분석 함수들
  updateSalesData: (data: Partial<SalesData>) => void;
  generateSalesReport: (period: 'daily' | 'weekly' | 'monthly') => Promise<Report>;
  getSalesAnalytics: (startDate: Date, endDate: Date) => Promise<any>;
  
  // 연결 관련 함수들
  connect: () => Promise<void>;
  disconnect: () => void;
  syncData: () => Promise<void>;
  
  // 설정 관련 함수들
  updateSettings: (settings: Partial<SystemSettings>) => Promise<void>;
  
  // 유틸리티 함수들
  exportData: (type: 'orders' | 'customers' | 'inventory' | 'sales') => Promise<string>;
  importData: (type: 'orders' | 'customers' | 'inventory', data: any) => Promise<void>;
  resetAllData: () => void;
}

// 컨텍스트 생성
const RealtimeContext = createContext<RealtimeContextType | null>(null);

// Provider 컴포넌트
export function RealtimeDataProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(realtimeReducer, initialState);

  // WebSocket 연결 시뮬레이션
  const simulateRealtimeConnection = useCallback(() => {
    const interval = setInterval(() => {
      // 상태를 직접 업데이트하지 않고 dispatch 사용
      dispatch({ 
        type: 'UPDATE_SALES_DATA', 
        payload: {
          todayRevenue: Math.random() * 15000,
          todayOrderCount: Math.floor(Math.random() * 2),
        }
      });
      
      dispatch({ 
        type: 'UPDATE_ANALYTICS', 
        payload: {
          realtimeVisitors: Math.floor(Math.random() * 50) + 10,
          conversionRate: Math.random() * 5 + 2,
          bounceRate: Math.random() * 30 + 20
        }
      });
      
      dispatch({ type: 'SET_LAST_SYNC', payload: new Date() });
    }, 30000); // 30초마다 업데이트

    return () => clearInterval(interval);
  }, []); // 의존성 배열을 빈 배열로 변경

  // 연결 함수
  const connect = useCallback(async () => {
    try {
      dispatch({ 
        type: 'SET_CONNECTION_STATUS', 
        payload: { status: true, quality: 'excellent' }
      });
      
      // 초기 데이터 로드
      await loadInitialData();
      
      // 실시간 연결 시작
      simulateRealtimeConnection();
      
      addNotification({
        type: 'system',
        title: '실시간 연결 성공',
        message: '실시간 데이터 동기화가 시작되었습니다.',
        priority: 'medium',
        tags: ['system', 'connection']
      });
    } catch (error) {
      console.error('실시간 연결 실패:', error);
      dispatch({ 
        type: 'SET_CONNECTION_STATUS', 
        payload: { status: false, quality: 'offline' }
      });
    }
  }, [simulateRealtimeConnection]);

  // 연결 해제 함수
  const disconnect = useCallback(() => {
    dispatch({ 
      type: 'SET_CONNECTION_STATUS', 
      payload: { status: false, quality: 'offline' }
    });
  }, []);

  // 초기 데이터 로드
  const loadInitialData = useCallback(async () => {
    // 샘플 주문 데이터
    const sampleOrders: Order[] = [
      {
        id: '1',
        customerId: 'c1',
        customerName: '김고객',
        customerPhone: '010-1234-5678',
        items: [
          { id: '1', name: '치킨버거', price: 8000, quantity: 2, options: [{ name: '치즈 추가', value: '체다 치즈', price: 1000 }] },
          { id: '2', name: '감자튀김', price: 3000, quantity: 1 }
        ],
        totalAmount: 20000,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        paymentMethod: '카드결제',
        paymentStatus: 'completed',
        deliveryAddress: '서울시 강남구 테헤란로 123',
        priority: 'normal'
      },
      {
        id: '2',
        customerId: 'c2',
        customerName: '박고객',
        customerPhone: '010-9876-5432',
        items: [
          { id: '3', name: '피자라지', price: 25000, quantity: 1 }
        ],
        totalAmount: 25000,
        status: 'preparing',
        createdAt: new Date(),
        updatedAt: new Date(),
        paymentMethod: '카카오페이',
        paymentStatus: 'completed',
        estimatedTime: 30,
        priority: 'high'
      }
    ];

    // 샘플 재고 데이터
    const sampleInventory: Inventory[] = [
      {
        id: '1',
        name: '치킨버거',
        category: '버거',
        description: '바삭한 치킨과 신선 야채가 들어간 버거',
        currentStock: 50,
        minStock: 10,
        maxStock: 100,
        reorderPoint: 15,
        price: 8000,
        cost: 4000,
        isAvailable: true,
        lastUpdated: new Date(),
        sku: 'CB001',
        images: ['chicken-burger.jpg'],
        tags: ['인기', '추천', '매운맛'],
        nutritionInfo: {
          calories: 520,
          protein: 28,
          carbs: 45,
          fat: 25,
          allergens: ['밀', '계란', '대두']
        }
      },
      {
        id: '2',
        name: '감자튀김',
        category: '사이드',
        description: '바삭하게 튀긴 감자튀김',
        currentStock: 5,
        minStock: 10,
        maxStock: 50,
        reorderPoint: 12,
        price: 3000,
        cost: 1000,
        isAvailable: true,
        lastUpdated: new Date(),
        sku: 'FF001',
        images: ['french-fries.jpg'],
        tags: ['사이드', '간식'],
        nutritionInfo: {
          calories: 312,
          protein: 4,
          carbs: 43,
          fat: 15,
          allergens: []
        }
      }
    ];

    // 샘플 고객 데이터
    const sampleCustomers: Customer[] = [
      {
        id: 'c1',
        name: '김고객',
        email: 'kim@example.com',
        phone: '010-1234-5678',
        dateJoined: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        totalOrders: 15,
        totalSpent: 300000,
        averageOrderValue: 20000,
        lastOrderDate: new Date(),
        favoriteItems: ['치킨버거', '감자튀김'],
        loyaltyPoints: 1500,
        loyaltyTier: 'gold',
        isVip: true,
        preferences: {
          dietaryRestrictions: [],
          spiceLevel: 'medium',
          preferredPaymentMethod: '카드결제',
          deliveryInstructions: '문 앞에 놓아주세요'
        },
        orderHistory: ['1', '2', '3'],
        reviewCount: 8,
        averageRating: 4.5,
        marketingConsent: true,
        communicationPreferences: {
          email: true,
          sms: true,
          push: true,
          marketing: true
        }
      }
    ];

    // 데이터 동기화
    dispatch({
      type: 'SYNC_ALL_DATA',
      payload: {
        orders: sampleOrders,
        pendingOrders: sampleOrders.filter(o => o.status === 'pending'),
        activeOrders: sampleOrders.filter(o => ['accepted', 'preparing', 'ready', 'delivering'].includes(o.status)),
        completedOrders: sampleOrders.filter(o => ['completed', 'cancelled'].includes(o.status)),
        inventory: sampleInventory,
        lowStockItems: sampleInventory.filter(item => item.currentStock <= item.minStock && item.currentStock > 0),
        outOfStockItems: sampleInventory.filter(item => item.currentStock === 0),
        customers: sampleCustomers,
        vipCustomers: sampleCustomers.filter(c => c.isVip),
        newCustomers: sampleCustomers.filter(c => {
          const daysSinceJoined = (new Date().getTime() - new Date(c.dateJoined).getTime()) / (1000 * 60 * 60 * 24);
          return daysSinceJoined <= 7;
        }),
        salesData: {
          ...initialState.salesData,
          totalRevenue: 1250000,
          todayRevenue: 125000,
          yesterdayRevenue: 110000,
          weekRevenue: 750000,
          monthRevenue: 3200000,
          orderCount: 85,
          todayOrderCount: 12,
          yesterdayOrderCount: 10,
          averageOrderValue: 32000,
          hourlyData: Array.from({ length: 24 }, (_, i) => ({
            hour: i,
            revenue: Math.random() * 50000,
            orders: Math.floor(Math.random() * 10)
          })),
          dailyData: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            revenue: Math.random() * 200000,
            orders: Math.floor(Math.random() * 30)
          })),
          topItems: [
            { id: '1', name: '치킨버거', quantity: 45, revenue: 360000 },
            { id: '3', name: '피자라지', quantity: 12, revenue: 300000 }
          ]
        }
      }
    });
  }, []);

  // 주문 관련 함수들
  const addOrder = useCallback(async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    dispatch({ type: 'ADD_ORDER', payload: newOrder });

    // 알림 추가
    addNotification({
      type: 'order',
      title: '새 주문 접수',
      message: `${newOrder.customerName}님의 주문이 접수되었습니다. (${newOrder.totalAmount.toLocaleString()}원)`,
      priority: newOrder.priority === 'urgent' ? 'urgent' : 'high',
      tags: ['order', 'new'],
      action: {
        label: '주문 확인',
        handler: () => console.log('주문 상세 보기:', newOrder.id),
        type: 'primary'
      }
    });

    // 재고 차감
    for (const item of newOrder.items) {
      const inventoryItem = state.inventory.find(inv => inv.id === item.id);
      if (inventoryItem) {
        dispatch({
          type: 'UPDATE_INVENTORY_ITEM',
          payload: {
            id: item.id,
            updates: { currentStock: Math.max(0, inventoryItem.currentStock - item.quantity) }
          }
        });
      }
    }
  }, [state.inventory]);

  const updateOrderStatus = useCallback(async (orderId: string, status: Order['status']) => {
    dispatch({
      type: 'UPDATE_ORDER',
      payload: { id: orderId, updates: { status } }
    });

    const order = state.orders.find(o => o.id === orderId);
    if (order) {
      addNotification({
        type: 'order',
        title: '주문 상태 변경',
        message: `주문 #${orderId}이 '${getStatusText(status)}' 상태로 변경되었습니다.`,
        priority: 'medium',
        tags: ['order', 'status'],
        metadata: { orderId, status }
      });
    }
  }, [state.orders]);

  const updateOrder = useCallback(async (orderId: string, updates: Partial<Order>) => {
    dispatch({
      type: 'UPDATE_ORDER',
      payload: { id: orderId, updates }
    });
  }, []);

  const cancelOrder = useCallback(async (orderId: string, reason?: string) => {
    const order = state.orders.find(o => o.id === orderId);
    if (!order) return;

    dispatch({
      type: 'UPDATE_ORDER',
      payload: { id: orderId, updates: { status: 'cancelled' } }
    });

    // 재고 복원
    for (const item of order.items) {
      const inventoryItem = state.inventory.find(inv => inv.id === item.id);
      if (inventoryItem) {
        dispatch({
          type: 'UPDATE_INVENTORY_ITEM',
          payload: {
            id: item.id,
            updates: { currentStock: inventoryItem.currentStock + item.quantity }
          }
        });
      }
    }

    addNotification({
      type: 'order',
      title: '주문 취소',
      message: `주문 #${orderId}이 취소되었습니다. ${reason ? `사유: ${reason}` : ''}`,
      priority: 'medium',
      tags: ['order', 'cancelled'],
      metadata: { orderId, reason }
    });
  }, [state.orders, state.inventory]);

  const deleteOrder = useCallback(async (orderId: string) => {
    dispatch({ type: 'REMOVE_ORDER', payload: orderId });
  }, []);

  // 재고 관련 함수들
  const updateInventory = useCallback(async (itemId: string, newStock: number) => {
    dispatch({
      type: 'UPDATE_INVENTORY_ITEM',
      payload: { id: itemId, updates: { currentStock: newStock } }
    });

    const item = state.inventory.find(inv => inv.id === itemId);
    if (item && newStock <= item.minStock) {
      addNotification({
        type: 'inventory',
        title: '재고 부족 알림',
        message: `${item.name}의 재고가 부족합니다. (현재: ${newStock}개)`,
        priority: newStock === 0 ? 'urgent' : 'high',
        tags: ['inventory', 'low-stock'],
        metadata: { itemId, currentStock: newStock }
      });
    }
  }, [state.inventory]);

  const addInventoryItem = useCallback(async (itemData: Omit<Inventory, 'id' | 'lastUpdated'>) => {
    const newItem: Inventory = {
      ...itemData,
      id: Date.now().toString(),
      lastUpdated: new Date()
    };

    dispatch({ type: 'ADD_INVENTORY_ITEM', payload: newItem });
  }, []);

  const updateInventoryItem = useCallback(async (itemId: string, updates: Partial<Inventory>) => {
    dispatch({
      type: 'UPDATE_INVENTORY_ITEM',
      payload: { id: itemId, updates }
    });
  }, []);

  const removeInventoryItem = useCallback(async (itemId: string) => {
    dispatch({ type: 'REMOVE_INVENTORY_ITEM', payload: itemId });
  }, []);

  const checkLowStock = useCallback(() => {
    return state.lowStockItems;
  }, [state.lowStockItems]);

  // 고객 관련 함수들
  const addCustomer = useCallback(async (customerData: Omit<Customer, 'id' | 'dateJoined'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: Date.now().toString(),
      dateJoined: new Date()
    };

    dispatch({ type: 'ADD_CUSTOMER', payload: newCustomer });

    addNotification({
      type: 'customer',
      title: '신규 고객 등록',
      message: `${newCustomer.name}님이 새로 가입하셨습니다.`,
      priority: 'low',
      tags: ['customer', 'new'],
      metadata: { customerId: newCustomer.id }
    });
  }, []);

  const updateCustomer = useCallback(async (customerId: string, updates: Partial<Customer>) => {
    dispatch({
      type: 'UPDATE_CUSTOMER',
      payload: { id: customerId, updates }
    });
  }, []);

  const removeCustomer = useCallback(async (customerId: string) => {
    dispatch({ type: 'REMOVE_CUSTOMER', payload: customerId });
  }, []);

  const getCustomerInsights = useCallback(async (customerId: string) => {
    const customer = state.customers.find(c => c.id === customerId);
    if (!customer) return null;

    return {
      customer,
      totalOrders: customer.totalOrders,
      totalSpent: customer.totalSpent,
      averageOrderValue: customer.averageOrderValue,
      loyaltyTier: customer.loyaltyTier,
      favoriteItems: customer.favoriteItems,
      lastOrderDate: customer.lastOrderDate,
      insights: {
        lifetimeValue: customer.totalSpent,
        orderFrequency: customer.totalOrders / ((new Date().getTime() - new Date(customer.dateJoined).getTime()) / (1000 * 60 * 60 * 24 * 30)),
        churnRisk: customer.lastOrderDate ? 
          (new Date().getTime() - new Date(customer.lastOrderDate).getTime()) / (1000 * 60 * 60 * 24) > 30 ? 'high' : 'low' : 'medium'
      }
    };
  }, [state.customers]);

  // 알림 관련 함수들
  const addNotification = useCallback((notificationData: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    const notification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      isRead: false,
      createdAt: new Date()
    };

    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  }, []);

  const markNotificationRead = useCallback((notificationId: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    state.notifications.forEach(notification => {
      if (!notification.isRead) {
        dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notification.id });
      }
    });
  }, [state.notifications]);

  const clearAllNotifications = useCallback(() => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS', payload: undefined });
  }, []);

  // 매출 분석 함수들
  const updateSalesData = useCallback((data: Partial<SalesData>) => {
    dispatch({ type: 'UPDATE_SALES_DATA', payload: data });
  }, []);

  const generateSalesReport = useCallback(async (period: 'daily' | 'weekly' | 'monthly'): Promise<Report> => {
    const now = new Date();
    const report: Report = {
      id: Date.now().toString(),
      name: `${period} 매출 리포트`,
      type: period,
      generatedAt: now,
      data: {
        period,
        revenue: state.salesData.todayRevenue,
        orders: state.salesData.todayOrderCount,
        averageOrderValue: state.salesData.averageOrderValue,
        topItems: state.salesData.topItems
      },
      summary: `${period} 매출: ${state.salesData.todayRevenue.toLocaleString()}원, 주문 수: ${state.salesData.todayOrderCount}건`
    };

    dispatch({ type: 'ADD_REPORT', payload: report });
    return report;
  }, [state.salesData]);

  const getSalesAnalytics = useCallback(async (startDate: Date, endDate: Date) => {
    // 실제 구현에서는 날짜 범위에 따른 데이터 분석
    return {
      revenue: state.salesData.todayRevenue,
      orders: state.salesData.todayOrderCount,
      averageOrderValue: state.salesData.averageOrderValue,
      growth: 15.2, // 이전 기간 대비 성장률
      trends: state.salesData.dailyData
    };
  }, [state.salesData]);

  // 데이터 동기화
  const syncData = useCallback(async () => {
    dispatch({ type: 'SET_SYNC_STATUS', payload: true });
    
    try {
      // 실제 구현에서는 서버에서 최신 데이터 가져오기
      await loadInitialData();
      dispatch({ type: 'SET_LAST_SYNC', payload: new Date() });
    } finally {
      dispatch({ type: 'SET_SYNC_STATUS', payload: false });
    }
  }, [loadInitialData]);

  // 설정 관련 함수들
  const updateSettings = useCallback(async (settings: Partial<SystemSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  }, []);

  // 유틸리티 함수들
  const exportData = useCallback(async (type: 'orders' | 'customers' | 'inventory' | 'sales'): Promise<string> => {
    const data = {
      orders: state.orders,
      customers: state.customers,
      inventory: state.inventory,
      sales: state.salesData
    }[type];

    return JSON.stringify(data, null, 2);
  }, [state]);

  const importData = useCallback(async (type: 'orders' | 'customers' | 'inventory', data: any) => {
    switch (type) {
      case 'orders':
        dispatch({ type: 'SYNC_ALL_DATA', payload: { orders: data } });
        break;
      case 'customers':
        dispatch({ type: 'SYNC_ALL_DATA', payload: { customers: data } });
        break;
      case 'inventory':
        dispatch({ type: 'UPDATE_INVENTORY', payload: data });
        break;
    }
  }, []);

  const resetAllData = useCallback(() => {
    dispatch({ type: 'RESET_STATE', payload: undefined });
  }, []);

  // 초기 연결
  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  const contextValue: RealtimeContextType = {
    state,
    addOrder,
    updateOrderStatus,
    updateOrder,
    cancelOrder,
    deleteOrder,
    updateInventory,
    addInventoryItem,
    updateInventoryItem,
    removeInventoryItem,
    checkLowStock,
    addCustomer,
    updateCustomer,
    removeCustomer,
    getCustomerInsights,
    addNotification,
    markNotificationRead,
    markAllNotificationsRead,
    clearAllNotifications,
    updateSalesData,
    generateSalesReport,
    getSalesAnalytics,
    connect,
    disconnect,
    syncData,
    updateSettings,
    exportData,
    importData,
    resetAllData
  };

  return (
    <RealtimeContext.Provider value={contextValue}>
      {children}
    </RealtimeContext.Provider>
  );
}

// 훅
export function useRealtimeData() {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtimeData는 RealtimeDataProvider 내부에서 사용되어야 합니다.');
  }
  return context;
}

// 유틸리티 함수들
function getStatusText(status: Order['status']): string {
  const statusMap = {
    pending: '대기중',
    accepted: '접수됨',
    preparing: '조리중',
    ready: '준비완료',
    delivering: '배달중',
    completed: '완료',
    cancelled: '취소됨'
  };
  return statusMap[status] || status;
}

// 타입 export
export type { 
  Order, 
  OrderItem, 
  OrderOption,
  Inventory, 
  SalesData, 
  Customer, 
  CustomerAddress,
  CustomerPreferences,
  Notification, 
  RealtimeState,
  AnalyticsData,
  Report,
  SystemSettings
};