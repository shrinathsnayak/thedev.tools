/**
 * CSS Animation Generator
 * Generates CSS keyframe animations and transitions
 */

export interface AnimationKeyframe {
  percentage: number; // 0-100
  properties: Record<string, string>;
}

export interface CSSAnimation {
  name: string;
  duration: string;
  timingFunction: string;
  delay: string;
  iterationCount: string;
  direction: string;
  fillMode: string;
  keyframes: AnimationKeyframe[];
}

/**
 * Generates complete CSS keyframe animation with @keyframes rule and animation properties
 * @param animation - Animation configuration object
 * @returns Complete CSS string with @keyframes and animation class
 */
export function generateCSSAnimation(animation: CSSAnimation): string {
  const keyframes = animation.keyframes
    .sort((a, b) => a.percentage - b.percentage)
    .map((frame) => {
      const props = Object.entries(frame.properties)
        .map(([key, value]) => `    ${key}: ${value};`)
        .join("\n");
      return `  ${frame.percentage}% {\n${props}\n  }`;
    })
    .join("\n");

  return `@keyframes ${animation.name} {
${keyframes}
}

.${animation.name} {
  animation-name: ${animation.name};
  animation-duration: ${animation.duration};
  animation-timing-function: ${animation.timingFunction};
  animation-delay: ${animation.delay};
  animation-iteration-count: ${animation.iterationCount};
  animation-direction: ${animation.direction};
  animation-fill-mode: ${animation.fillMode};
}`;
}

/**
 * Generates a fade-in CSS animation
 * @param duration - Animation duration (default: "1s")
 * @returns CSS animation string
 */
export function generateFadeIn(duration: string = "1s"): string {
  return generateCSSAnimation({
    name: "fadeIn",
    duration,
    timingFunction: "ease-in",
    delay: "0s",
    iterationCount: "1",
    direction: "normal",
    fillMode: "forwards",
    keyframes: [
      { percentage: 0, properties: { opacity: "0" } },
      { percentage: 100, properties: { opacity: "1" } },
    ],
  });
}

/**
 * Generates a slide-in CSS animation from a specified direction
 * @param direction - Slide direction (left, right, up, or down)
 * @param duration - Animation duration (default: "0.5s")
 * @returns CSS animation string
 */
export function generateSlideIn(
  direction: "left" | "right" | "up" | "down" = "left",
  duration: string = "0.5s",
): string {
  const transforms = {
    left: { from: "translateX(-100%)", to: "translateX(0)" },
    right: { from: "translateX(100%)", to: "translateX(0)" },
    up: { from: "translateY(-100%)", to: "translateY(0)" },
    down: { from: "translateY(100%)", to: "translateY(0)" },
  };

  const t = transforms[direction];

  return generateCSSAnimation({
    name: `slideIn${direction.charAt(0).toUpperCase() + direction.slice(1)}`,
    duration,
    timingFunction: "ease-out",
    delay: "0s",
    iterationCount: "1",
    direction: "normal",
    fillMode: "forwards",
    keyframes: [
      { percentage: 0, properties: { transform: t.from, opacity: "0" } },
      { percentage: 100, properties: { transform: t.to, opacity: "1" } },
    ],
  });
}

/**
 * Generates a bounce CSS animation
 * @param duration - Animation duration (default: "1s")
 * @returns CSS animation string
 */
export function generateBounce(duration: string = "1s"): string {
  return generateCSSAnimation({
    name: "bounce",
    duration,
    timingFunction: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    delay: "0s",
    iterationCount: "infinite",
    direction: "normal",
    fillMode: "both",
    keyframes: [
      { percentage: 0, properties: { transform: "translateY(0)" } },
      { percentage: 50, properties: { transform: "translateY(-30px)" } },
      { percentage: 100, properties: { transform: "translateY(0)" } },
    ],
  });
}

/**
 * Generates a spin (rotation) CSS animation
 * @param duration - Animation duration (default: "1s")
 * @returns CSS animation string
 */
export function generateSpin(duration: string = "1s"): string {
  return generateCSSAnimation({
    name: "spin",
    duration,
    timingFunction: "linear",
    delay: "0s",
    iterationCount: "infinite",
    direction: "normal",
    fillMode: "none",
    keyframes: [
      { percentage: 0, properties: { transform: "rotate(0deg)" } },
      { percentage: 100, properties: { transform: "rotate(360deg)" } },
    ],
  });
}

/**
 * Generates a pulse CSS animation
 * @param duration - Animation duration (default: "2s")
 * @returns CSS animation string
 */
export function generatePulse(duration: string = "2s"): string {
  return generateCSSAnimation({
    name: "pulse",
    duration,
    timingFunction: "ease-in-out",
    delay: "0s",
    iterationCount: "infinite",
    direction: "normal",
    fillMode: "both",
    keyframes: [
      { percentage: 0, properties: { transform: "scale(1)", opacity: "1" } },
      {
        percentage: 50,
        properties: { transform: "scale(1.1)", opacity: "0.8" },
      },
      { percentage: 100, properties: { transform: "scale(1)", opacity: "1" } },
    ],
  });
}

/**
 * Generates a shake CSS animation
 * @param duration - Animation duration (default: "0.5s")
 * @returns CSS animation string
 */
export function generateShake(duration: string = "0.5s"): string {
  return generateCSSAnimation({
    name: "shake",
    duration,
    timingFunction: "ease-in-out",
    delay: "0s",
    iterationCount: "1",
    direction: "normal",
    fillMode: "both",
    keyframes: [
      { percentage: 0, properties: { transform: "translateX(0)" } },
      { percentage: 10, properties: { transform: "translateX(-10px)" } },
      { percentage: 20, properties: { transform: "translateX(10px)" } },
      { percentage: 30, properties: { transform: "translateX(-10px)" } },
      { percentage: 40, properties: { transform: "translateX(10px)" } },
      { percentage: 50, properties: { transform: "translateX(-10px)" } },
      { percentage: 60, properties: { transform: "translateX(10px)" } },
      { percentage: 70, properties: { transform: "translateX(-5px)" } },
      { percentage: 80, properties: { transform: "translateX(5px)" } },
      { percentage: 90, properties: { transform: "translateX(-5px)" } },
      { percentage: 100, properties: { transform: "translateX(0)" } },
    ],
  });
}

/**
 * Generates CSS transition properties
 * @param properties - Array of CSS properties to transition
 * @param duration - Transition duration (default: "0.3s")
 * @param timingFunction - Transition timing function (default: "ease")
 * @param delay - Transition delay (default: "0s")
 * @returns CSS transition class string
 */
export function generateTransition(
  properties: string[],
  duration: string = "0.3s",
  timingFunction: string = "ease",
  delay: string = "0s",
): string {
  const props = properties.join(", ");
  return `.transition {
  transition-property: ${props};
  transition-duration: ${duration};
  transition-timing-function: ${timingFunction};
  transition-delay: ${delay};
}`;
}
