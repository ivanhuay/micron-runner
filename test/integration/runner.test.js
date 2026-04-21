import { describe, it, expect, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import Micron from '../../micron.js';

const OUTDIR = 'test/tmp-results';

afterEach(() => {
    if(fs.existsSync(OUTDIR)) {
        fs.rmSync(OUTDIR, { recursive: true });
    }
});

describe('Micron integration — simple bench', () => {
    const config = {
        start: 10,
        end: 30,
        step: 10,
        repeats: 2,
        folder: 'test/fixtures/valid',
        outdir: OUTDIR,
        writeResults: false,
        quiet: true
    };

    it('returns results keyed by filename', async () => {
        const m = new Micron(config);
        const results = await m.run();
        expect(typeof results).toBe('object');
        expect(Object.keys(results)).toContain('simple.bench.js');
    });

    it('runs correct number of steps', async () => {
        const m = new Micron(config);
        const results = await m.run();
        const steps = Object.keys(results['simple.bench.js']).map(Number);
        expect(steps).toEqual([10, 20, 30]);
    });

    it('each step has correct number of repeats', async () => {
        const m = new Micron(config);
        const results = await m.run();
        for(const step of Object.values(results['simple.bench.js'])) {
            expect(step).toHaveLength(2);
        }
    });

    it('timing values are non-negative numbers', async () => {
        const m = new Micron(config);
        const results = await m.run();
        for(const step of Object.values(results['simple.bench.js'])) {
            for(const ms of step) {
                expect(typeof ms).toBe('number');
                expect(ms).toBeGreaterThanOrEqual(0);
            }
        }
    });

    it('writes result files when writeResults is true', async () => {
        const m = new Micron({ ...config, writeResults: true });
        await m.run();
        expect(fs.existsSync(path.join(OUTDIR, 'result.js'))).toBe(true);
        expect(fs.existsSync(path.join(OUTDIR, 'index.html'))).toBe(true);
    });
});

describe('Micron integration — missing bench export', () => {
    it('throws MicronError for file missing bench export', async () => {
        const m = new Micron({
            start: 10, end: 20, step: 10, repeats: 1,
            folder: 'test/fixtures/invalid',
            outdir: OUTDIR,
            writeResults: false,
            quiet: true
        });
        await expect(m.run()).rejects.toThrow('missing required export: bench');
    });
});
