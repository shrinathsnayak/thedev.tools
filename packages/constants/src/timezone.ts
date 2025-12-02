/**
 * Timezone-related constants
 */

import type { TimezoneInfo } from "@workspace/types/timezone";

/**
 * Common timezones with their UTC offsets
 */
export const COMMON_TIMEZONES: Record<string, TimezoneInfo> = {
  UTC: { name: "UTC", offset: 0, abbreviation: "UTC", utc: ["UTC"] },
  "America/New_York": {
    name: "Eastern Time (US & Canada)",
    offset: -300,
    abbreviation: "EST/EDT",
    utc: ["UTC-5", "UTC-4"],
  },
  "America/Chicago": {
    name: "Central Time (US & Canada)",
    offset: -360,
    abbreviation: "CST/CDT",
    utc: ["UTC-6", "UTC-5"],
  },
  "America/Denver": {
    name: "Mountain Time (US & Canada)",
    offset: -420,
    abbreviation: "MST/MDT",
    utc: ["UTC-7", "UTC-6"],
  },
  "America/Los_Angeles": {
    name: "Pacific Time (US & Canada)",
    offset: -480,
    abbreviation: "PST/PDT",
    utc: ["UTC-8", "UTC-7"],
  },
  "Europe/London": {
    name: "London",
    offset: 0,
    abbreviation: "GMT/BST",
    utc: ["UTC+0", "UTC+1"],
  },
  "Europe/Paris": {
    name: "Paris",
    offset: 60,
    abbreviation: "CET/CEST",
    utc: ["UTC+1", "UTC+2"],
  },
  "Europe/Berlin": {
    name: "Berlin",
    offset: 60,
    abbreviation: "CET/CEST",
    utc: ["UTC+1", "UTC+2"],
  },
  "Asia/Tokyo": {
    name: "Tokyo",
    offset: 540,
    abbreviation: "JST",
    utc: ["UTC+9"],
  },
  "Asia/Shanghai": {
    name: "Shanghai",
    offset: 480,
    abbreviation: "CST",
    utc: ["UTC+8"],
  },
  "Asia/Dubai": {
    name: "Dubai",
    offset: 240,
    abbreviation: "GST",
    utc: ["UTC+4"],
  },
  "Asia/Kolkata": {
    name: "Mumbai, Kolkata",
    offset: 330,
    abbreviation: "IST",
    utc: ["UTC+5:30"],
  },
  "Australia/Sydney": {
    name: "Sydney",
    offset: 660,
    abbreviation: "AEDT/AEST",
    utc: ["UTC+11", "UTC+10"],
  },
};

