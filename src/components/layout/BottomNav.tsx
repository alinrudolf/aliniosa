import cntIcon from '../../assets/icons/CNT.svg?raw';
import insIcon from '../../assets/icons/INS.svg?raw';
import libIcon from '../../assets/icons/LIB.svg?raw';
import logIcon from '../../assets/icons/LOG.svg?raw';
import sysIcon from '../../assets/icons/SYS.svg?raw';
import wrkIcon from '../../assets/icons/WRK.svg?raw';
import { bottomNavigation } from '../../data/navigation';

const icons: Record<string, string> = {
  SYS: sysIcon,
  WRK: wrkIcon,
  INS: insIcon,
  LIB: libIcon,
  LOG: logIcon,
  CNT: cntIcon,
};

type BottomNavProps = {
  onActiveNavChange: (id: string | null) => void;
};

export function BottomNav({ onActiveNavChange }: BottomNavProps) {
  return (
    <nav aria-label="Bottom navigation" className="flex shrink-0 flex-wrap justify-center gap-6">
      {bottomNavigation.map((item) => (
        <a
          key={item.id}
          href={item.href}
          aria-label={item.ariaLabel}
          onMouseEnter={() => onActiveNavChange(item.id)}
          onMouseLeave={() => onActiveNavChange(null)}
          onFocus={() => onActiveNavChange(item.id)}
          onBlur={() => onActiveNavChange(null)}
          className="group grid h-11 w-28 grid-cols-[44px_1fr] overflow-hidden rounded-md border border-[color:var(--amber-base)] bg-[color:var(--bg-crt)] font-mono transition-[border-color,filter] duration-100 hover:border-[color:var(--amber-core)] hover:[filter:var(--glow-svg)] focus-visible:border-[color:var(--amber-core)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--amber-core)] focus-visible:[filter:var(--glow-svg)]"
        >
          <span
            className="flex h-full items-center justify-center border-r border-[color:var(--bg-crt)] bg-[color:var(--bg-crt)] text-[color:var(--amber-base)] transition-colors duration-100 group-hover:bg-[color:var(--amber-core)] group-hover:text-[color:var(--bg-crt)] group-focus-visible:bg-[color:var(--amber-core)] group-focus-visible:text-[color:var(--bg-crt)] [&>svg]:block [&>svg]:h-6 [&>svg]:w-6"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: icons[item.id] }}
          />
          <span className="flex h-full min-w-0 items-center justify-center bg-[color:var(--amber-base)] text-base font-semibold uppercase leading-none tracking-[0.08em] text-[color:var(--bg-crt)] transition-colors duration-100 group-hover:bg-[color:var(--bg-crt)] group-hover:text-[color:var(--amber-core)] group-focus-visible:bg-[color:var(--bg-crt)] group-focus-visible:text-[color:var(--amber-core)]">
            {item.label}
          </span>
        </a>
      ))}
    </nav>
  );
}
