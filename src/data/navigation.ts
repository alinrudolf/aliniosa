import { routes } from '../app/routes';

export type NavigationItem = {
  id: keyof typeof routes;
  label: string;
  signal: number;
  href: string;
};

export const siteHeader = {
  section: '[HEADER]',
  label: 'personal system interface',
  title: 'ALIN IOSA',
  summary: 'Product manager / hardware builder',
  logoAlt: 'Alin Iosa amber mark',
};

export type SiteHeader = typeof siteHeader;

export const navPanelLabel = '[NAV]';
export const signalMonitorLabel = '[BODY]';

export const signalHoverLabels: Record<string, string> = {
  SYS: '[IDENTITY]',
  WRK: '[WORK]',
  INS: '[INSTALLATIONS]',
  LIB: '[LIBRARY]',
  LOG: '[LOGS]',
  CNT: '[CONTACT]',
};

export const navigation: NavigationItem[] = [
  { id: 'system', label: 'System', signal: 38, href: routes.system },
  { id: 'work', label: 'Work', signal: 61, href: routes.work },
  { id: 'installations', label: 'Installations', signal: 48, href: routes.installations },
  { id: 'library', label: 'Library', signal: 72, href: routes.library },
  { id: 'logs', label: 'Logs', signal: 54, href: routes.logs },
  { id: 'contact', label: 'Contact', signal: 66, href: routes.contact },
];

export type SignalNavigationItem = {
  id: string;
  title: string;
  action: string;
  href: string;
  y: number;
  amp: number;
  freq: number;
  phase: number;
};

export const signalNavigation: SignalNavigationItem[] = [
  { id: 'SYS', title: 'SYSTEM', action: 'VIEW IDENTITY', href: routes.system, y: 135, amp: 28, freq: 64, phase: 0.2 },
  { id: 'WRK', title: 'WORK', action: 'VIEW PROJECTS', href: routes.work, y: 190, amp: 34, freq: 52, phase: 1.1 },
  { id: 'INS', title: 'INSTALLATIONS', action: 'VIEW ARTIFACTS', href: routes.installations, y: 230, amp: 42, freq: 46, phase: 2.4 },
  { id: 'LIB', title: 'LIBRARY', action: 'VIEW FILMS', href: routes.library, y: 260, amp: 30, freq: 58, phase: 3.2 },
  { id: 'LOG', title: 'LOGS', action: 'READ NOTES', href: routes.logs, y: 295, amp: 38, freq: 50, phase: 4.1 },
  { id: 'CNT', title: 'CONTACT', action: 'OPEN CHANNEL', href: routes.contact, y: 325, amp: 24, freq: 70, phase: 5.0 },
];

export type BottomNavigationItem = {
  id: string;
  label: string;
  href: string;
  ariaLabel: string;
};

export const bottomNavigation: BottomNavigationItem[] = [
  { id: 'SYS', label: 'SYS', href: routes.system, ariaLabel: 'Navigate to system' },
  { id: 'WRK', label: 'WRK', href: routes.work, ariaLabel: 'Navigate to work' },
  { id: 'INS', label: 'INS', href: routes.installations, ariaLabel: 'Navigate to installations' },
  { id: 'LIB', label: 'LIB', href: routes.library, ariaLabel: 'Navigate to library' },
  { id: 'LOG', label: 'LOG', href: routes.logs, ariaLabel: 'Navigate to logs' },
  { id: 'CNT', label: 'CNT', href: routes.contact, ariaLabel: 'Navigate to contact' },
];
