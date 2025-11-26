/**
 * Payment Method Selection Hook
 * T-PAY-02: Checkout UI Payment Method Integration
 */

import { useMemo } from 'react';
import type { OrderType, PaymentMethod, StorePaymentSettings } from '../types/domain';

export interface PaymentOption {
  key: PaymentMethod;
  label: string;
  description: string;
  isOnline: boolean;
  disabled: boolean;
  disabledReason?: string;
}

interface UseCheckoutPaymentOptionsParams {
  orderType: OrderType;
  storePaymentSettings?: StorePaymentSettings;
  globalOnlineFlag: boolean;
}

/**
 * Calculate available payment options based on:
 * - Order type (DELIVERY | PICKUP)
 * - Store payment settings
 * - Global online payment flag
 */
export function useCheckoutPaymentOptions({
  orderType,
  storePaymentSettings,
  globalOnlineFlag
}: UseCheckoutPaymentOptionsParams): PaymentOption[] {
  return useMemo(() => {
    const options: PaymentOption[] = [];

    // Default settings if not provided (Phase 1 not implemented yet)
    const settings: StorePaymentSettings = storePaymentSettings || {
      delivery: {
        appCard: true,
        meetCard: true,
        meetCash: true
      },
      pickup: {
        appCard: true,
        visitStore: true
      }
    };

    if (orderType === 'DELIVERY') {
      // 배달: 앱상 카드결제
      if (settings.delivery.appCard) {
        options.push({
          key: 'APP_CARD',
          label: '앱에서 카드결제',
          description: 'NICEPAY 안전결제',
          isOnline: true,
          disabled: !globalOnlineFlag,
          disabledReason: globalOnlineFlag ? undefined : '온라인 결제 준비중입니다'
        });
      }

      // 배달: 만나서 카드결제
      if (settings.delivery.meetCard) {
        options.push({
          key: 'MEET_CARD',
          label: '만나서 카드결제',
          description: '배달 시 카드 단말기로 결제',
          isOnline: false,
          disabled: false
        });
      }

      // 배달: 만나서 현금결제
      if (settings.delivery.meetCash) {
        options.push({
          key: 'MEET_CASH',
          label: '만나서 현금결제',
          description: '배달 시 현금으로 결제',
          isOnline: false,
          disabled: false
        });
      }
    } else if (orderType === 'PICKUP') {
      // 포장: 앱상 카드결제
      if (settings.pickup.appCard) {
        options.push({
          key: 'APP_CARD',
          label: '앱에서 카드결제',
          description: 'NICEPAY 안전결제',
          isOnline: true,
          disabled: !globalOnlineFlag,
          disabledReason: globalOnlineFlag ? undefined : '온라인 결제 준비중입니다'
        });
      }

      // 포장: 매장 방문 결제
      if (settings.pickup.visitStore) {
        options.push({
          key: 'VISIT_STORE',
          label: '매장 방문 결제',
          description: '매장에서 직접 결제',
          isOnline: false,
          disabled: false
        });
      }
    }

    return options;
  }, [orderType, storePaymentSettings, globalOnlineFlag]);
}
