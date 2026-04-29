export const routes = {
  system: '#system',
  work: '#work',
  installations: '#installations',
  library: '#library',
  logs: '#logs',
  contact: '#contact',
} as const;

export type RouteKey = keyof typeof routes;
