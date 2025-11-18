import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export function FoundationsSection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-heading-2 text-gray-900 mb-2">Foundations</h2>
        <p className="text-body text-gray-600">
          MyStoreStory 디자인 시스템의 기본 토큰과 원칙
        </p>
      </div>

      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="spacing">Spacing</TabsTrigger>
          <TabsTrigger value="shadows">Shadows</TabsTrigger>
          <TabsTrigger value="grid">Grid</TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="space-y-6">
          <ColorPalette />
        </TabsContent>

        <TabsContent value="typography" className="space-y-6">
          <TypographyScale />
        </TabsContent>

        <TabsContent value="spacing" className="space-y-6">
          <SpacingScale />
        </TabsContent>

        <TabsContent value="shadows" className="space-y-6">
          <ShadowScale />
        </TabsContent>

        <TabsContent value="grid" className="space-y-6">
          <GridSystem />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ColorPalette() {
  const colorGroups = [
    {
      title: 'Primary Blue',
      colors: [
        { name: 'primary-blue-50', value: '#eff6ff', var: '--primary-blue-50' },
        { name: 'primary-blue', value: '#2563eb', var: '--primary-blue', isMain: true },
        { name: 'primary-blue-light', value: '#3b82f6', var: '--primary-blue-light' },
        { name: 'primary-blue-dark', value: '#1d4ed8', var: '--primary-blue-dark' },
      ]
    },
    {
      title: 'Success Green',
      colors: [
        { name: 'success-green-50', value: '#ecfdf5', var: '--success-green-50' },
        { name: 'success-green', value: '#10b981', var: '--success-green', isMain: true },
        { name: 'success-green-light', value: '#34d399', var: '--success-green-light' },
      ]
    },
    {
      title: 'Warning Yellow',
      colors: [
        { name: 'warning-yellow-50', value: '#fffbeb', var: '--warning-yellow-50' },
        { name: 'warning-yellow', value: '#f59e0b', var: '--warning-yellow', isMain: true },
        { name: 'warning-yellow-light', value: '#fbbf24', var: '--warning-yellow-light' },
      ]
    },
    {
      title: 'Error Red',
      colors: [
        { name: 'error-red-50', value: '#fef2f2', var: '--error-red-50' },
        { name: 'error-red', value: '#ef4444', var: '--error-red', isMain: true },
        { name: 'error-red-light', value: '#f87171', var: '--error-red-light' },
      ]
    },
    {
      title: 'Neutral Gray (10 stages)',
      colors: [
        { name: 'gray-50', value: '#f8fafc', var: '--gray-50' },
        { name: 'gray-100', value: '#f1f5f9', var: '--gray-100' },
        { name: 'gray-200', value: '#e2e8f0', var: '--gray-200' },
        { name: 'gray-300', value: '#cbd5e1', var: '--gray-300' },
        { name: 'gray-400', value: '#94a3b8', var: '--gray-400' },
        { name: 'gray-500', value: '#64748b', var: '--gray-500', isMain: true },
        { name: 'gray-600', value: '#475569', var: '--gray-600' },
        { name: 'gray-700', value: '#334155', var: '--gray-700' },
        { name: 'gray-800', value: '#1e293b', var: '--gray-800' },
        { name: 'gray-900', value: '#0f172a', var: '--gray-900' },
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {colorGroups.map((group) => (
        <div key={group.title}>
          <h3 className="text-heading-4 text-gray-900 mb-4">{group.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {group.colors.map((color) => (
              <ColorSwatch key={color.name} {...color} />
            ))}
          </div>
        </div>
      ))}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-heading-4 text-gray-900 mb-2">WCAG Compliance</h4>
        <p className="text-body-small text-gray-600">
          모든 색상 조합은 WCAG AA 기준 4.5:1 이상의 대비율을 보장합니다.
        </p>
      </div>
    </div>
  );
}

function ColorSwatch({ name, value, var: cssVar, isMain }: any) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssVar);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`bg-white border rounded-lg overflow-hidden ${isMain ? 'ring-2 ring-primary-blue' : 'border-gray-200'}`}>
      <div 
        className="h-24 w-full"
        style={{ backgroundColor: value }}
      />
      <div className="p-3 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-body-small text-gray-900">{name}</span>
          {isMain && (
            <span className="text-caption text-primary-blue">Main</span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <code className="text-caption text-gray-500 font-mono">{value}</code>
          <button
            onClick={copyToClipboard}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Copy CSS variable"
          >
            {copied ? (
              <Check size={14} className="text-success-green" />
            ) : (
              <Copy size={14} className="text-gray-400" />
            )}
          </button>
        </div>
        <code className="text-caption text-gray-400 font-mono block">var({cssVar})</code>
      </div>
    </div>
  );
}

function TypographyScale() {
  const typeScales = [
    { name: 'Display', size: '36px', weight: '700', lineHeight: '1.25', class: 'text-heading-1' },
    { name: 'H1', size: '36px', weight: '700', lineHeight: '1.25', class: 'text-heading-1' },
    { name: 'H2', size: '30px', weight: '700', lineHeight: '1.25', class: 'text-heading-2' },
    { name: 'H3', size: '24px', weight: '600', lineHeight: '1.25', class: 'text-heading-3' },
    { name: 'H4', size: '20px', weight: '600', lineHeight: '1.25', class: 'text-heading-4' },
    { name: 'Body Large', size: '18px', weight: '400', lineHeight: '1.5', class: 'text-body-large' },
    { name: 'Body', size: '16px', weight: '400', lineHeight: '1.5', class: 'text-body' },
    { name: 'Body Small', size: '14px', weight: '400', lineHeight: '1.5', class: 'text-body-small' },
    { name: 'Caption', size: '12px', weight: '400', lineHeight: '1.5', class: 'text-caption' },
  ];

  const fontWeights = [
    { name: 'Light', value: '300', var: '--font-light' },
    { name: 'Normal', value: '400', var: '--font-normal' },
    { name: 'Medium', value: '500', var: '--font-medium' },
    { name: 'Semibold', value: '600', var: '--font-semibold' },
    { name: 'Bold', value: '700', var: '--font-bold' },
    { name: 'Extrabold', value: '800', var: '--font-extrabold' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-heading-4 text-gray-900 mb-4">Type Scale</h3>
        <div className="space-y-4">
          {typeScales.map((scale) => (
            <div key={scale.name} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-baseline justify-between mb-4">
                <span className={scale.class}>
                  The quick brown fox jumps over the lazy dog
                </span>
              </div>
              <div className="flex gap-6 text-body-small text-gray-600">
                <div>
                  <span className="text-gray-400">Name:</span> <code className="font-mono">{scale.name}</code>
                </div>
                <div>
                  <span className="text-gray-400">Size:</span> <code className="font-mono">{scale.size}</code>
                </div>
                <div>
                  <span className="text-gray-400">Weight:</span> <code className="font-mono">{scale.weight}</code>
                </div>
                <div>
                  <span className="text-gray-400">Line Height:</span> <code className="font-mono">{scale.lineHeight}</code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-heading-4 text-gray-900 mb-4">Font Weights</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {fontWeights.map((weight) => (
            <div key={weight.name} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-2xl mb-2" style={{ fontWeight: weight.value }}>Aa</div>
              <div className="text-body-small text-gray-900">{weight.name}</div>
              <code className="text-caption text-gray-500 font-mono">{weight.value}</code>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-heading-4 text-gray-900 mb-2">Font Stack</h4>
        <code className="text-body-small text-gray-600 font-mono">
          'Inter', 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif
        </code>
        <p className="text-body-small text-gray-600 mt-2">
          한국어/영어 겸용 폰트 스택으로 모든 환경에서 일관된 타이포그래피를 제공합니다.
        </p>
      </div>
    </div>
  );
}

function SpacingScale() {
  const spacings = [
    { name: 'space-1', value: '4px', var: '--space-1' },
    { name: 'space-2', value: '8px', var: '--space-2' },
    { name: 'space-3', value: '12px', var: '--space-3' },
    { name: 'space-4', value: '16px', var: '--space-4' },
    { name: 'space-5', value: '20px', var: '--space-5' },
    { name: 'space-6', value: '24px', var: '--space-6' },
    { name: 'space-8', value: '32px', var: '--space-8' },
    { name: 'space-10', value: '40px', var: '--space-10' },
    { name: 'space-12', value: '48px', var: '--space-12' },
    { name: 'space-16', value: '64px', var: '--space-16' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-heading-4 text-gray-900 mb-2">8px Base Grid</h4>
        <p className="text-body-small text-gray-600">
          모든 간격은 8px의 배수를 기본으로 합니다. 일관된 리듬과 정렬을 보장합니다.
        </p>
      </div>

      <div className="space-y-4">
        {spacings.map((spacing) => (
          <div key={spacing.name} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-6">
              <div className="w-32 text-body-small text-gray-600">
                <div>{spacing.name}</div>
                <code className="text-caption text-gray-400 font-mono">{spacing.value}</code>
              </div>
              <div 
                className="bg-primary-blue h-12 rounded"
                style={{ width: spacing.value }}
              />
              <code className="text-caption text-gray-400 font-mono">var({spacing.var})</code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ShadowScale() {
  const shadows = [
    { name: 'shadow-sm', value: '0 1px 2px rgba(0,0,0,0.05)', var: '--shadow-sm' },
    { name: 'shadow', value: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)', var: '--shadow' },
    { name: 'shadow-md', value: '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)', var: '--shadow-md' },
    { name: 'shadow-lg', value: '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)', var: '--shadow-lg' },
    { name: 'shadow-xl', value: '0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)', var: '--shadow-xl' },
  ];

  const radii = [
    { name: 'rounded-sm', value: '2px', var: '--rounded-sm' },
    { name: 'rounded', value: '4px', var: '--rounded' },
    { name: 'rounded-md', value: '6px', var: '--rounded-md' },
    { name: 'rounded-lg', value: '8px', var: '--rounded-lg' },
    { name: 'rounded-xl', value: '12px', var: '--rounded-xl' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-heading-4 text-gray-900 mb-4">Elevation (Shadows)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shadows.map((shadow) => (
            <div key={shadow.name} className="space-y-2">
              <div 
                className="bg-white h-32 rounded-lg flex items-center justify-center"
                style={{ boxShadow: shadow.value }}
              >
                <span className="text-body-small text-gray-600">{shadow.name}</span>
              </div>
              <code className="text-caption text-gray-400 font-mono block">var({shadow.var})</code>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-heading-4 text-gray-900 mb-4">Border Radius</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {radii.map((radius) => (
            <div key={radius.name} className="space-y-2">
              <div 
                className="bg-primary-blue h-24 w-full"
                style={{ borderRadius: radius.value }}
              />
              <div className="text-body-small text-gray-900">{radius.name}</div>
              <code className="text-caption text-gray-400 font-mono">{radius.value}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GridSystem() {
  const breakpoints = [
    { name: 'Mobile', width: '360px', columns: 4, margin: '16px', gutter: '16px' },
    { name: 'Tablet', width: '768px', columns: 8, margin: '40px', gutter: '24px' },
    { name: 'Desktop', width: '1280px', columns: 12, margin: '80px', gutter: '24px' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-heading-4 text-gray-900 mb-2">Responsive Grid</h4>
        <p className="text-body-small text-gray-600">
          반응형 레이아웃을 위한 12 컬럼 그리드 시스템. 모바일, 태블릿, 데스크톱에 최적화되어 있습니다.
        </p>
      </div>

      {breakpoints.map((bp) => (
        <div key={bp.name} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="mb-4">
            <h4 className="text-heading-4 text-gray-900">{bp.name}</h4>
            <div className="flex gap-6 text-body-small text-gray-600 mt-2">
              <div><span className="text-gray-400">Width:</span> <code className="font-mono">{bp.width}</code></div>
              <div><span className="text-gray-400">Columns:</span> <code className="font-mono">{bp.columns}</code></div>
              <div><span className="text-gray-400">Margin:</span> <code className="font-mono">{bp.margin}</code></div>
              <div><span className="text-gray-400">Gutter:</span> <code className="font-mono">{bp.gutter}</code></div>
            </div>
          </div>
          
          <div className="flex gap-2">
            {Array.from({ length: bp.columns }).map((_, i) => (
              <div 
                key={i} 
                className="flex-1 h-12 bg-primary-blue/20 border border-primary-blue/40 rounded"
              />
            ))}
          </div>
        </div>
      ))}

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="text-heading-4 text-gray-900 mb-4">Motion & Transitions</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-body-small text-gray-600">Duration: Fast</span>
            <code className="text-caption font-mono text-gray-500">120ms</code>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-body-small text-gray-600">Duration: Standard</span>
            <code className="text-caption font-mono text-gray-500">180ms</code>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-body-small text-gray-600">Duration: Emphasized</span>
            <code className="text-caption font-mono text-gray-500">240ms</code>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-body-small text-gray-600">Easing: Standard</span>
            <code className="text-caption font-mono text-gray-500">cubic-bezier(0.4, 0, 0.2, 1)</code>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-body-small text-gray-600">Easing: Emphasized</span>
            <code className="text-caption font-mono text-gray-500">cubic-bezier(0.05, 0.7, 0.1, 1)</code>
          </div>
        </div>
      </div>
    </div>
  );
}
