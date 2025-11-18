/**
 * Order Types for MyStoreStory
 * T14-06, T14-07, T14-08: Order creation, tracking, and status management
 */

export type OrderStatus = 'NEW' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'FULFILLED' | 'CANCELLED';

export interface OrderItem {
  id: string;
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
}

export interface OrderAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderPayment {
  enabled: boolean; // T14-06: Always false (Billing OFF)
  method?: string;
  status?: string;
}

export interface OrderStatusHistory {
  id?: string;
  status: OrderStatus;
  note?: string;
  createdAt: number;
  actor: string; // userId or 'system'
}

// Legacy alias for compatibility
export interface OrderHistoryEntry {
  status: OrderStatus;
  timestamp: number;
  note?: string;
  updatedBy?: string;
}

export interface Order {
  id: string;
  storeId: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  customer: OrderCustomer;
  customerMasked: {
    name: string;
    phone: string; // Masked phone number
  };
  deliveryAddress?: OrderAddress;
  specialRequests?: string;
  payment: OrderPayment;
  // Display-only totals (recalculated from items)
  totals: {
    subtotal: number;
    tax: number;
    delivery: number;
    total: number;
  };
  createdAt: number;
  updatedAt: number;
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
  items: OrderItem[];
  customer: OrderCustomer;
  deliveryAddress?: OrderAddress;
  specialRequests?: string;
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
