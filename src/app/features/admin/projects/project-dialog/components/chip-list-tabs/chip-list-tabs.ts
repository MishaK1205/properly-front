import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';

import { ChipListInput } from '../../../../shared/chip-list-input/chip-list-input';
import { LANGUAGES } from '../../../../shared/languages';

/** One chip list per language, for a `{controlBase}Ge|En|Ru` set of string array controls. */
@Component({
  selector: 'app-chip-list-tabs',
  imports: [ReactiveFormsModule, MatTabsModule, ChipListInput],
  templateUrl: './chip-list-tabs.html',
  styleUrl: './chip-list-tabs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipListTabs {
  /** Group holding the controls, i.e. the whole project form. */
  readonly group = input.required<FormGroup>();

  /** Control name prefix, e.g. `projectAdvantages` for `projectAdvantagesEn`. */
  readonly controlBase = input.required<string>();

  readonly label = input.required<string>();
  readonly placeholder = input.required<string>();

  protected readonly languages = LANGUAGES;
}
