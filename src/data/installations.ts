export type Installation = {
  id: string;
  identifier: string;
  title: string;
  image: string;
  imageAlt: string;
  paragraphs: string[];
  link: { label: string; href: string };
};

export const installations: Installation[] = [
  {
    id: 'void',
    identifier: '[VO|D]',
    title: 'VO|D',
    image: `${import.meta.env.BASE_URL}Installations/VOID.png`,
    imageAlt: 'VOID technical illustration',
    paragraphs: [
      'VOID started with a fairly simple obsession. What happened to the future we were promised? The strange machines, tactile interfaces and wonderfully impractical ideas that made technology feel like something worth getting excited about.',
      "It's an ongoing experiment in retro-futurist design, hardware and a bit of speculative fiction. An excuse to build things that probably belong in a science fiction film from 1982, but might still make sense today.",
      'Not exactly a rejection of modern technology. More of a love letter to a future that took a wrong turn somewhere.',
    ],
    link: { label: 'WEBSITE ↗', href: 'https://alinrudolf.github.io/void2-art/' },
  },
  {
    id: 'linea',
    identifier: '[LINEA]',
    title: 'LINEA',
    image: `${import.meta.env.BASE_URL}Installations/LINEA.png`,
    imageAlt: 'LINEA television, keyboard and speakers technical illustration',
    paragraphs: [
      'LINEA is what happens when a 1969 Italian television meets a Nokia E6-00 and someone decides they should probably be a computer.',
      'Inspired by the wonderfully optimistic world of midcentury science fiction and old Jonny Quest cartoons, it runs a custom version of Symbian I worked on back in my phone-modding days. Getting the picture onto the black-and-white CRT took an RF modulator, some soldering and a fair amount of stubbornness. The audio runs through a repurposed amplifier into a pair of 1970s spherical speakers.',
      "Everything is tucked inside the television, with no irreversible modifications to the original hardware. Even the phone's camera works as a peculiar little window into the machine itself.",
      "For a while, LINEA lived in my kitchen as a fully functional, Wi-Fi-connected terminal for movies, music, games and emails. Thoroughly impractical by modern standards, perhaps. But it made checking your inbox feel like something out of 1969's idea of the future.",
    ],
    link: { label: 'VIEW ON BUILDS.GG ↗', href: 'https://builds.gg/builds/lina-12641' },
  },
];

export const installationLabels = {
  previous: 'Previous installation',
  next: 'Next installation',
  description: 'Description',
  status: 'Selected installation',
};
