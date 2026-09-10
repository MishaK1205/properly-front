import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  forwardRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { toHex } from './color';
import { ColorControl } from './color-control/color-control';

type QuillModule = typeof import('quill');
type QuillEditor = InstanceType<QuillModule['default']>;
type QuillRange = { readonly index: number; readonly length: number };

/** Format name of the inline `font-size` attributor registered below. */
const FONT_SIZE = 'font-size';

const MIN_SIZE = 8;
const MAX_SIZE = 96;

/**
 * Quill editor bound to a single HTML string control. The stored value is semantic HTML
 * (`<h3>`, `<p>`, `<strong>`, inline colours and font sizes) so the public site can render
 * it unchanged.
 */
@Component({
  selector: 'app-rich-text-editor',
  imports: [ColorControl],
  templateUrl: './rich-text-editor.html',
  styleUrl: './rich-text-editor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextEditor),
      multi: true,
    },
  ],
})
export class RichTextEditor implements ControlValueAccessor {
  readonly label = input.required<string>();
  readonly placeholder = input('');

  private readonly toolbar = viewChild.required<ElementRef<HTMLElement>>('toolbar');
  private readonly host = viewChild.required<ElementRef<HTMLElement>>('host');

  protected readonly minSize = MIN_SIZE;
  protected readonly maxSize = MAX_SIZE;

  /** Toolbar state, mirroring the formats of whatever the caret currently sits on. */
  protected readonly color = signal<string | null>(null);
  protected readonly highlight = signal<string | null>(null);
  protected readonly size = signal<number | null>(null);
  protected readonly disabled = signal(false);

  private editor: QuillEditor | null = null;

  /** Value written before Quill finished loading; applied as soon as the editor exists. */
  private value = '';
  private destroyed = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.destroyed = true;
      this.editor = null;
    });

    // Quill needs a real DOM, and loading it lazily keeps it out of the server bundle.
    afterNextRender(() => void this.createEditor());
  }

  writeValue(value: string | null): void {
    this.value = value ?? '';
    this.showValue();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
    this.editor?.enable(!isDisabled);
  }

  protected setColor(color: string): void {
    this.color.set(color);
    this.applyFormat('color', color);
  }

  protected clearColor(): void {
    this.color.set(null);
    this.applyFormat('color', false);
  }

  protected setHighlight(color: string): void {
    this.highlight.set(color);
    this.applyFormat('background', color);
  }

  protected clearHighlight(): void {
    this.highlight.set(null);
    this.applyFormat('background', false);
  }

  /** An empty field means "no size of its own", so the surrounding styles decide. */
  protected setSize(event: Event): void {
    const input = event.target as HTMLInputElement;
    const size = clampSize(input.value);
    this.size.set(size);
    input.value = size === null ? '' : String(size);
    this.applyFormat(FONT_SIZE, size === null ? false : `${size}px`);
  }

  /** The editor lives inside a form, where an unhandled Enter would submit it. */
  protected commitSize(event: Event): void {
    event.preventDefault();
    this.setSize(event);
  }

  private async createEditor(): Promise<void> {
    const quill = await import('quill');
    if (this.destroyed) {
      return;
    }
    registerFontSize(quill);

    const editor = new quill.default(this.host().nativeElement, {
      theme: 'snow',
      placeholder: this.placeholder(),
      modules: { toolbar: { container: this.toolbar().nativeElement } },
    });

    editor.on('text-change', (_delta, _oldDelta, source) => {
      if (source === 'user') {
        this.value = readHtml(editor);
        this.onChange(this.value);
      }
    });
    editor.on('selection-change', (range) => {
      // A null range means the editor lost focus.
      if (range === null) {
        this.onTouched();
      } else {
        this.showFormats(range);
      }
    });

    editor.enable(!this.disabled());
    this.editor = editor;
    this.showValue();
  }

  private showValue(): void {
    const editor = this.editor;
    if (!editor) {
      return;
    }
    // `silent` keeps loading a value from being reported back as a user edit.
    editor.setContents(editor.clipboard.convert({ html: this.value }), 'silent');
  }

  /** Moves the toolbar controls onto the formats of the current selection. */
  private showFormats(range: QuillRange): void {
    const formats = this.editor?.getFormat(range.index, range.length) ?? {};
    this.color.set(toHex(formats['color']));
    this.highlight.set(toHex(formats['background']));
    this.size.set(toPixels(formats[FONT_SIZE]));
  }

  private applyFormat(name: string, value: string | false): void {
    const editor = this.editor;
    if (!editor) {
      return;
    }
    // Clicking a control blurred the editor; focusing restores the range it left behind.
    editor.focus();
    editor.format(name, value, 'user');
  }
}

/**
 * Quill escapes every space in its semantic HTML as `&nbsp;`, which stops the text from
 * wrapping wherever it is rendered, so plain spaces are restored here.
 */
function readHtml(editor: QuillEditor): string {
  if (editor.getText().trim().length === 0) {
    return '';
  }
  return editor.getSemanticHTML().replaceAll('&nbsp;', ' ');
}

let fontSizeRegistered = false;

/**
 * Quill's own size format offers a handful of class-based steps only. This inline
 * `font-size` attributor takes any pixel value instead, and because Parchment looks
 * attributors up by the CSS property it writes, a saved size is recognized again on load.
 */
function registerFontSize({ default: quill, Parchment }: QuillModule): void {
  if (fontSizeRegistered) {
    return;
  }
  quill.register(
    new Parchment.StyleAttributor(FONT_SIZE, FONT_SIZE, { scope: Parchment.Scope.INLINE }),
    true,
  );
  fontSizeRegistered = true;
}

/** Rounds a typed size into the supported range; blank input means no explicit size. */
function clampSize(value: string): number | null {
  const size = Number.parseFloat(value);
  if (!Number.isFinite(size)) {
    return null;
  }
  return Math.min(Math.max(Math.round(size), MIN_SIZE), MAX_SIZE);
}

function toPixels(value: unknown): number | null {
  const size = typeof value === 'string' ? Number.parseFloat(value) : Number.NaN;
  return Number.isFinite(size) ? Math.round(size) : null;
}
