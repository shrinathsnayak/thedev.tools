/**
 * Browser compatibility checker utilities
 * Uses static compatibility data
 */

export type Browser = "chrome" | "firefox" | "safari" | "edge" | "opera" | "ie";
export type Feature = string;

export interface CompatibilityInfo {
  feature: string;
  browsers: Record<
    Browser,
    {
      supported: boolean;
      version?: string;
      notes?: string;
    }
  >;
}

/**
 * Common web features and their browser support
 */
const COMPATIBILITY_DATA: Record<string, CompatibilityInfo> = {
  "css-grid": {
    feature: "CSS Grid",
    browsers: {
      chrome: { supported: true, version: "57" },
      firefox: { supported: true, version: "52" },
      safari: { supported: true, version: "10.1" },
      edge: { supported: true, version: "16" },
      opera: { supported: true, version: "44" },
      ie: { supported: false },
    },
  },
  flexbox: {
    feature: "Flexbox",
    browsers: {
      chrome: { supported: true, version: "29" },
      firefox: { supported: true, version: "28" },
      safari: { supported: true, version: "9" },
      edge: { supported: true, version: "12" },
      opera: { supported: true, version: "16" },
      ie: { supported: true, version: "11", notes: "Partial support" },
    },
  },
  "css-variables": {
    feature: "CSS Custom Properties",
    browsers: {
      chrome: { supported: true, version: "49" },
      firefox: { supported: true, version: "31" },
      safari: { supported: true, version: "9.1" },
      edge: { supported: true, version: "15" },
      opera: { supported: true, version: "36" },
      ie: { supported: false },
    },
  },
  "fetch-api": {
    feature: "Fetch API",
    browsers: {
      chrome: { supported: true, version: "42" },
      firefox: { supported: true, version: "39" },
      safari: { supported: true, version: "10.1" },
      edge: { supported: true, version: "14" },
      opera: { supported: true, version: "29" },
      ie: { supported: false },
    },
  },
  "async-await": {
    feature: "Async/Await",
    browsers: {
      chrome: { supported: true, version: "55" },
      firefox: { supported: true, version: "52" },
      safari: { supported: true, version: "10.1" },
      edge: { supported: true, version: "14" },
      opera: { supported: true, version: "42" },
      ie: { supported: false },
    },
  },
  "es6-classes": {
    feature: "ES6 Classes",
    browsers: {
      chrome: { supported: true, version: "49" },
      firefox: { supported: true, version: "45" },
      safari: { supported: true, version: "9" },
      edge: { supported: true, version: "13" },
      opera: { supported: true, version: "36" },
      ie: { supported: false },
    },
  },
  "web-components": {
    feature: "Web Components",
    browsers: {
      chrome: { supported: true, version: "67" },
      firefox: { supported: true, version: "63" },
      safari: { supported: true, version: "10.1", notes: "Partial support" },
      edge: { supported: true, version: "79" },
      opera: { supported: true, version: "54" },
      ie: { supported: false },
    },
  },
};

/**
 * Checks browser compatibility information for a web feature
 * @param feature - Feature name or key (e.g., "css-grid", "flexbox")
 * @returns Compatibility info object or null if feature not found
 */
export function checkCompatibility(feature: string): CompatibilityInfo | null {
  const key = feature.toLowerCase().replace(/\s+/g, "-");
  return COMPATIBILITY_DATA[key] || null;
}

/**
 * Gets list of all supported features in the compatibility database
 * @returns Array of feature name strings
 */
export function getSupportedFeatures(): string[] {
  return Object.keys(COMPATIBILITY_DATA);
}

/**
 * Checks if a specific feature is supported in a specific browser
 * @param feature - Feature name or key
 * @param browser - Browser name (chrome, firefox, safari, edge, opera, ie)
 * @returns True if feature is supported in the specified browser
 */
export function isFeatureSupported(feature: string, browser: Browser): boolean {
  const compat = checkCompatibility(feature);
  if (!compat) return false;
  return compat.browsers[browser]?.supported || false;
}

/**
 * Gets minimum browser versions required for feature support
 * @param feature - Feature name or key
 * @returns Object mapping browser names to minimum version strings (or null if not supported)
 */
export function getMinimumVersions(
  feature: string,
): Record<Browser, string | null> {
  const compat = checkCompatibility(feature);
  if (!compat) {
    return {
      chrome: null,
      firefox: null,
      safari: null,
      edge: null,
      opera: null,
      ie: null,
    };
  }

  return {
    chrome: compat.browsers.chrome?.version || null,
    firefox: compat.browsers.firefox?.version || null,
    safari: compat.browsers.safari?.version || null,
    edge: compat.browsers.edge?.version || null,
    opera: compat.browsers.opera?.version || null,
    ie: compat.browsers.ie?.version || null,
  };
}

/**
 * Gets browser support summary categorized by support level
 * @param feature - Feature name or key
 * @returns Object with arrays of browsers by support level (fullySupported, partiallySupported, notSupported)
 */
export function getSupportSummary(feature: string): {
  fullySupported: Browser[];
  partiallySupported: Browser[];
  notSupported: Browser[];
} {
  const compat = checkCompatibility(feature);
  if (!compat) {
    return {
      fullySupported: [],
      partiallySupported: [],
      notSupported: ["chrome", "firefox", "safari", "edge", "opera", "ie"],
    };
  }

  const fullySupported: Browser[] = [];
  const partiallySupported: Browser[] = [];
  const notSupported: Browser[] = [];

  Object.entries(compat.browsers).forEach(([browser, info]) => {
    if (info.supported) {
      if (info.notes?.toLowerCase().includes("partial")) {
        partiallySupported.push(browser as Browser);
      } else {
        fullySupported.push(browser as Browser);
      }
    } else {
      notSupported.push(browser as Browser);
    }
  });

  return {
    fullySupported,
    partiallySupported,
    notSupported,
  };
}
