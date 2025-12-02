/**
 * Query string parsing and formatting utilities
 */

export interface QueryParams {
  [key: string]: string | string[] | undefined;
}

/**
 * Parses a query string into an object with decoded keys and values
 * @param queryString - The query string to parse (with or without leading "?")
 * @returns Object mapping parameter keys to values (arrays for multiple values)
 */
export function parseQueryString(queryString: string): QueryParams {
  const params: QueryParams = {};

  if (!queryString || !queryString.trim()) {
    return params;
  }

  const cleaned = queryString.startsWith("?")
    ? queryString.substring(1)
    : queryString;

  const pairs = cleaned.split("&");

  for (const pair of pairs) {
    const [key, value] = pair.split("=");
    if (key) {
      const decodedKey = decodeURIComponent(key);
      const decodedValue = value ? decodeURIComponent(value) : "";

      if (params[decodedKey]) {
        if (Array.isArray(params[decodedKey])) {
          (params[decodedKey] as string[]).push(decodedValue);
        } else {
          params[decodedKey] = [params[decodedKey] as string, decodedValue];
        }
      } else {
        params[decodedKey] = decodedValue;
      }
    }
  }

  return params;
}

/**
 * Formats an object into a query string with optional encoding
 * @param params - Object with query parameters
 * @param options - Formatting options (encode, includeEmpty)
 * @returns Query string with leading "?" or empty string if no params
 */
export function formatQueryString(
  params: QueryParams,
  options: { encode?: boolean; includeEmpty?: boolean } = {},
): string {
  const { encode = true, includeEmpty = false } = options;
  const pairs: string[] = [];

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || (!includeEmpty && value === "")) {
      continue;
    }

    const keyStr = encode ? encodeURIComponent(key) : key;

    if (Array.isArray(value)) {
      for (const val of value) {
        const valStr = encode ? encodeURIComponent(val) : val;
        pairs.push(`${keyStr}=${valStr}`);
      }
    } else {
      const valStr = encode ? encodeURIComponent(value) : value;
      pairs.push(`${keyStr}=${valStr}`);
    }
  }

  return pairs.length > 0 ? `?${pairs.join("&")}` : "";
}

/**
 * Adds or updates a query parameter in a query string
 * @param queryString - The existing query string
 * @param key - Parameter key to set
 * @param value - Parameter value (string or array for multiple values)
 * @returns Updated query string
 */
export function setQueryParam(
  queryString: string,
  key: string,
  value: string | string[],
): string {
  const params = parseQueryString(queryString);
  params[key] = value;
  return formatQueryString(params);
}

/**
 * Removes a query parameter from a query string
 * @param queryString - The existing query string
 * @param key - Parameter key to remove
 * @returns Updated query string with parameter removed
 */
export function removeQueryParam(queryString: string, key: string): string {
  const params = parseQueryString(queryString);
  delete params[key];
  return formatQueryString(params);
}

/**
 * Gets a query parameter value from a query string
 * @param queryString - The query string to parse
 * @param key - Parameter key to retrieve
 * @returns Parameter value (string, array, or undefined if not found)
 */
export function getQueryParam(
  queryString: string,
  key: string,
): string | string[] | undefined {
  const params = parseQueryString(queryString);
  return params[key];
}

/**
 * Merges multiple query strings into one (later strings override earlier ones)
 * @param queryStrings - Variable number of query strings to merge
 * @returns Merged query string
 */
export function mergeQueryStrings(...queryStrings: string[]): string {
  const merged: QueryParams = {};

  for (const qs of queryStrings) {
    const params = parseQueryString(qs);
    Object.assign(merged, params);
  }

  return formatQueryString(merged);
}

/**
 * Validates a query string format by attempting to parse it
 * @param queryString - The query string to validate
 * @returns Validation result with error message if invalid
 */
export function validateQueryString(queryString: string): {
  valid: boolean;
  error?: string;
} {
  if (!queryString || queryString.trim() === "") {
    return { valid: true };
  }

  try {
    parseQueryString(queryString);
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Invalid query string",
    };
  }
}
