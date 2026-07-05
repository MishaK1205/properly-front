import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

export type ButtonVariant = 'primary' | 'whatsapp' | 'dark' | 'outline' | 'link' | 'link-whatsapp';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  templateUrl: './button.html',
  styleUrl: './button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.is-block]': 'block()' },
})
export class Button {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly type = input<'button' | 'submit'>('button');
  /** When set, renders an anchor (external link) instead of a button. */
  readonly href = input<string>('');
  /** Stretches the button to the full width of its container. */
  readonly block = input(false);

  readonly clicked = output<void>();

  protected readonly classes = computed(
    () => `btn btn--${this.variant()} btn--${this.size()}${this.block() ? ' btn--block' : ''}`,
  );
}
