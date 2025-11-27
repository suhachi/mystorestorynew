/**
 * Payment Method Selection Hook
 * T-PAY-02: Checkout UI Payment Method Integration
 */

import { useMemo } from 'react';
import type { NicepayStoreSettings, OrderType, PaymentMethod, StorePaymentSettings } from '../types/domain';

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
  orderTotal: number; // Added for minAmount check
}

type AppCardStatus = "HIDDEN" | "DISABLED_CONFIG" | "DISABLED_AMOUNT" | "ENABLED";

function getAppCardStatus(params: {
  useOnlinePaymentFlag: boolean;
  nicepay: NicepayStoreSettings | null | undefined;
  orderTotal: number;
}): AppCardStatus {
  const { useOnlinePaymentFlag, nicepay, orderTotal } = params;

  // 1. Global flag check
  if (!useOnlinePaymentFlag) return "HIDDEN";

  // 2. Nicepay enabled check
  if (!nicepay || !nicepay.enabled) return "HIDDEN";

  // 3. Configuration check
  const hasClientKey = !!nicepay.clientKey;
  const hasValidMode = nicepay.mode === "SANDBOX" || nicepay.mode === "LIVE";
  const appCardOn = !!nicepay.appCardEnabled;

  if (!hasClientKey || !hasValidMode || !appCardOn) {
    return "DISABLED_CONFIG";
  }

  // 4. Minimum amount check
  if (typeof nicepay.minAmount === "number" && nicepay.minAmount > 0 && orderTotal < nicepay.minAmount) {
    return "DISABLED_AMOUNT";
  }

  // 5. All checks passed
  return "ENABLED";
}

/**
 * Calculate available payment options based on:
 * - Order type (DELIVERY | PICKUP)
 * - Store payment settings
 * - Global online payment flag
 * - Order total (for min amount check)
 */
export function useCheckoutPaymentOptions({
  orderType,
  storePaymentSettings,
  globalOnlineFlag,
  orderTotal
}: UseCheckoutPaymentOptionsParams): PaymentOption[] {
  return useMemo(() => {
    const options: PaymentOption[] = [];

    // Default settings if not provided
    const settings: StorePaymentSettings = storePaymentSettings || {
      delivery: {
        appCard: false, // Default to false if no settings
        meetCard: true,
        meetCash: true
      },
      pickup: {
        appCard: false, // Default to false if no settings
        visitStore: true
      }
    };

    // Phase S3: Check NICEPAY settings
    const nicepaySettings = storePaymentSettings?.payments?.nicepay;

    // Calculate APP_CARD status based on Truth Table
    const appCardStatus = getAppCardStatus({
      useOnlinePaymentFlag: globalOnlineFlag,
      nicepay: nicepaySettings,
      orderTotal
    });

    // Helper to add APP_CARD option based on status
    const addAppCardOption = () => {
      if (appCardStatus === "HIDDEN") return;

      let description = "앱에서 카드로 바로 결제합니다.";
      let disabled = false;
      let disabledReason: string | undefined = undefined;

      if (appCardStatus === "DISABLED_CONFIG") {
        description = "상점에서 온라인 결제를 아직 완전히 설정하지 않았습니다.";
        disabled = true;
        disabledReason = "온라인 결제 설정 필요";
      } else if (appCardStatus === "DISABLED_AMOUNT") {
        const minAmount = nicepaySettings?.minAmount?.toLocaleString() ?? 0;
        description = `최소 ${minAmount}원 이상 주문 시 사용 가능합니다.`;
        disabled = true;
        disabledReason = `최소 주문 금액 ${minAmount}원 미달`;
      } else if (nicepaySettings?.mode === "SANDBOX") {
        description = "테스트 결제(SANDBOX 모드)";
      }

      options.push({
        key: 'APP_CARD',
        label: appCardStatus === "DISABLED_CONFIG" ? "앱 카드 결제 (설정 필요)" : "앱 카드 결제",
        description,
        isOnline: true,
        disabled,
        disabledReason
      });
    };

    if (orderType === 'DELIVERY') {
      // 배달: 앱상 카드결제
      // Note: We also check if 'delivery.appCard' is enabled in general settings,
      // but usually online payment availability overrides or works in tandem.
      // Assuming 'settings.delivery.appCard' is the switch for "Allow App Card for Delivery".
      if (settings.delivery.appCard) {
        addAppCardOption();
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
        addAppCardOption();
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
  }, [orderType, storePaymentSettings, globalOnlineFlag, orderTotal]);
}

/*
// OLD_IMPLEMENTATION (STEP C3까지 사용)
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

    // Online Payment Flag (Global)
    const USE_ONLINE_PAYMENT = globalOnlineFlag;

    // Phase S3: Check NICEPAY settings
    const nicepaySettings = storePaymentSettings?.payments?.nicepay;

    // Condition to show APP_CARD
    // 1. Global flag is true
    // 2. Store has NICEPAY enabled
    // 3. Store has APP_CARD enabled
    // 4. Client Key is present
    const isNicepayAppCardAvailable =
      USE_ONLINE_PAYMENT &&
      !!nicepaySettings &&
      nicepaySettings.enabled === true &&
      nicepaySettings.appCardEnabled === true &&
      !!nicepaySettings.clientKey;

    if (orderType === 'DELIVERY') {
      // 배달: 앱상 카드결제
      if (settings.delivery.appCard && isNicepayAppCardAvailable) {
        options.push({
          key: 'APP_CARD',
          label: '앱에서 카드결제',
          description: 'NICEPAY 안전결제',
          isOnline: true,
          disabled: false // Now fully enabled if conditions met
        });
      } else if (settings.delivery.appCard && !isNicepayAppCardAvailable) {
        // Optional: Show disabled state if configured but not available (e.g. missing key)
        // For now, we hide it or keep existing behavior (disabled with reason)
        // If global flag is off but store setting is on -> show disabled
        options.push({
          key: 'APP_CARD',
          label: '앱에서 카드결제',
          description: 'NICEPAY 안전결제',
          isOnline: true,
          disabled: true,
          disabledReason: '온라인 결제 준비중입니다'
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
      if (settings.pickup.appCard && isNicepayAppCardAvailable) {
        options.push({
          key: 'APP_CARD',
          label: '앱에서 카드결제',
          description: 'NICEPAY 안전결제',
          isOnline: true,
          disabled: false
        });
      } else if (settings.pickup.appCard && !isNicepayAppCardAvailable) {
        options.push({
          key: 'APP_CARD',
          label: '앱에서 카드결제',
          description: 'NICEPAY 안전결제',
          isOnline: true,
          disabled: true,
          disabledReason: '온라인 결제 준비중입니다'
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
*/
