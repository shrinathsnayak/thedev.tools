/**
 * Cron-related type definitions
 */

export interface CronField {
  name: string;
  min: number;
  max: number;
  allowed: string[];
}

export interface CronExpression {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
  year?: string;
}

export interface CronInfo {
  expression: string;
  description: string;
  nextRun?: string;
  isValid: boolean;
  error?: string;
}

