import { RenderMode, ServerRoute } from '@angular/ssr';
import { PROPERTIES } from './core/data/properties.data';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'property/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: () =>
      Promise.resolve(PROPERTIES.map((property) => ({ slug: property.slug }))),
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
