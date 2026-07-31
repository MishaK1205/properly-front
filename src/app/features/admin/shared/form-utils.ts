import { HttpErrorResponse } from '@angular/common/http';
import {
  AbstractControl,
  FormArray,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

import { LANGUAGES } from './languages';

/** How many field names an error message lists before collapsing the rest into a count. */
const MAX_LISTED_FIELDS = 8;

/**
 * The backend trims strings before its own required check, so whitespace-only input passes
 * validation there and then fails at the database layer. Reject it here instead.
 */
export const notBlank: ValidatorFn = (control: AbstractControl): ValidationErrors | null =>
  typeof control.value === 'string' && control.value.trim() === '' ? { required: true } : null;

/** The backend rejects blank strings, so whitespace-only input must not slip through. */
export function deepTrim<T>(value: T): T {
  if (typeof value === 'string') {
    return value.trim() as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => deepTrim(item)) as T;
  }
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, deepTrim(item)]),
    ) as T;
  }
  return value;
}

/** `projectLocationGe` -> `Project location (Georgian)`. */
export function humanizeField(name: string): string {
  const match = /^(.*?)(Ge|En|Ru)$/.exec(name);
  const base = match ? match[1] : name;
  const words = base
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .toLowerCase();
  const label = words.charAt(0).toUpperCase() + words.slice(1);
  const language = match ? LANGUAGES.find((item) => item.suffix === match[2]) : undefined;
  return language ? `${label} (${language.label})` : label;
}

export function backendMessage(error: unknown): string | null {
  if (!(error instanceof HttpErrorResponse)) {
    return null;
  }
  const message = (error.error as { message?: string | string[] } | null)?.message;
  if (Array.isArray(message)) {
    return message.join('; ');
  }
  return typeof message === 'string' ? message : null;
}

/** Human-readable names of every invalid control, so nothing stays hidden in a collapsed panel or tab. */
export function invalidFieldLabels(group: FormGroup): string[] {
  const labels: string[] = [];

  const visit = (control: AbstractControl, name: string, prefix: string): void => {
    if (control.valid) {
      return;
    }
    if (control instanceof FormGroup) {
      for (const [key, child] of Object.entries(control.controls)) {
        visit(child, key, prefix);
      }
      return;
    }
    if (control instanceof FormArray) {
      control.controls.forEach((child, index) => {
        visit(child, name, `${humanizeField(name)} ${index + 1}: `);
      });
      return;
    }
    labels.push(`${prefix}${humanizeField(name)}`);
  };

  for (const [key, control] of Object.entries(group.controls)) {
    visit(control, key, '');
  }
  return labels;
}

/** Message naming the fields that block submission, so a failed click is never silent. */
export function missingFieldsMessage(group: FormGroup): string {
  const missing = invalidFieldLabels(group);
  const shown = missing.slice(0, MAX_LISTED_FIELDS).join(', ');
  const rest = missing.length - MAX_LISTED_FIELDS;
  return `Please fill the required fields: ${shown}${rest > 0 ? ` and ${rest} more` : ''}.`;
}
