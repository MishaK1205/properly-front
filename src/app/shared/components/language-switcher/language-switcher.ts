import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { LANGUAGES } from '../../../core/data/languages.data';
import { LanguageCode } from '../../../core/models/language';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcher {
  private readonly languageService = inject(LanguageService);

  /** 'light' for white surfaces (header), 'dark' for navy surfaces (footer). */
  readonly appearance = input<'light' | 'dark'>('light');

  protected readonly languages = LANGUAGES;
  protected readonly active = this.languageService.language;

  protected select(code: LanguageCode): void {
    this.languageService.setLanguage(code);
  }
}
