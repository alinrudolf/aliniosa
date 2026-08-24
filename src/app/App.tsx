import { type ComponentProps, useEffect, useRef, useState } from 'react';
import { BottomNav } from '../components/layout/BottomNav';
import { HeaderModule } from '../components/layout/HeaderModule';
import { MobilePageFallback } from '../components/layout/MobilePageFallback';
import { MobileShell } from '../components/layout/MobileShell';
import { PageTransitionOverlay, type PageTransitionRect, type PageTransitionState } from '../components/layout/PageTransitionOverlay';
import { ResponsivePage } from '../components/layout/ResponsivePage';
import { SiteShell } from '../components/layout/SiteShell';
import { useBackgroundAudio } from '../components/layout/useBackgroundAudio';
import { MobileLibrary, type MobileLibraryViewMode } from '../components/library/MobileLibrary';
import { MovieLibrary } from '../components/library/MovieLibrary';
import { MobileHomeLandscape, MobileHomePortrait } from '../components/signal/MobileHome';
import { SignalMonitorNav } from '../components/signal/SignalMonitorNav';
import { IdentityBody } from '../components/system/IdentityBody';
import { SystemReadout } from '../components/system/SystemReadout';
import { movies } from '../data/movies';
import { bottomNavigation, navigation, signalMonitorLabel, siteHeader } from '../data/navigation';
import { HoverTextureExport } from './HoverTextureExport';
import { TerrainPreviewField } from './TerrainPreviewField';
import { TerrainPreview } from './TerrainPreview';
import { type ViewportLayoutMode } from './viewportLayout';
import { useViewportLayout } from './useViewportLayout';

export function App() {
  if (window.location.pathname === '/terrain-preview') {
    return <TerrainPreview />;
  }

  if (window.location.pathname === '/terrain-preview-2') {
    return <TerrainPreviewField />;
  }

  if (window.location.pathname === '/hover-texture-export') {
    return <HoverTextureExport />;
  }

  return <ResponsiveSite />;
}

function ResponsiveSite() {
  const layoutMode = useViewportLayout();
  const audio = useBackgroundAudio();

  if (layoutMode === 'desktop') {
    return (
      <DesktopSite
        isAudioEnabled={audio.isAudioEnabled}
        onAudioToggle={audio.toggleBackgroundAudio}
      />
    );
  }

  return (
    <MobileSite
      layoutMode={layoutMode}
      isAudioEnabled={audio.isAudioEnabled}
      onAudioToggle={audio.toggleBackgroundAudio}
    />
  );
}

type AudioControls = {
  isAudioEnabled: boolean;
  onAudioToggle: () => void;
};

function DesktopPageContent({
  renderedHash,
  activeNavId,
  onActiveNavChange,
}: {
  renderedHash: string | null;
  activeNavId: string | null;
  onActiveNavChange: (id: string | null) => void;
}) {
  const isSystemRendered = renderedHash === '#system';
  const isLibraryRendered = renderedHash === '#library';

  if (isSystemRendered) {
    return <IdentityBody />;
  }

  if (isLibraryRendered) {
    return <MovieLibrary movies={movies} />;
  }

  if (renderedHash === null) {
    return null;
  }

  return <SignalMonitorNav activeNavId={activeNavId} onActiveNavChange={onActiveNavChange} embedded />;
}

function getMobilePageTitle(activeHash: string) {
  return navigation.find((item) => item.href === activeHash)?.label.toUpperCase() ?? 'ROOT';
}

