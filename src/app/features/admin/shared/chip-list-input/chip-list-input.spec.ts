import { ENTER } from '@angular/cdk/keycodes';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { ChipListInput } from './chip-list-input';

@Component({
  imports: [ReactiveFormsModule, ChipListInput],
  template: `<app-chip-list-input label="Project advantages" [formControl]="control" />`,
})
class Host {
  readonly control = new FormControl<string[]>(['Sea view'], { nonNullable: true });
}

function pressEnter(input: HTMLInputElement): void {
  const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
  Object.defineProperty(event, 'keyCode', { get: () => ENTER });
  input.dispatchEvent(event);
}

describe('ChipListInput', () => {
  let fixture: ComponentFixture<Host>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Host],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });

  it('renders the control value as chips', () => {
    const chips = fixture.nativeElement.querySelectorAll('mat-chip-row');
    expect(chips.length).toBe(1);
    expect((chips[0] as HTMLElement).textContent).toContain('Sea view');
  });

  it('appends a typed item to the control value', () => {
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = '  Close to the airport  ';
    input.dispatchEvent(new Event('input'));
    pressEnter(input);
    fixture.detectChanges();

    expect(fixture.componentInstance.control.value).toEqual(['Sea view', 'Close to the airport']);
    expect(fixture.nativeElement.querySelectorAll('mat-chip-row').length).toBe(2);
  });

  it('ignores blank input', () => {
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = '   ';
    input.dispatchEvent(new Event('input'));
    pressEnter(input);
    fixture.detectChanges();

    expect(fixture.componentInstance.control.value).toEqual(['Sea view']);
  });

  it('removes an item when its chip is removed', () => {
    const removeButton = fixture.nativeElement.querySelector(
      'mat-chip-row button',
    ) as HTMLButtonElement;
    removeButton.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.control.value).toEqual([]);
  });
});
