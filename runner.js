'use strict';
const { exec } = require('child_process');
const fs = require('fs');
const testFolder = './tests/'
const rowSizeTest = 4;
const files = fs.readdirSync(testFolder);
console.log('files: ', JSON.stringify(files));
const startPoint = 100;
const endPoint = 3100;
const step = 500
function runTest(file, arg){
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
async function rowRunner(file, arg,rowSize){
  const resp = [];
  for(let j = 0; j  < rowSize; j++) {
    let testResponse = await runTest(file, arg);
    resp.push(testResponse);
  }
  return resp;
}

async function runner(){
  let response = {};
  for(let currentFile of files){
    let file = `${testFolder}${currentFile}`;
    for(var i = startPoint; i <= endPoint; i+=step){
      let j = i;
      let testResponse = await rowRunner(file, j, rowSizeTest);
      if(!response[file]){
        response[file] = {};
      }
      response[file][j] = testResponse;
    }
  }
  console.log(JSON.stringify(response));
  return response;
}

function writeResults(data){
  fs.writeFileSync('./data/result.js', 'var data = ' + JSON.stringify(data) +  ';');
}

runner()
  .then((response) => {
      writeResults(response);
  });
