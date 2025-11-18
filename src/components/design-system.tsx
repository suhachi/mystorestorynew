import { 
  Home, Menu, User, Settings, LogOut, Star, Heart, ShoppingCart, 
  Search, Filter, Bell, MessageSquare, Download, Upload, Edit, 
  Trash, Plus, Minus, Check, X, CheckCircle, AlertCircle, 
  Info, XCircle, Store, CreditCard, BarChart, TrendingUp, 
  Users, Building, Calendar, Clock 
} from 'lucide-react';

interface ColorSwatchProps {
  color: string;
  name: string;
  value: string;
  usage?: string;
}

function ColorSwatch({ color, name, value, usage }: ColorSwatchProps) {
  return (
    <div className="flex flex-col gap-2">
      <div 
        className="w-16 h-16 rounded-lg border border-gray-200 shadow-sm"
        style={{ backgroundColor: color }}
      ></div>
      <div className="text-body-small">
        <div className="font-medium text-gray-900">{name}</div>
        <div className="text-gray-600">{value}</div>
        {usage && <div className="text-gray-500 text-caption">{usage}</div>}
      </div>
    </div>
  );
}

interface TypographyExampleProps {
  className: string;
  name: string;
  specs: string;
  text: string;
}

function TypographyExample({ className, name, specs, text }: TypographyExampleProps) {
  return (
    <div className="flex items-center gap-6 py-3 border-b border-gray-100">
      <div className="w-32 text-body-small">
        <div className="font-medium text-gray-900">{name}</div>
        <div className="text-gray-600">{specs}</div>
      </div>
      <div className={className}>{text}</div>
    </div>
  );
}

interface SpacingExampleProps {
  size: string;
  name: string;
  value: string;
  usage: string;
}

function SpacingExample({ size, name, value, usage }: SpacingExampleProps) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-gray-100">
      <div className="w-20 text-body-small">
        <div className="font-medium text-gray-900">{name}</div>
        <div className="text-gray-600">{value}</div>
      </div>
      <div 
        className="bg-primary-blue h-4 rounded-sm"
        style={{ width: size }}
      ></div>
      <div className="text-body-small text-gray-600">{usage}</div>
    </div>
  );
}

interface ShadowExampleProps {
  shadow: string;
  name: string;
  specs: string;
}

function ShadowExample({ shadow, name, specs }: ShadowExampleProps) {
  return (
    <div className="flex flex-col gap-2">
      <div 
        className="w-24 h-16 bg-white rounded-lg border border-gray-100"
        style={{ boxShadow: shadow }}
      ></div>
      <div className="text-body-small">
        <div className="font-medium text-gray-900">{name}</div>
        <div className="text-gray-600 text-caption">{specs}</div>
      </div>
    </div>
  );
}

interface RadiusExampleProps {
  radius: string;
  name: string;
  value: string;
}

function RadiusExample({ radius, name, value }: RadiusExampleProps) {
  return (
    <div className="flex flex-col gap-2">
      <div 
        className="w-16 h-16 bg-primary-blue"
        style={{ borderRadius: radius }}
      ></div>
      <div className="text-body-small">
        <div className="font-medium text-gray-900">{name}</div>
        <div className="text-gray-600">{value}</div>
      </div>
    </div>
  );
}

interface IconExampleProps {
  icon: React.ReactNode;
  name: string;
  size: string;
}

function IconExample({ icon, name, size }: IconExampleProps) {
  return (
    <div className="flex flex-col items-center gap-2 p-3 border border-gray-200 rounded-lg">
      <div className="text-gray-600">{icon}</div>
      <div className="text-caption text-center">
        <div className="font-medium text-gray-900">{name}</div>
        <div className="text-gray-600">{size}</div>
      </div>
    </div>
  );
}

