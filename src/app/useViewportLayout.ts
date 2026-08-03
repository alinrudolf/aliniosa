import { useSyncExternalStore } from 'react';
import {
  getViewportLayoutFromMatches,
  LANDSCAPE_QUERY,
  MOBILE_LANDSCAPE_QUERY,
  MOBILE_LAYOUT_QUERY,
  MOBILE_PORTRAIT_QUERY,
  type ViewportLayoutMode,
} from './viewportLayout';

function getMediaQueryList(query: string) {
  return window.matchMedia(query);
}

function getViewportLayoutSnapshot(): ViewportLayoutMode {
  if (typeof window === 'undefined') {
    return 'desktop';
  }

  return getViewportLayoutFromMatches(
    getMediaQueryList(MOBILE_LAYOUT_QUERY).matches,
    getMediaQueryList(LANDSCAPE_QUERY).matches,
  );
}

function subscribeToViewportLayout(onStoreChange: () => void) {
  const mediaQueryLists = [
    getMediaQueryList(MOBILE_LAYOUT_QUERY),
    getMediaQueryList(MOBILE_PORTRAIT_QUERY),
    getMediaQueryList(MOBILE_LANDSCAPE_QUERY),
    getMediaQueryList(LANDSCAPE_QUERY),
  ];

  mediaQueryLists.forEach((mediaQueryList) => {
    mediaQueryList.addEventListener('change', onStoreChange);
  });

  return () => {
    mediaQueryLists.forEach((mediaQueryList) => {
      mediaQueryList.removeEventListener('change', onStoreChange);
    });
  };
}

export function useViewportLayout(): ViewportLayoutMode {
  return useSyncExternalStore(subscribeToViewportLayout, getViewportLayoutSnapshot, () => 'desktop');
}
