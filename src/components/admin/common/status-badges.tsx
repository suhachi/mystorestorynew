import React from 'react';
import { Badge } from '../../ui/badge';

type BadgeType = 'status' | 'type' | 'plan' | 'priority' | 'category';

interface StatusBadgeProps {
  status: string;
  type?: BadgeType;
  className?: string;
}

export function StatusBadge({ status, type = 'status', className = '' }: StatusBadgeProps) {
  const getStatusConfig = () => {
    const configs = {
      status: {
        '활성': 'bg-green-100 text-green-800',
        '승인대기': 'bg-orange-100 text-orange-800',
        '정지': 'bg-red-100 text-red-800',
        '비활성': 'bg-gray-100 text-gray-800',
        '검토중': 'bg-yellow-100 text-yellow-800',
        '완료': 'bg-blue-100 text-blue-800',
        '진행중': 'bg-purple-100 text-purple-800',
        '대기': 'bg-orange-100 text-orange-800',
        '실패': 'bg-red-100 text-red-800',
        '성공': 'bg-green-100 text-green-800'
      },
      type: {
        '사장님': 'bg-blue-100 text-blue-800',
        '이용자': 'bg-green-100 text-green-800',
        '관리자': 'bg-purple-100 text-purple-800',
        '고객': 'bg-teal-100 text-teal-800',
        '파트너': 'bg-indigo-100 text-indigo-800'
      },
      plan: {
        'Basic': 'bg-gray-100 text-gray-800',
        'Pro': 'bg-blue-100 text-blue-800',
        'enterprise': 'bg-purple-100 text-purple-800',
        'Premium': 'bg-yellow-100 text-yellow-800',
        'Free': 'bg-green-100 text-green-800'
      },
      priority: {
        '높음': 'bg-red-100 text-red-800',
        '보통': 'bg-yellow-100 text-yellow-800',
        '낮음': 'bg-green-100 text-green-800',
        '긴급': 'bg-red-100 text-red-800',
        '일반': 'bg-blue-100 text-blue-800'
      },
      category: {
        '시스템': 'bg-blue-100 text-blue-800',
        '정책': 'bg-purple-100 text-purple-800',
        '이벤트': 'bg-green-100 text-green-800',
        '점검': 'bg-orange-100 text-orange-800',
        '업데이트': 'bg-indigo-100 text-indigo-800',
        '보안': 'bg-red-100 text-red-800'
      }
    };
    
    return configs[type]?.[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Badge className={`${getStatusConfig()} ${className}`}>
      {status}
    </Badge>
  );
}

interface TypeBadgeProps {
  userType: string;
  className?: string;
}

export function TypeBadge({ userType, className = '' }: TypeBadgeProps) {
  return (
    <StatusBadge 
      status={userType} 
      type="type" 
      className={className}
    />
  );
}

interface PlanBadgeProps {
  plan: string;
  className?: string;
}

export function PlanBadge({ plan, className = '' }: PlanBadgeProps) {
  return (
    <StatusBadge 
      status={plan} 
      type="plan" 
      className={className}
    />
  );
}

interface PriorityBadgeProps {
  priority: string;
  className?: string;
}

export function PriorityBadge({ priority, className = '' }: PriorityBadgeProps) {
  return (
    <StatusBadge 
      status={priority} 
      type="priority" 
      className={className}
    />
  );
}

// 여러 배지를 그룹으로 표시하는 컴포넌트
interface BadgeGroupProps {
  badges: Array<{
    status: string;
    type?: BadgeType;
  }>;
  className?: string;
}

export function BadgeGroup({ badges, className = '' }: BadgeGroupProps) {
  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {badges.map((badge, index) => (
        <StatusBadge 
          key={index}
          status={badge.status}
          type={badge.type}
        />
      ))}
    </div>
  );
}

// 상태에 따른 색상을 반환하는 유틸리티 함수
export const getStatusColor = (status: string, type: BadgeType = 'status') => {
  const statusBadge = StatusBadge({ status, type });
  // className에서 색상 정보 추출
  return status;
};