/**
 * Timezone conversion utilities
 */

import type { TimezoneInfo } from "@workspace/types/timezone";
import { COMMON_TIMEZONES } from "@workspace/constants/timezone";

// Re-export for backward compatibility
export type { TimezoneInfo } from "@workspace/types/timezone";
export { COMMON_TIMEZONES } from "@workspace/constants/timezone";

/**
 * Converts a date/time from one timezone to another
 * @param date - Date object or ISO string
 * @param fromTimezone - Source timezone (IANA timezone name or UTC offset in minutes)
 * @param toTimezone - Target timezone (IANA timezone name or UTC offset in minutes)
 * @returns Converted date string in ISO format
 */
export function convertTimezone(
  date: Date | string,
  fromTimezone: string | number,
  toTimezone: string | number,
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const fromOffset =
    typeof fromTimezone === "number"
      ? fromTimezone
      : getTimezoneOffset(fromTimezone);
  const toOffset =
    typeof toTimezone === "number" ? toTimezone : getTimezoneOffset(toTimezone);

  // Calculate the difference in minutes
  const offsetDiff = toOffset - fromOffset;

  // Create new date with adjusted time
  const convertedDate = new Date(dateObj.getTime() + offsetDiff * 60 * 1000);

  return convertedDate.toISOString();
}

/**
 * Gets UTC offset for a timezone (in minutes)
 * @param timezone - IANA timezone name or UTC offset string (e.g., "UTC+5:30")
 * @returns Offset in minutes from UTC
 */
export function getTimezoneOffset(timezone: string): number {
  // Check if it's a known timezone
  if (COMMON_TIMEZONES[timezone]) {
    return COMMON_TIMEZONES[timezone].offset;
  }

  // Parse UTC offset string (e.g., "UTC+5:30", "UTC-8", "+05:30")
  const utcMatch = timezone.match(/UTC?([+-]?)(\d{1,2}):?(\d{2})?/i);
  if (utcMatch) {
    const sign = utcMatch[1] === "-" ? -1 : 1;
    const hours = parseInt(utcMatch[2] || "0", 10);
    const minutes = parseInt(utcMatch[3] || "0", 10);
    return sign * (hours * 60 + minutes);
  }

  // Try to use Intl API if available (browser only)
  try {
    const date = new Date();
    const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
    const tzDate = new Date(
      date.toLocaleString("en-US", { timeZone: timezone }),
    );
    return (tzDate.getTime() - utcDate.getTime()) / (1000 * 60);
  } catch {
    // Fallback to UTC
    return 0;
  }
}

/**
 * Gets timezone information for a date
 * @param date - Date object or ISO string
 * @param timezone - IANA timezone name or UTC offset
 * @returns Formatted date string in the specified timezone
 */
export function formatInTimezone(
  date: Date | string,
  timezone: string | number,
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const offset =
    typeof timezone === "number" ? timezone : getTimezoneOffset(timezone);

  const utcTime = dateObj.getTime() + dateObj.getTimezoneOffset() * 60 * 1000;
  const targetTime = new Date(utcTime + offset * 60 * 1000);

  return targetTime.toISOString();
}

/**
 * Gets all timezone information for a date
 * @param date - Date object or ISO string
 * @returns Object with date in multiple timezone formats
 */
export function getTimezoneInfo(date: Date | string): {
  utc: string;
  local: string;
  iso: string;
  unix: number;
  timezones: Record<string, string>;
} {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const timezones: Record<string, string> = {};

  // Get date in common timezones
  for (const [tz, info] of Object.entries(COMMON_TIMEZONES)) {
    timezones[tz] = formatInTimezone(dateObj, info.offset);
  }

  return {
    utc: dateObj.toUTCString(),
    local: dateObj.toLocaleString(),
    iso: dateObj.toISOString(),
    unix: Math.floor(dateObj.getTime() / 1000),
    timezones,
  };
}

/**
 * Validates timezone string
 * @param timezone - Timezone to validate
 * @returns True if valid timezone
 */
export function validateTimezone(timezone: string): boolean {
  if (COMMON_TIMEZONES[timezone]) {
    return true;
  }

  // Check UTC offset format
  if (/UTC?([+-]?)(\d{1,2}):?(\d{2})?/i.test(timezone)) {
    return true;
  }

  // Try to use Intl API
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets list of all available timezones
 * @returns Array of timezone names
 */
export function getAvailableTimezones(): string[] {
  return Object.keys(COMMON_TIMEZONES);
}
