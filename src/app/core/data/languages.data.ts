import { LanguageCode, LanguageOption } from '../models/language';

export const LANGUAGES: readonly LanguageOption[] = [
  { code: 'EN', suffix: 'En', label: 'English' },
  { code: 'GE', suffix: 'Ge', label: 'Georgian' },
  { code: 'RU', suffix: 'Ru', label: 'Russian' },
];

export const DEFAULT_LANGUAGE: LanguageCode = 'EN';
