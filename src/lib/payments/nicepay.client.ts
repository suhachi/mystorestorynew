
export interface NicepayConfig {
  clientId: string;
  method: string;
  orderId: string;
  amount: number;
  goodsName: string;
  buyerName: string;
  buyerTel: string;
  buyerEmail?: string;
  returnUrl?: string; // Optional if using callback
  fnError?: (result: any) => void;
  fnSuccess?: (result: any) => void; // Assuming callback support
}

export interface NicepayResult {
  resultCode: string;
  resultMsg: string;
  tid: string;
  authDate?: string;
  amount?: number;
  // Add other fields as needed
}

/**
 * Request Nicepay Payment
 * Wraps AUTHNICE.requestPay in a Promise
 */
export const requestNicepayPay = (config: NicepayConfig): Promise<NicepayResult> => {
  return new Promise((resolve, reject) => {
    if (!window.AUTHNICE) {
      reject(new Error('NICEPAY SDK not loaded'));
      return;
    }

    // Enhanced config with callbacks
    const enhancedConfig = {
      ...config,
      fnSuccess: (result: any) => {
        console.log('[NICEPAY] Success callback:', result);
        resolve(result as NicepayResult);
      },
      fnError: (result: any) => {
        console.error('[NICEPAY] Error callback:', result);
        reject(new Error(result.errorMsg || 'Payment failed'));
      },
      // Fallback for close/cancel if supported
      fnClose: () => {
        reject(new Error('Payment window closed'));
      }
    };

    try {
      window.AUTHNICE.requestPay(enhancedConfig);
    } catch (e) {
      reject(e);
    }
  });
};
