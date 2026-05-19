# GitHub Pages Image Host

**Pill ID:** `github-pages-image-host` | **Version:** 0.1.0 (stub) | **Author:** gonzih

Host a batch of images on a public GitHub Pages repository and get permanent public URLs back — no image hosting service account required.

---

## Status: stub

This pill documents a pattern used internally by [`photo-to-squarespace`](../photo-to-squarespace/). A standalone version is planned.

---

## Concept

**Inputs:** a folder of images (JPEG, PNG, WebP)
**Outputs:** a text file mapping each filename to its public GitHub Pages URL

**Steps (planned):**
1. Create a throwaway public GitHub repo (`autoflow-images-<timestamp>`)
2. Push all images to the `gh-pages` branch
3. Enable GitHub Pages via GitHub API
4. Wait for deployment, then output `image-urls.txt` with one `filename → URL` mapping per line

**Requirements:** `gh` CLI logged in, a GitHub account

---

## Why GitHub Pages?

- Free, permanent (as long as the repo exists), no sign-up beyond GitHub
- URLs are predictable: `https://<user>.github.io/<repo>/<filename>`
- Works as a CDN for Squarespace, Shopify, and other e-commerce platforms that accept external image URLs

---

## Contributing

If you flesh this stub into a full pill, open a PR with `WORKFLOW.md` and an updated `pill.json`. See the [root README](../../README.md) for contribution guidelines.
