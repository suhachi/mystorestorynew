import type { NicepayStoreSettings } from '../../../types/domain';
import { Card } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Switch } from '../../ui/switch';

interface NicepaySettingsSectionProps {
  value: NicepayStoreSettings;
  disabled?: boolean;
  onChange: (next: NicepayStoreSettings) => void;
}

export default function NicepaySettingsSection({ value, disabled, onChange }: NicepaySettingsSectionProps) {
  const update = (patch: Partial<NicepayStoreSettings>) =>
    onChange({ ...value, ...patch });

  return (
    <Card data-testid="nicepay-settings-section" className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">온라인 결제 (NICEPAY)</h2>
          <p className="text-sm text-gray-500">고객이 앱에서 카드 결제를 사용할 수 있도록 NICEPAY 설정을 관리합니다.</p>
        </div>
      </div>

      {/* enabled */}
      <div className="flex items-center justify-between">
        <Label htmlFor="nicepay-enabled" className="flex flex-col gap-1">
          <span>온라인 결제 사용</span>
          <span className="text-sm text-gray-500 font-normal">고객이 결제 단계에서 "앱 카드 결제" 옵션을 볼 수 있게 합니다.</span>
        </Label>
        <Switch
          id="nicepay-enabled"
          data-testid="nicepay-enabled-toggle"
          disabled={disabled}
          checked={value.enabled}
          onCheckedChange={(checked) => update({ enabled: checked })}
        />
      </div>

      {/* Client Key */}
      <div className="space-y-2">
        <Label htmlFor="nicepay-client-key">Client Key</Label>
        <Input
          id="nicepay-client-key"
          data-testid="nicepay-client-key-input"
          type="text"
          disabled={disabled || !value.enabled}
          value={value.clientKey ?? ""}
          onChange={(e) => update({ clientKey: e.target.value })}
          placeholder="예: prod_xxxxxxxxxxxxxxxxx"
        />
        <p className="text-xs text-gray-500">NICEPAY 관리자 콘솔에서 발급된 Client Key를 입력하세요.</p>
      </div>

      {/* Mode */}
      <div className="space-y-2">
        <Label htmlFor="nicepay-mode">운영 모드</Label>
        <Select
          disabled={disabled || !value.enabled}
          value={value.mode}
          onValueChange={(val) => update({ mode: val as any })}
        >
          <SelectTrigger id="nicepay-mode" data-testid="nicepay-mode-select">
            <SelectValue placeholder="선택하세요" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NONE">선택하세요</SelectItem>
            <SelectItem value="SANDBOX">SANDBOX (테스트)</SelectItem>
            <SelectItem value="LIVE">LIVE (실 서비스)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500">테스트 중에는 SANDBOX, 실제 결제에서는 LIVE를 선택해 주세요.</p>
      </div>

      {/* 앱 카드 결제 허용 */}
      <div className="flex items-center justify-between">
        <Label htmlFor="nicepay-appcard" className="flex flex-col gap-1">
          <span>앱 카드 결제 허용</span>
          <span className="text-sm text-gray-500 font-normal">고객이 Checkout에서 "앱 카드 결제" 방식을 선택할 수 있게 합니다.</span>
        </Label>
        <Switch
          id="nicepay-appcard"
          data-testid="nicepay-appcard-toggle"
          disabled={disabled || !value.enabled}
          checked={value.appCardEnabled}
          onCheckedChange={(checked) => update({ appCardEnabled: checked })}
        />
      </div>

      {/* 최소 결제 금액 */}
      <div className="space-y-2">
        <Label htmlFor="nicepay-min-amount">최소 결제 금액 (선택)</Label>
        <div className="relative">
          <Input
            id="nicepay-min-amount"
            data-testid="nicepay-min-amount-input"
            type="number"
            disabled={disabled || !value.enabled}
            value={value.minAmount ?? ""}
            onChange={(e) => update({ minAmount: e.target.value ? Number(e.target.value) : undefined })}
            placeholder="예: 5000"
            className="pr-8"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">원</span>
        </div>
        <p className="text-xs text-gray-500">이 금액 미만의 주문은 온라인 결제를 사용할 수 없습니다.</p>
      </div>
    </Card>
  );
}
