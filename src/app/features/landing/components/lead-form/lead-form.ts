import { ChangeDetectionStrategy, Component, input, linkedSignal, signal } from '@angular/core';
import {
  BUDGET_OPTIONS,
  PURPOSE_OPTIONS,
  TIMELINE_OPTIONS,
  WHATSAPP_URL,
} from '../../../../core/data/site.data';
import { Button } from '../../../../shared/components/button/button';
import { SectionHeading } from '../../../../shared/components/section-heading/section-heading';
import { SelectInput } from '../../../../shared/components/select-input/select-input';
import { TextInput } from '../../../../shared/components/text-input/text-input';
import { FORM_PROPERTY_HINT, FORM_TRUST_ITEMS } from '../../landing.data';

@Component({
  selector: 'app-lead-form',
  imports: [Button, SectionHeading, SelectInput, TextInput],
  templateUrl: './lead-form.html',
  styleUrl: './lead-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeadForm {
  /** Names of the shortlist properties, shown in the property dropdown. */
  readonly propertyNames = input.required<readonly string[]>();
  /** Set when the user clicks "I'm Interested" on a property card. */
  readonly preselectedProperty = input('');

  protected readonly propertyHint = FORM_PROPERTY_HINT;
  protected readonly budgetOptions = BUDGET_OPTIONS;
  protected readonly purposeOptions = PURPOSE_OPTIONS;
  protected readonly timelineOptions = TIMELINE_OPTIONS;
  protected readonly trustItems = FORM_TRUST_ITEMS;
  protected readonly whatsappUrl = WHATSAPP_URL;

  protected readonly property = linkedSignal(() => this.preselectedProperty());
  protected readonly fullName = signal('');
  protected readonly whatsappNumber = signal('');
  protected readonly budget = signal('');
  protected readonly purpose = signal('');
  protected readonly timeline = signal('');
  protected readonly submitted = signal(false);

  protected submit(event: Event): void {
    event.preventDefault();
    this.submitted.set(true);
  }
}
