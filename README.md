# Convertneo

**Browser-based media file converter — images, audio, and video, all without server uploads.**

Convertneo runs entirely in the browser using [FFmpeg.wasm](https://ffmpegwasm.netlify.app/). Your files never leave your device. No accounts, no limits, no watermarks.

---

## Features

- **100% client-side conversion** — FFmpeg runs in a WebAssembly sandbox inside the browser; files are never uploaded to any server.
- **Images** — JPG, JPEG, PNG, WebP, GIF, ICO, TIF, RAW
- **Audio** — MP3, WAV, OGG
- **Video** — MP4, WebM, AVI, MOV
- **Conversion history** — the last 15 conversions are stored locally in `localStorage` and can be restored in one click.
- **Dark / light mode** — system preference is respected and can be toggled manually.
- **Contact form** — powered by [Resend](https://resend.com) for email delivery.
- **Responsive UI** — works on desktop and mobile.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript 5 |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) |
| Conversion engine | [FFmpeg.wasm](https://ffmpegwasm.netlify.app/) (`@ffmpeg/ffmpeg` 0.12) |
| Animation | [Motion (Framer Motion)](https://motion.dev) + [GSAP](https://gsap.com) |
| Forms | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) |
| Email | [Resend](https://resend.com) |
| File drop | [react-dropzone](https://react-dropzone.js.org) |

---

## Project Structure

```
convertneo/
├── app/
│   ├── globals.css              # Global styles — Tailwind v4 imports and CSS theme variables
│   ├── layout.tsx               # Root layout — fonts, ThemeProvider, Footer, Toaster
│   ├── page.tsx                 # Landing page — Hero, Testimonials, FAQs
│   ├── converter/
│   │   └── page.tsx             # Converter page — file upload, format picker, history
│   ├── contact/
│   │   └── page.tsx             # Contact support form
│   └── api/
│       └── contact/
│           └── route.ts         # POST /api/contact — sends email via Resend
├── components/
│   ├── converter/
│   │   └── converter.tsx        # Core converter UI (upload → select format → convert → download)
│   ├── heropage/
│   │   └── hero.tsx             # Landing hero section with animated CTA
│   ├── history/
│   │   ├── history-panel.tsx    # Sidebar panel listing past conversions
│   │   └── history-item.tsx     # Single history entry row
│   ├── layout/
│   │   ├── app-background.tsx   # Animated DotGrid background wrapper
│   │   ├── footer.tsx           # Site footer
│   │   ├── theme-provider.tsx   # next-themes context provider
│   │   └── theme-toggle.tsx     # Dark/light mode toggle button
│   ├── upload-zone/
│   │   └── file-upload-zone.tsx # Drag-and-drop / click-to-browse file input
│   ├── faqs/
│   │   └── faqs-section.tsx     # Accordion FAQ section
│   ├── testimonial/
│   │   └── marquee.tsx          # Scrolling testimonials marquee
│   └── ui/                      # Shared primitives (Button, Input, DotGrid, ShinyText, …)
├── hooks/
│   └── useConversionHistory.ts  # React hook — wraps history lib with useState/useCallback
├── lib/
│   ├── ffmpeg.ts                # FFmpeg.wasm wrapper — loadFFmpeg(), convert(), getOutputFilename()
│   ├── history.ts               # localStorage CRUD — ConversionRecord type and helpers
│   └── utils.ts                 # cn() Tailwind class merger
├── public/                      # Static assets
├── components.json              # shadcn/ui component configuration
├── next.config.ts               # Next.js configuration
├── postcss.config.mjs           # PostCSS configuration (Tailwind v4 plugin)
└── tsconfig.json                # TypeScript configuration
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** (or yarn / pnpm / bun)

### Installation

```bash
git clone https://github.com/DavisNoah02/Convertneo.git
cd Convertneo
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
# Resend API key — required for the /contact form to send emails
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx

# Destination email address for contact form submissions
CONTACT_EMAIL=you@example.com
```

> The contact form will fail gracefully if these are not set; the converter itself works without any environment variables.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build & Production

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

---

## Supported Formats

| Category | Input / Output formats |
|---|---|
| Image | `jpg`, `jpeg`, `png`, `webp`, `gif`, `ico`, `tif`, `raw` |
| Audio | `mp3`, `wav`, `ogg` |
| Video | `mp4`, `webm`, `avi`, `mov` |

> **Note:** `raw` images are converted to/from BMP internally because FFmpeg.wasm does not support proprietary camera RAW formats (CR2, NEF, etc.).

---

## How It Works

1. **Upload** — drop one or more files onto the upload zone (max 500 MB per file, up to 10 files).
2. **Select format** — choose the output format from the dropdown. The input format is auto-detected from the file's MIME type.
3. **Convert** — click **Convert Now**. FFmpeg.wasm runs in the browser thread, reporting progress in real time.
4. **Download** — once complete, click **Download** to save the converted file. The result is also logged to conversion history.

All processing happens locally. No data leaves your machine.

---

## Deployment

The recommended platform is [Vercel](https://vercel.com):

```bash
npx vercel
```

Add `RESEND_API_KEY` and `CONTACT_EMAIL` as environment variables in your Vercel project settings.

For other platforms (Netlify, Railway, Docker, etc.) follow the standard Next.js deployment guide: [nextjs.org/docs/deployment](https://nextjs.org/docs/app/building-your-application/deploying).

---

## Documentation

| Document | Description |
|---|---|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Technical architecture, module responsibilities, and data flow |
| [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) | Development setup, code style, and pull request workflow |

---

## Contributing

Contributions are welcome. Please read [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) before opening a pull request.
