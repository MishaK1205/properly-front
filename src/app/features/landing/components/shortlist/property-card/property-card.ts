import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Button } from '../../../../../shared/components/button/button';
import { Property } from '../../../../../core/models/property';

@Component({
  selector: 'app-property-card',
  imports: [Button, NgOptimizedImage, RouterLink],
  templateUrl: './property-card.html',
  styleUrl: './property-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyCard {
  readonly property = input.required<Property>();

  readonly interested = output<string>();

  protected readonly imageUrl = computed(
    () => `https://picsum.photos/seed/${this.property().imageSeed}/800/520`,
  );

  protected readonly chips = computed(() => {
    const p = this.property();
    return [p.priceFrom, p.yieldLabel, p.completion];
  });
}