export function DesignSystem() {
  return (
    <div className="max-w-6xl mx-auto p-8 space-y-16">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-heading-1 text-gray-900 mb-4">MyStoreStory Design System</h1>
        <p className="text-body-large text-gray-600">Phase 1: 완벽한 디자인 시스템 구축</p>
      </div>

      {/* 1. Color Palette */}
      <section className="space-y-8">
        <div>
          <h2 className="text-heading-2 text-gray-900 mb-2">1. 색상 팔레트</h2>
          <p className="text-body text-gray-600">브랜드 일관성을 위한 체계적인 색상 시스템</p>
        </div>
        
        {/* Primary Colors */}
        <div className="space-y-4">
          <h3 className="text-heading-4 text-gray-900">Primary Colors</h3>
          <div className="grid grid-cols-4 gap-6">
            <ColorSwatch color="#2563eb" name="Primary Blue" value="#2563eb" usage="메인 브랜드 색상" />
            <ColorSwatch color="#3b82f6" name="Primary Blue Light" value="#3b82f6" usage="호버 상태" />
            <ColorSwatch color="#1d4ed8" name="Primary Blue Dark" value="#1d4ed8" usage="활성 상태" />
            <ColorSwatch color="#eff6ff" name="Primary Blue 50" value="#eff6ff" usage="배경용" />
          </div>
        </div>

        {/* Secondary Colors */}
        <div className="space-y-4">
          <h3 className="text-heading-4 text-gray-900">Secondary Colors</h3>
          <div className="grid grid-cols-4 gap-6">
            <ColorSwatch color="#64748b" name="Secondary Gray" value="#64748b" usage="보조 색상" />
            <ColorSwatch color="#94a3b8" name="Secondary Gray Light" value="#94a3b8" usage="비활성 상태" />
            <ColorSwatch color="#475569" name="Secondary Gray Dark" value="#475569" usage="텍스트용" />
            <ColorSwatch color="#f8fafc" name="Secondary Gray 50" value="#f8fafc" usage="배경용" />
          </div>
        </div>

        {/* Status Colors */}
        <div className="space-y-4">
          <h3 className="text-heading-4 text-gray-900">Status Colors</h3>
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="text-body font-medium text-success-green">Success</h4>
              <div className="grid grid-cols-3 gap-4">
                <ColorSwatch color="#10b981" name="Green" value="#10b981" usage="성공" />
                <ColorSwatch color="#34d399" name="Green Light" value="#34d399" usage="호버" />
                <ColorSwatch color="#ecfdf5" name="Green 50" value="#ecfdf5" usage="배경" />
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-body font-medium text-warning-yellow">Warning</h4>
              <div className="grid grid-cols-3 gap-4">
                <ColorSwatch color="#f59e0b" name="Yellow" value="#f59e0b" usage="경고" />
                <ColorSwatch color="#fbbf24" name="Yellow Light" value="#fbbf24" usage="호버" />
                <ColorSwatch color="#fffbeb" name="Yellow 50" value="#fffbeb" usage="배경" />
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-body font-medium text-error-red">Error</h4>
              <div className="grid grid-cols-3 gap-4">
                <ColorSwatch color="#ef4444" name="Red" value="#ef4444" usage="오류" />
                <ColorSwatch color="#f87171" name="Red Light" value="#f87171" usage="호버" />
                <ColorSwatch color="#fef2f2" name="Red 50" value="#fef2f2" usage="배경" />
              </div>
            </div>
          </div>
        </div>

        {/* Neutral Colors */}
        <div className="space-y-4">
          <h3 className="text-heading-4 text-gray-900">Neutral Colors (10단계)</h3>
          <div className="grid grid-cols-5 gap-4">
            <ColorSwatch color="#f8fafc" name="Gray 50" value="#f8fafc" usage="가장 밝은 배경" />
            <ColorSwatch color="#f1f5f9" name="Gray 100" value="#f1f5f9" usage="연한 배경" />
            <ColorSwatch color="#e2e8f0" name="Gray 200" value="#e2e8f0" usage="테두리" />
            <ColorSwatch color="#cbd5e1" name="Gray 300" value="#cbd5e1" usage="구분선" />
            <ColorSwatch color="#94a3b8" name="Gray 400" value="#94a3b8" usage="비활성 텍스트" />
          </div>
          <div className="grid grid-cols-5 gap-4">
            <ColorSwatch color="#64748b" name="Gray 500" value="#64748b" usage="보조 텍스트" />
            <ColorSwatch color="#475569" name="Gray 600" value="#475569" usage="일반 텍스트" />
            <ColorSwatch color="#334155" name="Gray 700" value="#334155" usage="강조 텍스트" />
            <ColorSwatch color="#1e293b" name="Gray 800" value="#1e293b" usage="제목 텍스트" />
            <ColorSwatch color="#0f172a" name="Gray 900" value="#0f172a" usage="가장 진한 텍스트" />
          </div>
        </div>
      </section>

      {/* 2. Typography System */}
      <section className="space-y-8">
        <div>
          <h2 className="text-heading-2 text-gray-900 mb-2">2. 타이포그래피 시스템</h2>
          <p className="text-body text-gray-600">Inter & Pretendard 폰트 기반의 체계적인 텍스트 스타일</p>
        </div>

        <div className="space-y-2">
          <TypographyExample 
            className="text-heading-1" 
            name="Heading 1" 
            specs="36px, Bold, 1.25" 
            text="메인 제목을 위한 가장 큰 텍스트" 
          />
          <TypographyExample 
            className="text-heading-2" 
            name="Heading 2" 
            specs="30px, Bold, 1.25" 
            text="페이지 제목을 위한 큰 텍스트" 
          />
          <TypographyExample 
            className="text-heading-3" 
            name="Heading 3" 
            specs="24px, Semibold, 1.25" 
            text="섹션 제목을 위한 중간 텍스트" 
          />
          <TypographyExample 
            className="text-heading-4" 
            name="Heading 4" 
            specs="20px, Semibold, 1.25" 
            text="소제목을 위한 작은 제목 텍스트" 
          />
          <TypographyExample 
            className="text-body-large" 
            name="Body Large" 
            specs="18px, Normal, 1.5" 
            text="강조가 필요한 본문 텍스트입니다." 
          />
          <TypographyExample 
            className="text-body" 
            name="Body" 
            specs="16px, Normal, 1.5" 
            text="기본 본문 텍스트로 가장 많이 사용됩니다." 
          />
          <TypographyExample 
            className="text-body-small" 
            name="Body Small" 
            specs="14px, Normal, 1.5" 
            text="작은 본문 텍스트나 설명 텍스트입니다." 
          />
          <TypographyExample 
            className="text-caption" 
            name="Caption" 
            specs="12px, Normal, 1.5" 
            text="캡션이나 라벨을 위한 가장 작은 텍스트입니다." 
          />
          <TypographyExample 
            className="text-button" 
            name="Button" 
            specs="16px, Medium, 1.25" 
            text="버튼 텍스트" 
          />
          <TypographyExample 
            className="text-label" 
            name="Label" 
            specs="14px, Medium, 1.25" 
            text="폼 라벨 텍스트" 
          />
        </div>
      </section>

      {/* 3. Spacing System */}
      <section className="space-y-8">
        <div>
          <h2 className="text-heading-2 text-gray-900 mb-2">3. 간격 시스템</h2>
          <p className="text-body text-gray-600">8px 기준의 일관된 간격 체계</p>
        </div>

        <div className="space-y-2">
          <SpacingExample size="4px" name="Space-1" value="4px" usage="가장 작은 간격" />
          <SpacingExample size="8px" name="Space-2" value="8px" usage="기본 간격 - 관련 요소" />
          <SpacingExample size="12px" name="Space-3" value="12px" usage="작은 간격" />
          <SpacingExample size="16px" name="Space-4" value="16px" usage="중간 간격 - 그룹 요소" />
          <SpacingExample size="20px" name="Space-5" value="20px" usage="큰 간격" />
          <SpacingExample size="24px" name="Space-6" value="24px" usage="섹션 간격" />
          <SpacingExample size="32px" name="Space-8" value="32px" usage="페이지 간격" />
          <SpacingExample size="40px" name="Space-10" value="40px" usage="큰 페이지 간격" />
          <SpacingExample size="48px" name="Space-12" value="48px" usage="섹션 구분" />
          <SpacingExample size="64px" name="Space-16" value="64px" usage="페이지 구분" />
        </div>
      </section>

      {/* 4. Shadow System */}
      <section className="space-y-8">
        <div>
          <h2 className="text-heading-2 text-gray-900 mb-2">4. 그림자 시스템</h2>
          <p className="text-body text-gray-600">깊이감을 표현하는 5단계 그림자</p>
        </div>

        <div className="grid grid-cols-5 gap-6">
          <ShadowExample 
            shadow="0 1px 2px rgba(0,0,0,0.05)" 
            name="Shadow SM" 
            specs="가장 작은 그림자" 
          />
          <ShadowExample 
            shadow="0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)" 
            name="Shadow" 
            specs="기본 그림자" 
          />
          <ShadowExample 
            shadow="0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)" 
            name="Shadow MD" 
            specs="중간 그림자 - Card" 
          />
          <ShadowExample 
            shadow="0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)" 
            name="Shadow LG" 
            specs="큰 그림자 - Dropdown" 
          />
          <ShadowExample 
            shadow="0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)" 
            name="Shadow XL" 
            specs="가장 큰 그림자 - Modal" 
          />
        </div>
      </section>

      {/* 5. Border Radius System */}
      <section className="space-y-8">
        <div>
          <h2 className="text-heading-2 text-gray-900 mb-2">5. 모서리 반경 시스템</h2>
          <p className="text-body text-gray-600">부드러운 모서리를 위한 5단계 반경</p>
        </div>

        <div className="grid grid-cols-6 gap-6">
          <RadiusExample radius="2px" name="Rounded SM" value="2px" />
          <RadiusExample radius="4px" name="Rounded" value="4px" />
          <RadiusExample radius="6px" name="Rounded MD" value="6px" />
          <RadiusExample radius="8px" name="Rounded LG" value="8px" />
          <RadiusExample radius="12px" name="Rounded XL" value="12px" />
          <RadiusExample radius="50%" name="Rounded Full" value="50%" />
        </div>
      </section>

      {/* 6. Icon System */}
      <section className="space-y-8">
        <div>
          <h2 className="text-heading-2 text-gray-900 mb-2">6. 아이콘 시스템</h2>
          <p className="text-body text-gray-600">Lucide 아이콘 기반의 체계적인 아이콘 세트</p>
        </div>

        {/* Navigation Icons */}
        <div className="space-y-4">
          <h3 className="text-heading-4 text-gray-900">Navigation Icons</h3>
          <div className="grid grid-cols-8 gap-4">
            <IconExample icon={<Home size={20} />} name="Home" size="20px" />
            <IconExample icon={<Menu size={20} />} name="Menu" size="20px" />
            <IconExample icon={<User size={20} />} name="User" size="20px" />
            <IconExample icon={<Settings size={20} />} name="Settings" size="20px" />
            <IconExample icon={<LogOut size={20} />} name="LogOut" size="20px" />
          </div>
        </div>

        {/* Function Icons */}
        <div className="space-y-4">
          <h3 className="text-heading-4 text-gray-900">Function Icons</h3>
          <div className="grid grid-cols-8 gap-4">
            <IconExample icon={<Star size={20} />} name="Star" size="20px" />
            <IconExample icon={<Heart size={20} />} name="Heart" size="20px" />
            <IconExample icon={<ShoppingCart size={20} />} name="Cart" size="20px" />
            <IconExample icon={<Search size={20} />} name="Search" size="20px" />
            <IconExample icon={<Filter size={20} />} name="Filter" size="20px" />
            <IconExample icon={<Bell size={20} />} name="Bell" size="20px" />
            <IconExample icon={<MessageSquare size={20} />} name="Message" size="20px" />
            <IconExample icon={<Download size={20} />} name="Download" size="20px" />
          </div>
          <div className="grid grid-cols-8 gap-4">
            <IconExample icon={<Upload size={20} />} name="Upload" size="20px" />
            <IconExample icon={<Edit size={20} />} name="Edit" size="20px" />
            <IconExample icon={<Trash size={20} />} name="Trash" size="20px" />
            <IconExample icon={<Plus size={20} />} name="Plus" size="20px" />
            <IconExample icon={<Minus size={20} />} name="Minus" size="20px" />
            <IconExample icon={<Check size={20} />} name="Check" size="20px" />
            <IconExample icon={<X size={20} />} name="X" size="20px" />
          </div>
        </div>

        {/* Status Icons */}
        <div className="space-y-4">
          <h3 className="text-heading-4 text-gray-900">Status Icons</h3>
          <div className="grid grid-cols-8 gap-4">
            <IconExample icon={<CheckCircle size={20} className="text-success-green" />} name="Success" size="20px" />
            <IconExample icon={<AlertCircle size={20} className="text-warning-yellow" />} name="Warning" size="20px" />
            <IconExample icon={<Info size={20} className="text-primary-blue" />} name="Info" size="20px" />
            <IconExample icon={<XCircle size={20} className="text-error-red" />} name="Error" size="20px" />
          </div>
        </div>

        {/* Business Icons */}
        <div className="space-y-4">
          <h3 className="text-heading-4 text-gray-900">Business Icons</h3>
          <div className="grid grid-cols-8 gap-4">
            <IconExample icon={<Store size={20} />} name="Store" size="20px" />
            <IconExample icon={<CreditCard size={20} />} name="Payment" size="20px" />
            <IconExample icon={<BarChart size={20} />} name="Chart" size="20px" />
            <IconExample icon={<TrendingUp size={20} />} name="Trending" size="20px" />
            <IconExample icon={<Users size={20} />} name="Users" size="20px" />
            <IconExample icon={<Building size={20} />} name="Building" size="20px" />
            <IconExample icon={<Calendar size={20} />} name="Calendar" size="20px" />
            <IconExample icon={<Clock size={20} />} name="Clock" size="20px" />
          </div>
        </div>

        {/* Icon Sizes */}
        <div className="space-y-4">
          <h3 className="text-heading-4 text-gray-900">Icon Sizes</h3>
          <div className="grid grid-cols-5 gap-4">
            <IconExample icon={<Home size={12} />} name="XS" size="12px" />
            <IconExample icon={<Home size={16} />} name="SM" size="16px" />
            <IconExample icon={<Home size={20} />} name="MD" size="20px" />
            <IconExample icon={<Home size={24} />} name="LG" size="24px" />
            <IconExample icon={<Home size={32} />} name="XL" size="32px" />
          </div>
        </div>
      </section>

      {/* Design Guidelines */}
      <section className="space-y-8">
        <div>
          <h2 className="text-heading-2 text-gray-900 mb-2">🎨 디자인 가이드라인</h2>
          <p className="text-body text-gray-600">일관된 디자인을 위한 사용 규칙</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-heading-4 text-gray-900">색상 사용 규칙</h3>
            <ul className="space-y-2 text-body-small text-gray-600">
              <li>• Primary는 주요 액션에만 사용</li>
              <li>• Secondary는 보조 정보에 사용</li>
              <li>• 상태 색상은 해당 상태에만 사용</li>
              <li>• Neutral은 텍스트와 배경에 사용</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-heading-4 text-gray-900">타이포그래피 규칙</h3>
            <ul className="space-y-2 text-body-small text-gray-600">
              <li>• 제목은 계층 구조를 명확히 구분</li>
              <li>• 본문은 가독성을 최우선으로</li>
              <li>• 버튼은 명확한 액션을 나타내도록</li>
              <li>• 라벨은 폼 요소와 일관성 유지</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-heading-4 text-gray-900">간격 규칙</h3>
            <ul className="space-y-2 text-body-small text-gray-600">
              <li>• 관련 요소는 8px 간격</li>
              <li>• 그룹 요소는 16px 간격</li>
              <li>• 섹션 요소는 24px 간격</li>
              <li>• 페이지 요소는 32px 간격</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Completion Checklist */}
      <section className="space-y-6 bg-gray-50 p-8 rounded-xl">
        <h2 className="text-heading-2 text-gray-900">✅ Phase 1 완성 체크리스트</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-success-green" />
              <span className="text-body text-gray-700">색상 팔레트 완성 (Primary, Secondary, 상태, Neutral)</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-success-green" />
              <span className="text-body text-gray-700">타이포그래피 시스템 완성 (폰트, 크기, 두께, 라인 높이)</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-success-green" />
              <span className="text-body text-gray-700">간격 시스템 완성 (기본 단위, 컴포넌트별, 레이아웃별)</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-success-green" />
              <span className="text-body text-gray-700">그림자 시스템 완성 (5단계, 컴포넌트별, 상태별)</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-success-green" />
              <span className="text-body text-gray-700">모서리 반경 시스템 완성 (5단계, 컴포넌트별, 특수)</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-success-green" />
              <span className="text-body text-gray-700">아이콘 시스템 완성 (크기, 네비게이션, 기능, 상태, 비즈니스)</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-success-green" />
              <span className="text-body text-gray-700">색상 사용 규칙 정의 완성</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-success-green" />
              <span className="text-body text-gray-700">타이포그래피 규칙 정의 완성</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-success-green" />
              <span className="text-body text-gray-700">간격 규칙 정의 완성</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-success-green" />
              <span className="text-body text-gray-700">접근성 대비율 확인 완성</span>
            </div>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="text-center space-y-4 bg-primary-blue-50 p-8 rounded-xl">
        <h2 className="text-heading-2 text-primary-blue">🚀 다음 단계 준비</h2>
        <p className="text-body text-gray-700">
          Phase 1이 완성되었습니다! 다음 단계인 <strong>Phase 2: 레이아웃 구조 완성</strong>에서 
          이 디자인 시스템을 활용하여 기본 레이아웃을 구축할 수 있습니다.
        </p>
        <div className="text-body-small text-gray-600 mt-4">
          <strong>중요:</strong> 모든 디자인 요소는 재사용 가능하도록 설계되었으며, 
          일관된 네이밍 컨벤션을 사용합니다. 기능은 전혀 구현하지 않고 순수 디자인만 완성되었습니다.
        </div>
      </section>
    </div>
  );
}