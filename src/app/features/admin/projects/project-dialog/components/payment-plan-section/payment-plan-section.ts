import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { buildPaymentPlan, ProjectForm } from '../../project-form';
import { FieldGroup } from '../field-group/field-group';
import { TranslatedChips } from '../translated-chips/translated-chips';
import { TranslatedField } from '../translated-field/translated-field';

/** "The Property" → Payment Plan tab: the stage table and the notes under it. */
@Component({
  selector: 'app-payment-plan-section',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FieldGroup,
    TranslatedChips,
    TranslatedField,
  ],
  templateUrl: './payment-plan-section.html',
  styleUrl: './payment-plan-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentPlanSection {
  readonly form = input.required<ProjectForm>();

  protected readonly paymentPlans = computed(() => this.form().controls.paymentPlans);

  protected addPaymentPlan(): void {
    this.paymentPlans().push(buildPaymentPlan());
  }

  protected removePaymentPlan(index: number): void {
    this.paymentPlans().removeAt(index);
  }
}
