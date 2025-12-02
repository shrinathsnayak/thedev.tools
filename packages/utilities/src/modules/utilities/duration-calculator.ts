/**
 * Duration calculation and formatting utilities
 */

export interface Duration {
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  totalMilliseconds: number;
}

export interface DurationFormat {
  iso8601: string;
  human: string;
  short: string;
  detailed: string;
}

/**
 * Calculates duration between two dates and returns breakdown of time components
 * @param startDate - Start date (Date object or ISO string)
 * @param endDate - End date (Date object or ISO string)
 * @returns Duration object with years, months, weeks, days, hours, minutes, seconds, milliseconds
 */
export function calculateDuration(
  startDate: Date | string,
  endDate: Date | string,
): Duration {
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;

  const totalMs = Math.abs(end.getTime() - start.getTime());

  const milliseconds = totalMs % 1000;
  const totalSeconds = Math.floor(totalMs / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;
  const totalDays = Math.floor(totalHours / 24);
  const days = totalDays % 7;
  const weeks = Math.floor(totalDays / 7);
  const months = Math.floor(totalDays / 30);
  const years = Math.floor(totalDays / 365);

  return {
    years,
    months,
    weeks,
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
    totalMilliseconds: totalMs,
  };
}

/**
 * Formats duration as ISO 8601 duration string
 * @param duration - Duration object to format
 * @returns ISO 8601 formatted duration string (e.g., "P1Y2M3DT4H5M6S")
 */
export function formatDurationISO8601(duration: Duration): string {
  const parts: string[] = [];

  if (duration.years > 0) parts.push(`${duration.years}Y`);
  if (duration.months > 0) parts.push(`${duration.months}M`);
  if (duration.days > 0) parts.push(`${duration.days}D`);

  const timeParts: string[] = [];
  if (duration.hours > 0) timeParts.push(`${duration.hours}H`);
  if (duration.minutes > 0) timeParts.push(`${duration.minutes}M`);
  if (duration.seconds > 0) timeParts.push(`${duration.seconds}S`);

  if (timeParts.length > 0) {
    parts.push(`T${timeParts.join("")}`);
  }

  return parts.length > 0 ? `P${parts.join("")}` : "PT0S";
}

/**
 * Formats duration as human-readable string (e.g., "2 years and 3 months")
 * @param duration - Duration object to format
 * @param options - Formatting options (includeZero, maxUnits)
 * @returns Human-readable duration string
 */
export function formatDurationHuman(
  duration: Duration,
  options: {
    includeZero?: boolean;
    maxUnits?: number;
  } = {},
): string {
  const { includeZero = false, maxUnits = 2 } = options;
  const parts: string[] = [];

  const units = [
    { value: duration.years, unit: "year" },
    { value: duration.months, unit: "month" },
    { value: duration.weeks, unit: "week" },
    { value: duration.days, unit: "day" },
    { value: duration.hours, unit: "hour" },
    { value: duration.minutes, unit: "minute" },
    { value: duration.seconds, unit: "second" },
  ];

  for (const { value, unit } of units) {
    if (parts.length >= maxUnits) break;
    if (value > 0 || (includeZero && parts.length === 0)) {
      parts.push(`${value} ${value === 1 ? unit : `${unit}s`}`);
    }
  }

  if (parts.length === 0) {
    return "0 seconds";
  }

  if (parts.length === 1) {
    return parts[0] || "0 seconds";
  }

  if (parts.length === 2) {
    return `${parts[0]} and ${parts[1]}`;
  }

  return `${parts.slice(0, -1).join(", ")}, and ${parts[parts.length - 1]}`;
}

/**
 * Formats duration as short string with abbreviated units
 * @param duration - Duration object to format
 * @returns Short formatted duration string (e.g., "1d 2h 3m")
 */
export function formatDurationShort(duration: Duration): string {
  const parts: string[] = [];

  if (duration.days > 0) parts.push(`${duration.days}d`);
  if (duration.hours > 0) parts.push(`${duration.hours}h`);
  if (duration.minutes > 0) parts.push(`${duration.minutes}m`);
  if (duration.seconds > 0) parts.push(`${duration.seconds}s`);

  return parts.length > 0 ? parts.join(" ") : "0s";
}

/**
 * Formats duration as detailed string with all non-zero components
 * @param duration - Duration object to format
 * @returns Detailed formatted duration string with all components
 */
export function formatDurationDetailed(duration: Duration): string {
  const parts: string[] = [];

  if (duration.years > 0) {
    parts.push(`${duration.years} ${duration.years === 1 ? "year" : "years"}`);
  }
  if (duration.months > 0) {
    parts.push(
      `${duration.months} ${duration.months === 1 ? "month" : "months"}`,
    );
  }
  if (duration.weeks > 0) {
    parts.push(`${duration.weeks} ${duration.weeks === 1 ? "week" : "weeks"}`);
  }
  if (duration.days > 0) {
    parts.push(`${duration.days} ${duration.days === 1 ? "day" : "days"}`);
  }
  if (duration.hours > 0) {
    parts.push(`${duration.hours} ${duration.hours === 1 ? "hour" : "hours"}`);
  }
  if (duration.minutes > 0) {
    parts.push(
      `${duration.minutes} ${duration.minutes === 1 ? "minute" : "minutes"}`,
    );
  }
  if (duration.seconds > 0) {
    parts.push(
      `${duration.seconds} ${duration.seconds === 1 ? "second" : "seconds"}`,
    );
  }
  if (duration.milliseconds > 0) {
    parts.push(
      `${duration.milliseconds} ${duration.milliseconds === 1 ? "millisecond" : "milliseconds"}`,
    );
  }

  return parts.length > 0 ? parts.join(", ") : "0 milliseconds";
}

/**
 * Gets all duration format representations (ISO8601, human, short, detailed)
 * @param duration - Duration object to format
 * @returns Object containing all format strings
 */
export function getDurationFormats(duration: Duration): DurationFormat {
  return {
    iso8601: formatDurationISO8601(duration),
    human: formatDurationHuman(duration),
    short: formatDurationShort(duration),
    detailed: formatDurationDetailed(duration),
  };
}

/**
 * Parses ISO 8601 duration string into Duration object
 * @param durationString - ISO 8601 duration string (e.g., "P1Y2M3DT4H5M6S")
 * @returns Duration object or null if string format is invalid
 */
export function parseISO8601Duration(durationString: string): Duration | null {
  const match = durationString.match(
    /^P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/,
  );

  if (!match) {
    return null;
  }

  const years = parseInt(match[1] || "0", 10);
  const months = parseInt(match[2] || "0", 10);
  const days = parseInt(match[3] || "0", 10);
  const hours = parseInt(match[4] || "0", 10);
  const minutes = parseInt(match[5] || "0", 10);
  const seconds = parseInt(match[6] || "0", 10);

  const totalDays = years * 365 + months * 30 + days;
  const weeks = Math.floor(totalDays / 7);
  const adjustedDays = totalDays % 7;
  const totalMs =
    totalDays * 24 * 60 * 60 * 1000 +
    hours * 60 * 60 * 1000 +
    minutes * 60 * 1000 +
    seconds * 1000;

  return {
    years,
    months,
    weeks,
    days: adjustedDays,
    hours,
    minutes,
    seconds,
    milliseconds: 0,
    totalMilliseconds: totalMs,
  };
}

/**
 * Adds a duration to a date and returns the resulting date
 * @param date - Start date (Date object or ISO string)
 * @param duration - Duration object to add
 * @returns New Date object with duration added
 */
export function addDuration(date: Date | string, duration: Duration): Date {
  const startDate = typeof date === "string" ? new Date(date) : date;
  const result = new Date(startDate);

  result.setFullYear(result.getFullYear() + duration.years);
  result.setMonth(result.getMonth() + duration.months);
  result.setDate(result.getDate() + duration.weeks * 7 + duration.days);
  result.setHours(result.getHours() + duration.hours);
  result.setMinutes(result.getMinutes() + duration.minutes);
  result.setSeconds(result.getSeconds() + duration.seconds);
  result.setMilliseconds(result.getMilliseconds() + duration.milliseconds);

  return result;
}
