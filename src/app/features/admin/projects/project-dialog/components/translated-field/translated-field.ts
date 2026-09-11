import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ProjectLanguage } from '../../project-language';
import { translatedControl } from '../../translated-control';

/** Text field bound to the `{base}Ge|En|Ru` control of the language being edited. */
@Component({
  selector: 'app-translated-field',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './translated-field.html',
  styleUrl: './translated-field.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranslatedField {
  private readonly language = inject(ProjectLanguage);

  /** Group holding the controls: the whole form, or one row of a list. */
  readonly group = input.required<FormGroup>();

  /** Control name without the language suffix, e.g. `projectLocation`. */
  readonly base = input.required<string>();

  readonly label = input.required<string>();
  readonly placeholder = input('');

  /** Renders a textarea instead of a single-line input. */
  readonly multiline = input(false, { transform: booleanAttribute });

  protected readonly control = computed(() =>
    translatedControl<string>(this.group(), this.base(), this.language.suffix()),
  );
}
