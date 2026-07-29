/** Language codes shown in the public language switcher. */
export type LanguageCode = 'GE' | 'EN' | 'RU';

/** Suffix the backend appends to multilingual field names, e.g. `projectLocationEn`. */
export type LanguageSuffix = 'Ge' | 'En' | 'Ru';

export interface LanguageOption {
  readonly code: LanguageCode;
  readonly suffix: LanguageSuffix;
  /** Full name, used for accessible labels. */
  readonly label: string;
}

/** The three backend variants of a single translated value. */
export type LocalizedVariants<T> = Readonly<Record<LanguageSuffix, T>>;
