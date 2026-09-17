import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * A shimmering placeholder block. It has no content of its own: the parent sizes and
 * shapes it by styling the host element (`app-skeleton.my-class { height: ...; }`).
 */
@Component({
  selector: 'app-skeleton',
  template: '',
  styleUrl: './skeleton.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
})
export class Skeleton {}
