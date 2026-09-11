import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { RichTextEditor } from '../../../../shared/rich-text-editor/rich-text-editor';
import { ProjectLanguage } from '../../project-language';
import { translatedControl } from '../../translated-control';

/** Rich text editor bound to the `{base}Ge|En|Ru` control of the language being edited. */
@Component({
  selector: 'app-translated-rich-text',
  imports: [ReactiveFormsModule, RichTextEditor],
  templateUrl: './translated-rich-text.html',
  styleUrl: './translated-rich-text.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranslatedRichText {
  private readonly language = inject(ProjectLanguage);

  /** Group holding the controls: the whole form, or one card of a list. */
  readonly group = input.required<FormGroup>();

  /** Control name without the language suffix, e.g. `projectDescription`. */
  readonly base = input.required<string>();

  readonly label = input.required<string>();
  readonly placeholder = input('');

  protected readonly control = computed(() =>
    translatedControl<string>(this.group(), this.base(), this.language.suffix()),
  );
}
