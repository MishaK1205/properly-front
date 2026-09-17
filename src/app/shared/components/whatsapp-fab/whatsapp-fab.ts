import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { WhatsappIcon } from '../whatsapp-icon/whatsapp-icon';

/** Floating "chat on WhatsApp" button pinned to the bottom-right corner of a page. */
@Component({
  selector: 'app-whatsapp-fab',
  imports: [WhatsappIcon],
  templateUrl: './whatsapp-fab.html',
  styleUrl: './whatsapp-fab.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhatsappFab {
  readonly href = input.required<string>();
}
