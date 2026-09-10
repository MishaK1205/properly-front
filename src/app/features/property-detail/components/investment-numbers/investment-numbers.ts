import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SectionHeading } from '../../../../shared/components/section-heading/section-heading';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';
import { SafeHtmlPipe } from '../../../../shared/pipes/safe-html.pipe';
import { PropertyDetailContent } from '../../property-detail.models';

@Component({
  selector: 'app-investment-numbers',
  imports: [SectionHeading, ScrollRevealDirective, SafeHtmlPipe],
  templateUrl: './investment-numbers.html',
  styleUrl: './investment-numbers.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvestmentNumbers {
  readonly detail = input.required<PropertyDetailContent>();
}
