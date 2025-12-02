/**
 * JWT (JSON Web Token) builder utilities
 * Complements the existing jwt-decoder
 */

export interface JWTPayload {
  [key: string]: any;
  iss?: string; // Issuer
  sub?: string; // Subject
  aud?: string | string[]; // Audience
  exp?: number; // Expiration time
  nbf?: number; // Not before
  iat?: number; // Issued at
  jti?: string; // JWT ID
}

export interface JWTHeader {
  alg: string;
  typ: string;
  [key: string]: any;
}

export interface JWTOptions {
  algorithm?: "HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512";
  expiresIn?: number | string; // Seconds or time string (e.g., "1h", "7d")
  notBefore?: number | string;
  issuer?: string;
  subject?: string;
  audience?: string | string[];
  jwtId?: string;
}

/**
 * Base64 URL encodes a string (without padding)
 * @param str - String to encode
 * @returns Base64 URL encoded string
 */
function _base64UrlEncode(str: string): string {
  const base64 = btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    }),
  );

  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

/**
 * Base64 URL decodes a string
 * @param str - Base64 URL encoded string to decode
 * @returns Decoded string
 * @throws Error if string is invalid
 */
function _base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");

  while (base64.length % 4) {
    base64 += "=";
  }

  try {
    return decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );
  } catch {
    throw new Error("Invalid base64url string");
  }
}

/**
 * Converts time string (e.g., "1h", "30m", "7d") to seconds
 * @param timeStr - Time string in format like "1h", "30m", "7d"
 * @returns Number of seconds
 * @throws Error if format is invalid
 */
function _timeStringToSeconds(timeStr: string): number {
  const match = timeStr.match(/^(\d+)([smhd])$/);
  if (!match) {
    throw new Error("Invalid time string format");
  }

  if (!match[1] || !match[2]) {
    throw new Error("Invalid time string format");
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  const multipliers: Record<string, number> = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
  };

  return value * (multipliers[unit] || 1);
}

/**
 * Builds JWT token (unsigned)
 * @param payload - JWT payload object
 * @param options - JWT options
 * @returns JWT token string (without signature)
 */
export function buildJWT(
  payload: JWTPayload,
  options: JWTOptions = {},
): string {
  const now = Math.floor(Date.now() / 1000);

  // Set default claims
  if (!payload.iat) {
    payload.iat = now;
  }

  if (options.expiresIn) {
    if (typeof options.expiresIn === "string") {
      payload.exp = now + _timeStringToSeconds(options.expiresIn);
    } else {
      payload.exp = now + options.expiresIn;
    }
  }

  if (options.notBefore) {
    if (typeof options.notBefore === "string") {
      payload.nbf = now + _timeStringToSeconds(options.notBefore);
    } else {
      payload.nbf = now + options.notBefore;
    }
  }

  if (options.issuer) payload.iss = options.issuer;
  if (options.subject) payload.sub = options.subject;
  if (options.audience) payload.aud = options.audience;
  if (options.jwtId) payload.jti = options.jwtId;

  const header: JWTHeader = {
    alg: options.algorithm || "HS256",
    typ: "JWT",
  };

  const encodedHeader = _base64UrlEncode(JSON.stringify(header));
  const encodedPayload = _base64UrlEncode(JSON.stringify(payload));

  return `${encodedHeader}.${encodedPayload}`;
}

/**
 * Signs JWT token with HMAC algorithm (HS256, HS384, HS512)
 * @param payload - JWT payload object
 * @param secret - Secret key for signing
 * @param algorithm - HMAC algorithm to use (default: HS256)
 * @returns Promise that resolves to signed JWT token string
 * @throws Error if Web Crypto API is not available
 */
export async function signJWT(
  payload: JWTPayload,
  secret: string,
  algorithm: "HS256" | "HS384" | "HS512" = "HS256",
): Promise<string> {
  if (typeof crypto === "undefined" || !crypto.subtle) {
    throw new Error("Web Crypto API not available");
  }

  const options: JWTOptions = { algorithm };
  const unsignedToken = buildJWT(payload, options);
  const [header, encodedPayload] = unsignedToken.split(".");

  const encoder = new TextEncoder();
  const data = encoder.encode(`${header}.${encodedPayload}`);
  const keyData = encoder.encode(secret);

  const hashAlgorithms: Record<string, string> = {
    HS256: "SHA-256",
    HS384: "SHA-384",
    HS512: "SHA-512",
  };

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    {
      name: "HMAC",
      hash: hashAlgorithms[algorithm],
    },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, data);

  const signatureArray = new Uint8Array(signature);
  const signatureBase64 = btoa(String.fromCharCode(...signatureArray));
  const signatureBase64Url = signatureBase64
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  return `${unsignedToken}.${signatureBase64Url}`;
}

/**
 * Verifies JWT token signature using HMAC (HS256, HS384, HS512 only)
 * @param token - JWT token string to verify
 * @param secret - Secret key used for signing
 * @returns Promise that resolves to true if signature is valid, false otherwise
 */
export async function verifyJWTSignature(
  token: string,
  secret: string,
): Promise<boolean> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return false;
    }

    const [header, payload, signature] = parts;
    if (!header || !payload || !signature) {
      return false;
    }

    const headerJson = JSON.parse(_base64UrlDecode(header));
    const algorithm = headerJson.alg;

    if (!algorithm.startsWith("HS")) {
      return false;
    }

    const unsignedToken = `${header}.${payload}`;

    const encoder = new TextEncoder();
    const data = encoder.encode(unsignedToken);
    const keyData = encoder.encode(secret);

    const hashAlgorithms: Record<string, string> = {
      HS256: "SHA-256",
      HS384: "SHA-384",
      HS512: "SHA-512",
    };

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      {
        name: "HMAC",
        hash: hashAlgorithms[algorithm],
      },
      false,
      ["sign"],
    );

    const computedSignature = await crypto.subtle.sign("HMAC", cryptoKey, data);
    const computedArray = new Uint8Array(computedSignature);
    const computedBase64 = btoa(String.fromCharCode(...computedArray));
    const computedBase64Url = computedBase64
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");

    return computedBase64Url === signature;
  } catch {
    return false;
  }
}

/**
 * Formats JWT payload with decoded timestamp information
 * @param payload - Raw JWT payload object
 * @returns Object containing original payload and decoded timestamp information
 */
export function formatJWTPayload(payload: JWTPayload): {
  payload: JWTPayload;
  decoded: {
    issuedAt?: string;
    expiresAt?: string;
    notBefore?: string;
    isExpired?: boolean;
    isNotYetValid?: boolean;
  };
} {
  const now = Math.floor(Date.now() / 1000);
  const decoded: any = {};

  if (payload.iat) {
    decoded.issuedAt = new Date(payload.iat * 1000).toISOString();
  }

  if (payload.exp) {
    decoded.expiresAt = new Date(payload.exp * 1000).toISOString();
    decoded.isExpired = payload.exp < now;
  }

  if (payload.nbf) {
    decoded.notBefore = new Date(payload.nbf * 1000).toISOString();
    decoded.isNotYetValid = payload.nbf > now;
  }

  return {
    payload,
    decoded,
  };
}
