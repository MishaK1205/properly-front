import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { LANGUAGES } from '../../../../shared/languages';
import { RichTextEditor } from '../../../../shared/rich-text-editor/rich-text-editor';

/**
 * Editable list of cards that each hold one rich text body per language. Used for the hero
 * summary cards and the investment breakdown, where the heading is part of the content.
 */
@Component({
  selector: 'app-rich-text-card-list',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    RichTextEditor,
  ],
  templateUrl: './rich-text-card-list.html',
  styleUrl: './rich-text-card-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RichTextCardList {
  readonly cards = input.required<FormArray<FormGroup>>();

  /** Control name prefix, e.g. `projectDescriptionCard` for `projectDescriptionCardContentEn`. */
  readonly controlBase = input.required<string>();

  /** Heading of a single card, numbered by the list, e.g. `Card 1`. */
  readonly itemLabel = input.required<string>();

  readonly addLabel = input.required<string>();

  readonly placeholder = input('');

  /** Adding needs the matching form group builder, so the section handles it. */
  readonly add = output<void>();

  protected readonly languages = LANGUAGES;

  protected remove(index: number): void {
    this.cards().removeAt(index);
  }
}
