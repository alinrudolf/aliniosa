export type WorkRecord = {
  id: string;
  label: string;
  value: string;
};

export const workPage = {
  label: 'Work',
  navigationLabel: 'Work chapters',
  documentLabel: 'Work chapter document',
  status: 'Indexed',
  summaryLabel: 'Summary',
  bodyLabel: 'Details',
  introduction: [
    'My work sits between complicated systems and the people expected to use them.',
    'I help decide what a product needs to do, how its parts fit together, and which problems are worth solving. The contexts change; the questions are often similar.',
  ],
};

export const workChapters = [
  {
    id: 'research', number: '01', title: 'AI & RESEARCH', organization: 'TOLUNA',
    introduction: 'Helping researchers work with data through conversation.',
    body: "At Toluna, I define conversational AI workflows for exploring survey data and assembling reports. Much of the work is about the boundaries: what the system can support with evidence, what it shouldn't infer, and how a useful suggestion becomes a concrete action.",
  },
  {
    id: 'creator-tools', number: '02', title: 'CREATOR TOOLS', organization: 'THE SANDBOX',
    introduction: 'Making production less cumbersome.',
    body: 'I worked on systems for creating, configuring, and publishing digital assets. The most meaningful improvements often came from reducing the number of steps or ways a process could fail. One production workflow that used to take days was brought down to hours.',
  },
  {
    id: 'early-stage', number: '03', title: 'EARLY-STAGE SYSTEMS', organization: 'TASKAST / QED BUILDERS',
    introduction: 'Testing ideas before treating them as products.',
    body: 'That has included AI agents reacting to live information and, more recently, forecasting what AI coding agents might need before they run. This work is about translating technical possibilities into specific use cases, constraints, and things that can actually be tested.',
  },
  {
    id: 'live-platforms', number: '04', title: 'LIVE PLATFORMS', organization: 'RAIN DIGITAL',
    introduction: 'Digital systems under real-world deadlines.',
    body: 'Earlier, I worked on live scoring, streaming, and content delivery for international tennis events. When an event is underway, reliability matters more than an elaborate feature set. That experience still informs how I approach products.',
  },
] as const;

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
