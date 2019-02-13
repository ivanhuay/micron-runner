#!/usr/local/bin/node
'use strict';
const mongoose = require('mongoose');
const TransactionReport = require('../models/transaction-report');
let maxValue = process.argv[2];
async function startTest(){
  console.time('time');
  let counter = 0;
  for(let i = 0; i < maxValue; i++) {
    let newTransaction = new TransactionReport({group:'recharge', subgroup: 'app'});
    await newTransaction.save();
    if(process.env.NODE_ENV!=='production') {
      counter++;
    }
  }
  console.timeEnd('time');
}


mongoose.connect('mongodb://localhost:27017/testrunner', { useNewUrlParser: true })
    .then(() => {
        return startTest();
    })
    .then(()=>{
      process.exit(0);
    })
    .catch((error) => {
        console.log('Error mongoose connection: ', error);
    });
