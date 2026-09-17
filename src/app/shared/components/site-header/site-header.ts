import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WHATSAPP_URL } from '../../../core/data/site.data';
import { ButtonLink } from '../button-link/button-link';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { WhatsappIcon } from '../whatsapp-icon/whatsapp-icon';

@Component({
  selector: 'app-site-header',
  imports: [ButtonLink, LanguageSwitcher, RouterLink, WhatsappIcon],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteHeader {
  protected readonly whatsappUrl = WHATSAPP_URL;
}
