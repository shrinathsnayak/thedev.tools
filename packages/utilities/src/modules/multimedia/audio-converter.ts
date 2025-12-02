/**
 * Audio format converter using FFmpeg.wasm
 * Client-side audio format conversion without backend
 */

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import {
  toUint8Array,
  convertFileDataToUint8Array,
  getFileExtension,
} from "../../utils/file-converter";

export type AudioFormat =
  | "mp3"
  | "wav"
  | "aac"
  | "ogg"
  | "flac"
  | "m4a"
  | "opus"
  | "wma"
  | "aiff";

export interface AudioConversionOptions {
  bitrate?: number; // kbps
  sampleRate?: number; // Hz (e.g., 44100, 48000)
  channels?: 1 | 2; // mono or stereo
  quality?: "low" | "medium" | "high";
}

let ffmpegInstance: FFmpeg | null = null;

/**
 * Gets or initializes FFmpeg instance for audio conversion
 * @returns Promise resolving to FFmpeg instance
 */
async function _getFFmpeg(): Promise<FFmpeg> {
  if (ffmpegInstance) {
    return ffmpegInstance;
  }

  ffmpegInstance = new FFmpeg();
  ffmpegInstance.on("log", ({ message }) => {
    console.log("[FFmpeg]", message);
  });

  const publicPath =
    typeof window !== "undefined"
      ? (window as any).__FFMPEG_PUBLIC_PATH__ || "/ffmpeg-core"
      : "";

  try {
    if (publicPath) {
      await ffmpegInstance.load({
        coreURL: await toBlobURL(
          `${publicPath}/ffmpeg-core.js`,
          "text/javascript",
        ),
        wasmURL: await toBlobURL(
          `${publicPath}/ffmpeg-core.wasm`,
          "application/wasm",
        ),
      });
    } else {
      throw new Error("No public path configured");
    }
  } catch (error) {
    if (
      typeof process !== "undefined" &&
      process.env?.NODE_ENV === "production"
    ) {
      console.warn(
        "[FFmpeg] Production mode: Ensure FFmpeg core files are bundled for offline PWA support",
      );
    }
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    await ffmpegInstance.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm",
      ),
    });
  }

  return ffmpegInstance;
}

/**
 * Converts audio to specified format with optional bitrate, sample rate, and channel options
 * @param inputFile - Input audio file (File, Blob, ArrayBuffer, or Uint8Array)
 * @param outputFormat - Target audio format
 * @param options - Conversion options (bitrate, sampleRate, channels, quality)
 * @returns Promise resolving to converted audio Blob
 * @throws Error if conversion fails
 */
export async function convertAudioFormat(
  inputFile: File | Blob | ArrayBuffer | Uint8Array,
  outputFormat: AudioFormat,
  options: AudioConversionOptions = {},
): Promise<Blob> {
  const ffmpeg = await _getFFmpeg();

  const inputExtension = getFileExtension(inputFile) || "mp3";
  const inputName = `input.${inputExtension}`;
  const outputName = `output.${outputFormat}`;

  await ffmpeg.writeFile(inputName, await toUint8Array(inputFile));

  const args: string[] = ["-i", inputName];

  const codecMap: Record<AudioFormat, string> = {
    mp3: "libmp3lame",
    wav: "pcm_s16le",
    aac: "aac",
    ogg: "libvorbis",
    flac: "flac",
    m4a: "aac",
    opus: "libopus",
    wma: "wmav2",
    aiff: "pcm_s16be",
  };

  args.push("-c:a", codecMap[outputFormat] || "libmp3lame");

  if (options.bitrate) {
    args.push("-b:a", `${options.bitrate}k`);
  } else {
    const defaultBitrates: Partial<Record<AudioFormat, number>> = {
      mp3: 192,
      aac: 128,
      ogg: 160,
      opus: 128,
      m4a: 128,
    };
    const defaultBitrate = defaultBitrates[outputFormat];
    if (defaultBitrate && defaultBitrate > 0) {
      args.push("-b:a", `${defaultBitrate}k`);
    }
  }

  if (options.sampleRate) {
    args.push("-ar", String(options.sampleRate));
  }

  if (options.channels) {
    args.push("-ac", String(options.channels));
  }

  args.push("-y", outputName);

  await ffmpeg.exec(args);

  const data = await ffmpeg.readFile(outputName);
  const uint8Data = await convertFileDataToUint8Array(data);
  const arrayBuffer = new Uint8Array(uint8Data).buffer;

  const mimeTypes: Record<AudioFormat, string> = {
    mp3: "audio/mpeg",
    wav: "audio/wav",
    aac: "audio/aac",
    ogg: "audio/ogg",
    flac: "audio/flac",
    m4a: "audio/mp4",
    opus: "audio/opus",
    wma: "audio/x-ms-wma",
    aiff: "audio/aiff",
  };

  const blob = new Blob([arrayBuffer], {
    type: mimeTypes[outputFormat] || "audio/mpeg",
  });

  await ffmpeg.deleteFile(inputName);
  await ffmpeg.deleteFile(outputName);

  return blob;
}

