"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FileUploadZone } from "@/components/file-upload-zone";
import { convert, getOutputFilename } from "@/lib/ffmpeg";
import {
  Download,
  Loader2,
  RefreshCcw,
  FileWarning,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type MediaCategory = "image" | "audio" | "video";

const FORMAT_OPTIONS: Record<MediaCategory, { value: string; label: string }[]> = {
  image: [
    { value: "jpg", label: "JPG" },
    { value: "jpeg", label: "JPEG" },
    { value: "png", label: "PNG" },
    { value: "webp", label: "WebP" },
    { value: "gif", label: "GIF" },
    { value: "ico", label: "ICO" },
    { value: "tif", label: "TIF" },
    { value: "raw", label: "RAW" },
  ],
  audio: [
    { value: "mp3", label: "MP3" },
    { value: "wav", label: "WAV" },
    { value: "ogg", label: "OGG" },
  ],
  video: [
    { value: "mp4", label: "MP4" },
    { value: "webm", label: "WebM" },
    { value: "avi", label: "AVI" },
    { value: "mov", label: "MOV" },
  ],
};

function getCategory(file: File): MediaCategory {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("audio/")) return "audio";
  if (file.type.startsWith("video/")) return "video";
  return "image";
}

function getExtension(filename: string): string {
  const match = filename.match(/\.([^.]+)$/);
  return match ? match[1].toLowerCase() : "";
}

export function Converter() {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [outputFormat, setOutputFormat] = useState("");
  const [progress, setProgress] = useState<number | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  const selectedFile = files[selectedIndex] ?? null;
  const category = selectedFile ? getCategory(selectedFile) : null;
  const formatOptions = category ? FORMAT_OPTIONS[category] : [];
  const inputExt = selectedFile ? getExtension(selectedFile.name) : "";

  const handleFilesSelected = useCallback((newFiles: File[]) => {
    setFiles(newFiles);
    setSelectedIndex(0);
    setOutputFormat("");
    setResultBlob(null);
    setError(null);
    setProgress(null);
  }, []);

  // Auto-pick a default output format after upload (different from input ext)
  useEffect(() => {
    if (!selectedFile) return;
    if (outputFormat) return;
    const opts = formatOptions.map((o) => o.value);
    const next = opts.find((o) => o !== inputExt) ?? opts[0] ?? "";
    setOutputFormat(next);
  }, [selectedFile, inputExt, formatOptions, outputFormat]);

  const handleConvert = async () => {
    if (!selectedFile || !outputFormat) return;
    setError(null);
    setResultBlob(null);
    setIsConverting(true);
    setProgress(0);

    try {
      const blob = await convert(selectedFile, {
        inputFormat: inputExt,
        outputFormat,
        onProgress: (p) => setProgress(p.progress),
      });
      setResultBlob(blob);
      setProgress(100);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed");
      setProgress(null);
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob || !selectedFile) return;
    const name = getOutputFilename(selectedFile.name, outputFormat);
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const canConvert =
    selectedFile && outputFormat && outputFormat !== inputExt && !isConverting;

  const fileSummary = useMemo(() => {
    if (!selectedFile) return null;
    const sizeKb = selectedFile.size / 1024;
    const size =
      sizeKb < 1024
        ? `${sizeKb.toFixed(2)} KB`
        : `${(sizeKb / 1024).toFixed(2)} MB`;
    return { name: selectedFile.name, size };
  }, [selectedFile]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Step 1: Dropzone → setFile */}
      <section>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">
          Upload
        </h2>
        <FileUploadZone
          onFilesSelected={handleFilesSelected}
          maxFiles={10}
          maxSize={500 * 1024 * 1024}
        />
      </section>

      {/* Step 2: Converter uses file — format selector & convert */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            <h2 className="text-sm font-medium text-muted-foreground">
              Convert
            </h2>

            {files.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {files.map((file, i) => (
                  <button
                    key={`${file.name}-${i}`}
                    onClick={() => {
                      setSelectedIndex(i);
                      setResultBlob(null);
                      setOutputFormat("");
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                      selectedIndex === i
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {file.name}
                  </button>
                ))}
              </div>
            )}

            <div className="rounded-2xl border bg-card/60 backdrop-blur-sm p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {fileSummary?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {fileSummary?.size}
                    {inputExt ? ` • ${inputExt.toUpperCase()}` : ""}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value)}
                    className="h-10 rounded-xl border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select format</option>
                    {formatOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      setFiles([]);
                      setSelectedIndex(0);
                      setOutputFormat("");
                      setProgress(null);
                      setResultBlob(null);
                      setError(null);
                    }}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-background text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    aria-label="Clear files"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={handleConvert}
                  disabled={!canConvert}
                  className={cn(
                    "w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition",
                    canConvert
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                >
                  {isConverting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Converting…
                    </>
                  ) : (
                    <>
                      <RefreshCcw className="h-4 w-4" />
                      Convert Now
                    </>
                  )}
                </button>
              </div>

              {/* Progress */}
              {progress !== null && (
                <div className="mt-4 space-y-2">
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {progress < 100 ? `${Math.round(progress)}%` : "Done"}
                  </p>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                <FileWarning className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Step 3: Download */}
            {resultBlob && progress === 100 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 rounded-lg border bg-primary/5 border-primary/20 p-4"
              >
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    Ready to download
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {getOutputFilename(selectedFile!.name, outputFormat)}
                  </p>
                </div>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </motion.div>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
