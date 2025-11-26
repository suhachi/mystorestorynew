/**
 * Public Order Service
 * T14-06: Checkout & Order Creation
 *
 * 이중 경로 구조:
 * - VITE_USE_FIREBASE=true: Firebase Functions 사용
 * - VITE_USE_FIREBASE=false: Mock 기반 (기본값, E2E 테스트용)
 *
 * This service handles public order creation from customer checkout.
 * - PII masking in logs
 * - Retry queue integration
 * - Billing disabled (payment.enabled = false)
 * - Order status starts as 'NEW'
 *
 * @see docs/BACKEND_STATUS.md for Firebase Functions deployment status
 * @see docs/FUNCTIONS_EMULATOR_TEST_GUIDE.md for Emulator testing
 */

import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase/config';
import { CreateOrderRequest, GetOrderRequest, Order, OrderItem, PublicOrder } from '../types/order';

// Environment flag
const USE_FIREBASE = import.meta.env.VITE_USE_FIREBASE === 'true';

/**
 * Mask phone number for PII protection
 */
function maskPhone(phone: string): string {
  if (phone.length <= 4) return '***';
  return phone.slice(0, 3) + '***' + phone.slice(-2);
}

/**
 * Validate order request
 */
export function validateOrderRequest(request: CreateOrderRequest): { valid: boolean; error?: string } {
  // Check for empty cart
  if (!request.items || request.items.length === 0) {
    return { valid: false, error: '장바구니가 비어있습니다.' };
  }

  // Validate customer info
  if (!request.customer.name || request.customer.name.trim().length === 0) {
    return { valid: false, error: '고객 이름을 입력해주세요.' };
  }

  // Validate phone number (at least 9 digits)
  const phoneDigits = request.customer.phone.replace(/\D/g, '');
  if (phoneDigits.length < 9) {
    return { valid: false, error: '유효한 전화번호를 입력해주세요 (최소 9자리).' };
  }

  // Validate items
  for (const item of request.items) {
    if (item.quantity <= 0) {
      return { valid: false, error: `상품 "${item.name}"의 수량이 올바르지 않습니다.` };
    }
    if (item.price < 0) {
      return { valid: false, error: `상품 "${item.name}"의 가격이 올바르지 않습니다.` };
    }
  }

  return { valid: true };
}

/**
 * Calculate order totals from items
 */
export function calculateOrderTotals(items: OrderItem[]): {
  subtotal: number;
  tax: number;
  delivery: number;
  total: number;
} {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = Math.round(subtotal * 0.1); // 10% tax

  // Feature Flag: Use legacy delivery fee calculation for now
  // TODO: Integrate with calculateDeliveryFee() from lib/calculateDeliveryFee.ts
  const delivery = subtotal >= 20000 ? 0 : 3000; // Legacy logic

  const total = subtotal + tax + delivery;

  return { subtotal, tax, delivery, total };
}

/**
 * Create order (public API - Billing OFF)
 * T14-06: No payment processing, status starts as NEW
 *
 * Dual-path implementation:
 * - USE_FIREBASE=true: Calls Firebase Functions createOrder
 * - USE_FIREBASE=false: Uses Mock implementation (default)
 */
export async function createOrderPublic(request: CreateOrderRequest): Promise<Order> {
  // Validate request
  const validation = validateOrderRequest(request);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // 🔥 Firebase Functions Mode
  if (USE_FIREBASE) {
    try {
      console.log('[createOrderPublic] Using Firebase Functions');
      const callable = httpsCallable<CreateOrderRequest, Order>(functions, 'createOrder');
      const result = await callable(request);
      return result.data;
    } catch (error) {
      console.error('[createOrderPublic] Firebase Functions error:', error);
      throw error;
    }
  }

  // 🔥 Mock Mode (Default for E2E testing)
  console.log('[createOrderPublic] Using Mock implementation');
  const totals = calculateOrderTotals(request.items);

  const mockOrder: Order = {
    id: `TEST-ORDER-${Date.now()}`,
    storeId: request.storeId,
    orderNumber: `ORD-${Date.now()}`,
    orderType: request.orderType,
    status: 'NEW',
    items: request.items,
    customer: request.customer,
    customerMasked: {
      name: request.customer.name.slice(0, 1) + '**',
      phone: maskPhone(request.customer.phone)
    },
    deliveryAddress: request.deliveryAddress,
    specialRequests: request.specialRequests,
    payment: {
      enabled: false,
      method: request.paymentMethod as any,
      channel: 'OFFLINE',
      status: 'NOT_PAID',
      totalAmount: totals.total
    },
    totals,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return mockOrder;
}

/**
 * Get order by ID (public API)
 *
 * Dual-path implementation:
 * - USE_FIREBASE=true: Calls Firebase Functions getOrder
 * - USE_FIREBASE=false: Throws error (not implemented in Mock mode)
 */
export async function getOrderPublic(params: GetOrderRequest): Promise<PublicOrder> {
  // 🔥 Firebase Functions Mode
  if (USE_FIREBASE) {
    try {
      console.log('[getOrderPublic] Using Firebase Functions');
      const callable = httpsCallable<GetOrderRequest, PublicOrder>(functions, 'getOrder');
      const result = await callable(params);
      return result.data;
    } catch (error) {
      console.error('[getOrderPublic] Firebase Functions error:', error);
      throw error;
    }
  }

  // 🔥 Mock Mode: Not implemented
  // In Mock mode, orders are not persisted, so getOrder is not available
  throw new Error('getOrderPublic is not available in Mock mode. Set VITE_USE_FIREBASE=true to use Firebase Functions.');
}

/**
 * Add order to retry queue (offline support)
 */
export function addToRetryQueue(request: CreateOrderRequest): void {
  const queueKey = `retry_queue_orders`;
  const queue = JSON.parse(localStorage.getItem(queueKey) || '[]');

  queue.push({
    type: 'createOrder',
    request,
    timestamp: Date.now(),
    retryCount: 0
  });

  localStorage.setItem(queueKey, JSON.stringify(queue));
  console.log('[Retry Queue] Order added to retry queue');
}

/**
 * Process retry queue
 */
export async function processRetryQueue(): Promise<void> {
  const queueKey = `retry_queue_orders`;
  const queue = JSON.parse(localStorage.getItem(queueKey) || '[]');

  if (queue.length === 0) return;

  console.log(`[Retry Queue] Processing ${queue.length} queued orders`);

  const processed: number[] = [];

  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    try {
      await createOrderPublic(item.request);
      processed.push(i);
      console.log('[Retry Queue] Successfully processed queued order', i);
    } catch (error) {
      console.error('[Retry Queue] Failed to process queued order', i, error);
      item.retryCount = (item.retryCount || 0) + 1;

      // Remove from queue after 5 failed attempts
      if (item.retryCount >= 5) {
        processed.push(i);
        console.error('[Retry Queue] Max retries reached, removing from queue', i);
      }
    }
  }

  // Remove processed items
  const newQueue = queue.filter((_: any, i: number) => !processed.includes(i));
  localStorage.setItem(queueKey, JSON.stringify(newQueue));
}
