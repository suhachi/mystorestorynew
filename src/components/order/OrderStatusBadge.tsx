/**
 * Order Status Badge Component
 * T14-07: Display order status with proper styling
 */

import React from 'react';
import { OrderStatus } from '../../types/order';
import { Badge } from '../ui/badge';
import { getStatusDisplayName, getStatusColor } from '../../services/orders.status';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const displayName = getStatusDisplayName(status);
  const color = getStatusColor(status);

  const colorClasses: Record<string, string> = {
    blue: 'bg-primary-blue-50 text-primary-blue border-primary-blue/20',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    yellow: 'bg-warning-yellow-50 text-warning-yellow border-warning-yellow/20',
    green: 'bg-success-green-50 text-success-green border-success-green/20',
    gray: 'bg-gray-100 text-gray-700 border-gray-300',
    red: 'bg-error-red-50 text-error-red border-error-red/20'
  };

  return (
    <Badge 
      variant="outline" 
      className={`${colorClasses[color]} font-medium ${className || ''}`}
      role="status"
      aria-label={`주문 상태: ${displayName}`}
    >
      {displayName}
    </Badge>
  );
}
