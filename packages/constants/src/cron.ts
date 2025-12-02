/**
 * Cron-related constants
 */

import type { CronField, CronInfo } from "@workspace/types/cron";

/**
 * Cron field definitions
 */
export const CRON_FIELDS: Record<string, CronField> = {
  minute: {
    name: "Minute",
    min: 0,
    max: 59,
    allowed: ["*", "/", "-", ","],
  },
  hour: {
    name: "Hour",
    min: 0,
    max: 23,
    allowed: ["*", "/", "-", ","],
  },
  dayOfMonth: {
    name: "Day of Month",
    min: 1,
    max: 31,
    allowed: ["*", "/", "-", ",", "?", "L", "W"],
  },
  month: {
    name: "Month",
    min: 1,
    max: 12,
    allowed: ["*", "/", "-", ","],
  },
  dayOfWeek: {
    name: "Day of Week",
    min: 0,
    max: 7, // 0 and 7 both represent Sunday
    allowed: ["*", "/", "-", ",", "?", "L", "#"],
  },
};

/**
 * Common cron expressions
 */
export const COMMON_CRON_EXPRESSIONS: Record<string, CronInfo> = {
  "every-minute": {
    expression: "* * * * *",
    description: "Every minute",
    isValid: true,
  },
  "every-hour": {
    expression: "0 * * * *",
    description: "Every hour at minute 0",
    isValid: true,
  },
  "every-day": {
    expression: "0 0 * * *",
    description: "Every day at midnight",
    isValid: true,
  },
  "every-week": {
    expression: "0 0 * * 0",
    description: "Every Sunday at midnight",
    isValid: true,
  },
  "every-month": {
    expression: "0 0 1 * *",
    description: "First day of every month at midnight",
    isValid: true,
  },
  "every-weekday": {
    expression: "0 0 * * 1-5",
    description: "Every weekday at midnight",
    isValid: true,
  },
  "every-15-minutes": {
    expression: "*/15 * * * *",
    description: "Every 15 minutes",
    isValid: true,
  },
  "every-30-minutes": {
    expression: "*/30 * * * *",
    description: "Every 30 minutes",
    isValid: true,
  },
};

