import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SectionHeading } from '../../../../shared/components/section-heading/section-heading';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';
import { FAQ_ENTRIES } from '../../landing.data';
import { FaqItem } from './faq-item/faq-item';

@Component({
  selector: 'app-faq',
  imports: [SectionHeading, FaqItem, ScrollRevealDirective],
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Faq {
  protected readonly entries = FAQ_ENTRIES;
  protected readonly openIndex = signal<number | null>(0);

  protected toggle(index: number): void {
    this.openIndex.update((current) => (current === index ? null : index));
  }
}
