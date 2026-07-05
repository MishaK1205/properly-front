/** Stat box in the hero summary card (price / yield / completion). */
export interface SummaryStat {
  readonly label: string;
  readonly value: string;
  readonly sub: string;
  readonly accent: boolean;
}

/** Big stat tile in "The numbers" section. */
export interface NumberStat {
  readonly label: string;
  readonly value: string;
  readonly sub: string;
  readonly accent: boolean;
}

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
  readonly monthlyInstallment: string;
  readonly imageSeed: string;
}

export interface PaymentStage {
  readonly stage: string;
  readonly amount: string;
  readonly when: string;
}

export type DeveloperStatIcon = 'projects' | 'units' | 'clock' | 'key';

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

export interface PropertyDetailContent {
  readonly slug: string;
  /** Picsum seeds for the gallery: first is the initial main image. */
  readonly gallerySeeds: readonly string[];
  readonly summaryStats: readonly SummaryStat[];
  readonly tags: readonly string[];
  readonly paymentNote: string;
  readonly ourTake: {
    readonly title: string;
    readonly paragraphs: readonly string[];
    /** Candid caveat rendered in muted style below the main paragraphs. */
    readonly honestNote: string;
  };
  readonly verification: {
    readonly checks: readonly string[];
    readonly lastVerified: string;
  };
  readonly numbers: {
    readonly stats: readonly NumberStat[];
    readonly disclaimer: string;
  };
  readonly overviewFacts: readonly OverviewFact[];
  readonly unitPlans: readonly UnitPlan[];
  readonly paymentPlan: {
    readonly stages: readonly PaymentStage[];
    readonly notes: readonly string[];
  };
  readonly developer: DeveloperProfile;
}
