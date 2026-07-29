import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SectionHeading } from '../../../../shared/components/section-heading/section-heading';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';
import { ExploreCard } from '../../property-detail.models';

@Component({
  selector: 'app-keep-exploring',
  imports: [RouterLink, SectionHeading, ScrollRevealDirective],
  templateUrl: './keep-exploring.html',
  styleUrl: './keep-exploring.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeepExploring {
  readonly cards = input.required<readonly ExploreCard[]>();
}
