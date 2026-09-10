import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';
import { SafeHtmlPipe } from '../../../../shared/pipes/safe-html.pipe';
import { PropertyDetailContent } from '../../property-detail.models';

@Component({
  selector: 'app-our-take',
  imports: [ScrollRevealDirective, SafeHtmlPipe],
  templateUrl: './our-take.html',
  styleUrl: './our-take.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OurTake {
  readonly detail = input.required<PropertyDetailContent>();
}
