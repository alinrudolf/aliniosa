import type { ReactNode } from 'react';

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="min-h-screen bg-[color:var(--bg-crt)] text-[color:var(--amber-base)]">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-10 sm:px-8 lg:px-10">
        {children}
      </div>
    </div>
  );
}
