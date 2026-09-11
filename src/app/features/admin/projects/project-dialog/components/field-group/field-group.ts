import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ProjectLanguage } from '../../project-language';

/**
 * One titled block of fields inside a step. The explanation of what the block fills in on the
 * property page lives in a tooltip, so the form itself stays readable.
 */
@Component({
  selector: 'app-field-group',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './field-group.html',
  styleUrl: './field-group.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldGroup {
  protected readonly language = inject(ProjectLanguage);

  readonly label = input.required<string>();

  /** Where the block shows up on the property page, shown in the tooltip. */
  readonly help = input('');

  /** Marks a block holding text in the language picked in the dialog header. */
  readonly translated = input(false, { transform: booleanAttribute });

  protected readonly languageHelp = computed(
    () =>
      `Holds translated text. You are editing the ${this.language.current().label} version — switch language in the dialog header.`,
  );
}
