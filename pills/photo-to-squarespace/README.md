# Photo → Squarespace Product Listings

**Pill ID:** `photo-to-squarespace` | **Version:** 1.0.0 | **Author:** gonzih

Turn a folder of clothing photos into a Squarespace Commerce import-ready CSV with public image URLs — no code required.

---

## What you need

| Requirement | Details |
|-------------|---------|
| macOS | Required for `sips` (HEIC conversion) |
| Python 3 | Standard install; Flask is pip-installed by the workflow |
| ComfyUI venv | At `/Users/feral/of-stack/ComfyUI/venv/bin/python` with `transformers==4.51.3` |
| Florence-2 model | At `/Users/feral/of-stack/ComfyUI/models/LLM/Florence-2-base` |
| `gh` CLI | Logged in (`gh auth status` should succeed) |
| A GitHub account | For the throwaway Pages repo that hosts images |

### Photo naming convention

Name your photos to include the item and brand/size where possible. The workflow clusters by item name, so descriptive names save you manual review time.

Good examples:
```
gap_jeans_4t_front.heic
gap_jeans_4t_back.heic
gap_jeans_4t_brand_tag.heic
hm_dress_blue_5y_front.heic
patagonia_jacket_3t_front.heic
patagonia_jacket_3t_brand_tag.heic
```

---

## What you get

| Output | Location |
|--------|----------|
| JPEG versions of all photos | `jpgs/` |
| Squarespace import CSV | `squarespace/products.csv` |
| Public image URLs | GitHub Pages (embedded in the CSV) |

The CSV is ready to import at **Squarespace → Commerce → Products → Import**.

---

## How to run

1. Place your photos in a folder, e.g. `~/clothing-photos/`.
2. Open Claude Code in this pill's directory:
   ```
   cd pills/photo-to-squarespace
   ```
3. Tell Claude Code:
   ```
   Run WORKFLOW.md. My photos are at ~/clothing-photos/
   ```
4. When the Flask clustering UI opens at http://localhost:5555, review the auto-clusters, drag items between groups if needed, then click **Done**.
5. The agent finishes — collect `squarespace/products.csv`.
6. In Squarespace: Commerce → Products → Import → upload the CSV.

---

## Known limitations

- HEIC conversion requires macOS (`sips`). On Linux, swap step 1 for `convert` (ImageMagick).
- Florence-2 captions are best-effort; sizes and materials from tag photos may need spot-checking.
- GitHub Pages repo is public. Don't use this workflow for photos with personal information visible.
- Squarespace CSV format targets **v3 Commerce**. Earlier store versions may need column adjustments.
