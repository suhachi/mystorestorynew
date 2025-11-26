/**
 * NicePay Service Helper
 * T-PG-02: NicePay Integration Logic
 */

import * as crypto from 'crypto';
import { defineSecret } from 'firebase-functions/params';

// Define secrets
const nicepayMerchantKey = defineSecret('NICEPAY_MERCHANT_KEY');
const nicepayClientKey = defineSecret('NICEPAY_CLIENT_KEY');
const nicepayMid = defineSecret('NICEPAY_MID');

export const getNicepayConfig = () => {
  return {
    merchantKey: nicepayMerchantKey.value(),
    clientKey: nicepayClientKey.value(),
    mid: nicepayMid.value(),
    apiBaseUrl: 'https://sandbox-api.nicepay.co.kr/v1', // Default to sandbox, change for prod
  };
};

export const nicepaySecrets = [nicepayMerchantKey, nicepayClientKey, nicepayMid];

/**
 * Generate NicePay Signature
 * signature = hex(sha256(tid + mid + amount + merchantKey))
 */
export function generateSignature(tid: string, mid: string, amount: number, merchantKey: string): string {
  const data = `${tid}${mid}${amount}${merchantKey}`;
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Verify NicePay Signature
 */
export function verifySignature(signature: string, tid: string, mid: string, amount: number, merchantKey: string): boolean {
  const expected = generateSignature(tid, mid, amount, merchantKey);
  return signature === expected;
}

/**
 * Approve Payment (Server-to-Server)
 */
export async function approvePayment(tid: string, amount: number, orderId: string) {
  const config = getNicepayConfig();
  const signature = generateSignature(tid, config.mid, amount, config.merchantKey);

  const response = await fetch(`${config.apiBaseUrl}/payments/${tid}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from(config.clientKey + ':').toString('base64')}`
    },
    body: JSON.stringify({
      amount,
      orderId,
      SignData: signature,
      EdiDate: new Date().toISOString()
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`NicePay API Error: ${response.status} ${errorBody}`);
  }

  return await response.json();
}
