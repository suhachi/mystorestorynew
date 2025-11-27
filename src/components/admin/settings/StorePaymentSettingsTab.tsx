import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useStorePaymentSettings } from "../../../hooks/useStorePaymentSettings";
import type { NicepayStoreSettings, StorePaymentSettings } from "../../../types/domain";
import { Button } from "../../ui/button";
import NicepaySettingsSection from "./NicepaySettingsSection";
import { StorePaymentSettingsSection } from "./StorePaymentSettingsSection";

interface StorePaymentSettingsTabProps {
  storeId: string;
}

export default function StorePaymentSettingsTab({ storeId }: StorePaymentSettingsTabProps) {
  const { loading, error, settings, save } = useStorePaymentSettings(storeId);
  const [localSettings, setLocalSettings] = useState<StorePaymentSettings | null>(null);

  // settings가 변경되면 localSettings 초기화
  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const handleOfflineChange = (offline: StorePaymentSettings) => {
    if (!localSettings) return;
    // StorePaymentSettingsSection은 value 전체를 반환하므로 그대로 병합
    // 하지만 StorePaymentSettingsSection의 onChange는 (value: StorePaymentSettings) => void 형태임
    // 여기서는 StorePaymentSettingsSection이 delivery/pickup을 포함한 전체 객체를 다루므로
    // offline 인자가 이미 StorePaymentSettings 타입임 (delivery, pickup 포함)

    // *주의*: StorePaymentSettingsSection의 onChange는 전체 객체를 덮어씀.
    // 따라서 offline은 { delivery: ..., pickup: ... } 형태의 StorePaymentSettings 구조여야 함.
    // 기존 payments.nicepay는 유지해야 함.

    setLocalSettings({
      ...localSettings,
      delivery: offline.delivery, // delivery 덮어쓰기
      pickup: offline.pickup,     // pickup 덮어쓰기
      payments: localSettings.payments // 기존 payments (nicepay 포함) 유지
    });
  };

  const handleNicepayChange = (nicepay: NicepayStoreSettings) => {
    if (!localSettings) return;
    setLocalSettings({
      ...localSettings,
      payments: {
        ...localSettings.payments,
        nicepay,
      },
    });
  };

  const handleSave = async () => {
    if (!localSettings) return;
    try {
      await save(localSettings);
      toast.success("결제 설정이 저장되었습니다.");
    } catch (err) {
      console.error("결제 설정 저장 실패", err);
      toast.error("결제 설정 저장에 실패했습니다.");
    }
  };

  if (loading && !localSettings) {
    return <div className="p-4 text-center text-gray-500" data-testid="payment-settings-loading">결제 설정을 불러오는 중입니다...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500" data-testid="payment-settings-error">결제 설정을 불러오는데 실패했습니다.</div>;
  }

  if (!localSettings) {
    return <div className="p-4 text-center text-gray-500" data-testid="payment-settings-empty">결제 설정 데이터가 없습니다.</div>;
  }

  // StorePaymentSettingsSection은 StorePaymentSettings 전체를 받음 (delivery, pickup)
  const offlineSettings = localSettings;
  const nicepaySettings = localSettings.payments?.nicepay!; // withDefaults에서 항상 채워줌

  return (
    <div data-testid="payment-settings-root" className="space-y-8">
      <StorePaymentSettingsSection
        value={offlineSettings}
        onChange={handleOfflineChange}
      />

      <NicepaySettingsSection
        value={nicepaySettings}
        onChange={handleNicepayChange}
      />

      <div className="flex justify-end">
        <Button
          data-testid="payment-save-button"
          onClick={handleSave}
          disabled={loading}
          className="bg-primary-blue hover:bg-primary-blue-dark"
        >
          <Save className="w-4 h-4 mr-2" />
          결제 설정 저장
        </Button>
      </div>
    </div>
  );
}

/*
// OLD IMPLEMENTATION (STEP C2)
export default function StorePaymentSettingsTab() {
  // 임시 로컬 상태 — C3에서 Firestore 데이터로 대체 예정
  const [offlineSettings, setOfflineSettings] = useState<StorePaymentSettings>({
    delivery: { appCard: false, meetCash: true, meetCard: true },
    pickup: { appCard: false, visitStore: true }
  });

  const [nicepaySettings, setNicepaySettings] = useState<NicepayStoreSettings>({
    enabled: false,
    clientKey: "",
    mode: "NONE",
    appCardEnabled: false,
    minAmount: undefined
  });

  const handleSave = () => {
    console.log("Saving payment settings...", {
      offlineSettings,
      nicepaySettings
    });
    toast.success("결제 설정이 저장되었습니다. (Mock)");
  };

  return (
    <div data-testid="payment-settings-root" className="space-y-8">
      <StorePaymentSettingsSection
        value={offlineSettings}
        onChange={setOfflineSettings}
      />

      <NicepaySettingsSection
        value={nicepaySettings}
        onChange={setNicepaySettings}
      />

      <div className="flex justify-end">
        <Button
          data-testid="payment-save-button"
          onClick={handleSave}
          className="bg-primary-blue hover:bg-primary-blue-dark"
        >
          <Save className="w-4 h-4 mr-2" />
          결제 설정 저장
        </Button>
      </div>
    </div>
  );
}
*/
