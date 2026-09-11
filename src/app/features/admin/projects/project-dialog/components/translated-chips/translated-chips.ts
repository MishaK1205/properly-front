import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ChipListInput } from '../../../../shared/chip-list-input/chip-list-input';
import { ProjectLanguage } from '../../project-language';
import { translatedControl } from '../../translated-control';

/** Chip list bound to the `{base}Ge|En|Ru` control of the language being edited. */
@Component({
  selector: 'app-translated-chips',
  imports: [ReactiveFormsModule, ChipListInput],
  templateUrl: './translated-chips.html',
  styleUrl: './translated-chips.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranslatedChips {
  private readonly language = inject(ProjectLanguage);

  /** Group holding the controls, i.e. the whole project form. */
  readonly group = input.required<FormGroup>();

  /** Control name without the language suffix, e.g. `projectAdvantages`. */
  readonly base = input.required<string>();

  readonly label = input.required<string>();
  readonly placeholder = input.required<string>();

  protected readonly control = computed(() =>
    translatedControl<string[]>(this.group(), this.base(), this.language.suffix()),
  );
}
