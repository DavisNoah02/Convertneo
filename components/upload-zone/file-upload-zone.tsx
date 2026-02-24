"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "motion/react";
import { Upload, File, X, Image, Music, Video, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";


export interface FileUploadZoneProps {
  onFilesSelected?: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number; // in bytes
  className?: string;
}

const defaultAccept = {
  "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"],
  "audio/*": [".mp3", ".wav", ".ogg"],
  "video/*": [".mp4", ".avi", ".mov", ".webm"],
};

export function FileUploadZone({
  onFilesSelected,
  accept = defaultAccept,
  maxFiles = 10,
  maxSize = 500 * 1024 * 1024, // 500MB default
  className,
}: FileUploadZoneProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles);
      setFiles(newFiles);
      onFilesSelected?.(newFiles);
    },
    [files, maxFiles, onFilesSelected]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept,
      maxSize,
      multiple: true,
      onDragEnter: () => setIsDragging(true),
      onDragLeave: () => setIsDragging(false),
      onDropAccepted: () => setIsDragging(false),
      onDropRejected: () => setIsDragging(false),
    });

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesSelected?.(newFiles);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return Image;
    if (file.type.startsWith("audio/")) return Music;
    if (file.type.startsWith("video/")) return Video;
    return File;
  };

  const isActive = isDragActive || isDragging;

  return (
    <div className={cn("w-full space-y-4", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "relative group cursor-pointer rounded-xl border-2 border-dashed transition-all duration-300",
          "bg-gradient-to-b from-muted/70 via-background/95 to-muted/70 dark:from-background/80 dark:via-background/95 dark:to-background/80 backdrop-blur-sm",
          isActive
            ? "border-primary bg-primary/5 scale-[1.02] shadow-lg shadow-primary/25"
            : "border-border/70 hover:border-primary/60 hover:bg-card/80",
          className
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <motion.div
            animate={{
              scale: isActive ? 1.1 : 1,
              rotate: isActive ? 5 : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="mb-4"
          >
            <Upload
              className={cn(
                "h-12 w-12 transition-colors duration-300",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            />
          </motion.div>

          <AnimatePresence mode="wait">
            {isActive ? (
              <motion.div
                key="active"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-lg font-semibold text-primary">
                  Drop files here
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Release to upload
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="inactive"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-lg font-semibold text-foreground">
                  Drag & drop files here
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  or click to browse
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-4 flex flex-wrap gap-2 justify-center text-xs text-muted-foreground">
            <span className="px-2 py-1 rounded-md bg-muted/50">
              Images: jpg, png, webp, gif, svg
            </span>
            <span className="px-2 py-1 rounded-md bg-muted/50">
              Audio: mp3, wav, ogg
            </span>
            <span className="px-2 py-1 rounded-md bg-muted/50">
              Video: mp4, avi, mov, webm
            </span>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Max {maxFiles} files, {formatFileSize(maxSize)} per file
          </p>
        </div>

        {/* Animated border effect */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 rounded-xl border-2 border-primary/30 animate-pulse" />
            <motion.div
              className="absolute inset-0 rounded-xl border-2 border-primary"
              animate={{
                background: [
                  "linear-gradient(0deg, transparent, transparent)",
                  "linear-gradient(90deg, transparent, rgba(var(--primary), 0.3), transparent)",
                  "linear-gradient(180deg, transparent, transparent)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </motion.div>
        )}
      </div>

      {/* File Rejections */}
      {fileRejections.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="rounded-lg bg-destructive/10 border border-destructive/20 p-3"
        >
          <p className="text-sm font-medium text-destructive">
            Some files were rejected:
          </p>
          <ul className="mt-2 space-y-1 text-xs text-destructive/80">
            {fileRejections.map(({ file, errors }, index) => (
              <li key={index}>
                {file.name}: {errors.map((e) => e.message).join(", ")}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Selected Files List */}
      {files.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <FileCheck className="h-4 w-4" />
            <span>
              {files.length} file{files.length !== 1 ? "s" : ""} selected
            </span>
          </div>
          <div className="space-y-2">
            <AnimatePresence>
              {files.map((file, index) => {
                const Icon = getFileIcon(file);
                return (
                  <motion.div
                    key={`${file.name}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-3 rounded-lg border bg-card p-3 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-shrink-0 rounded-md bg-primary/10 p-2">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)} • {file.type || "Unknown"}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      className="flex-shrink-0 rounded-md p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      aria-label="Remove file"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  );
}
