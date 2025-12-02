import { jwtDecode } from "jwt-decode";

/**
 * JWT decoding and validation utilities
 * Note: These functions decode JWT tokens but do not verify cryptographic signatures
 */

export interface DecodedJWT {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
}

/**
 * Decodes a JWT token and returns the header and payload
 * Note: This function does not verify the token signature
 * @param token - The JWT token string to decode (may include "Bearer " prefix)
 * @returns Object containing decoded header and payload
 * @throws Error if token format is invalid or decoding fails
 */
export function decodeJwt(token: string): DecodedJWT {
  try {
    const cleanToken = token.replace(/^Bearer\s+/, "").trim();

    if (!cleanToken) {
      throw new Error("Token is empty");
    }

    const parts = cleanToken.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid JWT format. Expected 3 parts separated by dots");
    }

    const header = jwtDecode(cleanToken, { header: true });
    const payload = jwtDecode(cleanToken);

    return {
      header: header as Record<string, unknown>,
      payload: payload as Record<string, unknown>,
    };
  } catch (error) {
    throw new Error(
      `Failed to decode JWT: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Validates JWT token structure without verifying the signature
 * @param token - The JWT token string to validate
 * @returns Validation result indicating if the token structure is valid
 */
export function validateJwtStructure(token: string): {
  valid: boolean;
  error?: string;
} {
  try {
    const cleanToken = token.replace(/^Bearer\s+/, "").trim();

    if (!cleanToken) {
      return { valid: false, error: "Token is empty" };
    }

    const parts = cleanToken.split(".");
    if (parts.length !== 3) {
      return {
        valid: false,
        error: "Invalid JWT format. Expected 3 parts separated by dots",
      };
    }

    for (const part of parts.slice(0, 2)) {
      try {
        atob(part.replace(/-/g, "+").replace(/_/g, "/"));
      } catch {
        return {
          valid: false,
          error: `Invalid base64url encoding in token part`,
        };
      }
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Extracts standard JWT claims and separates them from custom claims
 * @param payload - The JWT payload object to extract claims from
 * @returns Object containing standard claims (iss, sub, aud, exp, etc.) and custom claims
 */
export function extractClaims(payload: Record<string, unknown>): {
  issuer?: string;
  subject?: string;
  audience?: string | string[];
  expiration?: number;
  issuedAt?: number;
  notBefore?: number;
  jwtId?: string;
  customClaims: Record<string, unknown>;
} {
  const commonClaims = ["iss", "sub", "aud", "exp", "iat", "nbf", "jti"];

  const customClaims: Record<string, unknown> = {};
  const result: {
    issuer?: string;
    subject?: string;
    audience?: string | string[];
    expiration?: number;
    issuedAt?: number;
    notBefore?: number;
    jwtId?: string;
    customClaims: Record<string, unknown>;
  } = {
    customClaims,
  };

  for (const [key, value] of Object.entries(payload)) {
    switch (key) {
      case "iss":
        result.issuer = value as string;
        break;
      case "sub":
        result.subject = value as string;
        break;
      case "aud":
        result.audience = value as string | string[];
        break;
      case "exp":
        result.expiration = value as number;
        break;
      case "iat":
        result.issuedAt = value as number;
        break;
      case "nbf":
        result.notBefore = value as number;
        break;
      case "jti":
        result.jwtId = value as string;
        break;
      default:
        if (!commonClaims.includes(key)) {
          customClaims[key] = value;
        }
        break;
    }
  }

  return result;
}

/**
 * Checks if a JWT token is expired based on the exp claim
 * @param payload - The JWT payload object containing the exp claim
 * @returns Object indicating expiration status, expiration date, and time remaining/elapsed
 */
export function checkExpiration(payload: Record<string, unknown>): {
  isExpired: boolean;
  expiresAt?: Date;
  expiresIn?: number;
  expiredAgo?: number;
} {
  const exp = payload.exp as number | undefined;

  if (!exp) {
    return { isExpired: false };
  }

  const expirationDate = new Date(exp * 1000);
  const now = new Date();
  const isExpired = expirationDate < now;

  const diff = Math.abs(expirationDate.getTime() - now.getTime());
  const diffSeconds = Math.floor(diff / 1000);

  return {
    isExpired,
    expiresAt: expirationDate,
    expiresIn: isExpired ? undefined : diffSeconds,
    expiredAgo: isExpired ? diffSeconds : undefined,
  };
}
