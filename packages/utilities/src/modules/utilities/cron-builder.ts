/**
 * Cron expression builder and validator utilities
 */

import type { CronField, CronExpression, CronInfo } from "@workspace/types/cron";
import { CRON_FIELDS, COMMON_CRON_EXPRESSIONS } from "@workspace/constants/cron";

// Re-export for backward compatibility
export type { CronField, CronExpression, CronInfo } from "@workspace/types/cron";
export { CRON_FIELDS, COMMON_CRON_EXPRESSIONS } from "@workspace/constants/cron";

/**
 * Validates cron expression
 * @param expression - Cron expression string
 * @returns Validation result
 */
export function validateCronExpression(expression: string): {
  isValid: boolean;
  error?: string;
  fields?: CronExpression;
} {
  const parts = expression.trim().split(/\s+/);

  if (parts.length < 5 || parts.length > 6) {
    return {
      isValid: false,
      error: "Cron expression must have 5 or 6 fields",
    };
  }

  const [minute, hour, dayOfMonth, month, dayOfWeek, year] = parts;

  if (!minute || !hour || !dayOfMonth || !month || !dayOfWeek) {
    return { isValid: false, error: "Missing required cron fields" };
  }

  try {
    // Validate each field
    if (!validateCronField(minute, 0, 59)) {
      return { isValid: false, error: "Invalid minute field" };
    }
    if (!validateCronField(hour, 0, 23)) {
      return { isValid: false, error: "Invalid hour field" };
    }
    if (!validateCronField(dayOfMonth, 1, 31)) {
      return { isValid: false, error: "Invalid day of month field" };
    }
    if (!validateCronField(month, 1, 12)) {
      return { isValid: false, error: "Invalid month field" };
    }
    if (!validateCronField(dayOfWeek, 0, 7)) {
      return { isValid: false, error: "Invalid day of week field" };
    }
    if (year && !validateCronField(year, 1970, 2099)) {
      return { isValid: false, error: "Invalid year field" };
    }

    return {
      isValid: true,
      fields: {
        minute,
        hour,
        dayOfMonth,
        month,
        dayOfWeek,
        year,
      },
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : "Invalid cron expression",
    };
  }
}

/**
 * Validates a single cron field
 */
