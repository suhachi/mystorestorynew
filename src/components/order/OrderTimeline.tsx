/**
 * Order Timeline Component
 * T14-08: Display order status history with timeline
 */

import React from 'react';
import { OrderHistoryEntry } from '../../types/order';
import { Card } from '../ui/card';
import { OrderStatusBadge } from './OrderStatusBadge';
import { Clock, User } from 'lucide-react';

interface OrderTimelineProps {
  history: OrderHistoryEntry[];
}

export function OrderTimeline({ history }: OrderTimelineProps) {
  if (!history || history.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-secondary-gray text-center">이력이 없습니다.</p>
      </Card>
    );
  }

  // Sort by timestamp descending (most recent first)
  const sortedHistory = [...history].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div 
      className="space-y-0"
      role="list"
      aria-label="주문 상태 변경 이력"
    >
      {sortedHistory.map((entry, index) => {
        const isFirst = index === 0;
        const isLast = index === sortedHistory.length - 1;
        const date = new Date(entry.timestamp);
        
        return (
          <div 
            key={entry.timestamp}
            className="relative"
            role="listitem"
          >
            {/* Timeline line */}
            {!isLast && (
              <div 
                className="absolute left-[15px] top-[32px] bottom-0 w-0.5 bg-gray-200"
                aria-hidden="true"
              />
            )}

            <Card className={`p-4 ${!isLast ? 'mb-3' : ''}`}>
              <div className="flex gap-4">
                {/* Timeline dot */}
                <div 
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    isFirst 
                      ? 'bg-primary-blue text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}
                  aria-current={isFirst ? 'step' : undefined}
                >
                  <Clock className="h-4 w-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <OrderStatusBadge status={entry.status} />
                    {isFirst && (
                      <span className="text-caption text-primary-blue font-medium">
                        현재 상태
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-secondary-gray">
                    <time dateTime={date.toISOString()}>
                      {date.toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </time>
                  </p>

                  {entry.note && (
                    <p className="mt-1 text-gray-700">
                      {entry.note}
                    </p>
                  )}

                  {entry.updatedBy && (
                    <div className="mt-2 flex items-center gap-1 text-caption text-secondary-gray">
                      <User className="h-3 w-3" />
                      <span>{entry.updatedBy}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
