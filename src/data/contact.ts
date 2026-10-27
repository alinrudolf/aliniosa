export const contactPage = {
  label: '[CONTACT]',
  title: 'Contact',
  status: 'Open',
  artwork: {
    globe: `${import.meta.env.BASE_URL}assets/contact/globe-static.png`,
    computer: `${import.meta.env.BASE_URL}assets/contact/computer-phone.png`,
  },
};

export const contactLinks = [
  {
    id: 'linkedin',
    number: '01',
    title: 'LINKEDIN',
    subtitle: 'Get in touch.',
    href: 'https://www.linkedin.com/in/alin-iosa',
    external: true,
    accessibleName: 'LinkedIn — Get in touch (opens in a new tab)',
    arrow: '↗',
  },
  {
    id: 'builds',
    number: '02',
    title: 'BUILDS.GG',
    subtitle: 'Hardware projects and experiments.',
    href: 'https://builds.gg/users/rud-22248',
    external: true,
    accessibleName: 'Builds.gg — Hardware projects and experiments (opens in a new tab)',
    arrow: '↗',
  },
  {
    id: 'cv',
    number: '03',
    title: 'CURRICULUM VITAE',
    subtitle: 'PDF / Download',
    href: `${import.meta.env.BASE_URL}Curriculum%20Vitae.pdf`,
    external: false,
    accessibleName: 'Download Curriculum Vitae (PDF)',
    arrow: '↓',
  },
] as const;
