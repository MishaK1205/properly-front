import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { TELEGRAM_URL, WHATSAPP_URL } from '../../../../core/data/site.data';
import { Button } from '../../../../shared/components/button/button';
import { ButtonLink } from '../../../../shared/components/button-link/button-link';
import { TelegramIcon } from '../../../../shared/components/telegram-icon/telegram-icon';
import { WhatsappIcon } from '../../../../shared/components/whatsapp-icon/whatsapp-icon';
import { PropertyDetailContent } from '../../property-detail.models';

@Component({
  selector: 'app-detail-hero',
  imports: [Button, ButtonLink, TelegramIcon, WhatsappIcon],
  templateUrl: './detail-hero.html',
  styleUrl: './detail-hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailHero {
  readonly detail = input.required<PropertyDetailContent>();

  readonly interested = output<void>();

  private readonly document = inject(DOCUMENT);

  protected readonly whatsappUrl = WHATSAPP_URL;
  protected readonly telegramUrl = TELEGRAM_URL;

  protected readonly selectedIndex = signal(0);
  protected readonly copied = signal(false);

  protected readonly mainImageUrl = computed(() => {
    const urls = this.detail().galleryUrls;
    return urls[this.selectedIndex()] ?? urls[0] ?? null;
  });

  protected readonly thumbnails = computed(() => this.detail().galleryUrls.slice(1));

  protected selectImage(index: number): void {
    this.selectedIndex.set(index);
  }

  protected copyLink(): void {
    const url = this.document.location?.href ?? '';
    void navigator.clipboard?.writeText(url);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
