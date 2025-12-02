/**
 * License-related type definitions
 */

export type LicenseType =
  | "MIT"
  | "Apache-2.0"
  | "GPL-3.0"
  | "BSD-3-Clause"
  | "BSD-2-Clause"
  | "ISC"
  | "Unlicense"
  | "MPL-2.0";

export interface LicenseInfo {
  type: LicenseType;
  name: string;
  spdxId: string;
  description: string;
  url: string;
}

export interface LicenseOptions {
  year?: string | number;
  copyrightHolder?: string;
  projectName?: string;
}

