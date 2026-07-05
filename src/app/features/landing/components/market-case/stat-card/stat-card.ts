import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type StatCardIcon = 'bars' | 'document' | 'trend';

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCard {
  readonly icon = input.required<StatCardIcon>();
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}
