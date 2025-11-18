/**
 * Role-based Access Control Components
 * T14-08: Protect routes and components by user role
 */

import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/auth';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { ShieldAlert } from 'lucide-react';

interface RequireRoleProps {
  roles: UserRole | UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Generic role-based access control component
 */
export function RequireRole({ roles, children, fallback }: RequireRoleProps) {
  const { user, loading, hasRole } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mx-auto"></div>
          <p className="text-secondary-gray">인증 확인 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return fallback || (
      <div className="flex items-center justify-center min-h-[400px]">
        <Alert className="max-w-md">
          <ShieldAlert className="h-4 w-4" />
          <AlertDescription>
            로그인이 필요한 페이지입니다.
          </AlertDescription>
          <Button className="mt-4" onClick={() => window.location.href = '/'}>
            로그인 페이지로 이동
          </Button>
        </Alert>
      </div>
    );
  }

  if (!hasRole(roles)) {
    return fallback || (
      <div className="flex items-center justify-center min-h-[400px]">
        <Alert variant="destructive" className="max-w-md">
          <ShieldAlert className="h-4 w-4" />
          <AlertDescription>
            이 페이지에 접근할 권한이 없습니다.
            <br />
            <span className="text-caption">
              필요한 권한: {Array.isArray(roles) ? roles.join(', ') : roles}
            </span>
          </AlertDescription>
          <Button className="mt-4" variant="outline" onClick={() => window.history.back()}>
            이전 페이지로
          </Button>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Owner-only access control
 */
export function RequireOwner({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return <RequireRole roles="owner" fallback={fallback}>{children}</RequireRole>;
}

/**
 * Staff or Owner access control
 */
export function RequireStaff({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return <RequireRole roles={['staff', 'owner']} fallback={fallback}>{children}</RequireRole>;
}

/**
 * Admin-only access control
 */
export function RequireAdmin({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return <RequireRole roles="admin" fallback={fallback}>{children}</RequireRole>;
}
