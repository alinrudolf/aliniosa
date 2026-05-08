import { BottomNav } from '../components/layout/BottomNav';
import { HeaderModule } from '../components/layout/HeaderModule';
import { SiteShell } from '../components/layout/SiteShell';
import { SignalMonitorNav } from '../components/signal/SignalMonitorNav';
import { siteHeader } from '../data/navigation';

export function App() {
  return (
    <SiteShell>
      <HeaderModule header={siteHeader} />
      <SignalMonitorNav />
      <BottomNav />
    </SiteShell>
  );
}
