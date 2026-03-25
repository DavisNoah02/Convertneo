# Architecture

This document describes the technical architecture of Convertneo — how the major modules relate to each other, how data flows through the application, and what each layer is responsible for.

---

## High-Level Overview

```
Browser
  │
  ├── Next.js App Router (app/)
  │     ├── Landing page  (/)
  │     ├── Converter     (/converter)
  │     └── Contact       (/contact)
  │
  ├── React Component Tree
  │     ├── Layout (ThemeProvider, AppBackground, Footer, Toaster)
  │     ├── Converter UI  (upload zone → format picker → progress → download)
  │     └── History Panel (sidebar / mobile bottom sheet)
  │
  └── Client-Side Runtime
        ├── FFmpeg.wasm  ← runs entirely in the browser thread
        └── localStorage ← persists conversion history
```

The server is only used for:

- Serving the Next.js application (static + RSC)
- The `/api/contact` route, which proxies contact form submissions to Resend

All file conversion happens in the browser. Files are never uploaded to any server.

---

## Module Reference

### `lib/ffmpeg.ts`

The core conversion engine. Wraps `@ffmpeg/ffmpeg` to provide a clean API used by the Converter component.

**Exports:**

| Export | Signature | Description |
|---|---|---|
| `loadFFmpeg` | `() => Promise<boolean>` | Lazy-initialises the FFmpeg.wasm runtime. Idempotent — safe to call multiple times; returns `true` once loaded. Fetches the WebAssembly core from the `unpkg.com` CDN via Blob URLs to satisfy browser security policies. |
| `convert` | `(file: File, options: ConvertOptions) => Promise<Blob>` | Converts a single file. Writes the input to FFmpeg's virtual file system, executes `ffmpeg -y -i input.ext output.ext`, reads the result, cleans up, and returns a `Blob`. |
| `getOutputFilename` | `(inputName: string, outputFormat: string) => string` | Derives the output filename by replacing the extension. Maps `raw` → `bmp`. |

**Key types:**

```ts
type ConversionProgress = {
  progress: number; // 0–100
  time?: number;
};

type ConvertOptions = {
  inputFormat: string;
  outputFormat: string;
  onProgress?: (p: ConversionProgress) => void;
};
```

**Design notes:**

- A single `FFmpeg` instance (`_ffmpeg`) is held in module scope and reused across conversions to avoid the overhead of reloading the WebAssembly binary.
- Progress events are managed with explicit `off` / `on` calls to prevent listener accumulation.
- The `raw` → `bmp` alias exists because FFmpeg.wasm does not support proprietary camera RAW formats.
- The final `Uint8Array` is copied before being wrapped in a `Blob` because FFmpeg may return a `SharedArrayBuffer`-backed view, which cannot be transferred to a `Blob` on some browsers.

---

### `lib/history.ts`

Manages the conversion history stored in `localStorage`.

**Exports:**

| Export | Signature | Description |
|---|---|---|
| `loadHistory` | `() => ConversionRecord[]` | Reads and parses history from `localStorage`. Returns `[]` on any error or in SSR context. |
| `saveToHistory` | `(record: Omit<ConversionRecord, "id">) => ConversionRecord[]` | Prepends a new record, trims to `MAX_HISTORY` (15), persists, and returns the updated list. |
| `clearHistory` | `() => void` | Removes the history key from `localStorage`. |
| `formatFileSize` | `(bytes: number) => string` | Human-readable file size (KB / MB). |
| `formatTimestamp` | `(iso: string) => string` | Relative timestamp ("Just now", "5m ago", "Yesterday", …). |

**`ConversionRecord` shape:**

```ts
interface ConversionRecord {
  id: string;          // crypto.randomUUID() or fallback
  inputFileName: string;
  inputFormat: string;
  outputFormat: string;
  outputFileName: string;
  fileSize: number;    // bytes
  outputSize: number;  // bytes
  timestamp: string;   // ISO 8601
  conversionTime: number; // ms
}
```

---

### `lib/utils.ts`

Exports the `cn(...classValues)` helper that merges Tailwind classes with `clsx` + `tailwind-merge`. Used throughout the component tree to conditionally apply and deduplicate utility classes.

---

### `hooks/useConversionHistory.ts`

