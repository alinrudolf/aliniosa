import { useState } from 'react';
import { BottomNav } from '../components/layout/BottomNav';
import { HeaderModule } from '../components/layout/HeaderModule';
import { SiteShell } from '../components/layout/SiteShell';
import { SignalMonitorNav } from '../components/signal/SignalMonitorNav';
import { siteHeader } from '../data/navigation';
import { TerrainPreviewField } from './TerrainPreviewField';
import { TerrainPreview } from './TerrainPreview';

export function App() {
  const [topNavActiveNavId, setTopNavActiveNavId] = useState<string | null>(null);
  const [waveformActiveNavId, setWaveformActiveNavId] = useState<string | null>(null);
  const activeNavId = topNavActiveNavId ?? waveformActiveNavId;

  if (window.location.pathname === '/terrain-preview') {
    return <TerrainPreview />;
  }

  if (window.location.pathname === '/terrain-preview-2') {
    return <TerrainPreviewField />;
  }

  return (
    <SiteShell>
      <div className="grid shrink-0 gap-12 lg:grid-cols-[1fr_360px]">
        <HeaderModule header={siteHeader} />
        <BottomNav onActiveNavChange={setTopNavActiveNavId} />
      </div>
      <main className="min-h-0 flex-1 overflow-visible">
        <SignalMonitorNav activeNavId={activeNavId} onActiveNavChange={setWaveformActiveNavId} />
      </main>
    </SiteShell>
  );
}
