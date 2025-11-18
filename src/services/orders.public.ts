/**
 * Public Order Service
 * T14-06: Checkout & Order Creation (Billing OFF)
 * 
 * This service handles public order creation from customer checkout.
 * - PII masking in logs
 * - Retry queue integration
 * - Billing disabled (payment.enabled = false)
 * - Order status starts as 'NEW'
 */

import { CreateOrderRequest, Order, OrderItem } from '../types/order';

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
  const delivery = subtotal >= 20000 ? 0 : 3000; // Free delivery over ₩20,000
  const total = subtotal + tax + delivery;

  return { subtotal, tax, delivery, total };
}

/**
 * Create order (public API - Billing OFF)
 * T14-06: No payment processing, status starts as NEW
 */
export async function createOrderPublic(request: CreateOrderRequest): Promise<Order> {
  // Validate request
  const validation = validateOrderRequest(request);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Calculate totals
  const totals = calculateOrderTotals(request.items);

  // Generate order ID and number
  const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const orderNumber = `#${Date.now().toString().slice(-8)}`;

  // Create masked customer data (PII protection)
  const customerMasked = {
    name: request.customer.name.charAt(0) + '*'.repeat(request.customer.name.length - 1),
    phone: maskPhone(request.customer.phone)
  };

  // Create order object
  const order: Order = {
    id: orderId,
    storeId: request.storeId,
    orderNumber,
    status: 'NEW',
    items: request.items,
    customer: request.customer,
    customerMasked,
    deliveryAddress: request.deliveryAddress,
    specialRequests: request.specialRequests,
    payment: {
      enabled: false // T14-06: Billing OFF
    },
    totals,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  // In production, this would:
  // 1. Save to Firestore: stores/{storeId}/orders/{orderId}
  // 2. Create public document with masked data
  // 3. Add to retry queue if offline
  // 4. Log with PII masking
  
  console.log('[Order Create] Order created:', {
    orderId,
    orderNumber,
    storeId: request.storeId,
    itemCount: request.items.length,
    customer: customerMasked, // PII-safe logging
    total: totals.total,
    billingEnabled: false
  });

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock success - in production, return saved order from Firestore
  return order;
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
