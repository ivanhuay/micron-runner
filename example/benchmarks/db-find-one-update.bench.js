import mongoose from 'mongoose';
import TransactionReport from '../models/transaction-report.js';

export const name = 'MongoDB findOneAndUpdate';

let counter = 0;

export async function setup() {
    await mongoose.connect('mongodb://localhost:27017/micron-example');
}

export async function teardown() {
    await mongoose.connection.close();
}

export async function bench() {
    counter++;
    await TransactionReport.findOneAndUpdate(
        { group: 'recharge', subgroup: 'app', amount: { $ne: counter } },
        { $set: { amount: counter } }
    );
}
