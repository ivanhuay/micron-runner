'use strict';
const fs = require('fs');
const path = require('path');
class Micron {
    constructor(config) {
        this.config = {
            start: 100,
            end: 2100,
            step: 500,
            repeats: 3,
            folder: 'tests',
            outdir: 'results',
            writeResults: true,
            verbose: false
        };
        if(config) {
            this.config = Object.assign(this.config, config);
        }
        this.config.folder = path.resolve(this.config.folder);
        this.config.oudir = path.resolve(this.config.outdir);
    }
    readFiles() {
        if(!fs.existsSync(this.config.folder)) {
            throw new Error('Test folder doesn\'t exist');
        }
        this.files =  fs.readdirSync(this.config.folder);
        this.log('files: ', JSON.stringify(this.files));
    }
    async execTest(testModule, currentStep) {
        if(typeof testModule.beforeAll === 'function') {
            await testModule.beforeAll();
        }
        const startTime = Date.now();
        for(let i = 0; i < currentStep; i++) {
            await testModule.test();
        }
        if(typeof testModule.afterAll === 'function') {
            await testModule.afterAll();
        }
        const endTime = Date.now();
        return endTime - startTime;
    }
    async runLoop(file, currentStep) {
        if(this.config.verbose) {
            this.info('starting: ', file, ' currentStep: ', currentStep);
        }
        const testModule = require(file);
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
                let j = i;
                let testResponse = await this.runLoop(file, j);

                if(!response[fileName]) {
                    response[fileName] = {};
                }
                response[fileName][j] = testResponse;
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
        this.info('path', path.resolve(`${__dirname}/template/char.html`));
        fs.copyFileSync(path.resolve(`${__dirname}/template/char.html`), `${this.config.outdir}/index.html`);
        this.log('done');
    }
    info(...args) {
        if(this.config.verbose) {
            this.log(args.join(''));
        }
    }
    log(...args) {
        this.process.stdout(args.join('') + '\n');
    }
}

module.exports = Micron;
