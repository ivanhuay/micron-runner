#!/usr/local/bin/node
'use strict';
let maxValue = process.argv[2];
console.time('time');
let counter = 0;
for(let i = 0; i < maxValue; i++) {
  let obj = {
    other: process.env.OTHER,
    pass: process.env.PASS,
    user: process.env.USER,
  };
  if(process.env.NODE_ENV!=='production') {
    counter++;
  }
}
console.timeEnd('time');
