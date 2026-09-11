export interface Language {
  /** Suffix used on backend field names, e.g. `companyLocation${suffix}`. */
  readonly suffix: 'Ge' | 'En' | 'Ru';
  readonly label: string;
  /** Short form for compact controls such as the project dialog's language switcher. */
  readonly code: string;
}

export const LANGUAGES: readonly Language[] = [
  { suffix: 'En', label: 'English', code: 'EN' },
  { suffix: 'Ge', label: 'Georgian', code: 'GE' },
  { suffix: 'Ru', label: 'Russian', code: 'RU' },
];
