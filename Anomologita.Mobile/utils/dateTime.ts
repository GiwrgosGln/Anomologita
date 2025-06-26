/**
 * Converts a UTC date string to a local Date object.
 * @param utcDateString - The UTC date string (e.g., from your DB)
 * @returns Local Date object
 */
export function utcToLocalDate(utcDateString: string): Date {
  // Handle both SQL Server formats:
  // "2025-06-26 18:21:55.4879775" (space separated)
  // "2025-06-03T21:27:39.5701711" (ISO without Z)
  let isoString = utcDateString;
  
  // If it's in SQL Server format (space instead of T, no Z), convert to ISO format
  if (isoString.includes(' ') && !isoString.includes('T') && !isoString.includes('Z')) {
    isoString = isoString.replace(' ', 'T') + 'Z';
  }
  // If it's already in ISO format but missing Z, add it
  else if (!isoString.endsWith('Z') && !isoString.includes('+')) {
    isoString += 'Z';
  }
  
  // Parse as UTC, then create a local Date object
  return new Date(isoString);
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

/**
 * Gets relative time string for a UTC date (like "5m ago", "just now")
 * @param utcDateString - The UTC date string
 * @returns Relative time string
 */
export function getRelativeTime(utcDateString: string): string {
  const postDate = utcToLocalDate(utcDateString);
  const now = new Date();

  const diffMs = now.getTime() - postDate.getTime();
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) {
    return "just now";
  } else if (diffHours < 1) {
    return `${diffMinutes}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 30) {
    return `${diffDays}d ago`;
  } else {
    return formatUtcToLocal(utcDateString, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
}