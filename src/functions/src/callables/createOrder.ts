/**
 * createOrder Callable Function
 * T14-06: Order Creation
 *
 * Handles public order creation:
 * 1. Validates request
 * 2. Calculates totals (server-side authority)
 * 3. Masks PII
 * 4. Creates Order document in Firestore
 */

import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { CreateOrderRequest, Order, OrderItem, PaymentChannel } from '../types';

function maskPhone(phone: string): string {
  if (phone.length <= 4) return '***';
  return phone.slice(0, 3) + '***' + phone.slice(-2);
}

function calculateOrderTotals(items: OrderItem[]): {
  subtotal: number;
  tax: number;
  delivery: number;
  total: number;
} {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = Math.round(subtotal * 0.1);
  const delivery = subtotal >= 20000 ? 0 : 3000;
  const total = subtotal + tax + delivery;
  return { subtotal, tax, delivery, total };
}

export const createOrder = onCall(
  {
    region: 'asia-northeast3',
    memory: '256MiB',
    maxInstances: 50,
    cors: true // Allow public access
  },
  async (request) => {
    const data = request.data as CreateOrderRequest;

    // 1. Validation
    if (!data.storeId) {
      throw new HttpsError('invalid-argument', 'Missing storeId');
    }
    if (!data.items || data.items.length === 0) {
      throw new HttpsError('invalid-argument', 'Order must have items');
    }
    if (!data.customer || !data.customer.name || !data.customer.phone) {
      throw new HttpsError('invalid-argument', 'Customer info required');
    }
    if (!data.orderType) {
      throw new HttpsError('invalid-argument', 'Order type required');
    }
    if (!data.paymentMethod) {
      throw new HttpsError('invalid-argument', 'Payment method required');
    }

    // 2. Calculate Totals
    const itemTotals = calculateOrderTotals(data.items);

    // 🔥 A2-2: deliveryFee 처리
    const deliveryFee = data.deliveryFee || 0;
    const totals = {
      subtotal: itemTotals.subtotal,
      tax: itemTotals.tax,
      delivery: deliveryFee,  // 🔥 deliveryFee 반영
      total: itemTotals.subtotal + itemTotals.tax + deliveryFee  // 🔥 총액 재계산
    };

    // 3. Determine payment settings based on method
    const isOnlinePayment = data.paymentMethod === 'APP_CARD';
    const useOnlinePaymentFlag = process.env.USE_ONLINE_PAYMENT === 'true';

    // Validate online payment availability
    if (isOnlinePayment && !useOnlinePaymentFlag) {
      throw new HttpsError(
        'failed-precondition',
        'Online payment is not available. Please use offline payment methods.'
      );
    }

    const paymentChannel: PaymentChannel = isOnlinePayment ? 'ONLINE' : 'OFFLINE';
    const paymentEnabled = isOnlinePayment && useOnlinePaymentFlag;
    const paymentStatus = paymentEnabled ? 'PENDING' : 'NOT_PAID';

    // 4. Generate IDs
    const now = Date.now();
    const orderId = `ORD-${now}-${Math.random().toString(36).substr(2, 9)}`;
    const orderNumber = `#${now.toString().slice(-8)}`;

    // 5. Mask PII
    const customerMasked = {
      name: data.customer.name.slice(0, 1) + '**',
      phone: maskPhone(data.customer.phone)
    };

    // 6. Construct Order
    const order: Order = {
      id: orderId,
      storeId: data.storeId,
      orderNumber,
      orderType: data.orderType, // STEP 2-B: Add orderType field
      status: 'NEW',
      items: data.items,
      customer: data.customer,
      customerMasked,
      deliveryAddress: data.deliveryAddress,
      specialRequests: data.specialRequests,
      payment: {
        enabled: paymentEnabled,
        method: data.paymentMethod,
        channel: paymentChannel,
        status: paymentStatus,
        totalAmount: totals.total
      },
      totals,
      createdAt: now,
      updatedAt: now
    };

    // 6. Save to Firestore
    const db = getFirestore();
    const orderRef = db.doc(`stores/${data.storeId}/orders/${orderId}`);

    try {
      await orderRef.set({
        ...order,
        createdAt: FieldValue.serverTimestamp(), // Use server timestamp for consistency
        updatedAt: FieldValue.serverTimestamp()
      });

      console.log(`[createOrder] Order created: ${orderId} for store ${data.storeId}`);

      // Return the order object (with local timestamps for immediate UI use)
      return order;
    } catch (error: any) {
      console.error('[createOrder] Failed to save order:', error);
      throw new HttpsError('internal', 'Failed to create order');
    }
  }
);
