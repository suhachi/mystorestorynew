/**
 * getOrder Callable Function
 * T14-07: Public Order Tracking
 *
 * Securely fetches order data for public tracking:
 * 1. Fetches order from Firestore
 * 2. Removes PII (customer details)
 * 3. Returns PublicOrder object
 */

import { getFirestore } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { GetOrderRequest, Order, PublicOrder } from '../types';

export const getOrder = onCall(
  {
    region: 'asia-northeast3',
    memory: '256MiB',
    maxInstances: 50,
    cors: true // Allow public access
  },
  async (request) => {
    const data = request.data as GetOrderRequest;

    if (!data.storeId || !data.orderId) {
      throw new HttpsError('invalid-argument', 'Missing storeId or orderId');
    }

    const db = getFirestore();
    const orderRef = db.doc(`stores/${data.storeId}/orders/${data.orderId}`);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      throw new HttpsError('not-found', 'Order not found');
    }

    const order = orderDoc.data() as Order;

    // Construct PublicOrder (exclude PII)
    const publicOrder: PublicOrder = {
      id: order.id,
      storeId: order.storeId,
      orderNumber: order.orderNumber,
      orderType: order.orderType, // STEP 2-C: Add orderType field
      status: order.status,
      items: order.items,
      customerMasked: order.customerMasked,
      deliveryAddress: order.deliveryAddress,
      specialRequests: order.specialRequests,
      payment: order.payment,
      totals: order.totals,
      createdAt: typeof order.createdAt === 'number' ? order.createdAt : (order.createdAt as any).toMillis(),
      updatedAt: typeof order.updatedAt === 'number' ? order.updatedAt : (order.updatedAt as any).toMillis()
    };

    return publicOrder;
  }
);
