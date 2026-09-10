import { CdkConnectedOverlay, CdkOverlayOrigin, ConnectedPosition } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { normalizeHex } from '../color';

export type ColorControlKind = 'text' | 'highlight';

/** Swatches offered per control; the highlight ones are tints that keep text readable. */
const PRESETS: Readonly<Record<ColorControlKind, readonly string[]>> = {
  text: [
    '#121217',
    '#3f3f50',
    '#8a8aa3',
    '#ffffff',
    '#6e69f5',
    '#5652e0',
    '#2dca72',
    '#0b7285',
    '#ff8800',
    '#e63946',
    '#f173ba',
    '#a6ccff',
  ],
  highlight: [
    '#fff3b0',
    '#ffe066',
    '#ffd6a5',
    '#ffd6e0',
    '#d8f3dc',
    '#c7f9f6',
    '#cce3ff',
    '#ede7ff',
    '#f1f1f4',
    '#6e69f5',
    '#33eee3',
    '#121217',
  ],
};

/** The trigger bar and the native picker need a colour even when the selection carries none. */
const FALLBACK: Readonly<Record<ColorControlKind, string>> = {
  text: '#121217',
  highlight: '#ffe066',
};

const ICON: Readonly<Record<ColorControlKind, string>> = {
  text: 'format_color_text',
  highlight: 'format_color_fill',
};

/**
 * Toolbar button that opens a colour picker: preset swatches, a hex field and the native
 * picker. Emits colours as `#rrggbb`; the editor decides which format they apply to.
 */
@Component({
  selector: 'app-color-control',
  imports: [CdkConnectedOverlay, CdkOverlayOrigin, MatIconModule],
  templateUrl: './color-control.html',
  styleUrl: './color-control.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorControl {
  readonly kind = input.required<ColorControlKind>();
  readonly label = input.required<string>();
  /** Colour of the current selection, or null when it carries none. */
  readonly color = input<string | null>(null);

  readonly picked = output<string>();
  readonly cleared = output<void>();

  protected readonly open = signal(false);
  /** Hex digits being typed, without the leading hash the field renders itself. */
  protected readonly draft = signal('');

  protected readonly icon = computed(() => ICON[this.kind()]);
  protected readonly presets = computed(() => PRESETS[this.kind()]);
  protected readonly swatch = computed(() => this.color() ?? FALLBACK[this.kind()]);
  protected readonly hexLabel = computed(() => `${this.label()} as a hex value`);
  protected readonly wheelLabel = computed(() => `${this.label()} from the colour wheel`);
  protected readonly removeLabel = computed(() =>
    this.kind() === 'text' ? 'Remove colour' : 'Remove highlight',
  );
  protected readonly typed = computed(() => normalizeHex(this.draft()));
  protected readonly invalid = computed(() => this.draft().length > 0 && this.typed() === null);

  protected readonly positions: ConnectedPosition[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 6 },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -6 },
  ];

  /** Last colour handed to the editor, so a commit followed by a blur only applies once. */
  private applied: string | null = null;

  protected toggle(): void {
    const open = !this.open();
    this.open.set(open);
    if (open) {
      this.applied = this.color();
      this.draft.set(this.color()?.slice(1) ?? '');
    }
  }

  protected close(): void {
    this.open.set(false);
  }

  /**
   * The CDK routes key events to the top-most overlay only, so handling Escape here keeps
   * it from reaching — and closing — the Material dialog the editor sits in.
   */
  protected dismiss(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
    }
  }

  protected pickPreset(color: string): void {
    this.pick(color);
    this.close();
  }

  /** Stays open while the native picker is in use, so a colour can be dialled in. */
  protected pickNative(event: Event): void {
    this.pick((event.target as HTMLInputElement).value);
  }

  protected typeHex(event: Event): void {
    const input = event.target as HTMLInputElement;
    // A pasted colour usually carries the hash the field already renders on its own.
    const digits = input.value.replace(/^#/, '');
    input.value = digits;
    this.draft.set(digits);
  }

  /**
   * Commits the typed value. Preventing the default matters on Enter: the editor lives
   * inside a form, and an unhandled Enter submits it instead of colouring the text.
   */
  protected commit(event: Event): void {
    event.preventDefault();
    const color = this.typed();
    if (color) {
      this.apply(color);
    }
  }

  /** Enter and the apply button also dismiss the panel, an unusable value aside. */
  protected confirm(event: Event): void {
    this.commit(event);
    if (this.typed()) {
      this.close();
    }
  }

  protected clear(): void {
    this.applied = null;
    this.draft.set('');
    this.cleared.emit();
    this.close();
  }

  private pick(color: string): void {
    this.draft.set(color.slice(1));
    this.apply(color);
  }

  private apply(color: string): void {
    if (color === this.applied) {
      return;
    }
    this.applied = color;
    this.picked.emit(color);
  }
}
