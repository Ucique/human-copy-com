# Human Copy Landingpage

This repository contains the source files for **human-copy.com**, a conversion-focused one‑page site for AI‑Humanisierung & Copyediting.

## Quickstart

1. Clone this repository or use GitHub's web editor to update files.
2. The site is served directly from `index.html`, along with `styles.css` and `app.js`.
3. To preview locally, open `index.html` in a browser.
4. To deploy, push changes to the `main` branch. GitHub Pages will update automatically.

## Deploy on GitHub Pages

1. Go to **Settings → Pages** for this repository.
2. Under **Source**, choose **Deploy from branch**, select **main** and set **/ (root)** folder.
3. Add the custom domain **human-copy.com** (must be configured in your DNS).
4. Ensure the file named `CNAME` in the repository contains:

```
human-copy.com
```

5. Toggle **Enforce HTTPS** once DNS is configured.

## DNS Setup

Create A and AAAA records pointing to GitHub Pages:

```
A @ 185.199.108.153
A @ 185.199.109.153
A @ 185.199.110.153
A @ 185.199.111.153

AAAA @ 2606:50c0:8000::153
AAAA @ 2606:50c0:8001::153
AAAA @ 2606:50c0:8002::153
AAAA @ 2606:50c0:8003::153

CNAME www human-copy.com
```

## Form Handling

The contact form in `index.html` uses [Formspree](https://formspree.io/) if a Formspree endpoint is specified. To enable:

1. Create a form in Formspree.
2. Copy your endpoint URL (e.g. `https://formspree.io/f/xyzabc`).
3. Open `app.js` and set `const FORMSPREE_ENDPOINT = "https://formspree.io/f/xyzabc";`.

If no endpoint is set, the form falls back to `mailto:hello@human-copy.com`.

## Analytics Placeholder

There is a commented placeholder for Plausible or GA4 tracking in `index.html`. Replace it with your actual analytics script to enable tracking.

## Legal Requirements

For German websites you must include a valid **Impressum** and **Datenschutzerklärung**. Fill out the content in the modals in `index.html` before going live.

## Final Checklist

- [ ] Replace placeholder email addresses with `hello@human-copy.com` (already done).
- [ ] Enter your Formspree endpoint in `app.js` or confirm mailto fallback.
- [ ] Configure DNS records and add `human-copy.com` in GitHub Pages.
- [ ] Fill in **Impressum** and **Datenschutz** content.
- [ ] Test the contact form and ensure success/error messages display.
- [ ] Enable HTTPS in GitHub Pages.

---

This project is maintained by Charlotte for the **AI → Human Copy** service.
