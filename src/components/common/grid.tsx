import { ReactNode } from 'react';

interface GridProps {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

interface GridItemProps {
  children: ReactNode;
  span?: 1 | 2 | 3 | 4 | 6 | 12;
  spanSm?: 1 | 2 | 3 | 4 | 6 | 12;
  spanMd?: 1 | 2 | 3 | 4 | 6 | 12;
  spanLg?: 1 | 2 | 3 | 4 | 6 | 12;
  className?: string;
}

const colsClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  6: 'grid-cols-6',
  12: 'grid-cols-12'
};

const gapClasses = {
  sm: 'gap-4',    // 16px
  md: 'gap-6',    // 24px
  lg: 'gap-8',    // 32px
  xl: 'gap-12'    // 48px
};

const spanClasses = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
  6: 'col-span-6',
  12: 'col-span-12'
};

const spanSmClasses = {
  1: 'sm:col-span-1',
  2: 'sm:col-span-2',
  3: 'sm:col-span-3',
  4: 'sm:col-span-4',
  6: 'sm:col-span-6',
  12: 'sm:col-span-12'
};

const spanMdClasses = {
  1: 'md:col-span-1',
  2: 'md:col-span-2',
  3: 'md:col-span-3',
  4: 'md:col-span-4',
  6: 'md:col-span-6',
  12: 'md:col-span-12'
};

const spanLgClasses = {
  1: 'lg:col-span-1',
  2: 'lg:col-span-2',
  3: 'lg:col-span-3',
  4: 'lg:col-span-4',
  6: 'lg:col-span-6',
  12: 'lg:col-span-12'
};

export function Grid({ 
  children, 
  cols = 12, 
  gap = 'md',
  className = '' 
}: GridProps) {
  return (
    <div className={`
      grid
      ${colsClasses[cols]}
      ${gapClasses[gap]}
      ${className}
    `}>
      {children}
    </div>
  );
}

export function GridItem({ 
  children, 
  span = 1,
  spanSm,
  spanMd,
  spanLg,
  className = '' 
}: GridItemProps) {
  return (
    <div className={`
      ${spanClasses[span]}
      ${spanSm ? spanSmClasses[spanSm] : ''}
      ${spanMd ? spanMdClasses[spanMd] : ''}
      ${spanLg ? spanLgClasses[spanLg] : ''}
      ${className}
    `}>
      {children}
    </div>
  );
}