import mongoose from 'mongoose';
import TransactionReport from '../models/transaction-report.js';

export const name = 'MongoDB find and save';

let counter = 0;

export async function setup() {
    await mongoose.connect('mongodb://localhost:27017/micron-example');
}

export async function teardown() {
    await mongoose.connection.close();
}

export async function bench() {
    counter++;
    const doc = await TransactionReport.findOne({
        group: 'recharge',
        subgroup: 'app',
        amount: { $ne: counter }
    });
    if(doc) {
        doc.amount = counter;
        await doc.save();
    }
}
