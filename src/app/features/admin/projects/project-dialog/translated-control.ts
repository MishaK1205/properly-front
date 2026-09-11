import { FormControl, FormGroup } from '@angular/forms';

import { Language } from '../../shared/languages';

/**
 * The `{base}{suffix}` control of a translated field, e.g. `projectLocationEn`.
 *
 * Translated fields follow the language switcher, so the control behind an input changes while
 * the input stays. That rules out `formControlName`, which keeps the control it was set up with:
 * the components bind the control itself through `[formControl]` instead.
 */
export function translatedControl<T>(
  group: FormGroup,
  base: string,
  suffix: Language['suffix'],
): FormControl<T> {
  const control = group.get(`${base}${suffix}`);

  if (!(control instanceof FormControl)) {
    throw new Error(`The form has no translated control named "${base}${suffix}".`);
  }
  return control as FormControl<T>;
}
