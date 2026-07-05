import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { SectionHeading } from '../../../../shared/components/section-heading/section-heading';
import { Property } from '../../../../core/models/property';
import { PropertyCard } from './property-card/property-card';

@Component({
  selector: 'app-shortlist',
  imports: [SectionHeading, PropertyCard],
  templateUrl: './shortlist.html',
  styleUrl: './shortlist.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shortlist {
  readonly properties = input.required<readonly Property[]>();

  readonly interested = output<string>();
}