function MobileSite({ layoutMode, isAudioEnabled, onAudioToggle }: AudioControls & {
  layoutMode: Extract<ViewportLayoutMode, 'mobile-portrait' | 'mobile-landscape'>;
}) {
  const [activeHash, setActiveHash] = useState(() => window.location.hash);
  const [mobileLibrarySelectedMovieIndex, setMobileLibrarySelectedMovieIndex] = useState(0);
  const [mobileLibraryViewMode, setMobileLibraryViewMode] = useState<MobileLibraryViewMode>('list');

  useEffect(() => {
    const updateActiveHash = () => {
      setActiveHash(window.location.hash);
    };

    window.addEventListener('hashchange', updateActiveHash);

    return () => {
      window.removeEventListener('hashchange', updateActiveHash);
    };
  }, []);

  const returnToRestState = () => {
    window.history.pushState(null, '', `${window.location.pathname}${window.location.search}`);
    setActiveHash('');
  };

  useEffect(() => {
    if (activeHash !== '#library') {
      setMobileLibraryViewMode('list');
    }
  }, [activeHash]);

  const mobileLibraryPageTitle =
    mobileLibraryViewMode === 'details'
      ? `LIBRARY / RECORD ${String(mobileLibrarySelectedMovieIndex + 1).padStart(2, '0')}`
      : 'LIBRARY';

  const mobileLibraryPortraitPage = (
    <MobileLibrary
      movies={movies}
      orientation="portrait"
      selectedMovieIndex={mobileLibrarySelectedMovieIndex}
      viewMode={mobileLibraryViewMode}
      onSelectedMovieIndexChange={setMobileLibrarySelectedMovieIndex}
      onViewModeChange={setMobileLibraryViewMode}
    />
  );
  const mobileLibraryLandscapePage = (
    <MobileLibrary
      movies={movies}
      orientation="landscape"
      selectedMovieIndex={mobileLibrarySelectedMovieIndex}
      viewMode={mobileLibraryViewMode}
      onSelectedMovieIndexChange={setMobileLibrarySelectedMovieIndex}
      onViewModeChange={setMobileLibraryViewMode}
    />
  );
  const desktopFallbackPage = (
    <DesktopPageContent renderedHash={activeHash} activeNavId={null} onActiveNavChange={() => undefined} />
  );
  const mobilePortraitPage = activeHash === '' ? (
    <MobileHomePortrait />
  ) : activeHash === '#library' ? (
    mobileLibraryPortraitPage
  ) : (
    <MobilePageFallback orientation="portrait">{desktopFallbackPage}</MobilePageFallback>
  );
  const mobileLandscapePage = activeHash === '' ? (
    <MobileHomeLandscape />
  ) : activeHash === '#library' ? (
    mobileLibraryLandscapePage
  ) : (
    <MobilePageFallback orientation="landscape">{desktopFallbackPage}</MobilePageFallback>
  );

  return (
    <MobileShell
      layoutMode={layoutMode}
      header={siteHeader}
      pageTitle={activeHash === '#library' ? mobileLibraryPageTitle : getMobilePageTitle(activeHash)}
      activeHash={activeHash}
      isAudioEnabled={isAudioEnabled}
      onAudioToggle={onAudioToggle}
      onActiveNavClick={returnToRestState}
    >
      <ResponsivePage
        mode={layoutMode}
        desktop={desktopFallbackPage}
        mobilePortrait={mobilePortraitPage}
        mobileLandscape={mobileLandscapePage}
      />
    </MobileShell>
  );
}

