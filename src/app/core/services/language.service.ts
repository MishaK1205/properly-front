import { isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

import { DEFAULT_LANGUAGE, LANGUAGES } from '../data/languages.data';
import { LanguageCode, LanguageSuffix, LocalizedVariants } from '../models/language';

const STORAGE_KEY = 'properly.language';

/** Holds the language chosen in the header/footer switcher and resolves translated API fields. */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly current = signal<LanguageCode>(this.readStored());

  readonly language = this.current.asReadonly();

  /** Backend field suffix for the active language, e.g. `En` for `projectLocationEn`. */
  readonly suffix = computed<LanguageSuffix>(
    () => LANGUAGES.find((option) => option.code === this.current())?.suffix ?? 'En',
  );

  setLanguage(code: LanguageCode): void {
    this.current.set(code);
    if (this.isBrowser) {
      localStorage.setItem(STORAGE_KEY, code);
    }
  }

  /** Picks the variant matching the active language out of a backend field's three translations. */
  localize<T>(variants: LocalizedVariants<T>): T {
    return variants[this.suffix()];
  }

  private readStored(): LanguageCode {
    if (!this.isBrowser) {
      return DEFAULT_LANGUAGE;
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    return LANGUAGES.some((option) => option.code === stored)
      ? (stored as LanguageCode)
      : DEFAULT_LANGUAGE;
  }
}
