import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-section-heading',
  templateUrl: './section-heading.html',
  styleUrl: './section-heading.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeading {
  readonly eyebrow = input('');
  readonly title = input.required<string>();
  readonly subtitle = input('');
  readonly align = input<'center' | 'start'>('center');
  /** 'lg' renders a larger display-style title. */
  readonly size = input<'md' | 'lg'>('md');
  /** 'dark' renders white text for navy backgrounds. */
  readonly tone = input<'light' | 'dark'>('light');
}
