# WORKFLOW — Photo → Squarespace Product Listings

This file is the authoritative step-by-step that Claude Code executes when running this pill.
Read it entirely before starting. Ask the user for their photo folder path if not already provided.

---

## Pre-flight checklist

Before starting, verify:

```bash
# macOS sips available
which sips

# Python 3 available
python3 --version

# ComfyUI venv + transformers
/Users/feral/of-stack/ComfyUI/venv/bin/python -c "import transformers; print(transformers.__version__)"
# Expected: 4.51.3

# Florence-2 model present
ls /Users/feral/of-stack/ComfyUI/models/LLM/Florence-2-base/

# gh CLI logged in
gh auth status
```

If any check fails, stop and tell the user which requirement is missing before proceeding.

Set these variables for the rest of the workflow:
- `PHOTO_DIR` — the user's input folder (ask if not provided)
- `WORK_DIR` — working directory alongside this pill (e.g. `~/clothing-run-YYYYMMDD/`)
- `VENV_PY` — `/Users/feral/of-stack/ComfyUI/venv/bin/python`
- `FLORENCE_MODEL` — `/Users/feral/of-stack/ComfyUI/models/LLM/Florence-2-base`

Create `$WORK_DIR` and subdirectories:
```bash
mkdir -p "$WORK_DIR/jpgs" "$WORK_DIR/squarespace"
```

---

## Step 1 — Convert HEIC → JPEG

Use `sips` to convert every `.heic` / `.HEIC` file in `PHOTO_DIR` to JPEG and place results in `$WORK_DIR/jpgs/`.

```bash
for f in "$PHOTO_DIR"/*.{heic,HEIC}; do
  [ -f "$f" ] || continue
  base=$(basename "$f" | sed 's/\.[Hh][Ee][Ii][Cc]$//')
  sips -s format jpeg "$f" --out "$WORK_DIR/jpgs/${base}.jpg" --resampleLongSide 1600
done
```

Also copy any existing `.jpg` / `.jpeg` / `.JPG` files from `PHOTO_DIR` into `$WORK_DIR/jpgs/` unchanged.

After conversion, list the jpgs directory and confirm at least one file is present.

---

## Step 2 — Auto-cluster photos by item

Group photos into clusters where each cluster = one product listing.

**Clustering logic:**
1. Take each filename (without extension).
2. Strip trailing descriptive suffixes: `_front`, `_back`, `_brand_tag`, `_fabric_tag`, `_tag`, `_detail`, `_side`, `_label`.
3. The remaining stem is the **item key** (e.g. `gap_jeans_4t`).
4. Group all photos sharing the same item key into one cluster.

Produce an in-memory cluster map: `{ item_key: [list of jpg filenames] }`.

---

## Step 3 — Flask clustering UI for manual review

Spin up a minimal Flask app at `http://localhost:5555` so the user can review and adjust clusters before vision processing.

Write the following Flask app to `$WORK_DIR/cluster_ui/app.py`:

