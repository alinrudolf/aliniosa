const PHONE_LAYOUT_MAX_WIDTH_PX = 768;
export const TABLET_LAYOUT_MAX_WIDTH_PX = 1300;
export const MOBILE_LAYOUT_MAX_HEIGHT_PX = 768;
const TABLET_LANDSCAPE_MIN_ASPECT_RATIO = 5 / 4;

const PHONE_WIDTH_QUERY = `(max-width: ${PHONE_LAYOUT_MAX_WIDTH_PX}px)`;
const TABLET_WIDTH_QUERY = `(${PHONE_LAYOUT_MAX_WIDTH_PX}px < width <= ${TABLET_LAYOUT_MAX_WIDTH_PX}px)`;
const RESPONSIVE_WIDTH_QUERY = `(max-width: ${TABLET_LAYOUT_MAX_WIDTH_PX}px)`;
const MOBILE_LANDSCAPE_SAFEGUARD_QUERY = `(width > ${TABLET_LAYOUT_MAX_WIDTH_PX}px) and (orientation: landscape) and (max-height: ${MOBILE_LAYOUT_MAX_HEIGHT_PX}px) and (pointer: coarse)`;

export const MOBILE_LAYOUT_QUERY = `${RESPONSIVE_WIDTH_QUERY}, ${MOBILE_LANDSCAPE_SAFEGUARD_QUERY}`;
export const MOBILE_PORTRAIT_QUERY = `${PHONE_WIDTH_QUERY} and (orientation: portrait), ${TABLET_WIDTH_QUERY} and (aspect-ratio < ${TABLET_LANDSCAPE_MIN_ASPECT_RATIO})`;
export const MOBILE_LANDSCAPE_QUERY = `${PHONE_WIDTH_QUERY} and (orientation: landscape), ${TABLET_WIDTH_QUERY} and (aspect-ratio >= ${TABLET_LANDSCAPE_MIN_ASPECT_RATIO}), ${MOBILE_LANDSCAPE_SAFEGUARD_QUERY}`;


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
    width <= TABLET_LAYOUT_MAX_WIDTH_PX ||
    (isLandscape && height <= MOBILE_LAYOUT_MAX_HEIGHT_PX && pointer === 'coarse');

  const isTabletWidth = PHONE_LAYOUT_MAX_WIDTH_PX < width && width <= TABLET_LAYOUT_MAX_WIDTH_PX;
  const usesLandscapeLayout = isTabletWidth ? width >= height * TABLET_LANDSCAPE_MIN_ASPECT_RATIO : isLandscape;

  return getViewportLayoutFromMatches(isMobileLayout, usesLandscapeLayout);
}
