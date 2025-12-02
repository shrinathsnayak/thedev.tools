/**
 * robots.txt file generator
 */

export interface RobotsRule {
  userAgent: string | string[];
  allow?: string | string[];
  disallow?: string | string[];
  crawlDelay?: number;
}

export interface RobotsConfig {
  rules?: RobotsRule[];
  sitemap?: string | string[];
}

/**
 * Generates robots.txt content
 * @param config - Robots.txt configuration
 * @returns robots.txt content as string
 */
export function generateRobotsTxt(config: RobotsConfig = {}): string {
  const lines: string[] = [];

  if (config.rules && config.rules.length > 0) {
    for (const rule of config.rules) {
      const userAgents = Array.isArray(rule.userAgent)
        ? rule.userAgent
        : [rule.userAgent];

      for (const userAgent of userAgents) {
        lines.push(`User-agent: ${userAgent}`);

        if (rule.allow) {
          const allows = Array.isArray(rule.allow) ? rule.allow : [rule.allow];
          for (const path of allows) {
            lines.push(`Allow: ${path}`);
          }
        }

        if (rule.disallow) {
          const disallows = Array.isArray(rule.disallow)
            ? rule.disallow
            : [rule.disallow];
          for (const path of disallows) {
            lines.push(`Disallow: ${path}`);
          }
        }

        if (rule.crawlDelay !== undefined) {
          lines.push(`Crawl-delay: ${rule.crawlDelay}`);
        }

        lines.push("");
      }
    }
  } else {
    lines.push("User-agent: *");
    lines.push("Allow: /");
    lines.push("");
  }

  if (config.sitemap) {
    const sitemaps = Array.isArray(config.sitemap)
      ? config.sitemap
      : [config.sitemap];
    for (const sitemap of sitemaps) {
      lines.push(`Sitemap: ${sitemap}`);
    }
  }

  return lines.join("\n").trim();
}

/**
 * Generates default robots.txt (allow all)
 * @param sitemapUrl - Optional sitemap URL
 * @returns robots.txt content
 */
export function generateDefaultRobotsTxt(sitemapUrl?: string): string {
  return generateRobotsTxt({
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: sitemapUrl,
  });
}

/**
 * Generates restrictive robots.txt (disallow all)
 * @returns robots.txt content
 */
export function generateRestrictiveRobotsTxt(): string {
  return generateRobotsTxt({
    rules: [
      {
        userAgent: "*",
        disallow: "/",
      },
    ],
  });
}

/**
 * Validates robots.txt content syntax
 * @param content - robots.txt content string to validate
 * @returns Validation result with errors array
 */
export function validateRobotsTxt(content: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const lines = content.split("\n");

  let hasUserAgent = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]?.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    if (line.toLowerCase().startsWith("user-agent:")) {
      hasUserAgent = true;
      const value = line.substring(11).trim();
      if (!value) {
        errors.push(`Line ${i + 1}: User-agent value is missing`);
      }
    } else if (
      line.toLowerCase().startsWith("allow:") ||
      line.toLowerCase().startsWith("disallow:")
    ) {
      if (!hasUserAgent) {
        errors.push(
          `Line ${i + 1}: Allow/Disallow directive must follow User-agent`,
        );
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
