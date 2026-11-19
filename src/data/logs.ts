export const logsPage = {
  label: '[LOGS]',
  status: 'Coming soon',
  title: 'COMING SOON',
  summaryLabel: 'Summary',
  summary: 'Nothing here yet.',
  descriptionLabel: 'Description',
  description: 'This section will contain various writings and articles... once I get to writing them. :)',
};

export type LogRecord = {
  id: string;
  stamp: string;
  title: string;
  body: string;
};

export const logs: LogRecord[] = [
  {
    id: 'log-01',
    stamp: '2026.04',
    title: 'System Online',
    body: 'Initial public surface assembled around signals, references, and current operating state.',
  },
  {
    id: 'log-02',
    stamp: '2026.04',
    title: 'Constraint Locked',
    body: 'The interface favors fewer components, stronger hierarchy, and content that can be read without decoration.',
  },
];
