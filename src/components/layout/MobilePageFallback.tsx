import type { ReactNode } from 'react';

type MobilePageFallbackProps = {
  orientation: 'portrait' | 'landscape';
  children: ReactNode;
};

export function MobilePageFallback({ orientation, children }: MobilePageFallbackProps) {
  return (
    <div className="mobile-page-fallback" data-mobile-orientation={orientation}>
      {children}
    </div>
  );
}
