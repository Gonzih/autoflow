# PLAN — autoflow initial structure

## Task restatement
Build the foundational structure for **autoflow** — a library of packaged agentic workflows called "pills". Each pill is a self-contained workflow definition that non-technical users can run with Claude Code. Deliver: root README, JSON schema, Pill #001 (photo-to-squarespace, full workflow), Pill #002 (github-pages-image-host, stub), then PR + merge.

## Approaches considered

### A. Flat file structure (chosen)
- All pills live in `pills/<id>/` with standardized files (README.md, WORKFLOW.md, pill.json)
- Root `schema/pill.json` is JSON Schema Draft-07 for validation
- Simple, git-native, forkable — no build tooling needed
- Trade-off: no runtime enforcement of schema without a CLI tool (acceptable for v1)

### B. Monorepo with tooling
- Add a CLI (`autoflow run <pill>`) that validates + executes pills
- More powerful but massively overscoped for "initial structure" task
- Trade-off: complex, time-consuming, not what was asked

### C. YAML-based pill definitions
- More readable than JSON for humans
- Trade-off: JSON Schema validation is natively JSON; mixing formats adds friction

## Chosen approach: A (flat file structure)
Matches the spec exactly. Pills are pure documentation + metadata — the agent (Claude Code) is the runtime. No tooling needed v1.

## Files to create
- `README.md` — root, explains autoflow, pill concept, how to run, how to contribute
- `schema/pill.json` — JSON Schema Draft-07 for pill.json files
- `pills/photo-to-squarespace/README.md`
- `pills/photo-to-squarespace/WORKFLOW.md`
- `pills/photo-to-squarespace/pill.json`
- `pills/github-pages-image-host/README.md` (stub)
- `PLAN.md` (this file)
- `TODO.md`

## Risks and unknowns
- Squarespace CSV v3 column format: use documented columns (Handle, Title, Body, etc.) — will use known spec
- Florence-2 invocation: Python subprocess call pattern — straightforward, no unknowns
- GitHub Pages image hosting step: needs gh CLI and a throwaway repo — document clearly
- Pricing table: provided verbatim in spec, just embed it
