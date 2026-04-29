export type Installation = {
  id: string;
  title: string;
  status: 'active' | 'archived' | 'standby';
  details: string;
};

export const installations: Installation[] = [
  {
    id: 'inst-01',
    title: 'Interface Studies',
    status: 'active',
    details: 'Small visual systems exploring constraint, repetition, signal density, and legible control surfaces.',
  },
  {
    id: 'inst-02',
    title: 'Personal Infrastructure',
    status: 'standby',
    details: 'Local workflows, notes, and software rituals tuned for sustained work instead of constant context switching.',
  },
];
