import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PropertyDetailContent } from '../../property-detail.models';

@Component({
  selector: 'app-our-take',
  templateUrl: './our-take.html',
  styleUrl: './our-take.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OurTake {
  readonly detail = input.required<PropertyDetailContent>();
}
