import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { PROPERTIES } from '../../core/data/properties.data';
import { WHATSAPP_URL } from '../../core/data/site.data';
import { SiteFooter } from '../../shared/components/site-footer/site-footer';
import { SiteHeader } from '../../shared/components/site-header/site-header';
import { WhatsappIcon } from '../../shared/components/whatsapp-icon/whatsapp-icon';
import { AnnouncementBar } from './components/announcement-bar/announcement-bar';
import { Faq } from './components/faq/faq';
import { Hero } from './components/hero/hero';
import { HowItWorks } from './components/how-it-works/how-it-works';
import { LeadForm } from './components/lead-form/lead-form';
import { MarketCase } from './components/market-case/market-case';
import { Shortlist } from './components/shortlist/shortlist';
import { Verification } from './components/verification/verification';

@Component({
  selector: 'app-landing',
  imports: [
    AnnouncementBar,
    SiteHeader,
    Hero,
    MarketCase,
    Shortlist,
    HowItWorks,
    Verification,
    Faq,
    LeadForm,
    SiteFooter,
    WhatsappIcon,
  ],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Landing {
  private readonly document = inject(DOCUMENT);

  protected readonly properties = PROPERTIES;
  protected readonly propertyNames = computed(() => this.properties.map((p) => p.name));
  protected readonly whatsappUrl = WHATSAPP_URL;

  protected readonly selectedProperty = signal('');

  protected onInterested(propertyName: string): void {
    this.selectedProperty.set(propertyName);
    this.scrollTo('contact');
  }

  protected scrollTo(id: string): void {
    this.document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
