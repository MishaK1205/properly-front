import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';
import { Button } from '../../../../shared/components/button/button';
import { SectionHeading } from '../../../../shared/components/section-heading/section-heading';
import { SelectInput } from '../../../../shared/components/select-input/select-input';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';
import { SafeHtmlPipe } from '../../../../shared/pipes/safe-html.pipe';
import { PropertyDetailContent, UnitPlan } from '../../property-detail.models';

type TabId = 'overview' | 'plans' | 'payment';

interface Tab {
  readonly id: TabId;
  readonly label: string;
}

@Component({
  selector: 'app-property-tabs',
  imports: [Button, SectionHeading, SelectInput, ScrollRevealDirective, SafeHtmlPipe],
  templateUrl: './property-tabs.html',
  styleUrl: './property-tabs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyTabs {
  readonly detail = input.required<PropertyDetailContent>();

  readonly paymentDetailsRequested = output<void>();

  private readonly allTabs: readonly Tab[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'plans', label: 'Floor Plans' },
    { id: 'payment', label: 'Payment Plan' },
  ];

  /** Only tabs that have data to show are offered. */
  protected readonly tabs = computed(() => {
    const detail = this.detail();
    const available: Record<TabId, boolean> = {
      overview: detail.overviewFacts.length > 0,
      plans: detail.unitPlans.length > 0,
      payment: detail.paymentPlan.stages.length > 0,
    };
    return this.allTabs.filter((tab) => available[tab.id]);
  });

  private readonly requestedTab = signal<TabId | null>(null);

  protected readonly activeTab = computed<TabId | undefined>(() => {
    const tabs = this.tabs();
    const requested = this.requestedTab();
    return tabs.find((tab) => tab.id === requested)?.id ?? tabs[0]?.id;
  });

  protected readonly unitTypes = computed(() => this.detail().unitPlans.map((plan) => plan.type));

  /** Starts on the first apartment type and falls back to it whenever the project changes. */
  protected readonly unitType = linkedSignal<string>(() => this.unitTypes()[0] ?? '');

  protected readonly selectedPlan = computed<UnitPlan | undefined>(() => {
    const plans = this.detail().unitPlans;
    return plans.find((plan) => plan.type === this.unitType()) ?? plans[0];
  });

  protected selectTab(id: TabId): void {
    this.requestedTab.set(id);
  }
}
