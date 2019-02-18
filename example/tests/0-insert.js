'use strict';
const mongoose = require('mongoose');
const TransactionReport = require('../models/transaction-report');

async function test(){
  let newTransaction = new TransactionReport({group:'recharge', subgroup: 'app'});
  return newTransaction.save();
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
