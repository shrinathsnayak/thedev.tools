/**
 * Video format converter using FFmpeg.wasm
 * Client-side video format conversion without backend
 */

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import {
  toUint8Array,
  convertFileDataToUint8Array,
  getFileExtension,
} from "../../utils/file-converter";

export type VideoFormat =
  | "mp4"
  | "webm"
  | "avi"
  | "mov"
  | "mkv"
  | "gif"
  | "flv"
  | "wmv"
  | "m4v";

export interface VideoConversionOptions {
  quality?: "low" | "medium" | "high";
  bitrate?: number; // kbps
  resolution?: string; // e.g., "1920x1080", "1280x720"
  fps?: number;
  videoCodec?: "h264" | "vp9" | "vp8" | "libx265";
  audioCodec?: "aac" | "mp3" | "opus" | "none";
}

let ffmpegInstance: FFmpeg | null = null;

/**
 * Initializes FFmpeg instance (must be called before conversion)
 * @returns Promise resolving to initialized FFmpeg instance
 */
export async function initFFmpeg(): Promise<FFmpeg> {
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
 * Converts video to specified format with optional quality and codec options
 * @param inputFile - Input video file (File, Blob, ArrayBuffer, or Uint8Array)
 * @param outputFormat - Target video format
 * @param options - Conversion options (quality, bitrate, resolution, fps, codecs)
 * @returns Promise resolving to converted video Blob
 * @throws Error if conversion fails
 */
export async function convertVideoFormat(
  inputFile: File | Blob | ArrayBuffer | Uint8Array,
  outputFormat: VideoFormat,
  options: VideoConversionOptions = {},
): Promise<Blob> {
  const ffmpeg = await initFFmpeg();

  const inputExtension = getFileExtension(inputFile) || "mp4";
  const inputName = `input.${inputExtension}`;
  const outputName = `output.${outputFormat}`;

  await ffmpeg.writeFile(inputName, await toUint8Array(inputFile));

  const args: string[] = ["-i", inputName];

  if (options.resolution) {
    args.push("-s", options.resolution);
  }

  if (options.fps) {
    args.push("-r", String(options.fps));
  }

  if (options.videoCodec) {
    args.push("-c:v", options.videoCodec);
  } else {
    const defaultCodecs: Record<VideoFormat, string> = {
      mp4: "libx264",
      webm: "libvpx-vp9",
      avi: "libx264",
      mov: "libx264",
      mkv: "libx264",
      gif: "gif",
      flv: "libx264",
      wmv: "wmv2",
      m4v: "libx264",
    };
    args.push("-c:v", defaultCodecs[outputFormat] || "libx264");
  }

  if (options.audioCodec === "none" || outputFormat === "gif") {
    args.push("-an");
  } else if (options.audioCodec) {
    args.push("-c:a", options.audioCodec);
  } else {
    if (outputFormat === "webm") {
      args.push("-c:a", "libopus");
    } else {
      args.push("-c:a", "aac");
    }
  }

  if (options.quality) {
    switch (options.quality) {
      case "low":
        args.push("-crf", "28", "-preset", "fast");
        break;
      case "medium":
        args.push("-crf", "23", "-preset", "medium");
        break;
      case "high":
        args.push("-crf", "18", "-preset", "slow");
        break;
    }
  }

  if (options.bitrate) {
    args.push("-b:v", `${options.bitrate}k`);
  }

  args.push("-y", outputName);

  await ffmpeg.exec(args);

  const data = await ffmpeg.readFile(outputName);
  const uint8Data = await convertFileDataToUint8Array(data);
  const arrayBuffer = new Uint8Array(uint8Data).buffer;

  const mimeTypes: Record<VideoFormat, string> = {
    mp4: "video/mp4",
    webm: "video/webm",
    avi: "video/x-msvideo",
    mov: "video/quicktime",
    mkv: "video/x-matroska",
    gif: "image/gif",
    flv: "video/x-flv",
    wmv: "video/x-ms-wmv",
    m4v: "video/x-m4v",
  };

  const blob = new Blob([arrayBuffer], {
    type: mimeTypes[outputFormat] || "video/mp4",
  });

  await ffmpeg.deleteFile(inputName);
  await ffmpeg.deleteFile(outputName);

  return blob;
}

