import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WHATSAPP_URL } from '../../../core/data/site.data';
import { Button } from '../button/button';
import { LanguageSwitcher } from '../language-switcher/language-switcher';

@Component({
  selector: 'app-site-header',
  imports: [Button, LanguageSwitcher, RouterLink],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteHeader {
  /** When set, shows a "Top 10 List › {breadcrumb}" trail in the middle of the header. */
  readonly breadcrumb = input('');

  protected readonly whatsappUrl = WHATSAPP_URL;
}