function DesktopSite({ isAudioEnabled, onAudioToggle }: AudioControls) {
  const mainRef = useRef<HTMLElement | null>(null);
  const pendingOpenTransitionRef = useRef<{ hash: string; sourceRect: PageTransitionRect } | null>(null);
  const transitionCompletionRef = useRef<(() => void) | null>(null);
  const transitionIdRef = useRef(0);
  const [activeHash, setActiveHash] = useState(() => window.location.hash);
  const [renderedHash, setRenderedHash] = useState<string | null>(() => window.location.hash);
  const [topNavActiveNavId, setTopNavActiveNavId] = useState<string | null>(null);
  const [waveformActiveNavId, setWaveformActiveNavId] = useState<string | null>(null);
  const [pageTransition, setPageTransition] = useState<PageTransitionState | null>(null);
  const activeNavId = topNavActiveNavId ?? waveformActiveNavId;
  const activeHashNavId = bottomNavigation.find((item) => item.href === activeHash)?.id ?? null;
  const isSystemActive = activeHash === '#system';
  const isLibraryActive = activeHash === '#library';
  const isLibraryRendered = renderedHash === '#library';
  const isContentPageActive = isSystemActive || isLibraryActive;

  const isReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const makeTransitionRect = (rect: DOMRect): PageTransitionRect => ({
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
  });

  const startPageTransition = (from: PageTransitionRect, to: PageTransitionRect, onComplete?: () => void) => {
    transitionCompletionRef.current = onComplete ?? null;
    transitionIdRef.current += 1;
    setPageTransition({
      id: transitionIdRef.current,
      from,
      to,
    });
  };

  const completePageTransition = () => {
    const onComplete = transitionCompletionRef.current;

    transitionCompletionRef.current = null;
    setPageTransition(null);
    onComplete?.();
  };

  useEffect(() => {
    const updateActiveHash = () => {
      const nextHash = window.location.hash;

      setActiveHash(nextHash);

      if (!pendingOpenTransitionRef.current && !transitionCompletionRef.current) {
        setRenderedHash(nextHash);
      }
    };

    window.addEventListener('hashchange', updateActiveHash);

    return () => {
      window.removeEventListener('hashchange', updateActiveHash);
    };
  }, []);

  const returnToRestState = () => {
    window.history.pushState(null, '', `${window.location.pathname}${window.location.search}`);
    setActiveHash('');
    setRenderedHash('');
    setTopNavActiveNavId(null);
    setWaveformActiveNavId(null);
  };

  const handleBottomNavItemClick: ComponentProps<typeof BottomNav>['onNavItemClick'] = ({
    event,
    isActive,
    item,
    sourceRect,
  }) => {
    if (isReducedMotion()) {
      return false;
    }

    if (!isActive) {
      pendingOpenTransitionRef.current = {
        hash: item.href,
        sourceRect: makeTransitionRect(sourceRect),
      };

      return false;
    }

    const contentRect = mainRef.current?.getBoundingClientRect();

    if (!contentRect) {
      return false;
    }

    event.preventDefault();
    setRenderedHash(null);
    startPageTransition(makeTransitionRect(contentRect), makeTransitionRect(sourceRect), returnToRestState);

    return true;
  };

  useEffect(() => {
    const pendingTransition = pendingOpenTransitionRef.current;
    const contentRect = mainRef.current?.getBoundingClientRect();

    if (!pendingTransition || pendingTransition.hash !== activeHash || !contentRect || isReducedMotion()) {
      return;
    }

    pendingOpenTransitionRef.current = null;
    startPageTransition(pendingTransition.sourceRect, makeTransitionRect(contentRect), () => {
      setRenderedHash(pendingTransition.hash);
    });
  }, [activeHash]);

  return (
    <SiteShell>
      <section className="relative flex h-full min-h-0 w-full flex-col overflow-visible border border-[color:var(--amber-dim)] bg-[color:var(--bg-crt)] text-[color:var(--amber-base)]">
        <span className="system-label-type absolute right-[var(--space-8)] top-0 z-30 -translate-y-1/2 bg-[color:var(--bg-crt)] px-[var(--space-2)] text-[length:var(--font-xs)] text-[color:var(--amber-core)]">
          {signalMonitorLabel}
        </span>
        <div className={`relative shrink-0 overflow-hidden ${isContentPageActive ? 'h-[var(--header-height)] py-[var(--space-6)]' : 'h-[var(--header-height-home)] pt-[var(--space-6)]'}`}>
          <HeaderModule header={siteHeader} embedded compact={isContentPageActive} />
          <div className="absolute right-[var(--space-10)] top-[calc(2.25rem*var(--ui-scale))]">
            <SystemReadout />
          </div>
        </div>
        {isLibraryRendered ? (
          <span className="library-page-label library-page-label-shell" aria-hidden="true">
            [LIBRARY]
          </span>
        ) : null}
        <main ref={mainRef} className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
          <DesktopPageContent
            renderedHash={renderedHash}
            activeNavId={activeNavId}
            onActiveNavChange={setWaveformActiveNavId}
          />
        </main>
        {pageTransition ? (
          <PageTransitionOverlay key={pageTransition.id} transition={pageTransition} onComplete={completePageTransition} />
        ) : null}
        <BottomNav
          activeNavId={activeHashNavId}
          hoverNavId={activeNavId}
          isAudioEnabled={isAudioEnabled}
          onActiveNavChange={setTopNavActiveNavId}
          onActiveNavClick={returnToRestState}
          onAudioToggle={onAudioToggle}
          onNavItemClick={handleBottomNavItemClick}
        />
      </section>
    </SiteShell>
  );
}