A React hook that owns the local component state for the history list and exposes a stable API to the Converter page.

```ts
function useConversionHistory(): {
  history: ConversionRecord[];
  addRecord: (record: Omit<ConversionRecord, "id">) => void;
  clearHistory: () => void;
}
```

State is initialised lazily from `loadHistory()` so it is in sync with `localStorage` on first render. `addRecord` and `clearHistory` are stable references (wrapped in `useCallback`) to avoid unnecessary re-renders in child components.

---

### `app/api/contact/routes.tsx`

A Next.js Route Handler that accepts `POST /api/contact` requests from the contact form. It validates that `name`, `email`, and `message` are present, then sends an email via the [Resend](https://resend.com) SDK.

**Environment variables required:**

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Authenticates requests to the Resend API |
| `CONTACT_EMAIL` | Destination address for contact form submissions |

---

## Component Hierarchy

```
RootLayout (app/layout.tsx)
└── ThemeProvider
    ├── LogoImage
    ├── ThemeToggle
    ├── {page}
    │   ├── Landing (app/page.tsx)
    │   │   └── AppBackground
    │   │       └── main
    │   │           ├── Hero
    │   │           │   ├── ShinyText
    │   │           │   ├── StarButton + RippleButton
    │   │           │   └── CursorCardsContainer
    │   │           ├── MarqueeTestimonial
    │   │           └── FAQsTwo
    │   │
    │   ├── ConverterPage (app/converter/page.tsx)
    │   │   └── AppBackground
    │   │       └── main
    │   │           ├── Converter (dynamic, ssr: false)
    │   │           │   ├── FileUploadZone
    │   │           │   ├── format <select>
    │   │           │   ├── progress bar
    │   │           │   └── download button
    │   │           └── HistoryPanel (sidebar + mobile)
    │   │               └── HistoryItem[]
    │   │
    │   └── ContactPage (app/contact/page.tsx)
    │       └── AppBackground
    │           └── <form> (react-hook-form + zod)
    │
    ├── Footer
    └── Toaster (sonner)
```

---

## Conversion Data Flow

```
User drops file(s)
        │
        ▼
FileUploadZone (react-dropzone)
        │  onFilesSelected(files)
        ▼
Converter component state
  files[], selectedIndex, outputFormat
        │
        │  handleConvert()
        ▼
lib/ffmpeg.ts → loadFFmpeg()
  ├── already loaded?  ──yes──► skip
  └── no ──► fetch wasm from CDN
              └── _ffmpeg.load({ coreURL, wasmURL })
        │
        ▼
lib/ffmpeg.ts → convert(file, options)
  1. _ffmpeg.writeFile(inputName, fetchFile(file))
  2. _ffmpeg.exec(["-y", "-i", inputName, outputName])
     └── progress events ──► onProgress(p) ──► setProgress()
  3. _ffmpeg.readFile(outputName)
  4. _ffmpeg.deleteFile(inputName, outputName)
  5. return new Blob([copy.buffer], { type: mime })
        │
        ▼
Converter component
  setResultBlob(blob)
  onConversionComplete(record) ──► useConversionHistory.addRecord()
                                       └── lib/history.saveToHistory()
                                               └── localStorage
        │
        ▼
Download button
  URL.createObjectURL(blob)
  <a>.click()
  URL.revokeObjectURL(url)
```

---

## Background Animation

The `AppBackground` component wraps every page. It renders a full-viewport `DotGrid` canvas (fixed, `z-index: 0`) behind the page content (`z-index: 10`).

`DotGrid` (`components/ui/DotGrid.tsx`) uses the HTML Canvas API and GSAP's InertiaPlugin to animate a grid of dots that react to mouse proximity, hover, and click ("shockwave") events. The dot colour adapts to the active theme.

---

## Styling Conventions

- Tailwind CSS v4 utility classes are used exclusively for styling.
- `cn()` from `lib/utils.ts` is used whenever classes are conditional or merged.
- Variants (e.g. primary buttons vs. muted buttons) are expressed inline rather than in a separate variants file, unless the component already uses `class-variance-authority` (CVA).
- `shadcn/ui` provides base primitives (Button, Input, Label, Textarea, etc.) that are customised via Tailwind.
