import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

let nextId = 0;

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.html',
  styleUrl: './text-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextInput {
  readonly label = input.required<string>();
  readonly placeholder = input('');
  readonly type = input<'text' | 'tel' | 'email'>('text');
  readonly hint = input('');
  readonly required = input(false);
  readonly value = model('');

  protected readonly id = `app-text-input-${nextId++}`;

  protected onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }
}
