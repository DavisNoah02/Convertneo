# Security Policy

## Supported Versions

Only the latest release of Convertneo is actively maintained and receives security fixes.

| Version | Supported |
|---------|-----------|
| latest  | ✅ Yes    |
| older   | ❌ No     |

---

## Security Model

Convertneo is a **100% client-side application**. All file conversion runs entirely in the browser using FFmpeg.wasm — your files are never uploaded to any server. The only server-side component is the `/api/contact` route, which forwards contact form submissions to [Resend](https://resend.com).

Key security properties:

- **No file uploads** — files never leave your device during conversion.
- **No user accounts** — no credentials are stored or transmitted.
- **No persistent server state** — conversion history is stored exclusively in your browser's `localStorage`.
- **Minimal attack surface** — the only environment variables handled server-side are `RESEND_API_KEY` and `CONTACT_EMAIL`.

---

## Reporting a Vulnerability

If you discover a security vulnerability, please **do not** open a public GitHub Issue. Instead, report it responsibly using one of the following methods:

1. **GitHub Private Vulnerability Reporting** — use the [Security Advisories](https://github.com/DavisNoah02/Convertneo/security/advisories/new) page to submit a private report.
2. **Contact form** — send a message through the [Convertneo contact page](https://convertneo.vercel.app/contact). Include "Security" in your message so it can be prioritised.

Please include as much detail as possible:

- A clear description of the vulnerability
- Steps to reproduce the issue
- Potential impact or attack scenario
- Any suggested mitigation (optional)

---

## Response Process

1. Your report will be acknowledged within **72 hours**.
2. The maintainer will investigate and confirm whether the issue is valid.
3. A fix will be developed and tested privately.
4. A patched release will be published, and a security advisory will be disclosed after the fix is available.
5. Credit will be given to the reporter (unless anonymity is requested).

---

## Out of Scope

The following are not considered security vulnerabilities for this project:

- Issues in third-party dependencies (report those to the dependency maintainer directly; e.g., FFmpeg.wasm, Next.js, Resend).
- Theoretical vulnerabilities with no demonstrated impact.
- Issues requiring physical access to the user's device.
- Self-XSS or issues exploitable only by the victim themselves.
