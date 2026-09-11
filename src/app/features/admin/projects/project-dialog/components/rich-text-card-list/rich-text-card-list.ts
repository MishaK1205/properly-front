import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { TranslatedRichText } from '../translated-rich-text/translated-rich-text';

/**
 * Editable list of cards that each hold one rich text body per language, of which the language
 * being edited is shown. Used for the hero summary cards, the investment breakdown and the
 * apartment highlights, where the heading is part of the content.
 */
@Component({
  selector: 'app-rich-text-card-list',
  imports: [MatButtonModule, MatIconModule, TranslatedRichText],
  templateUrl: './rich-text-card-list.html',
  styleUrl: './rich-text-card-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RichTextCardList {
  readonly cards = input.required<FormArray<FormGroup>>();

  /** Control name without the language suffix, e.g. `investmentCardContent`. */
  readonly base = input.required<string>();

  /** Heading of a single card, numbered by the list, e.g. `Card 1`. */
  readonly itemLabel = input.required<string>();

  readonly addLabel = input.required<string>();

  readonly placeholder = input('');

  /** Adding needs the matching form group builder, so the section handles it. */
  readonly add = output<void>();

  protected remove(index: number): void {
    this.cards().removeAt(index);
  }
}
