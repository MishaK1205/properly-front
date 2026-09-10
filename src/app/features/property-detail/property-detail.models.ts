/**
 * View model for the property detail page. Every field is already localized and formatted,
 * so the template components stay presentational.
 */

export type OverviewIcon =
  | 'building'
  | 'floors'
  | 'units'
  | 'size'
  | 'finish'
  | 'furniture'
  | 'management'
  | 'distance'
  | 'location';

export interface OverviewFact {
  readonly icon: OverviewIcon;
  readonly label: string;
  readonly value: string;
}

export interface UnitPlan {
  readonly type: string;
  readonly size: string;
  readonly startingPrice: string;
  readonly imageUrl: string | null;
}

export interface PaymentStage {
  readonly stage: string;
  readonly amount: string;
  readonly when: string;
}

export type DeveloperStatIcon = 'projects' | 'units' | 'key';

export interface DeveloperStat {
  readonly icon: DeveloperStatIcon;
  readonly label: string;
  readonly value: string;
}

export interface DeveloperProfile {
  readonly name: string;
  readonly since: string;
  readonly location: string;
  readonly stats: readonly DeveloperStat[];
  readonly quote: string;
  readonly footnote: string;
}

/** Card in the "Keep exploring" strip, linking to another project's detail page. */
export interface ExploreCard {
  readonly id: string;
  readonly name: string;
  readonly location: string;
  readonly imageUrl: string | null;
}

export interface PropertyDetailContent {
  readonly id: string;
  readonly name: string;
  readonly companyName: string;
  readonly location: string;
  readonly mapsUrl: string;
  readonly galleryUrls: readonly string[];
  /** Hero summary cards, as rich text HTML written in the admin editor. */
  readonly summaryCards: readonly string[];
  readonly tags: readonly string[];
  readonly paymentNote: string;
  /** The "Our Take" write-up, as rich text HTML carrying its own heading. */
  readonly description: string;
  readonly verification: {
    readonly checks: readonly string[];
  };
  readonly numbers: {
    /** Breakdown tiles, as rich text HTML written in the admin editor. */
    readonly stats: readonly string[];
    readonly disclaimer: string;
  };
  readonly overviewFacts: readonly OverviewFact[];
  readonly overviewImageUrl: string | null;
  readonly unitPlans: readonly UnitPlan[];
  readonly paymentPlan: {
    readonly stages: readonly PaymentStage[];
    readonly notes: readonly string[];
  };
  readonly developer: DeveloperProfile | null;
}
