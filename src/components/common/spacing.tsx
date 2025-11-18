import { ReactNode } from 'react';

interface SpacingProps {
  children: ReactNode;
  m?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  mx?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  my?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  mt?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  mr?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  mb?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  ml?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  p?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  px?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  py?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  pt?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  pr?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  pb?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  pl?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const spacingValues = {
  xs: '1',    // 4px
  sm: '2',    // 8px
  md: '4',    // 16px
  lg: '6',    // 24px
  xl: '8'     // 32px
};

export function Spacing({ 
  children, 
  m, mx, my, mt, mr, mb, ml,
  p, px, py, pt, pr, pb, pl,
  className = '' 
}: SpacingProps) {
  const classes = [
    m && `m-${spacingValues[m]}`,
    mx && `mx-${spacingValues[mx]}`,
    my && `my-${spacingValues[my]}`,
    mt && `mt-${spacingValues[mt]}`,
    mr && `mr-${spacingValues[mr]}`,
    mb && `mb-${spacingValues[mb]}`,
    ml && `ml-${spacingValues[ml]}`,
    p && `p-${spacingValues[p]}`,
    px && `px-${spacingValues[px]}`,
    py && `py-${spacingValues[py]}`,
    pt && `pt-${spacingValues[pt]}`,
    pr && `pr-${spacingValues[pr]}`,
    pb && `pb-${spacingValues[pb]}`,
    pl && `pl-${spacingValues[pl]}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {children}
    </div>
  );
}

// 유틸리티 컴포넌트들
export function Stack({ children, gap = 'md', className = '' }: { 
  children: ReactNode; 
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const gapClasses = {
    xs: 'space-y-1',    // 4px
    sm: 'space-y-2',    // 8px
    md: 'space-y-4',    // 16px
    lg: 'space-y-6',    // 24px
    xl: 'space-y-8'     // 32px
  };

  return (
    <div className={`${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
}

export function HStack({ children, gap = 'md', className = '' }: { 
  children: ReactNode; 
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const gapClasses = {
    xs: 'space-x-1',    // 4px
    sm: 'space-x-2',    // 8px
    md: 'space-x-4',    // 16px
    lg: 'space-x-6',    // 24px
    xl: 'space-x-8'     // 32px
  };

  return (
    <div className={`flex ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
}