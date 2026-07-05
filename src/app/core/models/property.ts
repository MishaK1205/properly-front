export interface PropertyBadge {
  readonly label: string;
  readonly kind: 'dark' | 'accent';
}

export interface Property {
  readonly rank: number;
  /** URL segment for the detail page, e.g. 'orbi-beach-tower'. */
  readonly slug: string;
  readonly name: string;
  readonly developer: string;
  readonly location: string;
  readonly priceFrom: string;
  readonly yieldLabel: string;
  readonly completion: string;
  readonly incomeType: string;
  readonly note: string;
  readonly imageSeed: string;
  readonly badge?: PropertyBadge;
}
