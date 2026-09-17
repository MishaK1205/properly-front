import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  linkedSignal,
  PLATFORM_ID,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { GalleryLightbox } from '../gallery-lightbox/gallery-lightbox';

/** Horizontal drag shorter than this is treated as a tap (opens the lightbox), not a swipe. */
const SWIPE_THRESHOLD_PX = 40;

/**
 * Photo carousel for the property hero: photos slide on a track with a stories-style
 * progress bar, a small filmstrip and counter overlaid at the bottom, hover arrows,
 * swipe/keyboard navigation and a fullscreen lightbox.
 */
@Component({
  selector: 'app-property-gallery',
  imports: [GalleryLightbox],
  templateUrl: './property-gallery.html',
  styleUrl: './property-gallery.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyGallery {
  readonly images = input.required<readonly string[]>();
  /** Property name, used to build the photos' alt text. */
  readonly name = input.required<string>();

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly strip = viewChild<ElementRef<HTMLElement>>('strip');
  private readonly thumbs = viewChildren<ElementRef<HTMLElement>>('thumb');

  /** Resets to the first photo whenever a different property's images arrive. */
  protected readonly index = linkedSignal<readonly string[], number>({
    source: this.images,
    computation: () => 0,
  });

  protected readonly lightboxOpen = signal(false);

  protected readonly count = computed(() => this.images().length);
  protected readonly hasMany = computed(() => this.count() > 1);

  private pointerStartX: number | null = null;
  private swiped = false;

  constructor() {
    effect(() => this.scrollActiveThumbIntoView(this.index()));
  }

  protected select(index: number): void {
    this.index.set(index);
  }

  protected next(): void {
    this.index.update((current) => (current + 1) % this.count());
  }

  protected previous(): void {
    this.index.update((current) => (current - 1 + this.count()) % this.count());
  }

  protected openLightbox(): void {
    if (this.count()) {
      this.lightboxOpen.set(true);
    }
  }

  /** A tap on the photo opens the lightbox, but the click that ends a swipe must not. */
  protected onTrackClick(): void {
    if (this.swiped) {
      this.swiped = false;
      return;
    }
    this.openLightbox();
  }

  protected onPointerDown(event: PointerEvent): void {
    this.pointerStartX = event.clientX;
    this.swiped = false;
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
    this.swiped = true;
    if (delta < 0) {
      this.next();
    } else {
      this.previous();
    }
  }

  /** Keeps the highlighted thumbnail centred in the strip without scrolling the page. */
  private scrollActiveThumbIntoView(index: number): void {
    const strip = this.strip()?.nativeElement;
    const thumb = this.thumbs()[index]?.nativeElement;
    if (!this.isBrowser || !strip || !thumb) {
      return;
    }
    const left = thumb.offsetLeft - (strip.clientWidth - thumb.clientWidth) / 2;
    strip.scrollTo({ left, behavior: 'smooth' });
  }
}
