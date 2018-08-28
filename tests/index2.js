#!/usr/local/bin/node
'use strict';
let maxValue = process.argv[2];
console.time('time');
let counter = 0;
let NODE_ENV = process.env.NODE_ENV;
for(let i = 0; i < maxValue; i++) {
  if(NODE_ENV!=='production') {
    counter++;
  }
}
console.timeEnd('time');
