# Micron Runner

Benchmark tool that shows **how performance scales with input size**. Run sweep benchmarks across a range of N values and visualize the results.

```
micron-runner --sweep 100:5000:500

  array-sort.bench.js
  ┌───────┬──────┬──────┬──────┬──────┐
  │   N   │  min │  avg │  max │  p95 │
  ├───────┼──────┼──────┼──────┼──────┤
  │   100 │   0ms│   0ms│   1ms│   0ms│
  │   600 │   1ms│   1ms│   2ms│   1ms│
  │  1100 │   3ms│   3ms│   4ms│   4ms│
  └───────┴──────┴──────┴──────┴──────┘
```

## Installation

```
npm install --save-dev micron-runner
```

or globally:

```
npm install -g micron-runner
```

## Quick Start

1. Create a `benchmarks/` folder in your project
2. Add `.bench.js` files
3. Run `micron-runner`

```
project/
└── benchmarks/
    ├── array-sort.bench.js
    └── db-insert.bench.js
```

## Benchmark File Format

```js
// benchmarks/my-benchmark.bench.js

export const name = 'My benchmark';       // optional label

export async function setup() {
    // runs once before the sweep starts
}

export async function teardown() {
    // runs once after the sweep ends
}

export async function bench(n) {
    // measured code — called n times per step
}
```

Only `bench` is required. `setup`, `teardown`, and `name` are optional.

## Examples

**Pure JS (no dependencies):**

```js
// benchmarks/array-sort.bench.js
export async function bench(n) {
    const arr = Array.from({ length: n }, () => Math.random());
    arr.sort((a, b) => a - b);
}
```

**With database setup:**

```js
// benchmarks/db-insert.bench.js
import mongoose from 'mongoose';
import User from '../models/user.js';

export async function setup() {
    await mongoose.connect('mongodb://localhost:27017/mydb');
}

export async function teardown() {
    await mongoose.connection.close();
}

export async function bench() {
    await User.create({ name: 'test', email: `test-${Date.now()}@x.com` });
}
```

## CLI Usage

```
micron-runner                              # auto-detect ./benchmarks
micron-runner ./my-folder                  # custom folder
micron-runner --sweep 100:5000:500         # start:end:step shorthand
micron-runner --start 100 --end 5000 --step 500
micron-runner --repeats 5
micron-runner --json > results.json        # CI-friendly JSON output
micron-runner --quiet                      # errors only
micron-runner --help
```

### Options

| Flag | Alias | Description | Default |
|------|-------|-------------|---------|
| `--sweep start:end:step` | | Shorthand for start/end/step | |
| `--start` | `-s` | Initial N | `100` |
| `--end` | `-e` | Final N | `2100` |
| `--step` | `-i` | Step between N values | `500` |
| `--repeats` | `-r` | Repeats per step | `3` |
| `--outdir` | `-o` | Output folder | `./results` |
| `--json` | `-j` | Output JSON to stdout, skip HTML | |
| `--quiet` | `-q` | Suppress all output except errors | |

## Programmatic API

```js
import Micron from 'micron-runner';

const runner = new Micron({
    folder: './benchmarks',
    start: 100,
    end: 5000,
    step: 500,
    repeats: 3,
    writeResults: true,   // write HTML chart to outdir
    json: false,          // print JSON to stdout
    quiet: false
});

const results = await runner.run();
```

## Output

After each benchmark file, a table is printed to stdout:

```
  db-insert.bench.js
  ┌───────┬──────┬──────┬──────┬──────┐
  │   N   │  min │  avg │  max │  p95 │
  ├───────┼──────┼──────┼──────┼──────┤
  │   100 │  12ms│  14ms│  18ms│  17ms│
  │   600 │  61ms│  65ms│  72ms│  70ms│
  └───────┴──────┴──────┴──────┴──────┘
```

An HTML chart with avg, p95, min/max lines is written to `./results/index.html`.

Use `--json` to get structured output for CI pipelines:

```
micron-runner --json > results.json
```

## TypeScript

Types are included:

```ts
import Micron, { MicronConfig, BenchModule, BenchResults } from 'micron-runner';
```

## License

MIT
