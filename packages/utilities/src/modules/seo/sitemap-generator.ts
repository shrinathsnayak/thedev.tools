/**
 * XML Sitemap generator
 */

import { escapeXml } from "../../utils/escape";

export interface SitemapUrl {
  loc: string;
  lastmod?: string | Date;
  changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
}

export interface SitemapConfig {
  urls: SitemapUrl[];
  xmlns?: string;
}

/**
 * Formats date for sitemap in ISO 8601 format
 * @param date - Date string or Date object
 * @returns ISO 8601 date string (YYYY-MM-DD)
 */
function _formatSitemapDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const iso = d.toISOString();
  const datePart = iso.split("T")[0];
  return datePart || iso;
}

/**
 * Validates and normalizes priority value to range 0.0 to 1.0
 * @param priority - Priority value to validate
 * @returns Validated priority value rounded to 1 decimal place
 */
function _validatePriority(priority: number): number {
  if (priority < 0) return 0;
  if (priority > 1) return 1;
  return Math.round(priority * 10) / 10; // Round to 1 decimal
}

/**
 * Generates XML sitemap from URL configuration
 * @param config - Sitemap configuration with URLs and optional xmlns
 * @returns Complete XML sitemap string
 * @throws Error if no URLs provided
 */
export function generateSitemap(config: SitemapConfig): string {
  const { urls, xmlns = "http://www.sitemaps.org/schemas/sitemap/0.9" } =
    config;

  if (!urls || urls.length === 0) {
    throw new Error("Sitemap must contain at least one URL");
  }

  const xml: string[] = [];
  xml.push('<?xml version="1.0" encoding="UTF-8"?>');
  xml.push(`<urlset xmlns="${xmlns}">`);

  for (const url of urls) {
    if (!url.loc) {
      continue; // Skip URLs without location
    }

    xml.push("  <url>");
    xml.push(`    <loc>${escapeXml(url.loc)}</loc>`);

    if (url.lastmod) {
      xml.push(`    <lastmod>${_formatSitemapDate(url.lastmod)}</lastmod>`);
    }

    if (url.changefreq) {
      xml.push(`    <changefreq>${url.changefreq}</changefreq>`);
    }

    if (url.priority !== undefined) {
      const priority = _validatePriority(url.priority);
      xml.push(`    <priority>${priority}</priority>`);
    }

    xml.push("  </url>");
  }

  xml.push("</urlset>");

  return xml.join("\n");
}


/**
 * Validates sitemap URLs for format, count limits, and data correctness
 * @param urls - Array of sitemap URL objects to validate
 * @returns Validation result with errors array
 */
export function validateSitemapUrls(urls: SitemapUrl[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (urls.length === 0) {
    errors.push("Sitemap must contain at least one URL");
  }

  if (urls.length > 50000) {
    errors.push("Sitemap cannot contain more than 50,000 URLs");
  }

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    if (!url) {
      errors.push(`URL ${i + 1}: Missing URL entry`);
      continue;
    }

    if (!url.loc) {
      errors.push(`URL ${i + 1}: Missing location (loc) field`);
      continue;
    }

    try {
      new URL(url.loc);
    } catch {
      errors.push(`URL ${i + 1}: Invalid URL format: ${url.loc}`);
    }

    if (url.priority !== undefined && (url.priority < 0 || url.priority > 1)) {
      errors.push(
        `URL ${i + 1}: Priority must be between 0.0 and 1.0, got ${url.priority}`,
      );
    }

    if (url.lastmod) {
      const date =
        typeof url.lastmod === "string" ? new Date(url.lastmod) : url.lastmod;
      if (isNaN(date.getTime())) {
        errors.push(`URL ${i + 1}: Invalid lastmod date: ${url.lastmod}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Creates sitemap from simple array of URL strings
 * @param urls - Array of URL strings
 * @returns XML sitemap string
 */
export function generateSimpleSitemap(urls: string[]): string {
  return generateSitemap({
    urls: urls.map((loc) => ({ loc })),
  });
}
