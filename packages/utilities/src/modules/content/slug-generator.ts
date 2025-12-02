/**
 * Slug generation utilities
 * Uses 'slugify' package for robust slug generation
 */

import slugifyLib from "slugify";

export interface SlugOptions {
  separator?: string;
  lowerCase?: boolean;
  preserveCase?: boolean;
  maxLength?: number;
  replacement?: string;
  strict?: boolean;
  locale?: string;
}

const defaultOptions: SlugOptions = {
  separator: "-",
  lowerCase: true,
  preserveCase: false,
  maxLength: undefined,
  replacement: "-",
  strict: true,
};

/**
 * Generates URL-friendly slug from text
 * @param text - Text to convert to slug
 * @param options - Slug generation options
 * @returns Generated slug string
 */
export function generateSlug(text: string, options: SlugOptions = {}): string {
  const config = { ...defaultOptions, ...options };

  if (!text || typeof text !== "string") {
    return "";
  }

  const slugifyFn = slugifyLib as unknown as (
    text: string,
    options?: {
      lower?: boolean;
      strict?: boolean;
      replacement?: string;
      locale?: string;
      trim?: boolean;
    },
  ) => string;
  let slug = slugifyFn(text, {
    lower: config.lowerCase && !config.preserveCase,
    strict: config.strict ?? true,
    replacement: config.replacement || config.separator || "-",
    locale: config.locale,
    trim: true,
  });

  if (config.maxLength && slug.length > config.maxLength) {
    slug = slug.substring(0, config.maxLength);
    const separator = config.separator || config.replacement || "-";
    slug = slug.replace(new RegExp(`${separator}+$`), "");
  }

  return slug;
}

/**
 * Generates multiple slugs from array of texts
 * @param texts - Array of texts to convert
 * @param options - Slug generation options
 * @returns Array of generated slugs
 */
export function generateSlugs(
  texts: string[],
  options: SlugOptions = {},
): string[] {
  return texts.map((text) => generateSlug(text, options));
}

/**
 * Validates slug format (lowercase alphanumeric with hyphens/underscores, no spaces)
 * @param slug - Slug string to validate
 * @returns True if slug matches valid format pattern
 */
export function validateSlug(slug: string): boolean {
  if (!slug) {
    return false;
  }

  const slugRegex = /^[a-z0-9]+(?:[_-][a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

/**
 * Makes slug unique by appending number if needed
 * @param slug - Base slug
 * @param existingSlugs - Array of existing slugs
 * @returns Unique slug
 */
export function makeSlugUnique(
  slug: string,
  existingSlugs: string[] = [],
): string {
  if (!existingSlugs.includes(slug)) {
    return slug;
  }

  let counter = 1;
  let uniqueSlug = `${slug}-${counter}`;

  while (existingSlugs.includes(uniqueSlug)) {
    counter++;
    uniqueSlug = `${slug}-${counter}`;
  }

  return uniqueSlug;
}

/**
 * Reverses slug back to human-readable text (approximate conversion)
 * @param slug - Slug string to convert
 * @returns Human-readable text with capitalized words
 */
export function unslugify(slug: string): string {
  return slug
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
