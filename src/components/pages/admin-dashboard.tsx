import React from 'react';
import { MasterApiDashboard } from '../system/master-api-dashboard';
import { DashboardHome } from '../admin/dashboard-home';
import { UserManagement } from '../admin/user-management';
import { StoreManagement } from '../admin/store-management';
import { AnalyticsManagement } from '../admin/analytics-management';
import { NoticeManagement } from '../admin/notice-management';
import { DownloadManagement } from '../admin/download-management';
import { ReviewManagement } from '../admin/review-management';
import { SystemSettings } from '../admin/system-settings';
import { AppApprovalManagement } from '../admin/app-approval-management';
import { PaymentApiDashboard } from '../system/payment-api-system';
import { MapsApiDashboard } from '../system/maps-api-system';
import { NotificationApiDashboard } from '../system/notification-api-system';
import { SocialLoginApiDashboard } from '../system/social-login-api-system';
import { AppBuilderApiDashboard } from '../system/app-builder-api-system';

// 임시 플레이스홀더 컴포넌트들 (각 게시판이 분리되기 전까지 사용)
function SubscriptionsManagement() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">구독 관리</h1>
      <p className="text-gray-600">구독 관리 기능이 여기에 구현됩니다.</p>
    </div>
  );
}

function MultiStoreRequests() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">다중상점 요청</h1>
      <p className="text-gray-600">다중상점 요청 관리 기능이 여기에 구현됩니다.</p>
    </div>
  );
}

interface AdminDashboardProps {
  type: string;
}

export function AdminDashboard({ type }: AdminDashboardProps) {
  switch (type) {
    case 'dashboard':
      return <DashboardHome />;
    case 'users':
      return <UserManagement />;
    case 'stores':
      return <StoreManagement />;
    case 'analytics':
      return <AnalyticsManagement />;
    case 'notices':
      return <NoticeManagement />;
    case 'downloads':
      return <DownloadManagement />;
    case 'reviews':
      return <ReviewManagement />;
    case 'settings':
      return <SystemSettings />;
    case 'subscriptions':
      return <SubscriptionsManagement />;
    case 'multi-store-requests':
      return <MultiStoreRequests />;
    case 'api-management':
      return <MasterApiDashboard />;
    case 'api-payment':
      return <PaymentApiDashboard />;
    case 'api-maps':
      return <MapsApiDashboard />;
    case 'api-notification':
      return <NotificationApiDashboard />;
    case 'api-social':
      return <SocialLoginApiDashboard />;
    case 'api-app-builder':
      return <AppBuilderApiDashboard />;
    case 'app-approval':
      return <AppApprovalManagement />;
    default:
      return <DashboardHome />;
  }
}