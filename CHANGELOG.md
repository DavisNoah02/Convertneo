# Changelog

All notable changes to Convertneo will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

- `LICENSE` — MIT license
- `.env.example` — environment variable template
- `CODE_OF_CONDUCT.md` — community guidelines
- `CHANGELOG.md` — this file
- `SECURITY.md` — security policy and vulnerability reporting

---

## [1.0.0] — 2026-03-26

### Added

- 100% client-side file conversion using FFmpeg.wasm (images, audio, video)
- Supported image formats: JPG, JPEG, PNG, WebP, GIF, ICO, TIF, RAW
- Supported audio formats: MP3, WAV, OGG
- Supported video formats: MP4, WebM, AVI, MOV
- Drag-and-drop file upload zone (up to 10 files, 500 MB each)
- Real-time conversion progress indicator
- Conversion history — last 15 conversions stored in `localStorage`
- One-click download of converted files
- Dark / light mode with system preference detection and manual toggle
- Contact form powered by [Resend](https://resend.com)
- Animated DotGrid background with mouse-reactive dot effects
- Responsive UI for desktop and mobile
- `docs/ARCHITECTURE.md` — technical architecture documentation
- `docs/CONTRIBUTING.md` — contribution guide

[Unreleased]: https://github.com/DavisNoah02/Convertneo/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/DavisNoah02/Convertneo/releases/tag/v1.0.0
