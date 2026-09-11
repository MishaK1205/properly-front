import { computed, Injectable, signal } from '@angular/core';

import { Language, LANGUAGES } from '../../shared/languages';

/**
 * The language the project dialog is currently editing. One switcher in the dialog header
 * drives every translated field, so each field is shown once instead of once per language.
 * Provided by the dialog itself, so a newly opened dialog starts on the first language again.
 */
@Injectable()
export class ProjectLanguage {
  private readonly active = signal<Language>(LANGUAGES[0]);

  readonly current = this.active.asReadonly();

  /** Suffix of the control names to bind, e.g. `En` for `projectLocationEn`. */
  readonly suffix = computed(() => this.active().suffix);

  select(suffix: Language['suffix']): void {
    const language = LANGUAGES.find((candidate) => candidate.suffix === suffix);
    if (language) {
      this.active.set(language);
    }
  }
}
