"use client";

import { motion, AnimatePresence } from "motion/react";
import { ConversionRecord } from "@/lib/history";
import { HistoryItem } from "./history-item";
import { History, Trash2, X } from "lucide-react";

interface HistoryPanelProps {
  history: ConversionRecord[];
  onRestore: (record: ConversionRecord) => void;
  onClear: () => void;
  onClose: () => void;
}

export function HistoryPanel({
  history,
  onRestore,
  onClear,
  onClose,
}: HistoryPanelProps) {
  return (
    <AnimatePresence>
      <motion.aside
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 24 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col w-full max-w-xs rounded-2xl border bg-background/80 backdrop-blur-sm shadow-lg overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">
              History
            </span>
            {history.length > 0 && (
              <span className="text-xs text-muted-foreground bg-muted rounded-full px-1.5 py-0.5">
                {history.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <button
                onClick={onClear}
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                aria-label="Clear history"
              >
                <Trash2 className="h-3 w-3" />
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Close history"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[60vh]">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
              <History className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No conversions yet</p>
              <p className="text-xs text-muted-foreground/70">
                Your recent conversions will appear here
              </p>
            </div>
          ) : (
            history.map((record) => (
              <HistoryItem
                key={record.id}
                record={record}
                onRestore={(r) => {
                  onRestore(r);
                  onClose();
                }}
              />
            ))
          )}
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
