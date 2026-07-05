import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { Button } from '../../../../shared/components/button/button';

@Component({
  selector: 'app-announcement-bar',
  imports: [Button],
  templateUrl: './announcement-bar.html',
  styleUrl: './announcement-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnouncementBar {
  readonly briefRequested = output<void>();
}
