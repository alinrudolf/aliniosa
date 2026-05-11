import { useEffect, useState } from 'react';
import { BottomNav } from '../components/layout/BottomNav';
import { HeaderModule } from '../components/layout/HeaderModule';
import { SiteShell } from '../components/layout/SiteShell';
import { SignalMonitorNav } from '../components/signal/SignalMonitorNav';
import { IdentityBody } from '../components/system/IdentityBody';
import { bottomNavigation, siteHeader } from '../data/navigation';
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
      <div className="grid shrink-0 gap-12 lg:grid-cols-[1fr_360px]">
        <HeaderModule header={siteHeader} logoAnimationKey={activeHash || 'rest'} />
        <BottomNav
          activeNavId={activeHashNavId}
          onActiveNavChange={setTopNavActiveNavId}
          onActiveNavClick={returnToRestState}
        />
      </div>
      <main className="min-h-0 flex-1 overflow-visible">
        {isSystemActive ? (
          <IdentityBody />
        ) : (
          <SignalMonitorNav activeNavId={activeNavId} onActiveNavChange={setWaveformActiveNavId} />
        )}
      </main>
    </SiteShell>
  );
}
