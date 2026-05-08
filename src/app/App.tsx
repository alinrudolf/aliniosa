import { useState } from 'react';
import { BottomNav } from '../components/layout/BottomNav';
import { HeaderModule } from '../components/layout/HeaderModule';
import { SiteShell } from '../components/layout/SiteShell';
import { SignalMonitorNav } from '../components/signal/SignalMonitorNav';
import { siteHeader } from '../data/navigation';

export function App() {
  const [footerActiveNavId, setFooterActiveNavId] = useState<string | null>(null);
  const [waveformActiveNavId, setWaveformActiveNavId] = useState<string | null>(null);
  const activeNavId = footerActiveNavId ?? waveformActiveNavId;

  return (
    <SiteShell>
      <HeaderModule header={siteHeader} />
      <main className="min-h-0 flex-1 overflow-visible">
        <SignalMonitorNav activeNavId={activeNavId} onActiveNavChange={setWaveformActiveNavId} />
      </main>
      <BottomNav onActiveNavChange={setFooterActiveNavId} />
    </SiteShell>
  );
}
