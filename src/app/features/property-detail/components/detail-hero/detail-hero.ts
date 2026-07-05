import { DOCUMENT, NgOptimizedImage } from '@angular/common';
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
import { Property } from '../../../../core/models/property';
import { Button } from '../../../../shared/components/button/button';
import { PropertyDetailContent } from '../../property-detail.models';

@Component({
  selector: 'app-detail-hero',
  imports: [Button, NgOptimizedImage],
  templateUrl: './detail-hero.html',
  styleUrl: './detail-hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailHero {
  readonly property = input.required<Property>();
  readonly detail = input.required<PropertyDetailContent>();

  readonly interested = output<void>();

  private readonly document = inject(DOCUMENT);

  protected readonly whatsappUrl = WHATSAPP_URL;
  protected readonly telegramUrl = TELEGRAM_URL;

  protected readonly selectedIndex = signal(0);
  protected readonly copied = signal(false);

  protected readonly galleryUrls = computed(() =>
    this.detail().gallerySeeds.map((seed) => `https://picsum.photos/seed/${seed}/960/640`),
  );

  protected readonly mainImageUrl = computed(() => this.galleryUrls()[this.selectedIndex()]);

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
