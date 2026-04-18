# Changelog

## v1.0.0

**Breaking changes** — see migration guide below.

### New features
- ESM-first (`"type": "module"`)
- New benchmark interface: named exports, `.bench.js` file convention
- `setup` / `teardown` hooks replace `beforeAll` / `afterAll`
- `bench(n)` receives current step count as argument
- `--sweep start:end:step` shorthand CLI flag
- `--json` / `-j`: output results as JSON to stdout (CI-friendly)
- `--quiet` / `-q`: suppress all output except errors
- Inline progress indicator during sweep
- Per-file stdout table with min / avg / max / p95 per step
- HTML chart: dark theme, p95 line, min/max lines, improved tooltips
- TypeScript types included (`micron.d.ts`)
- Test suite (vitest) with unit and integration tests
- GitHub Actions CI on Node 18, 20, 22

### Bug fixes
- Fixed `oudir` typo in config (was resolving wrong path)
- Fixed `writeResults` returning `undefined` — now returns output path
- Fixed `__dirname` usage (not available in ESM) — replaced with `import.meta.url`
- Fixed duplicate `<body>` tag and missing `>` in HTML template
- Fixed top-level `return` in CLI (invalid in ESM strict mode)

### Migration from v0.x

**Before:**
```js
const mongoose = require('mongoose');
module.exports = {
    beforeAll() { return mongoose.connect('...'); },
    test() { /* measured code */ },
    afterAll() { return mongoose.connection.close(); }
};
```

**After:**
```js
// must be named *.bench.js
import mongoose from 'mongoose';
export async function setup() { await mongoose.connect('...'); }
export async function bench() { /* measured code */ }
export async function teardown() { await mongoose.connection.close(); }
```

---

## v0.0.12
- Fixed general chart label

## v0.0.11
- Axis labels added and fixed loop label

## v0.0.6
- Fixed stdout in micron.js

## v0.0.5
- Fixed results HTML template

## v0.0.4
- Test folder validation added
