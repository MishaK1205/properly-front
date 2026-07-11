import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import {
  BUDGET_OPTIONS,
  PURPOSE_OPTIONS,
  TIMELINE_OPTIONS,
  WHATSAPP_URL,
} from '../../../../core/data/site.data';
import { Button } from '../../../../shared/components/button/button';
import { ButtonLink } from '../../../../shared/components/button-link/button-link';
import { SectionHeading } from '../../../../shared/components/section-heading/section-heading';
import { SelectInput } from '../../../../shared/components/select-input/select-input';
import { TextInput } from '../../../../shared/components/text-input/text-input';
import { WhatsappIcon } from '../../../../shared/components/whatsapp-icon/whatsapp-icon';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';
import { FORM_TRUST_ITEMS } from '../../property-detail.data';

@Component({
  selector: 'app-interest-form',
  imports: [
    Button,
    ButtonLink,
    SectionHeading,
    SelectInput,
    TextInput,
    WhatsappIcon,
    ScrollRevealDirective,
  ],
  templateUrl: './interest-form.html',
  styleUrl: './interest-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterestForm {
  readonly propertyName = input.required<string>();

  protected readonly budgetOptions = BUDGET_OPTIONS;
  protected readonly purposeOptions = PURPOSE_OPTIONS;
  protected readonly timelineOptions = TIMELINE_OPTIONS;
  protected readonly trustItems = FORM_TRUST_ITEMS;
  protected readonly whatsappUrl = WHATSAPP_URL;

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
