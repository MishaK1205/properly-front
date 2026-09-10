import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

import { buildInvestmentCard, ProjectForm } from '../../project-form';
import { TranslatedCardList } from '../translated-card-list/translated-card-list';

/** "The Numbers" section: the investment breakdown grid. */
@Component({
  selector: 'app-numbers-section',
  imports: [MatExpansionModule, MatIconModule, TranslatedCardList],
  templateUrl: './numbers-section.html',
  styleUrl: './numbers-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumbersSection {
  readonly form = input.required<ProjectForm>();
  readonly expandAll = input(false);

  protected readonly expanded = signal(false);
  protected readonly investmentCards = computed(() => this.form().controls.investmentCards);

  protected addInvestmentCard(): void {
    this.investmentCards().push(buildInvestmentCard());
  }
}
