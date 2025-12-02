/**
 * CSS Transform generator utilities
 */

export interface TransformValue {
  translateX?: number;
  translateY?: number;
  translateZ?: number;
  scaleX?: number;
  scaleY?: number;
  scaleZ?: number;
  rotate?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  skewX?: number;
  skewY?: number;
  perspective?: number;
}

export type TransformOrigin =
  | "center"
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top left"
  | "top right"
  | "bottom left"
  | "bottom right"
  | string;

/**
 * Generates CSS transform string from transform value objects
 * @param transforms - Single transform value or array of transform values
 * @returns CSS transform property value string
 */
export function generateTransform(
  transforms: TransformValue | TransformValue[],
): string {
  const transformList = Array.isArray(transforms) ? transforms : [transforms];
  const parts: string[] = [];

  for (const transform of transformList) {
    if (
      transform.translateX !== undefined ||
      transform.translateY !== undefined
    ) {
      const x = transform.translateX ?? 0;
      const y = transform.translateY ?? 0;
      const z = transform.translateZ ?? 0;

      if (z !== 0) {
        parts.push(`translate3d(${x}px, ${y}px, ${z}px)`);
      } else {
        parts.push(`translate(${x}px, ${y}px)`);
      }
    }

    if (transform.scaleX !== undefined || transform.scaleY !== undefined) {
      const x = transform.scaleX ?? 1;
      const y = transform.scaleY ?? 1;
      const z = transform.scaleZ ?? 1;

      if (x === y && y === z) {
        parts.push(`scale(${x})`);
      } else if (z !== 1) {
        parts.push(`scale3d(${x}, ${y}, ${z})`);
      } else {
        parts.push(`scale(${x}, ${y})`);
      }
    }

    if (transform.rotate !== undefined) {
      parts.push(`rotate(${transform.rotate}deg)`);
    }

    if (transform.rotateX !== undefined) {
      parts.push(`rotateX(${transform.rotateX}deg)`);
    }

    if (transform.rotateY !== undefined) {
      parts.push(`rotateY(${transform.rotateY}deg)`);
    }

    if (transform.rotateZ !== undefined) {
      parts.push(`rotateZ(${transform.rotateZ}deg)`);
    }

    if (transform.skewX !== undefined || transform.skewY !== undefined) {
      const x = transform.skewX ?? 0;
      const y = transform.skewY ?? 0;
      parts.push(`skew(${x}deg, ${y}deg)`);
    }

    if (transform.perspective !== undefined) {
      parts.push(`perspective(${transform.perspective}px)`);
    }
  }

  return parts.length > 0 ? parts.join(" ") : "none";
}

/**
 * Parses CSS transform string into structured transform value object
 * @param transformString - The CSS transform string to parse
 * @returns Transform value object with parsed properties
 */
export function parseTransform(transformString: string): TransformValue {
  const transform: TransformValue = {};

  if (!transformString || transformString.trim() === "none") {
    return transform;
  }

  const translateMatch = transformString.match(/translate(?:3d)?\(([^)]+)\)/);
  if (translateMatch && translateMatch[1]) {
    const values = translateMatch[1]
      .split(",")
      .map((v) => parseFloat(v.trim()));
    if (values[0] !== undefined) transform.translateX = values[0];
    if (values[1] !== undefined) transform.translateY = values[1];
    if (values[2] !== undefined) transform.translateZ = values[2];
  }

  const scaleMatch = transformString.match(/scale(?:3d)?\(([^)]+)\)/);
  if (scaleMatch && scaleMatch[1]) {
    const values = scaleMatch[1].split(",").map((v) => parseFloat(v.trim()));
    if (values[0] !== undefined) transform.scaleX = values[0];
    if (values[1] !== undefined) transform.scaleY = values[1];
    if (values[2] !== undefined) transform.scaleZ = values[2];
  }

  const rotateMatch = transformString.match(/rotate(?:X|Y|Z)?\(([^)]+)\)/);
  if (rotateMatch && rotateMatch[1]) {
    const value = parseFloat(rotateMatch[1]);
    if (!isNaN(value)) {
      if (transformString.includes("rotateX")) {
        transform.rotateX = value;
      } else if (transformString.includes("rotateY")) {
        transform.rotateY = value;
      } else if (transformString.includes("rotateZ")) {
        transform.rotateZ = value;
      } else {
        transform.rotate = value;
      }
    }
  }

  const skewMatch = transformString.match(/skew(?:X|Y)?\(([^)]+)\)/);
  if (skewMatch && skewMatch[1]) {
    const values = skewMatch[1].split(",").map((v) => parseFloat(v.trim()));
    if (transformString.includes("skewX")) {
      if (values[0] !== undefined) transform.skewX = values[0];
    } else if (transformString.includes("skewY")) {
      if (values[0] !== undefined) transform.skewY = values[0];
    } else {
      if (values[0] !== undefined) transform.skewX = values[0];
      if (values[1] !== undefined) transform.skewY = values[1];
    }
  }

  const perspectiveMatch = transformString.match(/perspective\(([^)]+)\)/);
  if (perspectiveMatch && perspectiveMatch[1]) {
    const value = parseFloat(perspectiveMatch[1]);
    if (!isNaN(value)) {
      transform.perspective = value;
    }
  }

  return transform;
}

/**
 * Generates CSS transform-origin property value
 * @param origin - Transform origin value (keyword or custom string)
 * @returns CSS transform-origin value string
 */
export function generateTransformOrigin(origin: TransformOrigin): string {
  return typeof origin === "string" ? origin : "center";
}
