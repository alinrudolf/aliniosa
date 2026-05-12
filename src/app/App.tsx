import { useEffect, useState } from 'react';
import { BottomNav } from '../components/layout/BottomNav';
import { HeaderModule } from '../components/layout/HeaderModule';
import { SiteShell } from '../components/layout/SiteShell';
import { SignalMonitorNav } from '../components/signal/SignalMonitorNav';
import { IdentityBody } from '../components/system/IdentityBody';
import { bottomNavigation, signalMonitorLabel, siteHeader } from '../data/navigation';
import { TerrainPreviewField } from './TerrainPreviewField';
import { TerrainPreview } from './TerrainPreview';

export function App() {
  const [activeHash, setActiveHash] = useState(() => window.location.hash);
  const [topNavActiveNavId, setTopNavActiveNavId] = useState<string | null>(null);
  const [waveformActiveNavId, setWaveformActiveNavId] = useState<string | null>(null);
  const activeNavId = topNavActiveNavId ?? waveformActiveNavId;
  const activeHashNavId = bottomNavigation.find((item) => item.href === activeHash)?.id ?? null;
  const isSystemActive = activeHash === '#system';

  useEffect(() => {
    const updateActiveHash = () => setActiveHash(window.location.hash);

    window.addEventListener('hashchange', updateActiveHash);

    return () => {
      window.removeEventListener('hashchange', updateActiveHash);
    };
  }, []);

  const returnToRestState = () => {
    window.history.pushState(null, '', `${window.location.pathname}${window.location.search}`);
    setActiveHash('');
    setTopNavActiveNavId(null);
    setWaveformActiveNavId(null);
  };

  if (window.location.pathname === '/terrain-preview') {
    return <TerrainPreview />;
  }

  if (window.location.pathname === '/terrain-preview-2') {
    return <TerrainPreviewField />;
  }

  return (
    <SiteShell>
      <section className="relative flex h-full min-h-0 w-full flex-col overflow-visible border border-[color:var(--amber-dim)] bg-[color:var(--bg-crt)] text-[color:var(--amber-base)]">
        <span className="absolute right-8 top-0 z-30 -translate-y-1/2 bg-[color:var(--bg-crt)] px-2 font-mono text-[0.68rem] uppercase leading-none tracking-[0.14em] text-[color:var(--amber-core)]">
          {signalMonitorLabel}
        </span>
        <div className="h-[255px] shrink-0 overflow-hidden pt-6">
          <HeaderModule header={siteHeader} logoAnimationKey={activeHash || 'rest'} embedded />
        </div>
        <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
          {isSystemActive ? (
            <IdentityBody />
          ) : (
            <SignalMonitorNav activeNavId={activeNavId} onActiveNavChange={setWaveformActiveNavId} embedded />
          )}
        </main>
        <BottomNav
          activeNavId={activeHashNavId}
          onActiveNavChange={setTopNavActiveNavId}
          onActiveNavClick={returnToRestState}
        />
      </section>
    </SiteShell>
  );
}
