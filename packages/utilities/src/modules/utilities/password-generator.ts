/**
 * Password generation utilities
 */

export interface PasswordOptions {
  length?: number;
  includeUppercase?: boolean;
  includeLowercase?: boolean;
  includeNumbers?: boolean;
  includeSymbols?: boolean;
  excludeSimilar?: boolean;
  excludeAmbiguous?: boolean;
}

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
const SIMILAR = "il1Lo0O";
const AMBIGUOUS = "{}[]()/'\"~,;.<>";

/**
 * Generates a random password with customizable options
 * @param options - Password generation options (length, character types, exclusions)
 * @returns Generated password string
 * @throws Error if length is invalid or no character types are enabled
 */
export function generatePassword(options: PasswordOptions = {}): string {
  const config: Required<PasswordOptions> = {
    length: options.length || 16,
    includeUppercase: options.includeUppercase ?? true,
    includeLowercase: options.includeLowercase ?? true,
    includeNumbers: options.includeNumbers ?? true,
    includeSymbols: options.includeSymbols ?? false,
    excludeSimilar: options.excludeSimilar ?? false,
    excludeAmbiguous: options.excludeAmbiguous ?? false,
  };

  if (config.length < 1) {
    throw new Error("Password length must be at least 1");
  }

  if (
    !config.includeUppercase &&
    !config.includeLowercase &&
    !config.includeNumbers &&
    !config.includeSymbols
  ) {
    throw new Error(
      "At least one character type must be enabled (uppercase, lowercase, numbers, symbols)",
    );
  }

  let charset = "";

  if (config.includeLowercase) {
    charset += LOWERCASE;
  }
  if (config.includeUppercase) {
    charset += UPPERCASE;
  }
  if (config.includeNumbers) {
    charset += NUMBERS;
  }
  if (config.includeSymbols) {
    charset += SYMBOLS;
  }

  if (config.excludeSimilar) {
    charset = charset
      .split("")
      .filter((char) => !SIMILAR.includes(char))
      .join("");
  }

  if (config.excludeAmbiguous) {
    charset = charset
      .split("")
      .filter((char) => !AMBIGUOUS.includes(char))
      .join("");
  }

  if (charset.length === 0) {
    throw new Error("No characters available after exclusions");
  }

  const password: string[] = [];
  let remainingChars = charset;

  if (config.includeLowercase) {
    const available = LOWERCASE.split("").filter(
      (c) =>
        charset.includes(c) &&
        (!config.excludeSimilar || !SIMILAR.includes(c)) &&
        (!config.excludeAmbiguous || !AMBIGUOUS.includes(c)),
    );
    if (available.length > 0) {
      const char = available[Math.floor(Math.random() * available.length)];
      if (char) {
        password.push(char);
        remainingChars = remainingChars.replace(new RegExp(char, "g"), "");
      }
    }
  }

  if (config.includeUppercase) {
    const available = UPPERCASE.split("").filter(
      (c) =>
        charset.includes(c) &&
        (!config.excludeSimilar || !SIMILAR.includes(c)) &&
        (!config.excludeAmbiguous || !AMBIGUOUS.includes(c)),
    );
    if (available.length > 0) {
      const char = available[Math.floor(Math.random() * available.length)];
      if (char) {
        password.push(char);
        remainingChars = remainingChars.replace(new RegExp(char, "g"), "");
      }
    }
  }

  if (config.includeNumbers) {
    const available = NUMBERS.split("").filter(
      (c) =>
        charset.includes(c) &&
        (!config.excludeSimilar || !SIMILAR.includes(c)) &&
        (!config.excludeAmbiguous || !AMBIGUOUS.includes(c)),
    );
    if (available.length > 0) {
      const char = available[Math.floor(Math.random() * available.length)];
      if (char) {
        password.push(char);
        remainingChars = remainingChars.replace(new RegExp(char, "g"), "");
      }
    }
  }

  if (config.includeSymbols) {
    const available = SYMBOLS.split("").filter(
      (c) =>
        charset.includes(c) &&
        (!config.excludeSimilar || !SIMILAR.includes(c)) &&
        (!config.excludeAmbiguous || !AMBIGUOUS.includes(c)),
    );
    if (available.length > 0) {
      const char = available[Math.floor(Math.random() * available.length)];
      if (char) {
        password.push(char);
        remainingChars = remainingChars.replace(new RegExp(char, "g"), "");
      }
    }
  }

  while (password.length < config.length) {
    if (remainingChars.length === 0) {
      remainingChars = charset;
    }
    const randomIndex = Math.floor(Math.random() * remainingChars.length);
    const char = remainingChars[randomIndex];
    if (char) {
      password.push(char);
    } else {
      break;
    }
  }

  for (let i = password.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = password[i];
    const temp2 = password[j];
    if (temp && temp2) {
      password[i] = temp2;
      password[j] = temp;
    }
  }

  return password.join("");
}

