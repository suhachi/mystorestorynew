import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase/config';
import type { Order } from '../types/order';

/**
 * Request payload for confirming a payment
 */
export interface ConfirmPaymentRequest {
  storeId: string;
  orderId: string;
  tid: string;
  amount: number;
}

/**
 * Response from confirmPayment function
 * Returns the updated Order object
 */
export type ConfirmPaymentResponse = Order;

/**
 * Call Firebase Function to confirm payment
 * This finalizes the order status to PAID
 */
export async function confirmPaymentPublic(
  payload: ConfirmPaymentRequest
): Promise<ConfirmPaymentResponse> {
  const callable = httpsCallable<ConfirmPaymentRequest, ConfirmPaymentResponse>(
    functions,
    'confirmPayment'
  );

  const result = await callable(payload);
  return result.data;
}
