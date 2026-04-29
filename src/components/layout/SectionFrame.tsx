import type { ReactNode } from 'react';

type SectionFrameProps = {
  children: ReactNode;
};

export function SectionFrame({ children }: SectionFrameProps) {
  return <main className="grid gap-4">{children}</main>;
}
