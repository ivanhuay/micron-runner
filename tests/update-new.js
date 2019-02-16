'use strict';
const mongoose = require('mongoose');
const TransactionReport = require('../models/transaction-report');
let i = 0;
async function test(){
  i++;
  return TransactionReport.update(
    {group:'recharge', subgroup: 'app', amount:{$ne: i}},
    {$set:{
      amount:i
    }},
    {
      upsert:true,
      new:true
    }
  );
}

function beforeAll(){
    return mongoose.connect('mongodb://localhost:27017/testrunner', { useNewUrlParser: true });
}

function afterAll(){
  return mongoose.connection.close();
}

module.exports = {
  beforeAll,
  test,
  afterAll
}
