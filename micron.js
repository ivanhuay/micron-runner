'use strict';
const { exec } = require('child_process');
const fs = require('fs');
class Micron{
  constructor(config){

    this.config = {
      startPoint: 100,
      endPoint: 2100,
      step: 500,
      stepSize: 3,
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
  runTest(file, arg, rowSize) {
    return new Promise((resolve, reject)=>{
      console.log(`starting:${file} ${arg}`);
      exec(`node ${file} ${arg}`, (error, stdout, stderr) => {
        if (error) {
          reject(`exec error: ${error}`);
          return;
        }
        let time = Number(stdout.replace('time: ', '').replace('ms',''));
        console.log(`end: ${file} ${arg}`);
        resolve(time);
      });
    });
  }
  async rowRunner(file, arg){
    const resp = [];
    for(let j = 0; j  < this.config.stepSize; j++) {
      let testResponse = await this.runTest(file, arg);
      resp.push(testResponse);
    }
    return resp;
  }
  async run(){
    this.readFiles();
    let response = {};
    for(let currentFile of this.files){
      let file = `${this.config.folder}${currentFile}`;
      for(var i = this.config.startPoint; i <= this.config.endPoint; i += this.config.step) {
        let j = i;
        let testResponse = await this.rowRunner(file, j);
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