function validateCronField(field: string, min: number, max: number): boolean {
  if (field === "*") return true;
  if (field === "?") return true;

  // Check for ranges (e.g., "1-5")
  if (field.includes("-")) {
    const parts = field.split("-");
    if (parts.length !== 2 || !parts[0] || !parts[1]) return false;
    const start = Number(parts[0]);
    const end = Number(parts[1]);
    return (
      !isNaN(start) && !isNaN(end) && start >= min && end <= max && start <= end
    );
  }

  // Check for lists (e.g., "1,3,5")
  if (field.includes(",")) {
    return field.split(",").every((val) => {
      const num = parseInt(val.trim(), 10);
      return !isNaN(num) && num >= min && num <= max;
    });
  }

  // Check for step values (e.g., "*/5", "1-10/2")
  if (field.includes("/")) {
    const parts = field.split("/");
    if (parts.length !== 2 || !parts[1]) return false;
    const [range, step] = parts;
    const stepNum = parseInt(step, 10);
    if (isNaN(stepNum) || stepNum < 1) return false;

    if (range === "*") return true;
    if (range && range.includes("-")) {
      const rangeParts = range.split("-");
      if (rangeParts.length !== 2 || !rangeParts[0] || !rangeParts[1])
        return false;
      const start = Number(rangeParts[0]);
      const end = Number(rangeParts[1]);
      return !isNaN(start) && !isNaN(end) && start >= min && end <= max;
    }
    if (!range) return false;
    const num = parseInt(range, 10);
    return !isNaN(num) && num >= min && num <= max;
  }

  // Check for special characters (L, W, #) - simplified validation
  if (/[LW#]/.test(field)) {
    return true; // Basic validation, actual meaning depends on context
  }

  // Check for simple number
  const num = parseInt(field, 10);
  return !isNaN(num) && num >= min && num <= max;
}

/**
 * Builds cron expression from fields
 * @param fields - Cron expression fields
 * @returns Cron expression string
 */
export function buildCronExpression(fields: CronExpression): string {
  const parts = [
    fields.minute,
    fields.hour,
    fields.dayOfMonth,
    fields.month,
    fields.dayOfWeek,
  ];

  if (fields.year) {
    parts.push(fields.year);
  }

  return parts.join(" ");
}

/**
 * Gets human-readable description of cron expression
 * @param expression - Cron expression string
 * @returns Human-readable description
 */
export function describeCronExpression(expression: string): string {
  const validation = validateCronExpression(expression);
  if (!validation.isValid || !validation.fields) {
    return "Invalid cron expression";
  }

  const { fields } = validation;
  const parts: string[] = [];

  // Minute
  if (fields.minute === "*") {
    parts.push("every minute");
  } else if (fields.minute.includes("/")) {
    const step = fields.minute.split("/")[1];
    parts.push(`every ${step} minutes`);
  } else if (fields.minute !== "0") {
    parts.push(`at minute ${fields.minute}`);
  }

  // Hour
  if (fields.hour === "*") {
    parts.push("every hour");
  } else if (fields.hour.includes("/")) {
    const step = fields.hour.split("/")[1];
    parts.push(`every ${step} hours`);
  } else if (fields.hour !== "*" && fields.minute === "*") {
    parts.push(`at hour ${fields.hour}`);
  } else if (fields.hour !== "0") {
    parts.push(`at ${fields.hour}:00`);
  }

  // Day of month
  if (fields.dayOfMonth === "*") {
    // No specific day
  } else if (fields.dayOfMonth.includes("/")) {
    const step = fields.dayOfMonth.split("/")[1];
    parts.push(`every ${step} days`);
  } else if (fields.dayOfMonth !== "*") {
    parts.push(`on day ${fields.dayOfMonth} of the month`);
  }

  // Month
  if (fields.month === "*") {
    // Every month
  } else if (fields.month !== "*") {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthNum = parseInt(fields.month, 10);
    if (
      !isNaN(monthNum) &&
      monthNum >= 1 &&
      monthNum <= 12 &&
      monthNames[monthNum - 1]
    ) {
      parts.push(`in ${monthNames[monthNum - 1]}`);
    }
  }

  // Day of week
  if (fields.dayOfWeek === "*") {
    // Every day of week
  } else if (fields.dayOfWeek !== "*" && fields.dayOfWeek !== "?") {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    if (fields.dayOfWeek.includes("-")) {
      const dayParts = fields.dayOfWeek.split("-");
      if (dayParts.length === 2 && dayParts[0] && dayParts[1]) {
        const start = Number(dayParts[0]);
        const end = Number(dayParts[1]);
        if (
          !isNaN(start) &&
          !isNaN(end) &&
          dayNames[start % 7] &&
          dayNames[end % 7]
        ) {
          parts.push(`from ${dayNames[start % 7]} to ${dayNames[end % 7]}`);
        }
      }
    } else if (fields.dayOfWeek.includes(",")) {
      const days = fields.dayOfWeek.split(",").map((d) => {
        const num = parseInt(d.trim(), 10);
        return dayNames[num % 7];
      });
      parts.push(`on ${days.join(", ")}`);
    } else {
      const dayNum = parseInt(fields.dayOfWeek, 10);
      if (!isNaN(dayNum)) {
        parts.push(`on ${dayNames[dayNum % 7]}`);
      }
    }
  }

  return parts.length > 0 ? parts.join(" ") : "Invalid expression";
}

/**
 * Gets next run time for cron expression (simplified - doesn't account for all edge cases)
 * @param expression - Cron expression string
 * @param fromDate - Starting date (defaults to now)
 * @returns Next run time as ISO string
 */
export function getNextCronRun(
  expression: string,
  fromDate: Date = new Date(),
): string | null {
  const validation = validateCronExpression(expression);
  if (!validation.isValid || !validation.fields) {
    return null;
  }

  // Simplified calculation - for full implementation, use a cron library
  // This is a basic approximation
  const next = new Date(fromDate);
  next.setMinutes(next.getMinutes() + 1);
  next.setSeconds(0);
  next.setMilliseconds(0);

  return next.toISOString();
}
