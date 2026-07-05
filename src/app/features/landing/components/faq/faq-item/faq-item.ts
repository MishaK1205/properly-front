import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-faq-item',
  templateUrl: './faq-item.html',
  styleUrl: './faq-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqItem {
  readonly question = input.required<string>();
  readonly answer = input.required<string>();
  readonly expanded = input(false);

  readonly toggled = output<void>();
}
