/**
 * Converts a UTC date string to a local Date object.
 * @param utcDateString - The UTC date string (e.g., from your DB)
 * @returns Local Date object
 */
export function utcToLocalDate(utcDateString: string): Date {
  // Parse as UTC, then create a local Date object
  return new Date(utcDateString);
}

/**
 * Formats a UTC date string to a local time string.
 * @param utcDateString - The UTC date string
 * @param options - Intl.DateTimeFormat options (optional)
 * @returns Localized date string
 */
export function formatUtcToLocal(
  utcDateString: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const date = utcToLocalDate(utcDateString);
  return date.toLocaleString(undefined, options);
}