import type { ReactNode } from 'react';

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="h-dvh overflow-hidden bg-[color:var(--bg-crt)] px-[var(--shell-margin-x)] py-[var(--shell-margin-y)] text-[color:var(--amber-base)]">
      <div className="flex h-full min-h-0 w-full flex-col overflow-visible">
        {children}
      </div>
    </div>
  );
}
