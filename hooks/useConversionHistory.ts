"use client";

import { useState, useCallback } from "react";
import {
  ConversionRecord,
  loadHistory,
  saveToHistory,
  clearHistory,
} from "@/lib/history";

export function useConversionHistory() {
  const [history, setHistory] = useState<ConversionRecord[]>(() =>
    loadHistory()
  );

  const addRecord = useCallback(
    (record: Omit<ConversionRecord, "id">): void => {
      const updated = saveToHistory(record);
      setHistory(updated);
    },
    []
  );

  const clear = useCallback((): void => {
    clearHistory();
    setHistory([]);
  }, []);

  return { history, addRecord, clearHistory: clear };
}
