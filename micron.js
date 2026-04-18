import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

class Micron {
    constructor(config) {
        this.config = {
            start: 100,
            end: 2100,
            step: 500,
            repeats: 3,
            folder: 'benchmarks',
            outdir: 'results',
            writeResults: true,
            verbose: false,
            quiet: false,
            json: false
        };
        if(config) {
            this.config = Object.assign(this.config, config);
        }
        this.config.folder = path.resolve(this.config.folder);
        this.config.outdir = path.resolve(this.config.outdir);
        this.validateConfig();
    }
    validateConfig() {
        const { start, end, step, repeats } = this.config;
        if(start >= end) {
            throw new Error(`MicronError: start (${start}) must be less than end (${end})`);
        }
        if(step <= 0) {
            throw new Error(`MicronError: step must be > 0, got ${step}`);
        }
        if(repeats < 1) {
            throw new Error(`MicronError: repeats must be >= 1, got ${repeats}`);
        }
    }
    readFiles() {
        if(!fs.existsSync(this.config.folder)) {
            throw new Error(`MicronError: folder "${this.config.folder}" doesn't exist`);
        }
        this.files = fs.readdirSync(this.config.folder)
            .filter(f => f.endsWith('.bench.js'));
        if(this.files.length === 0) {
            throw new Error(`MicronError: no *.bench.js files found in "${this.config.folder}"`);
        }
        this.log('files: ', JSON.stringify(this.files));
    }
    calcStats(timeData) {
        const sorted = [...timeData].sort((a, b) => a - b);
        const sum = sorted.reduce((a, b) => a + b, 0);
        const p95idx = Math.ceil(0.95 * sorted.length) - 1;
        return {
            min: sorted[0],
            avg: Math.round(sum / sorted.length),
            max: sorted[sorted.length - 1],
            p95: sorted[p95idx]
        };
    }
    printTable(fileName, fileResults) {
        const steps = Object.keys(fileResults).map(Number);
        const rows = steps.map(n => {
            const s = this.calcStats(fileResults[n]);
            return { n, ...s };
        });

        const pad = (val, len) => String(val).padStart(len);
        const nW = Math.max(5, ...rows.map(r => String(r.n).length));
        const cols = ['min', 'avg', 'max', 'p95'];
        const colW = cols.reduce((acc, c) => {
            acc[c] = Math.max(c.length, ...rows.map(r => String(r[c]).length)) + 2;
            return acc;
        }, {});

        const hr = (l, m, r, s) =>
            l + s.repeat(nW + 2) + m + cols.map(c => s.repeat(colW[c])).join(m) + r;

        process.stdout.write(`\n  ${fileName}\n`);
        process.stdout.write('  ' + hr('┌', '┬', '┐', '─') + '\n');
        process.stdout.write(`  │${pad('N', nW + 1)} │` + cols.map(c => pad(c, colW[c] - 1) + ' │').join('') + '\n');
        process.stdout.write('  ' + hr('├', '┼', '┤', '─') + '\n');
        for(const row of rows) {
            process.stdout.write(`  │${pad(row.n, nW + 1)} │` + cols.map(c => pad(row[c] + 'ms', colW[c] - 1) + ' │').join('') + '\n');
        }
        process.stdout.write('  ' + hr('└', '┴', '┘', '─') + '\n\n');
    }
    async execTest(testModule, currentStep) {
        if(typeof testModule.setup === 'function') {
            await testModule.setup();
        }
        const startTime = Date.now();
        for(let i = 0; i < currentStep; i++) {
            await testModule.bench(currentStep);
        }
        if(typeof testModule.teardown === 'function') {
            await testModule.teardown();
        }
        const endTime = Date.now();
        return endTime - startTime;
    }
    async runLoop(file, currentStep) {
        if(this.config.verbose) {
            this.info('starting: ', file, ' currentStep: ', currentStep);
        }
        const testModule = await import(pathToFileURL(file).href + `?t=${Date.now()}`);
        const fileName = path.basename(file);
        if(typeof testModule.bench !== 'function') {
            throw new Error(`MicronError [${fileName}]: missing required export: bench`);
        }
        if(typeof testModule.setup !== 'function') {
            this.warn(`[${fileName}]: no setup export — skipping`);
        }
        if(typeof testModule.teardown !== 'function') {
            this.warn(`[${fileName}]: no teardown export — skipping`);
        }
        const timeData = [];
        for(let j = 0; j < this.config.repeats; j++) {
            const time = await this.execTest(testModule, currentStep);
            timeData.push(time);
        }
        return timeData;
    }
    async run() {
        this.readFiles();
        let response = {};
        this.log('starting process...');
        const total = this.files.length;
        let currentProgress = 0;
        for(let currentFile of this.files) {
            const file = `${this.config.folder}/${currentFile}`;
            const fileName = path.basename(file);
            const steps = [];
            for(let i = this.config.start; i <= this.config.end; i += this.config.step) {
                steps.push(i);
            }
            for(const [idx, step] of steps.entries()) {
                const percent = Math.round(((currentProgress + idx / steps.length) / total) * 100);
                process.stdout.write(`\r  progress: ${percent}%  `);
                const testResponse = await this.runLoop(file, step);
                if(!response[fileName]) {
                    response[fileName] = {};
                }
                response[fileName][step] = testResponse;
            }
            currentProgress++;
            if(!this.config.quiet) {
                this.printTable(fileName, response[fileName]);
            }
        }
        process.stdout.write(`\r  progress: 100%  \n`);
        if(this.config.json) {
            process.stdout.write(JSON.stringify(response, null, 2) + '\n');
            return response;
        }
        if(this.config.writeResults) {
            return this.writeResults(response);
        }
        return response;
    }
    writeResults(data) {
        if(!fs.existsSync(this.config.outdir)) {
            fs.mkdirSync(this.config.outdir);
        }
        this.info('response: ', JSON.stringify(data));
        fs.writeFileSync(`${this.config.outdir}/result.js`, 'var data = ' + JSON.stringify(data) + ';');
        const templateSrc = path.resolve(path.dirname(new URL(import.meta.url).pathname), 'template/char.html');
        fs.copyFileSync(templateSrc, `${this.config.outdir}/index.html`);
        this.log(`results written to ${path.resolve(this.config.outdir)}`);
        return path.resolve(this.config.outdir);
    }
    warn(...args) {
        process.stderr.write('MicronWarn: ' + args.join('') + '\n');
    }
    info(...args) {
        if(this.config.verbose) {
            this.log(args.join(''));
        }
    }
    log(...args) {
        if(!this.config.quiet) {
            process.stdout.write(args.join('') + '\n');
        }
    }
}

export default Micron;
