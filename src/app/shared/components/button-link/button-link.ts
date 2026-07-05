import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ButtonSize, ButtonVariant } from '../button/button';

@Component({
  selector: 'app-button-link',
  templateUrl: './button-link.html',
  styleUrl: './button-link.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.is-block]': 'block()' },
})
export class ButtonLink {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly href = input.required<string>();
  readonly block = input(false);

  protected readonly classes = computed(
    () => `btn btn--${this.variant()} btn--${this.size()}${this.block() ? ' btn--block' : ''}`,
  );
}
