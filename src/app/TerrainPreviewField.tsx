import { useState } from 'react';
import SignalTerrainFieldWebGL from '../components/SignalTerrainFieldWebGL';

type PreviewSection = 'SYS' | 'WRK' | 'INS' | 'LIB' | 'LOG' | 'CNT' | null;

export function TerrainPreviewField() {
  const [hoveredSection, setHoveredSection] = useState<PreviewSection>(null);

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-[color:var(--bg-crt)] text-[color:var(--amber-base)]">
      <span className="absolute left-6 top-6 z-10 font-mono text-xs uppercase tracking-[0.16em] text-[color:var(--amber-core)]">
        [WEBGL FIELD: {hoveredSection ?? 'NONE'}]
      </span>
      <SignalTerrainFieldWebGL onHoverSection={setHoveredSection} />
    </main>
  );
}
