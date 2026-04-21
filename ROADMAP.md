# Micron Runner — v1 Roadmap

## Vision
Benchmark tool for Node.js that shows **how performance scales with input size**.
Nobody does this cleanly. That's the niche.

```
micron sweep: 100 → 5000 (step 500)

  db-insert.bench.js
  ┌────────┬────────┬────────┬────────┬────────┐
  │   N    │  min   │  avg   │  max   │  p95   │
  ├────────┼────────┼────────┼────────┼────────┤
  │   100  │  12ms  │  14ms  │  18ms  │  17ms  │
  │   600  │  61ms  │  65ms  │  72ms  │  70ms  │
  │  1100  │ 120ms  │ 128ms  │ 141ms  │ 138ms  │
  └────────┴────────┴────────┴────────┴────────┘
```

---

## Current State (v0.0.12)
- CommonJS, `module.exports` object interface
- `beforeAll` / `test` / `afterAll` hooks
- Sweeps N, outputs HTML chart
- No validation, no real tests, known bugs

---

## Breaking Changes (intentional for v1)

| Before | After |
|--------|-------|
| `module.exports = { test }` | `export async function bench()` |
| `beforeAll` / `afterAll` | `setup` / `teardown` |
| Any `.js` filename | `.bench.js` convention |
| CommonJS only | ESM-first (`"type": "module"`) |
| `--folder` flag | positional arg or auto-detect `benchmarks/` |

---

## Target Interface (v1)

```js
// benchmarks/db-insert.bench.js
import { connect, disconnect } from './db.js';

export const name = 'MongoDB insert';        // optional, defaults to filename

export async function setup() {
    await connect();
}

export async function teardown() {
    await disconnect();
}

export async function bench(n) {             // n = current step count
    // measured code — runs n times per step
}
```

Errors should be clear:
```
MicronError [db-insert.bench.js] missing required export: bench
MicronError config: start (2000) must be less than end (1000)
MicronError config: step must be > 0
```

---

## CLI Target (v1)

```
micron                            # auto-detect ./benchmarks folder
micron ./my-folder                # custom folder
micron --sweep 100:5000:500       # start:end:step shorthand
micron --repeats 5
micron --json                     # output JSON to stdout (CI-friendly)
micron --quiet                    # errors only
micron --version
micron --help
```

---

## Milestones

### M1 — Foundation
- [x] Migrate to ESM (`"type": "module"` in package.json)
- [x] New test interface: named exports, `.bench.js` convention
- [x] Rename hooks: `setup` / `teardown` (drop `beforeAll`/`afterAll`)
- [x] Auto-detect `benchmarks/` folder if no arg given
- [x] Fix `oudir` typo bug
- [x] Fix `writeResults` return value

### M2 — Validation & Errors
- [x] Validate `bench` export exists — throw with filename context
- [x] Warn if `setup` / `teardown` missing (not error)
- [x] Validate `start < end`, `step > 0`, `repeats >= 1`
- [x] Clear `MicronError: [file] reason` format for all errors
- [x] Bust module cache between runs (ESM: re-import with cache-busting query param)

### M3 — Output & Reporting
- [x] Stdout table: min / avg / max / p95 per step per file
- [x] `--json` flag: structured JSON to stdout for CI
- [x] Improve HTML chart: p95 line, tooltips with raw values, better styling
- [x] `--quiet` flag: suppress all except errors
- [x] Progress indicator during long sweeps

### M4 — Test Suite & CI
- [x] Add vitest as dev dependency
- [x] Unit tests for `Micron` class
- [x] Integration tests with fixture `.bench.js` files
- [x] GitHub Actions CI workflow (Node 18, 20, 22)

### M5 — DX & Distribution
- [x] TypeScript types for config + bench module interface (`.d.ts`)
- [x] `--sweep start:end:step` shorthand CLI flag
- [x] Fix README (typos, updated interface, new examples)
- [x] `CHANGELOG.md`
- [x] Update examples to ESM + new `.bench.js` interface
- [ ] Publish v1.0.0 to npm

---

## Progress Tracker

| Milestone | Status |
|-----------|--------|
| M1 — Foundation | ✅ Done |
| M2 — Validation & Errors | ✅ Done |
| M3 — Output & Reporting | ✅ Done |
| M4 — Test Suite & CI | ✅ Done |
| M5 — DX & Distribution | ✅ Done (npm publish skipped) |
