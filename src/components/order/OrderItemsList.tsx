/**
 * Order Items List Component
 * T14-07: Display order items with proper formatting
 */

import React from 'react';
import { OrderItem } from '../../types/order';
import { Card } from '../ui/card';

interface OrderItemsListProps {
  items: OrderItem[];
  showPrices?: boolean;
}

export function OrderItemsList({ items, showPrices = true }: OrderItemsListProps) {
  if (!items || items.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-secondary-gray text-center">주문 항목이 없습니다.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3" role="list" aria-label="주문 항목 목록">
      {items.map((item, index) => (
        <Card 
          key={item.id || index} 
          className="p-4"
          role="listitem"
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 truncate">
                {item.name}
              </h4>
              
              {item.options && item.options.length > 0 && (
                <ul className="mt-1 space-y-0.5" aria-label="옵션">
                  {item.options.map((option, optIdx) => (
                    <li 
                      key={optIdx}
                      className="text-secondary-gray flex items-center gap-2"
                    >
                      <span className="text-xs">•</span>
                      <span>
                        {option.name}: {option.value}
                        {option.price && option.price > 0 && (
                          <span className="ml-1">
                            (+₩{option.price.toLocaleString()})
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              
              <p className="mt-1 text-secondary-gray">
                수량: {item.quantity}개
              </p>
            </div>

            {showPrices && (
              <div className="text-right flex-shrink-0">
                <p className="font-medium text-gray-900">
                  ₩{item.subtotal.toLocaleString()}
                </p>
                {item.quantity > 1 && (
                  <p className="text-caption text-secondary-gray mt-0.5">
                    @₩{item.price.toLocaleString()}
                  </p>
                )}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
