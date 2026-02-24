export type ConversionProgress = {
  progress: number; // 0–100
  time?: number;
  speed?: string;
};

export type ConvertOptions = {
  inputFormat: string;
  outputFormat: string;
  onProgress?: (p: ConversionProgress) => void;
};

let _ffmpeg:
  | (import("@ffmpeg/ffmpeg").FFmpeg & {
      __isLoaded?: boolean;
    })
  | null = null;

let _progressHandler: ((p: any) => void) | null = null;

const MIME_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  ico: "image/x-icon",
  tif: "image/tiff",
  tiff: "image/tiff",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg",
  mp4: "video/mp4",
  webm: "video/webm",
  avi: "video/x-msvideo",
  mov: "video/quicktime",
};

function normalizeExt(ext: string) {
  return ext.replace(/^\./, "").toLowerCase();
}

function safeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

/**
 * Load FFmpeg.wasm (call once before conversions).
 */
export async function loadFFmpeg(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  if (_ffmpeg?.__isLoaded) return true;

  const [{ FFmpeg }, { toBlobURL }] = await Promise.all([
    import("@ffmpeg/ffmpeg"),
    import("@ffmpeg/util"),
  ]);

  if (!_ffmpeg) {
    _ffmpeg = new FFmpeg();
  }

  // Load core from CDN (simple + works in Next without bundling core assets)
  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";

  const [coreURL, wasmURL] = await Promise.all([
    toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
  ]);

  await _ffmpeg.load({ coreURL, wasmURL });
  _ffmpeg.__isLoaded = true;

  return true;
}

/**
 * Convert a file to the target format.
 * Returns the converted file as a Blob for download.
 */
export async function convert(
  file: File,
  options: ConvertOptions
): Promise<Blob> {
  const { inputFormat, outputFormat, onProgress } = options;

  const loaded = await loadFFmpeg();
  if (!loaded || !_ffmpeg) {
    throw new Error("FFmpeg failed to load");
  }

  const { fetchFile } = await import("@ffmpeg/util");

  const inExt = normalizeExt(inputFormat) || normalizeExt(getExtension(file.name));
  const outExt = normalizeExt(outputFormat);

  // Map "raw" to something commonly supported by ffmpeg for images
  const finalOutExt = outExt === "raw" ? "bmp" : outExt;

  const inputName = safeName(`input.${inExt || "bin"}`);
  const outputName = safeName(`output.${finalOutExt}`);

  const handleProgress = (p: any) => {
    // p.progress is 0..1
    const pct = typeof p?.progress === "number" ? p.progress * 100 : 0;
    onProgress?.({ progress: Math.max(0, Math.min(100, pct)), time: p?.time });
  };

  // Ensure we don't accumulate multiple listeners between conversions
  if (_progressHandler) {
    _ffmpeg.off("progress", _progressHandler as any);
  }
  _progressHandler = handleProgress;
  _ffmpeg.on("progress", _progressHandler as any);

  await _ffmpeg.writeFile(inputName, await fetchFile(file));

  // Basic conversion: input → output (codec defaults based on container/ext)
  // -y forces overwrite if a previous run left files behind.
  await _ffmpeg.exec(["-y", "-i", inputName, outputName]);

  const data = await _ffmpeg.readFile(outputName);

  // Cleanup
  await Promise.allSettled([
    _ffmpeg.deleteFile(inputName),
    _ffmpeg.deleteFile(outputName),
  ]);

  // Ensure we pass an ArrayBuffer-backed BlobPart (ffmpeg may return SAB-backed views)
  const u8 = data instanceof Uint8Array ? data : new Uint8Array(data as any);
  const copy = new Uint8Array(u8.byteLength);
  copy.set(u8);

  const mime = MIME_BY_EXT[finalOutExt] ?? "application/octet-stream";
  return new Blob([copy.buffer], { type: mime });
}

/**
 * Get output filename with new extension.
 */
export function getOutputFilename(inputName: string, outputFormat: string): string {
  const base = inputName.replace(/\.[^.]+$/, "");
  const normalized = normalizeExt(outputFormat);
  const finalOutExt = normalized === "raw" ? "bmp" : normalized;
  const ext = finalOutExt.startsWith(".") ? finalOutExt : `.${finalOutExt}`;
  return `${base}${ext}`;
}

function getExtension(filename: string): string {
  const match = filename.match(/\.([^.]+)$/);
  return match ? match[1].toLowerCase() : "";
}
