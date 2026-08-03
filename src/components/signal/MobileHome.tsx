import { systemReadout } from '../../data/systemReadout';
import { siteHeader } from '../../data/navigation';
import { SignalMonitorNav } from './SignalMonitorNav';
import { useSystemUptime } from '../system/useSystemUptime';

function HomeIdentityContent({ titleId }: { titleId: string }) {
  const uptime = useSystemUptime();

  return (
    <div className="mobile-home-identity">
      <h1 id={titleId} className="mobile-home-name">{siteHeader.title}</h1>
      <p className="mobile-home-roles">
        <span>PRODUCT MANAGER</span>
        <span>HARDWARE BUILDER</span>
      </p>
      <span className="mobile-home-divider" aria-hidden="true" />
      <dl className="mobile-home-metrics">
        <div>
          <dt className="sr-only">Location</dt>
          <dd>LOCATION: {systemReadout.status.location}</dd>
        </div>
        <div>
          <dt className="sr-only">Uptime</dt>
          <dd>UPTIME: {uptime}</dd>
        </div>
      </dl>
    </div>
  );
}

function MobileHomeWaveform() {
  return (
    <SignalMonitorNav
      activeNavId={null}
      onActiveNavChange={() => undefined}
      embedded
      decorative
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 150 1100 370"
      className="mobile-home-waveform pointer-events-none"
    />
  );
}

export function MobileHomePortrait() {
  return (
    <section className="mobile-home mobile-home-portrait" aria-labelledby="mobile-home-portrait-title">
      <div className="mobile-home-copy">
        <HomeIdentityContent titleId="mobile-home-portrait-title" />
      </div>
      <MobileHomeWaveform />
    </section>
  );
}

export function MobileHomeLandscape() {
  return (
    <section className="mobile-home mobile-home-landscape" aria-labelledby="mobile-home-landscape-title">
      <MobileHomeWaveform />
      <div className="mobile-home-panel">
        <HomeIdentityContent titleId="mobile-home-landscape-title" />
      </div>
    </section>
  );
}
