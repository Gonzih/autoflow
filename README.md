# autoflow

*Agentic workflows, packaged for humans.*

autoflow is a library of **pills** — distilled agent intelligence packaged so anyone can repeat a workflow without writing a single line of code. A pill is a workflow that was run, worked, and got packaged. The library grows as pills get contributed. Pills can be forked, versioned, and remixed.

---

## What is a pill?

A pill is a self-contained workflow definition. You bring your inputs. Claude Code executes the steps. You get production-ready outputs.

**Example:** Shelly photographs her kids' pre-owned clothing. She drops the photos into a folder, runs a pill, and gets a Squarespace-ready CSV with hosted image URLs — ready to import. Zero code touched.

Each pill lives in `pills/<id>/` and contains three files:

| File | Purpose |
|------|---------|
| `README.md` | What the pill does, what you need, what you get |
| `WORKFLOW.md` | The detailed step-by-step the agent executes |
| `pill.json` | Machine-readable metadata (name, version, inputs, outputs, tags, author) |

The runtime is **Claude Code** — the agent reads WORKFLOW.md and drives every step.

---

## Pill library

| # | Pill | What it does | Tags |
|---|------|-------------|------|
| 001 | [Photo → Squarespace](pills/photo-to-squarespace/) | Turn clothing photos into Squarespace product listings | ecommerce, photos, clothing |
| 002 | [GitHub Pages Image Host](pills/github-pages-image-host/) | Host a batch of images on GitHub Pages for public URLs | images, hosting, github |

---

## How to run a pill

1. Open Claude Code (any interface — CLI, desktop app, web, IDE extension).
2. Set your working directory to the pill folder:
   ```
   cd pills/photo-to-squarespace
   ```
3. Tell Claude Code to run the pill:
   ```
   Run WORKFLOW.md
   ```
4. Follow the prompts. Provide the inputs listed in the pill's README.
5. Collect your outputs.

That's it. The agent handles every step.

---

## How to submit a pill

1. Fork this repo.
2. Create `pills/<your-pill-id>/` with three files: `README.md`, `WORKFLOW.md`, `pill.json`.
3. Validate your `pill.json` against [`schema/pill.json`](schema/pill.json).
4. Open a pull request. Describe what the pill does and include a sample run.

### pill.json quick-start

```json
{
  "id": "your-pill-id",
  "name": "Human Readable Name",
  "version": "1.0.0",
  "description": "One sentence: what does this pill do?",
  "inputs": ["what the user must provide"],
  "outputs": ["what the pill produces"],
  "tags": ["keyword", "keyword"],
  "requirements": ["macOS / Linux", "Python 3"],
  "author": "your-github-username",
  "runtime": "claude-code"
}
```

See [`schema/pill.json`](schema/pill.json) for the full JSON Schema (Draft-07).

---

## Philosophy

- **Pills are repeatable.** If it worked once, it can work again.
- **Pills are human-first.** No code required to run. The agent is the engine.
- **Pills are forkable.** Fork, adapt, version. A pill for your niche is a contribution.
- **Pills are honest.** Document requirements, known limitations, and failure modes in WORKFLOW.md.

---

## License

MIT
