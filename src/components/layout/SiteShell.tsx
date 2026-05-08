import type { ReactNode } from 'react';

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="h-dvh overflow-hidden bg-[color:var(--bg-crt)] p-12 text-[color:var(--amber-base)]">
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-12">
        {children}
      </div>
    </div>
  );
}
