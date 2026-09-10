import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';

import { LANGUAGES } from '../../../../shared/languages';

/**
 * Editable list of cards that each hold a title, content and description in every language.
 * Used for the hero summary cards and the investment breakdown tiles.
 */
@Component({
  selector: 'app-translated-card-list',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTabsModule,
  ],
  templateUrl: './translated-card-list.html',
  styleUrl: './translated-card-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranslatedCardList {
  readonly cards = input.required<FormArray<FormGroup>>();

  /** Control name prefix, e.g. `investmentCard` for `investmentCardTitleEn`. */
  readonly controlBase = input.required<string>();

  /** Heading of a single card, numbered by the list, e.g. `Card 1`. */
  readonly itemLabel = input.required<string>();

  readonly addLabel = input.required<string>();

  /** Adding needs the matching form group builder, so the section handles it. */
  readonly add = output<void>();

  protected readonly languages = LANGUAGES;

  protected remove(index: number): void {
    this.cards().removeAt(index);
  }
}
