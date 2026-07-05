import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SectionHeading } from '../../../../shared/components/section-heading/section-heading';
import { PropertyDetailContent } from '../../property-detail.models';

@Component({
  selector: 'app-investment-numbers',
  imports: [SectionHeading],
  templateUrl: './investment-numbers.html',
  styleUrl: './investment-numbers.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvestmentNumbers {
  readonly detail = input.required<PropertyDetailContent>();
}
