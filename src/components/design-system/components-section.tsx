import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { Checkbox } from '../ui/checkbox';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Loader2, CheckCircle, XCircle, Clock, Truck, AlertCircle, Info } from 'lucide-react';
import { OrderStatusBadge } from '../order/OrderStatusBadge';
import { Skeleton } from '../ui/skeleton';

export function ComponentsSection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-heading-2 text-gray-900 mb-2">Components</h2>
        <p className="text-body text-gray-600">
          재사용 가능한 UI 컴포넌트 라이브러리
        </p>
      </div>

      <Tabs defaultValue="atoms" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="atoms">Atoms</TabsTrigger>
          <TabsTrigger value="molecules">Molecules</TabsTrigger>
          <TabsTrigger value="organisms">Organisms</TabsTrigger>
        </TabsList>

        <TabsContent value="atoms" className="space-y-8">
          <AtomsShowcase />
        </TabsContent>

        <TabsContent value="molecules" className="space-y-8">
          <MoleculesShowcase />
        </TabsContent>

        <TabsContent value="organisms" className="space-y-8">
          <OrganismsShowcase />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AtomsShowcase() {
  return (
    <>
      {/* Buttons */}
      <ComponentDemo
        title="Buttons"
        description="Primary, Secondary, Ghost, Destructive 버튼 variants with loading and disabled states"
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button>Primary Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button disabled>Disabled</Button>
            <Button>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading
            </Button>
          </div>
        </div>
      </ComponentDemo>

      {/* Badges */}
      <ComponentDemo
        title="Badges"
        description="주문 상태 전용 배지 with icon mapping and a11y labels"
      >
        <div className="flex flex-wrap gap-3">
          <OrderStatusBadge status="new" />
          <OrderStatusBadge status="confirmed" />
          <OrderStatusBadge status="preparing" />
          <OrderStatusBadge status="ready" />
          <OrderStatusBadge status="delivering" />
          <OrderStatusBadge status="delivered" />
          <OrderStatusBadge status="cancelled" />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </ComponentDemo>

      {/* Inputs */}
      <ComponentDemo
        title="Input Fields"
        description="Text, phone, with helper/success/error states and character counter"
      >
        <div className="space-y-4 max-w-md">
          <div>
            <Label htmlFor="input-default">Default Input</Label>
            <Input id="input-default" placeholder="Enter text..." />
          </div>
          <div>
            <Label htmlFor="input-phone">Phone Number</Label>
            <Input id="input-phone" type="tel" placeholder="010-1234-5678" />
            <p className="text-caption text-gray-500 mt-1">숫자 9자리 이상 필요</p>
          </div>
          <div>
            <Label htmlFor="input-error">Error State</Label>
            <Input id="input-error" className="border-error-red" placeholder="Invalid input" />
            <p className="text-caption text-error-red mt-1">필수 입력 항목입니다</p>
          </div>
          <div>
            <Label htmlFor="input-success">Success State</Label>
            <Input id="input-success" className="border-success-green" placeholder="Valid input" />
            <p className="text-caption text-success-green mt-1">올바른 형식입니다</p>
          </div>
          <div>
            <Label htmlFor="textarea">Textarea with Counter</Label>
            <Textarea id="textarea" placeholder="요청사항을 입력하세요..." maxLength={500} />
            <p className="text-caption text-gray-500 mt-1 text-right">0 / 500</p>
          </div>
        </div>
      </ComponentDemo>

      {/* Form Elements */}
      <ComponentDemo
        title="Form Controls"
        description="Checkbox, Switch, Select with proper labeling"
      >
        <div className="space-y-6 max-w-md">
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <label htmlFor="terms" className="text-body-small cursor-pointer">
              이용약관에 동의합니다
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">알림 수신</Label>
            <Switch id="notifications" />
          </div>

          <div>
            <Label htmlFor="select">Select Menu</Label>
            <Select>
              <SelectTrigger id="select">
                <SelectValue placeholder="옵션을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">옵션 1</SelectItem>
                <SelectItem value="option2">옵션 2</SelectItem>
                <SelectItem value="option3">옵션 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </ComponentDemo>

      {/* Icons */}
      <ComponentDemo
        title="Icons (Lucide)"
        description="일관된 아이콘 세트 - 12px, 16px, 20px, 24px, 32px sizes"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <CheckCircle size={12} className="text-success-green mx-auto mb-1" />
              <span className="text-caption text-gray-500">12px</span>
            </div>
            <div className="text-center">
              <CheckCircle size={16} className="text-success-green mx-auto mb-1" />
              <span className="text-caption text-gray-500">16px</span>
            </div>
            <div className="text-center">
              <CheckCircle size={20} className="text-success-green mx-auto mb-1" />
              <span className="text-caption text-gray-500">20px</span>
            </div>
            <div className="text-center">
              <CheckCircle size={24} className="text-success-green mx-auto mb-1" />
              <span className="text-caption text-gray-500">24px</span>
            </div>
            <div className="text-center">
              <CheckCircle size={32} className="text-success-green mx-auto mb-1" />
              <span className="text-caption text-gray-500">32px</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Clock className="text-warning-yellow" />
            <CheckCircle className="text-success-green" />
            <XCircle className="text-error-red" />
            <Truck className="text-primary-blue" />
            <AlertCircle className="text-warning-yellow" />
            <Info className="text-primary-blue" />
          </div>
        </div>
      </ComponentDemo>
    </>
  );
}