```python
#!/usr/bin/env python3
"""Clustering review UI for photo-to-squarespace pill."""
import json
import os
from pathlib import Path
from flask import Flask, jsonify, request, send_from_directory, render_template_string

app = Flask(__name__)

WORK_DIR = os.environ["WORK_DIR"]
JPGS_DIR = os.path.join(WORK_DIR, "jpgs")
CLUSTERS_FILE = os.path.join(WORK_DIR, "clusters.json")

# Load clusters from environment-injected JSON
clusters: dict[str, list[str]] = json.loads(os.environ["CLUSTERS_JSON"])

HTML = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Cluster Review</title>
<style>
  body { font-family: system-ui, sans-serif; margin: 2rem; background: #f8f8f8; }
  h1 { margin-bottom: 0.5rem; }
  .subtitle { color: #666; margin-bottom: 2rem; }
  .cluster { background: white; border: 1px solid #ddd; border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem; }
  .cluster h2 { font-size: 1rem; margin: 0 0 0.75rem; }
  .photos { display: flex; flex-wrap: wrap; gap: 8px; }
  .photo { position: relative; }
  .photo img { width: 120px; height: 120px; object-fit: cover; border-radius: 4px; border: 1px solid #ccc; }
  .photo span { display: block; font-size: 0.7rem; color: #555; max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .done-btn { position: fixed; bottom: 2rem; right: 2rem; background: #0070f3; color: white; border: none; border-radius: 8px; padding: 0.75rem 1.5rem; font-size: 1rem; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
  .done-btn:hover { background: #005cc5; }
  .note { background: #fffbe6; border: 1px solid #f0d060; border-radius: 6px; padding: 0.75rem 1rem; margin-bottom: 2rem; font-size: 0.9rem; }
</style>
</head>
<body>
<h1>Cluster Review</h1>
<p class="subtitle">Review auto-detected product clusters. Each cluster becomes one Squarespace listing.</p>
<div class="note">This is a read-only review. To merge or split clusters, tell Claude Code which items to move after clicking <strong>Done</strong>.</div>
{% for key, photos in clusters.items() %}
<div class="cluster">
  <h2>{{ key }} <small style="color:#999">({{ photos|length }} photo{{ 's' if photos|length != 1 }})</small></h2>
  <div class="photos">
    {% for photo in photos %}
    <div class="photo">
      <img src="/jpg/{{ photo }}" alt="{{ photo }}">
      <span>{{ photo }}</span>
    </div>
    {% endfor %}
  </div>
</div>
{% endfor %}
<button class="done-btn" onclick="done()">Done — looks good</button>
<script>
function done() {
  fetch('/done', {method:'POST'}).then(() => {
    document.body.innerHTML = '<div style="margin:4rem auto;max-width:400px;text-align:center"><h2>Clusters saved.</h2><p>You can close this tab. Claude Code will continue.</p></div>';
  });
}
</script>
</body>
</html>"""

@app.route("/")
def index():
    return render_template_string(HTML, clusters=clusters)

@app.route("/jpg/<path:filename>")
def serve_jpg(filename):
    return send_from_directory(JPGS_DIR, filename)

@app.route("/done", methods=["POST"])
def done():
    # Persist clusters so agent can read them
    with open(CLUSTERS_FILE, "w") as f:
        json.dump(clusters, f, indent=2)
    # Signal shutdown after response
    import threading, time
    def shutdown():
        time.sleep(0.5)
        os._exit(0)
    threading.Thread(target=shutdown, daemon=True).start()
    return jsonify({"status": "saved", "file": CLUSTERS_FILE})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5555, debug=False)
```

Install Flask into the system Python if needed:
```bash
python3 -m pip install flask --quiet
```

Start the app (set WORK_DIR and CLUSTERS_JSON env vars before launching):
```bash
export WORK_DIR="$WORK_DIR"
export CLUSTERS_JSON='<json-serialized cluster map>'
python3 "$WORK_DIR/cluster_ui/app.py" &
```

Tell the user: "The clustering review UI is running at http://localhost:5555 — open it, review the photo groups, then click **Done** when satisfied."

Wait for `$WORK_DIR/clusters.json` to appear (poll every 2 seconds, timeout 10 minutes). Once it appears, read the confirmed clusters from it.

Ask the user if they want to merge or split any clusters before continuing. Apply any requested changes to the in-memory cluster map and re-save `clusters.json`.

---

## Step 4 — Florence-2 captions + OCR

For each cluster, run Florence-2 to:
1. Generate a product caption from the **front** photo (prefer `_front` if present, else first photo).
2. OCR any **tag** photos (`_brand_tag`, `_fabric_tag`, `_tag`, `_label`) to extract size and material info.

Write the following script to `$WORK_DIR/florence_run.py`:

