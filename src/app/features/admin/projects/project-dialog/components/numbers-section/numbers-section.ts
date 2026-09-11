import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { buildInvestmentCard, ProjectForm } from '../../project-form';
import { FieldGroup } from '../field-group/field-group';
import { RichTextCardList } from '../rich-text-card-list/rich-text-card-list';

/** "The Numbers" section: the investment breakdown grid. */
@Component({
  selector: 'app-numbers-section',
  imports: [FieldGroup, RichTextCardList],
  templateUrl: './numbers-section.html',
  styleUrl: './numbers-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumbersSection {
  readonly form = input.required<ProjectForm>();

  protected readonly investmentCards = computed(() => this.form().controls.investmentCards);

  protected addInvestmentCard(): void {
    this.investmentCards().push(buildInvestmentCard());
  }
}
