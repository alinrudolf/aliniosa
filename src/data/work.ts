export type WorkRecord = {
  id: string;
  label: string;
  value: string;
};

export const systemRecords: WorkRecord[] = [
  {
    id: 'system-01',
    label: 'Identity',
    value: 'Alin Rudolf Iosa. Builder of software, interfaces, and structured personal systems.',
  },
  {
    id: 'system-02',
    label: 'Principle',
    value: 'Structure first, clarity second, interaction only when it carries state.',
  },
];

export const workRecords: WorkRecord[] = [
  {
    id: 'work-01',
    label: 'Current Vector',
    value: 'Building software systems with an emphasis on clear interfaces, durable structure, and human-readable behavior.',
  },
  {
    id: 'work-02',
    label: 'Operating Mode',
    value: 'Product engineering, interface design, system thinking, and careful execution across the stack.',
  },
  {
    id: 'work-03',
    label: 'Output',
    value: 'Applications, internal tools, experimental interfaces, and written notes that make complex work easier to inspect.',
  },
];

export const contactRecords: WorkRecord[] = [
  {
    id: 'contact-01',
    label: 'Signal',
    value: 'Available for focused product engineering, interface systems, and technical collaboration.',
  },
  {
    id: 'contact-02',
    label: 'Protocol',
    value: 'Send a concise message with context, constraints, and the next decision that needs to be made.',
  },
];

export const homepageModules = {
  system: {
    moduleId: 'SYS-00',
    status: 'online',
    title: 'Readable state for a person, exposed as a restrained machine interface.',
    command: 'work',
  },
  work: {
    moduleId: 'WRK-01',
    status: 'active',
    title: 'Work signals',
    command: 'installations',
  },
  installations: {
    moduleId: 'INS-02',
    status: 'indexed',
    title: 'Installations',
    command: 'library',
    label: 'Running Set',
  },
  library: {
    moduleId: 'LIB-03',
    status: 'available',
    title: 'Library reference layer',
    command: 'logs',
    label: 'Movies',
  },
  logs: {
    moduleId: 'LOG-04',
    status: 'recording',
    title: 'System logs',
    command: 'contact',
    label: 'Recent Entries',
  },
  contact: {
    moduleId: 'CON-05',
    status: 'open',
    title: 'Contact',
    command: 'mailto:contact@example.com',
  },
} as const;
