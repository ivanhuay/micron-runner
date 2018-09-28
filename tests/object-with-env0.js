#!/usr/local/bin/node
'use strict';
let maxValue = process.argv[2];
console.time('time');
let counter = 0;
const OTHER = process.env.OTHER;
const PASS = process.env.PASS;
const USER = process.env.USER;
const NODE_ENV = process.env.NODE_ENV;
for(let i = 0; i < maxValue; i++) {
  let obj = {
    other: OTHER,
    pass: PASS,
    user: USER,
  };
  if(NODE_ENV!=='production') {
    counter++;
  }
}
console.timeEnd('time');
