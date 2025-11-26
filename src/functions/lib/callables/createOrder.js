"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = void 0;
const firestore_1 = require("firebase-admin/firestore");
const https_1 = require("firebase-functions/v2/https");
function maskPhone(phone) {
    if (phone.length <= 4)
        return '***';
    return phone.slice(0, 3) + '***' + phone.slice(-2);
}
function calculateOrderTotals(items) {
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = Math.round(subtotal * 0.1);
    const delivery = subtotal >= 20000 ? 0 : 3000;
    const total = subtotal + tax + delivery;
    return { subtotal, tax, delivery, total };
}
exports.createOrder = (0, https_1.onCall)({
    region: 'asia-northeast3',
    memory: '256MiB',
    maxInstances: 50,
    cors: true // Allow public access
}, async (request) => {
    const data = request.data;
    // 1. Validation
    if (!data.storeId) {
        throw new https_1.HttpsError('invalid-argument', 'Missing storeId');
    }
    if (!data.items || data.items.length === 0) {
        throw new https_1.HttpsError('invalid-argument', 'Order must have items');
    }
    if (!data.customer || !data.customer.name || !data.customer.phone) {
        throw new https_1.HttpsError('invalid-argument', 'Customer info required');
    }
    if (!data.orderType) {
        throw new https_1.HttpsError('invalid-argument', 'Order type required');
    }
    if (!data.paymentMethod) {
        throw new https_1.HttpsError('invalid-argument', 'Payment method required');
    }
    // 2. Calculate Totals
    const itemTotals = calculateOrderTotals(data.items);
    // 🔥 A2-2: deliveryFee 처리
    const deliveryFee = data.deliveryFee || 0;
    const totals = {
        subtotal: itemTotals.subtotal,
        tax: itemTotals.tax,
        delivery: deliveryFee, // 🔥 deliveryFee 반영
        total: itemTotals.subtotal + itemTotals.tax + deliveryFee // 🔥 총액 재계산
    };
    // 3. Determine payment settings based on method
    const isOnlinePayment = data.paymentMethod === 'APP_CARD';
    const useOnlinePaymentFlag = process.env.USE_ONLINE_PAYMENT === 'true';
    // Validate online payment availability
    if (isOnlinePayment && !useOnlinePaymentFlag) {
        throw new https_1.HttpsError('failed-precondition', 'Online payment is not available. Please use offline payment methods.');
    }
    const paymentChannel = isOnlinePayment ? 'ONLINE' : 'OFFLINE';
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
    const order = {
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
    const db = (0, firestore_1.getFirestore)();
    const orderRef = db.doc(`stores/${data.storeId}/orders/${orderId}`);
    try {
        await orderRef.set({
            ...order,
            createdAt: firestore_1.FieldValue.serverTimestamp(), // Use server timestamp for consistency
            updatedAt: firestore_1.FieldValue.serverTimestamp()
        });
        console.log(`[createOrder] Order created: ${orderId} for store ${data.storeId}`);
        // Return the order object (with local timestamps for immediate UI use)
        return order;
    }
    catch (error) {
        console.error('[createOrder] Failed to save order:', error);
        throw new https_1.HttpsError('internal', 'Failed to create order');
    }
});
//# sourceMappingURL=createOrder.js.map