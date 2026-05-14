import { useEffect, useMemo, useRef } from 'react';
import avatarImageUrl from '../../assets/images/Avatar Transparent Amber.png?url';
import { identityContent } from '../../data/identity';

type IdentityStatusItem = (typeof identityContent.statusLeft)[number];

const ANALYZER_WIDTH = 924;
const ANALYZER_HEIGHT = 142;
const ANALYZER_POINT_COUNT = 34;

function makeWaveformPath(time = 0) {
  const centerY = ANALYZER_HEIGHT * 0.52;
  const points: string[] = [];

  for (let index = 0; index < ANALYZER_POINT_COUNT; index += 1) {
    const progress = index / (ANALYZER_POINT_COUNT - 1);
    const x = progress * ANALYZER_WIDTH;
    const envelope =
      0.22 +
      Math.exp(-(((progress - 0.37) / 0.18) ** 2)) * 0.28 +
      Math.exp(-(((progress - 0.72) / 0.16) ** 2)) * 0.5 +
      Math.exp(-(((progress - 0.9) / 0.12) ** 2)) * 0.32;
    const signal =
      Math.sin(progress * Math.PI * 3.2 + time * 0.72) * 29.25 * envelope +
      Math.sin(progress * Math.PI * 7.4 - time * 1.04) * 12.15 * envelope +
      Math.sin(progress * Math.PI * 1.25 + time * 0.38) * 7.2;
    const y = Math.min(ANALYZER_HEIGHT - 18, Math.max(18, centerY - signal));

    points.push(`${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`);
  }

  return points.join(' ');
}

function IdentityAvatarPanel() {
  return (
    <section className="identity-avatar-panel" aria-label="Identity signal portrait">
      <div className="identity-avatar-frame">
        <img src={avatarImageUrl} alt={identityContent.imageAlt} className="identity-avatar-image" />
        <div className="identity-avatar-active-overlay" aria-hidden="true" />
        <span className="identity-avatar-corner identity-avatar-corner-tl" aria-hidden="true" />
        <span className="identity-avatar-corner identity-avatar-corner-tr" aria-hidden="true" />
        <span className="identity-avatar-corner identity-avatar-corner-bl" aria-hidden="true" />
        <span className="identity-avatar-corner identity-avatar-corner-br" aria-hidden="true" />
      </div>
    </section>
  );
}

function IdentityStatusColumn({ items }: { items: IdentityStatusItem[] }) {
  return (
    <dl className="identity-status-column">
      {items.map((item) => (
        <div key={item.label} className="identity-status-row">
          <dt>{item.label}:</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function WaveformAnalyzer() {
  const pathRef = useRef<SVGPathElement | null>(null);
  const staticPath = useMemo(() => makeWaveformPath(0), []);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (motionQuery.matches) {
      pathRef.current?.setAttribute('d', staticPath);
      return;
    }

    let animationFrame = 0;
    let startTime = performance.now();

    const renderWaveform = (frameTime: number) => {
      const elapsedSeconds = (frameTime - startTime) / 1000;

      pathRef.current?.setAttribute('d', makeWaveformPath(elapsedSeconds));
      animationFrame = window.requestAnimationFrame(renderWaveform);
    };

    const handleMotionPreferenceChange = () => {
      window.cancelAnimationFrame(animationFrame);

      if (motionQuery.matches) {
        pathRef.current?.setAttribute('d', staticPath);
        return;
      }

      startTime = performance.now();
      animationFrame = window.requestAnimationFrame(renderWaveform);
    };

    animationFrame = window.requestAnimationFrame(renderWaveform);
    motionQuery.addEventListener('change', handleMotionPreferenceChange);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      motionQuery.removeEventListener('change', handleMotionPreferenceChange);
    };
  }, [staticPath]);

  return (
    <div className="identity-waveform-analyzer" aria-hidden="true">
      <div className="identity-waveform-dots" />
      <svg
        viewBox={`0 0 ${ANALYZER_WIDTH} ${ANALYZER_HEIGHT}`}
        preserveAspectRatio="none"
        className="identity-waveform-svg"
      >
        <path
          ref={pathRef}
          className="identity-waveform-line"
          d={staticPath}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

function IdentityInfoPanel() {
  return (
    <section className="identity-info-panel" aria-labelledby="identity-title">
      <span id="identity-title" className="identity-info-label">
        {identityContent.label}
      </span>
      <div className="identity-info-scroll">
        <div className="identity-info-main">
          <div className="identity-status-grid">
            <IdentityStatusColumn items={identityContent.statusLeft} />
            <IdentityStatusColumn items={identityContent.statusRight} />
          </div>
          <div className="identity-copy">
            {identityContent.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <WaveformAnalyzer />
      </div>
    </section>
  );
}

function IdentityPageContent() {
  return (
    <section className="identity-page-content">
      <IdentityAvatarPanel />
      <IdentityInfoPanel />
    </section>
  );
}

export function IdentityBody() {
  return <IdentityPageContent />;
}
