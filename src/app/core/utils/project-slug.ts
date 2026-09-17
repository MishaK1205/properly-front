import { ProjectResponse } from '../models/api.models';

/** Mongo ObjectId: 24 hex characters. Used to keep old `/property/<id>` links working. */
const OBJECT_ID_PATTERN = /^[0-9a-f]{24}$/i;

/**
 * Turns free text into a URL-friendly slug: lower-cased, diacritics stripped,
 * and every run of non-letter/non-digit characters collapsed into a single dash.
 * Unicode letters are kept so non-Latin names still produce a readable slug.
 */
export function slugify(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

/** The URL segment for a project's detail page; falls back to the id if the name yields no slug. */
export function projectSlug(project: Pick<ProjectResponse, '_id' | 'projectName'>): string {
  return slugify(project.projectName) || project._id;
}

export function isProjectId(value: string): boolean {
  return OBJECT_ID_PATTERN.test(value);
}

/**
 * Resolves the `/property/:slug` segment to a project id.
 * Accepts either a raw id (legacy links) or a name slug matched against the known projects.
 */
export function resolveProjectId(
  slug: string,
  projects: readonly ProjectResponse[] | undefined,
): string | undefined {
  if (isProjectId(slug)) {
    return slug;
  }
  return projects?.find((project) => projectSlug(project) === slug)?._id;
}