function MoleculesShowcase() {
  return (
    <>
      {/* Alerts & Toasts */}
      <ComponentDemo
        title="Alerts & Messages"
        description="상태 변경, 오류, 확인 UI with proper semantics"
      >
        <div className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              기본 알림 메시지입니다.
            </AlertDescription>
          </Alert>
          <Alert className="border-success-green bg-success-green-50">
            <CheckCircle className="h-4 w-4 text-success-green" />
            <AlertDescription className="text-success-green">
              작업이 성공적으로 완료되었습니다.
            </AlertDescription>
          </Alert>
          <Alert className="border-warning-yellow bg-warning-yellow-50">
            <AlertCircle className="h-4 w-4 text-warning-yellow" />
            <AlertDescription className="text-warning-yellow">
              주의가 필요한 사항이 있습니다.
            </AlertDescription>
          </Alert>
          <Alert className="border-error-red bg-error-red-50">
            <XCircle className="h-4 w-4 text-error-red" />
            <AlertDescription className="text-error-red">
              오류가 발생했습니다. 다시 시도해주세요.
            </AlertDescription>
          </Alert>
        </div>
      </ComponentDemo>

      {/* Cards */}
      <ComponentDemo
        title="Cards"
        description="메뉴, 주문, 알림용 카드 with thumbnails and metadata"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="text-heading-4 text-gray-900 truncate">메뉴 아이템</h4>
                <p className="text-body-small text-gray-600 line-clamp-2">
                  메뉴 설명이 여기에 표시됩니다.
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-body text-gray-900">₩12,000</span>
                  <Button size="sm">추가</Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <h4 className="text-heading-4 text-gray-900">주문 #1234</h4>
                <OrderStatusBadge status="confirmed" />
              </div>
              <div className="space-y-1 text-body-small text-gray-600">
                <div>김치찌개 x 2</div>
                <div>공기밥 x 1</div>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="text-body-small text-gray-600">합계</span>
                  <span className="text-body text-gray-900">₩27,000</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </ComponentDemo>

      {/* Form Sections */}
      <ComponentDemo
        title="Form Sections"
        description="폼 그룹 with label, required indicator, description, error message"
      >
        <div className="max-w-md space-y-6">
          <div className="space-y-2">
            <Label htmlFor="customer-name">
              고객 이름 <span className="text-error-red">*</span>
            </Label>
            <Input id="customer-name" placeholder="이름을 입력하세요" />
            <p className="text-caption text-gray-500">
              주문자 정보로 사용됩니다
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone-number">
              전화번호 <span className="text-error-red">*</span>
            </Label>
            <Input 
              id="phone-number" 
              type="tel" 
              placeholder="010-1234-5678"
              className="border-error-red"
            />
            <p className="text-caption text-error-red" role="alert">
              올바른 전화번호 형식이 아닙니다
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">배송 주소</Label>
            <Input id="address" placeholder="주소를 입력하세요" />
            <p className="text-caption text-gray-500">
              선택사항입니다
            </p>
          </div>
        </div>
      </ComponentDemo>

      {/* Loading States */}
      <ComponentDemo
        title="Loading States"
        description="Skeleton loaders for different content types"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <Skeleton className="h-32 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </ComponentDemo>
    </>
  );
}

