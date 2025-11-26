/**
 * MyStoreStory Functions Type Definitions
 * Synchronized with src/types/domain.ts
 */

// ==========================================
// Order Status & Payment Types
// ==========================================

export type OrderStatus =
  | 'NEW'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'FULFILLED'
  | 'CANCELLED'
  | 'PAYMENT_TAMPERING';

export type PaymentStatus =
  | 'NOT_PAID'
  | 'PENDING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

/**
 * Payment Method Types
 * - APP_CARD: 앱상 카드결제 (NICEPAY 호출방식)
 * - MEET_CARD: 만나서 카드결제 (배달 시)
 * - MEET_CASH: 만나서 현금결제 (배달 시)
 * - VISIT_STORE: 매장 방문 결제 (포장 시)
 */
export type PaymentMethod =
  | 'APP_CARD'
  | 'MEET_CARD'
  | 'MEET_CASH'
  | 'VISIT_STORE';

/**
 * Order Type
 */
export type OrderType = 'DELIVERY' | 'PICKUP';

/**
 * Payment Channel
 */
export type PaymentChannel = 'ONLINE' | 'OFFLINE';

// ==========================================
// Order Item & Customer
// ==========================================

export interface OrderItem {
  id: string; // Unique ID for the order item line
  menuItemId: string; // Reference to the menu item
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
  options?: {
    name: string;
    value: string;
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

// ==========================================
// Payment
// ==========================================

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

// ==========================================
// Order Totals
// ==========================================

export interface OrderTotals {
  subtotal: number;
  tax: number;
  delivery: number;
  total: number;
}

// ==========================================
// Create Order Request
// ==========================================

export interface CreateOrderRequest {
  storeId: string;
  orderType: OrderType;
  items: OrderItem[];
  customer: OrderCustomer;
  deliveryAddress?: OrderAddress;
  specialRequests?: string;
  paymentMethod: PaymentMethod;
  deliveryFee: number; // Delivery fee amount
}

// ==========================================
// Order
// ==========================================

export interface Order {
  id: string;
  storeId: string;
  orderNumber: string;
  orderType: OrderType;
  status: OrderStatus;
  items: OrderItem[];
  customer: OrderCustomer;
  customerMasked: {
    name: string;
    phone: string;
  };
  deliveryAddress?: OrderAddress;
  specialRequests?: string;
  payment: OrderPayment;
  totals: OrderTotals;
  createdAt: number; // Timestamp
  updatedAt: number; // Timestamp
}

// ==========================================
// Get Order Request
// ==========================================

export interface GetOrderRequest {
  storeId: string;
  orderId: string;
}

// ==========================================
// Public Order (for tracking, PII masked)
// ==========================================

export interface PublicOrder {
  id: string;
  storeId: string;
  orderNumber: string;
  orderType: OrderType;
  status: OrderStatus;
  items: OrderItem[];
  customerMasked: {
    name: string;
    phone: string;
  };
  deliveryAddress?: OrderAddress;
  specialRequests?: string;
  payment: OrderPayment;
  totals: OrderTotals;
  createdAt: number;
  updatedAt: number;
}

// ==========================================
// Set Order Status Request/Response
// ==========================================

export interface SetOrderStatusRequest {
  storeId: string;
  orderId: string;
  newStatus: OrderStatus;
  reason?: string;
}

export interface SetOrderStatusResponse {
  success: boolean;
  order: Order;
}
