"use client";

import { ConversionRecord, formatFileSize, formatTimestamp } from "@/lib/history";
import { FileAudio, FileImage, FileVideo, RotateCcw } from "lucide-react";

interface HistoryItemProps {
  record: ConversionRecord;
  onRestore: (record: ConversionRecord) => void;
}

function FormatIcon({ format }: { format: string }) {
  const imageFormats = ["jpg", "jpeg", "png", "webp", "gif", "ico", "tif", "raw"];
  const audioFormats = ["mp3", "wav", "ogg"];
  const videoFormats = ["mp4", "webm", "avi", "mov"];

  if (audioFormats.includes(format.toLowerCase()))
    return <FileAudio className="h-4 w-4 text-blue-400 flex-shrink-0" />;
  if (videoFormats.includes(format.toLowerCase()))
    return <FileVideo className="h-4 w-4 text-purple-400 flex-shrink-0" />;
  if (imageFormats.includes(format.toLowerCase()))
    return <FileImage className="h-4 w-4 text-emerald-400 flex-shrink-0" />;
  return <FileImage className="h-4 w-4 text-muted-foreground flex-shrink-0" />;
}

export function HistoryItem({ record, onRestore }: HistoryItemProps) {
  return (
    <div className="group flex items-start gap-3 rounded-xl border bg-card/60 p-3 hover:bg-card transition-colors">
      <FormatIcon format={record.inputFormat} />

      <div className="flex-1 min-w-0 space-y-0.5">
        <p className="truncate text-sm font-medium text-foreground leading-tight">
          {record.inputFileName}
        </p>
        <p className="text-xs text-muted-foreground">
          <span className="uppercase">{record.inputFormat}</span>
          {" → "}
          <span className="uppercase">{record.outputFormat}</span>
          {" • "}
          {formatFileSize(record.fileSize)}
        </p>
        <p className="text-xs text-muted-foreground/70">
          {formatTimestamp(record.timestamp)}
        </p>
      </div>

      <button
        onClick={() => onRestore(record)}
        className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center justify-center h-7 w-7 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary"
        aria-label="Restore settings"
        title="Restore settings"
      >
        <RotateCcw className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
