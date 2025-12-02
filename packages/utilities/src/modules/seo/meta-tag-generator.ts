/**
 * Meta tag generation utilities for SEO and social media
 */

import { escapeHtml } from "../../utils/escape";

export interface MetaTags {
  // Basic SEO
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;

  // Open Graph (Facebook)
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  ogSiteName?: string;

  // Twitter
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterSite?: string;
  twitterCreator?: string;

  // Additional
  canonical?: string;
  robots?: string;
  viewport?: string;
}

/**
 * Generates HTML meta tags string
 * @param tags - Meta tag configuration
 * @returns HTML string with meta tags
 */
export function generateMetaTags(tags: MetaTags): string {
  const metaTags: string[] = [];

  if (tags.title) {
    metaTags.push(`<title>${escapeHtml(tags.title)}</title>`);
  }

  if (tags.description) {
    metaTags.push(
      `<meta name="description" content="${escapeHtml(tags.description)}">`,
    );
  }

  if (tags.keywords) {
    metaTags.push(
      `<meta name="keywords" content="${escapeHtml(tags.keywords)}">`,
    );
  }

  if (tags.author) {
    metaTags.push(`<meta name="author" content="${escapeHtml(tags.author)}">`);
  }

  if (tags.canonical) {
    metaTags.push(
      `<link rel="canonical" href="${escapeHtml(tags.canonical)}">`,
    );
  }

  if (tags.robots) {
    metaTags.push(`<meta name="robots" content="${escapeHtml(tags.robots)}">`);
  }

  if (tags.viewport) {
    metaTags.push(
      `<meta name="viewport" content="${escapeHtml(tags.viewport)}">`,
    );
  }

  if (tags.ogTitle) {
    metaTags.push(
      `<meta property="og:title" content="${escapeHtml(tags.ogTitle)}">`,
    );
  }

  if (tags.ogDescription) {
    metaTags.push(
      `<meta property="og:description" content="${escapeHtml(tags.ogDescription)}">`,
    );
  }

  if (tags.ogImage) {
    metaTags.push(
      `<meta property="og:image" content="${escapeHtml(tags.ogImage)}">`,
    );
  }

  if (tags.ogUrl) {
    metaTags.push(
      `<meta property="og:url" content="${escapeHtml(tags.ogUrl)}">`,
    );
  }

  if (tags.ogType) {
    metaTags.push(
      `<meta property="og:type" content="${escapeHtml(tags.ogType)}">`,
    );
  }

  if (tags.ogSiteName) {
    metaTags.push(
      `<meta property="og:site_name" content="${escapeHtml(tags.ogSiteName)}">`,
    );
  }

  if (tags.twitterCard) {
    metaTags.push(
      `<meta name="twitter:card" content="${escapeHtml(tags.twitterCard)}">`,
    );
  }

  if (tags.twitterTitle) {
    metaTags.push(
      `<meta name="twitter:title" content="${escapeHtml(tags.twitterTitle)}">`,
    );
  }

  if (tags.twitterDescription) {
    metaTags.push(
      `<meta name="twitter:description" content="${escapeHtml(tags.twitterDescription)}">`,
    );
  }

  if (tags.twitterImage) {
    metaTags.push(
      `<meta name="twitter:image" content="${escapeHtml(tags.twitterImage)}">`,
    );
  }

  if (tags.twitterSite) {
    metaTags.push(
      `<meta name="twitter:site" content="${escapeHtml(tags.twitterSite)}">`,
    );
  }

  if (tags.twitterCreator) {
    metaTags.push(
      `<meta name="twitter:creator" content="${escapeHtml(tags.twitterCreator)}">`,
    );
  }

  return metaTags.join("\n");
}

/**
 * Generates preview HTML for meta tags
 * @param tags - Meta tag configuration
 * @returns HTML string with preview structure
 */
export function generateMetaPreview(tags: MetaTags): string {
  const title = tags.ogTitle || tags.title || "Page Title";
  const description =
    tags.ogDescription || tags.description || "Page description";
  const image = tags.ogImage || "";
  const url = tags.ogUrl || "";

  return `
<div class="meta-preview">
  <div class="meta-preview-url">${escapeHtml(url || "example.com")}</div>
  <div class="meta-preview-title">${escapeHtml(title)}</div>
  <div class="meta-preview-description">${escapeHtml(description)}</div>
  ${image ? `<div class="meta-preview-image"><img src="${escapeHtml(image)}" alt="Preview"></div>` : ""}
</div>
  `.trim();
}


/**
 * Validates meta tag values for SEO best practices
 * @param tags - Meta tags object to validate
 * @returns Validation result with errors array
 */
export function validateMetaTags(tags: MetaTags): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (tags.title && tags.title.length > 60) {
    errors.push("Title should be 60 characters or less");
  }

  if (tags.description && tags.description.length > 160) {
    errors.push("Description should be 160 characters or less");
  }

  if (tags.ogImage && !_isValidUrl(tags.ogImage)) {
    errors.push("OG Image must be a valid URL");
  }

  if (tags.ogUrl && !_isValidUrl(tags.ogUrl)) {
    errors.push("OG URL must be a valid URL");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates URL format
 * @param url - URL string to validate
 * @returns True if URL is valid
 */
function _isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
