import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

export type Language = 'EN' | 'RU';

const LANGUAGES: readonly Language[] = ['EN', 'RU'];

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcher {
  /** 'light' for white surfaces (header), 'dark' for navy surfaces (footer). */
  readonly appearance = input<'light' | 'dark'>('light');
  readonly language = model<Language>('EN');

  protected readonly languages = LANGUAGES;
}
