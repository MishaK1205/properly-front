import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Property pages are browser-only: their content comes from the live projects API.
  {
    path: 'property/:id',
    renderMode: RenderMode.Client,
  },
  // Admin area is browser-only: it depends on localStorage auth and live API data.
  {
    path: 'admin',
    renderMode: RenderMode.Client,
  },
  {
    path: 'admin/**',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