```python
#!/usr/bin/env python3
"""Run Florence-2 captions and OCR on clustered clothing photos."""
import json
import sys
import os
from pathlib import Path
from PIL import Image
import torch
from transformers import AutoProcessor, AutoModelForCausalLM

MODEL_PATH = os.environ["FLORENCE_MODEL"]
WORK_DIR = os.environ["WORK_DIR"]
CLUSTERS_FILE = os.path.join(WORK_DIR, "clusters.json")
JPGS_DIR = os.path.join(WORK_DIR, "jpgs")
OUTPUT_FILE = os.path.join(WORK_DIR, "captions.json")

device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Loading Florence-2 from {MODEL_PATH} on {device}...", flush=True)

model = AutoModelForCausalLM.from_pretrained(MODEL_PATH, trust_remote_code=True).to(device).eval()
processor = AutoProcessor.from_pretrained(MODEL_PATH, trust_remote_code=True)

def run_task(image_path: str, task: str, text_input: str = "") -> str:
    image = Image.open(image_path).convert("RGB")
    prompt = task if not text_input else f"{task}{text_input}"
    inputs = processor(text=prompt, images=image, return_tensors="pt").to(device)
    with torch.no_grad():
        generated_ids = model.generate(
            input_ids=inputs["input_ids"],
            pixel_values=inputs["pixel_values"],
            max_new_tokens=256,
            num_beams=3,
        )
    result = processor.batch_decode(generated_ids, skip_special_tokens=False)[0]
    parsed = processor.post_process_generation(result, task=task, image_size=(image.width, image.height))
    return parsed.get(task, "")

with open(CLUSTERS_FILE) as f:
    clusters = json.load(f)

results = {}
tag_suffixes = ("_brand_tag", "_fabric_tag", "_tag", "_label")

for item_key, photos in clusters.items():
    print(f"Processing: {item_key}", flush=True)

    # Select front photo
    front = next((p for p in photos if "_front" in p), photos[0])
    front_path = os.path.join(JPGS_DIR, front)

    # Caption
    caption = run_task(front_path, "<DETAILED_CAPTION>")

    # OCR tag photos
    ocr_texts = []
    for photo in photos:
        if any(s in photo for s in tag_suffixes):
            tag_path = os.path.join(JPGS_DIR, photo)
            ocr = run_task(tag_path, "<OCR>")
            if ocr.strip():
                ocr_texts.append(ocr.strip())

    results[item_key] = {
        "caption": caption,
        "tag_ocr": ocr_texts,
        "photos": photos,
        "front_photo": front,
    }
    print(f"  Caption: {caption[:80]}...", flush=True)

with open(OUTPUT_FILE, "w") as f:
    json.dump(results, f, indent=2)

print(f"Saved captions to {OUTPUT_FILE}", flush=True)
```

Run it:
```bash
FLORENCE_MODEL="$FLORENCE_MODEL" WORK_DIR="$WORK_DIR" \
  "$VENV_PY" "$WORK_DIR/florence_run.py"
```

This produces `$WORK_DIR/captions.json`.

---

## Step 5 — Generate Squarespace v3 CSV

### Pricing reference

Use this table to assign prices. Match brand from the caption/OCR. When uncertain, use the lower end.

| Brand | Price range |
|-------|-------------|
| H&M, Gap, Cat & Jack | $5–12 |
| Zara, Hanna Andersson, Mini Boden | $12–22 |
| Ralph Lauren — polo | $15–25 |
| Ralph Lauren — dresses | $20–35 |
| Janie and Jack, Matilda Jane, Vineyard Vines | $18–35 |
| Patagonia, North Face | $25–45 |
| Burberry kids | $40–80 |

For unknown or unrecognized brands, default to **$8**.

### CSV generation

Write `$WORK_DIR/squarespace/products.csv` with these columns (Squarespace Commerce v3 format):

```
Handle,Title,Body (HTML),Vendor,Type,Tags,Published,Option1 Name,Option1 Value,Variant SKU,Variant Price,Variant Requires Shipping,Variant Taxable,Image Src,Image Position,Image Alt Text
```

