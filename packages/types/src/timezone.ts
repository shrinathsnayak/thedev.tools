/**
 * Timezone-related type definitions
 */

export interface TimezoneInfo {
  name: string;
  offset: number; // UTC offset in minutes
  abbreviation: string;
  utc: string[];
}

