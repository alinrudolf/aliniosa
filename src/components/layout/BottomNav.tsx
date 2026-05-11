import { useEffect, useRef, useState } from 'react';
import cntIcon from '../../assets/icons/CNT.svg?raw';
import insIcon from '../../assets/icons/INS.svg?raw';
import libIcon from '../../assets/icons/LIB.svg?raw';
import logIcon from '../../assets/icons/LOG.svg?raw';
import sysIcon from '../../assets/icons/SYS.svg?raw';
import wrkIcon from '../../assets/icons/WRK.svg?raw';
import { bottomNavigation, navPanelLabel } from '../../data/navigation';

const icons: Record<string, string> = {
  SYS: sysIcon,
  WRK: wrkIcon,
  INS: insIcon,
  LIB: libIcon,
  LOG: logIcon,
  CNT: cntIcon,
};

const BACKGROUND_AUDIO_SRC = '/audio/bg-audio.mp3';
const BACKGROUND_AUDIO_STORAGE_KEY = 'backgroundAudioEnabled';

function storeBackgroundAudioPreference(isEnabled: boolean) {
  try {
    localStorage.setItem(BACKGROUND_AUDIO_STORAGE_KEY, String(isEnabled));
  } catch {
    // Audio preference persistence is optional.
  }
}

type BottomNavProps = {
  activeNavId?: string | null;
  onActiveNavClick: () => void;
  onActiveNavChange: (id: string | null) => void;
};

export function BottomNav({ activeNavId = null, onActiveNavClick, onActiveNavChange }: BottomNavProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const toggleBackgroundAudio = async () => {
    if (isAudioEnabled) {
      audioRef.current?.pause();
      storeBackgroundAudioPreference(false);
      setIsAudioEnabled(false);

      return;
    }

    const audio = audioRef.current ?? new Audio(BACKGROUND_AUDIO_SRC);

    audioRef.current = audio;
    audio.loop = true;
    audio.volume = 0.1;

    try {
      await audio.play();
      storeBackgroundAudioPreference(true);
      setIsAudioEnabled(true);
    } catch {
      audio.pause();
      storeBackgroundAudioPreference(false);
      setIsAudioEnabled(false);
    }
  };

  return (
    <section className="relative grid h-40 shrink-0 place-items-center overflow-visible border border-[color:var(--amber-dim)] bg-[color:var(--bg-crt)] p-6">
      <span className="absolute right-8 top-0 -translate-y-1/2 bg-[color:var(--bg-crt)] px-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[color:var(--amber-core)]">
        {navPanelLabel}
      </span>
      <button
        type="button"
        aria-label={isAudioEnabled ? 'Disable background audio' : 'Enable background audio'}
        aria-pressed={isAudioEnabled}
        onClick={toggleBackgroundAudio}
        className="absolute left-8 top-0 grid h-8 w-8 -translate-y-1/2 place-items-center bg-[color:var(--bg-crt)] px-2 text-[color:var(--amber-base)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--amber-core)]"
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-auto w-4">
          {isAudioEnabled ? (
            <>
              <path d="M22 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
              <path d="M18 16V16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
              <path d="M20 6V6.01" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
              <path d="M18 8V8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
              <path d="M20 18V18.01" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
            </>
          ) : null}
          <path d="M8 6V6.01" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
          <path d="M8 18V18.01" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
          <path d="M10 4H13V20H10" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
          <path d="M6 8H2V16H6" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
        </svg>
      </button>
      <nav aria-label="Primary navigation" className="grid grid-cols-3 gap-4">
        {bottomNavigation.map((item) => {
          const isActive = item.id === activeNavId;
          const buttonStateClass = isActive
            ? 'border-[color:var(--amber-base)]'
            : 'border-[color:var(--amber-base)] hover:border-[color:var(--amber-core)]';
          const iconStateClass = isActive
            ? 'bg-[color:var(--amber-base)] text-[color:var(--bg-crt)] group-hover:bg-[color:var(--amber-core)] group-focus-visible:bg-[color:var(--amber-core)]'
            : 'bg-[color:var(--bg-crt)] text-[color:var(--amber-base)] group-hover:text-[color:var(--amber-core)] group-focus-visible:text-[color:var(--amber-core)]';
          const labelStateClass = isActive
            ? 'bg-[color:var(--bg-crt)] text-[color:var(--amber-base)] group-hover:text-[color:var(--amber-core)] group-focus-visible:text-[color:var(--amber-core)]'
            : 'bg-[color:var(--amber-base)] text-[color:var(--bg-crt)] group-hover:bg-[color:var(--amber-core)] group-focus-visible:bg-[color:var(--amber-core)]';

          return (
            <a
              key={item.id}
              href={item.href}
              aria-label={item.ariaLabel}
              aria-current={isActive ? 'page' : undefined}
              onClick={(event) => {
                if (!isActive) {
                  return;
                }

                event.preventDefault();
                onActiveNavClick();
              }}
              onMouseEnter={() => onActiveNavChange(item.id)}
              onMouseLeave={() => onActiveNavChange(null)}
              onFocus={() => onActiveNavChange(item.id)}
              onBlur={() => onActiveNavChange(null)}
              className={`group grid w-fit grid-cols-[auto_auto] overflow-hidden rounded-md border bg-[color:var(--bg-crt)] font-mono transition-colors duration-100 focus-visible:border-[color:var(--amber-core)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--amber-core)] ${buttonStateClass}`}
            >
              <span
                className={`flex items-center justify-center border-r border-[color:var(--bg-crt)] p-2 transition-colors duration-100 [&>svg]:block [&>svg]:h-auto [&>svg]:w-4 ${iconStateClass}`}
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: icons[item.id] }}
              />
              <span
                className={`flex items-center justify-center px-4 text-base font-semibold uppercase leading-none tracking-[0.08em] transition-colors duration-100 ${labelStateClass}`}
              >
                {item.label}
              </span>
            </a>
          );
        })}
      </nav>
    </section>
  );
}
