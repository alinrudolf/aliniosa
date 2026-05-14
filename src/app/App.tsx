import { type ComponentProps, useEffect, useRef, useState } from 'react';
import { BottomNav } from '../components/layout/BottomNav';
import { HeaderModule } from '../components/layout/HeaderModule';
import { PageTransitionOverlay, type PageTransitionRect, type PageTransitionState } from '../components/layout/PageTransitionOverlay';
import { SiteShell } from '../components/layout/SiteShell';
import { SignalMonitorNav } from '../components/signal/SignalMonitorNav';
import { IdentityBody } from '../components/system/IdentityBody';
import { SystemReadout } from '../components/system/SystemReadout';
import { bottomNavigation, signalMonitorLabel, siteHeader } from '../data/navigation';
import { HoverTextureExport } from './HoverTextureExport';
import { TerrainPreviewField } from './TerrainPreviewField';
import { TerrainPreview } from './TerrainPreview';

export function App() {
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
  const isSystemRendered = renderedHash === '#system';

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

  if (window.location.pathname === '/terrain-preview') {
    return <TerrainPreview />;
  }

  if (window.location.pathname === '/terrain-preview-2') {
    return <TerrainPreviewField />;
  }

  if (window.location.pathname === '/hover-texture-export') {
    return <HoverTextureExport />;
  }

  return (
    <SiteShell>
      <section className="relative flex h-full min-h-0 w-full flex-col overflow-visible border border-[color:var(--amber-dim)] bg-[color:var(--bg-crt)] text-[color:var(--amber-base)]">
        <span className="system-label-type absolute right-8 top-0 z-30 -translate-y-1/2 bg-[color:var(--bg-crt)] px-2 text-[0.68rem] text-[color:var(--amber-core)]">
          {signalMonitorLabel}
        </span>
        <div className={`relative shrink-0 overflow-hidden ${isSystemActive ? 'h-32 py-6' : 'h-[255px] pt-6'}`}>
          <HeaderModule header={siteHeader} embedded compact={isSystemActive} />
          <div className="absolute right-10 top-9">
            <SystemReadout />
          </div>
        </div>
        <main ref={mainRef} className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
          {isSystemRendered ? (
            <IdentityBody />
          ) : renderedHash === null ? null : (
            <SignalMonitorNav activeNavId={activeNavId} onActiveNavChange={setWaveformActiveNavId} embedded />
          )}
        </main>
        {pageTransition ? (
          <PageTransitionOverlay key={pageTransition.id} transition={pageTransition} onComplete={completePageTransition} />
        ) : null}
        <BottomNav
          activeNavId={activeHashNavId}
          hoverNavId={activeNavId}
          onActiveNavChange={setTopNavActiveNavId}
          onActiveNavClick={returnToRestState}
          onNavItemClick={handleBottomNavItemClick}
        />
      </section>
    </SiteShell>
  );
}