**Rules per row:**
- **Handle** — URL-safe slug from item key (replace `_` with `-`)
- **Title** — Cleaned item key in title case (e.g. `Gap Jeans 4t`)
- **Body (HTML)** — Florence-2 caption as a `<p>` tag, followed by tag OCR lines as `<ul><li>` items if present
- **Vendor** — Brand extracted from caption/OCR if identifiable, else `""`
- **Type** — `"Clothing"`
- **Tags** — Comma-separated: `kids, pre-owned, <brand if known>, <size if known>`
- **Published** — `TRUE`
- **Option1 Name** — `"Size"`
- **Option1 Value** — Size extracted from OCR if found, else `"See description"`
- **Variant SKU** — `autoflow-<item_key>-001`
- **Variant Price** — Price from the table above (numeric, no $ sign, e.g. `8.00`)
- **Variant Requires Shipping** — `TRUE`
- **Variant Taxable** — `TRUE`
- **Image Src** — GitHub Pages URL (filled in Step 6; use placeholder `PENDING` for now)
- **Image Position** — `1` for first image, increment for additional images of the same item
- **Image Alt Text** — Florence-2 caption (truncated to 125 chars)

One row per photo (multiple rows per Handle for multi-photo items). The first row for a Handle contains all product fields; subsequent rows for the same Handle only need Handle, Image Src, Image Position, Image Alt Text.

After generating the CSV, read it back and show the user the first 5 rows for review. Ask if any prices or titles need adjustment before continuing.

---

## Step 6 — Push images to GitHub Pages for public URLs

Create a throwaway public GitHub repo named `autoflow-images-<timestamp>` (e.g. `autoflow-images-20241201`) to host the JPEGs.

```bash
REPO_NAME="autoflow-images-$(date +%Y%m%d%H%M%S)"
REPO_DIR="$WORK_DIR/$REPO_NAME"
mkdir -p "$REPO_DIR"
cd "$REPO_DIR"

# Copy all jpgs
cp "$WORK_DIR/jpgs/"*.jpg .

# Init repo and push to GitHub
git init
git checkout -b gh-pages
git add .
git commit -m "autoflow: clothing photos for Squarespace listing"
gh repo create "$REPO_NAME" --public --source . --push

# Enable GitHub Pages on gh-pages branch
gh api repos/$(gh api user --jq .login)/$REPO_NAME/pages \
  -X POST -f source[branch]=gh-pages -f source[path]=/
```

Wait ~30 seconds for Pages to deploy, then derive public URLs:

```
https://<github-username>.github.io/<REPO_NAME>/<filename>.jpg
```

Get the username:
```bash
GH_USER=$(gh api user --jq .login)
BASE_URL="https://$GH_USER.github.io/$REPO_NAME"
```

### Update the CSV with real URLs

Go back to `$WORK_DIR/squarespace/products.csv` and replace every `PENDING` Image Src with the appropriate `$BASE_URL/<filename>.jpg`.

---

## Step 7 — Final verification

1. Print a summary table: item key | title | price | # photos | image URLs (first one).
2. Confirm `$WORK_DIR/squarespace/products.csv` exists and is non-empty.
3. Tell the user the exact path to the CSV and the Pages base URL.
4. Provide Squarespace import instructions:
   - Commerce → Products → click the **import** icon (top right) → upload `products.csv`
   - Review imported drafts, set inventory, then publish.

---

## Cleanup (optional)

Ask the user if they want to delete the local `$REPO_NAME` directory (the GitHub repo stays for image hosting):
```bash
rm -rf "$REPO_DIR"
```

---

## Error handling notes

- If `sips` fails on a file, skip it and log the filename — don't abort.
- If Florence-2 OOM errors occur, reduce batch size to 1 (already the case in the script above).
- If GitHub Pages API returns an error (repo too new), wait 60 seconds and retry once.
- If the user's cluster edits result in an empty cluster, skip it silently.
