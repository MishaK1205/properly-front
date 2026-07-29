/**
 * Injected at build time by `ng build --define`, so the deployed bundle points at the real API.
 * Left undefined during local development, where the localhost fallback applies.
 */
declare const NG_API_BASE_URL: string;

/** Base URL of the NestJS backend (real-estate-investment-back). */
export const API_BASE_URL =
  typeof NG_API_BASE_URL === 'undefined' ? 'http://localhost:3000' : NG_API_BASE_URL;
