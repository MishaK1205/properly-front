import { afterNextRender, Directive, ElementRef, inject, input, OnDestroy } from '@angular/core';

/**
 * Fades an element in (with a slight upward slide) the first time it enters
 * the viewport. SSR-safe: the `.reveal` class that hides the element is only
 * added after client render, so server-rendered content is never invisible.
 */
@Directive({
  selector: '[appScrollReveal]',
})
export class ScrollRevealDirective implements OnDestroy {
  /** Stagger delay in milliseconds, useful for grids of cards. */
  readonly revealDelay = input(0, { alias: 'appScrollReveal', transform: numberOrZero });

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;

  constructor() {
    afterNextRender(() => {
      const el = this.element.nativeElement;

      if (!('IntersectionObserver' in window)) {
        return;
      }

      el.style.setProperty('--reveal-delay', `${this.revealDelay()}ms`);
      el.classList.add('reveal');

      this.observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            el.classList.add('reveal--visible');
            this.observer?.disconnect();
          }
        },
        { threshold: 0.12, rootMargin: '0px 0px -5% 0px' },
      );
      this.observer.observe(el);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}

function numberOrZero(value: number | string | undefined): number {
  const parsed = typeof value === 'string' ? Number(value) : value;
  return parsed && Number.isFinite(parsed) ? parsed : 0;
}
