/**
 * Date range generation utilities
 */

export interface DateRange {
  start: Date;
  end: Date;
  dates: Date[];
  formatted: {
    iso: string[];
    locale: string[];
    unix: number[];
  };
}

export interface DateRangeOptions {
  format?: "iso" | "locale" | "unix" | "custom";
  customFormat?: (date: Date) => string;
  includeWeekends?: boolean;
  step?: number; // Days to step
  count?: number; // Number of dates to generate
}

/**
 * Generates date range between two dates with optional filtering and formatting
 * @param startDate - Start date (Date object or ISO string)
 * @param endDate - End date (Date object or ISO string)
 * @param options - Generation options (format, customFormat, includeWeekends, step)
 * @returns Date range object with dates array and formatted outputs
 * @throws Error if start date is after end date
 */
export function generateDateRange(
  startDate: Date | string,
  endDate: Date | string,
  options: DateRangeOptions = {},
): DateRange {
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;

  if (start > end) {
    throw new Error("Start date must be before end date");
  }

  const {
    includeWeekends = true,
    step = 1,
    format = "iso",
    customFormat,
  } = options;

  const dates: Date[] = [];
  const current = new Date(start);

  while (current <= end) {
    const dayOfWeek = current.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    if (includeWeekends || !isWeekend) {
      dates.push(new Date(current));
    }

    current.setDate(current.getDate() + step);
  }

  const iso = dates.map((d) => d.toISOString());
  const locale = dates.map((d) => d.toLocaleDateString());
  const unix = dates.map((d) => Math.floor(d.getTime() / 1000));
  const custom = customFormat ? dates.map(customFormat) : [];

  return {
    start,
    end,
    dates,
    formatted: {
      iso,
      locale,
      unix,
    },
  };
}

/**
 * Generates a sequence of dates starting from a given date
 * @param startDate - Start date (Date object or ISO string)
 * @param count - Number of dates to generate
 * @param options - Generation options (step, includeWeekends)
 * @returns Date range object with generated dates
 * @throws Error if date generation fails
 */
export function generateDateSequence(
  startDate: Date | string,
  count: number,
  options: Omit<DateRangeOptions, "count"> = {},
): DateRange {
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const { step = 1, includeWeekends = true } = options;

  const dates: Date[] = [];
  const current = new Date(start);
  let generated = 0;

  while (generated < count) {
    const dayOfWeek = current.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    if (includeWeekends || !isWeekend) {
      dates.push(new Date(current));
      generated++;
    }

    current.setDate(current.getDate() + step);
  }

  const end = dates[dates.length - 1];

  if (!end) {
    throw new Error("Failed to generate dates");
  }

  const iso = dates.map((d) => d.toISOString());
  const locale = dates.map((d) => d.toLocaleDateString());
  const unix = dates.map((d) => Math.floor(d.getTime() / 1000));

  return {
    start,
    end,
    dates,
    formatted: {
      iso,
      locale,
      unix,
    },
  };
}

/**
 * Generates business days only (Monday-Friday, excluding weekends)
 * @param startDate - Start date (Date object or ISO string)
 * @param endDate - End date (Date object or ISO string)
 * @param options - Generation options (excluding includeWeekends)
 * @returns Date range object with only business days
 */
export function generateBusinessDays(
  startDate: Date | string,
  endDate: Date | string,
  options: Omit<DateRangeOptions, "includeWeekends"> = {},
): DateRange {
  return generateDateRange(startDate, endDate, {
    ...options,
    includeWeekends: false,
  });
}

/**
 * Generates dates for a specific day of week within a date range
 * @param startDate - Start date (Date object or ISO string)
 * @param endDate - End date (Date object or ISO string)
 * @param dayOfWeek - Day of week (0=Sunday, 1=Monday, ..., 6=Saturday)
 * @returns Date range object with dates matching the specified day of week
 * @throws Error if dayOfWeek is not between 0 and 6
 */
export function generateDatesByDayOfWeek(
  startDate: Date | string,
  endDate: Date | string,
  dayOfWeek: number,
): DateRange {
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;

  if (dayOfWeek < 0 || dayOfWeek > 6) {
    throw new Error("Day of week must be between 0 (Sunday) and 6 (Saturday)");
  }

  const dates: Date[] = [];
  const current = new Date(start);

  while (current.getDay() !== dayOfWeek && current <= end) {
    current.setDate(current.getDate() + 1);
  }

  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 7);
  }

  const iso = dates.map((d) => d.toISOString());
  const locale = dates.map((d) => d.toLocaleDateString());
  const unix = dates.map((d) => Math.floor(d.getTime() / 1000));

  return {
    start,
    end,
    dates,
    formatted: {
      iso,
      locale,
      unix,
    },
  };
}

/**
 * Generates dates for the first day of each month within a date range
 * @param startDate - Start date (Date object or ISO string)
 * @param endDate - End date (Date object or ISO string)
 * @returns Date range object with first-of-month dates
 */
export function generateMonthlyDates(
  startDate: Date | string,
  endDate: Date | string,
): DateRange {
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;

  const dates: Date[] = [];
  const current = new Date(start.getFullYear(), start.getMonth(), 1);

  while (current <= end) {
    dates.push(new Date(current));
    current.setMonth(current.getMonth() + 1);
  }

  const iso = dates.map((d) => d.toISOString());
  const locale = dates.map((d) => d.toLocaleDateString());
  const unix = dates.map((d) => Math.floor(d.getTime() / 1000));

  return {
    start,
    end,
    dates,
    formatted: {
      iso,
      locale,
      unix,
    },
  };
}

/**
 * Generates date ranges grouped by specified day intervals
 * @param startDate - Start date (Date object or ISO string)
 * @param endDate - End date (Date object or ISO string)
 * @param intervalDays - Number of days per interval
 * @returns Array of DateRange objects, one per interval
 */
export function generateDateIntervals(
  startDate: Date | string,
  endDate: Date | string,
  intervalDays: number,
): DateRange[] {
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;

  const intervals: DateRange[] = [];
  let currentStart = new Date(start);

  while (currentStart < end) {
    const currentEnd = new Date(currentStart);
    currentEnd.setDate(currentEnd.getDate() + intervalDays - 1);

    if (currentEnd > end) {
      currentEnd.setTime(end.getTime());
    }

    intervals.push(generateDateRange(currentStart, currentEnd));

    currentStart = new Date(currentEnd);
    currentStart.setDate(currentStart.getDate() + 1);
  }

  return intervals;
}
