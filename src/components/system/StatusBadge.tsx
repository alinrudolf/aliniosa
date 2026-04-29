type StatusBadgeProps = {
  status: string;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[color:var(--amber-core)] [text-shadow:var(--glow-text-soft)]">
      {status}
    </span>
  );
}
