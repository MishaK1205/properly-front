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

/**
 * The backend rejects blank strings for optional fields, so a field left empty must be sent as
 * `null` (clears the stored value) rather than as `''`.
 */
export function textOrNull(value: string | null | undefined): string | null {
  const trimmed = (value ?? '').trim();
  return trimmed.length > 0 ? trimmed : null;
}

/** Drops `null` values, used when creating a document where there is nothing to clear yet. */
export function withoutNulls<T extends object>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== null),
  ) as T;
}

/**
 * Nested backend objects require every field inside them, so a partially filled group is invalid:
 * fill all of it, or leave all of it empty and it is left out of the payload.
 */
export const allOrNothing: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!(control instanceof FormGroup)) {
    return null;
  }
  const values: unknown[] = Object.values(control.controls).map((child) => child.value);
  const filled = values.filter((value) =>
    typeof value === 'string' ? value.trim().length > 0 : value !== null && value !== undefined,
  ).length;
  return filled === 0 || filled === values.length ? null : { incomplete: true };
};

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
      // A group can be invalid on its own (e.g. partially filled), with every child still valid.
      if (control.errors) {
        labels.push(`${prefix}${humanizeField(name)}`);
      }
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

/**
 * Message naming the fields that block submission, so a failed click is never silent.
 * `extraLabels` covers inputs that live outside the form, such as the image uploaders.
 */
export function missingFieldsMessage(
  group: FormGroup,
  extraLabels: readonly string[] = [],
): string {
  const missing = [...extraLabels, ...invalidFieldLabels(group)];
  const shown = missing.slice(0, MAX_LISTED_FIELDS).join(', ');
  const rest = missing.length - MAX_LISTED_FIELDS;
  return `Please fill the required fields: ${shown}${rest > 0 ? ` and ${rest} more` : ''}.`;
}
