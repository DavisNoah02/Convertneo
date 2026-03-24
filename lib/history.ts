const HISTORY_KEY = "convertneo_history";
const MAX_HISTORY = 15;

export interface ConversionRecord {
  id: string;
  inputFileName: string;
  inputFormat: string;
  outputFormat: string;
  outputFileName: string;
  fileSize: number;
  outputSize: number;
  timestamp: string; // ISO string for serialization
  conversionTime: number; // milliseconds
}

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function loadHistory(): ConversionRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ConversionRecord[];
  } catch {
    return [];
  }
}

export function saveToHistory(
  record: Omit<ConversionRecord, "id">
): ConversionRecord[] {
  const existing = loadHistory();
  const newRecord: ConversionRecord = { ...record, id: generateId() };
  const updated = [newRecord, ...existing].slice(0, MAX_HISTORY);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // Silently fail if storage is unavailable
  }
  return updated;
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    // Silently fail
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  // Handle future timestamps (e.g. clock skew)
  if (diffMs < 0) return "Just now";

  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
