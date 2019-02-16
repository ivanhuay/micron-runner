'use strict';
const mongoose = require('mongoose');
const TransactionReport = require('../models/transaction-report');
let i = 0;
function test(){
  return TransactionReport.findOne({group:'recharge', subgroup: 'app', amount:{$ne: i}})
    .then((transaction)=>{
      transaction.amount = i;
      i++;
      return transaction.save();
    });
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
