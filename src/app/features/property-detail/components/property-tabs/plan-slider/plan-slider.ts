import { ChangeDetectionStrategy, Component, computed, input, linkedSignal } from '@angular/core';

/** Horizontal drag shorter than this is treated as a tap, not a swipe. */
const SWIPE_THRESHOLD_PX = 40;

/**
 * Light-themed slider for floor plan drawings: images slide on a track without being
 * cropped, with arrows, dots, a counter and swipe/keyboard navigation.
 */
@Component({
  selector: 'app-plan-slider',
  templateUrl: './plan-slider.html',
  styleUrl: './plan-slider.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanSlider {
  readonly images = input.required<readonly string[]>();
  /** Describes the drawings (e.g. "30-40 m2 floor plan"), used for alt text and labels. */
  readonly label = input.required<string>();

  /** Resets to the first drawing whenever a different apartment type's images arrive. */
  protected readonly index = linkedSignal<readonly string[], number>({
    source: this.images,
    computation: () => 0,
  });

  protected readonly count = computed(() => this.images().length);
  protected readonly hasMany = computed(() => this.count() > 1);

  private pointerStartX: number | null = null;

  protected select(index: number): void {
    this.index.set(index);
  }

  protected next(): void {
    this.index.update((current) => (current + 1) % this.count());
  }

  protected previous(): void {
    this.index.update((current) => (current - 1 + this.count()) % this.count());
  }

  protected onPointerDown(event: PointerEvent): void {
    this.pointerStartX = event.clientX;
  }

  protected onPointerCancel(): void {
    this.pointerStartX = null;
  }

  protected onPointerUp(event: PointerEvent): void {
    if (this.pointerStartX === null || !this.hasMany()) {
      return;
    }
    const delta = event.clientX - this.pointerStartX;
    this.pointerStartX = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) {
      return;
    }
    if (delta < 0) {
      this.next();
    } else {
      this.previous();
    }
  }
}
