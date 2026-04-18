export interface MicronConfig {
    start?: number;
    end?: number;
    step?: number;
    repeats?: number;
    folder?: string;
    outdir?: string;
    writeResults?: boolean;
    verbose?: boolean;
    quiet?: boolean;
    json?: boolean;
}

export interface BenchStats {
    min: number;
    avg: number;
    max: number;
    p95: number;
}

/** Results keyed by filename, then by step N, then array of timing values (ms) */
export type BenchResults = Record<string, Record<number, number[]>>;

/** Interface your .bench.js files must implement */
export interface BenchModule {
    name?: string;
    setup?(): Promise<void> | void;
    teardown?(): Promise<void> | void;
    bench(n: number): Promise<unknown> | unknown;
}

export default class Micron {
    config: Required<MicronConfig>;
    files: string[];

    constructor(config?: MicronConfig);
    validateConfig(): void;
    readFiles(): void;
    calcStats(timeData: number[]): BenchStats;
    run(): Promise<BenchResults | string>;
    writeResults(data: BenchResults): string;
}
