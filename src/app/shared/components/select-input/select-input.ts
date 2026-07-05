import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

let nextId = 0;

@Component({
  selector: 'app-select-input',
  templateUrl: './select-input.html',
  styleUrl: './select-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectInput {
  readonly label = input.required<string>();
  readonly options = input.required<readonly string[]>();
  readonly placeholder = input('');
  readonly hint = input('');
  readonly required = input(false);
  readonly value = model('');

  protected readonly id = `app-select-input-${nextId++}`;

  protected onChange(event: Event): void {
    this.value.set((event.target as HTMLSelectElement).value);
  }
}
