# Contributing to Convertneo

Thank you for your interest in contributing! This guide covers everything you need to get started, from setting up your local environment to opening a pull request.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Project Overview](#project-overview)
4. [Code Style](#code-style)
5. [Branching Strategy](#branching-strategy)
6. [Commit Messages](#commit-messages)
7. [Pull Request Workflow](#pull-request-workflow)
8. [Adding New Formats](#adding-new-formats)
9. [Reporting Bugs](#reporting-bugs)

---

## Prerequisites

| Tool | Minimum version |
|---|---|
| Node.js | 18 |
| npm | 9 |
| Git | any recent version |

A modern browser with SharedArrayBuffer support (Chrome 92+, Firefox 79+, Safari 15.2+) is required to test conversions locally.

---

## Local Development Setup

```bash
# 1. Fork and clone the repository
git clone https://github.com/<your-username>/Convertneo.git
cd Convertneo

# 2. Install dependencies
npm install

# 3. Create your local environment file from the example
cp .env.example .env.local
# Open .env.local and fill in RESEND_API_KEY and CONTACT_EMAIL if you want
# to test the contact form. The converter works without any env vars.

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Tip:** FFmpeg.wasm fetches its core from `unpkg.com` on first use. You need an active internet connection for the conversion engine to initialise.

---

## Project Overview

Before making changes, familiarise yourself with the key modules:

| File | Responsibility |
|---|---|
| `lib/ffmpeg.ts` | Loads FFmpeg.wasm and runs conversions |
| `lib/history.ts` | Reads/writes conversion history in localStorage |
| `hooks/useConversionHistory.ts` | React state wrapper for history |
| `components/converter/converter.tsx` | Main converter UI |
| `components/upload-zone/file-upload-zone.tsx` | Drag-and-drop file input |
| `app/api/contact/route.ts` | Server-side email handler |

See [ARCHITECTURE.md](ARCHITECTURE.md) for a full technical walkthrough.

---

## Code Style

The project uses **ESLint** with the Next.js default configuration. Before opening a PR, run:

```bash
npm run lint
```

Fix any errors reported. Warnings should also be resolved where practical.

### TypeScript

- All new code must be written in TypeScript.
- Avoid `any` unless there is no practical alternative (e.g. third-party library gaps). Add a short comment explaining why.
- Prefer explicit return types on exported functions and React components.

### React / Next.js

- Use the **App Router** (`app/`) for all new pages and API routes.
- Mark components that use browser APIs or React hooks with `"use client"` at the top of the file.
- Prefer `dynamic(() => import(...), { ssr: false })` for heavy client-only components (e.g., the Converter) to keep the server bundle small.
- Keep components focused. If a component exceeds ~200 lines, consider splitting it.

### Styling

- Use **Tailwind CSS** utility classes exclusively. Do not add CSS files or `<style>` blocks unless unavoidable.
- Use `cn()` from `lib/utils.ts` to merge conditional Tailwind classes.
- Follow the existing dark-mode pattern: `dark:` prefix variants, not JS-based class injection.

### Naming Conventions

| Artefact | Convention | Example |
|---|---|---|
| React components | PascalCase | `HistoryPanel` |
| Hooks | camelCase, `use` prefix | `useConversionHistory` |
| Utility functions | camelCase | `formatFileSize` |
| TypeScript types/interfaces | PascalCase | `ConversionRecord` |
| Files — components | kebab-case | `history-panel.tsx` |
| Files — pages | `page.tsx` inside a route folder | `app/converter/page.tsx` |

---

## Branching Strategy

| Branch | Purpose |
|---|---|
| `main` | Stable, deployable code |
| `feature/<short-description>` | New features |
| `fix/<short-description>` | Bug fixes |
| `chore/<short-description>` | Dependency updates, refactors, docs |

Always branch off `main` and target `main` in your pull request.

---

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<optional scope>): <short imperative summary>

[optional body]

[optional footer(s)]
```

**Common types:**

| Type | When to use |
|---|---|
| `feat` | A new feature visible to users |
| `fix` | A bug fix |
| `chore` | Build, tooling, or dependency changes |
| `docs` | Documentation only |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `style` | Formatting, missing semicolons, etc. (no logic change) |
| `perf` | Performance improvement |

**Examples:**

```
feat(converter): add OGG Vorbis output support
fix(history): prevent duplicate records on fast double-click
docs: add CONTRIBUTING guide
chore(deps): bump @ffmpeg/ffmpeg to 0.12.16
```

---

## Pull Request Workflow

1. **Create a branch** from `main` using the naming convention above.
2. **Make your changes.** Keep commits small and focused.
3. **Run the linter** (`npm run lint`) and fix any issues.
4. **Test your changes** manually in the browser, including both light and dark mode.
5. **Open a pull request** against `main` with a clear description:
   - What problem does this PR solve?
   - How was it tested?
   - Any screenshots for UI changes?
6. Address review feedback and push updated commits to the same branch.

---

## Adding New Formats

To add a new output format, update one place in `lib/ffmpeg.ts` and one place in `components/converter/converter.tsx`:

### 1. `MIME_BY_EXT` in `lib/ffmpeg.ts`

```ts
const MIME_BY_EXT: Record<string, string> = {
  // existing entries …
  flac: "audio/flac", // ← add here
};
```

### 2. `FORMAT_OPTIONS` in `components/converter/converter.tsx`

```ts
const FORMAT_OPTIONS: Record<MediaCategory, { value: string; label: string }[]> = {
  audio: [
    // existing entries …
    { value: "flac", label: "FLAC" }, // ← add here
  ],
  // …
};
```

### 3. Verify FFmpeg.wasm supports the codec

Not all codecs are available in the default FFmpeg.wasm build. Check the [FFmpeg.wasm codec support list](https://ffmpegwasm.netlify.app/) before adding a format. If the codec requires a non-default build, document this limitation in the PR.

---

## Reporting Bugs

Open a [GitHub Issue](https://github.com/DavisNoah02/Convertneo/issues) and include:

- Steps to reproduce
- Expected behaviour
- Actual behaviour
- Browser name and version
- File type and approximate file size (if relevant)
- Any errors from the browser console
