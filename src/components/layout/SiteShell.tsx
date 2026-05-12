import type { ReactNode } from 'react';

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="h-dvh overflow-hidden bg-[color:var(--bg-crt)] px-[80px] py-10 text-[color:var(--amber-base)]">
      <div className="flex h-full min-h-0 w-full flex-col overflow-visible">
        {children}
      </div>
    </div>
  );
}
