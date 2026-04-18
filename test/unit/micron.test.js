import { describe, it, expect } from 'vitest';
import Micron from '../../micron.js';

describe('Micron constructor defaults', () => {
    it('applies default config', () => {
        const m = new Micron();
        expect(m.config.start).toBe(100);
        expect(m.config.end).toBe(2100);
        expect(m.config.step).toBe(500);
        expect(m.config.repeats).toBe(3);
    });

    it('merges custom config over defaults', () => {
        const m = new Micron({ start: 10, end: 100, step: 10 });
        expect(m.config.start).toBe(10);
        expect(m.config.repeats).toBe(3);
    });
});

describe('Micron validateConfig', () => {
    it('throws when start >= end', () => {
        expect(() => new Micron({ start: 500, end: 100, step: 10 }))
            .toThrow('start (500) must be less than end (100)');
    });

    it('throws when start equals end', () => {
        expect(() => new Micron({ start: 100, end: 100, step: 10 }))
            .toThrow('start (100) must be less than end (100)');
    });

    it('throws when step <= 0', () => {
        expect(() => new Micron({ start: 10, end: 100, step: 0 }))
            .toThrow('step must be > 0');
    });

    it('throws when repeats < 1', () => {
        expect(() => new Micron({ start: 10, end: 100, step: 10, repeats: 0 }))
            .toThrow('repeats must be >= 1');
    });
});

describe('Micron calcStats', () => {
    const m = new Micron({ start: 10, end: 100, step: 10 });

    it('calculates min', () => {
        expect(m.calcStats([10, 20, 30]).min).toBe(10);
    });

    it('calculates max', () => {
        expect(m.calcStats([10, 20, 30]).max).toBe(30);
    });

    it('calculates avg', () => {
        expect(m.calcStats([10, 20, 30]).avg).toBe(20);
    });

    it('calculates p95 on single value', () => {
        expect(m.calcStats([42]).p95).toBe(42);
    });

    it('calculates p95 on larger set', () => {
        const data = Array.from({ length: 20 }, (_, i) => i + 1);
        expect(m.calcStats(data).p95).toBe(19);
    });

    it('is not affected by input order', () => {
        const a = m.calcStats([30, 10, 20]);
        const b = m.calcStats([10, 20, 30]);
        expect(a).toEqual(b);
    });
});

describe('Micron readFiles', () => {
    it('throws when folder does not exist', () => {
        const m = new Micron({ start: 10, end: 100, step: 10, folder: '/nonexistent/path' });
        expect(() => m.readFiles()).toThrow('MicronError: folder');
    });

    it('throws when no .bench.js files found', () => {
        const m = new Micron({ start: 10, end: 100, step: 10, folder: 'template' });
        expect(() => m.readFiles()).toThrow('no *.bench.js files found');
    });

    it('loads only .bench.js files', () => {
        const m = new Micron({ start: 10, end: 100, step: 10, folder: 'test/fixtures/valid' });
        m.readFiles();
        expect(m.files.every(f => f.endsWith('.bench.js'))).toBe(true);
    });
});
