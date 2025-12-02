/**
 * Aspect ratio-related type definitions
 */

export interface AspectRatio {
  width: number;
  height: number;
  ratio: number; // width / height
  string: string; // e.g., "16:9"
  decimal: number;
}

export interface AspectRatioPreset {
  name: string;
  ratio: number;
  string: string;
  common: string;
}

