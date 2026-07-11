import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';
import { PropertyDetailContent } from '../../property-detail.models';

@Component({
  selector: 'app-our-take',
  imports: [ScrollRevealDirective],
  templateUrl: './our-take.html',
  styleUrl: './our-take.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OurTake {
  readonly detail = input.required<PropertyDetailContent>();
}
