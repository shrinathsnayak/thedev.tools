/**
 * Timestamp conversion utilities
 */

export interface TimestampInfo {
  timestamp: number;
  date: Date;
  iso: string;
  local: string;
  utc: string;
  unix: number;
  milliseconds: number;
}

/**
 * Converts UNIX timestamp to Date object
 * @param timestamp - UNIX timestamp (seconds or milliseconds, auto-detected)
 * @returns Date object
 */
export function timestampToDate(timestamp: number): Date {
  const milliseconds = timestamp < 10000000000 ? timestamp * 1000 : timestamp;
  return new Date(milliseconds);
}

/**
 * Converts Date to UNIX timestamp
 * @param date - Date object or date string
 * @param inSeconds - If true, returns seconds; if false, returns milliseconds
 * @returns UNIX timestamp
 */
export function dateToTimestamp(
  date: Date | string,
  inSeconds: boolean = true,
): number {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const milliseconds = dateObj.getTime();

  return inSeconds ? Math.floor(milliseconds / 1000) : milliseconds;
}

/**
 * Gets comprehensive timestamp information
 * @param timestamp - UNIX timestamp (seconds or milliseconds)
 * @returns Object with various timestamp representations
 */
export function getTimestampInfo(timestamp: number): TimestampInfo {
  const date = timestampToDate(timestamp);
  const unixSeconds = Math.floor(date.getTime() / 1000);

  return {
    timestamp: unixSeconds,
    date,
    iso: date.toISOString(),
    local: date.toLocaleString(),
    utc: date.toUTCString(),
    unix: unixSeconds,
    milliseconds: date.getTime(),
  };
}

/**
 * Formats timestamp as relative time (e.g., "2 hours ago")
 * @param timestamp - UNIX timestamp
 * @returns Relative time string
 */
export function formatRelativeTime(timestamp: number): string {
  const date = timestampToDate(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const absDiff = Math.abs(diff);

  const seconds = Math.floor(absDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  const isPast = diff > 0;
  const suffix = isPast ? "ago" : "in";

  if (years > 0) {
    return `${years} ${years === 1 ? "year" : "years"} ${suffix}`;
  }
  if (months > 0) {
    return `${months} ${months === 1 ? "month" : "months"} ${suffix}`;
  }
  if (weeks > 0) {
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ${suffix}`;
  }
  if (days > 0) {
    return `${days} ${days === 1 ? "day" : "days"} ${suffix}`;
  }
  if (hours > 0) {
    return `${hours} ${hours === 1 ? "hour" : "hours"} ${suffix}`;
  }
  if (minutes > 0) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ${suffix}`;
  }
  return `${seconds} ${seconds === 1 ? "second" : "seconds"} ${suffix}`;
}

/**
 * Formats timestamp with custom format string using dayjs
 * @param timestamp - UNIX timestamp (seconds or milliseconds)
 * @param format - Format string (supports dayjs format tokens, default: "YYYY-MM-DD HH:mm:ss")
 * @returns Formatted date string
 */
export function formatTimestamp(
  timestamp: number,
  format: string = "YYYY-MM-DD HH:mm:ss",
): string {
  const dayjs = require("dayjs");
  return dayjs(timestampToDate(timestamp)).format(format);
}

/**
 * Gets current timestamp
 * @param inSeconds - If true, returns seconds; if false, returns milliseconds
 * @returns Current UNIX timestamp
 */
export function getCurrentTimestamp(inSeconds: boolean = true): number {
  return dateToTimestamp(new Date(), inSeconds);
}

/**
 * Validates timestamp value and range
 * @param timestamp - Timestamp to validate
 * @returns True if timestamp is valid number within reasonable range (1900-2100)
 */
export function validateTimestamp(timestamp: number): boolean {
  if (typeof timestamp !== "number" || isNaN(timestamp)) {
    return false;
  }

  const minTimestamp = -2208988800;
  const maxTimestamp = 4102444800;

  const normalized =
    timestamp < 10000000000 ? timestamp : Math.floor(timestamp / 1000);

  return normalized >= minTimestamp && normalized <= maxTimestamp;
}
