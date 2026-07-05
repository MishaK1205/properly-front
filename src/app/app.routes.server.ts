import { RenderMode, ServerRoute } from '@angular/ssr';
import { PROPERTIES } from './core/data/properties.data';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'property/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: () =>
      Promise.resolve(PROPERTIES.map((property) => ({ slug: property.slug }))),
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
