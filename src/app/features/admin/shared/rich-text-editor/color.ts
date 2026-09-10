/** Hex helpers shared by the editor toolbar and its colour controls. */

/** Accepts `abc`, `#abc`, `aabbcc` or `#aabbcc`, and returns null for anything else. */
export function normalizeHex(value: string): string | null {
  const digits = value.trim().replace(/^#/, '').toLowerCase();
  if (/^[0-9a-f]{3}$/.test(digits)) {
    return `#${digits.replace(/./g, (digit) => digit + digit)}`;
  }
  return /^[0-9a-f]{6}$/.test(digits) ? `#${digits}` : null;
}

/** A colour as the editor reports it (`#abc`, `#aabbcc` or `rgb(...)`) as a swatch value. */
export function toHex(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  const rgb = /^rgba?\(\s*(\d+)\D+(\d+)\D+(\d+)/.exec(value);
  if (!rgb) {
    return normalizeHex(value);
  }
  const channels = rgb.slice(1, 4).map((part) => Number(part).toString(16).padStart(2, '0'));
  return `#${channels.join('')}`;
}
