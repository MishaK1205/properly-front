import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  afterNextRender,
  signal,
} from '@angular/core';

/**
 * Slim gradient progress bar fixed to the top of the viewport that fills as
 * the user scrolls the page, with a glowing comet tip at its leading edge.
 * Purely decorative — sits above the sticky header and never overlaps content.
 */
@Component({
  selector: 'app-scroll-progress',
  templateUrl: './scroll-progress.html',
  styleUrl: './scroll-progress.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollProgress implements OnDestroy {
  /** Scroll position as a 0–1 fraction of the total scrollable height. */
  protected readonly progress = signal(0);

  private rafId = 0;
  private readonly onScroll = (): void => {
    cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(() => this.update());
  };

  constructor() {
    afterNextRender(() => {
      window.addEventListener('scroll', this.onScroll, { passive: true });
      window.addEventListener('resize', this.onScroll, { passive: true });
      this.update();
    });
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.onScroll);
      window.removeEventListener('resize', this.onScroll);
      cancelAnimationFrame(this.rafId);
    }
  }

  private update(): void {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    this.progress.set(max > 0 ? Math.min(window.scrollY / max, 1) : 0);
  }
}
