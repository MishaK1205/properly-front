import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { findPropertyBySlug, PROPERTIES } from '../../core/data/properties.data';
import { WHATSAPP_URL } from '../../core/data/site.data';
import { SiteFooter } from '../../shared/components/site-footer/site-footer';
import { SiteHeader } from '../../shared/components/site-header/site-header';
import { DetailHero } from './components/detail-hero/detail-hero';
import { DeveloperSection } from './components/developer-section/developer-section';
import { InterestForm } from './components/interest-form/interest-form';
import { InvestmentNumbers } from './components/investment-numbers/investment-numbers';
import { KeepExploring } from './components/keep-exploring/keep-exploring';
import { OurTake } from './components/our-take/our-take';
import { PropertyTabs } from './components/property-tabs/property-tabs';
import { getPropertyDetailContent } from './property-detail.data';

@Component({
  selector: 'app-property-detail',
  imports: [
    SiteHeader,
    SiteFooter,
    RouterLink,
    DetailHero,
    OurTake,
    InvestmentNumbers,
    PropertyTabs,
    DeveloperSection,
    InterestForm,
    KeepExploring,
  ],
  templateUrl: './property-detail.html',
  styleUrl: './property-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyDetail {
  /** Route param, bound via withComponentInputBinding. */
  readonly slug = input.required<string>();

  private readonly document = inject(DOCUMENT);

  protected readonly whatsappUrl = WHATSAPP_URL;

  protected readonly property = computed(() => findPropertyBySlug(this.slug()));

  protected readonly detail = computed(() => {
    const property = this.property();
    return property ? getPropertyDetailContent(property) : undefined;
  });

  /** The next three properties in ranking order, wrapping around the list. */
  protected readonly related = computed(() => {
    const property = this.property();
    if (!property) {
      return [];
    }
    const index = PROPERTIES.indexOf(property);
    return Array.from({ length: 3 }, (_, i) => PROPERTIES[(index + i + 1) % PROPERTIES.length]);
  });

  protected scrollTo(id: string): void {
    this.document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
