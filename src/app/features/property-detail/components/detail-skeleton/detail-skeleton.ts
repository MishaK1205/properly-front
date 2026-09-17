import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Skeleton } from '../../../../shared/components/skeleton/skeleton';

function range(length: number): readonly number[] {
  return Array.from({ length }, (_, index) => index);
}

/** Placeholder layout shown while the property is being fetched; mirrors the hero and "Our Take". */
@Component({
  selector: 'app-detail-skeleton',
  imports: [Skeleton],
  templateUrl: './detail-skeleton.html',
  styleUrl: './detail-skeleton.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailSkeleton {
  protected readonly thumbs = range(4);
  protected readonly stats = range(3);
  protected readonly tags = range(3);
  protected readonly paragraph = range(5);
  protected readonly checks = range(5);
}
