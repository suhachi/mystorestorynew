"use strict";
/**
 * getOrder Callable Function
 * T14-07: Public Order Tracking
 *
 * Securely fetches order data for public tracking:
 * 1. Fetches order from Firestore
 * 2. Removes PII (customer details)
 * 3. Returns PublicOrder object
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrder = void 0;
const firestore_1 = require("firebase-admin/firestore");
const https_1 = require("firebase-functions/v2/https");
exports.getOrder = (0, https_1.onCall)({
    region: 'asia-northeast3',
    memory: '256MiB',
    maxInstances: 50,
    cors: true // Allow public access
}, async (request) => {
    const data = request.data;
    if (!data.storeId || !data.orderId) {
        throw new https_1.HttpsError('invalid-argument', 'Missing storeId or orderId');
    }
    const db = (0, firestore_1.getFirestore)();
    const orderRef = db.doc(`stores/${data.storeId}/orders/${data.orderId}`);
    const orderDoc = await orderRef.get();
    if (!orderDoc.exists) {
        throw new https_1.HttpsError('not-found', 'Order not found');
    }
    const order = orderDoc.data();
    // Construct PublicOrder (exclude PII)
    const publicOrder = {
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
        createdAt: typeof order.createdAt === 'number' ? order.createdAt : order.createdAt.toMillis(),
        updatedAt: typeof order.updatedAt === 'number' ? order.updatedAt : order.updatedAt.toMillis()
    };
    return publicOrder;
});
//# sourceMappingURL=getOrder.js.map