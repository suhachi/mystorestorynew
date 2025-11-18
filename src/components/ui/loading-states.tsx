/**
 * 🎨 Phase 2: Loading States & Skeleton UI
 * 
 * 안전하게 추가된 로딩 상태 컴포넌트
 * 기존 skeleton.tsx를 활용하여 만든 조합형 컴포넌트
 * 
 * Created: 2024-10-31
 * Safe: ✅ 기존 코드 변경 없음
 */

import { Skeleton } from './skeleton';
import { Card } from './card';

// ========================================
// 1. Dashboard Loading States
// ========================================

/**
 * 대시보드 KPI 카드 스켈레톤
 * 사용처: /components/store-admin/store-dashboard.tsx
 */
export function KPICardSkeleton() {
  return (
    <Card className="p-6">
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-3 w-28" />
      </div>
    </Card>
  );
}

/**
 * KPI 카드 그리드 스켈레톤 (4개)
 */
export function KPICardGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <KPICardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * 차트 스켈레톤
 * 사용처: Analytics, Dashboard
 */
export function ChartSkeleton({ height = 'h-64' }: { height?: string }) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className={`w-full ${height}`} />
      </div>
    </Card>
  );
}

/**
 * 전체 대시보드 스켈레톤
 * 사용처: /components/store-admin/store-dashboard.tsx
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <KPICardGridSkeleton />

      {/* Chart */}
      <ChartSkeleton />

      {/* Recent Orders Table */}
      <Card className="p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </Card>
    </div>
  );
}

// ========================================
// 2. Table Loading States
// ========================================

/**
 * 테이블 행 스켈레톤
 */
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

/**
 * 테이블 전체 스켈레톤
 * 사용처: Order Management, Customer Management
 */
export function TableSkeleton({ 
  rows = 10, 
  columns = 5 
}: { 
  rows?: number; 
  columns?: number;
}) {
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-4 py-3 text-left">
                  <Skeleton className="h-4 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <TableRowSkeleton key={i} columns={columns} />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ========================================
// 3. List Loading States
// ========================================

/**
 * 리스트 아이템 스켈레톤
 * 사용처: Menu List, Order List
 */
export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-100">
      <Skeleton className="h-16 w-16 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="h-8 w-20" />
    </div>
  );
}

/**
 * 리스트 전체 스켈레톤
 */
export function ListSkeleton({ items = 6 }: { items?: number }) {
  return (
    <Card>
      {Array.from({ length: items }).map((_, i) => (
        <ListItemSkeleton key={i} />
      ))}
    </Card>
  );
}

// ========================================
// 4. Card Grid Loading States
// ========================================

/**
 * 그리드 카드 스켈레톤
 * 사용처: Menu Grid, Feature Cards
 */
export function GridCardSkeleton() {
  return (
    <Card className="p-4">
      <Skeleton className="h-48 w-full rounded-lg mb-4" />
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6" />
    </Card>
  );
}

/**
 * 그리드 레이아웃 스켈레톤
 */
export function GridSkeleton({ 
  items = 6,
  columns = 3
}: { 
  items?: number;
  columns?: 2 | 3 | 4;
}) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {Array.from({ length: items }).map((_, i) => (
        <GridCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ========================================
// 5. Form Loading States
// ========================================

/**
 * 폼 필드 스켈레톤
 */
export function FormFieldSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

/**
 * 폼 전체 스켈레톤
 */
export function FormSkeleton({ fields = 5 }: { fields?: number }) {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <Skeleton className="h-6 w-48 mb-4" />
        {Array.from({ length: fields }).map((_, i) => (
          <FormFieldSkeleton key={i} />
        ))}
        <div className="flex gap-3 pt-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </Card>
  );
}

// ========================================
// 6. Modal Loading States
// ========================================

/**
 * 모달 컨텐츠 스켈레톤
 * 사용처: Config Modals
 */
export function ModalContentSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-full" />
      </div>

      {/* Content */}
      <div className="space-y-4">
        <FormFieldSkeleton />
        <FormFieldSkeleton />
        <FormFieldSkeleton />
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}

// ========================================
// 7. Analytics Loading States
// ========================================

/**
 * Analytics 페이지 스켈레톤
 * 사용처: /components/store-admin/store-analytics.tsx
 */
export function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <KPICardSkeleton key={i} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>

      {/* Full Width Chart */}
      <ChartSkeleton height="h-96" />

      {/* Table */}
      <TableSkeleton rows={8} columns={6} />
    </div>
  );
}

// ========================================
// 8. Menu Management Loading States
// ========================================

/**
 * 메뉴 관리 페이지 스켈레톤
 * 사용처: /components/store-admin/store-menu-management.tsx
 */
export function MenuManagementSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Menu Grid */}
      <GridSkeleton items={9} columns={3} />
    </div>
  );
}

// ========================================
// 9. Order Management Loading States
// ========================================

/**
 * 주문 관리 페이지 스켈레톤
 * 사용처: /components/store-admin/store-order-management.tsx
 */
export function OrderManagementSkeleton() {
  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-24" />
        ))}
      </div>

      {/* Orders List */}
      <ListSkeleton items={8} />
    </div>
  );
}

// ========================================
// 10. Customer Management Loading States
// ========================================

/**
 * 고객 관리 페이지 스켈레톤
 * 사용처: /components/store-admin/store-customer-management.tsx
 */
export function CustomerManagementSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-6 w-16" />
          </Card>
        ))}
      </div>

      {/* Table */}
      <TableSkeleton rows={10} columns={6} />
    </div>
  );
}

// ========================================
// 11. Generic Loading Component
// ========================================

/**
 * 범용 로딩 컴포넌트
 * 간단한 로딩 표시가 필요할 때 사용
 */
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div className={`${sizeClasses[size]} border-primary-blue border-t-transparent rounded-full animate-spin`} />
    </div>
  );
}

/**
 * 전체 페이지 로딩
 */
export function PageLoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-body text-gray-600">로딩 중...</p>
      </div>
    </div>
  );
}

// ========================================
// 12. Empty States (보너스)
// ========================================

/**
 * Empty State 컴포넌트
 * 데이터가 없을 때 표시
 */
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon && (
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-heading-4 text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-body text-gray-600 mb-6 max-w-md">{description}</p>
      )}
      {action && (
        <button 
          onClick={action.onClick}
          className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue-dark transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

// ========================================
// Export All
// ========================================

export default {
  // Dashboard
  KPICardSkeleton,
  KPICardGridSkeleton,
  ChartSkeleton,
  DashboardSkeleton,
  
  // Table
  TableRowSkeleton,
  TableSkeleton,
  
  // List
  ListItemSkeleton,
  ListSkeleton,
  
  // Grid
  GridCardSkeleton,
  GridSkeleton,
  
  // Form
  FormFieldSkeleton,
  FormSkeleton,
  
  // Modal
  ModalContentSkeleton,
  
  // Pages
  AnalyticsSkeleton,
  MenuManagementSkeleton,
  OrderManagementSkeleton,
  CustomerManagementSkeleton,
  
  // Generic
  LoadingSpinner,
  PageLoadingSpinner,
  EmptyState,
};
