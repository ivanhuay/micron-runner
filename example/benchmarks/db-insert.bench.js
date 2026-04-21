import mongoose from 'mongoose';
import TransactionReport from '../models/transaction-report.js';

export const name = 'MongoDB insert';

export async function setup() {
    await mongoose.connect('mongodb://localhost:27017/micron-example');
}

export async function teardown() {
    await mongoose.connection.close();
}

export async function bench() {
    const doc = new TransactionReport({ group: 'recharge', subgroup: 'app' });
    await doc.save();
}
