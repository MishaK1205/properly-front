import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionHeading } from '../../../../shared/components/section-heading/section-heading';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';
import { PROCESS_NOTE, PROCESS_STEPS } from '../../landing.data';

@Component({
  selector: 'app-how-it-works',
  imports: [SectionHeading, ScrollRevealDirective],
  templateUrl: './how-it-works.html',
  styleUrl: './how-it-works.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HowItWorks {
  protected readonly steps = PROCESS_STEPS;
  protected readonly note = PROCESS_NOTE;
}
