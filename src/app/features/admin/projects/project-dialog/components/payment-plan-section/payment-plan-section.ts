import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';

import { LANGUAGES } from '../../../../shared/languages';
import { buildPaymentPlan, ProjectForm } from '../../project-form';
import { ChipListTabs } from '../chip-list-tabs/chip-list-tabs';

/** "The Property" → Payment Plan tab: the stage table and the notes under it. */
@Component({
  selector: 'app-payment-plan-section',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTabsModule,
    ChipListTabs,
  ],
  templateUrl: './payment-plan-section.html',
  styleUrl: './payment-plan-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentPlanSection {
  readonly form = input.required<ProjectForm>();
  readonly expandAll = input(false);

  protected readonly languages = LANGUAGES;
  protected readonly expanded = signal(false);
  protected readonly paymentPlans = computed(() => this.form().controls.paymentPlans);

  protected addPaymentPlan(): void {
    this.paymentPlans().push(buildPaymentPlan());
  }

  protected removePaymentPlan(index: number): void {
    this.paymentPlans().removeAt(index);
  }
}
