import type { ReactNode } from 'react';
import type { ViewportLayoutMode } from '../../app/viewportLayout';

type ResponsivePageProps = {
  desktop: ReactNode;
  mobilePortrait?: ReactNode;
  mobileLandscape?: ReactNode;
  mode: ViewportLayoutMode;
};

export function ResponsivePage({ desktop, mobilePortrait, mobileLandscape, mode }: ResponsivePageProps) {
  if (mode === 'mobile-landscape') {
    return <>{mobileLandscape ?? mobilePortrait ?? desktop}</>;
  }

  if (mode === 'mobile-portrait') {
    return <>{mobilePortrait ?? mobileLandscape ?? desktop}</>;
  }

  return <>{desktop}</>;
}
