/**
 * ARIA Generator
 * Generates ARIA attributes for accessibility
 */

import type { AriaRole } from "@workspace/types/aria";
import { ARIA_ROLES } from "@workspace/constants/aria";

// Re-export for backward compatibility
export type { AriaRole } from "@workspace/types/aria";
export { ARIA_ROLES } from "@workspace/constants/aria";

// AriaAttributes interface is specific to this file, keep it local
export interface AriaAttributes {
  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-hidden"?: boolean;
  "aria-expanded"?: boolean;
  "aria-selected"?: boolean;
  "aria-checked"?: boolean;
  "aria-current"?: string;
  "aria-live"?: "off" | "polite" | "assertive";
  "aria-atomic"?: boolean;
  "aria-busy"?: boolean;
  "aria-controls"?: string;
  "aria-haspopup"?: boolean | "menu" | "listbox" | "tree" | "grid" | "dialog";
  "aria-invalid"?: boolean | "grammar" | "spelling";
  "aria-required"?: boolean;
  "aria-readonly"?: boolean;
  "aria-disabled"?: boolean;
  "aria-orientation"?: "horizontal" | "vertical";
  [key: string]: string | boolean | undefined;
}

/**
 * Generates ARIA attributes for an element
 */
export function generateAriaAttributes(
  role: string,
  options: Partial<AriaAttributes> = {},
): AriaAttributes {
  const ariaAttrs: AriaAttributes = {
    role,
    ...options,
  };

  // Remove undefined values
  Object.keys(ariaAttrs).forEach((key) => {
    if (ariaAttrs[key] === undefined) {
      delete ariaAttrs[key];
    }
  });

  return ariaAttrs;
}

/**
 * Converts ARIA attributes to HTML string
 */
export function ariaAttributesToHTML(attributes: AriaAttributes): string {
  return Object.entries(attributes)
    .map(([key, value]) => {
      if (typeof value === "boolean") {
        return value ? key : "";
      }
      return `${key}="${String(value).replace(/"/g, "&quot;")}"`;
    })
    .filter(Boolean)
    .join(" ");
}

/**
 * Generates ARIA attributes string
 */
export function generateAriaString(
  role: string,
  options: Partial<AriaAttributes> = {},
): string {
  const attrs = generateAriaAttributes(role, options);
  return ariaAttributesToHTML(attrs);
}

/**
 * Gets role information
 */
export function getAriaRole(roleName: string): AriaRole | null {
  return ARIA_ROLES[roleName] || null;
}

/**
 * Gets all available roles
 */
export function getAllAriaRoles(): AriaRole[] {
  return Object.values(ARIA_ROLES);
}

/**
 * Validates ARIA attributes
 */
export function validateAriaAttributes(attributes: AriaAttributes): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[][] = [];
  const roleInfo = attributes.role ? ARIA_ROLES[attributes.role] : null;

  if (attributes.role && !roleInfo) {
    errors.push([`Unknown role: ${attributes.role}`]);
  }

  // Check required attributes
  if (roleInfo?.requiredAttributes) {
    for (const requiredAttr of roleInfo.requiredAttributes) {
      if (!attributes[requiredAttr as keyof AriaAttributes]) {
        errors.push([
          `Role '${attributes.role}' requires attribute '${requiredAttr}'`,
        ]);
      }
    }
  }

  // Validate aria-live values
  if (
    attributes["aria-live"] &&
    !["off", "polite", "assertive"].includes(attributes["aria-live"])
  ) {
    errors.push(["aria-live must be 'off', 'polite', or 'assertive'"]);
  }

  // Validate aria-current values
  if (
    attributes["aria-current"] &&
    !["page", "step", "location", "date", "time"].includes(
      attributes["aria-current"],
    )
  ) {
    errors.push(["Invalid aria-current value"]);
  }

  return {
    valid: errors.length === 0,
    errors: errors.flat(),
  };
}
