/**
 * App version utility
 * Gets version from Vercel deployment ID (git commit SHA) set at build time
 */

/**
 * Gets the current app version from Vercel deployment ID
 * On Vercel, this will be the git commit SHA
 * Locally, it will show "local" or the branch name if available
 */
export function getAppVersion(): string {
  return process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_ID || "local";
}

/**
 * Gets a shortened version of the deployment ID (first 7 characters)
 * Useful for displaying a shorter version string
 */
export function getShortVersion(): string {
  const version = getAppVersion();
  return version.length > 7 ? version.substring(0, 7) : version;
}

/**
 * App version constant (full)
 */
export const APP_VERSION = getAppVersion();

/**
 * App version constant (short)
 */
export const APP_VERSION_SHORT = getShortVersion();
