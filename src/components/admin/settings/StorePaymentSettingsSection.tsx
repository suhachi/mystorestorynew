/**
 * Store Payment Settings Section Component
 * PAY-ADMIN-01: Admin UI for configuring payment methods per order type
 */

import { AlertCircle } from 'lucide-react';
import type { StorePaymentSettings } from '../../../types/domain';
import { Alert, AlertDescription } from '../../ui/alert';
import { Card } from '../../ui/card';
import { Label } from '../../ui/label';
import { Switch } from '../../ui/switch';

export const DEFAULT_STORE_PAYMENT_SETTINGS: StorePaymentSettings = {
  delivery: {
    appCard: false,
    meetCard: true,
    meetCash: true,
  },
  pickup: {
    appCard: false,
    visitStore: true,
  },
};

export function validateStorePaymentSettings(settings: StorePaymentSettings): {
  deliveryValid: boolean;
  pickupValid: boolean;
  errors: string[];
} {
  const deliveryValid =
    settings.delivery.appCard ||
    settings.delivery.meetCard ||
    settings.delivery.meetCash;

  const pickupValid =
    settings.pickup.appCard ||
    settings.pickup.visitStore;

  const errors: string[] = [];
  if (!deliveryValid) {
    errors.push('배달 주문에 사용할 결제 방식은 최소 1개 이상 선택해야 합니다.');
  }
  if (!pickupValid) {
    errors.push('포장 주문에 사용할 결제 방식은 최소 1개 이상 선택해야 합니다.');
  }

  return { deliveryValid, pickupValid, errors };
}

interface StorePaymentSettingsSectionProps {
  value: StorePaymentSettings;
  onChange: (value: StorePaymentSettings) => void;
  disabled?: boolean;
}

export function StorePaymentSettingsSection({
  value,
  onChange,
  disabled = false,
}: StorePaymentSettingsSectionProps) {
  const handleDeliveryChange = (field: keyof StorePaymentSettings['delivery']) => (checked: boolean) => {
    onChange({
      ...value,
      delivery: {
        ...value.delivery,
        [field]: checked,
      },
    });
  };

  const handlePickupChange = (field: keyof StorePaymentSettings['pickup']) => (checked: boolean) => {
    onChange({
      ...value,
      pickup: {
        ...value.pickup,
        [field]: checked,
      },
    });
  };

  const validation = validateStorePaymentSettings(value);
  const hasErrors = validation.errors.length > 0;

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold">결제 방식 설정</h3>

      {hasErrors && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {validation.errors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {/* 배달 주문 결제 방식 */}
      <div className="mb-6">
        <h4 className="mb-3 font-medium">배달 주문 결제 방식</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="delivery-app-card" className="flex flex-col gap-1">
              <span>앱에서 카드결제</span>
              <span className="text-sm text-gray-500 font-normal">NICEPAY 온라인 결제</span>
            </Label>
            <Switch
              id="delivery-app-card"
              checked={value.delivery.appCard}
              onCheckedChange={handleDeliveryChange('appCard')}
              disabled={disabled}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="delivery-meet-card" className="flex flex-col gap-1">
              <span>만나서 카드결제</span>
              <span className="text-sm text-gray-500 font-normal">배달 시 카드 단말기로 결제</span>
            </Label>
            <Switch
              id="delivery-meet-card"
              checked={value.delivery.meetCard}
              onCheckedChange={handleDeliveryChange('meetCard')}
              disabled={disabled}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="delivery-meet-cash" className="flex flex-col gap-1">
              <span>만나서 현금결제</span>
              <span className="text-sm text-gray-500 font-normal">배달 시 현금으로 결제</span>
            </Label>
            <Switch
              id="delivery-meet-cash"
              checked={value.delivery.meetCash}
              onCheckedChange={handleDeliveryChange('meetCash')}
              disabled={disabled}
            />
          </div>
        </div>
      </div>

      {/* 포장 주문 결제 방식 */}
      <div>
        <h4 className="mb-3 font-medium">포장 주문 결제 방식</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="pickup-app-card" className="flex flex-col gap-1">
              <span>앱에서 카드결제</span>
              <span className="text-sm text-gray-500 font-normal">NICEPAY 온라인 결제</span>
            </Label>
            <Switch
              id="pickup-app-card"
              checked={value.pickup.appCard}
              onCheckedChange={handlePickupChange('appCard')}
              disabled={disabled}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="pickup-visit-store" className="flex flex-col gap-1">
              <span>매장 방문 결제</span>
              <span className="text-sm text-gray-500 font-normal">매장에서 직접 결제</span>
            </Label>
            <Switch
              id="pickup-visit-store"
              checked={value.pickup.visitStore}
              onCheckedChange={handlePickupChange('visitStore')}
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