/**
 * Generates multiple passwords with the same options
 * @param count - Number of passwords to generate
 * @param options - Password generation options
 * @returns Array of generated password strings
 */
export function generatePasswords(
  count: number,
  options: PasswordOptions = {},
): string[] {
  return Array.from({ length: count }, () => generatePassword(options));
}

/**
 * Calculates password strength based on length, character variety, and common patterns
 * @param password - The password string to analyze
 * @returns Password strength assessment with score (0-100) and feedback suggestions
 */
export function calculatePasswordStrength(password: string): {
  strength: "weak" | "fair" | "good" | "strong" | "very-strong";
  score: number;
  feedback: string[];
} {
  let score = 0;
  const feedback: string[] = [];

  if (password.length === 0) {
    return {
      strength: "weak",
      score: 0,
      feedback: ["Password is empty"],
    };
  }

  if (password.length >= 12) {
    score += 25;
  } else if (password.length >= 8) {
    score += 15;
    feedback.push("Consider using at least 12 characters");
  } else {
    score += 5;
    feedback.push("Use at least 8 characters (12+ recommended)");
  }

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSymbols = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password);

  const varietyCount = [hasLower, hasUpper, hasNumbers, hasSymbols].filter(
    Boolean,
  ).length;

  score += varietyCount * 15;

  if (varietyCount === 1) {
    feedback.push("Use a mix of uppercase, lowercase, numbers, and symbols");
  } else if (varietyCount === 2) {
    feedback.push("Add more character types for better security");
  }

  if (password.length >= 8 && varietyCount >= 3) {
    score += 10;
  }

  if (/123|abc|password|qwerty/i.test(password)) {
    score -= 20;
    feedback.push("Avoid common patterns and dictionary words");
  }

  if (/(.)\1{2,}/.test(password)) {
    score -= 10;
    feedback.push("Avoid repeating characters");
  }

  if (/012|123|234|345|456|567|678|789|890/.test(password)) {
    score -= 15;
    feedback.push("Avoid sequential numbers");
  }

  score = Math.max(0, Math.min(100, score));

  let strength: "weak" | "fair" | "good" | "strong" | "very-strong";
  if (score < 30) {
    strength = "weak";
  } else if (score < 50) {
    strength = "fair";
  } else if (score < 70) {
    strength = "good";
  } else if (score < 90) {
    strength = "strong";
  } else {
    strength = "very-strong";
  }

  return { strength, score, feedback };
}

/**
 * Generates a random string from a specified character set
 * @param length - Length of the random string to generate
 * @param charset - Character set to use (default: alphanumeric)
 * @returns Random string of specified length
 */
export function generateRandomString(
  length: number,
  charset: string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
): string {
  const chars: string[] = [];
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    const char = charset[randomIndex];
    if (char) {
      chars.push(char);
    }
  }
  return chars.join("");
}