function OrganismsShowcase() {
  return (
    <>
      {/* Empty States */}
      <ComponentDemo
        title="Empty States"
        description="비어있는 상태를 명확하게 전달하는 UI"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Info className="text-gray-400" size={32} />
            </div>
            <h3 className="text-heading-3 text-gray-900 mb-2">장바구니가 비어있습니다</h3>
            <p className="text-body-small text-gray-600 mb-4">
              메뉴를 추가하여 주문을 시작하세요
            </p>
            <Button>메뉴 보기</Button>
          </Card>

          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="text-gray-400" size={32} />
            </div>
            <h3 className="text-heading-3 text-gray-900 mb-2">주문 내역이 없습니다</h3>
            <p className="text-body-small text-gray-600 mb-4">
              첫 주문을 시작해보세요
            </p>
            <Button variant="outline">처음으로</Button>
          </Card>
        </div>
      </ComponentDemo>

      {/* Error States */}
      <ComponentDemo
        title="Error States"
        description="오류 상태 with retry actions"
      >
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-error-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-error-red" size={32} />
          </div>
          <h3 className="text-heading-3 text-gray-900 mb-2">오류가 발생했습니다</h3>
          <p className="text-body-small text-gray-600 mb-4">
            네트워크 연결을 확인하고 다시 시도해주세요
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline">취소</Button>
            <Button>다시 시도</Button>
          </div>
        </Card>
      </ComponentDemo>

      {/* Focus Ring & A11y */}
      <ComponentDemo
        title="Accessibility"
        description="Focus ring (2px), ARIA labels, keyboard navigation support"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="text-heading-4 text-gray-900 mb-2">Focus Ring</h4>
            <p className="text-body-small text-gray-600 mb-4">
              모든 인터랙티브 요소는 2px 포커스 링을 포함합니다
            </p>
            <div className="flex gap-3">
              <Button>Tab to focus</Button>
              <Input placeholder="Focus me" className="max-w-xs" />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="text-heading-4 text-gray-900 mb-2">ARIA Labels</h4>
            <p className="text-body-small text-gray-600 mb-4">
              스크린 리더를 위한 적절한 레이블과 설명 제공
            </p>
            <div className="space-y-2">
              <code className="text-caption font-mono bg-white p-2 rounded block">
                aria-label="주문 상태: 배달 중"
              </code>
              <code className="text-caption font-mono bg-white p-2 rounded block">
                aria-describedby="error-message"
              </code>
              <code className="text-caption font-mono bg-white p-2 rounded block">
                aria-live="polite" aria-atomic="true"
              </code>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="text-heading-4 text-gray-900 mb-2">Minimum Touch Target</h4>
            <p className="text-body-small text-gray-600">
              모든 터치 타겟은 최소 44x44px 크기를 보장합니다
            </p>
          </div>
        </div>
      </ComponentDemo>
    </>
  );
}

function ComponentDemo({ title, description, children }: any) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-heading-3 text-gray-900 mb-2">{title}</h3>
        <p className="text-body-small text-gray-600">{description}</p>
      </div>
      {children}
    </div>
  );
}
