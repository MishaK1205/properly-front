import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Language, LANGUAGES } from '../../../../shared/languages';
import { ProjectLanguage } from '../../project-language';

interface LanguageOption extends Language {
  readonly active: boolean;
  /** Whether this language still has required fields left empty. */
  readonly missing: boolean;
}

/** Picks the language every translated field in the dialog is bound to. */
@Component({
  selector: 'app-language-switcher',
  imports: [MatIconModule, MatTooltipModule],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcher {
  private readonly language = inject(ProjectLanguage);

  /** Languages missing input, flagged once a save was attempted. */
  readonly incomplete = input<ReadonlySet<Language['suffix']>>(new Set());

  protected readonly options = computed<readonly LanguageOption[]>(() => {
    const active = this.language.suffix();
    const incomplete = this.incomplete();

    return LANGUAGES.map((item) => ({
      ...item,
      active: item.suffix === active,
      missing: incomplete.has(item.suffix),
    }));
  });

  protected select(suffix: Language['suffix']): void {
    this.language.select(suffix);
  }
}
