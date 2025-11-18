import React from 'react';

interface ProgressProps {
  value: number;
  className?: string;
  indicatorClassName?: string;
}

export function Progress({ value, className = "", indicatorClassName = "" }: ProgressProps) {
  // value가 0-100 범위에 있도록 보장
  const clampedValue = Math.max(0, Math.min(100, value || 0));
  
  return (
    <div
      className={`relative h-4 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}
      role="progressbar"
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={clampedValue}
    >
      <div
        className={`h-full bg-blue-600 transition-all duration-300 ${indicatorClassName}`}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}