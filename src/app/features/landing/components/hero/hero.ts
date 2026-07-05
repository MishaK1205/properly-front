import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Button } from '../../../../shared/components/button/button';
import { HERO_CHIPS, HERO_TRUST_ITEMS } from '../../landing.data';

@Component({
  selector: 'app-hero',
  imports: [Button, NgOptimizedImage],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {
  readonly briefRequested = output<void>();
  readonly shortlistRequested = output<void>();

  protected readonly chips = HERO_CHIPS;
  protected readonly trustItems = HERO_TRUST_ITEMS;
}
