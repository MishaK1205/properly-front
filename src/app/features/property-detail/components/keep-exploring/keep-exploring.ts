import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Property } from '../../../../core/models/property';
import { SectionHeading } from '../../../../shared/components/section-heading/section-heading';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

interface ExploreCard {
  readonly property: Property;
  readonly imageUrl: string;
}

@Component({
  selector: 'app-keep-exploring',
  imports: [NgOptimizedImage, RouterLink, SectionHeading, ScrollRevealDirective],
  templateUrl: './keep-exploring.html',
  styleUrl: './keep-exploring.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeepExploring {
  readonly properties = input.required<readonly Property[]>();

  protected readonly cards = computed<readonly ExploreCard[]>(() =>
    this.properties().map((property) => ({
      property,
      imageUrl: `https://picsum.photos/seed/${property.imageSeed}/640/420`,
    })),
  );
}
