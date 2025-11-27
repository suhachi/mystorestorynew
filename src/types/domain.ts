/**
 * Unified Domain Models for MyStoreStory
 *
 * This file consolidates all core type definitions to prevent fragmentation.
 * - User & Auth
 * - Store & Settings
 * - Menu & Products
 * - Order & Payment
 */

// ==========================================
// User & Auth
// ==========================================

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: 'basic' | 'pro' | 'enterprise';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  createdAt: string;
  lastLogin?: string;
  storeId?: string; // Link to store if owner/staff
  role?: 'admin' | 'owner' | 'staff' | 'customer';
}

// ==========================================
// Store & Settings
// ==========================================

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
    category: string;
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
  planSelection: {
    selectedPlan: 'basic' | 'pro' | 'enterprise';
    selectedFeatures: {
      dashboard: 'basic' | 'pro' | 'enterprise';
      menu: 'basic' | 'pro' | 'enterprise';
    };
  };
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
  branding: {
    logo?: string;
    coverImage?: string;
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
  // Legacy fields
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
    // App Request fields
    appRequestId?: string;
    status?: 'pending' | 'approved' | 'rejected';
    requestDate?: string;
  };
}

// ==========================================
// Menu & Products
// ==========================================

export interface MenuCategory {
  id: string;
  name: string;
  order: number;
  active: boolean;
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

// ==========================================
// Order & Payment
// ==========================================

export type OrderStatus = 'NEW' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'FULFILLED' | 'CANCELLED' | 'PAYMENT_TAMPERING';

export type PaymentStatus = 'NOT_PAID' | 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

/**
 * Payment Method Types
 * - APP_CARD: 앱상 카드결제 (NICEPAY 호출방식)
 * - MEET_CARD: 만나서 카드결제 (배달 시)
 * - MEET_CASH: 만나서 현금결제 (배달 시)
 * - VISIT_STORE: 매장 방문 결제 (포장 시)
 */
export type PaymentMethod = 'APP_CARD' | 'MEET_CARD' | 'MEET_CASH' | 'VISIT_STORE';

/**
 * Order Type
 */
export type OrderType = 'DELIVERY' | 'PICKUP';

/**
 * Payment Channel
 */
export type PaymentChannel = 'ONLINE' | 'OFFLINE';

/**
 * Online Payment Mode
 */
export type OnlinePaymentMode = 'NONE' | 'SANDBOX' | 'LIVE';

/**
 * NICEPAY Store Settings
 */
export interface NicepayStoreSettings {
  enabled: boolean;               // 이 상점이 NICEPAY 온라인 결제를 켜는지
  clientKey: string | null;       // 상점이 Admin에서 입력하는 NICEPAY clientKey
  mode: OnlinePaymentMode;        // 'SANDBOX' | 'LIVE'
  appCardEnabled: boolean;        // APP_CARD 사용 여부
  minAmount?: number;             // (선택) 최소 결제 가능 금액
}

/**
 * Store Payment Settings
 * 상점별 결제 방식 On/Off 설정
 */
export interface StorePaymentSettings {
  delivery: {
    appCard: boolean;     // 앱상 카드결제 허용
    meetCard: boolean;    // 만나서 카드결제 허용
    meetCash: boolean;    // 만나서 현금결제 허용
  };
  pickup: {
    appCard: boolean;     // 앱상 카드결제 허용
    visitStore: boolean;  // 매장 방문 결제 허용
  };
  // Online Payment Settings (Phase S3)
  payments?: {
    nicepay?: NicepayStoreSettings;
  };
}

export interface OrderItem {
  id: string; // Unique ID for the order item line
  menuItemId: string; // Reference to the menu item
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
  options?: {
    name: string;
    value: string; // or 'choice'
    price?: number;
  }[];
}

export interface OrderCustomer {
  name: string;
  phone: string;
  email?: string;
  id?: string; // Optional link to registered user
}

export interface OrderAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderPayment {
  enabled: boolean;
  method: PaymentMethod;
  channel: PaymentChannel;
  status: PaymentStatus;
  totalAmount: number;
  tid?: string; // Transaction ID from PG
  approvedAt?: number; // Timestamp
  details?: any; // PG response details
  error?: string; // Error message if failed
  webhookReceived?: boolean;
  webhookCode?: string;
}

export interface Order {
  id: string;
  storeId: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  customer: OrderCustomer;
  customerMasked?: {
    name: string;
    phone: string;
  };
  deliveryAddress?: OrderAddress;
  specialRequests?: string;
  payment: OrderPayment;
  totals: {
    subtotal: number;
    tax: number;
    delivery: number;
    total: number;
  };
  createdAt: number; // Timestamp
  updatedAt: number; // Timestamp
}

// Public order interface (for public documents - no PII)
export interface PublicOrder {
  id?: string;
  storeId: string;
  status: OrderStatus;
  items: OrderItem[];
  customerMasked?: {
    name: string;
    phone: string;
  };
  totals?: {
    items: number;
    qty: number;
    subtotal: number;
  };
  payment: {
    enabled: false; // Always false (T14-06: Billing OFF)
    method?: null;
  };
  createdAt: number;
  updatedAt: number;
}

export interface CreateOrderRequest {
  storeId: string;
  orderType: OrderType;
  items: OrderItem[];
  customer: OrderCustomer;
  deliveryAddress?: OrderAddress;
  specialRequests?: string;
  paymentMethod: PaymentMethod;
  deliveryFee: number;  // 🔥 A2: deliveryFee 추가
}

export interface OrderHistoryEntry {
  status: OrderStatus;
  timestamp: number;
  note?: string;
  updatedBy?: string;
}

export interface GetOrderRequest {
  storeId: string;
  orderId: string;
}

export interface SetOrderStatusRequest {
  storeId: string;
  orderId: string;
  status: OrderStatus;
  note?: string;
  mutationId?: string; // T14-09: Idempotency
}

export interface SetOrderStatusResponse {
  success: boolean;
  order?: Order;
  warnings?: string[];
  error?: string;
}
