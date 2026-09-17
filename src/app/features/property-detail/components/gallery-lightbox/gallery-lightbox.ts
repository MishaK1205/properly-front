import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  model,
  PLATFORM_ID,
  viewChild,
} from '@angular/core';

/**
 * Fullscreen viewer for the property photos, built on a native `<dialog>` so focus
 * trapping, Escape-to-close and the backdrop come for free.
 */
@Component({
  selector: 'app-gallery-lightbox',
  templateUrl: './gallery-lightbox.html',
  styleUrl: './gallery-lightbox.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryLightbox {
  readonly images = input.required<readonly string[]>();
  readonly name = input.required<string>();
  /** Shared with the carousel so both always show the same photo. */
  readonly index = model.required<number>();
  readonly open = model(false);

  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  protected readonly count = computed(() => this.images().length);

  constructor() {
    effect(() => this.syncDialog(this.open()));
    inject(DestroyRef).onDestroy(() => this.unlockScroll());
  }

  protected close(): void {
    this.open.set(false);
  }

  protected next(): void {
    this.index.update((current) => (current + 1) % this.count());
  }

  protected previous(): void {
    this.index.update((current) => (current - 1 + this.count()) % this.count());
  }

  /** Clicks on the dialog element itself land on the backdrop, not on its content. */
  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) {
      this.close();
    }
  }

  private syncDialog(open: boolean): void {
    if (!this.isBrowser) {
      return;
    }
    const dialog = this.dialog().nativeElement;
    if (open) {
      if (!dialog.open) {
        dialog.showModal();
      }
      this.document.body.style.overflow = 'hidden';
      return;
    }
    // Escape closes the dialog natively before `open` flips, so never gate the unlock on `dialog.open`.
    if (dialog.open) {
      dialog.close();
    }
    this.unlockScroll();
  }

  private unlockScroll(): void {
    if (this.isBrowser) {
      this.document.body.style.overflow = '';
    }
  }
}
