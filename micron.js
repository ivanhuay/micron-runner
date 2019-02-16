'use strict';
const { exec } = require('child_process');
const fs = require('fs');
class Micron{
  constructor(config){

    this.config = {
      startPoint: 100,
      endPoint: 2100,
      step: 500,
      repetitionCount: 3,
      folder: './tests/',
      stepRepeat: 3,
      outDir: './results/'
    };
    if(config){
      this.config = Object.assign(this.config, config);
    }
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
    console.log('starting: ', file, ' currentStep: ', currentStep);
    const testModule = require(file);
    const timeData = [];
    for(let j = 0; j < this.config.repetitionCount; j++) {
      const time = await this.execTest(testModule, currentStep);
      timeData.push(time);
    }
    return timeData;
  }
  async run(){
    this.readFiles();
    let response = {};
    for(let currentFile of this.files){
      let file = `${this.config.folder}${currentFile}`;
      for(var i = this.config.startPoint; i <= this.config.endPoint; i += this.config.step) {
        let j = i;
        let testResponse = await this.runLoop(file, j);
        if(!response[file]){
          response[file] = {};
        }
        response[file][j] = testResponse;
      }
    }
    return response;
  }
  writeResults(data){
    console.log('response: ', JSON.stringify(data));
    fs.writeFileSync('./data/result.js', 'var data = ' + JSON.stringify(data) +  ';');
  }
}


module.exports = Micron;
