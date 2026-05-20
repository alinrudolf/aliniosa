type SystemCommandProps = {
  command: string;
};

export function SystemCommand({ command }: SystemCommandProps) {
  return (
    <a
      className="inline-flex w-fit border border-[color:var(--amber-dim)] px-[var(--space-3)] py-[var(--space-2)] font-mono text-[length:var(--font-xs)] uppercase tracking-[0.16em] text-[color:var(--amber-core)] transition-colors duration-100 hover:border-[color:var(--amber-core)] hover:text-[color:var(--amber-base)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--amber-core)]"
      href={command.startsWith('mailto:') ? command : `#${command}`}
    >
      {command}
    </a>
  );
}
