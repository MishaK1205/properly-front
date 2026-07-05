import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionHeading } from '../../../../shared/components/section-heading/section-heading';
import { PROCESS_NOTE, PROCESS_STEPS } from '../../landing.data';

@Component({
  selector: 'app-how-it-works',
  imports: [SectionHeading],
  templateUrl: './how-it-works.html',
  styleUrl: './how-it-works.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HowItWorks {
  protected readonly steps = PROCESS_STEPS;
  protected readonly note = PROCESS_NOTE;
}
