export interface Language {
  /** Suffix used on backend field names, e.g. `companyLocation${suffix}`. */
  readonly suffix: 'Ge' | 'En' | 'Ru';
  readonly label: string;
}

export const LANGUAGES: readonly Language[] = [
  { suffix: 'En', label: 'English' },
  { suffix: 'Ge', label: 'Georgian' },
  { suffix: 'Ru', label: 'Russian' },
];
