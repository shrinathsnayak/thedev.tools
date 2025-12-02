/**
 * Aspect ratio-related constants
 */

import type { AspectRatioPreset } from "@workspace/types/aspect-ratio";

/**
 * Common aspect ratio presets
 */
export const ASPECT_RATIO_PRESETS: AspectRatioPreset[] = [
  { name: "1:1", ratio: 1, string: "1:1", common: "Square" },
  { name: "4:3", ratio: 4 / 3, string: "4:3", common: "Standard" },
  { name: "16:9", ratio: 16 / 9, string: "16:9", common: "Widescreen" },
  { name: "21:9", ratio: 21 / 9, string: "21:9", common: "Ultrawide" },
  { name: "3:2", ratio: 3 / 2, string: "3:2", common: "Photo" },
  { name: "5:4", ratio: 5 / 4, string: "5:4", common: "Large Format" },
  { name: "16:10", ratio: 16 / 10, string: "16:10", common: "Widescreen" },
  { name: "9:16", ratio: 9 / 16, string: "9:16", common: "Portrait" },
  { name: "2:3", ratio: 2 / 3, string: "2:3", common: "Portrait Photo" },
];

