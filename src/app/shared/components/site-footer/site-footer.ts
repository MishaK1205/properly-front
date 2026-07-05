import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FOOTER_LINKS, TELEGRAM_URL, WHATSAPP_URL } from '../../../core/data/site.data';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { TelegramIcon } from '../telegram-icon/telegram-icon';
import { WhatsappIcon } from '../whatsapp-icon/whatsapp-icon';

@Component({
  selector: 'app-site-footer',
  imports: [LanguageSwitcher, TelegramIcon, WhatsappIcon],
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteFooter {
  protected readonly links = FOOTER_LINKS;
  protected readonly whatsappUrl = WHATSAPP_URL;
  protected readonly telegramUrl = TELEGRAM_URL;
  protected readonly year = new Date().getFullYear();
}
