import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { Property } from '../../../../core/models/property';
import { Button } from '../../../../shared/components/button/button';
import { SectionHeading } from '../../../../shared/components/section-heading/section-heading';
import { SelectInput } from '../../../../shared/components/select-input/select-input';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';
import { PropertyDetailContent, UnitPlan } from '../../property-detail.models';

type TabId = 'overview' | 'plans' | 'payment';

interface Tab {
  readonly id: TabId;
  readonly label: string;
}

@Component({
  selector: 'app-property-tabs',
  imports: [Button, NgOptimizedImage, SectionHeading, SelectInput, ScrollRevealDirective],
  templateUrl: './property-tabs.html',
  styleUrl: './property-tabs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyTabs {
  readonly property = input.required<Property>();
  readonly detail = input.required<PropertyDetailContent>();

  readonly paymentDetailsRequested = output<void>();

  protected readonly tabs: readonly Tab[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'plans', label: 'Floor Plans' },
    { id: 'payment', label: 'Payment Plan' },
  ];

  protected readonly activeTab = signal<TabId>('overview');

  protected readonly unitType = signal('');

  protected readonly unitTypes = computed(() => this.detail().unitPlans.map((plan) => plan.type));

  protected readonly selectedPlan = computed<UnitPlan>(() => {
    const plans = this.detail().unitPlans;
    return plans.find((plan) => plan.type === this.unitType()) ?? plans[0];
  });

  protected readonly overviewImageUrl = computed(
    () => `https://picsum.photos/seed/${this.property().imageSeed}-overview/720/540`,
  );

  protected readonly planImageUrl = computed(
    () => `https://picsum.photos/seed/${this.selectedPlan().imageSeed}/1000/700`,
  );

  protected selectTab(id: TabId): void {
    this.activeTab.set(id);
  }
}
