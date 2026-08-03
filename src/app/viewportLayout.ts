export const MOBILE_LAYOUT_MAX_WIDTH_PX = 768;
export const MOBILE_LAYOUT_MAX_HEIGHT_PX = 768;

export const MOBILE_WIDTH_QUERY = `(max-width: ${MOBILE_LAYOUT_MAX_WIDTH_PX}px)`;
export const MOBILE_LANDSCAPE_SAFEGUARD_QUERY = `(orientation: landscape) and (max-height: ${MOBILE_LAYOUT_MAX_HEIGHT_PX}px) and (pointer: coarse)`;
export const MOBILE_LAYOUT_QUERY = `${MOBILE_WIDTH_QUERY}, ${MOBILE_LANDSCAPE_SAFEGUARD_QUERY}`;
export const MOBILE_PORTRAIT_QUERY = `${MOBILE_WIDTH_QUERY} and (orientation: portrait)`;
export const MOBILE_LANDSCAPE_QUERY = `${MOBILE_WIDTH_QUERY} and (orientation: landscape), ${MOBILE_LANDSCAPE_SAFEGUARD_QUERY}`;
export const LANDSCAPE_QUERY = '(orientation: landscape)';

export type ViewportLayoutMode = 'desktop' | 'mobile-portrait' | 'mobile-landscape';
export type PrimaryPointer = 'coarse' | 'fine' | 'none';

export function getViewportLayoutFromMatches(isMobileLayout: boolean, isLandscape: boolean): ViewportLayoutMode {
  if (!isMobileLayout) {
    return 'desktop';
  }

  return isLandscape ? 'mobile-landscape' : 'mobile-portrait';
}

export function getViewportLayoutForViewport({
  width,
  height,
  pointer,
}: {
  width: number;
  height: number;
  pointer: PrimaryPointer;
}): ViewportLayoutMode {
  const isLandscape = width > height;
  const isMobileLayout =
    width <= MOBILE_LAYOUT_MAX_WIDTH_PX ||
    (isLandscape && height <= MOBILE_LAYOUT_MAX_HEIGHT_PX && pointer === 'coarse');

  return getViewportLayoutFromMatches(isMobileLayout, isLandscape);
}
