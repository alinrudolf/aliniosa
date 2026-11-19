import type { CSSProperties } from 'react';
import { contactMapDots, contactMapGrid, contactMapHotspots, contactMapViewBox } from '../../data/contactMapGeometry';

const activationSchedule = [
  ['pacific-coast', 0],
  ['britain', 3.4],
  ['atlantic-coast', 7.8],
  ['western-europe', 11.6],
  ['central-europe', 15.7],
  ['northern-europe', 19.9],
] as const satisfies ReadonlyArray<readonly [keyof typeof contactMapHotspots, number]>;

export default function ContactMapBackground() {
  return (
    <div className="contact-map-background" aria-hidden="true">
      <svg viewBox={contactMapViewBox} preserveAspectRatio="xMidYMid slice" focusable="false" fill="none">
        <path className="contact-map-grid" d={contactMapGrid} />
        <g className="contact-map-dots" strokeLinecap="round">
          {contactMapDots.map(({ width, path }) => (
            <path key={width} d={path} strokeWidth={width} />
          ))}
        </g>
        <g className="contact-map-hotspots" strokeWidth="3.7" strokeLinecap="round">
          {activationSchedule.map(([region, delay]) => (
            <path
              key={region}
              d={contactMapHotspots[region]}
              style={{ '--contact-map-delay': `${delay}s` } as CSSProperties}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
