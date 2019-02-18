'use strict';
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
class Micron{
  constructor(config){
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
    if(config){
      this.config = Object.assign(this.config, config);
    }
    this.config.folder = path.resolve(this.config.folder);
    this.config.oudir = path.resolve(this.config.outdir);
    console.log('pathresolve: ', path.resolve(this.config.folder));
  }
  readFiles(){
    this.files =  fs.readdirSync(this.config.folder);
    console.log('files: ', JSON.stringify(this.files));
  }
  async execTest(testModule, currentStep){
    if(typeof testModule.beforeAll === 'function'){
      await testModule.beforeAll();
    }
    const startTime = Date.now();
    for(let i = 0; i < currentStep; i++){
        await testModule.test();
    }
    if(typeof testModule.afterAll === 'function'){
      await testModule.afterAll();
    }
    const endTime = Date.now();
    return endTime - startTime;
  }
  async runLoop(file, currentStep) {
    if(this.config.verbose){
      console.log('starting: ', file, ' currentStep: ', currentStep);
    }
    const testModule = require(file);
    const timeData = [];
    for(let j = 0; j < this.config.repeats; j++) {
      const time = await this.execTest(testModule, currentStep);
      timeData.push(time);
    }
    return timeData;
  }
  async run(){
    this.readFiles();
    let response = {};
    for(let currentFile of this.files){
      let file = `${this.config.folder}/${currentFile}`;
      const fileName = path.basename(file);
      for(let i = this.config.start; i <= this.config.end; i += this.config.step) {
        let j = i;
        let testResponse = await this.runLoop(file, j);

        if(!response[fileName]){
          response[fileName] = {};
        }
        response[fileName][j] = testResponse;
      }
    }
    if(this.config.writeResults){
      return this.writeResults(response);
    }
    return response;
  }
  writeResults(data){
    if(!fs.existsSync(this.config.outdir)){
        fs.mkdirSync(this.config.outdir);
    }
    console.log('response: ', JSON.stringify(data));
    fs.writeFileSync(`${this.config.outdir}/result.js`, 'var data = ' + JSON.stringify(data) +  ';');
    fs.copyFileSync('./template/char.html', `${this.config.outdir}/index.html`)
  }
}


module.exports = Micron;
