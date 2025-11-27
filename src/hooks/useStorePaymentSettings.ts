import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { db } from "../firebase/config";
import type { NicepayStoreSettings, StorePaymentSettings } from "../types/domain";

type UseStorePaymentSettingsResult = {
  loading: boolean;
  error: Error | null;
  settings: StorePaymentSettings | null;
  save: (next: StorePaymentSettings) => Promise<void>;
};

function createDefaultNicepaySettings(): NicepayStoreSettings {
  return {
    enabled: false,
    clientKey: null,
    mode: "NONE",
    appCardEnabled: false,
    minAmount: undefined,
  };
}

function withDefaults(raw: any | undefined): StorePaymentSettings {
  // raw가 없을 수 있으므로 기본값을 채운다.
  const base: StorePaymentSettings = raw ?? {
    delivery: { appCard: false, meetCard: true, meetCash: true },
    pickup: { appCard: false, visitStore: true }
  };

  const payments = base.payments ?? ({} as any);

  return {
    ...base,
    payments: {
      ...payments,
      nicepay: {
        ...createDefaultNicepaySettings(),
        ...(payments.nicepay ?? {}),
      },
    },
  };
}

export function useStorePaymentSettings(storeId: string | undefined): UseStorePaymentSettingsResult {
  const [loading, setLoading] = useState<boolean>(!!storeId);
  const [error, setError] = useState<Error | null>(null);
  const [settings, setSettings] = useState<StorePaymentSettings | null>(null);

  useEffect(() => {
    if (!storeId) {
      setLoading(false);
      setSettings(null);
      return;
    }

    const ref = doc(db, "stores", storeId);

    const unsub = onSnapshot(
      ref,
      (snap) => {
        const data = snap.data();
        // paymentSettings 필드 사용 (domain.ts 및 기존 패턴 따름)
        const rawSettings = data?.paymentSettings;
        setSettings(withDefaults(rawSettings));
        setLoading(false);
      },
      (err) => {
        console.error("useStorePaymentSettings snapshot error", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [storeId]);

  const save = useCallback(
    async (next: StorePaymentSettings) => {
      if (!storeId) return;
      setLoading(true);
      setError(null);
      try {
        const ref = doc(db, "stores", storeId);
        await updateDoc(ref, {
          paymentSettings: next,
        });
        setLoading(false);
      } catch (err: any) {
        console.error("useStorePaymentSettings save error", err);
        setError(err);
        setLoading(false);
        throw err;
      }
    },
    [storeId]
  );

  return { loading, error, settings, save };
}
