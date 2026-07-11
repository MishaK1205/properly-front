export interface AdminNavLink {
  readonly label: string;
  readonly icon: string;
  readonly path: string;
}

export const ADMIN_NAV_LINKS: readonly AdminNavLink[] = [
  { label: 'Companies', icon: 'domain', path: '/admin/companies' },
  { label: 'Projects', icon: 'location_city', path: '/admin/projects' },
  { label: 'Filled Applications', icon: 'assignment_turned_in', path: '/admin/applications' },
];
