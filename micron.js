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
            verbose: false
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
            const percent = Math.round((currentProgress / total) * 100);
            this.log(`progress: ${percent}%`);
            let file = `${this.config.folder}/${currentFile}`;
            const fileName = path.basename(file);
            for(let i = this.config.start; i <= this.config.end; i += this.config.step) {
                let testResponse = await this.runLoop(file, i);
                if(!response[fileName]) {
                    response[fileName] = {};
                }
                response[fileName][i] = testResponse;
            }
            currentProgress++;
        }
        this.log('progress: 100%');
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
        this.log('done');
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
        process.stdout.write(args.join('') + '\n');
    }
}

export default Micron;
