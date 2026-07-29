import { ChangeDetectionStrategy, Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  MatChipEditedEvent,
  MatChipInputEvent,
  MatChipsModule,
} from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

/**
 * Edits a `string[]` form control as removable chips: type an item, press Enter.
 * Used for the backend's array-of-strings fields (advantages, checklists).
 */
@Component({
  selector: 'app-chip-list-input',
  imports: [MatChipsModule, MatFormFieldModule, MatIconModule],
  templateUrl: './chip-list-input.html',
  styleUrl: './chip-list-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChipListInput),
      multi: true,
    },
  ],
})
export class ChipListInput implements ControlValueAccessor {
  readonly label = input.required<string>();
  readonly placeholder = input('Type an item and press Enter');

  protected readonly items = signal<readonly string[]>([]);
  protected readonly disabled = signal(false);

  private onChange: (value: string[]) => void = () => {};
  protected onTouched: () => void = () => {};

  writeValue(value: string[] | null): void {
    this.items.set(value ?? []);
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected add(event: MatChipInputEvent): void {
    const value = event.value.trim();
    event.chipInput.clear();
    if (value.length === 0 || this.items().includes(value)) {
      return;
    }
    this.items.update((items) => [...items, value]);
    this.commit();
  }

  protected remove(item: string): void {
    this.items.update((items) => items.filter((existing) => existing !== item));
    this.commit();
  }

  protected edit(item: string, event: MatChipEditedEvent): void {
    const value = event.value.trim();
    if (value.length === 0) {
      this.remove(item);
      return;
    }
    this.items.update((items) =>
      items.map((existing) => (existing === item ? value : existing)),
    );
    this.commit();
  }

  private commit(): void {
    this.onChange([...this.items()]);
    this.onTouched();
  }
}
